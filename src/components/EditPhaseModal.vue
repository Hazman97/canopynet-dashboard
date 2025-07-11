<template>
  <transition name="fade">
    <div v-if="isVisible" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 transform transition-all duration-300">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-gray-800">Edit Phase: {{ editedPhase.title }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <i class="bx bx-x text-2xl"></i>
          </button>
        </div>

        <form @submit.prevent="submitPhase">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
            <div>
              <label for="editPhaseName" class="block text-sm font-medium text-gray-700 mb-1">Phase Name</label>
              <input
                type="text"
                id="editPhaseName"
                v-model="editedPhase.title"
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., Phase 1 - North Section"
                required
              />
            </div>
            <div>
              <label for="editPhaseNumber" class="block text-sm font-medium text-gray-700 mb-1">Phase Number</label>
              <input
                type="number"
                id="editPhaseNumber"
                v-model.number="editedPhase.id"
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 cursor-not-allowed sm:text-sm"
                readonly
                disabled
              />
            </div>
            <div class="md:col-span-2">
              <label for="editDescription" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="editDescription"
                v-model="editedPhase.description"
                rows="3"
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Brief description of the phase"
              ></textarea>
            </div>
            <div>
              <label for="editTotalArea" class="block text-sm font-medium text-gray-700 mb-1">Total Area (hectares)</label>
              <input
                type="number"
                id="editTotalArea"
                v-model.number="editedPhase.totalArea"
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., 250.5"
                step="0.1"
                required
              />
            </div>
            <div>
              <label for="editExpectedBlocks" class="block text-sm font-medium text-gray-700 mb-1">Expected Blocks</label>
              <input
                type="number"
                id="editExpectedBlocks"
                v-model.number="editedPhase.blocks"
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., 5"
                min="0"
              />
            </div>
            <div>
              <label for="editStatus" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                id="editStatus"
                v-model="editedPhase.status"
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
              <label for="editEstablishedDate" class="block text-sm font-medium text-gray-700 mb-1">Established Date</label>
              <input
                type="date"
                id="editEstablishedDate"
                v-model="editedPhase.established"
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label for="editSection" class="block text-sm font-medium text-gray-700 mb-1">Section</label>
              <input
                type="text"
                id="editSection"
                v-model="editedPhase.section"
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., North"
                required
              />
            </div>
            <div>
                <label for="editTotalTrees" class="block text-sm font-medium text-gray-700 mb-1">Total Trees</label>
                <input
                    type="number"
                    id="editTotalTrees"
                    :value="editedPhase.totalTrees"
                    class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 cursor-not-allowed sm:text-sm"
                    readonly
                    disabled
                />
            </div>
            <div>
                <label for="editTreesPerHa" class="block text-sm font-medium text-gray-700 mb-1">Trees/ha</label>
                <input
                    type="number"
                    id="editTreesPerHa"
                    :value="editedPhase.treesPerHa"
                    class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 cursor-not-allowed sm:text-sm"
                    readonly
                    disabled
                />
            </div>
            <div>
                <label for="editAvgYield" class="block text-sm font-medium text-gray-700 mb-1">Avg Yield (kg/ha)</label>
                <input
                    type="number"
                    id="editAvgYield"
                    :value="editedPhase.avgYield"
                    class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 cursor-not-allowed sm:text-sm"
                    readonly
                    disabled
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
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-150 ease-in-out"
            >
              Save Changes
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
  // The phase object passed from the parent for editing
  phaseData: {
    type: Object,
    default: () => ({
      id: null,
      title: '',
      section: '',
      status: 'development',
      description: '',
      established: '',
      totalArea: null,
      avgYield: 0.0,
      treesPerHa: 0,
      totalTrees: 0,
      blocks: 0,
    })
  }
});

const emit = defineEmits(['close', 'update-phase']);

// Create a local reactive copy of the phaseData prop for editing
const editedPhase = ref({});

// Watch the phaseData prop to update the local copy when it changes (i.e., when a new phase is selected for editing)
watch(() => props.phaseData, (newVal) => {
  if (newVal) {
    // Deep copy the object to avoid direct mutation of the prop
    editedPhase.value = { ...newVal };
  }
}, { immediate: true }); // immediate: true runs the watcher once immediately on component mount

const closeModal = () => {
  emit('close');
};

const submitPhase = () => {
  // Basic validation
  if (!editedPhase.value.title || editedPhase.value.totalArea === null || !editedPhase.value.established || !editedPhase.value.section) {
    alert('Please fill in all required fields: Phase Name, Total Area, Established Date, and Section.');
    return;
  }

  // Ensure blocks is a number, default to 0 if null/empty
  editedPhase.value.blocks = editedPhase.value.blocks || 0;

  // Emit the updated phase data
  emit('update-phase', { ...editedPhase.value });
  closeModal(); // Close the modal after submission
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