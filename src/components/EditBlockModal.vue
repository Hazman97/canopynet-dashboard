<template>
  <div v-if="isVisible" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center p-6 border-b">
        <h3 class="text-2xl font-bold text-gray-800">Edit Block: {{ editedBlock.name }}</h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <i class="bx bx-x text-3xl"></i>
        </button>
      </div>
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <h4 class="text-lg font-semibold text-gray-700 mb-4">Basic Information</h4>
          <div class="space-y-4">
            <div>
              <label for="blockName" class="block text-sm font-medium text-gray-700">Block Name</label>
              <input type="text" id="blockName" v-model="editedBlock.name"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label for="blockNumber" class="block text-sm font-medium text-gray-700">Block Number</label>
              <input type="number" id="blockNumber" v-model.number="editedBlock.blockNumber"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label for="phaseSelect" class="block text-sm font-medium text-gray-700">Phase</label>
              <select id="phaseSelect" v-model.number="editedBlock.phaseId" :disabled="true"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50">
                <option v-for="phase in phases" :key="phase.id" :value="phase.id">
                  {{ phase.title }}
                </option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="areaHectares" class="block text-sm font-medium text-gray-700">Area (hectares)</label>
                <input type="number" id="areaHectares" v-model.number="editedBlock.totalArea" @input="updateTotalTrees"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label for="areaAcres" class="block text-sm font-medium text-gray-700">Area (acres)</label>
                <input type="number" id="areaAcres" :value="computedAreaAcres" readonly
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 text-gray-600 sm:text-sm" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="treesPerHectare" class="block text-sm font-medium text-gray-700">Trees per Hectare</label>
                <input type="number" id="treesPerHectare" v-model.number="editedBlock.treesPerHa" @input="updateTotalTrees"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label for="totalTrees" class="block text-sm font-medium text-gray-700">Total Trees</label>
                <input type="number" id="totalTrees" :value="computedTotalTrees" readonly
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 text-gray-600 sm:text-sm" />
              </div>
            </div>
            <div>
              <label for="estimatedYield" class="block text-sm font-medium text-gray-700">Estimated Yield (kg/ha)</label>
              <input type="number" id="estimatedYield" v-model.number="editedBlock.yield"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
              <textarea id="description" v-model="editedBlock.description" rows="3"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
            </div>
          </div>
        </div>

        <div>
          <h4 class="text-lg font-semibold text-gray-700 mt-6 mb-4 md:mt-0">Palm Information</h4>
          <div class="space-y-4">
            <div>
              <label for="palmVariety" class="block text-sm font-medium text-gray-700">Palm Variety</label>
              <select id="palmVariety" v-model="editedBlock.variety"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="Tenera">Tenera</option>
                <option value="Dura">Dura</option>
                <option value="Pisifera">Pisifera</option>
                <option value="Various">Various</option>
                <option value="N/A">N/A</option>
              </select>
            </div>
            <div>
              <label for="plantingDate" class="block text-sm font-medium text-gray-700">Planting Date</label>
              <input type="date" id="plantingDate" v-model="editedBlock.established"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label for="palmAge" class="block text-sm font-medium text-gray-700">Palm Age (years)</label>
              <input type="number" id="palmAge" v-model.number="editedBlock.palmAge"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label for="statusSelect" class="block text-sm font-medium text-gray-700">Status</label>
              <select id="statusSelect" v-model="editedBlock.status"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="young_palm">Young Palm</option>
                <option value="active">Active</option>
                <option value="harvesting">Harvesting</option>
                <option value="maintenance">Maintenance</option>
                <option value="replanting">Replanting</option>
              </select>
            </div>
          </div>

          <h4 class="text-lg font-semibold text-gray-700 mt-6 mb-4">Site Conditions</h4>
          <div class="space-y-4">
            <div>
              <label for="soilType" class="block text-sm font-medium text-gray-700">Soil Type</label>
              <select id="soilType" v-model="editedBlock.siteConditions.soilType"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="Clay">Clay</option>
                <option value="Loam">Loam</option>
                <option value="Sand">Sand</option>
                <option value="Silt">Silt</option>
              </select>
            </div>
            <div>
              <label for="drainage" class="block text-sm font-medium text-gray-700">Drainage</label>
              <select id="drainage" v-model="editedBlock.siteConditions.drainage"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="Good">Good</option>
                <option value="Moderate">Moderate</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
            <div>
              <label for="slope" class="block text-sm font-medium text-gray-700">Slope</label>
              <select id="slope" v-model="editedBlock.siteConditions.slope"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="Flat (0-3°)">Flat (0-3°)</option>
                <option value="Gentle (3-7°)">Gentle (3-7°)</option>
                <option value="Moderate (7-12°)">Moderate (7-12°)</option>
                <option value="Steep (>12°)">Steep (>12°)</option>
              </select>
            </div>
            <div>
              <label for="accessibility" class="block text-sm font-medium text-gray-700">Accessibility</label>
              <select id="accessibility" v-model="editedBlock.siteConditions.accessibility"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="Good">Good</option>
                <option value="Moderate">Moderate</option>
                <option value="Poor">Poor</option>
              </select>
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
import { ref, watch, computed } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  blockData: { // This prop will receive the block object to be edited
    type: Object,
    default: null,
  },
  phases: { // To populate the phase dropdown, though it will be disabled
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['close', 'update-block']);

// Create a reactive copy of blockData to allow editing
const editedBlock = ref({});

// Watch for changes in blockData prop and update editedBlock
watch(() => props.blockData, (newVal) => {
  if (newVal) {
    editedBlock.value = { ...newVal }; // Deep copy to avoid mutating original prop
    // Ensure siteConditions is initialized if it might be missing in some dummy data
    if (!editedBlock.value.siteConditions) {
      editedBlock.value.siteConditions = {
        soilType: 'Clay',
        drainage: 'Good',
        slope: 'Flat (0-3°)',
        accessibility: 'Good',
      };
    }
  }
}, { immediate: true }); // Run immediately when component is mounted/prop is set

const HECTARES_TO_ACRES = 2.47105;

const computedAreaAcres = computed(() => {
  return (editedBlock.value.totalArea * HECTARES_TO_ACRES).toFixed(2);
});

const computedTotalTrees = computed(() => {
  return Math.round(editedBlock.value.totalArea * editedBlock.value.treesPerHa);
});

const updateTotalTrees = () => {
  editedBlock.value.totalTrees = computedTotalTrees.value;
};

const saveChanges = () => {
  // Simple validation (can be expanded)
  if (!editedBlock.value.name || !editedBlock.value.blockNumber || !editedBlock.value.totalArea || !editedBlock.value.treesPerHa) {
    alert('Please fill in all required basic information fields (Block Name, Block Number, Area, Trees per Hectare).');
    return;
  }

  // Emit the updated block data
  emit('update-block', { ...editedBlock.value });
  emit('close');
};

// Also update totalTrees when area or treesPerHa change within the modal
watch(() => [editedBlock.value.totalArea, editedBlock.value.treesPerHa], () => {
  editedBlock.value.totalTrees = computedTotalTrees.value;
}, { immediate: true });

</script>

<style scoped>
/* No specific scoped styles for the modal are needed, Tailwind handles most. */
</style>