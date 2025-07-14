<template>
  <div class="flex-grow p-6 bg-gray-100 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Asset Management</h1>
      <button
        @click="showAddAssetModal = true"
         class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center shadow-md">
        <i class="bx bx-plus mr-2"></i> Add Asset
      </button>
    </div>
    <p class="text-gray-600 mb-8">Monitor and manage plantation equipment, vehicles, UGVs, and logging devices</p>

    <div class="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-200">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800 flex items-center">
          <i class="bx bx-mobile-alt text-2xl text-orange-500 mr-2"></i> Logging Devices Overview
        </h2>
        <div class="flex space-x-3">
          <button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center text-sm shadow-sm">
            <i class="bx bx-download mr-2"></i> Export Data
          </button>
          <button class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center text-sm shadow-sm">
            <i class="bx bx-sync mr-2"></i> Sync All
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center border border-gray-100">
          <p class="text-sm text-gray-500">Total Devices</p>
          <p class="text-3xl font-bold text-gray-800">1</p>
        </div>
        <div class="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center border border-gray-100">
          <p class="text-sm text-gray-500">Active Devices</p>
          <p class="text-3xl font-bold text-green-600">1</p>
        </div>
        <div class="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center border border-gray-100">
          <p class="text-sm text-gray-500">Today's Total Count</p>
          <p class="text-3xl font-bold text-blue-600">245</p>
        </div>
        <div class="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center border border-gray-100">
          <p class="text-sm text-gray-500">Avg Battery</p>
          <p class="text-3xl font-bold text-orange-600">85%</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-5 border-t-4 border-orange-500">
        <div class="flex justify-between items-center mb-3">
          <h4 class="text-lg font-semibold text-gray-800 flex items-center">
            <i class="bx bx-wifi text-xl mr-2 text-orange-500"></i> LoRa-Click-001
            <span class="ml-3 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">operational</span>
          </h4>
        </div>
        <div class="grid grid-cols-2 gap-2 text-sm text-gray-700">
          <div><span class="font-medium">Today's Count:</span> 245</div>
          <div><span class="font-medium">Total Count:</span> 2450</div>
          <div><span class="font-medium">Battery:</span> 85%</div>
          <div><span class="font-medium">Signal:</span> -65 dBm</div>
          <div><span class="font-medium">Worker:</span> Ahmad Rahman</div>
          <div><span class="font-medium">Last Sync:</span> 2 min ago</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
      <div :class="['bg-white rounded-lg shadow-md p-5 flex items-center justify-between border-t-4', getStatusBorderColor('operational')]">
        <div>
          <p class="text-sm text-gray-500">Operational</p>
          <p class="text-3xl font-bold text-gray-800">{{ operationalCount }}</p>
        </div>
        <div :class="['p-3 rounded-full', getStatusBgColor('operational')]">
          <i :class="['bx text-2xl', getStatusIcon('operational')]"></i>
        </div>
      </div>

      <div :class="['bg-white rounded-lg shadow-md p-5 flex items-center justify-between border-t-4', getStatusBorderColor('maintenance')]">
        <div>
          <p class="text-sm text-gray-500">Maintenance</p>
          <p class="text-3xl font-bold text-gray-800">{{ maintenanceCount }}</p>
        </div>
        <div :class="['p-3 rounded-full', getStatusBgColor('maintenance')]">
          <i :class="['bx text-2xl', getStatusIcon('maintenance')]"></i>
        </div>
      </div>

      <div :class="['bg-white rounded-lg shadow-md p-5 flex items-center justify-between border-t-4', getStatusBorderColor('offline')]">
        <div>
          <p class="text-sm text-gray-500">Offline</p>
          <p class="text-3xl font-bold text-gray-800">{{ offlineCount }}</p>
        </div>
        <div :class="['p-3 rounded-full', getStatusBgColor('offline')]">
          <i :class="['bx text-2xl', getStatusIcon('offline')]"></i>
        </div>
      </div>

      <div :class="['bg-white rounded-lg shadow-md p-5 flex items-center justify-between border-t-4', getStatusBorderColor('repair')]">
        <div>
          <p class="text-sm text-gray-500">Repair</p>
          <p class="text-3xl font-bold text-gray-800">{{ repairCount }}</p>
        </div>
        <div :class="['p-3 rounded-full', getStatusBgColor('repair')]">
          <i :class="['bx text-2xl', getStatusIcon('repair')]"></i>
        </div>
      </div>

      <div :class="['bg-white rounded-lg shadow-md p-5 flex items-center justify-between border-t-4', getStatusBorderColor('standby')]">
        <div>
          <p class="text-sm text-gray-500">Standby</p>
          <p class="text-3xl font-bold text-gray-800">{{ standyCount }}</p>
        </div>
        <div :class="['p-3 rounded-full', getStatusBgColor('standby')]">
          <i :class="['bx text-2xl', getStatusIcon('standby')]"></i>
        </div>
      </div>

      <div :class="['bg-white rounded-lg shadow-md p-5 flex items-center justify-between border-t-4', getStatusBorderColor('ugv')]">
        <div>
          <p class="text-sm text-gray-500">UGVs</p>
          <p class="text-3xl font-bold text-gray-800">{{ ugvCount }}</p>
        </div>
        <div :class="['p-3 rounded-full', getStatusBgColor('ugv')]">
          <i :class="['bx text-2xl', getStatusIcon('ugv')]"></i>
        </div>
      </div>

      <div :class="['bg-white rounded-lg shadow-md p-5 flex items-center justify-between border-t-4', getStatusBorderColor('logging_device')]">
        <div>
          <p class="text-sm text-gray-500">Logging Devices</p>
          <p class="text-3xl font-bold text-gray-800">{{ loggingDeviceCount }}</p>
        </div>
        <div :class="['p-3 rounded-full', getStatusBgColor('logging_device')]">
          <i :class="['bx text-2xl', getStatusIcon('logging_device')]"></i>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between border-t-4 border-gray-300">
        <div>
          <p class="text-sm text-gray-500">Total Hours</p>
          <p class="text-3xl font-bold text-gray-800">{{ totalWorkHours.toFixed(0) }}h</p>
        </div>
        <div class="p-3 bg-gray-100 rounded-full text-gray-500">
          <i class="bx bx-time text-2xl"></i>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-800">All Assets ({{ filteredAssets.length }})</h2>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <input
            type="text"
            placeholder="Search assets..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            v-model="searchQuery"
          />
          <i class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
        <select
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          v-model="selectedType"
        >
          <option value="All Types">All Types</option>
          <option value="tractor">Tractor</option>
          <option value="truck">Truck</option>
          <option value="ugv">UGV</option>
          <option value="harvester">Harvester</option>
          <option value="badang">Badang</option>
          <option value="tool">Tool</option>
          <option value="logging_device">Logging Device</option>
        </select>
        <select
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          v-model="selectedStatus"
        >
          <option value="All Status">All Status</option>
          <option value="operational">Operational</option>
          <option value="maintenance">Maintenance</option>
          <option value="offline">Offline</option>
          <option value="repair">Repair</option>
          <option value="standby">Standby</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="asset in filteredAssets"
        :key="asset.id"
        :class="['bg-white rounded-lg shadow-md p-6 border-t-4', getStatusBorderColor(asset.status)]"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold text-gray-800 flex items-center">
            <i :class="['bx text-2xl mr-2', getAssetTypeIcon(asset.type), getAssetTypeColor(asset.type)]"></i>
            {{ asset.name }}
            <span v-if="asset.tag" class="ml-2 text-sm text-gray-500 font-medium">#{{ asset.tag }}</span>
          </h3>
          <span
            :class="['text-xs font-semibold px-2.5 py-0.5 rounded-full', getStatusBadgeColor(asset.status)]"
          >{{ getDisplayStatus(asset.status) }}</span>
        </div>

        <div class="space-y-2 text-sm text-gray-700 mb-4">
          <div v-if="asset.location" class="flex items-center">
            <i class="bx bx-map-pin text-base mr-2 text-gray-500"></i>
            <p><span class="font-medium">Location:</span> {{ asset.location }}</p>
          </div>
          <div v-if="asset.workHours !== undefined" class="flex items-center">
            <i class="bx bx-time text-base mr-2 text-gray-500"></i>
            <p><span class="font-medium">Work Hours:</span> {{ asset.workHours }}h</p>
          </div>
          <div v-if="asset.battery !== undefined" class="flex items-center">
            <i class="bx bx-battery text-base mr-2 text-gray-500"></i>
            <p><span class="font-medium">Battery:</span> {{ asset.battery }}%</p>
          </div>
          <div v-if="asset.speed !== undefined" class="flex items-center">
            <i class="bx bx-tachometer text-base mr-2 text-gray-500"></i>
            <p><span class="font-medium">Speed:</span> {{ asset.speed }} km/h</p>
          </div>
          <div v-if="asset.efficiency !== undefined" class="flex items-center">
            <i class="bx bx-trending-up text-base mr-2 text-gray-500"></i>
            <p><span class="font-medium">Efficiency:</span> {{ asset.efficiency }}%</p>
          </div>
          <div v-if="asset.lastService" class="flex items-center">
            <i class="bx bx-wrench text-base mr-2 text-gray-500"></i>
            <p><span class="font-medium">Last Service:</span> {{ asset.lastService }}</p>
          </div>
          <div v-if="asset.operator" class="flex items-center">
            <i class="bx bx-user text-base mr-2 text-gray-500"></i>
            <p><span class="font-medium">Operator:</span> {{ asset.operator }}</p>
          </div>
          <div v-if="asset.assignedWorker" class="flex items-center">
            <i class="bx bx-user-check text-base mr-2 text-gray-500"></i>
            <p><span class="font-medium">Assigned Worker:</span> {{ asset.assignedWorker }}</p>
          </div>
          <div v-if="asset.todayCount !== undefined" class="flex items-center">
            <i class="bx bx-line-chart text-base mr-2 text-gray-500"></i>
            <p><span class="font-medium">Today's Count:</span> {{ asset.todayCount }}</p>
          </div>
          <div v-if="asset.totalCount !== undefined" class="flex items-center">
            <i class="bx bx-area-chart text-base mr-2 text-gray-500"></i>
            <p><span class="font-medium">Total Count:</span> {{ asset.totalCount }}</p>
          </div>
          <div v-if="asset.signal !== undefined" class="flex items-center">
            <i class="bx bx-signal-5 text-base mr-2 text-gray-500"></i>
            <p><span class="font-medium">Signal:</span> {{ asset.signal }}</p>
          </div>
          <div v-if="asset.lastSync" class="flex items-center">
            <i class="bx bx-sync text-base mr-2 text-gray-500"></i>
            <p><span class="font-medium">Last Sync:</span> {{ asset.lastSync }}</p>
          </div>
        </div>

        <div class="flex justify-end space-x-2">
          <button @click="openEditModal(asset)" class="text-blue-500 hover:text-blue-700">
            <i class="bx bx-edit text-xl"></i>
          </button>
          <button @click="confirmDelete(asset.id, asset.name)" class="text-red-500 hover:text-red-700">
            <i class="bx bx-trash text-xl"></i>
          </button>
        </div>
      </div>
    </div>

    <AddAssetModal
      :isVisible="showAddAssetModal"
      @close="showAddAssetModal = false"
      @add-asset="addAsset"
    />

    <EditAssetModal
      :isVisible="showEditModal"
      :assetData="currentAssetToEdit"
      @close="showEditModal = false"
      @update-asset="updateAsset"
    />

    <ConfirmationModal
      :isVisible="showConfirmModal"
      title="Delete Asset"
      :message="`Are you sure you want to delete the asset '${assetToDeleteName}'? This action cannot be undone.`"
      confirmButtonText="Delete"
      cancelButtonText="Cancel"
      @confirm="deleteAsset"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import AddAssetModal from '../components/AddAssetModal.vue'; // Adjust path as needed
