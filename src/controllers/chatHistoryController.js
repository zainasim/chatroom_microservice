const ChatService = require("../services/chatService");
const redisClient = require("../config/redis");
const { AppError } = require("../utils/errorHandler");

const chatService = new ChatService(redisClient);

exports.getChatHistory = async (req, res, next) => {
  try {
    const { chatRoomId } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const history = await chatService.getChatHistory(chatRoomId, limit);

    if (history.length === 0) {
      throw new AppError("Chatroom not found", 404);
    }

    res.status(200).json({ chatHistory: history });
  } catch (err) {
    next(err);
  }
};
