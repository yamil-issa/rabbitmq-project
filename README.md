# Chat Application

This project is a chat application that allows users to join a chat room, send messages, and interact in real-time.

# Configuration
- start rabbitmq on docker: `docker compose up --build`
- to start the front: `cd front`,  `npm install`
- to start the front: `cd back`,  `npm install`


# Run
- to start the front: `cd front`,  `npm start`
- to start the back: `cd back`,  `npm start`
- You see access the app here : `localhost:5173`

# Chat Application Architecture

## Components

### Express Application
- **Description:** The main entry point that configures and initializes all necessary services and routers.
- **Files:** `express-application.ts`

### Express Server
- **Description:** Manages HTTP server using `express` .
- **Files:** `express-server.ts`

### Chat Room JSON Service
- **Description:** Handles chat-related operations, manages messages, and integrates with RabbitMQ for message queuing.
- **Files:** `chatRoom.json-service.ts`

### User JSON Service
- **Description:** Manages user-related operations and provides user data.
- **Files:** `user.json-service.ts`

### Chat Room Controller
- **Description:** Serves as a middle layer between routes and services, handling HTTP requests and responses for chat operations.
- **Files:** `chatRoom.controller.ts`

### Express Router
- **Description:** Defines routes and maps them to corresponding controllers.
- **Files:** `express-router.ts`

## Message Flow with RabbitMQ

### Message Sending:
1. **Client sends a message via an HTTP POST request to the server.**
   - Route: `/api/chat/sendMessage`
   - Handled by: `ChatRoomController` which invokes `sendMessage` method of `ChatRoomJsonService`.
2. **`ChatRoomJsonService` publishes the message to a RabbitMQ exchange named `chat-exchange`.**
   - Exchange: `chat-exchange`
   - Queue: `chat-messages`
3. **RabbitMQ routes the message to the `chat-messages` queue.**

### Message Receiving:
1. **`ChatRoomJsonService` sets up a consumer to listen to messages from the `chat-messages` queue.**
   - Consumes messages from: `chat-messages` queue
2. **When a message is received from the queue, it is pushed to an in-memory array `messages`.**

## Code Structure

- **ExpressApplication:** Configures and initializes the environment, services, server, and router.
- **ExpressServer:** Sets up the HTTP server, WebSocket server, body parser, CORS, and routes.
- **ChatRoomJsonService:** Manages message sending and receiving through RabbitMQ, formats timestamps.
- **ChatRoomController:** Handles HTTP requests for sending and retrieving messages.
- **ExpressRouter:** Defines API endpoints and maps them to controller methods.

## Example Flow

### Client Sends a Message:
1. **Client sends a POST request with a message to `/api/chat/sendMessage`.**
2. **`ChatRoomController` processes the request and calls `sendMessage` in `ChatRoomJsonService`.**
3. **The service publishes the message to RabbitMQ **

### Client Receives Messages:
1. **The `ChatRoomJsonService` consumes messages from the RabbitMQ queue.**
2. **Messages are stored in an in-memory array and can be retrieved with the endpoint `/api/chat/get-messages`.**

