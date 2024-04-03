import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './views/HomePage.vue';
import MainPage from './views/MainPage.vue';
import ChatRoom from './views/ChatRoom.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/main', component: MainPage },
  { path: '/chat', component: ChatRoom}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
