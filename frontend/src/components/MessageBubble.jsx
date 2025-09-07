
export default function MessageBubble({ text, sender, currentUser }) {
  const isMine = sender === currentUser;

  return (
    <div className={`chat ${isMine ? "chat-end" : "chat-start"}`}>
      <div className={`chat-bubble ${isMine ? "chat-bubble-primary" : ""}`}>
        {text}
      </div>
    </div>
  );
  
}
