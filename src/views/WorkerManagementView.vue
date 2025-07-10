<template>
  <div class="p-6 bg-gray-100 min-h-screen">

    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Worker Management</h1>
        <p class="text-gray-600">Comprehensive workforce management and attendance tracking</p>
      </div>
      <button
        @click="openAddWorkerModal"
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
        <i class="bx bx-star text-4xl text-yellow-500"></i>
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
                    <span v-if="isWorkerPresent(worker.id, getCurrentDateForInput())" class="text-green-600 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-100">
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
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div class="flex items-center gap-3">
            <h3 class="text-xl font-semibold text-gray-800 whitespace-nowrap">Daily Attendance -</h3>
            <div class="relative">
                <input
                    type="date"
                    v-model="selectedDate"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div class="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white cursor-pointer hover:border-blue-500 transition-colors">
                    <i class="bx bx-calendar text-lg text-gray-500 mr-2"></i>
                    <span class="text-gray-700 font-medium">{{ formatDisplayDate(selectedDate) }}</span>
                </div>
            </div>
          </div>
          <div class="flex gap-3 w-full md:w-auto">
            <button class="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-blue-700 transition-colors w-1/2 md:w-auto justify-center">
              <i class="bx bx-download mr-2"></i> Export
            </button>
            <button class="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-green-700 transition-colors w-1/2 md:w-auto justify-center">
              <i class="bx bx-upload mr-2"></i> Import
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr class="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th class="px-6 py-3 border-b-2 border-gray-200">No</th>
                <th class="px-6 py-3 border-b-2 border-gray-200">Worker Name/Code</th>
                <th class="px-6 py-3 border-b-2 border-gray-200">Gang No</th>
                <th class="px-6 py-3 border-b-2 border-gray-200">Work Division</th>
                <th class="px-6 py-3 border-b-2 border-gray-200">Work Nature</th>
                <th class="px-6 py-3 border-b-2 border-gray-200 text-center">Attendance</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredWorkers.length === 0">
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">No workers found matching your criteria.</td>
              </tr>
              <tr v-for="(worker, index) in filteredWorkers" :key="worker.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">{{ index + 1 }}</td>
                <td class="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">
                  <div class="font-medium">{{ worker.name }}</div>
                  <div class="text-gray-500 text-xs">{{ worker.code }}</div>
                </td>
                <td class="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">{{ worker.gangNo || 'N/A' }}</td>
                <td class="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">
                  <span class="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {{ worker.workDivision }}
                  </span>
                </td>
                <td class="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">{{ worker.workNature || 'N/A' }}</td>
                <td class="px-6 py-4 border-b border-gray-200 text-sm text-center">
                  <label class="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      :checked="isWorkerPresent(worker.id, selectedDate)"
                      @change="event => handleAttendanceChange(worker.id, selectedDate, event.target.checked)"
                      class="form-checkbox h-5 w-5 text-green-600 rounded focus:ring-green-500"
                    >
                    <span class="ml-2 text-gray-700 select-none">{{ isWorkerPresent(worker.id, selectedDate) ? 'Present' : 'Absent' }}</span>
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else-if="activeTab === 'performanceReport'">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h3 class="text-xl font-semibold text-gray-800">Performance Report</h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="range in performanceDateRanges"
              :key="range"
              @click="selectedPerformanceDateRange = range"
              :class="{
                'bg-blue-600 text-white': selectedPerformanceDateRange === range,
                'bg-gray-200 text-gray-700 hover:bg-gray-300': selectedPerformanceDateRange !== range
              }"
              class="px-4 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              {{ range }}
            </button>
            <button class="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-blue-700 transition-colors">
              <i class="bx bx-download mr-2"></i> Export Report
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white p-5 rounded-lg shadow-md flex items-center justify-between border-t-4 border-green-500">
            <div>
              <p class="text-sm text-gray-500">Avg Productivity</p>
              <p class="text-3xl font-bold text-gray-800">{{ overallPerformanceSummary.avgProductivity.toFixed(1) }} kg</p>
            </div>
            <i class="bx bx-trending-up text-4xl text-green-500"></i>
          </div>

          <div class="bg-white p-5 rounded-lg shadow-md flex items-center justify-between border-t-4 border-blue-500">
            <div>
              <p class="text-sm text-gray-500">Avg Efficiency</p>
              <p class="text-3xl font-bold text-gray-800">{{ overallPerformanceSummary.avgEfficiency.toFixed(1) }}%</p>
            </div>
            <i class="bx bx-target-lock text-4xl text-blue-500"></i>
          </div>

          <div class="bg-white p-5 rounded-lg shadow-md flex items-center justify-between border-t-4 border-orange-500">
            <div>
              <p class="text-sm text-gray-500">Total Coverage</p>
              <p class="text-3xl font-bold text-gray-800">{{ overallPerformanceSummary.totalCoverage.toFixed(1) }} ha</p>
            </div>
            <i class="bx bx-area text-4xl text-orange-500"></i>
          </div>

          <div class="bg-white p-5 rounded-lg shadow-md flex items-center justify-between border-t-4 border-purple-500">
            <div>
              <p class="text-sm text-gray-500">Total Hours</p>
              <p class="text-3xl font-bold text-gray-800">{{ overallPerformanceSummary.totalHours.toFixed(1) }}h</p>
            </div>
            <i class="bx bx-time text-4xl text-purple-500"></i>
          </div>
        </div>

        <div class="overflow-x-auto mb-8">
          <table class="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr class="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th class="px-6 py-3 border-b-2 border-gray-200">Rank</th>
                <th class="px-6 py-3 border-b-2 border-gray-200">Worker</th>
                <th class="px-6 py-3 border-b-2 border-gray-200">Gang</th>
                <th class="px-6 py-3 border-b-2 border-gray-200">Division</th>
                <th class="px-6 py-3 border-b-2 border-gray-200 text-right">Productivity (kg)</th>
                <th class="px-6 py-3 border-b-2 border-gray-200 text-right">Efficiency (%)</th>
                <th class="px-6 py-3 border-b-2 border-gray-200 text-right">Coverage (ha)</th>
                <th class="px-6 py-3 border-b-2 border-gray-200 text-right">Hours</th>
                <th class="px-6 py-3 border-b-2 border-gray-200 text-center">Trend</th>
                <th class="px-6 py-3 border-b-2 border-gray-200 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="processedPerformanceData.length === 0">
                <td colspan="10" class="px-6 py-4 text-center text-gray-500">No performance data available for this period.</td>
              </tr>
              <tr v-for="(worker, index) in processedPerformanceData" :key="worker.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">
                  <span :class="getRankColor(index + 1)" class="font-bold text-lg mr-1">{{ index + 1 }}</span>
                </td>
                <td class="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">
                  <div class="font-medium">{{ worker.name }}</div>
                  <div class="text-gray-500 text-xs">{{ worker.code }}</div>
                </td>
                <td class="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">{{ worker.gangNo }}</td>
                <td class="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">
                  <span class="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {{ worker.workDivision }}
                  </span>
                </td>
                <td class="px-6 py-4 border-b border-gray-200 text-sm text-gray-900 text-right">{{ worker.productivity.toFixed(1) }}</td>
                <td class="px-6 py-4 border-b border-gray-200 text-sm text-gray-900 text-right">
                    <div class="flex items-center justify-end">
                        <span>{{ worker.efficiency.toFixed(1) }}%</span>
                        <div class="w-20 ml-2 bg-gray-200 rounded-full h-2.5">
                            <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: worker.efficiency + '%' }"></div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 border-b border-gray-200 text-sm text-gray-900 text-right">{{ worker.coverage.toFixed(1) }}</td>
                <td class="px-6 py-4 border-b border-gray-200 text-sm text-gray-900 text-right">{{ worker.hours.toFixed(1) }}</td>
                <td class="px-6 py-4 border-b border-gray-200 text-sm text-center">
                    <span :class="getTrendColor(worker.trend)" class="flex items-center justify-center text-xs font-semibold">
                        <i :class="getTrendIcon(worker.trend)" class="mr-1"></i>
                        {{ Math.abs(worker.trend) }}%
                    </span>
                </td>
                <td class="px-6 py-4 border-b border-gray-200 text-sm text-center">
                  <span :class="getWorkerStatusColor(worker.status)" class="text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {{ worker.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white p-5 rounded-lg shadow-md border-t-4 border-green-500">
                <p class="text-sm text-gray-500 mb-2">Top Performer</p>
                <p class="text-lg font-semibold text-gray-800" v-if="topPerformer">
                    {{ topPerformer.name }} leads with {{ topPerformer.productivity.toFixed(1) }} kg productivity
                </p>
                <p v-else class="text-gray-500">N/A</p>
            </div>
            <div class="bg-white p-5 rounded-lg shadow-md border-t-4 border-blue-500">
                <p class="text-sm text-gray-500 mb-2">Most Efficient</p>
                <p class="text-lg font-semibold text-gray-800" v-if="mostEfficient">
                    {{ mostEfficient.name }} with {{ mostEfficient.efficiency.toFixed(1) }}% efficiency
                </p>
                <p v-else class="text-gray-500">N/A</p>
            </div>
            <div class="bg-white p-5 rounded-lg shadow-md border-t-4 border-orange-500">
                <p class="text-sm text-gray-500 mb-2">Largest Coverage</p>
                <p class="text-lg font-semibold text-gray-800" v-if="largestCoverage">
                    {{ largestCoverage.name }} covered {{ largestCoverage.coverage.toFixed(1) }} ha
                </p>
                <p v-else class="text-gray-500">N/A</p>
            </div>
        </div>
      </div>
    </div>

    <AddWorkerModal
      :show="showAddWorkerModal"
      :workerData="editingWorker"
      @close="closeAddWorkerModal"
      @add-worker="handleAddWorker"
      @update-worker="handleUpdateWorker"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import AddWorkerModal from '@/components/AddWorkerModal.vue';

