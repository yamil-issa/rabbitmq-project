<template>
    <div class="chat-room-card">
      <h2>{{ chatRoom.chatRoomName }}</h2>
      <p>{{ chatRoom.participants.length }} Participants</p>
      <button @click="joinChatRoom">Join</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';

  export default {
    props: {
      chatRoom: {
        type: Object,
        required: true,
      },
      user: {
      type: Object,
      required: true,
    },
    },
    methods: {
      async joinChatRoom() {
        try {
          // Call the backend API to join the chat room
          axios.post(`http://localhost:9000/api/chat-room/${this.chatRoom.id}/join`, {
            userId: this.user.id,
          })
          .then((response) => {

            console.log('User created successfully:', response.data);
          })
          .catch((error) => {
            console.error('Error creating user:', error);
          });
      
          axios.get(`http://localhost:9000/api/chat-room/${this.chatRoom.id}`).then((response2) => {
            const data = response2.data;
            this.$router.push({ path: '/chat', query: { chatRoomId: data.id, userId: this.user.id }});
          });
          
        }catch (error) {
          console.error('Error joining chat room:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .chat-room-card {
    border: 1px solid #ddd;
    padding: 20px;
    margin: 10px;
    border-radius: 8px;
    background-color: #353D39;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
  }
  
  .chat-room-card:hover {
    transform: scale(1.05);
  }
  
  h2 {
    margin-bottom: 10px;
  }
  
  button {
    padding: 10px;
    background-color: #4C64DC; 
    color: #fff; 
    cursor: pointer;
    border: none;
  }
  </style>
  
