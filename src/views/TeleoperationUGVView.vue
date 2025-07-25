<template>
  <div class="p-6 bg-gray-50 min-h-screen font-sans">
    <!-- Show empty state if ugvId or initialUgvData not available -->
    <div v-if="!ugvId || !initialUgvData">
      <div class="flex flex-col items-center justify-center text-center p-20 bg-white rounded-lg shadow-md">
        <i class="bx bx-error-circle text-6xl text-gray-400 mb-4"></i>
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">No UGV Selected</h2>
        <p class="text-gray-500">Select a UGV from the list to access teleoperation controls</p>
      </div>
    </div>

    <div v-else>
      <!-- Header Section -->
      <div class="flex items-center mb-6">
        <i class="bx bxs-robot text-4xl text-gray-800 mr-3"></i>
        <div>
          <h1 class="text-3xl font-bold text-gray-800">UGV Control Center</h1>
          <p class="text-gray-600">Advanced teleoperation and autonomous control for unmanned ground vehicles</p>
        </div>
      </div>

      <!-- Tabs Section -->
      <div class="bg-white rounded-lg shadow-md p-2 mb-6 flex space-x-4">
        <button
          @click="$emit('back-to-overview')"
          :class="{'text-gray-700 hover:bg-gray-100': true}"
          class="px-5 py-2 rounded-md font-medium transition-colors duration-200"
        >
          <i class="bx bx-grid-alt mr-2"></i>Overview
        </button>
      </div>

      <!-- UGV Teleoperation Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6 flex items-center justify-between">
        <div class="flex items-center">
          <span class="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
          <h2 class="text-xl font-semibold text-gray-800">UGV-{{ ugvId }} Teleoperation</h2>
          <p class="text-gray-600 ml-4">Connected - Ready for control</p>
        </div>
        <div class="flex items-center">
          <span class="text-gray-700 mr-3">Manual Mode</span>
          <label for="manualModeToggle" class="flex items-center cursor-pointer">
            <div class="relative">
              <input type="checkbox" id="manualModeToggle" class="sr-only" v-model="manualModeEnabled">
              <div class="block bg-gray-300 w-14 h-8 rounded-full"></div>
              <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform" :class="{ 'translate-x-6': manualModeEnabled }"></div>
            </div>
          </label>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- UGV Position Tracking -->
      <div class="lg:col-span-1 bg-white rounded-lg shadow-md p-6 flex flex-col">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">UGV Position Tracking</h3>
        <div class="relative flex-grow bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
          <!-- Placeholder for map -->
          <img src="https://placehold.co/400x300/E0E0E0/555555?text=Map+Placeholder" alt="Map Placeholder" class="w-full h-full object-cover">
          <div class="absolute top-2 left-2 flex flex-col space-y-1 z-10">
            <button class="bg-white p-1.5 rounded-md shadow-md text-gray-700 hover:bg-gray-100"><i class="bx bx-plus text-lg"></i></button>
            <button class="bg-white p-1.5 rounded-md shadow-md text-gray-700 hover:bg-gray-100"><i class="bx bx-minus text-lg"></i></button>
          </div>
          <div class="absolute bottom-2 left-2 text-xs text-gray-600 z-10">
            © Leaflet | © OpenStreetMap contributors
          </div>
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <i class="bx bx-current-location text-green-600 text-3xl"></i>
          </div>
        </div>
      </div>

      <!-- UGV Live Stream -->
      <div class="lg:col-span-1 bg-gray-900 rounded-lg shadow-md p-6 text-white flex flex-col items-center justify-center relative overflow-hidden">
        <div class="absolute top-4 right-4 flex space-x-2 z-10">
          <button class="bg-gray-700 p-2 rounded-full hover:bg-gray-600"><i class="bx bx-cog text-xl"></i></button>
          <button class="bg-gray-700 p-2 rounded-full hover:bg-gray-600"><i class="bx bx-fullscreen text-xl"></i></button>
        </div>
        <i class="bx bx-video text-6xl text-gray-400 mb-4"></i>
        <p class="text-xl font-semibold mb-2">UGV-{{ ugvId }} Live Stream</p>
        <p class="text-sm text-gray-400">1920x1080 - 30fps</p>
        <div class="mt-4 text-sm space-y-1">
          <p>Lat: <span class="font-medium">{{ initialUgvData.lat }}</span></p>
          <p>Lng: <span class="font-medium">{{ initialUgvData.lng }}</span></p>
          <p>Heading: <span class="font-medium">{{ initialUgvData.heading }}°</span></p>
          <p>Signal: <span class="font-medium">{{ initialUgvData.signal }}%</span></p>
        </div>
      </div>

      <!-- Movement Controls -->
        <div class="lg:col-span-1 bg-white rounded-lg shadow-md p-6 flex flex-col">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Movement Controls</h3>
          <div :class="{'opacity-50 pointer-events-none bg-gray-100': !manualModeEnabled, 'bg-white': manualModeEnabled}" class="flex-grow flex flex-col items-center justify-center p-6 rounded-lg border border-gray-200 transition-all duration-300">
            <i class="bx bx-game text-6xl text-gray-400 mb-4"></i>
            <p class="text-lg text-gray-600 text-center mb-4">
              {{ manualModeEnabled ? 'Use joystick or keyboard for control' : 'Enable Manual Mode to access teleoperation controls' }}
            </p>
            <div v-if="manualModeEnabled" class="grid grid-rows-3 grid-cols-3 gap-3 w-full max-w-xs">
              <div></div>
              <button class="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"><i class="bx bx-up-arrow-alt"></i></button>
              <div></div>
              <button class="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"><i class="bx bx-left-arrow-alt"></i></button>
              <div></div>
              <button class="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"><i class="bx bx-right-arrow-alt"></i></button>
              <div></div>
              <button class="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"><i class="bx bx-down-arrow-alt"></i></button>
              <div></div>
              <button class="col-span-3 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors">Stop All</button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Status Information & Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Status Information</h3>
        <div class="space-y-2 text-gray-700 text-base">
          <p><span class="font-medium">Current Task:</span> {{ initialUgvData.currentTask }}</p>
          <p><span class="font-medium">Battery Health:</span> {{ initialUgvData.batteryHealth }}</p>
          <p><span class="font-medium">Last Communication:</span> {{ initialUgvData.lastCommunication }}</p>
          <p><span class="font-medium">Error Codes:</span> {{ initialUgvData.errorCodes || 'None' }}</p>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div class="grid grid-cols-2 gap-4">
          <button class="bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition-colors flex items-center justify-center">
            <i class="bx bx-home mr-2"></i> Return to Base
          </button>
          <button class="bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center">
            <i class="bx bx-bell mr-2"></i> Sound Alarm
          </button>
          <button class="bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition-colors flex items-center justify-center">
            <i class="bx bx-camera mr-2"></i> Take Photo
          </button>
          <button class="bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center">
            <i class="bx bx-reset mr-2"></i> Reboot System
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
  ugvId: String,
  initialUgvData: Object
});

const emit = defineEmits(['back-to-overview']);
const manualModeEnabled = ref(false);
watch(manualModeEnabled, (value) => {
  console.log('Manual mode:', value);
});
</script>

<style scoped>
.dot {
  transition: transform 0.3s ease;
}
</style>

<style scoped>
/* Custom toggle switch styling */
input:checked + .block {
  background-color: #2563eb; /* blue-600 */
}
input:checked + .block .dot {
  transform: translateX(100%);
}
</style>