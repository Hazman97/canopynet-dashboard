<template>
  <div class="p-6 bg-gray-100 min-h-screen">

    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">MPOB Kratong Area Management</h1>
        <p class="text-gray-600">Comprehensive plantation management with phase structure and tree tracking</p>
      </div>
      <button
        @click="openAddPhaseModal"
        class="bg-green-600 text-white px-5 py-2 rounded-lg flex items-center shadow-md hover:bg-green-700 transition-colors"
      >
        <i class="bx bx-plus mr-2 text-xl"></i>
        <span>Add Phase</span>
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
      <div class="bg-white p-5 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Total Phases</p>
          <p class="text-3xl font-bold text-gray-800">{{ totalPhases }}</p>
        </div>
        <i class="bx bx-layer text-4xl text-blue-500"></i>
      </div>

      <div class="bg-white p-5 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Total Blocks</p>
          <p class="text-3xl font-bold text-gray-800">{{ totalBlocks }}</p>
        </div>
        <i class="bx bx-grid-alt text-4xl text-green-500"></i>
      </div>

      <div class="bg-white p-5 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Total Trees</p>
          <p class="text-3xl font-bold text-gray-800">{{ totalTrees }}</p>
        </div>
        <i class="bx bx-tree text-4xl text-purple-500"></i>
      </div>

      <div class="bg-white p-5 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Total Area</p>
          <p class="text-3xl font-bold text-gray-800">{{ totalArea.toFixed(1) }} ha</p>
        </div>
        <i class="bx bx-area text-4xl text-orange-500"></i>
      </div>

      <div class="bg-white p-5 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Tree Health</p>
          <p class="text-3xl font-bold text-gray-800">{{ avgTreeHealth.toFixed(0) }}%</p>
        </div>
        <i class="bx bx-leaf text-4xl text-teal-500"></i>
      </div>

      <div class="bg-white p-5 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Avg Trees/ha</p>
          <p class="text-3xl font-bold text-gray-800">{{ avgTreesPerHa.toFixed(0) }}</p>
        </div>
        <i class="bx bx-bar-chart-alt-2 text-4xl text-yellow-500"></i>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="flex border-b border-gray-200 mb-6">
        <button
          @click="setActiveTab('phases')"
          :class="{'text-blue-600 border-b-2 border-blue-600 font-medium': activeTab === 'phases', 'text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-600': activeTab !== 'phases'}"
          class="px-4 py-2 transition-colors"
        >Phases ({{ phases.length }})</button>
        <button
          @click="setActiveTab('blocks')"
          :class="{'text-blue-600 border-b-2 border-blue-600 font-medium': activeTab === 'blocks', 'text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-600': activeTab !== 'blocks'}"
          class="px-4 py-2 transition-colors"
        >Blocks ({{ allBlocks.length }})</button>
        <button
          @click="setActiveTab('trees')"
          :class="{'text-blue-600 border-b-2 border-blue-600 font-medium': activeTab === 'trees', 'text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-600': activeTab !== 'trees'}"
          class="px-4 py-2 transition-colors"
        >Trees ({{ allTrees.length }})</button>
      </div>

      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div class="flex flex-wrap items-center text-sm text-gray-600">
          <span v-if="activeTab === 'phases'">Phases ({{ filteredPhases.length }})</span>
          <template v-else-if="activeTab === 'blocks'">
            <button @click="setActiveTab('phases')" class="hover:text-blue-600">Phases ({{ phases.length }})</button>
            <i class="bx bx-chevron-right text-lg mx-1"></i>
            <span class="font-semibold" v-if="selectedPhaseForBlocks">Phase {{ selectedPhaseForBlocks.phaseNumber }} - {{ selectedPhaseForBlocks.phaseName }} Blocks ({{ filteredBlocks.length }})</span>
            <span class="font-semibold" v-else>All Blocks ({{ filteredBlocks.length }})</span>
          </template>
           <template v-else-if="activeTab === 'trees'">
            <button @click="setActiveTab('phases')" class="hover:text-blue-600">Phases ({{ phases.length }})</button>
            <i class="bx bx-chevron-right text-lg mx-1"></i>
            <button @click="setActiveTab('blocks', selectedPhaseForTrees)" class="hover:text-blue-600" v-if="selectedPhaseForTrees">Phase {{ selectedPhaseForTrees.phaseNumber }} - {{ selectedPhaseForTrees.phaseName }} Blocks</button>
            <button @click="setActiveTab('blocks')" class="hover:text-blue-600" v-else>All Blocks</button>
            <i class="bx bx-chevron-right text-lg mx-1"></i>
            <span class="font-semibold" v-if="selectedBlockForTrees">Block {{ selectedBlockForTrees.blockNumber }} - {{ selectedBlockForTrees.blockName }} Trees ({{ filteredTrees.length }})</span>
            <span class="font-semibold" v-else>All Trees ({{ filteredTrees.length }})</span>
          </template>
        </div>

        <div class="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div class="relative flex-grow">
            <input
              type="text"
              :placeholder="searchPlaceholder"
              v-model="searchQuery"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <i class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
          <select v-model="selectedStatusFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Status</option>
            <option v-for="status in allStatusesFilterOptions" :key="status" :value="status">{{ status }}</option>
          </select>
        </div>
      </div>

      <div v-if="activeTab === 'phases'">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="phase in filteredPhases"
            :key="phase.id"
            class="bg-white border border-gray-200 rounded-lg shadow-sm p-6"
          >
            <div class="flex justify-between items-start mb-4">
              <span class="bg-blue-100 text-blue-700 text-sm font-semibold px-2.5 py-0.5 rounded-full">
                {{ phase.phaseNumber }}
              </span>
              <span :class="getPhaseStatusColor(phase.status)" class="text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {{ phase.status }}
              </span>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ phase.phaseName }}</h3>
            <p class="text-sm text-gray-500 mb-4">{{ phase.description }}</p>

            <div class="space-y-2 text-sm text-gray-700 mb-6">
              <p class="flex items-center"><i class="bx bx-area mr-2"></i> Total Area: <span class="font-semibold">{{ phase.totalArea.toFixed(1) }} ha</span></p>
              <p class="flex items-center"><i class="bx bx-grid-alt mr-2"></i> Blocks: <span class="font-semibold">{{ phase.blocks.length }}</span></p>
              <p class="flex items-center"><i class="bx bx-calendar mr-2"></i> Established: <span class="font-semibold">{{ formatDate(phase.establishedDate) }}</span></p>
              <p class="flex items-center"><i class="bx bx-tree mr-2"></i> Total Trees: <span class="font-semibold">{{ phase.totalTrees }}</span></p>
              <p class="flex items-center"><i class="bx bx-trending-up mr-2"></i> Avg Yield: <span class="font-semibold">{{ phase.avgYield.toFixed(0) }} kg/ha</span></p>
              <p class="flex items-center"><i class="bx bx-scatter-chart mr-2"></i> Trees/ha: <span class="font-semibold">{{ phase.treesPerHa.toFixed(0) }}</span></p>
            </div>

            <div class="flex justify-between items-center">
              <button @click="viewBlocksInPhase(phase)" class="text-green-600 hover:text-green-800 font-medium flex items-center">
                View Blocks <span class="ml-1">({{ phase.blocks.length }})</span>
              </button>
              <div class="flex space-x-2">
                <button @click="editPhase(phase)" class="text-gray-500 hover:text-gray-700"><i class="bx bx-edit text-xl"></i></button>
                <button @click="deletePhase(phase.id)" class="text-gray-500 hover:text-gray-700"><i class="bx bx-trash text-xl"></i></button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="filteredPhases.length === 0" class="text-center py-10 text-gray-500">
          No phases found matching your criteria.
        </div>
      </div>

      <div v-else-if="activeTab === 'blocks'">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="block in filteredBlocks"
            :key="block.id"
            class="bg-white border border-gray-200 rounded-lg shadow-sm p-6"
          >
            <div class="flex justify-between items-start mb-4">
              <span class="bg-gray-100 text-gray-700 text-sm font-semibold px-2.5 py-0.5 rounded-full">
                Block {{ block.blockNumber }}
              </span>
              <span :class="getBlockStatusColor(block.status)" class="text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {{ block.status }}
              </span>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ block.blockName }}</h3>
            <p class="text-sm text-gray-500 mb-4">Phase {{ block.phaseNumber }} - {{ block.phaseName }}</p>

            <div class="space-y-2 text-sm text-gray-700 mb-6">
              <p class="flex items-center"><i class="bx bx-area mr-2"></i> Area: <span class="font-semibold">{{ block.areaHectares.toFixed(1) }} ha ({{ block.areaAcres.toFixed(1) }} acres)</span></p>
              <p class="flex items-center"><i class="bx bx-calendar-alt mr-2"></i> Palm Age: <span class="font-semibold">{{ block.palmAge }} years</span></p>
              <p class="flex items-center"><i class="bx bx-leaf mr-2"></i> Variety: <span class="font-semibold">{{ block.palmVariety }}</span></p>
              <p class="flex items-center"><i class="bx bx-trending-up mr-2"></i> Yield: <span class="font-semibold">{{ block.estimatedYieldKgHa.toFixed(0) }} kg/ha</span></p>
              <p class="flex items-center"><i class="bx bx-tree mr-2"></i> Trees: <span class="font-semibold">{{ block.trees.length }}</span></p>
            </div>
             <div class="mb-4">
                <p class="text-sm font-medium text-gray-700 mb-1">Tree Health</p>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div class="bg-green-600 h-2.5 rounded-full" :style="{ width: block.avgTreeHealth + '%' }"></div>
                </div>
                <p class="text-right text-xs text-gray-500 mt-1">{{ block.avgTreeHealth.toFixed(0) }}%</p>
            </div>

            <div class="flex justify-between items-center">
              <button @click="viewTreesInBlock(block)" class="text-green-600 hover:text-green-800 font-medium flex items-center">
                View Trees <span class="ml-1">({{ block.trees.length }})</span>
              </button>
              <div class="flex space-x-2">
                <button @click="editBlock(block)" class="text-gray-500 hover:text-gray-700"><i class="bx bx-edit text-xl"></i></button>
                <button @click="deleteBlock(block.id)" class="text-gray-500 hover:text-gray-700"><i class="bx bx-trash text-xl"></i></button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="filteredBlocks.length === 0" class="text-center py-10 text-gray-500">
          No blocks found matching your criteria for the selected phase.
        </div>
      </div>

      <div v-else-if="activeTab === 'trees'">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="tree in filteredTrees"
            :key="tree.id"
            class="bg-white border border-gray-200 rounded-lg shadow-sm p-6"
          >
            <div class="flex justify-between items-start mb-4">
              <span class="bg-gray-100 text-gray-700 text-sm font-semibold px-2.5 py-0.5 rounded-full">
                Tree T{{ tree.treeNumber }}
              </span>
              <span :class="getTreeHealthColor(tree.healthScore)" class="text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {{ tree.healthScore > 7 ? 'healthy' : tree.healthScore > 4 ? 'average' : 'diseased' }}
              </span>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ tree.blockName }} - {{ tree.variety }}</h3>
            <p class="text-sm text-gray-500 mb-4">Tag: {{ tree.tagId }}</p>

            <div class="space-y-2 text-sm text-gray-700 mb-6">
              <p class="flex items-center"><i class="bx bx-tag mr-2"></i> Tag: <span class="font-semibold">{{ tree.tagType }} {{ tree.tagId }}</span></p>
              <p class="flex items-center"><i class="bx bx-calendar-alt mr-2"></i> Age: <span class="font-semibold">{{ tree.ageYears }} years</span></p>
              <p class="flex items-center"><i class="bx bx-trending-up mr-2"></i> Yield: <span class="font-semibold">{{ tree.estimatedYieldKg }}kg</span></p>
              <p class="flex items-center"><i class="bx bx-compass mr-2"></i> Height: <span class="font-semibold">{{ tree.heightM }}m</span></p>
              <p class="flex items-center"><i class="bx bx-heart mr-2"></i> Health: <span class="font-semibold">{{ tree.healthScore }}/10</span></p>
              <p class="flex items-center"><i class="bx bx-calendar mr-2"></i> Last Check: <span class="font-semibold">{{ formatDate(tree.lastCheckDate) }}</span></p>
              <p v-if="tree.diseases && tree.diseases.length > 0" class="flex items-center"><i class="bx bx-bug-alt mr-2 text-red-500"></i> Diseases: <span class="font-semibold text-red-600">{{ tree.diseases.join(', ') }}</span></p>
            </div>

            <div class="flex justify-between items-center">
              <button @click="viewTreeDetails(tree)" class="text-green-600 hover:text-green-800 font-medium flex items-center">
                View Details
              </button>
              <div class="flex space-x-2">
                <button @click="editTree(tree)" class="text-gray-500 hover:text-gray-700"><i class="bx bx-edit text-xl"></i></button>
                <button @click="deleteTree(tree.id)" class="text-gray-500 hover:text-gray-700"><i class="bx bx-trash text-xl"></i></button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="filteredTrees.length === 0" class="text-center py-10 text-gray-500">
          No trees found matching your criteria for the selected block.
        </div>
      </div>
    </div>

    <AddPhaseModal
      :show="showAddPhaseModal"
      :phaseData="editingPhase"
      @close="closeAddPhaseModal"
      @add-phase="handleAddPhase"
      @update-phase="handleUpdatePhase"
    />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AddPhaseModal from '@/components/AddPhaseModal.vue'; // Assuming this path

