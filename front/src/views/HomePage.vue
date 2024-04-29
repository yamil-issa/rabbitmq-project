<template>
  <div class="zen-chat">
    <h1>Chat</h1>
    <form @submit.prevent="handleSubmit">
      <input v-model="pseudo" type="text" placeholder="your pseudo" />
      <button type="submit">Validate</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pseudo: '',
    };
  },
  methods: {
    handleSubmit() {
      // Redirect to the main page with pseudo as a query parameter
      this.$router.push({ path: '/main', query: { pseudo: this.pseudo } });
    },
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
