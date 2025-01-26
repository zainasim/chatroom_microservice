require("dotenv").config();
const http = require("http");
const app = require("./src/app");
const { setupWebSocket } = require("./src/websocket/websocket");
const ChatService = require("./src/services/chatService");
const redisClient = require("./src/config/redis");

const PORT = process.env.PORT || 3000;
const chatService = new ChatService(redisClient);
const server = http.createServer(app);
setupWebSocket(server, chatService);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
