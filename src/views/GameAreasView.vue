<template>
  <div class="farm-workers-container">
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <h1 class="main-title">My Farm Areas!</h1>
          <!-- Quick Summary Section -->
          <div class="area-stats">
            <div class="stat-item">
              <img src="@/assets/tree.png" alt="Trees Icon" class="stat-icon-img" />
              <span class="stat-text">{{ stats.totalTrees }} Trees</span>
            </div>
            <div class="stat-item">
              <img src="@/assets/block.png" alt="Blocks Icon" class="stat-icon-img" />
              <span class="stat-text">{{ stats.totalBlocks }} Blocks</span>
            </div>
            <div class="stat-item">
              <img src="@/assets/active-phase.png" alt="Phases Icon" class="stat-icon-img" />
              <span class="stat-text">{{ stats.totalPhases }} Phases</span>
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
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search..."
            class="search-input"
          />
        </div>

        <div class="filter-buttons">
          <button @click="currentView = 'phases'" :class="['filter-btn', currentView === 'phases' ? 'bg-orange-400 text-white' : '']">
            Phases
          </button>
          <button @click="currentView = 'blocks'" :class="['filter-btn', currentView === 'blocks' ? 'bg-orange-400 text-white' : '']">
            Blocks
          </button>
          <button @click="currentView = 'trees'" :class="['filter-btn', currentView === 'trees' ? 'bg-orange-400 text-white' : '']">
            Trees
          </button>

          <div class="relative">
            <select
              v-model="statusFilter"
              class="filter-btn appearance-none"
            >
              <option v-for="status in statusOptions" :key="status" :value="status">{{ status }}</option>
            </select>
          </div>

          <button @click="openModal('addPhase')" class="add-worker-btn" title="Add New Phase">
            <span class="plus-icon">+</span>
            Add New Phase
          </button>
        </div>
      </div>

      <div class="workers-grid">
        <div v-for="item in filteredItems" :key="item.id"
          :class="['worker-card', statusConfig[currentView][item.status]?.color]">
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center">
                <img :src="statusConfig[currentView][item.status]?.icon" alt="Status Icon" class="h-6 w-6 mr-3" />
                <div>
                  <h3 class="text-xl font-bold">{{ item.name }}</h3>
                  <p class="text-sm text-gray-600">{{ item.established }}</p>
                </div>
              </div>
              <div class="flex space-x-2">
                <button @click="editItem(item)" class="edit-btn" title="Edit">
                  ✏️
                </button>
                <button @click="deleteItem(item)" class="delete-btn" title="Delete">
                  🗑️
                </button>
              </div>
            </div>

            <div class="text-gray-700 space-y-2 mb-4">
              <p v-if="currentView === 'phases'">
                <img src="@/assets/tree.png" alt="Tree" class="inline-block h-4 w-4 mr-2" /> Total Trees: {{ item.totalTrees }}
              </p>
              <p v-if="currentView === 'phases'">
                <img src="@/assets/block.png" alt="Block" class="inline-block h-4 w-4 mr-2" /> Total Blocks: {{ item.totalBlocks }}
              </p>
              <p v-if="currentView === 'blocks'">
                <img src="@/assets/tree.png" alt="Tree" class="inline-block h-4 w-4 mr-2" /> Total Trees: {{ item.totalTrees }}
              </p>
              <p v-if="currentView === 'blocks'">
                <img src="@/assets/information.png" alt="Variety" class="inline-block h-4 w-4 mr-2" /> Variety: {{ item.variety }}
              </p>
              <p v-if="currentView === 'trees'">
                <img src="@/assets/information.png" alt="Tag" class="inline-block h-4 w-4 mr-2" /> Tag: {{ item.tag }}
              </p>
              <p v-if="currentView === 'trees'">
                <img src="@/assets/hospital.png" alt="Health" class="inline-block h-4 w-4 mr-2" /> Health: {{ item.status }}
              </p>
            </div>

            <div class="flex justify-end">
              <button v-if="currentView === 'phases'" @click="viewBlocks(item)" class="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-medium">
                View Block
              </button>
              <button v-else-if="currentView === 'blocks'" @click="viewTrees(item)" class="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-medium">
                View Tree
              </button>
              <button v-else-if="currentView === 'trees'" @click="viewTreeDetail(item)" class="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-medium">
                View Detail
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add New Phase Modal -->
    <div v-if="showModal === 'addPhase'" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="text-2xl font-bold">Add New Phase</h3>
        </div>
        <form @submit.prevent="saveNewPhase" class="modal-body">
          <div class="form-group">
            <label for="name">Phase Name</label>
            <input type="text" id="name" v-model="newPhase.name" class="form-input" placeholder="e.g. Phase 6 - New Planting" required />
          </div>
          <div class="form-group">
            <label for="status">Status</label>
            <select id="status" v-model="newPhase.status" class="form-select" required>
              <option value="" disabled>Select a status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Development">Development</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          <div class="form-group">
            <label for="established">Established Date</label>
            <input type="date" id="established" v-model="newPhase.established" class="form-input" required />
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" v-model="newPhase.description" class="form-textarea" rows="3" placeholder="Description of the phase" required></textarea>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="cancel-btn">Cancel</button>
            <button type="submit" class="save-btn">Save Phase</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Bottom Navigation Bar -->
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
      <div @click="$router.push('/game-areas')" class="flex flex-col items-center text-blue-700 font-bold">
        <img src="@/assets/map.png" class="w-8 mb-1" alt="Areas" />
        <span class="text-sm">Areas</span>
      </div>
      <div @click="$router.push('/game-assets')" class="flex flex-col items-center cursor-pointer hover:text-black-700 transition">
        <img src="@/assets/tractor.png" class="w-8 mb-1" alt="Assets" />
        <span class="text-sm">Assets</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const currentDate = ref(new Date().toISOString().slice(0, 10));

