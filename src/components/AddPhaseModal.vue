<template>
  <div v-if="show" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl relative">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Add New Phase</h2>
      <button @click="closeModal" class="absolute top-5 right-5 text-gray-400 hover:text-gray-600">
        <i class="bx bx-x text-3xl"></i>
      </button>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Basic Information</h3>
          <div class="mb-4">
            <label for="phaseName" class="block text-sm font-medium text-gray-700 mb-1">Phase Name</label>
            <input type="text" id="phaseName" v-model="form.phaseName"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                   placeholder="Enter phase name">
          </div>
          <div class="mb-4">
            <label for="phaseNumber" class="block text-sm font-medium text-gray-700 mb-1">Phase Number</label>
            <input type="number" id="phaseNumber" v-model.number="form.phaseNumber"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                   placeholder="e.g., 1">
          </div>
          <div class="mb-4">
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea id="description" v-model="form.description" rows="3"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Add a description for the phase"></textarea>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Details</h3>
          <div class="mb-4">
            <label for="totalArea" class="block text-sm font-medium text-gray-700 mb-1">Total Area (hectares)</label>
            <input type="number" id="totalArea" v-model.number="form.totalArea"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                   placeholder="0">
          </div>
          <div class="mb-4">
            <label for="expectedBlocks" class="block text-sm font-medium text-gray-700 mb-1">Expected Blocks</label>
            <input type="number" id="expectedBlocks" v-model.number="form.expectedBlocks"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                   placeholder="0">
          </div>
          <div class="mb-4">
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select id="status" v-model="form.status"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="Development">Development</option>
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div class="mb-4">
            <label for="establishedDate" class="block text-sm font-medium text-gray-700 mb-1">Established Date</label>
            <input type="date" id="establishedDate" v-model="form.establishedDate"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-4 mt-8">
        <button @click="closeModal"
                class="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button @click="createPhase"
                class="px-5 py-2 rounded-lg bg-green-600 text-white shadow-md hover:bg-green-700 transition-colors">
          {{ phaseData ? 'Update Phase' : 'Create Phase' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  phaseData: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'add-phase', 'update-phase']);

const form = ref({
  phaseName: '',
  phaseNumber: null,
  description: '',
  totalArea: 0,
  expectedBlocks: 0,
  status: 'Development', // Default status
  establishedDate: getCurrentDateForInput()
});

watch(() => props.phaseData, (newVal) => {
  if (newVal) {
    form.value = { ...newVal };
  } else {
    resetForm();
  }
}, { immediate: true });

function getCurrentDateForInput() {
  const today = new Date();
  // Using Malaysia timezone (GMT+8) for current date
  const malaysiaTime = new Date(today.toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }));
  return malaysiaTime.toISOString().split('T')[0];
}

const closeModal = () => {
  emit('close');
  resetForm();
};

const createPhase = () => {
  if (props.phaseData) {
    emit('update-phase', { ...form.value });
  } else {
    emit('add-phase', { ...form.value });
  }
};

const resetForm = () => {
  form.value = {
    phaseName: '',
    phaseNumber: null,
    description: '',
    totalArea: 0,
    expectedBlocks: 0,
    status: 'Development',
    establishedDate: getCurrentDateForInput()
  };
};
</script>

<style scoped>
/* Add any specific styles if needed */
</style>