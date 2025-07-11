<template>
  <div v-if="isVisible" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center p-6 border-b">
        <h3 class="text-2xl font-bold text-gray-800">Add New Tree to Block {{ blockName }}</h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <i class="bx bx-x text-3xl"></i>
        </button>
      </div>
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <h4 class="text-lg font-semibold text-gray-700 mb-4">Basic Information</h4>
          <div class="space-y-4">
            <div>
              <label for="treeName" class="block text-sm font-medium text-gray-700">Tree Name (e.g., T001)</label>
              <input type="text" id="treeName" v-model="newTree.name"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label for="treeTag" class="block text-sm font-medium text-gray-700">Tag (QR/RFID)</label>
              <input type="text" id="treeTag" v-model="newTree.tag"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label for="treeHealth" class="block text-sm font-medium text-gray-700">Health (1-10)</label>
              <input type="number" id="treeHealth" v-model.number="newTree.health" min="1" max="10"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label for="healthStatus" class="block text-sm font-medium text-gray-700">Health Status</label>
              <select id="healthStatus" v-model="newTree.healthStatus"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="healthy">Healthy</option>
                <option value="diseased">Diseased</option>
                <option value="under_observation">Under Observation</option>
              </select>
            </div>
            <div>
              <label for="treeAge" class="block text-sm font-medium text-gray-700">Age (years)</label>
              <input type="number" id="treeAge" v-model.number="newTree.age"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label for="treeHeight" class="block text-sm font-medium text-gray-700">Height (m)</label>
              <input type="number" id="treeHeight" v-model.number="newTree.height" step="0.1"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
          </div>
        </div>

        <div>
          <h4 class="text-lg font-semibold text-gray-700 mt-6 mb-4 md:mt-0">Yield & Monitoring</h4>
          <div class="space-y-4">
            <div>
              <label for="treeYield" class="block text-sm font-medium text-gray-700">Estimated Yield (kg)</label>
              <input type="number" id="treeYield" v-model.number="newTree.yield"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label for="lastCheckDate" class="block text-sm font-medium text-gray-700">Last Check Date</label>
              <input type="date" id="lastCheckDate" v-model="newTree.lastCheck"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label for="palmVariety" class="block text-sm font-medium text-gray-700">Palm Variety</label>
              <select id="palmVariety" v-model="newTree.variety"
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
              <div v-for="(disease, index) in newTree.diseases" :key="index" class="flex items-center space-x-2">
                <input type="text" v-model="newTree.diseases[index]"
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
        <button @click="addTree"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
          Add Tree
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
  blockId: {
    type: String,
    required: true,
  },
  blockName: {
    type: String,
    required: true,
  },
  phaseId: {
    type: Number,
    required: true,
  }
});

const emit = defineEmits(['close', 'add-tree']);

const initialTreeState = () => ({
  name: '',
  tag: '',
  health: 10,
  healthStatus: 'healthy',
  age: 0,
  yield: 0,
  height: 0,
  lastCheck: new Date().toISOString().slice(0, 10), // Current date
  variety: 'Tenera',
  diseases: [],
  // These will be populated from props when adding
  blockId: props.blockId,
  blockName: props.blockName,
  phaseId: props.phaseId,
});

const newTree = ref(initialTreeState());

// Reset the form when the modal opens/closes
watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    newTree.value = initialTreeState();
    newTree.value.blockId = props.blockId;
    newTree.value.blockName = props.blockName;
    newTree.value.phaseId = props.phaseId;
  }
});

const addDisease = () => {
  newTree.value.diseases.push('');
};

const removeDisease = (index) => {
  newTree.value.diseases.splice(index, 1);
};

const addTree = () => {
  // Basic validation
  if (!newTree.value.name || !newTree.value.tag || newTree.value.health === null) {
    alert('Please fill in Tree Name, Tag, and Health.');
    return;
  }

  emit('add-tree', { ...newTree.value });
  emit('close');
};
</script>

<style scoped>
/* Tailwind handles most styling */
</style>