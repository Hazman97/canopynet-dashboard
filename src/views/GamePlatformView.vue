<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-200 to-green-300 p-4">
    <!-- Header with logout button -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex-1"></div>
      <h1 class="text-center text-3xl font-bold text-white flex-1">My Farm Dashboard</h1>
      <div class="flex-1 flex justify-end">
        <button @click="logout" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm">
          Logout
        </button>
      </div>
    </div>
    
    <p class="text-center text-white mb-6 font-semibold">
      Welcome to your very own Palm Farm! Tap an icon to get started.
    </p>

    <div class="grid grid-cols-2 gap-4 max-w-xl mx-auto">
      <div @click="$router.push('/tasks')" class="bg-green-100 rounded-2xl p-6 shadow-md flex flex-col items-center justify-center cursor-pointer hover:bg-green-200 transition">
        <img src="@/assets/task.png" class="w-12 mb-2" alt="Tasks Icon" />
        <span class="text-lg font-bold text-green-800">Tasks</span>
      </div>

      <div @click="$router.push('/crew')" class="bg-green-100 rounded-2xl p-6 shadow-md flex flex-col items-center justify-center cursor-pointer hover:bg-green-200 transition">
        <img src="@/assets/crew.png" class="w-12 mb-2" alt="Crew Icon" />
        <span class="text-lg font-bold text-green-800">My Crew</span>
      </div>

      <div class="bg-green-100 rounded-2xl p-6 shadow-md flex flex-col items-center justify-center cursor-pointer hover:bg-green-200 transition">
        <img src="@/assets/map.png" class="w-12 mb-2" alt="Farm Map Icon" />
        <span class="text-lg font-bold text-green-800">Farm Map</span>
      </div>

      <div class="bg-green-100 rounded-2xl p-6 shadow-md flex flex-col items-center justify-center cursor-pointer hover:bg-green-200 transition">
        <img src="@/assets/tractor.png" class="w-12 mb-2" alt="Asset Icon" />
        <span class="text-lg font-bold text-green-800">Asset</span>
      </div>
    </div>

    <!-- Bottom Navigation Bar -->
    <div class="fixed bottom-0 left-0 right-0 bg-white shadow-inner border-t flex justify-around py-2">
      <div class="flex flex-col items-center text-green-700 font-bold">
        <img src="@/assets/house.png" class="w-8 mb-1" alt="Home" />
        <span class="text-sm">Home</span>
      </div>
      <div @click="$router.push('/tasks')" class="flex flex-col items-center cursor-pointer hover:text-green-700 transition">
        <img src="@/assets/task.png" class="w-8 mb-1" alt="Tasks" />
        <span class="text-sm">Tasks</span>
      </div>
      <div @click="$router.push('/crew')" class="flex flex-col items-center cursor-pointer hover:text-green-700 transition">
        <img src="@/assets/crew.png" class="w-8 mb-1" alt="Crew" />
        <span class="text-sm">Crew</span>
      </div>
      <div class="flex flex-col items-center cursor-pointer hover:text-green-700 transition">
        <img src="@/assets/map.png" class="w-8 mb-1" alt="Map" />
        <span class="text-sm">Map</span>
      </div>
      <div class="flex flex-col items-center cursor-pointer hover:text-green-700 transition">
        <img src="@/assets/tractor.png" class="w-8 mb-1" alt="Assets" />
        <span class="text-sm">Assets</span>
      </div>
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