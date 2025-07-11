<template>
  <div class="flex-grow p-6 bg-gray-100 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">MPOB Kratong Area Management</h1>
      <button
        @click="showAddBlockModal = true"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center"
      >
        <i class="bx bx-plus mr-2"></i> Add Block
      </button>
    </div>
    <p class="text-gray-600 mb-8">Comprehensive plantation management with phase structure and tree tracking</p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Total Phases</p>
          <p class="text-3xl font-bold text-gray-800">{{ phasesCount }}</p>
        </div>
        <div class="p-3 bg-blue-100 rounded-full text-blue-500">
          <i class="bx bx-layer text-2xl"></i>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Total Blocks</p>
          <p class="text-3xl font-bold text-gray-800">{{ filteredBlocks.length }}</p>
        </div>
        <div class="p-3 bg-green-100 rounded-full text-green-500">
          <i class="bx bx-map-alt text-2xl"></i>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Total Trees</p>
          <p class="text-3xl font-bold text-gray-800">{{ totalTreesInBlocks }}</p>
        </div>
        <div class="p-3 bg-purple-100 rounded-full text-purple-500">
          <i class="bx bxs-tree text-2xl"></i>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Total Area</p>
          <p class="text-3xl font-bold text-gray-800">{{ totalAreaInBlocks.toFixed(1) }} ha</p>
        </div>
        <div class="p-3 bg-orange-100 rounded-full text-orange-500">
          <i class="bx bx-map-pin text-2xl"></i>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Tree Health</p>
          <p class="text-3xl font-bold text-gray-800">50%</p>
        </div>
        <div class="p-3 bg-red-100 rounded-full text-red-500">
          <i class="bx bx-heart-circle text-2xl"></i>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Avg Trees/ha</p>
          <p class="text-3xl font-bold text-gray-800">{{ avgTreesPerHaInBlocks.toFixed(0) }}</p>
        </div>
        <div class="p-3 bg-yellow-100 rounded-full text-yellow-500">
          <i class="bx bx-bar-chart-alt text-2xl"></i>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-800">
        <router-link to="/areas" class="text-blue-600 hover:underline">Phases ({{ phasesCount }})</router-link>
        <span class="mx-2">/</span>
        Phase {{ phaseId }} - {{ phaseTitle }} Blocks ({{ filteredBlocks.length }})
      </h2>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <input
            type="text"
            placeholder="Search blocks..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="searchQuery"
          />
          <i class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
        <select
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          v-model="selectedStatus"
        >
          <option value="All Status">All Status</option>
          <option value="young_palm">Young Palm</option>
          <option value="active">Active</option>
          <option value="harvesting">Harvesting</option>
          <option value="maintenance">Maintenance</option>
          <option value="replanting">Replanting</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="block in filteredBlocks"
        :key="block.id"
        :class="['bg-white rounded-lg shadow-md p-6 border-t-4', getBorderColor(block.status)]"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold text-gray-800 flex items-center">
            <span
              :class="['inline-flex items-center justify-center w-8 h-8 mr-2 text-white rounded-full text-sm font-bold', getBgColor(block.status)]"
            >{{ block.name.split('-')[1] }}</span> Block {{ block.name }}
          </h3>
          <span
            :class="['text-xs font-semibold px-2.5 py-0.5 rounded-full', getStatusBadgeColor(block.status)]"
          >{{ getDisplayStatus(block.status) }}</span>
        </div>
        <p class="text-gray-600 mb-4">{{ block.description }}</p>
        <div class="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-4">
          <div><span class="font-medium">Block ID</span><p>{{ block.id }}</p></div>
          <div><span class="font-medium">Palm Age</span><p>{{ block.palmAge }} years</p></div>
          <div><span class="font-medium">Total Area</span><p>{{ block.totalArea }} ha ({{ (block.totalArea * 2.47105).toFixed(1) }} acres)</p></div>
          <div><span class="font-medium">Trees</span><p>{{ block.totalTrees }}</p></div>
          <div><span class="font-medium">Variety</span><p>{{ block.variety }}</p></div>
          <div><span class="font-medium">Yield</span><p>{{ block.yield }} kg/ha</p></div>
          <div><span class="font-medium">Tree Health</span><p>{{ block.treeHealth }}%</p></div>
        </div>
        <div class="flex justify-between items-center">
          <router-link
            :to="`/phases/${phaseId}/blocks/${block.id}/trees`"
            class="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 text-sm inline-block"
          >
            View Trees ({{ block.totalTrees }})
          </router-link>
          <div class="flex space-x-2">
            <i
              class="bx bx-trash text-gray-400 hover:text-gray-600 cursor-pointer text-xl"
              @click="confirmDelete(block.id, block.name)"
            ></i>
            <i
              class="bx bx-edit text-gray-400 hover:text-gray-600 cursor-pointer text-xl"
              @click="openEditModal(block)"
            ></i>
          </div>
        </div>
      </div>
      <div v-if="filteredBlocks.length === 0" class="col-span-full text-center text-gray-500 text-lg">
        No blocks found for this phase or with the selected criteria.
      </div>
    </div>

    <AddBlockModal
      :isVisible="showAddBlockModal"
      :phaseId="phaseId"
      :initialBlockNumber="nextBlockNumberForPhase"
      :phases="phasesData"
      @close="showAddBlockModal = false"
      @add-block="addNewBlock"
    />

    <ConfirmationModal
      :isVisible="showDeleteModal"
      title="Delete Block"
      :message="`Are you sure you want to delete block '${blockToDeleteName}'? This action cannot be undone.`"
      confirmButtonText="Delete"
      cancelButtonText="Cancel"
      @confirm="executeDelete"
      @cancel="cancelDelete"
    />

    <EditBlockModal
      :isVisible="showEditModal"
      :blockData="currentBlockToEdit"
      :phases="phasesData"
      @close="showEditModal = false"
      @update-block="updateBlock"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import AddBlockModal from '@/components/AddBlockModal.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue'; // Import ConfirmationModal
