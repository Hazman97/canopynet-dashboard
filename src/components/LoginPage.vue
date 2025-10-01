<template>
  <div class="min-h-screen flex items-center justify-center p-4" :style="backgroundStyle">
    <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">

      <div class="text-center mb-2">
        <img
          src="../assets/logo.png"
          alt="Company Logo"
          class="mx-auto h-40 object-contain"
        />
      </div>
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            v-model="username"
            autocomplete="username"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your username"
            required
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            v-model="password"
            autocomplete="current-password"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your password"
            required
          />
        </div>

        <div v-if="errorMessage" class="text-red-600 text-sm text-center">
          {{ errorMessage }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">Sign In</span>
            <span v-else>Logging in...</span>
          </button>
        </div>
      </form>

      <div class="mt-6 text-center text-sm">
        <p class="text-gray-600">
          Don't have an account?
          <a href="#" class="font-medium text-blue-600 hover:text-blue-500">Sign up</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter

// Reactive variables for form input and UI state
const username = ref('');
const password = ref('');
const errorMessage = ref('');
const loading = ref(false); // To manage button loading state

// Initialize Vue Router
const router = useRouter();

// Background image - replace with your actual palm oil plantation image
const backgroundImageUrl = ref('https://pulitzercenter.org/sites/default/files/styles/1140x695_scale/public/2021-04/shutterstock_636466505.jpeg.webp?itok=llpscEX5');

// Computed property for background style
const backgroundStyle = computed(() => {
  return {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundImageUrl.value})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed'
  };
});

/**
 * Handles the login form submission.
 * Sends user credentials to the backend API.
 */
async function handleLogin() {
  errorMessage.value = ''; // Clear previous error messages
  loading.value = true; // Set loading state to true

  try {
    // Send a POST request to your Node.js backend login endpoint
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    if (response.ok) {
      // If login is successful (status code 2xx)
      const data = await response.json();
      console.log('Login successful!', data);

      // --- CRITICAL CHANGE: Store authentication status AND user role in sessionStorage ---
      sessionStorage.setItem('userToken', 'true'); // Store a dummy token (or actual token if you implement JWT)
      sessionStorage.setItem('userRole', data.role); // Store the user's role from the backend response

      // --- Conditional Redirection based on role ---
      if (data.role === 'game') {
        router.push('/game-platform'); // Redirect 'game' role users to the game page
      } else {
        router.push('/dashboard'); // Default redirect for 'normal' or other roles
      }

    } else {
      // If login fails (e.g., 401 Unauthorized, 400 Bad Request)
      const errorData = await response.json();
      errorMessage.value = errorData.message || 'Login failed. Please check your credentials.';
      console.error('Login error:', errorData);
    }
  } catch (error) {
    // Handle network errors or other unexpected issues
    errorMessage.value = 'An error occurred. Please try again later.';
    console.error('Network or unexpected error:', error);
  } finally {
    loading.value = false; // Reset loading state
  }
}
</script>

<style scoped>
/* No additional scoped styles needed as Tailwind CSS is used extensively. */
</style>