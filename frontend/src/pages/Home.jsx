import { useState, useContext, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { getSocket } from "../services/socket";
import { AuthContext } from "../context/authContext";
import { useFetchUser } from "../hooks/useFetchUser";

export default function Home() {
    const [activeChat, setActiveChat] = useState(null);
    const loading = useFetchUser();

    const { user, chats } = useContext(AuthContext);

    // Todo: In chat list get user data from backend
    // const chatList = [];

    // const [onlineUsers, setOnlineUsers] = useState([]);

    // // useEffect to get online users list from backend-------------------------- Todo: don't show all online users
    // useEffect(() => {
    //     const socket = getSocket();
    //     // Listen for full user list when connecting
    //     socket.on("users", (users) => {
    //         setOnlineUsers(users);
    //     });

    //     // Listen for single new user
    //     socket.on("A user connected", (newUser) => {
    //         setOnlineUsers((prevUsers) => {
    //             // avoid duplicates
    //             if (prevUsers.some((u) => u.userID === newUser.userID)) {
    //                 return prevUsers;
    //             }
    //             return [...prevUsers, newUser];
    //         });
    //     });

    //     //disconnect listener
    //     socket.on("A user disconnected", ({ userID }) => {
    //         setOnlineUsers((prev) => prev.filter((u) => u.userID !== userID));
    //     });

    //     // cleanup on unmount
    //     return () => {
    //         socket.off("users");
    //         socket.off("A user connected");
    //         socket.off("A user disconnected");
    //     };
    // }, []);

    return (
        <>
            {loading ? (
                <div className="flex h-screen items-center justify-center">
                    <span className="loading loading-ring loading-xs"></span>
                    <span className="loading loading-ring loading-sm"></span>
                    <span className="loading loading-ring loading-md"></span>
                    <span className="loading loading-ring loading-lg"></span>
                    <span className="loading loading-ring loading-xl"></span>
                </div>
            ) : (
                <div className="flex h-screen">
                    <Sidebar
                        // chatList={chats}
                        activeChat={activeChat}
                        setActiveChat={setActiveChat}
                    />
                    {activeChat && user ? (
                        <ChatWindow activeChat={activeChat} user={user} />
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400">
                            <p>Select a chat to start messaging</p>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
