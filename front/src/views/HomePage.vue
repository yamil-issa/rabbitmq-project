<template>
  <div class="zen-chat">
    <h1>ZenChat</h1>
    <form @submit.prevent="handleSubmit">
      <input v-model="pseudo" type="text" placeholder="your username" />
      <button type="submit">Validate</button>
    </form>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  data() {
    return {
      pseudo: '',
    };
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

    async getUser() {
      try {
        const response = await axios.get('http://localhost:9000/api/user', {
          data: { username: this.pseudo },
        });
        return response.data;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          return null; 
        } else {
          throw error; 
        }
      }
    },

    handleSubmit() {
      this.handleUser();
      // Redirect to chat room if the user exists
      this.$router.push({ path: '/chat', query: { pseudo: this.pseudo } });
    },

    handleUser() {
      // check if the user exists if not create it
      const user = this.getUser();
      if (!user) {
        this.createUser();
      }

    }
  },
};
</script>

<style scoped>
.zen-chat {
  background-color: #000; 
  color: #fff; 
  height: 100vh; 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

h1 {
  font-size: 2em;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

input {
  padding: 10px;
  margin-bottom: 10px;
}

button {
  padding: 10px;
  background-color: #fff; /* White button background */
  color: #000; /* Black button text */
  cursor: pointer;
  border: none;
}
</style>
