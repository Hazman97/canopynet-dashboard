<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all scale-100 opacity-100">
      <div class="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
        <h2 class="text-2xl font-semibold text-gray-800">Add New Worker</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <i class="bx bx-x text-3xl"></i>
        </button>
      </div>

      <div class="p-6">
        <p class="text-gray-600 mb-6">Enter basic worker information. Performance data will be tracked automatically.</p>

        <h3 class="text-lg font-medium text-gray-700 mb-4">Basic Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label for="workerName" class="block text-sm font-medium text-gray-700">Worker Name <span class="text-red-500">*</span></label>
            <input type="text" id="workerName" v-model="newWorker.name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter full name">
          </div>
          <div>
            <label for="workerCode" class="block text-sm font-medium text-gray-700">Worker Code <span class="text-red-500">*</span></label>
            <input type="text" id="workerCode" v-model="newWorker.code" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., A001, M001">
          </div>
          <div>
            <label for="gangNumber" class="block text-sm font-medium text-gray-700">Gang Number <span class="text-red-500">*</span></label>
            <input type="text" id="gangNumber" v-model="newWorker.gangNo" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., 1">
          </div>
          <div>
            <label for="blockNumber" class="block text-sm font-medium text-gray-700">Block Number</label>
            <input type="text" id="blockNumber" v-model="newWorker.blockNo" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., A-12, B-8">
          </div>
        </div>

        <h3 class="text-lg font-medium text-gray-700 mb-4">Work Assignment</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label for="workDivision" class="block text-sm font-medium text-gray-700">Work Division <span class="text-red-500">*</span></label>
            <select id="workDivision" v-model="newWorker.workDivision" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Select Work Division</option>
              <option v-for="division in workDivisions" :key="division" :value="division">{{ division }}</option>
            </select>
          </div>
          <div>
            <label for="workNature" class="block text-sm font-medium text-gray-700">Work Nature <span class="text-red-500">*</span></label>
            <select id="workNature" v-model="newWorker.workNature" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Select Work Nature</option>
              <option v-for="nature in workNatures" :key="nature" :value="nature">{{ nature }}</option>
            </select>
          </div>
        </div>

        <div class="p-4 bg-blue-50 rounded-lg text-blue-800 text-sm flex items-start">
          <i class="bx bx-info-circle text-xl mr-3 mt-0.5"></i>
          <div>
            <p class="font-semibold">Performance Tracking</p>
            <p>Status, attendance, work hours, productivity metrics, and location data will be automatically tracked and updated through the system. You can view detailed performance reports in the <span class="font-medium">Performance Report</span> tab.</p>
          </div>
        </div>
      </div>

      <div class="p-6 border-t border-gray-200 flex justify-end space-x-3 sticky bottom-0 bg-white z-10">
        <button @click="$emit('close')" class="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 transition-colors">
          Cancel
        </button>
        <button @click="addWorker" class="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors">
          Add Worker
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  show: Boolean, // Controls modal visibility
});

const emit = defineEmits(['close', 'add-worker']); // Emits 'add-worker' with the new worker data

// Reactive object for new worker form data
const newWorker = ref({
  id: '', // Will be generated or unique ID from backend
  name: '',
  code: '',
  gangNo: '',
  blockNo: '',
  workDivision: '',
  workNature: '',
  status: 'Active', // Default status for new worker
  avgRating: 0, // Default rating
  presentToday: false, // Default attendance
  totalHours: 0,
});

// Dropdown options based on your provided list
const workDivisions = [
  'General workers',
  'Harvesting',
  'Manuring',
  'Weeding',
  'Pest & Disease',
  'Mechanisation fleet'
];

const workNatures = [
  'Security personnel',
  'Gardeners/Line Sweepers',
  'Mechanical Work',
  'Electrical Work'
];

const addWorker = () => {
  // Basic validation
  if (!newWorker.value.name || !newWorker.value.code || !newWorker.value.gangNo || !newWorker.value.workDivision || !newWorker.value.workNature) {
    alert('Please fill in all required fields (marked with *).');
    return;
  }
  emit('add-worker', { ...newWorker.value });
  // Reset form after submission (optional, depending on desired UX)
  Object.assign(newWorker.value, {
    id: '',
    name: '',
    code: '',
    gangNo: '',
    blockNo: '',
    workDivision: '',
    workNature: '',
    status: 'Active',
    avgRating: 0,
    presentToday: false,
    totalHours: 0,
  });
};
</script>

<style scoped>
/* Any component-specific styles go here. Tailwind CSS handles most styling. */
</style>