// Reactive state variables
const showAddWorkerModal = ref(false);
const editingWorker = ref(null); // Stores the worker object being edited, null if adding
const activeTab = ref('workerCards');
const searchQuery = ref('');
const selectedStatus = ref('');
const selectedDivision = ref('');
const selectedDate = ref(getCurrentDateForInput()); // Initialize attendance date with today's date

// --- Performance Report State ---
const performanceDateRanges = ['Today', 'This Week', 'This Month', 'This Quarter'];
const selectedPerformanceDateRange = ref('Today'); // Default selected range

// --- Attendance Records Management ---
// Stores attendance for all workers across different dates
// Structure: [{ workerId: 'w1', date: '2025-07-09', isPresent: true }, ...]
const attendanceRecords = ref([]);

// Dummy worker data (now with dailyPerformance array)
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
    avgRating: 4.8, // This will be calculated from dailyPerformance in a real app
    totalHours: 6.5, // This will be calculated from dailyPerformance in a real app
    dailyPerformance: [] // Populated in onMounted
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
    totalHours: 7.2,
    dailyPerformance: []
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
    totalHours: 4,
    dailyPerformance: []
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
    totalHours: 8,
    dailyPerformance: []
  },
]);

// Filter options
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


// Computed properties for dashboard summary cards
const totalWorkers = computed(() => workers.value.length);
const activeWorkers = computed(() => workers.value.filter(worker => worker.status === 'Active').length);
const presentWorkersToday = computed(() => {
  return workers.value.filter(worker => isWorkerPresent(worker.id, getCurrentDateForInput())).length;
});
const avgRating = computed(() => {
  if (workers.value.length === 0) return 0;
  // This avgRating is for the cards, maybe it should also be based on current performance range or overall history
  // For now, it's just the hardcoded avgRating on worker object. In a real app, it would be aggregated.
  const total = workers.value.reduce((sum, worker) => sum + worker.avgRating, 0);
  return total / workers.value.length;
});

