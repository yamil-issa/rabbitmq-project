<template>
  <div class="chat-view">
    <h1 class="chat-room-title">Chat Room</h1>
    <p id="appMessage">{{ appMeesage }}</p>
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
    return {
      messages: [],
      newMessage: '',
      username: '',
      appMeesage: '',
    };
  },
  
    mounted() {
      // Fetch initial messages when component is mounted
      this.getMessages();
      this.username = this.$route.query.pseudo;

      this.fetchInterval = setInterval(this.getMessages, 2000);
    },

    beforeDestroy() {
    clearInterval(this.fetchInterval);
  },


    methods: {
    async sendMessage() {
      try {
        const endpoint = `http://localhost:9000/api/chat-room/send-message`;
        console.log('Sending message:', this.newMessage);
        console.log('Username:', this.username);

        // Call the backend API to add the message to the chat room
        const response = await axios.post(endpoint, {
          username: this.username,
          message: this.newMessage,
        });

        // Update messages with the new message
        this.messages.push(response.data);

        // Clear the newMessage input field
        this.newMessage = '';
      } catch (error) {
        console.error(error);
        this.appMeesage = error.response.data.error;
      }
    },
    async getMessages() {
      try {
        const endpoint = `http://localhost:9000/api/chat-room/get-messages`;
        const response = await axios.get(endpoint);
        // Update messages with the fetched messages
        this.messages = response.data;
      } catch (error) {
        console.error('Error fetching messages:', error);
        this.appMeesage = "Error fetching messages";
      }
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
#appMessage {
  color: red;
  text-align: center;
}
</style>
