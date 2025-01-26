const ChatService = require("../services/chatService");
const redisClient = require("../config/redis");
const { AppError } = require("../utils/errorHandler");

const chatService = new ChatService(redisClient);

exports.getActiveUsers = async (req, res, next) => {
  try {
    const { chatRoomId } = req.params;
    const users = await chatService.getActiveUsers(chatRoomId);

    if (users.length === 0) {
      throw new AppError("Chatroom with this ID does not exist", 404);
    }

    res.status(200).json({ activeUsers: users });
  } catch (err) {
    next(err);
  }
};
