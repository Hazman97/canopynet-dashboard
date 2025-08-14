<template>
  <div class="farm-workers-container">
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <h1 class="main-title">My Farm Assets!</h1>
          <div class="asset-stats">
            <div class="stat-item">
              <img src="@/assets/ugv.png" alt="UGV Icon" class="stat-icon-img" />
              <span class="stat-text">{{ stats.totalUGV }} UGV</span>
            </div>
            <div class="stat-item">
              <img src="@/assets/tractor.png" alt="Tractor Icon" class="stat-icon-img" />
              <span class="stat-text">{{ stats.totalTractor }} Tractor</span>
            </div>
          </div>
        </div>
        <button @click="logout" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm">
          Logout
        </button>
      </div>
    </div>

    <div class="workers-content">
      <div class="search-section">
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input v-model="searchQuery" type="text" placeholder="Search" class="search-input" />
        </div>

        <div class="filter-buttons">
          <div class="relative">
            <select v-model="selectedStatus" class="filter-btn appearance-none">
              <option value="">All Status</option>
              <option v-for="status in uniqueStatus" :key="status" :value="status">
                {{ status }}
              </option>
            </select>
          </div>

          <div class="relative">
            <select v-model="selectedType" class="filter-btn appearance-none">
              <option value="">All Type</option>
              <option v-for="type in uniqueTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>

          <button @click="openCreateModal" class="add-worker-btn">
            <span class="plus-icon">+</span>
            Add New Assets
          </button>
        </div>
      </div>

      <div class="workers-grid">
        <div v-for="asset in filteredAssets" :key="asset.id"
          :class="['worker-card', statusColors[asset.status]?.borderClass]">

          <div class="flex justify-between items-start mb-4">
            <div class="worker-info">
              <div class="worker-avatar">
                <img :src="asset.icon" :alt="asset.type" class="w-8 h-8 object-contain">
              </div>
              <div class="worker-details">
                <h3 class="worker-name">{{ asset.id }}</h3>
                <p class="worker-id">Type: {{ asset.type }}</p>
              </div>
            </div>

            <span :class="['status-badge', statusColors[asset.status]?.badgeClass]">
              {{ asset.status }}
            </span>
          </div>

          <div class="task-details">
            <div class="detail-item">
              <span class="detail-label">Location:</span>
              <span>{{ asset.location }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Last Maintenance:</span>
              <span>{{ asset.lastMaintenanceDate }}</span>
            </div>
            <div class="detail-item" v-if="asset.type === 'UGV'">
              <span class="detail-label">Battery:</span>
              <span>{{ asset.battery }}</span>
            </div>
          </div>

          <div class="worker-actions">
            <button @click="viewAsset(asset)" class="view-btn" title="View Details">
              ℹ️
            </button>
            <button @click="editAsset(asset)" class="edit-btn" title="Edit Asset">
              ✏️
            </button>
            <button @click="deleteAsset(asset)" class="delete-btn" title="Delete Asset">
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 modal-overlay-bg flex items-center justify-center z-50 p-4">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ modalTitle }}</h2>
        </div>
        <div class="p-6">
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-bold text-gray-800 mb-4">Basic Information:</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold mb-2">Asset ID:</label>
                  <input v-model="newAsset.id" type="text" class="form-input" placeholder="e.g. UGV-002" :disabled="isViewing"/>
                </div>
                <div>
                  <label class="block text-sm font-bold mb-2">Asset Type:</label>
                  <select v-model="newAsset.type" class="form-input" :disabled="isViewing">
                    <option value="">-- Choose Type --</option>
                    <option>UGV</option>
                    <option>Tractor</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-bold mb-2">Asset Status:</label>
                  <select v-model="newAsset.status" class="form-input" :disabled="isViewing">
                    <option value="">-- Choose Status --</option>
                    <option>Active</option>
                    <option>Maintenance</option>
                    <option>Offline</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-bold mb-2">Purchase Date:</label>
                  <input v-model="newAsset.purchaseDate" type="date" class="form-input" :disabled="isViewing"/>
                </div>
                <div>
                  <label class="block text-sm font-bold mb-2">Manufacturer:</label>
                  <input v-model="newAsset.manufacturer" type="text" class="form-input" placeholder="e.g. John Deere" :disabled="isViewing"/>
                </div>
                <div>
                  <label class="block text-sm font-bold mb-2">Model:</label>
                  <input v-model="newAsset.model" type="text" class="form-input" placeholder="e.g. TRAC-500" :disabled="isViewing"/>
                </div>
                <div>
                  <label class="block text-sm font-bold mb-2">Serial Number:</label>
                  <input v-model="newAsset.serialNumber" type="text" class="form-input" placeholder="e.g. 1A2B3C4D5E" :disabled="isViewing"/>
                </div>
                <div v-if="newAsset.type === 'UGV'">
                  <label class="block text-sm font-bold mb-2">Battery (%):</label>
                  <input v-model="newAsset.battery" type="number" class="form-input" placeholder="e.g. 80" :disabled="isViewing"/>
                </div>
              </div>
            </div>

            <hr />

            <div>
              <h3 class="text-lg font-bold text-gray-800 mb-4">Financial Information:</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold mb-2">Purchase Price (RM):</label>
                  <input v-model="newAsset.purchasePrice" type="number" step="0.01" class="form-input" placeholder="e.g. 250000.00" :disabled="isViewing"/>
                </div>
                <div>
                  <label class="block text-sm font-bold mb-2">Current Value (RM):</label>
                  <input v-model="newAsset.currentValue" type="number" step="0.01" class="form-input" placeholder="e.g. 200000.00" :disabled="isViewing"/>
                </div>
                <div>
                  <label class="block text-sm font-bold mb-2">Monthly Rate (RM):</label>
                  <input v-model="newAsset.monthlyRate" type="number" step="0.01" class="form-input" placeholder="e.g. 500.00" :disabled="isViewing"/>
                </div>
                <div>
                  <label class="block text-sm font-bold mb-2">Maintenance Cost (RM):</label>
                  <input v-model="newAsset.maintenanceCost" type="number" step="0.01" class="form-input" placeholder="e.g. 200.00" :disabled="isViewing"/>
                </div>
              </div>
            </div>

            <hr />

            <div>
              <h3 class="text-lg font-bold text-gray-800 mb-4">Maintenance Information:</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold mb-2">Last Maintenance:</label>
                  <input v-model="newAsset.lastMaintenanceDate" type="date" class="form-input" :disabled="isViewing"/>
                </div>
                <div>
                  <label class="block text-sm font-bold mb-2">Next Maintenance:</label>
                  <input v-model="newAsset.nextMaintenanceDate" type="date" class="form-input" :disabled="isViewing"/>
                </div>
                <div>
                  <label class="block text-sm font-bold mb-2">Warranty Expiry:</label>
                  <input v-model="newAsset.warrantyExpiry" type="date" class="form-input" :disabled="isViewing"/>
                </div>
                <div>
                  <label class="block text-sm font-bold mb-2">Insurance Expiry:</label>
                  <input v-model="newAsset.insuranceExpiry" type="date" class="form-input" :disabled="isViewing"/>
                </div>
                <div>
                  <label class="block text-sm font-bold mb-2">Road Tax Expiry:</label>
                  <input v-model="newAsset.roadTaxExpiry" type="date" class="form-input" :disabled="isViewing"/>
                </div>
                <div class="col-span-1 md:col-span-2">
                  <label class="block text-sm font-bold mb-2">Notes:</label>
                  <textarea v-model="newAsset.notes" class="form-input" rows="3" :disabled="isViewing"></textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-6" v-if="!isViewing">
            <button @click="closeModal" class="cancel-btn">
              Cancel
            </button>
            <button @click="saveAsset" class="add-btn">
              {{ editingAsset ? 'Save' : 'Add' }}
            </button>
          </div>
          <div class="flex justify-end mt-6" v-else>
            <button @click="closeModal" class="cancel-btn">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 bg-white shadow-inner border-t flex justify-around py-2">
      <div @click="$router.push('/game-platform')" class="flex flex-col items-center cursor-pointer hover:text-green-700 transition">
        <img src="@/assets/house.png" class="w-8 mb-1" alt="Home" />
        <span class="text-sm">Home</span>
      </div>
      <div @click="$router.push('/game-tasks')" class="flex flex-col items-center cursor-pointer hover:text-yellow-700 transition">
        <img src="@/assets/task.png" class="w-8 mb-1" alt="Tasks" />
        <span class="text-sm">Tasks</span>
      </div>
      <div @click="$router.push('/game-workers')" class="flex flex-col items-center cursor-pointer hover:text-red-700 transition">
        <img src="@/assets/crew.png" class="w-8 mb-1" alt="Crew" />
        <span class="text-sm">Crew</span>
      </div>
      <div @click="$router.push('/game-areas')" class="flex flex-col items-center cursor-pointer hover:text-blue-700 transition">
        <img src="@/assets/map.png" class="w-8 mb-1" alt="Areas" />
        <span class="text-sm">Areas</span>
      </div>
      <div @click="$router.push('/game-assets')" class="flex flex-col items-center text-black-700 font-bold">
        <img src="@/assets/tractor.png" class="w-8 mb-1" alt="Assets" />
        <span class="text-sm">Assets</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import UGVIcon from '@/assets/ugv.png';
import TractorIcon from '@/assets/tractor.png';

const showModal = ref(false);
const searchQuery = ref('');
const selectedStatus = ref('');
const selectedType = ref('');
const editingAsset = ref(null);
const isViewing = ref(false);

const assets = ref([
  {
    id: 'UGV-001',
    type: 'UGV',
    icon: UGVIcon,
    status: 'Active',
    location: 'Phase 1 - Block 1',
    lastMaintenanceDate: '2024-03-11',
    battery: '25%',
    purchaseDate: '2023-01-15',
    manufacturer: 'UGV Robotics Co.',
    model: 'RoboFarm 1.0',
    serialNumber: 'SN-001-UGV-23',
    purchasePrice: 150000.00,
    currentValue: 140000.00,
    monthlyRate: 500.00,
    maintenanceCost: 200.00,
    nextMaintenanceDate: '2025-03-11',
    warrantyExpiry: '2026-01-15',
    insuranceExpiry: '2025-01-15',
    roadTaxExpiry: '2025-01-15',
    notes: 'Routine maintenance performed. Battery health is at 95%.',
  },
  {
    id: 'TRAC-001',
    type: 'Tractor',
    icon: TractorIcon,
    status: 'Maintenance',
    location: 'Phase 1 - Block 1',
    lastMaintenanceDate: '2024-03-11',
    purchaseDate: '2022-05-20',
    manufacturer: 'Tractor Corp.',
    model: 'PowerTractor X',
    serialNumber: 'SN-001-TRAC-22',
    purchasePrice: 250000.00,
    currentValue: 220000.00,
    monthlyRate: 700.00,
    maintenanceCost: 350.00,
    nextMaintenanceDate: '2025-03-11',
    warrantyExpiry: '2025-05-20',
    insuranceExpiry: '2025-05-20',
    roadTaxExpiry: '2025-05-20',
    notes: 'Engine oil and filter change. Replaced a faulty hydraulic hose.',
  },
  {
    id: 'TRAC-002',
    type: 'Tractor',
    icon: TractorIcon,
    status: 'Offline',
    location: 'Phase 1 - Block 1',
    lastMaintenanceDate: '2024-03-11',
    purchaseDate: '2022-10-01',
    manufacturer: 'Agri-Tech Machines',
    model: 'HeavyHauler 3000',
    serialNumber: 'SN-002-TRAC-22',
    purchasePrice: 260000.00,
    currentValue: 235000.00,
    monthlyRate: 750.00,
    maintenanceCost: 400.00,
    nextMaintenanceDate: '2025-03-11',
    warrantyExpiry: '2025-10-01',
    insuranceExpiry: '2025-10-01',
    roadTaxExpiry: '2025-10-01',
    notes: 'Offline due to major gearbox failure. Awaiting parts.',
  },
]);

const statusColors = {
  'Active': { badgeClass: 'bg-green-500', borderClass: 'active' },
  'Maintenance': { badgeClass: 'bg-yellow-500', borderClass: 'on-break' },
  'Offline': { badgeClass: 'bg-red-500', borderClass: 'offline' },
};

const newAsset = ref({
  id: '',
  type: '',
  icon: '',
  status: '',
  location: '',
  purchaseDate: '',
  manufacturer: '',
  model: '',
  serialNumber: '',
  purchasePrice: null,
  currentValue: null,
  monthlyRate: null,
  maintenanceCost: null,
  lastMaintenanceDate: '',
  nextMaintenanceDate: '',
  warrantyExpiry: '',
  insuranceExpiry: '',
  roadTaxExpiry: '',
  notes: '',
  battery: '',
});

watch(() => newAsset.value.type, (newType) => {
  if (newType === 'UGV') {
    newAsset.value.icon = UGVIcon;
  } else if (newType === 'Tractor') {
    newAsset.value.icon = TractorIcon;
  } else {
    newAsset.value.icon = '';
  }
});

const modalTitle = computed(() => {
  if (isViewing.value) {
    return `View Details for ${editingAsset.value.id}`;
  } else if (editingAsset.value) {
    return 'Edit Asset';
  } else {
    return 'Add New Asset';
  }
});

const uniqueStatus = computed(() => {
  return [...new Set(assets.value.map(asset => asset.status))];
});

const uniqueTypes = computed(() => {
  return [...new Set(assets.value.map(asset => asset.type))];
});

const filteredAssets = computed(() => {
  let filtered = assets.value;
  if (selectedStatus.value) {
    filtered = filtered.filter(asset => asset.status === selectedStatus.value);
  }
  if (selectedType.value) {
    filtered = filtered.filter(asset => asset.type === selectedType.value);
  }
  if (searchQuery.value) {
    filtered = filtered.filter(asset =>
      asset.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  return filtered;
});

const stats = computed(() => {
  const totalUGV = assets.value.filter(asset => asset.type === 'UGV').length;
  const totalTractor = assets.value.filter(asset => asset.type === 'Tractor').length;
  return { totalUGV, totalTractor };
});

const openCreateModal = () => {
  editingAsset.value = null;
  isViewing.value = false;
  resetNewAsset();
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetNewAsset();
};

const resetNewAsset = () => {
  newAsset.value = {
    id: '',
    type: '',
    icon: '',
    status: '',
    location: '',
    purchaseDate: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    purchasePrice: null,
    currentValue: null,
    monthlyRate: null,
    maintenanceCost: null,
    lastMaintenanceDate: '',
    nextMaintenanceDate: '',
    warrantyExpiry: '',
    insuranceExpiry: '',
    roadTaxExpiry: '',
    notes: '',
    battery: '',
  };
};

const saveAsset = () => {
  if (!newAsset.value.id || !newAsset.value.type || !newAsset.value.status || !newAsset.value.purchaseDate || !newAsset.value.manufacturer || !newAsset.value.model) {
    alert('Please fill in all required basic information fields.');
    return;
  }
  if (editingAsset.value) {
    const index = assets.value.findIndex(asset => asset.id === editingAsset.value.id);
    if (index !== -1) {
      assets.value[index] = { ...newAsset.value };
    }
    alert('Asset updated successfully!');
  } else {
    assets.value.push({ ...newAsset.value });
    alert('New Asset added successfully!');
  }
  closeModal();
};

const viewAsset = (asset) => {
  editingAsset.value = asset;
  isViewing.value = true;
  newAsset.value = { ...asset };
  showModal.value = true;
};

const editAsset = (asset) => {
  editingAsset.value = asset;
  isViewing.value = false;
  newAsset.value = { ...asset };
  showModal.value = true;
};

const deleteAsset = (asset) => {
  if (confirm(`Are you sure you want to delete asset "${asset.id}"?`)) {
    assets.value = assets.value.filter(item => item.id !== asset.id);
    alert('Asset deleted successfully!');
  }
};

const logout = () => {
  if (confirm('Are you sure you want to log out?')) {
    console.log('Logging out...');
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.farm-workers-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Arial', sans-serif;
  padding-bottom: 80px;
  position: relative;
}

/* Header Styles */
.header-section {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%);
  padding: 20px;
  border-radius: 0 0 30px 30px;
  margin-bottom: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.title-section {
  flex: 1;
}

.main-title {
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 0 15px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* New asset summary styles */
.asset-stats {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  color: white;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.stat-icon-img {
  height: 1.5rem;
  width: 1.5rem;
}

.stat-text {
  font-size: 1rem;
}

/* Workers Content */
.workers-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.search-section {
  margin-bottom: 30px;
}

.search-bar {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 25px;
  padding: 15px 20px;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.search-icon {
  margin-right: 10px;
  font-size: 1.2rem;
  color: #666;
}

.search-input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 1rem;
  color: #333;
  background: transparent;
}

.search-input::placeholder {
  color: #999;
}

.filter-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.filter-btn {
  background: rgba(255, 255, 255, 0.8);
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #666;
  transition: all 0.3s ease;
  font-size: 1rem;
  backdrop-filter: blur(10px);
  text-align: center;
  width: auto;
}

.filter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.add-worker-btn {
  background: #00d2ff;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.add-worker-btn:hover {
  background: #00b8e6;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.plus-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

/* Workers Grid */
.workers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.worker-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 3px solid transparent;
  position: relative;
  backdrop-filter: blur(10px);
}

.worker-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.worker-card.active {
  border-color: #4caf50;
  background: linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%);
}

.worker-card.on-break {
  border-color: #ff9800;
  background: linear-gradient(135deg, #ffe0b2 0%, #ffcc02 100%);
}

.worker-card.offline {
  border-color: #f44336;
  background: linear-gradient(135deg, #ffcdd2 0%, #e57373 100%);
}

.worker-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.worker-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  border: 2px solid rgba(0, 0, 0, 0.1);
}

.worker-details {
  flex: 1;
}

.worker-name {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.worker-id {
  color: #666;
  margin: 5px 0 0 0;
  font-size: 0.9rem;
}

.task-details {
  margin-bottom: 15px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 5px;
}

.detail-label {
  font-weight: bold;
  color: #555;
  margin-right: 5px;
}

.worker-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.view-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.view-btn:hover {
  background: rgba(0, 0, 255, 0.1);
}

.edit-btn,
.delete-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.delete-btn:hover {
  background: rgba(255, 0, 0, 0.1);
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: bold;
  color: white;
  text-transform: uppercase;
  height: min-content;
}

.status-badge.bg-green-500 {
  background-color: #4caf50;
}

.status-badge.bg-yellow-500 {
  background-color: #ff9800;
}

.status-badge.bg-red-500 {
  background-color: #f44336;
}

/* Modal Styles from GameAreasView.vue */
.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 90%;
  width: 900px;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
  color: white;
  padding: 20px;
  border-radius: 20px 20px 0 0;
  text-align: center;
  font-weight: bold;
  font-size: 1.5rem;
}

.modal-left-panel {
  background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
  color: white;
  padding: 20px;
  border-radius: 15px;
}

.modal-list-item {
  background: white;
  color: #333;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.modal-list-item:hover {
  background: #f0f0f0;
}

.form-input {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3a7bd5;
  box-shadow: 0 0 0 3px rgba(58, 123, 213, 0.2);
}

.add-btn {
  background: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-btn:hover {
  background: #45a049;
  transform: translateY(-1px);
}

.cancel-btn {
  background: #f44336;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #da190b;
  transform: translateY(-1px);
}

.modal-overlay-bg {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>