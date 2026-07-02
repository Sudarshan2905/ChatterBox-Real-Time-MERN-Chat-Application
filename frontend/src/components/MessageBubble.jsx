function formatTime(dateStr) {
  const date = new Date(dateStr);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

export default function MessageBubble({ message, isOwn }) {
  return (
    <div className={`message-row ${isOwn ? "message-row-own" : ""}`}>
      <div className={`message-bubble ${isOwn ? "message-bubble-own" : "message-bubble-other"}`}>
        <span className="message-text">{message.message}</span>
        <span className="message-time">{formatTime(message.createdAt)}</span>
      </div>
    </div>
  );
}
