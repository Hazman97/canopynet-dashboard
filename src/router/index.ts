// src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router';
// Import your components. Ensure these paths are correct relative to index.ts
import HomeView from '../views/Dashboard.vue'; // Your Dashboard component (mapped to HomeView)
import MainLayout from '../components/Mainlayout.vue';
import AboutView from '@/views/AboutView.vue'; // Your AboutView component
import tele from '@/views/Teleoperation.vue'; // Your Teleoperation component
import LoginPage from '@/components/LoginPage.vue'; // Import the LoginPage component.
import Alarm from '@/views/Alarm.vue'; // Import Alarm.vue

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // Default route: Redirects root path '/' to '/login'
      path: '/',
      redirect: '/login'
    },
    {
      // Login Page route: accessible without authentication
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      // 'Legacy Home' route: Protected
      path: '/MainLayout',
      name: 'legacy-home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      // Main application layout and its protected child routes
      path: '/', // This is the base path for nested routes within MainLayout
      component: MainLayout,
      children: [
        {
          path: 'dashboard', // Accessible at /dashboard
          name: 'dashboard',
          component: HomeView,
          meta: { requiresAuth: true }
        },
        {
          path: 'cart', // Accessible at /cart
          name: 'cart',
          component: AboutView,
          meta: { requiresAuth: true }
        },
        {
          path: 'teleoperation', // Accessible at /teleoperation
          name: 'teleoperation',
          component: tele,
          meta: { requiresAuth: true }
        },
        {
          // NEW: Alarm Route - Protected
          path: 'alarm', // Accessible at /alarm
          name: 'alarm',
          component: Alarm, // Use the new Alarm component
          meta: { requiresAuth: true } // Requires authentication
        },
      ]
    }
  ]
});

// Navigation Guard: (Remains unchanged - checks isAuthenticated based on sessionStorage)
router.beforeEach((to, from, next) => {
  // Determine if the target route requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // --- CRITICAL CHANGE: Check for the dummy token in sessionStorage ---
  const isAuthenticated = sessionStorage.getItem('userToken') === 'true';

  if (requiresAuth && !isAuthenticated) {
    // Scenario 1: Route requires authentication BUT user is NOT authenticated.
    console.log('Navigation Guard: Route requires auth but user is NOT authenticated. Redirecting to /login');
    next('/login');
  } else if (to.name === 'login' && isAuthenticated) {
    // Scenario 2: User IS authenticated AND they are trying to go to the login page.
    console.log('Navigation Guard: User IS authenticated and trying to access login. Redirecting to /dashboard');
    next('/dashboard');
  } else {
    // Scenario 3: Otherwise, allow navigation.
    console.log('Navigation Guard: Navigation allowed.');
    next();
  }
});

export default router;