import EditAssetModal from '../components/EditAssetModal.vue'; // Adjust path as needed
import ConfirmationModal from '../components/ConfirmationModal.vue'; // Adjust path as needed

const allAssets = ref([
  {
    id: 'A001',
    name: 'Tractor Alpha',
    tag: 'TRAC-001',
    type: 'tractor',
    status: 'operational',
    location: 'North Field',
    workHours: 1200,
    lastService: '2024-06-15',
    operator: 'Ali Bin Abu',
  },
  {
    id: 'A002',
    name: 'UGV Sentinel',
    tag: 'UGV-S01',
    type: 'ugv',
    status: 'maintenance',
    location: 'Workshop',
    battery: 60,
    speed: 10,
    efficiency: 85,
    lastService: '2024-07-01',
  },
  {
    id: 'A003',
    name: 'LoRa-Click-001',
    tag: 'LD-LC01',
    type: 'logging_device',
    status: 'operational',
    battery: 85,
    signal: '-65 dBm',
    assignedWorker: 'Ahmad Rahman',
    todayCount: 245,
    totalCount: 2450,
    lastSync: '2025-07-14 11:58',
  },
  {
    id: 'A004',
    name: 'Harvest Master',
    tag: 'HARV-001',
    type: 'harvester',
    status: 'operational',
    location: 'South Field',
    workHours: 800,
    lastService: '2024-05-20',
    operator: 'Siti Aisyah',
  },
  {
    id: 'A005',
    name: 'Cargo Mover',
    tag: 'TRK-001',
    type: 'truck',
    status: 'repair',
    location: 'Garage',
    workHours: 2500,
    lastService: '2024-07-10',
    operator: 'Kumar Sany',
  },
  {
    id: 'A006',
    name: 'Smart Badang',
    tag: 'BAD-001',
    type: 'badang',
    status: 'standby',
    location: 'Storage',
    workHours: 50,
    lastService: '2024-07-05',
    operator: 'Chong Wei',
  },
  {
    id: 'A007',
    name: 'Tool Kit Pro',
    tag: 'TOOL-001',
    type: 'tool',
    status: 'operational',
    location: 'Tool Shed',
    lastService: '2024-01-01',
  },
  {
    id: 'A008',
    name: 'Old Tractor',
    tag: 'TRAC-002',
    type: 'tractor',
    status: 'offline',
    location: 'Farmhouse',
    workHours: 5000,
    lastService: '2023-12-01',
    operator: 'Muthu Ali',
  },
  {
    id: 'A009',
    name: 'Explorer UGV',
    tag: 'UGV-X02',
    type: 'ugv',
    status: 'standby',
    location: 'Charging Dock',
    battery: 95,
    speed: 8,
    efficiency: 90,
    lastService: '2024-06-25',
  },
]);

