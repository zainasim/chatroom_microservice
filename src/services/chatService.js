class ChatService {
  constructor(redisClient) {
    this.redisClient = redisClient;
  }

  async addUserToChatroom(chatRoomId, userId) {
    await this.redisClient.sadd(`chatroom:${chatRoomId}:active_users`, userId);
  }

  async removeUserFromChatroom(chatRoomId, userId) {
    await this.redisClient.srem(`chatroom:${chatRoomId}:active_users`, userId);
  }

  async getActiveUsers(chatRoomId) {
    return this.redisClient.smembers(`chatroom:${chatRoomId}:active_users`);
  }

  async addMessageToHistory(chatRoomId, message) {
    const key = `chatroom:${chatRoomId}:history`;
    await this.redisClient.lpush(key, JSON.stringify(message));
    await this.redisClient.ltrim(key, 0, 999);
  }

  async getChatHistory(chatRoomId, limit = 50) {
    const key = `chatroom:${chatRoomId}:history`;
    const messages = await this.redisClient.lrange(key, 0, limit - 1);
    return messages.map((msg) => JSON.parse(msg));
  }

  async isUserInChatroom(chatRoomId, userId) {
    const isMember = await this.redisClient.sismember(`chatroom:${chatRoomId}:active_users`, userId);
    return isMember === 1;
  }
}

module.exports = ChatService;
