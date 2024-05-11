<template>
    <div class="chat-view">
      <h1 class="chat-room-title">Chat Room</h1>
      <div class="message-container">
        <!-- Display messages here -->
        <div v-for="message in messages" :key="message.timestamp" class="message">
          <p class="username">{{ message.username }}:</p>
          <span class="content">{{ message.message }}</span>
          <p class="time">({{ message.date }})</p>
        </div>
      </div>
      <div class="input-container">
        <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type your message..." />
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';

  export default {
    data() {
     
    },
    

        

    methods: {
      sendMessage() {
        const endpoint = `http://localhost:9000/api/chat-room/${this.chatRoom.id}/send-message`;
        console.log('Sending message:', this.newMessage);
  
        // call the backend API to add the message to the chat room
        axios.post(endpoint, {
          userId: this.userId,
          message: this.newMessage,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
            // Update the chatRoom.messages array with the new message
            axios.get(`http://localhost:9000/api/chat-room/${this.chatRoom.id}`).then((response) => {
            const data = response.data || {};
            // Update the chatRoom data with the fetched details
            this.chatRoom = {
              id: data.id,
              chatRoomName: data.chatRoomName,
              participants: data.participants || [],
              messages: data.messages || [],
            };
            this.messages = this.chatRoom.messages;
            // Clear the newMessage
            this.newMessage = '';
            
          });
            console.log('Message added successfully:', response.data);
          })
          .catch((error) => {
            console.error('Error adding message:', error);
          });
      },


      fetchLatestMessages() {
        axios.get(`http://localhost:9000/api/chat-room/${this.chatRoom.id}`).then((response) => {
          const data = response.data || {};
          // Update the chatRoom data with the fetched details
          this.chatRoom = {
            id: data.id,
            chatRoomName: data.chatRoomName,
            participants: data.participants || [],
            messages: data.messages || [],
          };
          this.messages = this.chatRoom.messages;
        });
      },
  },
};
  </script>
  
  <style scoped>
  /* Add your styles here to make it visually appealing */
  .chat-view {
    display: flex;
    flex-direction: column;
    height: 100%;
    border: 2px solid #4C64DC;
  }

  .chat-room-title {
  background-color: #4C64DC;
  color: white;
  padding: 10px;
  text-align: center;
  margin: 0;
}
  
  .message-container {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
  }
  
  .message {
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
  }
  
  .time {
    margin-right: 5px;
    font-size: smaller;
    color: grey;
  }
  
  .input-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #333;
    color: white;
  }
  
  input {
    flex: 1;
    margin-right: 10px;
    padding: 8px;
  }
  
  button {
    padding: 8px;
    background-color: #4caf50;
    color: white;
    border: none;
    cursor: pointer;
  }
  </style>
  
