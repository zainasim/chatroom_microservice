# Overview
The Chatroom Microservice enables real-time communication between users in multiple chatrooms. It supports WebSocket-based communication for live interactions and RESTful endpoints to fetch chatroom data such as active users and chat history.

This guide provides setup instructions and usage details to help you integrate and interact with the service.

# Features
**Real-Time Messaging**: Connect to chatrooms via WebSocket for live interactions.
**Multiple Connections**: Support for multiple WebSocket connections per chatroom.
**Access Control**: Messages can only be sent to a room after joining it.
**RESTful Endpoints**: Fetch active users and chat history in any chatroom

1) Clone Repo
```bash
git clone https://github.com/zainasim/chatroom_microservice.git
```
cd chatroom_microservice

2) Start Application
```bash
 docker-compose up
```

3) Connect to the WebSocket server using the following URL:
```bash
 ws://localhost:3000/{roomId}
```
Replace {roomId} with the desired chatroom ID.

# WebSocket Payload Structure
Send messages in the following JSON format:
```bash
{
  "eventType": "join | message | leave", // Specify the event type
  "userId": "user1",                     // Unique identifier for the user
  "chatRoomId": "room3",                 // Chatroom ID
  "message": "How are you guys?",        // Message text (optional for "join" and "leave")
  "timestamp": "2025-01-01T12:00:00Z"    // ISO 8601 format timestamp
}
```

# Notes:
Multiple connections can be created using the same WebSocket URL, but the chatRoomId must match to receive messages from other users in the room.
Users must join a chatroom before sending messages.
Messages sent to a chatroom are only received by users who have joined that room.

# REST API Endpoints
1. Fetch Active Users in a Chatroom
Retrieve a list of all active users in a specific chatroom.

EndPoint: 
```bash
GET http://localhost:3000/api/active-users/{roomId}
```
{roomId}: The ID of the chatroom.

2. Fetch Chat History for a Chatroom
Retrieve the chat history for a specific chatroom, with an optional limit on the number of messages.

Endpoint:
```bash
GET http://localhost:3000/api/chat-history/{roomId}?limit=70
```
Query Parameter:
limit (optional): The maximum number of messages to retrieve. Defaults to 50 if not provided.


# To Test
In order to run test cases
1. Run command 
```bash
docker-compose up redis
```
to start redis service only
**Note** 
If this not works then run 
```bash
docker-compose up
```
to start all service
2. Run command 
```bash
npx jest
```