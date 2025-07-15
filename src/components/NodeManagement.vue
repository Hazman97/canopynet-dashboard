<template>
  <div class="flex-grow p-6 bg-gray-100 min-h-screen">
    <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Node Management</h2>
        </div>

      <div class="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
        <div class="flex space-x-3 w-full md:w-auto">
          <div class="relative w-1/3 md:w-auto">
            <select
              v-model="selectedStatus"
              class="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-blue-500 shadow-sm text-sm"
            >
              <option value="">All Statuses</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="warning">Warning</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <i class="bx bx-chevron-down text-lg"></i>
            </div>
          </div>

          <div class="relative w-1/3 md:w-auto">
            <select
              v-model="selectedType"
              class="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-blue-500 shadow-sm text-sm"
            >
              <option value="">All Types</option>
              <option value="gateway">Gateway</option>
              <option value="sensor">Sensor</option>
              <option value="camera">Camera</option>
              <option value="repeater">Repeater</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <i class="bx bx-chevron-down text-lg"></i>
            </div>
          </div>

          <div class="relative w-1/3 md:w-auto">
            <select
              v-model="sortBy"
              class="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-blue-500 shadow-sm text-sm"
            >
              <option value="name">Name</option>
              <option value="status">Status</option>
              <option value="lastSeen">Last Seen</option>
              <option value="battery">Battery</option>
              <option value="signal">Signal</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <i class="bx bx-chevron-down text-lg"></i>
            </div>
          </div>
        </div>

        <div class="relative w-full md:w-auto">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search nodes..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i class="bx bx-search text-gray-400 text-lg"></i>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="node in paginatedNodes"
          :key="node.id"
          class="bg-white rounded-lg shadow-md p-5 border border-gray-200 flex flex-col justify-between hover:shadow-lg transition duration-150 ease-in-out"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="text-lg font-bold text-gray-800">{{ node.name }}</h3>
              <p class="text-sm text-gray-500">ID: {{ node.id }}</p>
            </div>
            <span :class="getStatusBadgeColor(node.status)" class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
              {{ node.status.charAt(0).toUpperCase() + node.status.slice(1) }}
            </span>
          </div>

          <div class="text-sm text-gray-700 mb-4 space-y-2">
            <p><span class="font-semibold">Type:</span> {{ node.type }}</p>
            <p><span class="font-semibold">Last Seen:</span> {{ node.lastSeen }}</p>
            <div class="flex items-center">
              <span class="font-semibold mr-2">Battery:</span>
              <div class="w-full bg-gray-200 rounded-full h-2.5 flex-grow">
                <div :class="getBatteryBarColor(node.battery)" :style="{ width: node.battery + '%' }" class="h-2.5 rounded-full"></div>
              </div>
              <span class="ml-2">{{ node.battery }}%</span>
            </div>
            <p><span class="font-semibold">Signal:</span> {{ node.signal }} dBm</p>
          </div>

          <div class="flex justify-end space-x-3 mt-4 border-t pt-4">
            <button
              @click="openEditModal(node)"
              class="text-indigo-600 hover:text-indigo-900 text-sm font-medium py-1 px-2 rounded transition duration-150 ease-in-out"
            >
              Edit
            </button>
            <button
              @click="confirmDelete(node)"
              class="text-red-600 hover:text-red-900 text-sm font-medium py-1 px-2 rounded transition duration-150 ease-in-out"
            >
              Delete
            </button>
          </div>
        </div>
        <div v-if="filteredNodes.length === 0" class="col-span-full text-center py-8 text-gray-500">
          No nodes found matching your criteria.
        </div>
      </div>

      <div class="flex justify-between items-center mt-6">
        <span class="text-sm text-gray-700">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredNodes.length) }} of {{ filteredNodes.length }} entries
        </span>
        <nav class="relative z-0 inline-flex shadow-sm -space-x-px" aria-label="Pagination">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">Previous</span>
            <i class="bx bx-chevron-left h-5 w-5"></i>
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
              page === currentPage ? 'z-10 bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">Next</span>
            <i class="bx bx-chevron-right h-5 w-5"></i>
          </button>
        </nav>
      </div>
    </div>

    <ConfirmationModal
      :isVisible="showConfirmationModal"
      title="Delete Node"
      :message="`Are you sure you want to delete node '${nodeToDeleteName}' (${nodeToDeleteId})? This action cannot be undone.`"
      confirmButtonText="Delete"
      cancelButtonText="Cancel"
      @confirm="deleteNode"
      @cancel="cancelDelete"
    />

    <EditNodeModal
      :isVisible="showEditModal"
      :nodeData="currentNodeToEdit"
      @close="closeEditModal"
      @update-node="updateNode"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ConfirmationModal from './ConfirmationModal.vue';
import EditNodeModal from './EditNodeModal.vue';

const searchQuery = ref('');
const selectedStatus = ref('');
const selectedType = ref('');
const sortBy = ref('name');

const showConfirmationModal = ref(false);
const nodeToDeleteId = ref(null);
const nodeToDeleteName = ref('');

// State for Edit Node Modal
const showEditModal = ref(false);
const currentNodeToEdit = ref(null);

