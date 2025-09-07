import { useEffect, useState, useCallback, useRef } from "react";
import { getSocket } from "../services/socket";

export const useChat = (senderId, receiverId, initialConversationId = null) => {
    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState("");
    const [conversationId, setConversationId] = useState(initialConversationId);
    const [tempRoom, setTempRoom] = useState(null);

    const typingTimerRef = useRef(null);

    // Listen for incoming messages
    useEffect(() => {
        // console.log("useChat called with:", senderId, receiverId, initialConversationId);
        setConversationId(initialConversationId);
        const socket = getSocket();
        if (!socket || !senderId || !receiverId) return;

        if (conversationId) {
            // Join this conversation room with its id
            socket.emit("join_room", { conversationId, senderId });
        } else {
            // Join the room with temporary id
            socket.emit("join_room", { senderId, receiverId });
        }

        // Listen for temp room join
        socket.on("joinedTempRoom", ({ tempRoom }) => {
            // console.log(tempRoom);
            setTempRoom(tempRoom);
        });
        // Listen for history of messages-------------
        socket.on("conversation_history", (history) => {
            setMessages(history);
        });

        // Listen for new conversation creation------------
        socket.on("conversation_created", ({ conversationId }) => {
            setConversationId(conversationId);
        });

        // Listen for new incoming messages----------
        socket.on("receive_message", ({newMessage}) => {
            console.log("received a message: ", newMessage.message_text);
            setMessages((prev) => [...prev, newMessage]);
        });

        // Listen for Typing events------------------------------
        socket.on("isTyping",  ({senderId}) => {
            // console.log(`user ${senderId} is typing`);
            setStatus("Typing...");
        });

        socket.on("user_stopped_typing",  ({senderId}) => {
            // console.log("user stopped typing");
            setStatus("");
        });


        // Cleanup when leaving conversation
        return () => {
            if (conversationId) {
                socket.emit("leave_room", { conversationId });
            } else if (tempRoom) {
                socket.emit("leave_room", { tempRoom });
            }
            setConversationId(null);
            socket.off("conversation_history");
            socket.off("receive_message");
            socket.off("conversation_created");
            socket.off("joinedTempRoom");
            socket.off("isTyping");
            socket.off("user_stopped_typing");
        };
    }, [senderId, receiverId, conversationId]);

    // Send a message----------------------------------
    const sendMessage = useCallback(
        (message) => {
            const socket = getSocket();
            if (!socket) return;

            // setMessages( (prev) =>
            //     [...prev,
            //         {

            //           id: prev.length + 1,
            //           message_text: message,
            //           sender_id: senderId, 
            //           receiver_id: receiverId  
            //         }
            // ])

            if (conversationId) {
                socket.emit("send_message", {
                    conversationId,
                    senderId,
                    receiverId,
                    message
                });
            } else {
                socket.emit("send_message", {
                    senderId,
                    receiverId,
                    message
                });
            }
        },
        [conversationId]
    );
//  Send typing events ---------------------------------
    const Typing = useCallback( () => {
        const socket = getSocket();
        if (!socket || !conversationId) return;

        socket.emit("Typing", {conversationId, senderId});

        if(typingTimerRef.current) {
            clearTimeout(typingTimerRef.current);
        }

        typingTimerRef.current = setTimeout( () => {
            socket.emit("typing_stopped", {conversationId, senderId} );
        }, 1000 )

    }, [conversationId, senderId]);

    return { messages, sendMessage, status, Typing, conversationId };
};
