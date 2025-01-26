const express = require("express");
const activeUsersController = require("../controllers/activeUsersController");
const chatHistoryController = require("../controllers/chatHistoryController");

const router = express.Router();

router.get("/active-users/:chatRoomId", activeUsersController.getActiveUsers);
router.get("/chat-history/:chatRoomId", chatHistoryController.getChatHistory);

module.exports = router;
