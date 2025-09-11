import { useState, useEffect} from "react";
import { getSocket } from "../services/socket";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";



export function usePresence(){
    const {user, setChats} = useContext(AuthContext);
    const [onlineUsers, setOnlineUsers] = useState([]);  // Store online user IDs

     useEffect( () => {
        console.log("usePresence is called;")
        const socket = getSocket();
        if(!socket || !user?.id) return;
        console.log("usePresence is being executed;")

        const handleConnect = () => {

            socket.on("presence", ({userId, status, last_seen}) => {
                console.log(`user ${userId} is ${status}.`);

                setOnlineUsers( prev => {
                    if(status === "Online" &&  !prev.includes(userId)){
                        return [...prev, userId];
                    }

                    if(status === "Offline"){
                        // remove disconneted user from list
                        return prev.filter((id) => id !== userId);
                    }
                    return prev;
                })

                if(last_seen){
                    // update last seen in chats context
                        setTimeout( () => {
                            setChats((prevchats) => prevchats.map((chat) => chat.receiver_id === userId ? {...chat, last_seen} : chat));
                            console.log(`last seen of user ${userId} is updated`)
                        }, 0)
                }       
            });

            socket.on("online_users", ({related_online_users}) => {
                const online_users = related_online_users.map(element => element.related_user);  
                console.log("List of online users: ", online_users);
                setOnlineUsers(online_users);
            });

        }

        if(socket.connected) {
            handleConnect()
        } else {
            socket.on("connect", handleConnect);
        }


        return () => {
            socket.off('connect', handleConnect);
            socket.off('presence');
            socket.off('online_users');
        };

    }, [user?.id])

    return onlineUsers;

}