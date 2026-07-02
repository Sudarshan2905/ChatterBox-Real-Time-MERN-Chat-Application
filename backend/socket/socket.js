const { Server } = require("socket.io");
const Message = require("../models/Message");

// userId -> socketId
const onlineUsers = new Map();

let ioInstance = null;

function getOnlineUserIds() {
  return Array.from(onlineUsers.keys());
}

function initSocket(server, sessionMiddleware) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  ioInstance = io;

  // Share express-session with socket.io so we know who is connecting
  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });

  io.on("connection", (socket) => {
    const session = socket.request.session;

    // "join" event: client explicitly registers its userId after login
    socket.on("join", (userId) => {
      if (!userId) return;
      socket.userId = userId;
      onlineUsers.set(userId.toString(), socket.id);
      socket.join(userId.toString());
      io.emit("online_users", getOnlineUserIds());
    });

    // Auto-join if session already has userId (e.g. page refresh)
    if (session && session.userId) {
      socket.userId = session.userId.toString();
      onlineUsers.set(socket.userId, socket.id);
      socket.join(socket.userId);
      io.emit("online_users", getOnlineUserIds());
    }

    socket.on("private_message", async ({ sender, receiver, message }) => {
      try {
        if (!sender || !receiver || !message || !message.trim()) return;

        const saved = await Message.create({
          sender,
          receiver,
          message: message.trim(),
        });

        io.to(receiver.toString()).emit("private_message", saved);
        io.to(sender.toString()).emit("private_message", saved);
      } catch (err) {
        socket.emit("error_message", { message: "Failed to send message" });
      }
    });

    socket.on("typing", ({ sender, receiver }) => {
      if (!receiver) return;
      io.to(receiver.toString()).emit("typing", { sender });
    });

    socket.on("stop_typing", ({ sender, receiver }) => {
      if (!receiver) return;
      io.to(receiver.toString()).emit("stop_typing", { sender });
    });

    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit("online_users", getOnlineUserIds());
      }
    });
  });

  return io;
}

function getIO() {
  return ioInstance;
}

module.exports = { initSocket, getOnlineUserIds, getIO };
