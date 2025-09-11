export default function ChatListItem({ chat, isOnline, active, onClick }) {
    const message_time = chat.created_at;

    return (
        <li
            onClick={onClick}
            className={`p-3 rounded-lg cursor-pointer hover:bg-base-300 ${
                active ? "bg-base-300" : ""
            }`}
        >
            <p className="font-semibold">{chat?.receiver_username || chat.username}</p>
            {isOnline && (
                <div className="inline-grid *:[grid-area:1/1]">
                    <div className="status status-success animate-ping"></div>
                    <div className="status status-success"></div>
                </div>
            )}
            <div className="flex justify-between items-center text-gray-400">
                <p className="text-base">{chat?.last_message}</p>
                <p className="text-sm">{message_time?.split("T")[0]}</p>
            </div>
        </li>
    ); 
}

// todo: show last message
