import MessageBubble from "./MessageBubble";
import { useState, useContext, useRef, useEffect} from "react";
import { AuthContext } from "../context/authContext";
import { useChat } from "../hooks/useChat";

export default function ChatWindow({ activeChat, user }) {
    const [input, setInput] = useState("");
    const { logout } = useContext(AuthContext);
    const chatRef = useRef(null);

    const { messages, sendMessage, status, Typing, conversationId } = useChat(
        user.id,
        activeChat.receiver_id,
        activeChat?.conversation_id 
    );

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
                    <p className="text-sm text-gray-400">{status}</p>
                    {/* Todo: show realtime updates for online/last seen  */}
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