// Reactive state variables
const showAddPhaseModal = ref(false);
const editingPhase = ref(null); // Stores the phase object being edited, null if adding

const activeTab = ref('phases'); // Controls which tab content is visible: 'phases', 'blocks', 'trees'
const searchQuery = ref('');
const selectedStatusFilter = ref('');

// For navigating between tabs based on hierarchy
const selectedPhaseForBlocks = ref(null); // When viewing blocks within a specific phase
const selectedPhaseForTrees = ref(null); // Used for breadcrumbs when viewing trees within a block
const selectedBlockForTrees = ref(null); // When viewing trees within a specific block

// Filter options for the main "All Status" dropdown
const allStatusesFilterOptions = [
  'Active',
  'Development',
  'Maintenance',
  'Inactive'
];

// Dummy Data (Comprehensive based on image details)
const phases = ref([
  {
    id: 'ph1',
    phaseName: 'Phase 1 - North Section',
    phaseNumber: 1,
    description: 'Northern section of MPOB Kratong plantation with mature palms.',
    totalArea: 250.5, // From image_3e62dc.png
    expectedBlocks: 2,
    status: 'active', // From image_3e62dc.png
    establishedDate: '2015-03-15', // From image_3e62dc.png
    totalTrees: 5277, // From image_3e62dc.png
    avgYield: 21750.0, // From image_3e62dc.png
    treesPerHa: 21, // From image_3e62dc.png
    blocks: [
      {
        id: 'b1',
        blockName: 'Block A-01',
        blockNumber: 'A-01',
        palmVariety: 'Tenera', // From image_3e5b5d.png
        plantingDate: '2015-03-15',
        phaseId: 'ph1',
        phaseName: 'Phase 1 - North Section',
        phaseNumber: 1,
        palmAge: 9, // From image_3e5b5d.png
        areaHectares: 20.5, // From image_3e5b5d.png
        areaAcres: 50.6, // From image_3e5b5d.png
        status: 'harvesting', // From image_3e5b5d.png
        treesPerHectare: 136, // From image_3e5ac4.png
        totalTrees: 2788, // From image_3e5b5d.png
        estimatedYieldKgHa: 22000, // From image_3e5b5d.png
        siteConditions: { // From image_3e5a46.png
          soilType: 'Clay',
          drainage: 'Good',
          slope: 'Flat (0-3°)',
          accessibility: 'Excellent'
        },
        avgTreeHealth: 50, // From image_3e5b5d.png
        trees: [
          {
            id: 't1', treeNumber: 1, variety: 'Tenera', blockId: 'b1', blockName: 'Block A-01', plantingDate: '2015-03-15', tagType: 'QR Tag', tagId: 'QR001',
            ageYears: 9, heightM: 8.5, trunkCircumferenceCm: 120, status: 'Active', healthScore: 9, estimatedYieldKg: 28, diseases: [], notes: '', lastCheckDate: '2024-01-15' // From image_3de9a8.png
          },
          {
            id: 't2', treeNumber: 2, variety: 'Tenera', blockId: 'b1', blockName: 'Block A-01', plantingDate: '2015-03-15', tagType: 'RFID Tag', tagId: 'RFID002',
            ageYears: 9, heightM: 7.8, trunkCircumferenceCm: 115, status: 'Active', healthScore: 6, estimatedYieldKg: 25, diseases: ['Ganoderma', 'Leaf Spot'], notes: 'Requires close monitoring.', lastCheckDate: '2024-01-15'
          },
        ]
      },
      {
        id: 'b2',
        blockName: 'Block A-02',
        blockNumber: 'A-02',
        palmVariety: 'Tenera', // From image_3e5b5d.png
        plantingDate: '2016-01-01',
        phaseId: 'ph1',
        phaseName: 'Phase 1 - North Section',
        phaseNumber: 1,
        palmAge: 9, // From image_3e5b5d.png
        areaHectares: 18.3, // From image_3e5b5d.png
        areaAcres: 45.2, // From image_3e5b5d.png
        status: 'active', // From image_3e5b5d.png
        treesPerHectare: 130,
        totalTrees: 0, // From image_3e5b5d.png
        estimatedYieldKgHa: 21500, // From image_3e5b5d.png
        siteConditions: {
          soilType: 'Loam',
          drainage: 'Good',
          slope: 'Gentle (4-8°)',
          accessibility: 'Good'
        },
        avgTreeHealth: 0, // From image_3e5b5d.png
        trees: [] // No trees yet for demo
      }
    ]
  },
  {
    id: 'ph2',
    phaseName: 'Phase 2 - East Section',
    phaseNumber: 2,
    description: 'Eastern section with mature palms currently in active harvesting.',
    totalArea: 180.3, // From image_3e62dc.png
    expectedBlocks: 1,
    status: 'active', // From image_3e62dc.png
    establishedDate: '2012-08-20', // From image_3e62dc.png
    totalTrees: 0, avgYield: 0, treesPerHa: 0,
    blocks: []
  },
  {
    id: 'ph3',
    phaseName: 'Phase 3 - South Section',
    phaseNumber: 3,
    description: 'Southern development area, currently undergoing new block establishment.',
    totalArea: 320.8, // From image_3e62dc.png
    expectedBlocks: 3,
    status: 'development', // From image_3e62dc.png
    establishedDate: '2020-01-10', // From image_3e62dc.png
    totalTrees: 0, avgYield: 0, treesPerHa: 0,
    blocks: []
  },
  {
    id: 'ph4',
    phaseName: 'Phase 4 - West Section',
    phaseNumber: 4,
    description: 'Western expansion area, primarily for maintenance and replanting efforts.',
    totalArea: 195.2, // From image_3e62dc.png
    expectedBlocks: 2,
    status: 'maintenance', // From image_3e62dc.png
    establishedDate: '2018-06-05', // From image_3e62dc.png
    totalTrees: 0, avgYield: 0, treesPerHa: 0,
    blocks: []
  }
]);

