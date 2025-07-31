<template>
  <div class="p-6 bg-gray-50 min-h-screen font-sans">
    <UGVTeleoperationView
      v-if="showTeleoperationPage"
      :ugv-id="selectedUgvForTeleoperation ? selectedUgvForTeleoperation.id : ''"
      :initial-ugv-data="selectedUgvForTeleoperation"
      @back-to-overview="showTeleoperationPage = false"
    />

    <div v-else>
      <div class="flex items-center mb-6">
        <i class="bx bxs-robot text-4xl text-gray-800 mr-3"></i>
        <div>
          <h1 class="text-3xl font-bold text-gray-800">UGV Control Center</h1>
          <p class="text-gray-600">Advanced teleoperation and autonomous control for unmanned ground vehicles</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-2 mb-6 flex space-x-4">
        <button
          @click="activeTab = 'overview'"
          :class="{'bg-blue-600 text-white': activeTab === 'overview', 'text-gray-700 hover:bg-gray-100': activeTab !== 'overview'}"
          class="px-5 py-2 rounded-md font-medium transition-colors duration-200"
        >
          <i class="bx bx-grid-alt mr-2"></i>Overview
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="lg:col-span-1 bg-white rounded-lg shadow-md p-6 h-full">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Active UGVs</h2>
          <div class="space-y-4">
            <div
              v-for="ugv in activeUgvs"
              :key="ugv.id"
              @click="navigateToTeleoperation(ugv)" :class="{'border-blue-500 ring-2 ring-blue-200': selectedUgv && selectedUgv.id === ugv.id}"
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

        <div class="lg:col-span-1 bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">UGV Map Overview</h2>
          <div class="relative flex-grow bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
            <img src="https://placehold.co/600x400/E0E0E0/555555?text=Map+Overview" alt="Map Overview Placeholder" class="w-full h-full object-cover">
            <div class="absolute top-2 left-2 flex flex-col space-y-1 z-10">
              <button class="bg-white p-1.5 rounded-md shadow-md text-gray-700 hover:bg-gray-100"><i class="bx bx-plus text-lg"></i></button>
              <button class="bg-white p-1.5 rounded-md shadow-md text-gray-700 hover:bg-gray-100"><i class="bx bx-minus text-lg"></i></button>
            </div>
            <div class="absolute bottom-2 left-2 text-xs text-gray-600 z-10">
              © Leaflet | © OpenStreetMap contributors
            </div>
            <div v-if="activeUgvs.length > 0" class="absolute z-10"
                 :style="{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }">
              <i class="bx bx-current-location text-green-600 text-3xl animate-pulse"></i>
              <span class="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md shadow-md">{{ activeUgvs[0].id }}</span>
            </div>
            <div v-else class="text-center text-gray-600">No UGVs to display on map.</div>
          </div>
          <div class="mt-4 text-sm text-gray-700">
            <p>This map shows the approximate location of all active UGVs.</p>
            <p>Click on a UGV card on the left to enter its dedicated Teleoperation view.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import UGVTeleoperationView from '../views/TeleoperationUGVView.vue'; // Import the teleoperation view component

// Reactive state for active tab
const activeTab = ref('overview');

// Reactive state for selected UGV in the overview (will be primarily used for passing data)
const selectedUgv = ref(null);

// Reactive state to control visibility of UGVTeleoperationView
const showTeleoperationPage = ref(false);
const selectedUgvForTeleoperation = ref(null); // Data to pass to teleoperation view

// Real data for the single active UGV
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
    lat: '2.7768°N', // Added for teleoperation view
    lng: '102.9195°E', // Added for teleoperation view
    heading: '45', // Added for teleoperation view
    signal: '95', // Added for teleoperation view
    currentTask: 'Patrolling', // Added for teleoperation view
    batteryHealth: 'Good', // Added for teleoperation view
    lastCommunication: 'Just now', // Added for teleoperation view
    errorCodes: '', // Added for teleoperation view
  },
]);

// Function to "navigate" to the Teleoperation page
const navigateToTeleoperation = (ugv) => {
  if (ugv) {
    selectedUgvForTeleoperation.value = ugv;
    showTeleoperationPage.value = true;
  } else {
    alert('Please select a UGV first to go to Teleoperation mode.');
  }
};
</script>

<style scoped>
/* No specific scoped styles needed as Tailwind CSS is used extensively */
</style>