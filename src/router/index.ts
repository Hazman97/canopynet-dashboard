// src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router';
// Import your components. Ensure these paths are correct relative to index.ts
import HomeView from '../views/Dashboard.vue'; // Your Dashboard component (mapped to HomeView)
import MainLayout from '../components/Mainlayout.vue';
import AboutView from '@/views/AboutView.vue'; // Your AboutView component
import tele from '@/views/Teleoperation.vue'; // Your Teleoperation component
import LoginPage from '@/components/LoginPage.vue'; // Import the LoginPage component.
import Alarm from '@/views/Alarm.vue'; // Import Alarm.vue
import LiveMapView from '@/views/LiveMapView.vue'; // Import LiveMapView.vue
import TaskView from '@/views/TaskView.vue';       // Import TaskView.vue
import WorkersView from '@/views/WorkerManagementView.vue'; // Import WorkerManagementView.vue
import AreasView from '@/views/AreasView.vue';     // Import AreasView.vue
import BlocksView from '@/views/BlocksView.vue';
import TreeViews from '../views/TreeViews.vue'; // Import the new TreeViews component
import AssetsView from '@/views/AssetsView.vue';   // Import AssetsView.vue
import UGVView from '@/views/UGVView.vue';         // Import UGVView.vue
import MeshView from '@/views/MeshView.vue'; // Import MeshView.vue
import AnalyticsView from '@/views/AnalyticsView.vue'; // Import AnalyticsView.vue

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
          path: 'alarm', // Accessible at /alarm
          name: 'alarm',
          component: Alarm, // Use the new Alarm component
          meta: { requiresAuth: true } // Requires authentication
        },
        {
          path: 'livemap', // Path for /livemap
          name: 'livemap',
          component: LiveMapView, // Use the imported component
          meta: { requiresAuth: true }
        },
        {
          path: 'task', // Path for /task
          name: 'task',
          component: TaskView,
          meta: { requiresAuth: true }
        },
        {
          path: 'workers', // Path for /workers
          name: 'workers',
          component: WorkersView,
          meta: { requiresAuth: true }
        },
        {
          path: 'areas', // Path for /areas
          name: 'areas',
          component: AreasView,
          meta: { requiresAuth: true }
        },
        {
          // THIS IS THE MISSING/INCORRECT ROUTE CAUSING THE PROBLEM
          path: '/phases/:phaseId/blocks',
          name: 'blocks', // Use lowercase 'blocks' for consistency with named routes
          component: BlocksView
        },
        {
          path: '/phases/:phaseId/blocks/:blockId/trees',
          name: 'trees',
          component: TreeViews
        },
        {
          path: 'assets', // Path for /assets
          name: 'assets',
          component: AssetsView,
          meta: { requiresAuth: true }
        },
        {
          path: 'ugv', // Path for /ugv
          name: 'ugv',
          component: UGVView,
          meta: { requiresAuth: true }
        },
        {
          path: 'mesh', // Path for /mesh
          name: 'mesh',
          component: MeshView,
          meta: { requiresAuth: true }
        },
        {
          path: 'analytics', // Path for /analytics
          name: 'analytics',
          component: AnalyticsView,
          meta: { requiresAuth: true }
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
