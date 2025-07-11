<template>
  <div class="flex-grow p-6 bg-gray-100 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">MPOB Kratong Area Management</h1>
      <button
        @click="showAddTreeModal = true"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center"
      >
        <i class="bx bx-plus mr-2"></i> Add Tree
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
          <p class="text-3xl font-bold text-gray-800">{{ blocksCount }}</p>
        </div>
        <div class="p-3 bg-green-100 rounded-full text-green-500">
          <i class="bx bx-map-alt text-2xl"></i>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Total Trees</p>
          <p class="text-3xl font-bold text-gray-800">{{ filteredTrees.length }}</p>
        </div>
        <div class="p-3 bg-purple-100 rounded-full text-purple-500">
          <i class="bx bxs-tree text-2xl"></i>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Total Area</p>
          <p class="text-3xl font-bold text-gray-800">{{ blockTotalArea.toFixed(1) }} ha</p>
        </div>
        <div class="p-3 bg-orange-100 rounded-full text-orange-500">
          <i class="bx bx-map-pin text-2xl"></i>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Tree Health</p>
          <p class="text-3xl font-bold text-gray-800">{{ treeHealthPercentage }}%</p>
        </div>
        <div class="p-3 bg-red-100 rounded-full text-red-500">
          <i class="bx bx-heart-circle text-2xl"></i>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Avg Trees/ha</p>
          <p class="text-3xl font-bold text-gray-800">{{ avgTreesPerHa.toFixed(0) }}</p>
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
        <router-link :to="`/phases/${phaseId}/blocks`" class="text-blue-600 hover:underline">
          Phase {{ phaseId }} - {{ phaseTitle }} Blocks ({{ blocksCount }})
        </router-link>
        <span class="mx-2">/</span>
        Block {{ blockName }} Trees ({{ filteredTrees.length }})
      </h2>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <input
            type="text"
            placeholder="Search trees..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="searchQuery"
          />
          <i class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
        <select
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          v-model="selectedHealthStatus"
        >
          <option value="All Status">All Status</option>
          <option value="healthy">Healthy</option>
          <option value="diseased">Diseased</option>
          <option value="under_observation">Under Observation</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="tree in filteredTrees"
        :key="tree.id"
        :class="['bg-white rounded-lg shadow-md p-6 border-t-4', getBorderColor(tree.healthStatus)]"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold text-gray-800 flex items-center">
            Tree {{ tree.name }}
          </h3>
          <span
            :class="['text-xs font-semibold px-2.5 py-0.5 rounded-full', getStatusBadgeColor(tree.healthStatus)]"
          >{{ getDisplayHealthStatus(tree.healthStatus) }}</span>
        </div>
        <p class="text-gray-600 mb-4">Block {{ tree.blockName }} • {{ tree.variety }}</p>
        <div class="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-4">
          <div><span class="font-medium">Tag</span><p>{{ tree.tag }}</p></div>
          <div><span class="font-medium">Health</span><p>{{ tree.health }}/10</p></div>
          <div><span class="font-medium">Age</span><p>{{ tree.age }} years</p></div>
          <div><span class="font-medium">Yield</span><p>{{ tree.yield }}kg</p></div>
          <div><span class="font-medium">Height</span><p>{{ tree.height }}m</p></div>
          <div><span class="font-medium">Last Check</span><p>{{ tree.lastCheck }}</p></div>
        </div>
        <div v-if="tree.diseases && tree.diseases.length > 0" class="mb-4">
          <span class="font-medium text-sm text-gray-700">Diseases:</span>
          <div class="flex flex-wrap gap-2 mt-1">
            <span v-for="disease in tree.diseases" :key="disease"
                  class="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-700">
              {{ disease }}
            </span>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <button class="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 text-sm">
            View Details
          </button>
          <div class="flex space-x-2">
            <i
              class="bx bx-trash text-gray-400 hover:text-gray-600 cursor-pointer text-xl"
              @click="confirmDelete(tree.id, tree.name)"
            ></i>
            <i
              class="bx bx-edit text-gray-400 hover:text-gray-600 cursor-pointer text-xl"
              @click="openEditModal(tree)"
            ></i>
          </div>
        </div>
      </div>
      <div v-if="filteredTrees.length === 0" class="col-span-full text-center text-gray-500 text-lg">
        No trees found for this block or with the selected criteria.
      </div>
    </div>

    <AddTreeModal
      :isVisible="showAddTreeModal"
      :blockId="blockId"
      :blockName="blockName"
      :phaseId="phaseId"
      @close="showAddTreeModal = false"
      @add-tree="addNewTree"
    />

    <ConfirmationModal
      :isVisible="showDeleteModal"
      title="Delete Tree"
      :message="`Are you sure you want to delete tree '${treeToDeleteName}' (ID: ${treeToDeleteId})? This action cannot be undone.`"
      confirmButtonText="Delete"
      cancelButtonText="Cancel"
      @confirm="executeDelete"
      @cancel="cancelDelete"
    />

    <EditTreeModal
      :isVisible="showEditModal"
      :treeData="currentTreeToEdit"
      @close="showEditModal = false"
      @update-tree="updateTree"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import AddTreeModal from '@/components/AddTreeModal.vue'; // You'll need to create this
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import EditTreeModal from '@/components/EditTreeModal.vue'; // You'll need to create this

