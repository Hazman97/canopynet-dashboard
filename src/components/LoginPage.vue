<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">

      <!-- Logo Section -->
      <div class="text-center mb-0"> 
        <img
          src="../assets/logo.png"
          alt="Company Logo"
          class="mx-auto h-40 object-contain"
        />
      </div>
      <!-- End Logo Section -->

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
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter

// Reactive variables for form input and UI state
const username = ref('');
const password = ref('');
const errorMessage = ref('');
const loading = ref(false); // To manage button loading state

// Initialize Vue Router
const router = useRouter();

/**
 * Handles the login form submission.
 * Sends user credentials to the backend API.
 */
async function handleLogin() {
  errorMessage.value = ''; // Clear previous error messages
  loading.value = true; // Set loading state to true

  try {
    // Send a POST request to your Node.js backend login endpoint
    const response = await fetch('http://localhost:3000/api/login', {
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

      // Navigate to '/dashboard' after successful login
      router.push('/dashboard');

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