import EditBlockModal from '@/components/EditBlockModal.vue'; // Import EditBlockModal

const route = useRoute();
const phaseId = computed(() => parseInt(route.params.phaseId));

const showAddBlockModal = ref(false);

// Reactive data for delete modal
const showDeleteModal = ref(false);
const blockToDeleteId = ref(null);
const blockToDeleteName = ref('');

// Reactive data for edit modal
const showEditModal = ref(false);
const currentBlockToEdit = ref(null);

// Dummy data for blocks - you would fetch this from an API in a real application
const allBlocks = ref([
  {
    id: 'block-1-01',
    phaseId: 1,
    name: 'A-01',
    status: 'harvesting',
    description: 'First block in the North section, currently undergoing harvesting.',
    palmAge: 9,
    totalArea: 20.5,
    totalTrees: 2788,
    variety: 'Tenera',
    yield: 22000,
    treeHealth: 50,
    established: '2015-03-15',
    treesPerHa: 136,
    siteConditions: {
      soilType: 'Clay',
      drainage: 'Good',
      slope: 'Flat (0-3°)',
      accessibility: 'Good',
    },
  },
  {
    id: 'block-1-02',
    phaseId: 1,
    name: 'A-02',
    status: 'active',
    description: 'Second block in the North section, actively producing.',
    palmAge: 9,
    totalArea: 18.3,
    totalTrees: 2489,
    variety: 'Tenera',
    yield: 21500,
    treeHealth: 70,
    established: '2015-03-15',
    treesPerHa: 136,
    siteConditions: {
      soilType: 'Clay',
      drainage: 'Good',
      slope: 'Flat (0-3°)',
      accessibility: 'Good',
    },
  },
  {
    id: 'block-2-01',
    phaseId: 2,
    name: 'B-01',
    status: 'young_palm',
    description: 'Block 01 in the East section, with new planting.',
    palmAge: 2,
    totalArea: 30.0,
    totalTrees: 4080,
    variety: 'Dura',
    yield: 5000,
    treeHealth: 90,
    established: '2023-01-01',
    treesPerHa: 136,
    siteConditions: {
      soilType: 'Clay',
      drainage: 'Good',
      slope: 'Flat (0-3°)',
      accessibility: 'Good',
    },
  },
  {
    id: 'block-3-01',
    phaseId: 3,
    name: 'C-01',
    status: 'maintenance',
    description: 'New development block in the South section.',
    palmAge: 0,
    totalArea: 50.0,
    totalTrees: 0,
    variety: 'N/A',
    yield: 0,
    treeHealth: 0,
    established: '2024-06-01',
    treesPerHa: 0,
    siteConditions: {
      soilType: 'Clay',
      drainage: 'Good',
      slope: 'Flat (0-3°)',
      accessibility: 'Good',
    },
  },
  {
    id: 'block-1-03',
    phaseId: 1,
    name: 'A-03',
    status: 'replanting',
    description: 'Replanting efforts ongoing in this block.',
    palmAge: 1,
    totalArea: 15.0,
    totalTrees: 1800,
    variety: 'Various',
    yield: 0,
    treeHealth: 70,
    established: '2024-03-01',
    treesPerHa: 120,
    siteConditions: {
      soilType: 'Clay',
      drainage: 'Good',
      slope: 'Flat (0-3°)',
      accessibility: 'Good',
    },
  },
]);

// Dummy data for phases (to get phaseTitle and phasesCount for the breadcrumb and modal)
const phasesData = ref([
  { id: 1, title: 'Phase 1 - North Section' },
  { id: 2, title: 'Phase 2 - East Section' },
  { id: 3, title: 'Phase 3 - South Section' },
  { id: 4, title: 'Phase 4 - West Section' },
  { id: 5, title: 'Phase 5 - Central Section' }
]);


const selectedStatus = ref('All Status');
const searchQuery = ref('');