// Computed property for filtered workers (remains mostly the same for general filtering)
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

// --- Date & Attendance Functions ---

// Helper to get current date in ISO (YYYY-MM-DD) format for input[type="date"]
function getCurrentDateForInput() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Helper to format date for display (e.g., 7/9/2025)
const formatDisplayDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00'); // Add T00:00:00 to avoid timezone issues
  return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
};

// Check if a worker is present on a specific date
const isWorkerPresent = (workerId, date) => {
  const record = attendanceRecords.value.find(rec => rec.workerId === workerId && rec.date === date);
  return record ? record.isPresent : false;
};

// Handle checkbox change for attendance
const handleAttendanceChange = (workerId, date, isChecked) => {
  const existingRecordIndex = attendanceRecords.value.findIndex(record =>
    record.workerId === workerId && record.date === date
  );

  if (existingRecordIndex !== -1) {
    attendanceRecords.value[existingRecordIndex].isPresent = isChecked;
  } else {
    attendanceRecords.value.push({ workerId, date, isPresent: isChecked });
  }
  // console.log(`Worker ${workerId} on ${date} set to ${isChecked ? 'Present' : 'Absent'}`);
};

// --- Performance Report Logic ---

const getDatesForRange = (range) => {
  const now = new Date();
  let startDate = new Date(now);
  let endDate = new Date(now);

  startDate.setHours(0, 0, 0, 0); // Start of day
  endDate.setHours(23, 59, 59, 999); // End of day

  switch (range) {
    case 'Today':
      // Already set to today
      break;
    case 'This Week':
      // Adjust to start of the current week (Sunday)
      startDate.setDate(now.getDate() - now.getDay());
      break;
    case 'This Month':
      // Adjust to start of the current month
      startDate.setDate(1);
      break;
    case 'This Quarter':
      // Determine the current quarter (0-indexed: Q1=0, Q2=1, Q3=2, Q4=3)
      const currentMonth = now.getMonth();
      const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
      startDate.setMonth(quarterStartMonth, 1);
      endDate.setMonth(quarterStartMonth + 3, 0); // Last day of last month of quarter
      break;
  }
  return { startDate, endDate };
};

