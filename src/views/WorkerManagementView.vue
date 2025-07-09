<template>
  <div class="p-6 bg-gray-100 min-h-screen">

    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Worker Management</h1>
        <p class="text-gray-600">Comprehensive workforce management and attendance tracking</p>
      </div>
      <button
        @click="showAddWorkerModal = true"
        class="bg-green-600 text-white px-5 py-2 rounded-lg flex items-center shadow-md hover:bg-green-700 transition-colors"
      >
        <i class="bx bx-plus mr-2 text-xl"></i>
        <span>Add Worker</span>
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-5 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Total Workers</p>
          <p class="text-3xl font-bold text-gray-800">{{ totalWorkers }}</p>
        </div>
        <i class="bx bx-group text-4xl text-gray-400"></i>
      </div>

      <div class="bg-white p-5 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Active Workers</p>
          <p class="text-3xl font-bold text-gray-800">{{ activeWorkers }}</p>
        </div>
        <i class="bx bx-user-check text-4xl text-green-500"></i>
      </div>

      <div class="bg-white p-5 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Present Today</p>
          <p class="text-3xl font-bold text-gray-800">{{ presentWorkersToday }}</p>
        </div>
        <i class="bx bx-calendar text-4xl text-gray-400"></i>
      </div>

      <div class="bg-white p-5 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Avg Rating</p>
          <p class="text-3xl font-bold text-gray-800">{{ avgRating.toFixed(1) }}</p>
        </div>
        <i class="bx bx-medal text-4xl text-yellow-500"></i>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="flex border-b border-gray-200 mb-6">
        <button
          @click="activeTab = 'workerCards'"
          :class="{'text-blue-600 border-b-2 border-blue-600 font-medium': activeTab === 'workerCards', 'text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-600': activeTab !== 'workerCards'}"
          class="px-4 py-2 transition-colors"
        >Worker Cards</button>
        <button
          @click="activeTab = 'attendanceTable'"
          :class="{'text-blue-600 border-b-2 border-blue-600 font-medium': activeTab === 'attendanceTable', 'text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-600': activeTab !== 'attendanceTable'}"
          class="px-4 py-2 transition-colors"
        >Attendance Table</button>
        <button
          @click="activeTab = 'performanceReport'"
          :class="{'text-blue-600 border-b-2 border-blue-600 font-medium': activeTab === 'performanceReport', 'text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-600': activeTab !== 'performanceReport'}"
          class="px-4 py-2 transition-colors"
        >Performance Report</button>
      </div>

      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <div class="relative flex-grow">
          <input
            type="text"
            placeholder="Search workers..."
            v-model="searchQuery"
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <i class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
        <select v-model="selectedStatus" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Status</option>
          <option v-for="status in workerStatuses" :key="status" :value="status">{{ status }}</option>
        </select>
        <select v-model="selectedDivision" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Divisions</option>
          <option v-for="division in workerDivisions" :key="division" :value="division">{{ division }}</option>
        </select>
      </div>

      <div v-if="activeTab === 'workerCards'">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
                v-for="worker in filteredWorkers"
                :key="worker.id"
                class="bg-white border border-gray-200 rounded-lg shadow-sm p-6"
            >
                <div class="flex items-center mb-4">
                    <div :class="getWorkerInitialBg(worker.name)" class="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                        {{ worker.name.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800">{{ worker.name }}</h3>
                        <p class="text-sm text-gray-500">Code: {{ worker.code }}</p>
                    </div>
                </div>

                <div class="flex justify-between items-center mb-4">
                    <span :class="getWorkerStatusColor(worker.status)" class="text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {{ worker.status }}
                    </span>
                    <span v-if="worker.presentToday" class="text-green-600 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-100">
                        present
                    </span>
                </div>

                <div class="space-y-2 text-sm text-gray-700 mb-6">
                    <p class="flex items-center"><i class="bx bx-group mr-2"></i> Gang: <span class="font-semibold">{{ worker.gangNo }}</span></p>
                    <p v-if="worker.blockNo" class="flex items-center"><i class="bx bx-map-pin mr-2"></i> Block: <span class="font-semibold">{{ worker.blockNo }}</span></p>
                    <p class="flex items-center"><i class="bx bx-category mr-2"></i> Division: <span class="font-semibold">{{ worker.workDivision }}</span></p>
                    <p class="flex items-center"><i class="bx bx-briefcase-alt mr-2"></i> Nature: <span class="font-semibold">{{ worker.workNature }}</span></p>
                    <p class="flex items-center"><i class="bx bx-time mr-2"></i> Total Hours: <span class="font-semibold">{{ worker.totalHours }}h</span></p>
                    <p class="flex items-center"><i class="bx bx-star mr-2"></i> Rating: <span class="font-semibold">{{ worker.avgRating.toFixed(1) }}/5</span></p>
                </div>

                <div class="flex justify-end space-x-2">
                    <button @click="editWorker(worker)" class="text-gray-500 hover:text-gray-700"><i class="bx bx-edit text-xl"></i></button>
                    <button @click="deleteWorker(worker.id)" class="text-gray-500 hover:text-gray-700"><i class="bx bx-trash text-xl"></i></button>
                </div>
            </div>
        </div>
        <div v-if="filteredWorkers.length === 0" class="text-center py-10 text-gray-500">
            No workers found matching your criteria.
        </div>
      </div>

      <div v-else-if="activeTab === 'attendanceTable'">
        <p class="text-gray-600">Attendance table will be displayed here.</p>
        </div>

      <div v-else-if="activeTab === 'performanceReport'">
        <p class="text-gray-600">Performance report will be displayed here.</p>
        </div>
    </div>

    <AddWorkerModal
      :show="showAddWorkerModal"
      @close="closeAddWorkerModal"
      @add-worker="handleAddWorker"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AddWorkerModal from '@/components/AddWorkerModal.vue';