// Computed properties for dashboard summary cards
const totalPhases = computed(() => phases.value.length);
const allBlocks = computed(() => {
  return phases.value.flatMap(phase => phase.blocks.map(block => ({
    ...block,
    phaseId: phase.id,
    phaseName: phase.phaseName,
    phaseNumber: phase.phaseNumber,
    // Calculate avgTreeHealth if not directly available from dummy data for a block
    avgTreeHealth: block.trees.length > 0 ? block.trees.reduce((sum, tree) => sum + tree.healthScore, 0) / block.trees.length * 10 : 0 // Convert to percentage from 1-10 score
  })));
});
const totalBlocks = computed(() => allBlocks.value.length);
const allTrees = computed(() => {
  return allBlocks.value.flatMap(block => block.trees.map(tree => ({
    ...tree,
    blockId: block.id,
    blockName: block.blockName,
    blockNumber: block.blockNumber,
    phaseId: block.phaseId,
    phaseName: block.phaseName,
    phaseNumber: block.phaseNumber
  })));
});
const totalTrees = computed(() => allTrees.value.length);
const totalArea = computed(() => phases.value.reduce((sum, phase) => sum + phase.totalArea, 0)); //
const avgTreeHealth = computed(() => {
  if (allTrees.value.length === 0) return 0;
  const totalScore = allTrees.value.reduce((sum, tree) => sum + tree.healthScore, 0);
  return (totalScore / allTrees.value.length) * 10; // Convert to percentage from 1-10 score
});
const avgTreesPerHa = computed(() => {
  if (totalArea.value === 0) return 0;
  return totalTrees.value / totalArea.value; //
});