const processedPerformanceData = computed(() => {
    const { startDate, endDate } = getDatesForRange(selectedPerformanceDateRange.value);
    const results = workers.value.map(worker => {
        let totalProductivity = 0;
        let totalEfficiency = 0;
        let totalCoverage = 0;
        let totalHours = 0;
        let dailyRecordsCount = 0;

        // Filter daily performance data for the selected range
        const relevantPerformance = worker.dailyPerformance.filter(record => {
            const recordDate = new Date(record.date + 'T00:00:00');
            return recordDate >= startDate && recordDate <= endDate;
        });

        relevantPerformance.forEach(record => {
            totalProductivity += record.productivityKg || 0;
            totalEfficiency += record.efficiency || 0;
            totalCoverage += record.coverageHa || 0;
            totalHours += record.hours || 0;
            dailyRecordsCount++;
        });

        // Calculate averages for relevant metrics
        const avgEfficiency = dailyRecordsCount > 0 ? totalEfficiency / dailyRecordsCount : 0;

        // Simple trend simulation: +5% if total productivity > 200, -5% if < 50
        // In a real app, this would compare to the previous period.
        let trend = 0;
        if (totalProductivity > 200) trend = 5;
        else if (totalProductivity < 50 && dailyRecordsCount > 0) trend = -5;


        return {
            id: worker.id,
            name: worker.name,
            code: worker.code,
            gangNo: worker.gangNo,
            workDivision: worker.workDivision,
            status: worker.status,
            productivity: totalProductivity,
            efficiency: avgEfficiency,
            coverage: totalCoverage,
            hours: totalHours,
            trend: trend // For demo, can be positive/negative based on productivity
        };
    })
    .filter(worker => worker.productivity > 0 || worker.efficiency > 0 || worker.coverage > 0 || worker.hours > 0) // Only show workers with activity
    .sort((a, b) => b.productivity - a.productivity); // Sort by productivity for ranking

    return results;
});

