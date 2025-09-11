import { useState, useContext, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { AuthContext } from "../context/authContext";
import { useFetchUser } from "../hooks/useFetchUser";
import { usePresence } from "../hooks/usePresence";

export default function Home() {
    const [activeChat, setActiveChat] = useState(null);
    const loading = useFetchUser();
    const onlineUsers = usePresence();
    const {user} = useContext(AuthContext);



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
                        onlineUsers={onlineUsers}
                    />
                    {activeChat && user ? (
                        <ChatWindow activeChat={activeChat} setActiveChat={setActiveChat} user={user} onlineUsers={onlineUsers} />
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
