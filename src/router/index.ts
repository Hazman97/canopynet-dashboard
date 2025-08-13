// src/router/index.ts

import { createRouter, createWebHistory, type RouteMeta } from 'vue-router'; // <-- MODIFIED: Added 'type' keyword for RouteMeta
// Import your components. Ensure these paths are correct relative to index.ts
import HomeView from '../views/Dashboard.vue'; // Your Dashboard component (mapped to HomeView)
import MainLayout from '../components/Mainlayout.vue';
import AboutView from '@/views/AboutView.vue'; // Your AboutView component
import tele from '@/views/Teleoperation.vue'; // Your Teleoperation component
import LoginPage from '@/components/LoginPage.vue'; // Import the LoginPage component.
import Alarm from '@/views/Alarm.vue'; // Import Alarm.vue
import LiveMapView from '@/views/LiveMapView.vue'; // Import LiveMapView.vue
import TaskView from '@/views/TaskView.vue';      // Import TaskView.vue
import WorkersView from '@/views/WorkerManagementView.vue'; // Import WorkerManagementView.vue
import AreasView from '@/views/AreasView.vue';    // Import AreasView.vue
import BlocksView from '@/views/BlocksView.vue';
import TreeViews from '../views/TreeViews.vue'; // Import the new TreeViews component
import AssetsView from '@/views/AssetsView.vue';  // Import AssetsView.vue
import UGVView from '@/views/UGVView.vue';        // Import UGVView.vue
import MeshView from '@/views/MeshView.vue'; // Import MeshView.vue
import AnalyticsView from '@/views/AnalyticsView.vue'; // Import AnalyticsView.vue
import Overview from '@/components/Overview.vue'; // Import Overview.vue
import NetworkMap from '@/components/NetworkMap.vue'; // Import NetworkMap.vue
import NodeManagement from '@/components/NodeManagement.vue'; // Import NodeManagement.vue
import Monitoring from '@/components/Monitoring.vue'; // Import Monitoring.vue
import GamePlatformView from '@/views/GamePlatformView.vue'; // ADDED: Import the new GamePlatformView component
import GameTaskView from '@/views/GameTaskView.vue'; // Import GameTaskView.vue
import GameWorkersView from '@/views/GameWorkersView.vue'; // Import GameWorkersView.vue
import GameAreasView from '@/views/GameAreasView.vue';


// --- TypeScript Augmentation for Vue Router's RouteMeta ---
// This tells TypeScript that `RouteMeta` can have a `roles` property, which is an array of strings.
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    roles?: string[]; // Define the roles property as an optional array of strings
  }
}

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
      meta: { requiresAuth: true, roles: ['normal'] } // ADDED roles for legacy-home
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
          meta: { requiresAuth: true, roles: ['normal'] } // MODIFIED: Added roles for dashboard
        },
        {
          path: 'cart', // Accessible at /cart
          name: 'cart',
          component: AboutView,
          meta: { requiresAuth: true, roles: ['normal'] } // ADDED roles
        },
        {
          path: 'teleoperation', // Accessible at /teleoperation
          name: 'teleoperation',
          component: tele,
          meta: { requiresAuth: true, roles: ['normal'] } // ADDED roles
        },
        {
          path: 'alarm', // Accessible at /alarm
          name: 'alarm',
          component: Alarm, // Use the new Alarm component
          meta: { requiresAuth: true, roles: ['normal'] } // ADDED roles
        },
        {
          path: 'livemap', // Path for /livemap
          name: 'livemap',
          component: LiveMapView, // Use the imported component
          meta: { requiresAuth: true, roles: ['normal'] } // ADDED roles
        },
        {
          path: 'task', // Path for /task
          name: 'task',
          component: TaskView,
          meta: { requiresAuth: true, roles: ['normal'] } // ADDED roles
        },
        {
          path: 'workers', // Path for /workers
          name: 'workers',
          component: WorkersView,
          meta: { requiresAuth: true, roles: ['normal'] } // ADDED roles
        },
        {
          path: 'areas', // Path for /areas
          name: 'areas',
          component: AreasView,
          meta: { requiresAuth: true, roles: ['normal'] } // ADDED roles
        },
        {
          // Ensure this route's meta.requiresAuth is handled by the parent if needed
          path: '/phases/:phaseId/blocks',
          name: 'blocks', // Use lowercase 'blocks' for consistency with named routes
          component: BlocksView,
          meta: { requiresAuth: true, roles: ['normal'] } // ADDED roles
        },
        {
          path: '/phases/:phaseId/blocks/:blockId/trees',
          name: 'trees',
          component: TreeViews,
          meta: { requiresAuth: true, roles: ['normal'] } // ADDED roles
        },
        {
          path: 'assets', // Path for /assets
          name: 'assets',
          component: AssetsView,
          meta: { requiresAuth: true, roles: ['normal'] } // ADDED roles
        },
        {
          path: 'ugv', // Path for /ugv
          name: 'ugv',
          component: UGVView,
          meta: { requiresAuth: true, roles: ['normal'] } // ADDED roles
        },
        {
          path: 'analytics', // Path for /analytics
          name: 'analytics',
          component: AnalyticsView,
          meta: { requiresAuth: true, roles: ['normal'] } // ADDED roles
        },
        // Consolidated and corrected Mesh route
        {
          path: 'mesh', // Accessible at /mesh
          name: 'mesh',
          component: MeshView, // MeshView will act as the parent for nested routes
          meta: { requiresAuth: true, roles: ['normal'] }, // ADDED roles
          children: [
            { path: '', redirect: 'overview' }, // Redirect /mesh to /mesh/overview
            { path: 'overview', component: Overview, meta: { requiresAuth: true, roles: ['normal'] } }, // ADDED roles
            { path: 'network-map', component: NetworkMap, meta: { requiresAuth: true, roles: ['normal'] } }, // ADDED roles
            { path: 'node-management', component: NodeManagement, meta: { requiresAuth: true, roles: ['normal'] } }, // ADDED roles
            { path: 'monitoring', component: Monitoring, meta: { requiresAuth: true, roles: ['normal'] } } // ADDED roles
          ]
        }
      ]
    },
    {
      // NEW ROUTE: For 'game' role users
      path: '/game-platform',
      name: 'game-platform',
      component: GamePlatformView, // Your new GamePlatformView component
      meta: { requiresAuth: true, roles: ['game'] } // Only 'game' roles can access this
    },
    {
      path: '/game-tasks',
      name: 'game-tasks',
      component: GameTaskView, // Your new GameTaskView component
      meta: { requiresAuth: true, roles: ['game'] } // Only 'game' roles can access this
    },
    {
      path: '/game-workers',
      name: 'game-workers',
      component: GameWorkersView, // Your new GameWorkersView component
      meta: { requiresAuth: true, roles: ['game'] } // Only 'game' roles can access this
    },
    {
      path: '/game-areas',
      name: 'game-areas',
      component: GameAreasView, // Your new GameAreasView component
      meta: { requiresAuth: true, roles: ['game'] } // Only 'game' roles can access this
    }
  ]
});