const overallPerformanceSummary = computed(() => {
    let totalProductivity = 0;
    let totalEfficiency = 0;
    let totalCoverage = 0;
    let totalHours = 0;
    let workerCountWithData = 0;

    processedPerformanceData.value.forEach(worker => {
        totalProductivity += worker.productivity;
        totalEfficiency += worker.efficiency;
        totalCoverage += worker.coverage;
        totalHours += worker.hours;
        if (worker.productivity > 0 || worker.efficiency > 0 || worker.coverage > 0 || worker.hours > 0) {
            workerCountWithData++;
        }
    });

    return {
        avgProductivity: totalProductivity / (workerCountWithData || 1),
        avgEfficiency: totalEfficiency / (workerCountWithData || 1),
        totalCoverage: totalCoverage,
        totalHours: totalHours
    };
});

const topPerformer = computed(() => {
    return processedPerformanceData.value.length > 0 ? processedPerformanceData.value[0] : null;
});

const mostEfficient = computed(() => {
    return processedPerformanceData.value.length > 0
        ? processedPerformanceData.value.reduce((prev, current) => (prev.efficiency > current.efficiency ? prev : current))
        : null;
});

const largestCoverage = computed(() => {
    return processedPerformanceData.value.length > 0
        ? processedPerformanceData.value.reduce((prev, current) => (prev.coverage > current.coverage ? prev : current))
        : null;
});

const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-700'; // Bronze-like color
    return 'text-gray-500';
};

const getTrendColor = (trend) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-500';
};

const getTrendIcon = (trend) => {
    if (trend > 0) return 'bx bx-up-arrow-alt';
    if (trend < 0) return 'bx bx-down-arrow-alt';
    return 'bx bx-line-chart';
};


// --- Initialization and Worker Modal Functions ---

onMounted(() => {
  // Populate initial attendance and performance data for dummy workers
  const today = getCurrentDateForInput();
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
  const twoDaysAgo = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0];
  const lastWeek = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0];
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0];

  workers.value.forEach(worker => {
    // Attendance Data
    attendanceRecords.value.push({ workerId: worker.id, date: today, isPresent: ['w1', 'w2', 'w4'].includes(worker.id) });
    attendanceRecords.value.push({ workerId: worker.id, date: yesterday, isPresent: ['w1', 'w3'].includes(worker.id) });
    attendanceRecords.value.push({ workerId: worker.id, date: twoDaysAgo, isPresent: ['w2', 'w4'].includes(worker.id) });
    // Add more attendance history as needed for realism

    // Performance Data (simulated daily records)
    // For Today
    if (worker.id === 'w1') worker.dailyPerformance.push({ date: today, productivityKg: 245, efficiency: 96, coverageHa: 2.5, hours: 6.5 });
    if (worker.id === 'w2') worker.dailyPerformance.push({ date: today, productivityKg: 180, efficiency: 92, coverageHa: 1.8, hours: 7.2 });
    if (worker.id === 'w3') worker.dailyPerformance.push({ date: today, productivityKg: 0, efficiency: 98, coverageHa: 0.0, hours: 4.0 }); // On break
    if (worker.id === 'w4') worker.dailyPerformance.push({ date: today, productivityKg: 0, efficiency: 94, coverageHa: 0.0, hours: 8.0 });

    // For Yesterday
    if (worker.id === 'w1') worker.dailyPerformance.push({ date: yesterday, productivityKg: 240, efficiency: 95, coverageHa: 2.4, hours: 6.0 });
    if (worker.id === 'w2') worker.dailyPerformance.push({ date: yesterday, productivityKg: 175, efficiency: 91, coverageHa: 1.7, hours: 7.0 });
    // John Smith was present yesterday with a task (productivity 0 for tractor example)
    if (worker.id === 'w3') worker.dailyPerformance.push({ date: yesterday, productivityKg: 0, efficiency: 97, coverageHa: 0.0, hours: 8.0 });
    if (worker.id === 'w4') worker.dailyPerformance.push({ date: yesterday, productivityKg: 0, efficiency: 93, coverageHa: 0.0, hours: 8.0 });

    // For 2 Days Ago
    if (worker.id === 'w1') worker.dailyPerformance.push({ date: twoDaysAgo, productivityKg: 230, efficiency: 94, coverageHa: 2.3, hours: 6.2 });
    if (worker.id === 'w2') worker.dailyPerformance.push({ date: twoDaysAgo, productivityKg: 170, efficiency: 90, coverageHa: 1.6, hours: 6.8 });
    if (worker.id === 'w3') worker.dailyPerformance.push({ date: twoDaysAgo, productivityKg: 0, efficiency: 99, coverageHa: 0.0, hours: 5.0 });
    if (worker.id === 'w4') worker.dailyPerformance.push({ date: twoDaysAgo, productivityKg: 0, efficiency: 92, coverageHa: 0.0, hours: 8.0 });

    // Add some more random historical data for 'This Month' and 'This Quarter'
    // For simplicity, let's add a few more for Ahmad and Siti earlier in the month/quarter
    for (let i = 3; i <= 20; i += 5) { // Roughly every 5 days for the last ~20 days
      const pastDate = new Date(new Date().setDate(new Date().getDate() - i)).toISOString().split('T')[0];
      if (worker.id === 'w1') worker.dailyPerformance.push({ date: pastDate, productivityKg: 200 + i, efficiency: 90 + i/2, coverageHa: 2.0 + i/10, hours: 6.0 + i/10 });
      if (worker.id === 'w2') worker.dailyPerformance.push({ date: pastDate, productivityKg: 150 + i, efficiency: 88 + i/2, coverageHa: 1.5 + i/10, hours: 7.0 + i/10 });
      if (worker.id === 'w3') worker.dailyPerformance.push({ date: pastDate, productivityKg: 0, efficiency: 95 + i/2, coverageHa: 0.0, hours: 4.0 + i/10 });
      if (worker.id === 'w4') worker.dailyPerformance.push({ date: pastDate, productivityKg: 0, efficiency: 90 + i/2, coverageHa: 0.0, hours: 8.0 + i/10 });
    }
  });
});

