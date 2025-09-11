import MessageBubble from "./MessageBubble";
import { useState, useContext, useRef, useEffect, act } from "react";
import { AuthContext } from "../context/authContext";
import { useChat } from "../hooks/useChat";
import { formatDistanceToNow } from "date-fns";

export default function ChatWindow({ activeChat, setActiveChat, user, onlineUsers }) {
    const [input, setInput] = useState("");
    const [presence, setPresence] = useState("");
    const { logout, chats } = useContext(AuthContext);
    const chatRef = useRef(null);

    const { messages, sendMessage, isTyping, Typing, conversationId } = useChat(
        user.id,
        activeChat.receiver_id,
        activeChat?.conversation_id
    );

    // To format date string
    function getFormattedDate(dateString) {
        const date = new Date(dateString);
        const friendlyDate = formatDistanceToNow(date, { addSuffix: true });
        console.log(friendlyDate);
        return friendlyDate;
    }
    // Online status update
    useEffect(() => {
        if (onlineUsers.includes(activeChat.receiver_id)) {
            setPresence("Online");
        } else {
            setPresence(null);
        }
    }, [onlineUsers, activeChat.receiver_id]);

    // last seen update; 
    useEffect(() => {
        if (activeChat?.receiver_id) {
            const updatedChat = chats.find(
                (chat) => chat.receiver_id === activeChat.receiver_id
            );
            if (updatedChat && updatedChat.last_seen !== activeChat.last_seen) {
                setActiveChat(updatedChat);
            }
        }
    }, [chats]);



    const handleChange = (e) => {
        setInput(e.target.value);
        Typing(); // Typing events handler
    };

    const handleKeydown = (e) => {
        if (e.key === "Enter") handleSend();
    };

    const handleSend = () => {
        if (!input.trim()) return;
        sendMessage(input);
        setInput("");
    };
    // To auto scroll to the latest message.
    useEffect(() => {
        chatRef.current?.scrollIntoView({ behaviour: "smooth" });
    }, [messages]);

    return (
        <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="navbar bg-base-100 border-b px-4 flex justify-between items-center">
                <div>
                    <h2 className="font-bold text-lg">
                        {activeChat.receiver_username}
                    </h2>
                    {isTyping ? (
                        <p className="text-sm text-green-400">{isTyping}</p>
                    ) : presence ? (
                        <p className="text-sm text-green-400">{presence}</p>
                    ) : (
                        <p className="text-sm text-gray-400">{`Last seen ${getFormattedDate(activeChat.last_seen)}`}</p>
                    )}
                </div>

                {/* user profile button */}
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle">
                        ⋮
                    </label>
                    <ul
                        tabIndex={0}
                        className="menu dropdown-content bg-base-100 rounded-box w-40 mt-3 shadow"
                    >
                        <li>
                            <button onClick={logout}>Logout</button>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-base-200">
                {messages.map((msg) => (
                    <MessageBubble
                        key={msg.id}
                        text={msg.message_text}
                        sender={msg.sender_id}
                        currentUser={user.id}
                    />
                ))}
                <div ref={chatRef} />
            </div>

            {/* Input Area*/}
            <div className="p-3 border-t bg-base-100 flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={handleChange}
                    onKeyDown={handleKeydown}
                    placeholder="Type a message......."
                    className="input input-bordered flex-1"
                />
                {/* Send button */}
                <button onClick={handleSend} className="btn btn-primary">
                    Send
                </button>
            </div>
        </div>
    );
}
