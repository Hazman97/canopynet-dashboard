// src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router';
// Make sure this file exists at src/views/HomeView.vue
import HomeView from '../views/Dashboard.vue'; // Your Dashboard component
import MainLayout from '../components/Mainlayout.vue';
import AboutView from '@/views/AboutView.vue'; // Your AboutView component (aliased as 'cart')
import tele from '@/views/Teleoperation.vue'; // Your Teleoperation component

// Import the LoginPage component
import LoginPage from '@/components/LoginPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // --- NEW: Redirect root path '/' to '/login' ---
      path: '/',
      redirect: '/login' // When user visits '/', they will be redirected to '/login'
    },
    {
      // The actual login page
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      // This route can be removed if you primarily want to use the nested structure
      // or if '/MainLayout' is meant to be a direct access to the dashboard without MainLayout wrapper.
      path: '/MainLayout',
      name: 'home',
      component: HomeView, // This is your Dashboard.vue
    },
    {
      // Protected routes - these should ideally be guarded to require authentication
      // For now, they are accessible after login.
      path: '/', // This is the base path for nested routes within MainLayout
      component: MainLayout,
      children: [
        { path: 'dashboard', name: 'dashboard', component: HomeView }, // Accessible at /dashboard
        { path: 'cart', name: 'cart', component: AboutView }, // Accessible at /cart
        { path: 'teleoperation', name: 'teleoperation', component: tele }, // Accessible at /teleoperation
        // Note: The empty path '' here would conflict with the root redirect above
        // You generally don't want a direct path on '/' and also a child '' path for '/'.
        // After login, you would typically redirect to '/dashboard' or some other specific path within MainLayout.
        // I've changed the child path to 'dashboard' to be explicit.
      ]
    }
  ]
})

// Optional: A more robust approach for real applications would be using Navigation Guards
// to protect routes that require authentication. For example:
/*
router.beforeEach((to, from, next) => {
  // Check if user is authenticated (e.g., by checking a token in localStorage)
  const isAuthenticated = localStorage.getItem('userToken'); // Placeholder for actual auth check

  if (to.meta.requiresAuth && !isAuthenticated) {
    // If route requires auth and user is not authenticated, redirect to login
    next('/login');
  } else if ((to.name === 'login' || to.path === '/') && isAuthenticated) {
    // If user is authenticated and tries to go to login or root, redirect to dashboard
    next('/dashboard'); // Or whatever your main authenticated page is
  } else {
    // Otherwise, allow navigation
    next();
  }
});
*/

export default router

