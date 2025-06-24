<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <i class="bx bx-error-alt text-blue-500 text-3xl"></i>
        Alarms
      </h1>

      <!-- Filters and Actions Section - MODIFIED (Filters removed) -->
      <div class="flex flex-col sm:flex-row justify-end items-center mb-4 gap-3">
        <!-- Filters - REMOVED -->
        <!-- Right-aligned actions -->
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <button
            class="p-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            @click="refreshAlarms"
          >
            <i class="bx bx-rotate-right text-lg"></i>
          </button>
          <div class="relative flex-grow">
            <input
              type="text"
              placeholder="Search alarms..."
              v-model="searchTerm"
              class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <i class="bx bx-search absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>
      </div>

      <!-- Alarms Table -->
      <div class="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th
                v-for="column in columns"
                :key="column.key"
                @click="sortBy(column.key)"
                class="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                :class="{ 'text-blue-600': sortColumn === column.key }"
              >
                {{ column.label }}
                <span v-if="sortColumn === column.key">
                  <i :class="sortDirection === 'asc' ? 'bx bx-chevron-up' : 'bx bx-chevron-down'"></i>
                </span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="alarm in paginatedAlarms" :key="alarm.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 whitespace-nowrap">{{ alarm.createdTime }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-blue-600 cursor-pointer hover:underline">{{ alarm.location }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ alarm.type }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span
                  :class="{
                    'text-red-600 font-semibold': alarm.severity === 'Critical',
                    'text-orange-500 font-semibold': alarm.severity === 'Major',
                    'text-yellow-500 font-semibold': alarm.severity === 'Warning',
                  }"
                  >{{ alarm.severity }}</span
                >
              </td>
              <td class="px-4 py-3 whitespace-nowrap">{{ alarm.status }}</td>
            </tr>
            <tr v-if="paginatedAlarms.length === 0">
              <td :colspan="columns.length" class="px-4 py-3 text-center text-gray-500">No alarms found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-600 gap-3">
        <div class="flex items-center gap-2">
          <span>Items per page:</span>
          <select
            v-model="itemsPerPage"
            class="border border-gray-300 rounded-lg px-2 py-1 bg-white focus:ring-blue-500 focus:border-blue-500"
          >
            <option>5</option>
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
        </div>
        <span>{{ startIndex + 1 }} - {{ endIndex }} of {{ filteredAndSortedAlarms.length }}</span>
        <div class="flex gap-2">
          <button
            class="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            <i class="bx bx-chevron-left"></i>
          </button>
          <button
            class="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentPage * itemsPerPage >= filteredAndSortedAlarms.length"
            @click="currentPage++"
          >
            <i class="bx bx-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Mock Alarm Data
const alarms = ref([
  {
    id: 1,
    createdTime: '2025-06-20 15:14:28',
    location: 'Cyberjaya Central',
    type: 'High Temperature',
    severity: 'Critical',
    status: 'Active'
  },
  {
    id: 2,
    createdTime: '2025-06-20 15:14:28',
    location: 'Putrajaya',
    type: 'High CO2 level',
    severity: 'Major',
    status: 'Active'
  },
  {
    id: 3,
    createdTime: '2025-06-20 15:14:27',
    location: 'Sungai Merab',
    type: 'Voltage Fluctuation',
    severity: 'Major',
    status: 'Active'
  },
  {
    id: 4,
    createdTime: '2025-06-20 15:14:27',
    location: 'Puchong',
    type: 'Low Battery',
    severity: 'Warning',
    status: 'Active'
  },
  {
    id: 5,
    createdTime: '2025-06-20 15:14:27',
    location: 'Kajang',
    type: 'High Humidity',
    severity: 'Major',
    status: 'Active'
  },
  {
    id: 6,
    createdTime: '2025-06-20 15:14:27',
    location: 'Serdang',
    type: 'Offline',
    severity: 'Critical',
    status: 'Active'
  },
  {
    id: 7,
    createdTime: '2025-06-20 15:14:27',
    location: 'Kajang',
    type: 'Overcharge',
    severity: 'Warning',
    status: 'Active'
  },
  {
    id: 8,
    createdTime: '2025-06-19 10:00:00',
    location: 'Sungai Merab',
    type: 'Moisture Detected',
    severity: 'Critical',
    status: 'Acknowledged'
  },
  {
    id: 9,
    createdTime: '2025-06-18 09:30:00',
    location: 'Putrajaya',
    type: 'Communication Loss',
    severity: 'Major',
    status: 'Active'
  },
]);

// Filtering - MODIFIED (removed activeFilter and timeFilter)
const searchTerm = ref('');

const filteredAlarms = computed(() => {
  let filtered = alarms.value;

  // Only apply search term filter now
  if (searchTerm.value) {
    const lowerSearchTerm = searchTerm.value.toLowerCase();
    filtered = filtered.filter(alarm =>
      alarm.location.toLowerCase().includes(lowerSearchTerm) ||
      alarm.type.toLowerCase().includes(lowerSearchTerm) ||
      alarm.severity.toLowerCase().includes(lowerSearchTerm) ||
      alarm.status.toLowerCase().includes(lowerSearchTerm)
    );
  }

  return filtered;
});

// Sorting (remains unchanged)
const sortColumn = ref('createdTime');
const sortDirection = ref('desc');

const filteredAndSortedAlarms = computed(() => {
  const sorted = [...filteredAlarms.value].sort((a, b) => {
    const aValue = a[sortColumn.value];
    const bValue = b[sortColumn.value];

    if (aValue < bValue) {
      return sortDirection.value === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection.value === 'asc' ? 1 : -1;
    }
    return 0;
  });
  return sorted;
});

const sortBy = (columnKey) => {
  if (sortColumn.value === columnKey) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = columnKey;
    sortDirection.value = 'asc';
  }
};

const columns = [
  { key: 'createdTime', label: 'Created time' },
  { key: 'location', label: 'Location' },
  { key: 'type', label: 'Type' },
  { key: 'severity', label: 'Severity' },
  { key: 'status', label: 'Status' },
];

// Pagination (remains unchanged)
const currentPage = ref(1);
const itemsPerPage = ref(10);

const paginatedAlarms = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + parseInt(itemsPerPage.value);
  return filteredAndSortedAlarms.value.slice(start, end);
});

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => Math.min(startIndex.value + parseInt(itemsPerPage.value), filteredAndSortedAlarms.value.length));

// Actions (remains unchanged)
const refreshAlarms = () => {
  currentPage.value = 1;
  searchTerm.value = '';
  sortColumn.value = 'createdTime';
  sortDirection.value = 'desc';
  console.log('Alarms refreshed!');
};
</script>

<style scoped>
/* No specific scoped styles needed as Tailwind CSS is used extensively. */
</style>