const searchQuery = ref('');
const selectedType = ref('All Types');
const selectedStatus = ref('All Status');

const showAddAssetModal = ref(false);
const showEditModal = ref(false);
const currentAssetToEdit = ref(null);

const showConfirmModal = ref(false);
const assetToDeleteId = ref(null);
const assetToDeleteName = ref('');


const filteredAssets = computed(() => {
  let assets = allAssets.value;

  if (selectedType.value !== 'All Types') {
    assets = assets.filter(asset => asset.type === selectedType.value);
  }

  if (selectedStatus.value !== 'All Status') {
    assets = assets.filter(asset => asset.status === selectedStatus.value);
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    assets = assets.filter(
      (asset) =>
        asset.name.toLowerCase().includes(query) ||
        asset.tag.toLowerCase().includes(query) ||
        asset.type.toLowerCase().includes(query) ||
        asset.status.toLowerCase().includes(query) ||
        (asset.location && asset.location.toLowerCase().includes(query)) ||
        (asset.operator && asset.operator.toLowerCase().includes(query)) ||
        (asset.assignedWorker && asset.assignedWorker.toLowerCase().includes(query))
    );
  }
  return assets;
});

// Computed properties for summary counts
const operationalCount = computed(() => allAssets.value.filter(asset => asset.status === 'operational').length);
const maintenanceCount = computed(() => allAssets.value.filter(asset => asset.status === 'maintenance').length);
const offlineCount = computed(() => allAssets.value.filter(asset => asset.status === 'offline').length);
const repairCount = computed(() => allAssets.value.filter(asset => asset.status === 'repair').length);
const standyCount = computed(() => allAssets.value.filter(asset => asset.status === 'standby').length); // Renamed for consistency
const ugvCount = computed(() => allAssets.value.filter(asset => asset.type === 'ugv').length);
const loggingDeviceCount = computed(() => allAssets.value.filter(asset => asset.type === 'logging_device').length);
const totalWorkHours = computed(() => allAssets.value.reduce((sum, asset) => sum + (asset.workHours || 0), 0));