const route = useRoute();
const phaseId = computed(() => parseInt(route.params.phaseId));
const blockId = computed(() => route.params.blockId);

const showAddTreeModal = ref(false);
const showDeleteModal = ref(false);
const treeToDeleteId = ref(null);
const treeToDeleteName = ref('');
const showEditModal = ref(false);
const currentTreeToEdit = ref(null);

// Dummy Data (replace with actual API calls)
const allTrees = ref([
  {
    id: 'tree-1-01-T001',
    phaseId: 1,
    blockId: 'block-1-01',
    name: 'T001',
    tag: 'QR001',
    health: 9,
    healthStatus: 'healthy',
    age: 9,
    yield: 28,
    height: 8.5,
    lastCheck: '2024-01-15',
    blockName: 'A-01',
    variety: 'Tenera',
    diseases: [],
  },
  {
    id: 'tree-1-01-T002',
    phaseId: 1,
    blockId: 'block-1-01',
    name: 'T002',
    tag: 'RFID002',
    health: 6,
    healthStatus: 'diseased',
    age: 9,
    yield: 25,
    height: 7.8,
    lastCheck: '2024-01-15',
    blockName: 'A-01',
    variety: 'Tenera',
    diseases: ['Ganoderma', 'Leaf Spot'],
  },
  {
    id: 'tree-1-02-T001',
    phaseId: 1,
    blockId: 'block-1-02',
    name: 'T001',
    tag: 'QR003',
    health: 8,
    healthStatus: 'healthy',
    age: 9,
    yield: 27,
    height: 8.2,
    lastCheck: '2024-02-01',
    blockName: 'A-02',
    variety: 'Tenera',
    diseases: [],
  },
  {
    id: 'tree-2-01-T001',
    phaseId: 2,
    blockId: 'block-2-01',
    name: 'T001',
    tag: 'QR004',
    health: 7,
    healthStatus: 'under_observation',
    age: 2,
    yield: 5,
    height: 3.0,
    lastCheck: '2024-03-10',
    blockName: 'B-01',
    variety: 'Dura',
    diseases: [],
  },
]);

// Dummy data for blocks and phases to populate summary cards and breadcrumbs
const allBlocksData = ref([
  {
    id: 'block-1-01',
    phaseId: 1,
    name: 'A-01',
    totalArea: 20.5,
    totalTrees: 2788,
    treesPerHa: 136,
  },
  {
    id: 'block-1-02',
    phaseId: 1,
    name: 'A-02',
    totalArea: 18.3,
    totalTrees: 2489,
    treesPerHa: 136,
  },
  {
    id: 'block-2-01',
    phaseId: 2,
    name: 'B-01',
    totalArea: 30.0,
    totalTrees: 4080,
    treesPerHa: 136,
  },
  {
    id: 'block-3-01',
    phaseId: 3,
    name: 'C-01',
    totalArea: 50.0,
    totalTrees: 0,
    treesPerHa: 0,
  },
  {
    id: 'block-1-03',
    phaseId: 1,
    name: 'A-03',
    totalArea: 15.0,
    totalTrees: 1800,
    treesPerHa: 120,
  },
]);

const phasesData = ref([
  { id: 1, title: 'Phase 1 - North Section' },
  { id: 2, title: 'Phase 2 - East Section' },
  { id: 3, title: 'Phase 3 - South Section' },
  { id: 4, title: 'Phase 4 - West Section' },
  { id: 5, title: 'Phase 5 - Central Section' }
]);

