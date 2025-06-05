import { createRouter, createWebHistory } from 'vue-router'
// Make sure this file exists at src/views/HomeView.vue
import HomeView from '../views/Dashboard.vue'
import MainLayout from '../components/MainLayout.vue'
import AboutView from '@/views/AboutView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
     {
    path: '/MainLayout',
    component: MainLayout,
    children: [
      { path: '', name: 'dashboard', component: HomeView },
      { path: 'cart', name: 'cart', component: AboutView },
    ]
  }
  
  ],
})

export default router
// src/router/index.js

