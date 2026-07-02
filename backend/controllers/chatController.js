const Message = require("../models/Message");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// @desc   Get conversation between logged-in user and :userId
// @route  GET /api/chat/:userId
exports.getConversation = async (req, res, next) => {
  try {
    const myId = req.session.userId;
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: userId },
        { sender: userId, receiver: myId },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json(new ApiResponse(200, { messages }));
  } catch (error) {
    next(error);
  }
};

// @desc   Send a message (REST fallback; primary path is via socket)
// @route  POST /api/chat/send
exports.sendMessage = async (req, res, next) => {
  try {
    const sender = req.session.userId;
    const { receiver, message } = req.body;

    if (!receiver || !message || !message.trim()) {
      throw new ApiError(400, "Receiver and message are required");
    }

    const newMessage = await Message.create({ sender, receiver, message: message.trim() });

    return res.status(201).json(new ApiResponse(201, { message: newMessage }, "Message sent"));
  } catch (error) {
    next(error);
  }
};
