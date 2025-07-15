<template>
  <div class="p-6 bg-gray-50 min-h-screen font-sans">
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
        @click="activeTab = 'overview'"
        :class="{'bg-blue-600 text-white': activeTab === 'overview', 'text-gray-700 hover:bg-gray-100': activeTab !== 'overview'}"
        class="px-5 py-2 rounded-md font-medium transition-colors duration-200"
      >
        <i class="bx bx-grid-alt mr-2"></i>Overview
      </button>
      <button
        @click="activeTab = 'teleoperation'"
        :class="{'bg-blue-600 text-white': activeTab === 'teleoperation', 'text-gray-700 hover:bg-gray-100': activeTab !== 'teleoperation'}"
        class="px-5 py-2 rounded-md font-medium transition-colors duration-200"
      >
        <i class="bx bx-joystick mr-2"></i>Teleoperation
      </button>
    </div>

    <!-- Main Content Area -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Active UGVs Section (Left Column) -->
      <div class="lg:col-span-1 bg-white rounded-lg shadow-md p-6 h-full">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Active UGVs</h2>
        <div class="space-y-4">
          <div
            v-for="ugv in activeUgvs"
            :key="ugv.id"
            @click="selectUgv(ugv)"
            :class="{'border-blue-500 ring-2 ring-blue-200': selectedUgv && selectedUgv.id === ugv.id}"
            class="bg-gray-50 p-4 rounded-lg border border-gray-200 cursor-pointer hover:shadow-sm transition-shadow duration-200 flex flex-col"
          >
            <div class="flex justify-between items-start mb-2">
              <div class="flex items-center">
                <i class="bx bx-bot text-2xl text-gray-700 mr-2"></i>
                <h3 class="text-lg font-semibold text-gray-800">{{ ugv.id }}</h3>
              </div>
              <span :class="{'bg-blue-100 text-blue-800': ugv.status === 'moving', 'bg-green-100 text-green-800': ugv.status === 'working', 'bg-yellow-100 text-yellow-800': ugv.status === 'idle'}" class="text-xs font-medium px-2.5 py-0.5 rounded-full">
                {{ ugv.status }}
              </span>
            </div>
            <p class="text-gray-600 text-sm mb-2">{{ ugv.task }}</p>
            <p class="text-gray-600 text-sm mb-3"><i class="bx bx-map text-gray-500 mr-1"></i>{{ ugv.location }}</p>

            <div class="w-full bg-gray-200 rounded-full h-2.5 mb-3">
              <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: ugv.progress + '%' }"></div>
            </div>
            <p class="text-sm font-medium text-gray-700 mb-3">{{ ugv.progress }}% complete</p>

            <div class="flex justify-between items-center text-gray-700 text-sm">
              <span class="flex items-center"><i class="bx bx-battery text-gray-500 mr-1"></i>{{ ugv.battery }}%</span>
              <span class="flex items-center"><i class="bx bx-wifi text-gray-500 mr-1"></i>{{ ugv.connectionStatus }}</span>
              <span class="flex items-center"><i class="bx bx-tachometer text-gray-500 mr-1"></i>{{ ugv.speed }} km/h</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Basic Controls Section (Right Column) -->
      <div class="lg:col-span-1 bg-white rounded-lg shadow-md p-6 h-full">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Basic Controls</h2>
        <div v-if="selectedUgv" class="flex flex-col p-6 bg-gray-50 rounded-lg h-full border border-gray-200">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-2xl font-bold text-gray-800">{{ selectedUgv.id }}</h3>
            <button class="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition-colors flex items-center text-sm">
              <i class="bx bx-wifi mr-2"></i>Teleoperation
            </button>
          </div>

          <div class="grid grid-cols-3 gap-3 mb-6">
            <button @click="controlUgv('start')" class="bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center text-lg font-semibold">
              <i class="bx bx-play mr-2"></i> Start
            </button>
            <button @click="controlUgv('pause')" class="bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center text-lg font-semibold">
              <i class="bx bx-pause mr-2"></i> Pause
            </button>
            <button @click="controlUgv('stop')" class="bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center text-lg font-semibold">
              <i class="bx bx-stop mr-2"></i> Stop
            </button>
          </div>

          <h3 class="text-lg font-semibold text-gray-800 mb-3">Current Status</h3>
          <div class="space-y-2 text-gray-700 text-base">
            <p><span class="font-medium">Task:</span> {{ selectedUgv.task }}</p>
            <p><span class="font-medium">Status:</span> {{ selectedUgv.status }}</p>
            <p><span class="font-medium">Progress:</span> {{ selectedUgv.progress }}%</p>
            <p><span class="font-medium">Battery:</span> {{ selectedUgv.battery }}%</p>
          </div>

        </div>
        <div v-else class="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-lg h-full text-center border border-gray-200">
          <i class="bx bx-robot text-6xl text-gray-400 mb-4"></i>
          <p class="text-lg text-gray-600">No UGV Selected</p>
          <p class="text-sm text-gray-500 mt-2">Select a UGV from the list to control it</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Reactive state for active tab
const activeTab = ref('overview'); // 'overview' or 'teleoperation'

// Reactive state for selected UGV
const selectedUgv = ref(null);

// Dummy data for active UGVs
const activeUgvs = ref([
  {
    id: 'UGV-001',
    status: 'moving',
    task: 'patrol',
    location: 'Block A-12',
    progress: 65,
    battery: 85,
    connectionStatus: 'Connected',
    speed: 8,
  },
  {
    id: 'UGV-002',
    status: 'working',
    task: 'spray',
    location: 'Block B-8',
    progress: 30,
    battery: 72,
    connectionStatus: 'Connected',
    speed: 5,
  },
  {
    id: 'UGV-003',
    status: 'idle',
    task: 'awaiting orders',
    location: 'Charging Station',
    progress: 100,
    battery: 98,
    connectionStatus: 'Connected',
    speed: 0,
  },
  {
    id: 'UGV-004',
    status: 'moving',
    task: 'transport goods',
    location: 'Warehouse',
    progress: 80,
    battery: 60,
    connectionStatus: 'Connected',
    speed: 10,
  },
]);

// Function to select a UGV for control
const selectUgv = (ugv) => {
  selectedUgv.value = ugv;
};

// Placeholder for UGV control actions
const controlUgv = (action) => {
  if (selectedUgv.value) {
    alert(`Command sent to ${selectedUgv.value.id}: ${action}`);
    // In a real application, you would send this command to a backend service
    // or update the UGV's status in your data store.
  } else {
    alert('Please select a UGV first.');
  }
};
</script>

<style scoped>
/* No specific scoped styles needed as Tailwind CSS is used extensively */
</style>
