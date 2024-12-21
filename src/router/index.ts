import { createRouter, createWebHistory } from 'vue-router';
import SignIn from '../components/SignIn.vue';
import Home from '@/components/Home.vue';
import Popular from '@/components/Popular.vue';
import Search from '@/components/Search.vue';
import Wishlist from '@/components/Wishlist.vue';
import CallbackPage from "@/views/CallbackPage.vue";

const routes = [
  {
    path: '/',
    name: 'Home', // 이름 수정
    component: Home,
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: SignIn,
  },
  {
    path: '/popular',
    name: 'Popular',
    component: Popular,
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
  },
  {
    path: '/wishlist',
    name: 'Wishlist',
    component: Wishlist,
  },
  { path: "/callback",
    name: "CallbackPage",
    component: CallbackPage,
  },
];

const router = createRouter({
  history: createWebHistory('/Kakao-login/'),
  routes,
});

export default router;
