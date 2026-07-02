import { useRef, useState } from "react";

export default function MessageInput({ onSend, onTyping, onStopTyping }) {
  const [text, setText] = useState("");
  const typingTimeout = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);
    onTyping?.();
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => onStopTyping?.(), 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
    clearTimeout(typingTimeout.current);
    onStopTyping?.();
  };

  return (
    <form className="message-input-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        className="message-input"
        placeholder="Type a message"
        value={text}
        onChange={handleChange}
        autoComplete="off"
      />
      <button type="submit" className="send-btn" disabled={!text.trim()} aria-label="Send message">
        ➤
      </button>
    </form>
  );
}
