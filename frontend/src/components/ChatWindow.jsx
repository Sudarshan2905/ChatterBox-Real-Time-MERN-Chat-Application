import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import Loader from "./Loader";

export default function ChatWindow({
  activeUser,
  messages,
  loading,
  currentUserId,
  isTyping,
  onSend,
  onTyping,
  onStopTyping,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!activeUser) {
    return (
      <div className="chat-window chat-empty-state">
        <div>
          <p className="chat-empty-title">Select a chat to start messaging</p>
          <p className="chat-empty-sub">Your conversations stay in sync in real time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="avatar">
          {activeUser.username.charAt(0).toUpperCase()}
          {activeUser.isOnline && <span className="online-dot" />}
        </div>
        <div>
          <div className="chat-header-name">{activeUser.username}</div>
          <div className="chat-header-status">
            {isTyping ? "Typing..." : activeUser.isOnline ? "Online" : "Offline"}
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {loading ? (
          <Loader fullscreen />
        ) : messages.length === 0 ? (
          <div className="chat-empty-sub" style={{ textAlign: "center", marginTop: 40 }}>
            No messages yet. Say hello 👋
          </div>
        ) : (
          messages.map((m) => (
            <MessageBubble key={m._id} message={m} isOwn={m.sender === currentUserId} />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={onSend} onTyping={onTyping} onStopTyping={onStopTyping} />
    </div>
  );
}