// Navigation Guard: MODIFIED to handle roles and redirection logic
router.beforeEach((to, from, next) => {
  const isAuthenticated = sessionStorage.getItem('userToken') === 'true';
  // userRole can be string or null, so type it as string | null
  const userRole: string | null = sessionStorage.getItem('userRole'); 

  // Log for debugging
  console.log(`Navigating to: ${String(to.name)} (Path: ${to.path})`);
  console.log(`Requires Auth: ${to.meta.requiresAuth}, Is Authenticated: ${isAuthenticated}, User Role: ${userRole}`);
  console.log(`Required Roles for '${String(to.name)}':`, to.meta.roles);


  if (to.meta.requiresAuth && !isAuthenticated) {
    // Scenario 1: Route requires authentication BUT user is NOT authenticated.
    console.log('Access Denied: Not authenticated. Redirecting to /login.');
    next('/login');
  } else if (isAuthenticated) {
    // Scenario 2: User IS authenticated.
    // Handle redirection away from login page if authenticated
    if (to.name === 'login') {
      console.log('Authenticated user trying to access login. Redirecting based on role.');
      if (userRole === 'game') {
        next('/game-platform'); // Send game user to game platform
      } else {
        next('/dashboard'); // Send normal user to dashboard
      }
      return; // Stop further processing in this guard
    }

    // Check if the current route has specific role requirements AND if userRole is defined
    if (to.meta.roles && userRole && !to.meta.roles.includes(userRole)) { // MODIFIED: Added userRole check
      // Scenario 2a: User is authenticated but doesn't have the required role for this route.
      console.warn(`Access Denied: User role '${userRole}' not allowed on route '${String(to.name)}'.`);

      // Redirect user to their appropriate landing page based on their actual role
      if (userRole === 'game') {
        next('/game-platform');
      } else if (userRole === 'normal') {
        next('/dashboard');
      } else {
        // Fallback for unexpected roles, or if no specific landing page
        next('/login'); // Or a generic 'access-denied' page
      }
    } else {
      // Scenario 2b: User is authenticated and has the correct role (or route has no specific role requirement).
      console.log('Authenticated user with correct role. Navigation allowed.');
      next();
    }
  } else {
    // Scenario 3: Route does NOT require authentication, and user is NOT authenticated.
    // This typically applies to the /login route itself.
    console.log('Route does not require authentication. Navigation allowed.');
    next();
  }
});

export default router;