// Function to open modal for adding a new worker
const openAddWorkerModal = () => {
  editingWorker.value = null; // Ensure we're in 'add' mode
  showAddWorkerModal.value = true;
};

// Function to open modal for editing an existing worker
const editWorker = (worker) => {
  editingWorker.value = { ...worker }; // Set the worker data to be edited
  showAddWorkerModal.value = true;
};

// Close modal and reset editing state
const closeAddWorkerModal = () => {
  showAddWorkerModal.value = false;
  editingWorker.value = null; // Clear editing worker data
};

const handleAddWorker = (newWorkerData) => {
  const newId = 'w' + (workers.value.length + 1); // Simple ID generation
  workers.value.push({
    ...newWorkerData,
    id: newId,
    status: newWorkerData.status || 'Active',
    avgRating: newWorkerData.avgRating || 0,
    totalHours: newWorkerData.totalHours || 0,
    dailyPerformance: [] // New workers start with no performance data
  });
  // Also add them to today's attendance (defaulting to present)
  attendanceRecords.value.push({
    workerId: newId,
    date: getCurrentDateForInput(),
    isPresent: true
  });
  closeAddWorkerModal();
};

// Handle updating an existing worker
const handleUpdateWorker = (updatedWorkerData) => {
  const index = workers.value.findIndex(w => w.id === updatedWorkerData.id);
  if (index !== -1) {
    // Merge updated data into the existing worker object
    // Keep existing dailyPerformance as it's not edited via this modal
    const currentPerformance = workers.value[index].dailyPerformance;
    workers.value[index] = { ...workers.value[index], ...updatedWorkerData, dailyPerformance: currentPerformance };
  }
  closeAddWorkerModal();
};

const deleteWorker = (id) => {
  if (confirm('Are you sure you want to delete this worker?')) {
    workers.value = workers.value.filter(worker => worker.id !== id);
    // Also remove attendance records for this worker
    attendanceRecords.value = attendanceRecords.value.filter(record => record.workerId !== id);
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
/* Hide default calendar icon on input type="date" in some browsers */
input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>