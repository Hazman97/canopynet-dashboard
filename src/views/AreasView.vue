<template>
  <div class="flex-grow p-6 bg-gray-100 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">MPOB Keratong Area Management</h1>
      <button
        @click="showAddPhaseModal = true"
        class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center"
      >
        <i class="bx bx-plus mr-2"></i> Add Phase
      </button>
    </div>
    <p class="text-gray-600 mb-8">Comprehensive plantation management with phase structure and tree tracking</p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Total Phases</p>
          <p class="text-3xl font-bold text-gray-800">{{ phases.length }}</p>
        </div>
        <div class="p-3 bg-blue-100 rounded-full text-blue-500">
          <i class="bx bx-layer text-2xl"></i>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Total Blocks</p>
          <p class="text-3xl font-bold text-gray-800">{{ totalBlocks }}</p>
        </div>
        <div class="p-3 bg-green-100 rounded-full text-green-500">
          <i class="bx bx-map-alt text-2xl"></i>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Total Trees</p>
          <p class="text-3xl font-bold text-gray-800">{{ totalTrees }}</p>
        </div>
        <div class="p-3 bg-purple-100 rounded-full text-purple-500">
          <i class="bx bxs-tree text-2xl"></i>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Total Area</p>
          <p class="text-3xl font-bold text-gray-800">{{ totalArea.toFixed(1) }} ha</p>
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
          <p class="text-3xl font-bold text-gray-800">{{ avgTreesPerHa.toFixed(0) }}</p>
        </div>
        <div class="p-3 bg-yellow-100 rounded-full text-yellow-500">
          <i class="bx bx-bar-chart-alt text-2xl"></i>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-800">Phases ({{ filteredPhases.length }})</h2>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <input
            type="text"
            placeholder="Search phases..."
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
          <option value="active">Active</option>
          <option value="development">Development</option>
          <option value="maintenance">Maintenance</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="phase in filteredPhases"
        :key="phase.id"
        :class="['bg-white rounded-lg shadow-md p-6 border-t-4', getBorderColor(phase.status)]"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold text-gray-800 flex items-center">
            <span
              :class="['inline-flex items-center justify-center w-8 h-8 mr-2 text-white rounded-full text-sm font-bold', getBgColor(phase.status)]"
            >{{ phase.id }}</span>
            {{ phase.title }}
          </h3>
          <span
            :class="['text-xs font-semibold px-2.5 py-0.5 rounded-full', getStatusBadgeColor(phase.status)]"
          >{{ phase.status }}</span>
        </div>
        <p class="text-gray-600 mb-4">{{ phase.description }}</p>
        <div class="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-4">
          <div><span class="font-medium">Section</span><p>{{ phase.section }}</p></div>
          <div><span class="font-medium">Established</span><p>{{ phase.established }}</p></div>
          <div><span class="font-medium">Total Area</span><p>{{ phase.totalArea }} ha</p></div>
          <div><span class="font-medium">Avg Yield</span><p>{{ phase.avgYield }} kg/ha</p></div>
          <div><span class="font-medium">Trees/ha</span><p>{{ phase.treesPerHa }}</p></div>
          <div><span class="font-medium">Total Trees</span><p>{{ phase.totalTrees }}</p></div>
          <div><span class="font-medium">Blocks</span><p>{{ phase.blocks }}</p></div>
        </div>
        <div class="flex justify-between items-center">
          <button
            @click="goToBlocksView(phase.id)"
            class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm"
          >
            View Blocks
          </button>
          <div class="flex space-x-2">
            <i
              class="bx bx-trash text-gray-400 hover:text-gray-600 cursor-pointer text-xl"
              @click="confirmDelete(phase.id, phase.title)"
            ></i>
            <i
              class="bx bx-edit text-gray-400 hover:text-gray-600 cursor-pointer text-xl"
              @click="openEditModal(phase)"
            ></i>
          </div>
        </div>
      </div>
      <div v-if="filteredPhases.length === 0" class="col-span-full text-center text-gray-500 text-lg">
        No phases found with the selected criteria.
      </div>
    </div>

    <ConfirmationModal
      :isVisible="showDeleteModal"
      title="Delete Phase"
      :message="`Are you sure you want to delete phase '${phaseToDeleteName}'? This action cannot be undone.`"
      confirmButtonText="Delete"
      cancelButtonText="Cancel"
      @confirm="executeDelete"
      @cancel="cancelDelete"
    />

    <AddPhaseModal
      :isVisible="showAddPhaseModal"
      :initialId="nextPhaseId"
      @close="showAddPhaseModal = false"
      @add-phase="addNewPhase"
    />

    <EditPhaseModal
      :isVisible="showEditModal"
      :phaseData="currentPhaseToEdit"
      @close="showEditModal = false"
      @update-phase="updatePhase"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import AddPhaseModal from '@/components/AddPhaseModal.vue';
import EditPhaseModal from '@/components/EditPhaseModal.vue';

const router = useRouter(); // Initialize router

