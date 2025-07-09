<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
      <div class="flex justify-between items-center p-5 border-b border-gray-200">
        <h3 class="text-2xl font-semibold text-gray-800">
          {{ isEditing ? 'Edit Worker' : 'Add New Worker' }}
        </h3>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <i class="bx bx-x text-3xl"></i>
        </button>
      </div>

      <div class="p-6 overflow-y-auto max-h-[70vh]">
        <h4 class="text-lg font-semibold text-gray-700 mb-4">Basic Information</h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label for="workerName" class="block text-sm font-medium text-gray-700 mb-1">Worker Name <span class="text-red-500">*</span></label>
            <input
              type="text"
              id="workerName"
              v-model="workerForm.name"
              placeholder="e.g. John Doe"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label for="workerCode" class="block text-sm font-medium text-gray-700 mb-1">Worker Code <span class="text-red-500">*</span></label>
            <input
              type="text"
              id="workerCode"
              v-model="workerForm.code"
              placeholder="e.g. A001, M001"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label for="gangNumber" class="block text-sm font-medium text-gray-700 mb-1">Gang Number <span class="text-red-500">*</span></label>
            <input
              type="text"
              id="gangNumber"
              v-model="workerForm.gangNo"
              placeholder="e.g. 1"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label for="blockNumber" class="block text-sm font-medium text-gray-700 mb-1">Block Number</label>
            <input
              type="text"
              id="blockNumber"
              v-model="workerForm.blockNo"
              placeholder="e.g. A-12, B-8"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <h4 class="text-lg font-semibold text-gray-700 mb-4">Work Assignment</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label for="workDivision" class="block text-sm font-medium text-gray-700 mb-1">Work Division <span class="text-red-500">*</span></label>
            <select
              id="workDivision"
              v-model="workerForm.workDivision"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="" disabled>Select Work Division</option>
              <option v-for="division in workerDivisions" :key="division" :value="division">{{ division }}</option>
            </select>
          </div>
          <div>
            <label for="workNature" class="block text-sm font-medium text-gray-700 mb-1">Work Nature <span class="text-red-500">*</span></label>
            <select
              id="workNature"
              v-model="workerForm.workNature"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="" disabled>Select Work Nature</option>
              <option v-for="nature in workerNatures" :key="nature" :value="nature">{{ nature }}</option>
            </select>
          </div>
          <div>
            <label for="totalHours" class="block text-sm font-medium text-gray-700 mb-1">Total Hours (Optional)</label>
            <input
              type="number"
              id="totalHours"
              v-model.number="workerForm.totalHours"
              placeholder="e.g. 8"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label for="avgRating" class="block text-sm font-medium text-gray-700 mb-1">Average Rating (Optional)</label>
            <input
              type="number"
              id="avgRating"
              v-model.number="workerForm.avgRating"
              step="0.1"
              min="0"
              max="5"
              placeholder="e.g. 4.5"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status (Optional)</label>
            <select
              id="status"
              v-model="workerForm.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>Select Status</option>
              <option v-for="status in workerStatuses" :key="status" :value="status">{{ status }}</option>
            </select>
          </div>
        </div>

        <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 flex items-start">
          <i class="bx bx-info-circle text-lg mr-2 mt-0.5"></i>
          <div>
            <p class="font-semibold">Performance Tracking</p>
            <p>Status, attendance, work hours, productivity metrics, and location data will be automatically tracked and updated through the system. You can view detailed performance reports in the Performance Report tab.</p>
          </div>
        </div>
      </div>

      <div class="flex justify-end p-5 border-t border-gray-200 space-x-3">
        <button
          @click="closeModal"
          class="px-5 py-2 rounded-lg text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="submitForm"
          class="px-5 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
        >
          {{ isEditing ? 'Update Worker' : 'Add Worker' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  show: Boolean,
  workerData: { // New prop to pass existing worker data for editing
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'add-worker', 'update-worker']);

const defaultWorkerForm = {
  id: null, // Will be used for editing
  name: '',
  code: '',
  gangNo: '',
  blockNo: null, // Can be null
  workDivision: '',
  workNature: '',
  status: 'Active', // Default status
  avgRating: 0,
  totalHours: 0,
};

const workerForm = ref({ ...defaultWorkerForm });

const isEditing = computed(() => props.workerData !== null);

// Watch for changes in props.show to reset form when modal opens for adding,
// or populate form when modal opens for editing
watch(() => props.show, (newVal) => {
  if (newVal) {
    if (props.workerData) {
      // Editing existing worker
      workerForm.value = { ...props.workerData };
    } else {
      // Adding new worker
      workerForm.value = { ...defaultWorkerForm };
    }
  }
});

const workerDivisions = [
  'General workers',
  'Harvesting',
  'Manuring',
  'Weeding',
  'Pest & Disease',
  'Mechanisation fleet'
];

const workerNatures = [
  'Harvester',
  'Loose Fruit Collection',
  'Tractor A', // Example for Mechanisation fleet
  'Security Personnel', // Example for General workers
  'Spraying', // Example for Pest & Disease
  'Fertilizer Spreader', // Example for Manuring
  'Weeder', // Example for Weeding
  'Pruner', // Example for Pruning (though not a division)
  'Transporter', // Example for Transporting
  'Checker', // Example for Checking
];

const workerStatuses = [
  'Active',
  'Inactive',
  'On break',
  'Absent'
];

const closeModal = () => {
  emit('close');
};

const submitForm = () => {
  // Basic validation (can be expanded)
  if (!workerForm.value.name || !workerForm.value.code || !workerForm.value.gangNo ||
      !workerForm.value.workDivision || !workerForm.value.workNature) {
    alert('Please fill in all required fields.');
    return;
  }

  if (isEditing.value) {
    emit('update-worker', { ...workerForm.value }); // Emit updated worker data
  } else {
    emit('add-worker', { ...workerForm.value }); // Emit new worker data
  }
  closeModal();
};
</script>