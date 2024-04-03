<template>
  <div>
    <h1>ZenChat</h1>
    <button class="default_button" @click="showCreateChatRoomModal">Create a ChatRoom</button>
    <p>Welcome, {{ pseudo }}!</p>
    <div class="chat-room-grid">
      <chat-room-card v-for="chatRoom in chatRooms" :key="chatRoom.id" :chatRoom="chatRoom" :user="user" />
    </div>
     <!-- Modal for creating a chat room -->
     <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>Create a Chat Room</h2>
        <input v-model="newChatRoomName" placeholder="Enter Chat Room Name" />
        <button @click="createChatRoom">Create</button>
        <button @click="cancelCreateChatRoom">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import ChatRoomCard from '@/components/ChatRoomCard.vue';
import axios from 'axios';

export default {
  components: {
    ChatRoomCard,
  },

  data() {
    return {
      chatRooms: [],
      pseudo: '',
      user: null,
      showModal: false,
      newChatRoomName: '', // To store the new chat room name
    };
  },

  mounted() {
    // Retrieve pseudo from the query parameters
    this.pseudo = this.$route.query.pseudo || '';
    // create the user in the backend
    this.createUser();

    // Fetch chat rooms from the backend
    // and store them in the chatRooms array
    axios.get('http://localhost:9000/api/chat-room').then((response) => {
      this.chatRooms = response.data || [];
      console.log('Chat Rooms:', this.chatRooms);
    });
  },

  methods: {
    createUser() {
      axios
        .post('http://localhost:9000/api/user/add', {
          username: this.pseudo,
        })
        .then((response) => {
          this.user = response.data;
        })
        .catch((error) => {
          console.error('Error creating user:', error);
        });
    },

    showCreateChatRoomModal() {
      this.showModal = true;
    },

    cancelCreateChatRoom() {
      this.showModal = false;
      this.newChatRoomName = '';
    },

    createChatRoom() {
      // Call the backend API to create a new chat room
      axios
        .post('http://localhost:9000/api/chat-room/create', {
          chatRoomName: this.newChatRoomName,
          adminId: this.user.id,
        })
        .then((response) => {
          const newChatRoom = response.data;
          this.chatRooms.push(newChatRoom);
          this.showModal = false;
          this.newChatRoomName = '';
          this.$router.push({
          path: '/chat',
          query: {
            chatRoomId: newChatRoom.id,
            userId: this.user.id,
          },
        });
      })
        .catch((error) => {
          console.error('Error creating chat room:', error);
        });
    },
  },
};
</script>

<style scoped>
.chat-room-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.modal input {
  margin-bottom: 10px;
  padding: 8px;
}

.default_button {
  padding: 10px;
  background-color: #4C64DC; 
  color: #fff; 
  cursor: pointer;
  border: none;

}
.modal button {
  padding: 8px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  margin-right: 5px;
}
</style>