const currentView = ref('phases');
const currentPhase = ref(null);
const currentBlock = ref(null);
const showModal = ref(null);
const selectedItem = ref(null);
const searchTerm = ref('');
const statusFilter = ref('All Status');

const phases = ref([
  {
    id: 1,
    name: 'Phase 1 - Kawasan Penyelidikan',
    status: 'Active',
    established: '2024-10-20',
    totalArea: 250,
    totalTrees: 57,
    totalBlocks: 12,
    description: 'Digunakan untuk penyelidikan pokok variasi baharu',
    blocks: [
      {
        id: 1,
        name: 'Block 1 - Penyelidikan Variasi Baharu',
        status: 'Active',
        established: '2024-10-20',
        totalArea: 250,
        totalTrees: 57,
        variety: 'Pisifera',
        age: '1 years old',
        description: 'Research block for new variety studies',
        trees: [
          {
            id: 'T001',
            tag: 'QR001',
            status: 'Healthy',
            age: '1 years old',
            height: 2.5,
            lastCheck: '2024-09-28',
            variety: 'Pisifera',
            diseases: [],
            location: 'Phase 1 - Kawasan Penyelidikan\nBlock 1 - Penyelidikan Variasi Baharu'
          },
          {
            id: 'T002',
            tag: 'QR002',
            status: 'Diseased',
            age: '1 years old',
            height: 2.5,
            lastCheck: '2024-09-28',
            variety: 'Pisifera',
            diseases: ['Ganoderma', 'Leaf Spot'],
            location: 'Phase 1 - Kawasan Penyelidikan\nBlock 1 - Penyelidikan Variasi Baharu'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Phase 2 - Kawasan Penanaman',
    status: 'Active',
    established: '2024-10-20',
    totalArea: 250,
    totalTrees: 57,
    totalBlocks: 12,
    description: 'Main planting area for commercial production',
    blocks: [],
  },
  {
    id: 3,
    name: 'Phase 3 - Kawasan Pembangunan',
    status: 'Development',
    established: '2024-10-20',
    totalArea: 250,
    totalTrees: 57,
    totalBlocks: 12,
    description: 'Development area for future expansion',
    blocks: [],
  },
  {
    id: 4,
    name: 'Phase 4 - Kawasan Penyelenggaraan',
    status: 'Maintenance',
    established: '2024-10-20',
    totalArea: 250,
    totalTrees: 57,
    totalBlocks: 12,
    description: 'Maintenance area for rehabilitation',
    blocks: [],
  },
  {
    id: 5,
    name: 'Phase 5 - Kawasan Tidak Aktif',
    status: 'Inactive',
    established: '2024-10-20',
    totalArea: 250,
    totalTrees: 57,
    totalBlocks: 12,
    description: 'Currently inactive area',
    blocks: [],
  }
]);

// Reactive object for the new phase form
const newPhase = ref({
  name: '',
  status: '',
  established: '',
  totalArea: 0,
  totalTrees: 0,
  totalBlocks: 0,
  description: '',
  blocks: []
});

const statusConfig = {
  phases: {
    'Active': { color: 'border-green-400', icon: 'src/assets/active-phase.png' },
    'Inactive': { color: 'border-gray-400', icon: 'src/assets/inactive.png' },
    'Development': { color: 'border-blue-400', icon: 'src/assets/development.png' },
    'Maintenance': { color: 'border-yellow-400', icon: 'src/assets/maintenance.png' }
  },
  blocks: {
    'Young Palm': { color: 'border-blue-400', icon: 'src/assets/young-palm.png' },
    'Active': { color: 'border-green-400', icon: 'src/assets/active-phase.png' },
    'Harvesting': { color: 'border-purple-400', icon: 'src/assets/harvesting.png' },
    'Maintenance': { color: 'border-yellow-400', icon: 'src/assets/maintenance.png' },
    'Replanting': { color: 'border-indigo-400', icon: 'src/assets/replant.png' }
  },
  trees: {
    'Healthy': { color: 'border-green-400', icon: 'src/assets/healthy.png' },
    'Under Observation': { color: 'border-yellow-400', icon: 'src/assets/observation.png' },
    'Diseased': { color: 'border-red-400', icon: 'src/assets/diseased.png' }
  }
};

const getTotalStats = () => {
  const totalPhases = phases.value.length;
  const totalBlocks = phases.value.reduce((acc, phase) => acc + (phase.blocks?.length || 0), 0);
  const totalTrees = phases.value.reduce((acc, phase) =>
    acc + (phase.blocks?.reduce((blockAcc, block) =>
      blockAcc + (block.trees?.length || 0), 0) || 0), 0);
  return { totalPhases, totalBlocks, totalTrees };
};

const stats = computed(getTotalStats);

const filteredItems = computed(() => {
  let items = [];

  if (currentView.value === 'phases') {
    items = phases.value;
  } else if (currentView.value === 'blocks' && currentPhase.value) {
    items = currentPhase.value.blocks || [];
  } else if (currentView.value === 'trees' && currentBlock.value) {
    items = currentBlock.value.trees || [];
  }

  if (searchTerm.value) {
    items = items.filter(item =>
      Object.values(item).some(value =>
        value && value.toString().toLowerCase().includes(searchTerm.value.toLowerCase())
      )
    );
  }

  if (statusFilter.value !== 'All Status') {
    items = items.filter(item => item.status === statusFilter.value);
  }

  return items;
});

const statusOptions = computed(() => {
  if (currentView.value === 'phases') {
    return ['All Status', 'Active', 'Inactive', 'Development', 'Maintenance'];
  } else if (currentView.value === 'blocks') {
    return ['All Status', 'Young Palm', 'Active', 'Harvesting', 'Maintenance', 'Replanting'];
  } else if (currentView.value === 'trees') {
    return ['All Status', 'Healthy', 'Under Observation', 'Diseased'];
  }
  return ['All Status'];
});

const breadcrumb = computed(() => {
  let breadcrumb = `${currentView.value.charAt(0).toUpperCase() + currentView.value.slice(1)} (${filteredItems.value.length})`;

  if (currentView.value === 'blocks' && currentPhase.value) {
    breadcrumb = `Phase (${phases.value.length}) / ${currentPhase.value.name}`;
  } else if (currentView.value === 'trees' && currentPhase.value && currentBlock.value) {
    breadcrumb = `Phase (${phases.value.length}) / ${currentPhase.value.name} / ${currentBlock.value.name}`;
  }

  return breadcrumb;
});

const openModal = (type) => {
  showModal.value = type;
  if (type === 'addPhase') {
    newPhase.value = {
      name: '',
      status: '',
      established: '',
      totalArea: 0,
      totalTrees: 0,
      totalBlocks: 0,
      description: '',
      blocks: []
    };
  }
};

const closeModal = () => {
  showModal.value = null;
};

// Function to save a new phase
const saveNewPhase = () => {
  if (newPhase.value.name && newPhase.value.status && newPhase.value.established) {
    const newId = phases.value.length + 1;
    const phaseToAdd = {
      ...newPhase.value,
      id: newId,
      totalArea: 0,
      totalTrees: 0,
      totalBlocks: 0,
      blocks: []
    };
    phases.value.push(phaseToAdd);
    closeModal();
    alert('New Phase added successfully!');
  } else {
    alert('Please fill in all required fields.');
  }
};

const generateQRCode = (text) => {
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 21 21">
      <rect width="21" height="21" fill="white"/>
      <rect x="0" y="0" width="7" height="7" fill="black"/>
      <rect x="1" y="1" width="5" height="5" fill="white"/>
      <rect x="2" y="2" width="3" height="3" fill="black"/>
      <rect x="14" y="0" width="7" height="7" fill="black"/>
      <rect x="15" y="1" width="5" height="5" fill="white"/>
      <rect x="16" y="2" width="3" height="3" fill="black"/>
      <rect x="0" y="14" width="7" height="7" fill="black"/>
      <rect x="1" y="15" width="5" height="5" fill="white"/>
      <rect x="2" y="16" width="3" height="3" fill="black"/>
      <rect x="8" y="2" width="1" height="1" fill="black"/>
      <rect x="10" y="2" width="1" height="1" fill="black"/>
      <rect x="12" y="2" width="1" height="1" fill="black"/>
      <rect x="8" y="4" width="1" height="1" fill="black"/>
      <rect x="10" y="4" width="1" height="1" fill="black"/>
      <rect x="12" y="4" width="1" height="1" fill="black"/>
      <rect x="8" y="6" width="1" height="1" fill="black"/>
      <rect x="10" y="6" width="1" height="1" fill="black"/>
      <rect x="12" y="6" width="1" height="1" fill="black"/>
      <rect x="2" y="8" width="1" height="1" fill="black"/>
      <rect x="4" y="8" width="1" height="1" fill="black"/>
      <rect x="6" y="8" width="1" height="1" fill="black"/>
      <rect x="8" y="8" width="1" height="1" fill="black"/>
      <rect x="10" y="8" width="1" height="1" fill="black"/>
      <rect x="12" y="8" width="1" height="1" fill="black"/>
      <rect x="14" y="8" width="1" height="1" fill="black"/>
      <rect x="16" y="8" width="1" height="1" fill="black"/>
      <rect x="18" y="8" width="1" height="1" fill="black"/>
      <rect x="20" y="8" width="1" height="1" fill="black"/>
    </svg>
  `)}`;
};

const viewBlocks = (phase) => {
  currentView.value = 'blocks';
  currentPhase.value = phase;
  currentBlock.value = null;
  searchTerm.value = '';
  statusFilter.value = 'All Status';
};

const viewTrees = (block) => {
  currentView.value = 'trees';
  currentBlock.value = block;
  selectedItem.value = null;
  searchTerm.value = '';
  statusFilter.value = 'All Status';
};

const viewTreeDetail = (tree) => {
  selectedItem.value = tree;
  openModal('treeDetail');
};

const logout = () => {
  if (confirm('Are you sure you want to log out?')) {
    console.log('Logging out...');
  }
};

const editItem = (item) => {
  console.log('Edit item:', item);
};

const deleteItem = (item) => {
  console.log('Delete item:', item);
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

/* New stats summary styles */
.area-stats {
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

.filter-btn.bg-orange-400.text-white {
  background: #fb923c;
  color: white;
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

.worker-card.border-green-400 {
  border-color: #4caf50;
  background: linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%);
}

.worker-card.border-gray-400 {
  border-color: #9e9e9e;
  background: linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%);
}

.worker-card.border-blue-400 {
  border-color: #2196f3;
  background: linear-gradient(135deg, #bbdefb 0%, #90caf9 100%);
}

.worker-card.border-yellow-400 {
  border-color: #ffeb3b;
  background: linear-gradient(135deg, #fff9c4 0%, #ffee58 100%);
}

.worker-card.border-purple-400 {
  border-color: #9c27b0;
  background: linear-gradient(135deg, #e1bee7 0%, #ce93d8 100%);
}

.worker-card.border-indigo-400 {
  border-color: #3f51b5;
  background: linear-gradient(135deg, #c5cae9 0%, #9fa8da 100%);
}

.worker-card.border-red-400 {
  border-color: #f44336;
  background: linear-gradient(135deg, #ffcdd2 0%, #e57373 100%);
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

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: modal-fade-in 0.3s ease-out;
}

.modal-header {
  background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
  color: white;
  padding: 20px;
  text-align: center;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #f9f9f9;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3a7bd5;
  box-shadow: 0 0 0 3px rgba(58, 123, 213, 0.2);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn,
.save-btn {
  padding: 12px 24px;
  border-radius: 25px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #e0e0e0;
  color: #555;
}

.cancel-btn:hover {
  background: #c2c2c2;
}

.save-btn {
  background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
  color: white;
}

.save-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

@keyframes modal-fade-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>