const selectedHealthStatus = ref('All Status');
const searchQuery = ref('');

// Computed properties for breadcrumbs and summary cards
const phaseTitle = computed(() => {
  const phase = phasesData.value.find(p => p.id === phaseId.value);
  return phase ? phase.title : 'Unknown Phase';
});

const blockName = computed(() => {
  const block = allBlocksData.value.find(b => b.id === blockId.value);
  return block ? block.name : 'Unknown Block';
});

const phasesCount = computed(() => phasesData.value.length);

const blocksCount = computed(() => allBlocksData.value.filter(b => b.phaseId === phaseId.value).length);

const currentBlock = computed(() => {
  return allBlocksData.value.find(b => b.id === blockId.value);
});

const blockTotalArea = computed(() => currentBlock.value ? currentBlock.value.totalArea : 0);

const avgTreesPerHa = computed(() => currentBlock.value ? currentBlock.value.treesPerHa : 0);

const treeHealthPercentage = computed(() => {
  const treesInBlock = filteredTrees.value;
  if (treesInBlock.length === 0) return 0;
  const totalHealthScore = treesInBlock.reduce((sum, tree) => sum + tree.health, 0);
  return ((totalHealthScore / (treesInBlock.length * 10)) * 100).toFixed(0);
});

// Filtered trees for the current block and search/status
const filteredTrees = computed(() => {
  let filtered = allTrees.value.filter(tree => tree.blockId === blockId.value);

  if (selectedHealthStatus.value !== 'All Status') {
    filtered = filtered.filter(tree => tree.healthStatus === selectedHealthStatus.value);
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      tree =>
        tree.name.toLowerCase().includes(query) ||
        tree.tag.toLowerCase().includes(query) ||
        tree.variety.toLowerCase().includes(query) ||
        (tree.diseases && tree.diseases.some(d => d.toLowerCase().includes(query)))
    );
  }
  return filtered;
});

// Methods for tree management
const addNewTree = (newTreeData) => {
  // Generate a unique ID if not provided, or ensure uniqueness
  newTreeData.id = `tree-${newTreeData.phaseId}-${newTreeData.blockId}-${newTreeData.name}-${Date.now()}`;
  allTrees.value.push(newTreeData);
  // Optionally update block's totalTrees if not managed by backend
  const block = allBlocksData.value.find(b => b.id === newTreeData.blockId);
  if (block) {
    block.totalTrees += 1;
  }
};

const confirmDelete = (id, name) => {
  treeToDeleteId.value = id;
  treeToDeleteName.value = name;
  showDeleteModal.value = true;
};

const executeDelete = () => {
  const deletedTree = allTrees.value.find(tree => tree.id === treeToDeleteId.value);
  if (deletedTree) {
    // Optionally update block's totalTrees if not managed by backend
    const block = allBlocksData.value.find(b => b.id === deletedTree.blockId);
    if (block) {
      block.totalTrees -= 1;
    }
  }
  allTrees.value = allTrees.value.filter(tree => tree.id !== treeToDeleteId.value);
  showDeleteModal.value = false;
  treeToDeleteId.value = null;
  treeToDeleteName.value = '';
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  treeToDeleteId.value = null;
  treeToDeleteName.value = '';
};

const openEditModal = (tree) => {
  currentTreeToEdit.value = { ...tree };
  showEditModal.value = true;
};

const updateTree = (updatedTreeData) => {
  const index = allTrees.value.findIndex(tree => tree.id === updatedTreeData.id);
  if (index !== -1) {
    allTrees.value[index] = updatedTreeData;
  }
  showEditModal.value = false;
  currentTreeToEdit.value = null;
};

// Helper functions for dynamic styling based on health status
const getBorderColor = (status) => {
  switch (status) {
    case 'healthy':
      return 'border-green-500';
    case 'diseased':
      return 'border-red-500';
    case 'under_observation':
      return 'border-yellow-500';
    default:
      return 'border-gray-300';
  }
};

const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'healthy':
      return 'bg-green-100 text-green-700';
    case 'diseased':
      return 'bg-red-100 text-red-700';
    case 'under_observation':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getDisplayHealthStatus = (status) => {
  switch (status) {
    case 'healthy': return 'Healthy';
    case 'diseased': return 'Diseased';
    case 'under_observation': return 'Under Observation';
    default: return status;
  }
};
</script>

<style scoped>
/* No specific scoped styles are needed, Tailwind handles most. */
</style>