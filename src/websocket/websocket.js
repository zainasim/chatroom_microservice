const WebSocket = require("ws");

const clients = {};

function setupWebSocket(server, chatService) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws, req) => {
    const chatRoomId = req.url.split("/").pop();
    if (!clients[chatRoomId]) clients[chatRoomId] = [];
    clients[chatRoomId].push(ws);

    // Handle incoming messages
    ws.on("message", async (data) => {
      try {
        const event = JSON.parse(data);

        // Handle join event
        if (event.eventType === "join") {
          const isMember = await chatService.isUserInChatroom(event.chatRoomId, event.userId);
          if (isMember) {
            ws.send(
              JSON.stringify({
                warning: "You are already part of this chatroom.",
              })
            );
            return;
          }
          
          await chatService.addUserToChatroom(event.chatRoomId, event.userId);
          broadcast(chatRoomId, event);

          if (event.message) {
            await chatService.addMessageToHistory(event.chatRoomId, {
              userId: event.userId,
              message: event.message,
              timestamp: event.timestamp,
            });
          }
        }

        // Handle message event
        if (event.eventType === "message") {
          const isMember = await chatService.isUserInChatroom(event.chatRoomId, event.userId);
          if (!isMember) {
            ws.send(
              JSON.stringify({
                error: "You must join the room before sending messages.",
              })
            );
            return;
          }

          await chatService.addMessageToHistory(event.chatRoomId, {
            userId: event.userId,
            message: event.message,
            timestamp: event.timestamp,
          });
          broadcast(chatRoomId, event);
        }

        // Handle leave event
        if (event.eventType === "leave") {
          const isMember = await chatService.isUserInChatroom(event.chatRoomId, event.userId);
          if (!isMember) {
            ws.send(
              JSON.stringify({
                error: "You cannot leave a room you are not part of.",
              })
            );
            return;
          }

          await chatService.removeUserFromChatroom(event.chatRoomId, event.userId);
          broadcast(chatRoomId, {
            eventType: "leave",
            userId: event.userId,
            timestamp: event.timestamp,
          });
        }
      } catch (err) {
        console.error("Error handling WebSocket message:", err);
        ws.send(JSON.stringify({ error: "An error occurred while processing your request." }));
      }
    });

    ws.on("close", () => {
      clients[chatRoomId] = clients[chatRoomId].filter((client) => client !== ws);
    });
  });

  return wss;
}

function broadcast(chatRoomId, event) {
  if (clients[chatRoomId]) {
    clients[chatRoomId].forEach((ws) => ws.send(JSON.stringify(event)));
  }
}

module.exports = { setupWebSocket };
