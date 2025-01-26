const ChatService = require("../../src/services/chatService");
const redisMock = require("../setup/redisMock");

const chatService = new ChatService(redisMock); // Pass the mock Redis client

describe("ChatService", () => {
  const chatRoomId = "room1";
  const userId = "user1";

  beforeEach(async () => {
    await redisMock.flushall(); // Clear mock Redis before each test
  });

  test("addUserToChatroom adds a user to the chatroom", async () => {
    await chatService.addUserToChatroom(chatRoomId, userId);
    const users = await redisMock.smembers(`chatroom:${chatRoomId}:active_users`);
    expect(users).toContain(userId);
  });

  test("removeUserFromChatroom removes a user from the chatroom", async () => {
    await chatService.addUserToChatroom(chatRoomId, userId);
    await chatService.removeUserFromChatroom(chatRoomId, userId);
    const users = await redisMock.smembers(`chatroom:${chatRoomId}:active_users`);
    expect(users).not.toContain(userId);
  });

  test("isUserInChatroom returns true for an existing user", async () => {
    await chatService.addUserToChatroom(chatRoomId, userId);
    const isMember = await chatService.isUserInChatroom(chatRoomId, userId);
    expect(isMember).toBe(true);
  });

  test("addMessageToHistory adds a message to the chat history", async () => {
    const message = { userId, message: "Hello", timestamp: Date.now() };
    await chatService.addMessageToHistory(chatRoomId, message);
    const history = await redisMock.lrange(`chatroom:${chatRoomId}:history`, 0, -1);
    expect(history).toHaveLength(1);
    expect(JSON.parse(history[0])).toEqual(message);
  });

  test("getChatHistory retrieves the last N messages", async () => {
    const message1 = { userId, message: "Hello1", timestamp: Date.now() };
    const message2 = { userId, message: "Hello2", timestamp: Date.now() };

    await chatService.addMessageToHistory(chatRoomId, message1);
    await chatService.addMessageToHistory(chatRoomId, message2);

    const history = await chatService.getChatHistory(chatRoomId, 2);
    expect(history).toEqual([message2, message1]); // Most recent first
  });
});
