<template>
    <div class="chat-view">
      <h1 class="chat-room-title">{{ chatRoom.chatRoomName }}</h1>
      <!-- Display delete button for admin -->
    <!-- <button v-if="isAdmin" @click="deleteChatRoom">Delete Chat Room</button>-->
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
        messages: [], // Array to store messages
        newMessage: '', // Variable to store the new message input
        userId: '', // Variable to store the user ID
        chatRoom: [], // Variable to store the chat room details
        isAdmin: false, // Variable to check if the user is the admin
        pseudo: '', // Variable to store the user pseudo
      };
    },
    
    mounted() {

    // Retrieve user Id from query parameters
    this.userId = Number(this.$route.query.userId);
    // Retrieve chat room Id from query parameters
    const chatRoomId = this.$route.query.chatRoomId;

    // Retrieve username with the user Id
    axios.get(`http://localhost:9000/api/user/${this.userId}`).then((response) => {
      const data = response.data || {};
      this.pseudo = data.username;
    });
        
    this.fetchLatestMessages();
    setInterval(this.fetchLatestMessages, 1000);
    axios.get(`http://localhost:9000/api/chat-room/${chatRoomId}`).then((response) => {
        const data = response.data || {};
        // Update the chatRoom data with the fetched details
        this.chatRoom = {
          id: data.id,
          adminId: data.adminId,
          chatRoomName: data.chatRoomName,
          participants: data.participants || [],
          messages: data.messages || [],
        };
        // Check if the user is the admin
        this.isAdmin = this.chatRoom.adminId === this.userId;
        
        this.messages = this.chatRoom.messages;
      });
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

      deleteChatRoom() {
        // Check if the user is the admin
        if (this.isAdmin) {
          // Call the backend API to delete the chat room
          axios.delete(`http://localhost:9000/api/chat-room/${this.chatRoom.id}/delete`, {
            data: {
              adminId: this.userId,
            },
          })
            .then(() => {
              // Redirect to the main page
              alert('Chat room deleted successfully.');
              this.$router.push({path: '/main', query: { pseudo: this.pseudo }});
            })
            .catch((error) => {
              console.error('Error deleting chat room:', error);
            });
        } else {
          alert('Only the admin can delete the chat room.');
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
  </style>
  