// Computed property for search placeholder text
const searchPlaceholder = computed(() => {
  if (activeTab.value === 'phases') return 'Search phases...';
  if (activeTab.value === 'blocks') return 'Search blocks...';
  if (activeTab.value === 'trees') return 'Search trees...';
  return 'Search...';
});


// Computed properties for filtered content based on active tab and search/status filters
const filteredPhases = computed(() => {
  let filtered = phases.value;
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(phase =>
      phase.phaseName.toLowerCase().includes(query) ||
      phase.description.toLowerCase().includes(query) ||
      String(phase.phaseNumber).includes(query)
    );
  }
  if (selectedStatusFilter.value) {
    filtered = filtered.filter(phase => phase.status.toLowerCase() === selectedStatusFilter.value.toLowerCase());
  }
  return filtered;
});

const filteredBlocks = computed(() => {
  let blocksToFilter = selectedPhaseForBlocks.value
    ? phases.value.find(p => p.id === selectedPhaseForBlocks.value.id)?.blocks || []
    : allBlocks.value;

  let filtered = blocksToFilter;
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(block =>
      block.blockName.toLowerCase().includes(query) ||
      block.blockNumber.toLowerCase().includes(query) ||
      block.palmVariety.toLowerCase().includes(query) ||
      block.status.toLowerCase().includes(query)
    );
  }
  if (selectedStatusFilter.value) {
    // Blocks have a specific status list (Young Palm, Active, Harvesting, Maintenance, Replanting)
    // The main 'All Status' filter (Active, Development, Maintenance, Inactive) needs mapping or careful application
    // For now, I'll filter blocks by their own status if the main filter matches (e.g., 'Active' in both)
    filtered = filtered.filter(block => block.status.toLowerCase() === selectedStatusFilter.value.toLowerCase());
  }
  return filtered;
});

