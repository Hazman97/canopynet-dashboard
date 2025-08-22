<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-200 to-green-300 p-4 relative overflow-hidden">
    <!-- Header -->
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

    <!-- Main Menu -->
    <div class="grid grid-cols-2 gap-4 max-w-xl mx-auto">
      <div @click="$router.push('/game-tasks')" class="bg-green-100 rounded-2xl p-6 shadow-md flex flex-col items-center justify-center cursor-pointer hover:bg-green-200 transition">
        <img src="@/assets/task.png" class="w-12 mb-2" alt="Tasks Icon" />
        <span class="text-lg font-bold text-green-800">Tasks</span>
      </div>

      <div @click="$router.push('/game-workers')" class="bg-green-100 rounded-2xl p-6 shadow-md flex flex-col items-center justify-center cursor-pointer hover:bg-green-200 transition">
        <img src="@/assets/crew.png" class="w-12 mb-2" alt="Crew Icon" />
        <span class="text-lg font-bold text-green-800">My Crew</span>
      </div>

      <div @click="$router.push('/game-areas')" class="bg-green-100 rounded-2xl p-6 shadow-md flex flex-col items-center justify-center cursor-pointer hover:bg-green-200 transition">
        <img src="@/assets/map.png" class="w-12 mb-2" alt="Farm Map Icon" />
        <span class="text-lg font-bold text-green-800">Farm Areas</span>
      </div>

      <div @click="$router.push('/game-assets')" class="bg-green-100 rounded-2xl p-6 shadow-md flex flex-col items-center justify-center cursor-pointer hover:bg-green-200 transition">
        <img src="@/assets/tractor.png" class="w-12 mb-2" alt="Asset Icon" />
        <span class="text-lg font-bold text-green-800">Asset</span>
      </div>
    </div>

    <!-- Farmer NPC -->
    <div class="absolute bottom-16 left-0 animate-farmer flex items-center space-x-2">
      <img src="@/assets/farmer-walk.gif" alt="Farmer" class="pixelated farmer-size" />
      <div class="bg-white border border-gray-300 rounded-lg px-3 py-1 shadow-md text-xs font-bold text-green-700">
        {{ currentMessage }}
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 bg-white shadow-inner border-t flex justify-around py-2">
      <div class="flex flex-col items-center text-green-700 font-bold">
        <img src="@/assets/house.png" class="w-8 mb-1" alt="Home" />
        <span class="text-sm">Home</span>
      </div>
      <div @click="$router.push('/game-tasks')" class="flex flex-col items-center cursor-pointer hover:text-red-700 transition">
        <img src="@/assets/task.png" class="w-8 mb-1" alt="Tasks" />
        <span class="text-sm">Tasks</span>
      </div>
      <div @click="$router.push('/game-workers')" class="flex flex-col items-center cursor-pointer hover:text-yellow-700 transition">
        <img src="@/assets/crew.png" class="w-8 mb-1" alt="Crew" />
        <span class="text-sm">Crew</span>
      </div>
      <div @click="$router.push('/game-areas')" class="flex flex-col items-center cursor-pointer hover:text-blue-700 transition">
        <img src="@/assets/map.png" class="w-8 mb-1" alt="Map" />
        <span class="text-sm">Areas</span>
      </div>
      <div @click="$router.push('/game-assets')" class="flex flex-col items-center cursor-pointer hover:text-black-700 transition">
        <img src="@/assets/tractor.png" class="w-8 mb-1" alt="Assets" />
        <span class="text-sm">Assets</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const messages = [
  "Rise and shine, farmer!",
  "Let's get those crops growing! 🌱",
  "Hard work pays off! 💪",
  "The farm is counting on you! 🐓",
  "Time to harvest greatness!"
];
const currentMessage = ref(messages[0]);

let messageIndex = 0;
let intervalId;

onMounted(() => {
  intervalId = setInterval(() => {
    messageIndex = (messageIndex + 1) % messages.length;
    currentMessage.value = messages[messageIndex];
  }, 4000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});

const logout = () => {
  sessionStorage.removeItem('userToken');
  sessionStorage.removeItem('userRole');
  router.push('/login');
};
</script>

<style scoped>
.pixelated {
  image-rendering: pixelated;
}

@keyframes farmerWalk {
  0% {
    transform: translateX(-60px);
  }
  100% {
    transform: translateX(100vw);
  }
}

.farmer-size {
  width: 6rem; /* doubled from w-12 (3rem) */
  height: 6rem;
}

.animate-farmer {
  animation: farmerWalk 20s linear infinite;
}
</style>