const addAsset = (newAssetData) => {
  allAssets.value.push({ ...newAssetData, id: `A${allAssets.value.length + 1}` }); // Simple ID generation
  showAddAssetModal.value = false;
};

const updateAsset = (updatedAssetData) => {
  const index = allAssets.value.findIndex(asset => asset.id === updatedAssetData.id);
  if (index !== -1) {
    allAssets.value[index] = updatedAssetData;
  }
  showEditModal.value = false;
  currentAssetToEdit.value = null;
};

const confirmDelete = (id, name) => {
  assetToDeleteId.value = id;
  assetToDeleteName.value = name;
  showConfirmModal.value = true;
};

const deleteAsset = () => {
  allAssets.value = allAssets.value.filter(asset => asset.id !== assetToDeleteId.value);
  showConfirmModal.value = false;
  assetToDeleteId.value = null;
  assetToDeleteName.value = '';
};

const cancelDelete = () => {
  showConfirmModal.value = false;
  assetToDeleteId.value = null;
  assetToDeleteName.value = '';
};

const openEditModal = (asset) => {
  currentAssetToEdit.value = { ...asset };
  showEditModal.value = true;
};

// Helper functions for dynamic styling
const getStatusBorderColor = (status) => {
  switch (status) {
    case 'operational':
      return 'border-green-500';
    case 'maintenance':
      return 'border-yellow-500';
    case 'offline':
      return 'border-red-500';
    case 'repair':
      return 'border-orange-500';
    case 'standby':
      return 'border-blue-500';
    default:
      return 'border-gray-300';
  }
};