const filteredTrees = computed(() => {
  let treesToFilter = selectedBlockForTrees.value
    ? allBlocks.value.find(b => b.id === selectedBlockForTrees.value.id)?.trees || []
    : allTrees.value;

  let filtered = treesToFilter;
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(tree =>
      String(tree.treeNumber).includes(query) ||
      tree.tagId.toLowerCase().includes(query) ||
      tree.variety.toLowerCase().includes(query) ||
      (tree.diseases && tree.diseases.some(d => d.toLowerCase().includes(query)))
    );
  }
  // The 'All Status' filter (Active, Development, Maintenance, Inactive) doesn't directly map to tree's health/status like 'Young Palm'.
  // If the user wants to filter trees by a specific status, a separate dropdown might be needed, or clarification on mapping.
  // For now, the 'All Status' filter will not apply to trees.
  return filtered;
});

// --- Tab Navigation Logic ---
const setActiveTab = (tabName, context = null) => {
  activeTab.value = tabName;
  searchQuery.value = ''; // Clear search when changing tabs
  selectedStatusFilter.value = ''; // Clear status filter when changing tabs

  // Reset context for other tabs
  if (tabName === 'phases') {
    selectedPhaseForBlocks.value = null;
    selectedPhaseForTrees.value = null;
    selectedBlockForTrees.value = null;
  } else if (tabName === 'blocks' && context) {
    selectedPhaseForBlocks.value = context;
    selectedPhaseForTrees.value = null; // Clear tree specific context
    selectedBlockForTrees.value = null; // Clear tree specific context
  } else if (tabName === 'trees' && context) {
    selectedBlockForTrees.value = context;
    selectedPhaseForTrees.value = phases.value.find(p => p.id === context.phaseId); // Set phase context for tree breadcrumb
  }
};

