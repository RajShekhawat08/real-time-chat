const verifySocketToken = require("./middlewares/verifySocketToken");
const { saveMessage } = require("./Models/message.model");
const { getConversationHistory, isConversation, createConversation} = require("./Models/conversation.model");

module.exports = function socketEventHandlers(io) {
    io.use(verifySocketToken);

    // listen for connections------------
    io.on("connection", (socket) => {
        console.log("A user connected: ", socket.user.userId);

        const users = [];
        for (let [id, socket] of io.of("/").sockets) {
            users.push({
                userID: socket.user.userId,
                username: socket.user.username,
            });
        }
        socket.emit("users", users);

        // notify existing users about new connection
        socket.broadcast.emit("A user connected", {
            userID: socket.user.userId,
            username: socket.user.username,
        });

        // listen for join room------------------------------------------------------
        socket.on("join_room", async (data) => {

            try {
                const { conversationId, senderId, receiverId } = data;
                console.log(data);

                if (conversationId) {
                    socket.join(conversationId.toString());
                    console.log(`User ${senderId} joined existing room ${conversationId}`);

                    // Send convers. history if exists
                    const converHistory = await getConversationHistory(conversationId);
                    // console.log(converHistory);
                    socket.emit("conversation_history", converHistory);
                
                    return;
                }

                if (senderId && receiverId) {
                    // Create a temp deterministic room id
                    const tempRoom = "room:" + [senderId, receiverId].sort().join("_");
                    console.log(tempRoom);
                    socket.join(tempRoom);
                    socket.emit("joinedTempRoom", {tempRoom});
                    return;
                }
                
            } catch (error) {
                console.error("Error in join_room: ", error);
                socket.emit("eventError", {errorEvent: "join_room", message: error.message})
            } 
            // Todo: Make a wrapper func. for event errors and don't send error object in production
        });

        //listen Leave  room
        socket.on("leave_room", ({ conversationId, tempRoom }) => {
            if(conversationId) {
                socket.leave(conversationId);
                // console.log("A user left room: ", conversationId)
            } else {
                socket.leave(tempRoom);
                // console.log("A user left room: ", tempRoom)
            }
            
        });


        // listen for send message-----------------------------------------------
        socket.on("send_message", async ({ conversationId, senderId, receiverId, message}) => {
            try {

                let finalConverId = conversationId;
                //check if conver exists
                if(!conversationId){
                    // check in db
                    const converId = await isConversation(senderId, receiverId)

                    if(converId){
                        finalConverId = converId;
                    }
                    else{
                        // If no conver. -> create new and add participants
                        finalConverId = await createConversation(senderId, receiverId);
                    }
                }
                // save message to db
                const newMessage = await saveMessage(message, senderId, finalConverId);

                // emit to room 
                io.to(finalConverId.toString()).emit("receive_message", {newMessage});

                // send back id of newly created conver 
                if(!conversationId){
                    socket.emit("conversation_created", {conversationId: finalConverId});

                }
                
            } catch (error) {
                console.error("Error in send_message: ", error);
                socket.emit("eventError", {errorEvent: "send_message", message: error.message}) 
            }
        });

        // Typing events -----------
        socket.on("Typing", ({conversationId, senderId}) => {
            // console.log(`user ${senderId} started typing.`);
            socket.to(conversationId.toString()).emit("isTyping", {senderId});
        })

        socket.on("typing_stopped", ({conversationId, senderId}) => {
            socket.to(conversationId.toString()).emit("user_stopped_typing", {senderId});
        })


        // On user disconnect
        socket.on("disconnect", () => {
            console.log("A user disconnected:", socket.user.userId);
            // notify existing users about a user disconnect
            socket.broadcast.emit("A user disconnected", {
                userID: socket.user.userId,
            });
        });
    });
};
