const { setupWebSocket } = require("../../src/websocket/websocket");
const ChatService = require("../../src/services/chatService");
const redisMock = require("../setup/redisMock");
const WebSocket = require("ws");
const http = require("http");

const chatService = new ChatService(redisMock);

describe("WebSocket Event Handling", () => {
  let server, wss;

  beforeAll((done) => {
    server = http.createServer();
    wss = setupWebSocket(server, chatService); // Inject mocked ChatService
    server.listen(3001, done);
  });

  afterAll((done) => {
    wss.close();
    server.close(done);
  });

  test("User can join a chatroom", (done) => {
    const ws = new WebSocket("ws://localhost:3001/room1");

    ws.on("open", () => {
      ws.send(
        JSON.stringify({
          eventType: "join",
          chatRoomId: "room1",
          userId: "user1",
        })
      );
    });

    ws.on("message", async (message) => {
      const event = JSON.parse(message);
      expect(event.eventType).toBe("join");
      expect(event.userId).toBe("user1");

      const users = await chatService.getActiveUsers("room1");
      expect(users).toContain("user1");

      ws.close();
      done();
    });
  });

  test("User cannot send messages without joining", (done) => {
    const ws = new WebSocket("ws://localhost:3001/room1");

    ws.on("open", () => {
      ws.send(
        JSON.stringify({
          eventType: "message",
          chatRoomId: "room1",
          userId: "user2",
          message: "Hello",
        })
      );
    });

    ws.on("message", (message) => {
      const event = JSON.parse(message);
      expect(event.error).toBe("You must join the room before sending messages.");
      ws.close();
      done();
    });
  });
});