const viewBlocksInPhase = (phase) => {
  setActiveTab('blocks', phase);
};

const viewTreesInBlock = (block) => {
  setActiveTab('trees', block);
};


// --- Modal and Data Handling (Placeholder for now) ---
const openAddPhaseModal = () => {
  editingPhase.value = null; // Ensure we are adding, not editing
  showAddPhaseModal.value = true;
};

const closeAddPhaseModal = () => {
  showAddPhaseModal.value = false;
  editingPhase.value = null; // Reset editing state
};

const handleAddPhase = (newPhaseData) => {
  const newId = 'ph' + (phases.value.length + 1); // Simple ID generation
  phases.value.push({
    ...newPhaseData,
    id: newId,
    blocks: [], // New phases start with no blocks
    totalTrees: 0, // Initialize for new phase
    avgYield: 0,
    treesPerHa: 0
  });
  closeAddPhaseModal();
};

const editPhase = (phase) => {
  editingPhase.value = { ...phase }; // Clone for editing
  showAddPhaseModal.value = true;
};

const handleUpdatePhase = (updatedPhaseData) => {
  const index = phases.value.findIndex(p => p.id === updatedPhaseData.id);
  if (index !== -1) {
    // Retain existing blocks for the phase when updating
    const currentBlocks = phases.value[index].blocks;
    phases.value[index] = { ...phases.value[index], ...updatedPhaseData, blocks: currentBlocks };
  }
  closeAddPhaseModal();
};