const getStatusBgColor = (status) => {
  switch (status) {
    case 'operational':
      return 'bg-green-100 text-green-700';
    case 'maintenance':
      return 'bg-yellow-100 text-yellow-700';
    case 'offline':
      return 'bg-red-100 text-red-700';
    case 'repair':
      return 'bg-orange-100 text-orange-700';
    case 'standby':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-gray-100 text-gray-500';
  }
};

const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'operational':
      return 'bg-green-100 text-green-700';
    case 'maintenance':
      return 'bg-yellow-100 text-yellow-700';
    case 'offline':
      return 'bg-red-100 text-red-700';
    case 'repair':
      return 'bg-orange-100 text-orange-700';
    case 'standby':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'operational':
      return 'bx-check-circle';
    case 'maintenance':
      return 'bx-wrench';
    case 'offline':
      return 'bx-error-circle';
    case 'repair':
      return 'bx-bug'; // Or bx-cog, bx-hard-hat etc.
    case 'standby':
      return 'bx-pause-circle';
    case 'ugv':
      return 'bx-bot';
    case 'logging_device':
      return 'bx-mobile-alt';
    default:
      return '';
  }
};

const getDisplayStatus = (status) => {
  switch (status) {
    case 'operational':
      return 'Operational';
    case 'maintenance':
      return 'Maintenance';
    case 'offline':
      return 'Offline';
    case 'repair':
      return 'Repair';
    case 'standby':
      return 'Standby';
    default:
      return status;
  }
};


const getAssetTypeIcon = (type) => {
  switch (type) {
    case 'tractor':
      return 'bxs-truck';
    case 'truck':
      return 'bxs-truck';
    case 'ugv':
      return 'bx-bot';
    case 'harvester':
      return 'bx-cut'; // or bxs-leaf
    case 'badang':
      return 'bxs-tool'; // or bx-knife
    case 'tool':
      return 'bx-wrench';
    case 'logging_device':
      return 'bx-mobile-alt';
    default:
      return '';
  }
};

const getAssetTypeColor = (type) => {
  switch (type) {
    case 'tractor':
      return 'text-blue-500';
    case 'truck':
      return 'text-indigo-500';
    case 'ugv':
      return 'text-purple-500';
    case 'harvester':
      return 'text-green-500';
    case 'badang':
      return 'text-yellow-600';
    case 'tool':
      return 'text-gray-600';
    case 'logging_device':
      return 'text-orange-500';
    default:
      return 'text-gray-500';
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>