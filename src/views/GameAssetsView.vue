<template>
  <div class="farm-workers-container">
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <h1 class="main-title">My Farm Assets!</h1>
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

          <button @click="openModal" class="add-worker-btn">
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
              <span class="detail-label">Last Service:</span>
              <span>{{ asset.lastService }}</span>
            </div>
            <div class="detail-item" v-if="asset.type === 'UGV'">
              <span class="detail-label">Battery:</span>
              <span>{{ asset.battery }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Assigned Worker:</span>
              <div class="workers-list">
                <p>{{ asset.assignedWorker }}</p>
              </div>
            </div>
          </div>

          <div class="worker-actions">
            <button class="edit-btn" title="Edit Asset">
              ✏️
            </button>
            <button class="delete-btn" title="Delete Asset">
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div class="bg-white rounded-3xl shadow-2xl p-8 w-11/12 md:w-2/3 lg:w-1/2">
        <h2 class="text-3xl font-bold text-center text-pink-500 mb-6">View New Asset</h2>

        <div class="flex">
          <div class="w-1/3 space-y-4 pr-6 border-r-2 border-pink-200">
            <button
              @click="changeTab('basic')"
              :class="{'bg-red-500 text-white': currentTab === 'basic', 'bg-gray-200 text-gray-700': currentTab !== 'basic'}"
              class="w-full text-left p-4 rounded-lg font-semibold transition-colors">
              Basic Information
            </button>
            <button
              @click="changeTab('financial')"
              :class="{'bg-red-500 text-white': currentTab === 'financial', 'bg-gray-200 text-gray-700': currentTab !== 'financial'}"
              class="w-full text-left p-4 rounded-lg font-semibold transition-colors">
              Financial Information
            </button>
            <button
              @click="changeTab('maintenance')"
              :class="{'bg-red-500 text-white': currentTab === 'maintenance', 'bg-gray-200 text-gray-700': currentTab !== 'maintenance'}"
              class="w-full text-left p-4 rounded-lg font-semibold transition-colors">
              Maintenance Information
            </button>
          </div>

          <div class="w-2/3 pl-6">
            <div v-if="currentTab === 'basic'" class="space-y-4">
              <div class="flex flex-col">
                <label class="text-gray-600 font-medium">Asset ID:</label>
                <input type="text" class="bg-gray-100 p-3 rounded-lg border focus:outline-none focus:border-blue-500">
              </div>
              <div class="flex flex-col">
                <label class="text-gray-600 font-medium">Asset Type:</label>
                <select class="bg-gray-100 p-3 rounded-lg border focus:outline-none focus:border-blue-500">
                  <option>-- Choose Type --</option>
                  <option>UGV</option>
                  <option>Tractor</option>
                </select>
              </div>
              <div class="flex flex-col">
                <label class="text-gray-600 font-medium">Asset Status:</label>
                <select class="bg-gray-100 p-3 rounded-lg border focus:outline-none focus:border-blue-500">
                  <option>-- Choose Status --</option>
                  <option>Active</option>
                  <option>Maintenance</option>
                  <option>Offline</option>
                </select>
              </div>
              <div class="flex flex-col">
                <label class="text-gray-600 font-medium">Purchase Date:</label>
                <input type="text" placeholder="dd/mm/yyyy" class="bg-gray-100 p-3 rounded-lg border focus:outline-none focus:border-blue-500">
              </div>
              <div class="flex flex-col">
                <label class="text-gray-600 font-medium">Manufacturer:</label>
                <input type="text" class="bg-gray-100 p-3 rounded-lg border focus:outline-none focus:border-blue-500">
              </div>
              <div class="flex flex-col">
                <label class="text-gray-600 font-medium">Model:</label>
                <input type="text" class="bg-gray-100 p-3 rounded-lg border focus:outline-none focus:border-blue-500">
              </div>
              <div class="flex flex-col">
                <label class="text-gray-600 font-medium">Serial Number:</label>
                <input type="text" class="bg-gray-100 p-3 rounded-lg border focus:outline-none focus:border-blue-500">
              </div>
            </div>

            <div v-if="currentTab === 'financial'" class="space-y-4">
              <div class="flex flex-col">
                <label class="text-gray-600 font-medium">Purchase Price (RM):</label>
                <input type="text" class="bg-gray-100 p-3 rounded-lg border focus:outline-none focus:border-blue-500">
              </div>
              <div class="flex flex-col">
                <label class="text-gray-600 font-medium">Current Value (RM):</label>
                <input type="text" class="bg-gray-100 p-3 rounded-lg border focus:outline-none focus:border-blue-500">
              </div>
              <div class="flex flex-col">
                <label class="text-gray-600 font-medium">Monthly Rate (RM):</label>
                <input type="text" class="bg-gray-100 p-3 rounded-lg border focus:outline-none focus:border-blue-500">
              </div>
              <div class="flex flex-col">
                <label class="text-gray-600 font-medium">Maintenance Cost (RM):</label>
                <input type="text" class="bg-gray-100 p-3 rounded-lg border focus:outline-none focus:border-blue-500">
              </div>
            </div>

            <div v-if="currentTab === 'maintenance'" class="space-y-4">
              <div class="flex flex-col">
                <label class="text-gray-600 font-medium">Last Maintenance:</label>
                <input type="text" placeholder="dd/mm/yyyy" class="bg-gray-100 p-3 rounded-lg border focus:outline-none focus:border-blue-500">
              </div>
              <div class="flex flex-col">
                <label class="text-gray-600 font-medium">Next Maintenance:</label>
                <input type="text" placeholder="dd/mm/yyyy" class="bg-gray-100 p-3 rounded-lg border focus:outline-none focus:border-blue-500">
              </div>
              <div class="flex flex-col">
                <label class="text-gray-600 font-medium">Warranty Expiry:</label>
                <input type="text" placeholder="dd/mm/yyyy" class="bg-gray-100 p-3 rounded-lg border focus:outline-none focus:border-blue-500">
              </div>
              <div class="flex flex-col">
                <label class="text-gray-600 font-medium">Insurance Expiry:</label>
                <input type="text" placeholder="dd/mm/yyyy" class="bg-gray-100 p-3 rounded-lg border focus:outline-none focus:border-blue-500">
              </div>
              <div class="flex flex-col">
                <label class="text-gray-600 font-medium">Road Tax Expiry:</label>
                <input type="text" placeholder="dd/mm/yyyy" class="bg-gray-100 p-3 rounded-lg border focus:outline-none focus:border-blue-500">
              </div>
              <div class="flex flex-col">
                <label class="text-gray-600 font-medium">Notes:</label>
                <textarea rows="3" class="bg-gray-100 p-3 rounded-lg border focus:outline-none focus:border-blue-500"></textarea>
              </div>
            </div>

            <div class="flex justify-end mt-6">
              <button @click="closeModal" class="bg-blue-500 text-white px-8 py-3 rounded-full font-semibold shadow-md hover:bg-blue-600 transition-colors">Add</button>
            </div>
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
import { ref, computed } from 'vue';
import UGVIcon from '@/assets/ugv.png';
import TractorIcon from '@/assets/tractor.png';

const showModal = ref(false);
const currentTab = ref('basic');
const searchQuery = ref('');
const selectedStatus = ref('');
const selectedType = ref('');

const assets = ref([
  {
    id: 'UGV-001',
    type: 'UGV',
    icon: UGVIcon,
    status: 'Active',
    location: 'Phase 1 - Block 1',
    lastService: '11-03-2023',
    battery: '25%',
    assignedWorker: 'Farah Nabilah, Izzatul Hanan',
  },
  {
    id: 'TRAC-001',
    type: 'Tractor',
    icon: TractorIcon,
    status: 'Maintenance',
    location: 'Phase 1 - Block 1',
    lastService: '11-03-2023',
    assignedWorker: 'Farah Nabilah, Izzatul Hanan',
  },
  {
    id: 'TRAC-002',
    type: 'Tractor',
    icon: TractorIcon,
    status: 'Offline',
    location: 'Phase 1 - Block 1',
    lastService: '11-03-2023',
    assignedWorker: 'Farah Nabilah, Izzatul Hanan',
  },
]);

const statusColors = {
  'Active': { badgeClass: 'bg-green-500', borderClass: 'active' },
  'Maintenance': { badgeClass: 'bg-yellow-500', borderClass: 'on-break' },
  'Offline': { badgeClass: 'bg-red-500', borderClass: 'offline' },
};

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
      asset.location.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      asset.assignedWorker.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  return filtered;
});

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  currentTab.value = 'basic';
};

const changeTab = (tab) => {
  currentTab.value = tab;
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

.workers-list,
.assets-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.worker-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
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
</style>