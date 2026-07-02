import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { getConversationApi } from "../services/chatService";
import { getErrorMessage } from "../utils/getErrorMessage";
import { useToast } from "../context/ToastContext";

export default function Dashboard() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const { showToast } = useToast();

  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});

  const handleSelectUser = async (targetUser) => {
    setActiveUser(targetUser);
    setLoadingMessages(true);
    try {
      const { data } = await getConversationApi(targetUser._id);
      setMessages(data.data.messages);
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setLoadingMessages(false);
    }
  };

  // Listen for incoming real-time messages
  useEffect(() => {
    if (!socket) return;

    const handleIncoming = (msg) => {
      setMessages((prev) => {
        const isDuplicate = prev.some((m) => m._id === msg._id);
        if (isDuplicate) return prev;

        const belongsToActiveChat =
          activeUser &&
          ((msg.sender === activeUser._id && msg.receiver === user._id) ||
            (msg.sender === user._id && msg.receiver === activeUser._id));

        return belongsToActiveChat ? [...prev, msg] : prev;
      });
    };

    const handleTyping = ({ sender }) => setTypingUsers((prev) => ({ ...prev, [sender]: true }));
    const handleStopTyping = ({ sender }) =>
      setTypingUsers((prev) => {
        const next = { ...prev };
        delete next[sender];
        return next;
      });

    socket.on("private_message", handleIncoming);
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);

    return () => {
      socket.off("private_message", handleIncoming);
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
    };
  }, [socket, activeUser, user]);

  const handleSend = useCallback(
    (text) => {
      if (!socket || !activeUser) return;
      socket.emit("private_message", {
        sender: user._id,
        receiver: activeUser._id,
        message: text,
      });
    },
    [socket, activeUser, user]
  );

  const handleTyping = useCallback(() => {
    if (!socket || !activeUser) return;
    socket.emit("typing", { sender: user._id, receiver: activeUser._id });
  }, [socket, activeUser, user]);

  const handleStopTyping = useCallback(() => {
    if (!socket || !activeUser) return;
    socket.emit("stop_typing", { sender: user._id, receiver: activeUser._id });
  }, [socket, activeUser, user]);

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-body">
        <Sidebar activeUserId={activeUser?._id} onSelectUser={handleSelectUser} />
        <ChatWindow
          activeUser={activeUser}
          messages={messages}
          loading={loadingMessages}
          currentUserId={user._id}
          isTyping={!!typingUsers[activeUser?._id]}
          onSend={handleSend}
          onTyping={handleTyping}
          onStopTyping={handleStopTyping}
        />
      </div>
    </div>
  );
}