const deletePhase = (id) => {
  if (confirm('Are you sure you want to delete this phase and all its associated blocks and trees?')) {
    phases.value = phases.value.filter(phase => phase.id !== id);
    // Also reset selected contexts if the deleted phase was active
    if (selectedPhaseForBlocks.value && selectedPhaseForBlocks.value.id === id) {
      selectedPhaseForBlocks.value = null;
    }
    if (selectedPhaseForTrees.value && selectedPhaseForTrees.value.id === id) {
      selectedPhaseForTrees.value = null;
      selectedBlockForTrees.value = null;
    }
    if (selectedBlockForTrees.value) { // Check if its phase was deleted
        const blockExists = allBlocks.value.some(block => block.id === selectedBlockForTrees.value.id);
        if (!blockExists) {
            selectedBlockForTrees.value = null;
            selectedPhaseForTrees.value = null;
        }
    }
    setActiveTab('phases'); // Go back to phases view after deletion
  }
};

// Placeholder for future edit/delete functions for blocks/trees
const editBlock = (block) => { console.log('Edit Block:', block); /* Open AddBlockModal */ };
const deleteBlock = (id) => {
  if (confirm('Are you sure you want to delete this block and all its associated trees?')) {
    phases.value.forEach(phase => {
      phase.blocks = phase.blocks.filter(block => block.id !== id);
    });
    // Reset selected block for trees if it was the one deleted
    if (selectedBlockForTrees.value && selectedBlockForTrees.value.id === id) {
      selectedBlockForTrees.value = null;
      setActiveTab('blocks', selectedPhaseForBlocks.value); // Go back to blocks view of current phase
    }
  }
};
const editTree = (tree) => { console.log('Edit Tree:', tree); /* Open AddTreeModal */ };
const deleteTree = (id) => {
  if (confirm('Are you sure you want to delete this tree?')) {
    phases.value.forEach(phase => {
      phase.blocks.forEach(block => {
        block.trees = block.trees.filter(tree => tree.id !== id);
      });
    });
  }
};


// --- Helper Functions for Styling and Formatting ---
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  // Ensure date is parsed correctly to avoid timezone issues for display
  const date = new Date(dateString + 'T00:00:00');
  if (isNaN(date)) return dateString; // Fallback if invalid date
  return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

const getPhaseStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'active': return 'bg-green-100 text-green-700';
    case 'development': return 'bg-blue-100 text-blue-700';
    case 'maintenance': return 'bg-yellow-100 text-yellow-700';
    case 'inactive': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getBlockStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'young palm': return 'bg-purple-100 text-purple-700';
    case 'active': return 'bg-green-100 text-green-700';
    case 'harvesting': return 'bg-orange-100 text-orange-700';
    case 'maintenance': return 'bg-yellow-100 text-yellow-700';
    case 'replanting': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getTreeHealthColor = (healthScore) => {
    if (healthScore >= 8) return 'bg-green-100 text-green-700';
    if (healthScore >= 5) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
};
</script>

<style scoped>
/* Specific styles can go here if needed, but Tailwind handles most */
</style>