const nodes = ref([
  { id: 'GW-001', name: 'Gateway North', type: 'gateway', status: 'online', battery: 80, signal: -50, lastSeen: '2025-07-14T17:00' },
  { id: 'EP-003', name: 'Sensor Alpha', type: 'sensor', status: 'warning', battery: 25, signal: -78, lastSeen: '2025-07-14T16:30' },
  { id: 'EP-005', name: 'Camera Bravo', type: 'camera', status: 'offline', battery: 0, signal: 0, lastSeen: '2025-07-14T10:00' },
  { id: 'RP-002', name: 'Repeater Central', type: 'repeater', status: 'online', battery: 95, signal: -45, lastSeen: '2025-07-14T17:01' },
  { id: 'GW-002', name: 'Gateway South', type: 'gateway', status: 'maintenance', battery: 60, signal: -60, lastSeen: '2025-07-13T09:00' },
  { id: 'EP-006', name: 'Sensor Gamma', type: 'sensor', status: 'online', battery: 70, signal: -55, lastSeen: '2025-07-14T16:55' },
  { id: 'EP-007', name: 'Camera Delta', type: 'camera', status: 'online', battery: 40, signal: -65, lastSeen: '2025-07-14T16:40' },
  { id: 'RP-003', name: 'Repeater East', type: 'repeater', status: 'offline', battery: 0, signal: 0, lastSeen: '2025-07-12T14:00' },
  { id: 'EP-008', name: 'Sensor Epsilon', type: 'sensor', status: 'warning', battery: 15, signal: -85, lastSeen: '2025-07-14T16:15' },
  { id: 'GW-003', name: 'Gateway West', type: 'gateway', status: 'online', battery: 88, signal: -48, lastSeen: '2025-07-14T17:02' },
  { id: 'EP-009', name: 'Sensor Zeta', type: 'sensor', status: 'online', battery: 55, signal: -52, lastSeen: '2025-07-14T16:00' },
  { id: 'C-002', name: 'Camera Echo', type: 'camera', status: 'online', battery: 65, signal: -70, lastSeen: '2025-07-14T15:30' },
  { id: 'R-004', name: 'Repeater North', type: 'repeater', status: 'online', battery: 90, signal: -40, lastSeen: '2025-07-14T17:05' },
]);

// Convert 'Last Seen' to a format suitable for datetime-local input
nodes.value.forEach(node => {
  if (node.lastSeen && !node.lastSeen.includes('T')) {
    const [datePart, timePart] = node.lastSeen.split(' ');
    node.lastSeen = `${datePart}T${timePart}`;
  }
});


const currentPage = ref(1);
const itemsPerPage = 8;

const filteredNodes = computed(() => {
  let filtered = nodes.value.filter(node => {
    const matchesSearch =
      node.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      node.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      node.type.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = selectedStatus.value ? node.status === selectedStatus.value : true;
    const matchesType = selectedType.value ? node.type === selectedType.value : true;
    return matchesSearch && matchesStatus && matchesType;
  });

  filtered.sort((a, b) => {
    if (sortBy.value === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy.value === 'status') {
      return a.status.localeCompare(b.status);
    } else if (sortBy.value === 'lastSeen') {
        return new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime();
    } else if (sortBy.value === 'battery') {
        return b.battery - a.battery;
    } else if (sortBy.value === 'signal') {
        return b.signal - a.signal;
    }
    return 0;
  });
  return filtered;
});

const totalPages = computed(() => {
  return Math.ceil(filteredNodes.value.length / itemsPerPage);
});

const paginatedNodes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredNodes.value.slice(start, end);
});

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'online': return 'bg-green-100 text-green-700';
    case 'offline': return 'bg-red-100 text-red-700';
    case 'warning': return 'bg-orange-100 text-orange-700';
    case 'maintenance': return 'bg-yellow-100 text-yellow-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getBatteryBarColor = (battery) => {
  if (battery > 50) return 'bg-green-500';
  if (battery > 20) return 'bg-orange-500';
  return 'bg-red-500';
};

// Removed addNode function as the button is moved

// Functions for Edit Node Modal
const openEditModal = (node) => {
  currentNodeToEdit.value = { ...node };
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  currentNodeToEdit.value = null;
};

const updateNode = (updatedNodeData) => {
  const index = nodes.value.findIndex(node => node.id === updatedNodeData.id);
  if (index !== -1) {
    nodes.value[index] = updatedNodeData;
  }
  closeEditModal();
};

const confirmDelete = (node) => {
  nodeToDeleteId.value = node.id;
  nodeToDeleteName.value = node.name;
  showConfirmationModal.value = true;
};

const deleteNode = () => {
  nodes.value = nodes.value.filter(node => node.id !== nodeToDeleteId.value);
  showConfirmationModal.value = false;
  nodeToDeleteId.value = null;
  nodeToDeleteName.value = '';
};

const cancelDelete = () => {
  showConfirmationModal.value = false;
  nodeToDeleteId.value = null;
  nodeToDeleteName.value = '';
};
</script>

<style scoped>
/* No additional scoped styles needed, Tailwind classes handle styling. */
</style>