<template>
  <div class="min-h-screen flex items-center justify-center bg-green-100 p-4">
    <div class="bg-white p-8 rounded-lg shadow-xl text-center">
      <h2 class="text-3xl font-bold text-green-800 mb-4">Welcome to the Game Platform!</h2>
      <p class="text-lg text-gray-700">This is a special area for game users.</p>
      <button @click="logout" class="mt-6 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
        Logout
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = () => {
  sessionStorage.removeItem('userToken'); // Clear token
  sessionStorage.removeItem('userRole');  // Clear role
  router.push('/login'); // Redirect to login page
};
</script>

<style scoped>
/* Tailwind CSS classes are used, no additional scoped styles needed */
</style>