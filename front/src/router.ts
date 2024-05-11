import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './views/HomePage.vue';
import ChatRoom from './views/ChatRoom.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/home', component: HomePage },
  { path: '/chat', component: ChatRoom}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