// Reactive data for phases
const phases = ref([
  {
    id: 1,
    title: 'Phase 1 - North Section',
    section: 'North',
    status: 'active',
    description: 'Northern section of MPOB Keratong plantation',
    established: '2015-03-15',
    totalArea: 250.5,
    avgYield: 21750.0,
    treesPerHa: 21,
    totalTrees: 5277,
    blocks: 2,
  },
  {
    id: 2,
    title: 'Phase 2 - East Section',
    section: 'East',
    status: 'active',
    description: 'Eastern section with mature palms',
    established: '2012-08-20',
    totalArea: 180.3,
    avgYield: 0.0,
    treesPerHa: 0,
    totalTrees: 0,
    blocks: 0,
  },
  {
    id: 3,
    title: 'Phase 3 - South Section',
    section: 'South',
    status: 'development',
    description: 'Southern development area',
    established: '2020-01-10',
    totalArea: 320.8,
    avgYield: 0.0,
    treesPerHa: 0,
    totalTrees: 0,
    blocks: 0,
  },
  {
    id: 4,
    title: 'Phase 4 - West Section',
    section: 'West',
    status: 'maintenance',
    description: 'Western expansion area',
    established: '2018-06-05',
    totalArea: 195.2,
    avgYield: 0.0,
    treesPerHa: 0,
    totalTrees: 0,
    blocks: 0,
  },
  // Example of an 'inactive' phase
  {
    id: 5,
    title: 'Phase 5 - Central Section',
    section: 'Central',
    status: 'inactive',
    description: 'Future expansion zone, currently inactive',
    established: '2023-01-01',
    totalArea: 100.0,
    avgYield: 0.0,
    treesPerHa: 0,
    totalTrees: 0,
    blocks: 0,
  },
]);

// Reactive data for filters
const selectedStatus = ref('All Status');
const searchQuery = ref('');

// Reactive data for delete modal
const showDeleteModal = ref(false);
const phaseToDeleteId = ref(null);
const phaseToDeleteName = ref('');

// Reactive data for add phase modal
const showAddPhaseModal = ref(false);

// Reactive data for edit phase modal
const showEditModal = ref(false);
const currentPhaseToEdit = ref(null); // Will hold the phase object being edited

// Computed property to determine the next available phase ID
const nextPhaseId = computed(() => {
  if (phases.value.length === 0) return 1;
  const maxId = Math.max(...phases.value.map(p => p.id));
  return maxId + 1;
});

// Computed properties for summary cards
const totalBlocks = computed(() => {
  return phases.value.reduce((sum, phase) => sum + phase.blocks, 0);
});

const totalTrees = computed(() => {
  return phases.value.reduce((sum, phase) => sum + phase.totalTrees, 0);
});

const totalArea = computed(() => {
  return phases.value.reduce((sum, phase) => sum + phase.totalArea, 0);
});

const avgTreesPerHa = computed(() => {
  if (totalArea.value === 0) return 0;
  return totalTrees.value / totalArea.value;
});


// Computed property for filtered phases
const filteredPhases = computed(() => {
  let filtered = phases.value;

  // Filter by status
  if (selectedStatus.value !== 'All Status') {
    filtered = filtered.filter(phase => phase.status === selectedStatus.value);
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      phase =>
        phase.title.toLowerCase().includes(query) ||
        phase.description.toLowerCase().includes(query) ||
        phase.section.toLowerCase().includes(query)
    );
  }

  return filtered;
});

// Method to initiate delete confirmation
const confirmDelete = (id, name) => {
  phaseToDeleteId.value = id;
  phaseToDeleteName.value = name;
  showDeleteModal.value = true;
};

// Method to execute delete after confirmation
const executeDelete = () => {
  phases.value = phases.value.filter(phase => phase.id !== phaseToDeleteId.value);
  showDeleteModal.value = false; // Close the modal
  phaseToDeleteId.value = null; // Reset
  phaseToDeleteName.value = ''; // Reset
};

// Method to cancel delete
const cancelDelete = () => {
  showDeleteModal.value = false; // Close the modal
  phaseToDeleteId.value = null; // Reset
  phaseToDeleteName.value = ''; // Reset
};

// Method to add a new phase
const addNewPhase = (newPhaseData) => {
  // Check if a phase with the same ID already exists
  const existingPhase = phases.value.find(p => p.id === newPhaseData.id);
  if (existingPhase) {
    alert(`Phase with ID ${newPhaseData.id} already exists. Please choose a different ID.`);
    return;
  }
  phases.value.push(newPhaseData);
  // Sort phases by ID to maintain order (optional)
  phases.value.sort((a, b) => a.id - b.id);
};

// Method to open the edit modal with the selected phase's data
const openEditModal = (phase) => {
  currentPhaseToEdit.value = { ...phase }; // Create a copy to avoid direct mutation
  showEditModal.value = true;
};

// Method to update an existing phase
const updatePhase = (updatedPhaseData) => {
  const index = phases.value.findIndex(p => p.id === updatedPhaseData.id);
  if (index !== -1) {
    phases.value[index] = updatedPhaseData;
  }
  showEditModal.value = false; // Close the modal
  currentPhaseToEdit.value = null; // Reset
};

// New method to navigate to BlocksView
const goToBlocksView = (phaseId) => {
  router.push({ name: 'blocks', params: { phaseId: phaseId } });
};


// Helper functions for dynamic styling based on status
const getBorderColor = (status) => {
  switch (status) {
    case 'active':
      return 'border-green-500';
    case 'development':
      return 'border-blue-500';
    case 'maintenance':
      return 'border-yellow-500';
    case 'inactive':
      return 'border-gray-500';
    default:
      return 'border-gray-300';
  }
};

const getBgColor = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-500';
    case 'development':
      return 'bg-blue-500';
    case 'maintenance':
      return 'bg-yellow-500';
    case 'inactive':
      return 'bg-gray-500';
    default:
      return 'bg-gray-400';
  }
};

const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-700';
    case 'development':
      return 'bg-blue-100 text-blue-700';
    case 'maintenance':
      return 'bg-yellow-100 text-yellow-700';
    case 'inactive':
      return 'bg-gray-200 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};
</script>

<style scoped>
/* No specific scoped styles are needed as Tailwind CSS classes are used directly in the template. */
</style>