<template>
  <div v-if="isVisible" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center p-6 border-b">
        <h3 class="text-2xl font-bold text-gray-800">Edit Tree: {{ editedTree.name }}</h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <i class="bx bx-x text-3xl"></i>
        </button>
      </div>
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <!-- Basic Information -->
        <div>
          <h4 class="text-lg font-semibold text-gray-700 mb-4">Basic Information</h4>
          <div class="space-y-4">
            <div>
              <label for="treeName" class="block text-sm font-medium text-gray-700">Tree Name (e.g., T001)</label>
              <input type="text" id="treeName" v-model="editedTree.name"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label for="treeTag" class="block text-sm font-medium text-gray-700">Tag (QR/RFID)</label>
              <input type="text" id="treeTag" v-model="editedTree.tag"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label for="treeHealth" class="block text-sm font-medium text-gray-700">Health (1-10)</label>
              <input type="number" id="treeHealth" v-model.number="editedTree.health" min="1" max="10"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label for="healthStatus" class="block text-sm font-medium text-gray-700">Health Status</label>
              <select id="healthStatus" v-model="editedTree.healthStatus"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="healthy">Healthy</option>
                <option value="diseased">Diseased</option>
                <option value="under_observation">Under Observation</option>
              </select>
            </div>
            <div>
              <label for="treeAge" class="block text-sm font-medium text-gray-700">Age (years)</label>
              <input type="number" id="treeAge" v-model.number="editedTree.age"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label for="treeHeight" class="block text-sm font-medium text-gray-700">Height (m)</label>
              <input type="number" id="treeHeight" v-model.number="editedTree.height" step="0.1"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
          </div>
        </div>

        <!-- Yield and Last Check -->
        <div>
          <h4 class="text-lg font-semibold text-gray-700 mt-6 mb-4 md:mt-0">Yield & Monitoring</h4>
          <div class="space-y-4">
            <div>
              <label for="treeYield" class="block text-sm font-medium text-gray-700">Estimated Yield (kg)</label>
              <input type="number" id="treeYield" v-model.number="editedTree.yield"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label for="lastCheckDate" class="block text-sm font-medium text-gray-700">Last Check Date</label>
              <input type="date" id="lastCheckDate" v-model="editedTree.lastCheck"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label for="palmVariety" class="block text-sm font-medium text-gray-700">Palm Variety</label>
              <select id="palmVariety" v-model="editedTree.variety"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="Tenera">Tenera</option>
                <option value="Dura">Dura</option>
                <option value="Pisifera">Pisifera</option>
                <option value="Various">Various</option>
                <option value="N/A">N/A</option>
              </select>
            </div>

            <h4 class="text-lg font-semibold text-gray-700 mt-6 mb-4">Diseases</h4>
            <div class="space-y-2">
              <div v-for="(disease, index) in editedTree.diseases" :key="index" class="flex items-center space-x-2">
                <input type="text" v-model="editedTree.diseases[index]"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                <button @click="removeDisease(index)" class="text-red-500 hover:text-red-700">
                  <i class="bx bx-minus-circle text-xl"></i>
                </button>
              </div>
              <button @click="addDisease"
                      class="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm">
                <i class="bx bx-plus mr-1"></i> Add Disease
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="p-6 border-t flex justify-end space-x-3">
        <button @click="$emit('close')"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200">
          Cancel
        </button>
        <button @click="saveChanges"
                class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200">
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  treeData: { // The tree object passed for editing
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'update-tree']);

// Create a local reactive copy of treeData for editing
const editedTree = ref({});

// Watch for changes in treeData prop to update the local copy
watch(() => props.treeData, (newVal) => {
  if (newVal) {
    // Deep copy the object to avoid direct mutation of the prop
    editedTree.value = JSON.parse(JSON.stringify(newVal)); // More robust deep copy
    // Ensure diseases array exists
    if (!editedTree.value.diseases) {
      editedTree.value.diseases = [];
    }
  }
}, { immediate: true }); // immediate: true runs the watcher once immediately on component mount

const addDisease = () => {
  editedTree.value.diseases.push('');
};

const removeDisease = (index) => {
  editedTree.value.diseases.splice(index, 1);
};

const saveChanges = () => {
  // Basic validation
  if (!editedTree.value.name || !editedTree.value.tag || editedTree.value.health === null) {
    alert('Please fill in Tree Name, Tag, and Health.');
    return;
  }

  // Filter out empty disease strings before emitting
  editedTree.value.diseases = editedTree.value.diseases.filter(d => d.trim() !== '');

  emit('update-tree', { ...editedTree.value }); // Emit a copy of the updated tree data
  emit('close');
};
</script>

<style scoped>
/* Tailwind handles most styling */
</style>