// Reactive state variables
const showAddWorkerModal = ref(false);
const activeTab = ref('workerCards');
const searchQuery = ref('');
const selectedStatus = ref('');
const selectedDivision = ref('');

// Dummy worker data
const workers = ref([
  {
    id: 'w1',
    name: 'Ahmad Rahman',
    code: 'A001',
    gangNo: '3',
    blockNo: 'A-12',
    workDivision: 'Harvesting',
    workNature: 'Harvester',
    status: 'Active',
    avgRating: 4.8,
    presentToday: true,
    totalHours: 6.5
  },
  {
    id: 'w2',
    name: 'Siti Nurhaiza',
    code: 'A002',
    gangNo: '2',
    blockNo: 'B-8',
    workDivision: 'Harvesting',
    workNature: 'Loose Fruit Collection',
    status: 'Active',
    avgRating: 4.6,
    presentToday: true,
    totalHours: 7.2
  },
  {
    id: 'w3',
    name: 'John Smith',
    code: 'M001',
    gangNo: '1',
    blockNo: null,
    workDivision: 'Mechanisation fleet',
    workNature: 'Tractor A',
    status: 'On break',
    avgRating: 4.9,
    presentToday: true,
    totalHours: 4
  },
  {
    id: 'w4',
    name: 'Maria Santos',
    code: 'S001',
    gangNo: '1',
    blockNo: 'Main Gate',
    workDivision: 'General workers',
    workNature: 'Security Personnel',
    status: 'Active',
    avgRating: 4.7,
    presentToday: true,
    totalHours: 8
  },
]);

// Filter options from user input
const workerStatuses = [
  'Active',
  'Inactive',
  'On break',
  'Absent'
];

const workerDivisions = [
  'General workers',
  'Harvesting',
  'Manuring',
  'Weeding',
  'Pest & Disease',
  'Mechanisation fleet'
];


// Computed properties for summary cards
const totalWorkers = computed(() => workers.value.length);
const activeWorkers = computed(() => workers.value.filter(worker => worker.status === 'Active').length);
const presentWorkersToday = computed(() => workers.value.filter(worker => worker.presentToday).length);
const avgRating = computed(() => {
  if (workers.value.length === 0) return 0;
  const total = workers.value.reduce((sum, worker) => sum + worker.avgRating, 0);
  return total / workers.value.length;
});

// Computed property for filtered workers
const filteredWorkers = computed(() => {
  let filtered = workers.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(worker =>
      worker.name.toLowerCase().includes(query) ||
      worker.code.toLowerCase().includes(query) ||
      worker.gangNo.toLowerCase().includes(query) ||
      (worker.blockNo && worker.blockNo.toLowerCase().includes(query)) ||
      worker.workDivision.toLowerCase().includes(query) ||
      worker.workNature.toLowerCase().includes(query)
    );
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(worker => worker.status === selectedStatus.value);
  }

  if (selectedDivision.value) {
    filtered = filtered.filter(worker => worker.workDivision === selectedDivision.value);
  }

  return filtered;
});

// Modal control functions
const closeAddWorkerModal = () => {
  showAddWorkerModal.value = false;
};

const handleAddWorker = (newWorkerData) => {
  // Generate a simple unique ID for the new worker
  const newId = 'w' + (workers.value.length + 1);
  workers.value.push({
    ...newWorkerData,
    id: newId,
    // Ensure default values are set if not provided by the form
    status: newWorkerData.status || 'Active',
    avgRating: newWorkerData.avgRating || 0,
    presentToday: newWorkerData.presentToday !== undefined ? newWorkerData.presentToday : false,
    totalHours: newWorkerData.totalHours || 0,
  });
  closeAddWorkerModal(); // Close the modal after adding
};

// Worker card actions (placeholders for now)
const editWorker = (worker) => {
  alert(`Edit Worker: ${worker.name}. This would open an edit modal.`);
  // Future: Implement an edit modal similar to CreateTaskModal for workers
};

const deleteWorker = (id) => {
  if (confirm('Are you sure you want to delete this worker?')) {
    workers.value = workers.value.filter(worker => worker.id !== id);
  }
};

// Helper for dynamic styling
const getWorkerInitialBg = (name) => {
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500'];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const getWorkerStatusColor = (status) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-700';
    case 'Inactive': return 'bg-red-100 text-red-700';
    case 'On break': return 'bg-yellow-100 text-yellow-700';
    case 'Absent': return 'bg-gray-100 text-gray-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};
</script>

<style scoped>
/* Any component-specific styles go here. Tailwind CSS handles most styling. */
</style>