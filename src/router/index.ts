// src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router';
// Import your components. Ensure these paths are correct relative to index.ts
import HomeView from '../views/Dashboard.vue'; // Your Dashboard component (mapped to HomeView)
import MainLayout from '../components/Mainlayout.vue';
import AboutView from '@/views/AboutView.vue'; // Your AboutView component
import tele from '@/views/Teleoperation.vue'; // Your Teleoperation component

// Import the LoginPage component.
// This path assumes LoginPage.vue is in src/components.
import LoginPage from '@/components/LoginPage.vue'; // This path was corrected in earlier steps

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
      // 'Legacy Home' route: If you still use '/MainLayout' directly,
      // it should also be protected.
      path: '/MainLayout',
      name: 'legacy-home',
      component: HomeView, // This is your Dashboard.vue
      meta: { requiresAuth: true } // This route requires authentication
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
          meta: { requiresAuth: true } // Requires authentication
        },
        {
          path: 'cart', // Accessible at /cart
          name: 'cart',
          component: AboutView,
          meta: { requiresAuth: true } // Requires authentication
        },
        {
          path: 'teleoperation', // Accessible at /teleoperation
          name: 'teleoperation',
          component: tele,
          meta: { requiresAuth: true } // Requires authentication
        },
      ]
    }
  ]
});

// Navigation Guard: This runs before every route navigation
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