// Computed property to filter blocks based on phaseId and search/status
const filteredBlocks = computed(() => {
  let filtered = allBlocks.value.filter(block => block.phaseId === phaseId.value);

  if (selectedStatus.value !== 'All Status') {
    filtered = filtered.filter(block => block.status === selectedStatus.value);
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      block =>
        block.name.toLowerCase().includes(query) ||
        block.description.toLowerCase().includes(query) ||
        `block ${block.name.toLowerCase()}`.includes(query)
    );
  }

  return filtered;
});

// Computed properties for summary cards specific to the displayed blocks
const totalTreesInBlocks = computed(() => {
  return filteredBlocks.value.reduce((sum, block) => sum + block.totalTrees, 0);
});

const totalAreaInBlocks = computed(() => {
  return filteredBlocks.value.reduce((sum, block) => sum + block.totalArea, 0);
});

const avgTreesPerHaInBlocks = computed(() => {
  if (totalAreaInBlocks.value === 0) return 0;
  return totalTreesInBlocks.value / totalAreaInBlocks.value;
});

// Computed property for phase title in breadcrumb
const phaseTitle = computed(() => {
  const phase = phasesData.value.find(p => p.id === phaseId.value);
  return phase ? phase.title : 'Unknown Phase';
});

const phasesCount = computed(() => {
  return phasesData.value.length;
});

// Computed property to determine the next available block number for the current phase
const nextBlockNumberForPhase = computed(() => {
  const blocksInCurrentPhase = allBlocks.value.filter(block => block.phaseId === phaseId.value);
  if (blocksInCurrentPhase.length === 0) {
    return 1;
  }
  const maxBlockNumber = Math.max(...blocksInCurrentPhase.map(block => parseInt(block.name.split('-')[1])));
  return maxBlockNumber + 1;
});


// Method to add a new block
const addNewBlock = (newBlockData) => {
  const existingBlock = allBlocks.value.find(block => block.id === newBlockData.id);
  if (existingBlock) {
    console.warn(`Block with ID ${newBlockData.id} already exists. Skipping addition.`);
    newBlockData.id = `${newBlockData.id}-${Date.now()}`;
  }
  allBlocks.value.push(newBlockData);
};

// Method to initiate delete confirmation
const confirmDelete = (id, name) => {
  blockToDeleteId.value = id;
  blockToDeleteName.value = name;
  showDeleteModal.value = true;
};

// Method to execute delete after confirmation
const executeDelete = () => {
  allBlocks.value = allBlocks.value.filter(block => block.id !== blockToDeleteId.value);
  showDeleteModal.value = false;
  blockToDeleteId.value = null;
  blockToDeleteName.value = '';
};

// Method to cancel delete
const cancelDelete = () => {
  showDeleteModal.value = false;
  blockToDeleteId.value = null;
  blockToDeleteName.value = '';
};

// Method to open the edit modal with the selected block's data
const openEditModal = (block) => {
  currentBlockToEdit.value = { ...block }; // Create a copy to avoid direct mutation
  showEditModal.value = true;
};

// Method to update an existing block
const updateBlock = (updatedBlockData) => {
  const index = allBlocks.value.findIndex(block => block.id === updatedBlockData.id);
  if (index !== -1) {
    allBlocks.value[index] = updatedBlockData;
  }
  showEditModal.value = false;
  currentBlockToEdit.value = null;
};


// Helper function to get display string for status (e.g., 'young_palm' -> 'Young Palm')
const getDisplayStatus = (status) => {
  switch (status) {
    case 'young_palm': return 'Young Palm';
    case 'active': return 'Active';
    case 'harvesting': return 'Harvesting';
    case 'maintenance': return 'Maintenance';
    case 'replanting': return 'Replanting';
    default: return status;
  }
};

// Helper functions for dynamic styling based on status (for blocks)
const getBorderColor = (status) => {
  switch (status) {
    case 'active':
      return 'border-green-500';
    case 'harvesting':
      return 'border-orange-500';
    case 'replanting':
      return 'border-purple-500';
    case 'maintenance':
      return 'border-yellow-500';
    case 'young_palm':
      return 'border-blue-500';
    default:
      return 'border-gray-300';
  }
};

const getBgColor = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-500';
    case 'harvesting':
      return 'bg-orange-500';
    case 'replanting':
      return 'bg-purple-500';
    case 'maintenance':
      return 'bg-yellow-500';
    case 'young_palm':
      return 'bg-blue-500';
    default:
      return 'bg-gray-400';
  }
};

const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-700';
    case 'harvesting':
      return 'bg-orange-100 text-orange-700';
    case 'replanting':
      return 'bg-purple-100 text-purple-700';
    case 'maintenance':
      return 'bg-yellow-100 text-yellow-700';
    case 'young_palm':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};
</script>

<style scoped>
/* No specific scoped styles are needed as Tailwind CSS classes are used directly in the template. */
</style>