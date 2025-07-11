<template>
  <transition name="fade">
    <div v-if="isVisible" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 transform transition-all duration-300">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-gray-800">Add New Phase</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <i class="bx bx-x text-2xl"></i>
          </button>
        </div>

        <form @submit.prevent="submitPhase">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
            <div>
              <label for="phaseName" class="block text-sm font-medium text-gray-700 mb-1">Phase Name</label>
              <input
                type="text"
                id="phaseName"
                v-model="newPhase.title"
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., Phase 1 - North Section"
                required
              />
            </div>
            <div>
              <label for="phaseNumber" class="block text-sm font-medium text-gray-700 mb-1">Phase Number</label>
              <input
                type="number"
                id="phaseNumber"
                v-model.number="newPhase.id"
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., 1"
                min="1"
                required
              />
            </div>
            <div class="md:col-span-2">
              <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="description"
                v-model="newPhase.description"
                rows="3"
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Brief description of the phase"
              ></textarea>
            </div>
            <div>
              <label for="totalArea" class="block text-sm font-medium text-gray-700 mb-1">Total Area (hectares)</label>
              <input
                type="number"
                id="totalArea"
                v-model.number="newPhase.totalArea"
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., 250.5"
                step="0.1"
                required
              />
            </div>
            <div>
              <label for="expectedBlocks" class="block text-sm font-medium text-gray-700 mb-1">Expected Blocks</label>
              <input
                type="number"
                id="expectedBlocks"
                v-model.number="newPhase.blocks"
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., 5"
                min="0"
              />
            </div>
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                id="status"
                v-model="newPhase.status"
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              >
                <option value="active">Active</option>
                <option value="development">Development</option>
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label for="establishedDate" class="block text-sm font-medium text-gray-700 mb-1">Established Date</label>
              <input
                type="date"
                id="establishedDate"
                v-model="newPhase.established"
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label for="section" class="block text-sm font-medium text-gray-700 mb-1">Section</label>
              <input
                type="text"
                id="section"
                v-model="newPhase.section"
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., North"
                required
              />
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-150 ease-in-out"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-150 ease-in-out"
            >
              Create Phase
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  initialId: { // Prop to suggest the next available ID
    type: Number,
    default: 1
  }
});

const emit = defineEmits(['close', 'add-phase']);

// Reactive form data for the new phase
const newPhase = ref({
  id: props.initialId,
  title: '',
  description: '',
  totalArea: null,
  blocks: null,
  status: 'development', // Default status
  established: '',
  avgYield: 0.0, // Default to 0
  treesPerHa: 0, // Default to 0
  totalTrees: 0, // Default to 0
  section: '' // New field
});

// Watch for changes in initialId prop to update newPhase.id
watch(() => props.initialId, (newId) => {
  newPhase.value.id = newId;
});

const closeModal = () => {
  emit('close');
  resetForm();
};

const submitPhase = () => {
  // Basic validation (can be enhanced with a validation library)
  if (!newPhase.value.title || !newPhase.value.id || newPhase.value.totalArea === null || !newPhase.value.established || !newPhase.value.section) {
    alert('Please fill in all required fields: Phase Name, Phase Number, Total Area, Established Date, and Section.');
    return;
  }

  // Ensure blocks is a number, default to 0 if null/empty
  newPhase.value.blocks = newPhase.value.blocks || 0;
  newPhase.value.totalTrees = newPhase.value.totalTrees || 0; // Ensure totalTrees is not null

  emit('add-phase', { ...newPhase.value }); // Emit a copy of the phase data
  closeModal(); // Close the modal after submission
};

const resetForm = () => {
  newPhase.value = {
    id: props.initialId, // Reset to the latest suggested ID
    title: '',
    description: '',
    totalArea: null,
    blocks: null,
    status: 'development',
    established: '',
    avgYield: 0.0,
    treesPerHa: 0,
    totalTrees: 0,
    section: ''
  };
};
</script>

<style scoped>
/* Transition styles for fade effect */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>