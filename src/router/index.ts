// src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router';
// Import your components. Ensure these paths are correct relative to index.ts
import HomeView from '../views/Dashboard.vue'; // Your Dashboard component (mapped to HomeView)
import MainLayout from '../components/Mainlayout.vue';
import AboutView from '@/views/AboutView.vue'; // Your AboutView component
import tele from '@/views/Teleoperation.vue'; // Your Teleoperation component

// Import the LoginPage component.
// Adjust this path if LoginPage.vue is not in src/components.
import LoginPage from '@/components/LoginPage.vue'; // Corrected path assuming LoginPage.vue is in src/components

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
  // `to.matched.some` checks if any of the matched route records (including parent routes)
  // have a `meta.requiresAuth` property set to `true`.
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // Check if the user is authenticated by looking for the dummy token in localStorage.
  // In a real app, this would involve validating a JWT or session token.
  const isAuthenticated = localStorage.getItem('userToken') === 'true';

  if (requiresAuth && !isAuthenticated) {
    // Scenario 1: Route requires authentication BUT user is NOT authenticated.
    // Redirect them to the login page.
    // This handles:
    // - Direct URL access to protected routes when logged out.
    // - Browser back/forward button attempts to protected routes when logged out.
    console.log('Navigation Guard: Route requires auth but user is NOT authenticated. Redirecting to /login');
    next('/login');
  } else if (to.name === 'login' && isAuthenticated) {
    // Scenario 2: User IS authenticated AND they are trying to go to the login page.
    // Redirect them to the dashboard (or another main authenticated page).
    // This prevents logged-in users from seeing the login form unnecessarily.
    console.log('Navigation Guard: User IS authenticated and trying to access login. Redirecting to /dashboard');
    next('/dashboard');
  } else {
    // Scenario 3: Otherwise (e.g., route doesn't require auth, or user is authenticated
    // and navigating to a protected route).
    // Allow the navigation to proceed.
    console.log('Navigation Guard: Navigation allowed.');
    next();
  }
});

export default router;

