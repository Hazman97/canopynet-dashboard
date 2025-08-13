<template>
  <div class="farm-workers-container">
    <!-- Header -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <h1 class="main-title">My Farm Workers !</h1>
          <div class="worker-stats">
            <div class="stat-item">
              <span class="stat-icon">👥</span>
              <span class="stat-text">{{ totalWorkers }} Workers</span>
            </div>
            <div class="stat-item active">
              <span class="stat-icon">🟢</span>
              <span class="stat-text">{{ activeWorkers }} Active</span>
            </div>
          </div>
        </div>
        <button @click="logout" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm">
          Logout
        </button>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="nav-tabs">
      <button 
        class="nav-tab" 
        :class="{ active: currentTab === 'workers' }"
        @click="currentTab = 'workers'"
      >
        <span class="tab-icon">👥</span>
        Workers List
      </button>
      <button 
        class="nav-tab" 
        :class="{ active: currentTab === 'attendance' }"
        @click="currentTab = 'attendance'"
      >
        <span class="tab-icon">📊</span>
        Attendance Table
      </button>
      <button 
        class="nav-tab" 
        :class="{ active: currentTab === 'performance' }"
        @click="currentTab = 'performance'"
      >
        <span class="tab-icon">📈</span>
        Performance Report
      </button>
      <button class="add-worker-btn" @click="showAddWorkerModal = true">
        <span class="plus-icon">+</span>
        Add New Worker
      </button>
    </div>

    <!-- Workers List Tab -->
    <div v-if="currentTab === 'workers'" class="workers-content">
      <!-- Search Bar -->
      <div class="search-section">
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search" 
            v-model="searchQuery"
            class="search-input"
          />
        </div>
        
        <!-- Filter Buttons -->
        <div class="filter-buttons">
          <button 
            class="filter-btn" 
            :class="{ active: workerFilter === 'all' }"
            @click="workerFilter = 'all'"
          >
            <span class="filter-icon">👥</span>
            All Workers
          </button>
          <button 
            class="filter-btn" 
            :class="{ active: workerFilter === 'active' }"
            @click="workerFilter = 'active'"
          >
            <span class="filter-icon">🟢</span>
            Active
          </button>
          <button 
            class="filter-btn" 
            :class="{ active: workerFilter === 'inactive' }"
            @click="workerFilter = 'inactive'"
          >
            <span class="filter-icon">🔴</span>
            Inactive
          </button>
        </div>
      </div>

      <!-- Workers Grid -->
      <div class="workers-grid">
        <div 
          v-for="worker in filteredWorkers" 
          :key="worker.id"
          class="worker-card"
          :class="{ 
            active: worker.status === 'Active', 
            inactive: worker.status === 'Inactive',
            'on-break': worker.status === 'On-break'
          }"
        >
          <div class="worker-info">
            <div class="worker-avatar">👤</div>
            <div class="worker-details">
              <h3 class="worker-name">{{ worker.name }}</h3>
              <p class="worker-id">ID: {{ worker.id }}</p>
            </div>
          </div>
          <div class="worker-rating">
            <div class="stars">
              <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= worker.rating }">⭐</span>
            </div>
          </div>
          <div class="worker-actions">
            <button class="edit-btn" @click="editWorker(worker)">✏️</button>
            <button class="delete-btn" @click="deleteWorker(worker.id)">🗑️</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Attendance Table Tab -->
    <div v-if="currentTab === 'attendance'" class="attendance-content">
      <div class="attendance-header">
        <div class="attendance-title">
          <h2>Attendance Table - 📅 {{ currentDate }}</h2>
        </div>
        <button class="download-btn" @click="downloadAttendance">
          <span class="download-icon">⬇️</span>
          Download file
        </button>
      </div>

      <div class="attendance-table">
        <div class="table-header">
          <div class="table-col">NO</div>
          <div class="table-col">WORKER NAME - CODE</div>
          <div class="table-col">ATTENDANCE</div>
        </div>
        <div class="table-body">
          <div v-for="(worker, index) in workers.filter(w => w.status !== 'Inactive')" :key="worker.id" class="table-row">
            <div class="table-col">{{ index + 1 }}</div>
            <div class="table-col">{{ worker.name.toUpperCase() }} - {{ worker.id }}</div>
            <div class="table-col">
              <span class="attendance-status" :class="{ present: worker.attendance === 'Present', absent: worker.attendance === 'Absent' }">
                <span v-if="worker.attendance === 'Present'" class="status-icon">✅</span>
                <span v-else class="status-icon">❌</span>
                {{ worker.attendance.toUpperCase() }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Report Tab -->
    <div v-if="currentTab === 'performance'" class="performance-content">
      <div class="performance-header">
        <h2>Performance Report</h2>
        <div class="time-filters">
          <button class="time-filter" :class="{ active: timeFilter === 'today' }" @click="timeFilter = 'today'">Today</button>
          <button class="time-filter" :class="{ active: timeFilter === 'week' }" @click="timeFilter = 'week'">This Week</button>
          <button class="time-filter" :class="{ active: timeFilter === 'month' }" @click="timeFilter = 'month'">This Month</button>
          <button class="time-filter" :class="{ active: timeFilter === 'quarter' }" @click="timeFilter = 'quarter'">This Quarter</button>
        </div>
      </div>

      <div class="performance-table">
        <div class="perf-table-header">
          <div class="perf-col">RANK</div>
          <div class="perf-col">WORKER NAME - CODE</div>
          <div class="perf-col">PRODUCTIVITY</div>
          <div class="perf-col">TREND</div>
          <div class="perf-col">STATUS</div>
        </div>
        <div class="perf-table-body">
          <div v-for="(worker, index) in sortedWorkersByProductivity" :key="worker.id" class="perf-table-row">
            <div class="perf-col">
              <div class="rank-badge" :class="getRankClass(index)">
                <span v-if="index === 0">🥇</span>
                <span v-else-if="index === 1">🥈</span>
                <span v-else-if="index === 2">🥉</span>
                <span v-else>{{ index + 1 }}</span>
              </div>
            </div>
            <div class="perf-col">{{ worker.name.toUpperCase() }} - {{ worker.id }}</div>
            <div class="perf-col">{{ worker.productivity }}</div>
            <div class="perf-col">
              <span class="trend" :class="{ positive: worker.trend > 0, negative: worker.trend < 0, neutral: worker.trend === 0 }">
                <span v-if="worker.trend > 0">📈</span>
                <span v-else-if="worker.trend < 0">📉</span>
                {{ worker.trend > 0 ? '+' : '' }}{{ worker.trend }}%
              </span>
            </div>
            <div class="perf-col">
              <span class="status-badge" :class="worker.status.toLowerCase().replace('-', '')">{{ worker.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Worker Modal -->
    <div v-if="showAddWorkerModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Add New Worker</h2>
        </div>
        <form @submit.prevent="addWorker" class="worker-form">
          <div class="form-group">
            <label>Workers Name:</label>
            <input type="text" v-model="newWorker.name" required class="form-input" />
          </div>
          <div class="form-group">
            <label>Workers ID:</label>
            <input type="text" v-model="newWorker.id" required class="form-input" />
          </div>
          <div class="form-group">
            <label>Workers Status:</label>
            <select v-model="newWorker.status" required class="form-select">
              <option value="">-- Choose Status --</option>
              <option value="Active">🟢 Active</option>
              <option value="Inactive">🔴 Inactive</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="submit" class="add-btn">Add</button>
            <button type="button" class="cancel-btn" @click="closeModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <div class="fixed bottom-0 left-0 right-0 bg-white shadow-inner border-t flex justify-around py-2">
      <div @click="$router.push('/game-platform')" class="flex flex-col items-center cursor-pointer hover:text-green-700 transition">
        <img src="@/assets/house.png" class="w-8 mb-1" alt="Home" />
        <span class="text-sm">Home</span>
      </div>
      <div @click="$router.push('/game-tasks')" class="flex flex-col items-center cursor-pointer hover:text-red-700 transition">
        <img src="@/assets/task.png" class="w-8 mb-1" alt="Tasks" />
        <span class="text-sm">Tasks</span>
      </div>
      <div @click="$router.push('/game-workers')" class="flex flex-col items-center text-yellow-700 font-bold">
        <img src="@/assets/crew.png" class="w-8 mb-1" alt="Crew" />
        <span class="text-sm">Crew</span>
      </div>
      <div @click="$router.push('/game-areas')" class="flex flex-col items-center cursor-pointer hover:text-blue-700 transition">
        <img src="@/assets/map.png" class="w-8 mb-1" alt="Map" />
        <span class="text-sm">Areas</span>
      </div>
      <div @click="$router.push('/game-assets')" class="flex flex-col items-center cursor-pointer hover:text-black-700 transition">
        <img src="@/assets/tractor.png" class="w-8 mb-1" alt="Assets" />
        <span class="text-sm">Assets</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameWorkersView',
  data() {
    return {
      currentTab: 'workers',
      workerFilter: 'all',
      timeFilter: 'today',
      searchQuery: '',
      showAddWorkerModal: false,
      newWorker: {
        name: '',
        id: '',
        status: ''
      },
      workers: [
        {
          id: '#S001',
          name: 'Farah Nabila',
          status: 'Active',
          rating: 5,
          productivity: 550.00,
          trend: 5,
          attendance: 'Present'
        },
        {
          id: '#S002',
          name: 'Fatini Zahirah',
          status: 'Active',
          rating: 3,
          productivity: 198.96,
          trend: 0,
          attendance: 'Present'
        },
        {
          id: '#S003',
          name: 'Hadyna Redwani',
          status: 'Active',
          rating: 4,
          productivity: 480.25,
          trend: 1,
          attendance: 'Absent'
        },
        {
          id: '#S004',
          name: 'Farah Shahira',
          status: 'Inactive',
          rating: 1,
          productivity: 0,
          trend: 0,
          attendance: 'Absent'
        },
        {
          id: '#S005',
          name: 'Izzatul Hanan',
          status: 'Active',
          rating: 5,
          productivity: 200.00,
          trend: -0.5,
          attendance: 'Present'
        }
      ]
    }
  },
  computed: {
    totalWorkers() {
      return this.workers.length;
    },
    activeWorkers() {
      return this.workers.filter(worker => worker.status === 'Active').length;
    },
    currentDate() {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      return `${day}-${month}-${year}`;
    },
    filteredWorkers() {
      let filtered = this.workers;
      
      if (this.workerFilter === 'active') {
        filtered = filtered.filter(worker => worker.status === 'Active');
      } else if (this.workerFilter === 'inactive') {
        filtered = filtered.filter(worker => worker.status === 'Inactive');
      }
      
      if (this.searchQuery) {
        filtered = filtered.filter(worker => 
          worker.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          worker.id.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      
      return filtered;
    },
    sortedWorkersByProductivity() {
      return [...this.workers]
        .filter(worker => worker.status !== 'Inactive')
        .sort((a, b) => b.productivity - a.productivity);
    }
  },
  methods: {
    logout() {
      if (confirm('Are you sure you want to log out?')) {
        // Handle logout logic here
        console.log('Logging out...');
        // Example: this.$router.push('/login');
      }
    },
    addWorker() {
      // Generate a new ID
      const maxId = Math.max(...this.workers.map(w => parseInt(w.id.replace('#S', ''))));
      const newId = `#S${String(maxId + 1).padStart(3, '0')}`;
      
      const worker = {
        ...this.newWorker,
        id: newId,
        rating: 3,
        productivity: 0,
        trend: 0,
        attendance: 'Present'
      };
      
      this.workers.push(worker);
      this.closeModal();
      
      // Show success message
      alert(`Worker ${worker.name} added successfully!`);
    },
    closeModal() {
      this.showAddWorkerModal = false;
      this.newWorker = { name: '', id: '', status: '' };
    },
    editWorker(worker) {
      const newName = prompt(`Edit worker name:`, worker.name);
      if (newName && newName.trim()) {
        worker.name = newName.trim();
        alert(`Worker updated successfully!`);
      }
    },
    deleteWorker(workerId) {
      if (confirm('Are you sure you want to delete this worker?')) {
        this.workers = this.workers.filter(worker => worker.id !== workerId);
        alert('Worker deleted successfully!');
      }
    },
    downloadAttendance() {
      const csvData = this.generateAttendanceCSV();
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `attendance-${this.currentDate}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    },
    generateAttendanceCSV() {
      let csv = 'NO,WORKER NAME - CODE,ATTENDANCE\n';
      const activeWorkers = this.workers.filter(w => w.status !== 'Inactive');
      
      activeWorkers.forEach((worker, index) => {
        csv += `${index + 1},"${worker.name.toUpperCase()} - ${worker.id}",${worker.attendance.toUpperCase()}\n`;
      });
      
      return csv;
    },
    getRankClass(index) {
      if (index === 0) return 'gold';
      if (index === 1) return 'silver';
      if (index === 2) return 'bronze';
      return 'default';
    }
  },
  mounted() {
    // Initialize component
    console.log('Farm Workers Management System loaded');
  },
    // Logout functionality
  logout() {
    sessionStorage.removeItem('userToken'); // Clear token
    sessionStorage.removeItem('userRole');  // Clear role
    this.$router.push('/login'); // Redirect to login page
    }
  }
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
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
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
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.worker-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.2);
  padding: 8px 16px;
  border-radius: 20px;
  color: white;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.stat-item.active {
  background: rgba(255,255,255,0.3);
}

.stat-icon {
  font-size: 1.2rem;
}

.log-out-btn {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.log-out-btn:hover {
  background: #ff5252;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

/* Navigation Tabs */
.nav-tabs {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin: 0 20px 30px 20px;
  flex-wrap: wrap;
}

.nav-tab {
  background: rgba(255,255,255,0.9);
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #666;
  transition: all 0.3s ease;
  font-size: 1rem;
  backdrop-filter: blur(10px);
}

.nav-tab:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.nav-tab.active {
  background: white;
  color: #4facfe;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.tab-icon {
  font-size: 1.2rem;
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
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.plus-icon {
  font-size: 1.2rem;
  font-weight: bold;
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
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
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
  background: rgba(255,255,255,0.8);
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
}

.filter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.filter-btn.active {
  background: #4facfe;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.filter-icon {
  font-size: 1.1rem;
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
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  border: 3px solid transparent;
  position: relative;
  backdrop-filter: blur(10px);
}

.worker-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

.worker-card.active {
  border-color: #4caf50;
  background: linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%);
}

.worker-card.inactive {
  border-color: #f44336;
  background: linear-gradient(135deg, #ffcdd2 0%, #ef9a9a 100%);
}

.worker-card.on-break {
  border-color: #ff9800;
  background: linear-gradient(135deg, #ffe0b2 0%, #ffcc02 100%);
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
  border: 2px solid rgba(0,0,0,0.1);
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

.worker-rating {
  margin-bottom: 15px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 1.2rem;
  opacity: 0.3;
  transition: all 0.3s ease;
}

.star.filled {
  opacity: 1;
}

.worker-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.edit-btn, .delete-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background: rgba(0,0,0,0.1);
  transform: scale(1.1);
}

.delete-btn:hover {
  background: rgba(255,0,0,0.1);
  transform: scale(1.1);
}

/* Attendance Content */
.attendance-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.attendance-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.attendance-title h2 {
  color: white;
  font-size: 1.5rem;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.download-btn {
  background: #4facfe;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.download-btn:hover {
  background: #3d8bfe;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.download-icon {
  font-size: 1.2rem;
}

.attendance-table {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  backdrop-filter: blur(10px);
}

.table-header {
  background: rgba(0,0,0,0.2);
  display: grid;
  grid-template-columns: 80px 1fr 200px;
  gap: 20px;
  padding: 20px;
  font-weight: bold;
  color: white;
  text-align: center;
}

.table-body {
  background: rgba(255,255,255,0.1);
}

.table-row {
  display: grid;
  grid-template-columns: 80px 1fr 200px;
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  color: white;
  text-align: center;
  align-items: center;
  transition: all 0.3s ease;
}

.table-row:hover {
  background: rgba(255,255,255,0.15);
}

.table-row:last-child {
  border-bottom: none;
}

.table-col {
  display: flex;
  align-items: center;
  justify-content: center;
}

.attendance-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 15px;
}

.attendance-status.present {
  color: #4caf50;
  background: rgba(76, 175, 80, 0.2);
}

.attendance-status.absent {
  color: #f44336;
  background: rgba(244, 67, 54, 0.2);
}

.status-icon {
  font-size: 1.1rem;
}

/* Performance Content */
.performance-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.performance-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.performance-header h2 {
  color: white;
  font-size: 1.5rem;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.time-filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.time-filter {
  background: rgba(255,255,255,0.2);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
}

.time-filter:hover {
  background: rgba(255,255,255,0.3);
  transform: translateY(-2px);
}

.time-filter.active {
  background: #4facfe;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.performance-table {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  backdrop-filter: blur(10px);
}

.perf-table-header {
  background: rgba(0,0,0,0.2);
  display: grid;
  grid-template-columns: 100px 1fr 150px 120px 120px;
  gap: 20px;
  padding: 20px;
  font-weight: bold;
  color: white;
  text-align: center;
}

.perf-table-body {
  background: rgba(255,255,255,0.1);
}

.perf-table-row {
  display: grid;
  grid-template-columns: 100px 1fr 150px 120px 120px;
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  color: white;
  text-align: center;
  align-items: center;
  transition: all 0.3s ease;
}

.perf-table-row:hover {
  background: rgba(255,255,255,0.15);
}

.perf-table-row:last-child {
  border-bottom: none;
}

.perf-col {
  display: flex;
  align-items: center;
  justify-content: center;
}

.rank-badge {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  font-weight: bold;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.rank-badge:hover {
  transform: scale(1.1);
}

.rank-badge.gold {
  background: linear-gradient(135deg, #ffd700, #ffb347);
  color: #333;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

.rank-badge.silver {
  background: linear-gradient(135deg, #c0c0c0, #a8a8a8);
  color: #333;
  box-shadow: 0 0 20px rgba(192, 192, 192, 0.5);
}

.rank-badge.bronze {
  background: linear-gradient(135deg, #cd7f32, #b8860b);
  color: white;
  box-shadow: 0 0 20px rgba(205, 127, 50, 0.5);
}

.rank-badge.default {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 2px solid rgba(255,255,255,0.3);
}

.trend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-weight: bold;
  padding: 3px 8px;
  border-radius: 10px;
}

.trend.positive {
  color: #4caf50;
  background: rgba(76, 175, 80, 0.2);
}

.trend.negative {
  color: #f44336;
  background: rgba(244, 67, 54, 0.2);
}

.trend.neutral {
  color: #666;
  background: rgba(128, 128, 128, 0.2);
}

.status-badge {
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}

.status-badge.active {
  background: #4caf50;
  color: white;
}

.status-badge.onbreak {
  background: #ff9800;
  color: white;
}

.status-badge.inactive {
  background: #f44336;
  color: white;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  animation: slideIn 0.3s ease-out;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  text-align: center;
  margin-bottom: 30px;
}

.modal-header h2 {
  color: #333;
  margin: 0;
  font-size: 1.8rem;
}

.worker-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #333;
  font-weight: 600;
  font-size: 1rem;
}

.form-input, .form-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  background: white;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #4facfe;
  box-shadow: 0 0 10px rgba(79, 172, 254, 0.2);
}

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 20px;
  padding-right: 40px;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}

.add-btn {
  background: #4facfe;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 1rem;
  min-width: 100px;
}

.add-btn:hover {
  background: #3d8bfe;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.cancel-btn {
  background: #f44336;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 1rem;
  min-width: 100px;
}

.cancel-btn:hover {
  background: #d32f2f;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

/* Bottom Navigation */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  justify-content: space-around;
  padding: 15px 0;
  box-shadow: 0 -5px 15px rgba(0,0,0,0.1);
  z-index: 100;
  backdrop-filter: blur(10px);
}

.nav-item {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  color: #999;
  transition: all 0.3s ease;
  padding: 8px 12px;
  border-radius: 10px;
  min-width: 60px;
}

.nav-item:hover {
  color: #4facfe;
  transform: translateY(-2px);
}

.nav-item.active {
  color: #4facfe;
  background: rgba(79, 172, 254, 0.1);
  transform: translateY(-2px);
}

.nav-icon {
  font-size: 1.5rem;
}

.nav-label {
  font-size: 0.8rem;
  font-weight: 600;
}

/* Animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.worker-card {
  animation: slideIn 0.3s ease-out;
}

.modal-content {
  animation: slideIn 0.3s ease-out;
}

.attendance-table, .performance-table {
  animation: fadeIn 0.5s ease-out;
}

.stat-item.active {
  animation: pulse 2s infinite;
}

/* Loading States */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: white;
  font-size: 1.2rem;
}

.loading::after {
  content: "";
  width: 30px;
  height: 30px;
  border: 3px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-left: 10px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-title {
    font-size: 2.2rem;
  }
  
  .workers-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
  
  .nav-tabs {
    justify-content: center;
    gap: 10px;
  }
  
  .nav-tab, .add-worker-btn {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .main-title {
    font-size: 2rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .worker-stats {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .nav-tabs {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  
  .nav-tab, .add-worker-btn {
    width: 200px;
    justify-content: center;
  }
  
  .workers-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-buttons {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  
  .filter-btn {
    width: 200px;
    justify-content: center;
  }
  
  .table-header, .table-row {
    grid-template-columns: 50px 1fr 120px;
    font-size: 0.9rem;
    padding: 15px 10px;
    gap: 10px;
  }
  
  .perf-table-header, .perf-table-row {
    grid-template-columns: 70px 1fr 100px 80px 100px;
    font-size: 0.8rem;
    padding: 15px 10px;
    gap: 5px;
  }
  
  .attendance-header, .performance-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .time-filters {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .modal-content {
    margin: 20px;
    padding: 25px;
    width: calc(100% - 40px);
  }
  
  .modal-actions {
    flex-direction: column;
    gap: 10px;
  }
  
  .add-btn, .cancel-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .farm-workers-container {
    padding-bottom: 100px;
  }
  
  .main-title {
    font-size: 1.6rem;
  }
  
  .worker-stats {
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }
  
  .stat-item {
    justify-content: center;
  }
  
  .log-out-btn {
    width: 100%;
    margin-top: 15px;
  }
  
  .nav-tab, .add-worker-btn {
    width: 180px;
    padding: 12px 16px;
  }
  
  .search-bar {
    padding: 12px 15px;
  }
  
  .worker-card {
    padding: 15px;
  }
  
  .worker-name {
    font-size: 1.1rem;
  }
  
  .table-header, .table-row {
    grid-template-columns: 40px 1fr 100px;
    font-size: 0.8rem;
    padding: 12px 8px;
    gap: 8px;
  }
  
  .perf-table-header, .perf-table-row {
    grid-template-columns: 60px 1fr 80px 70px 80px;
    font-size: 0.7rem;
    padding: 12px 5px;
    gap: 3px;
  }
  
  .rank-badge {
    width: 30px;
    height: 30px;
    font-size: 1rem;
  }
  
  .time-filter {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
  
  .bottom-nav {
    padding: 12px 0;
  }
  
  .nav-icon {
    font-size: 1.3rem;
  }
  
  .nav-label {
    font-size: 0.7rem;
  }
  
  .modal-content {
    padding: 20px;
    margin: 15px;
  }
  
  .modal-header h2 {
    font-size: 1.5rem;
  }
  
  .form-input, .form-select {
    padding: 10px 12px;
  }
}

/* Focus States for Accessibility */
.nav-tab:focus,
.filter-btn:focus,
.add-worker-btn:focus,
.log-out-btn:focus,
.download-btn:focus,
.time-filter:focus,
.form-input:focus,
.form-select:focus,
.add-btn:focus,
.cancel-btn:focus,
.nav-item:focus,
.edit-btn:focus,
.delete-btn:focus {
  outline: 2px solid #4facfe;
  outline-offset: 2px;
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  .worker-card {
    border-width: 2px;
  }
  
  .nav-tab, .filter-btn {
    border: 2px solid #666;
  }
  
  .nav-tab.active, .filter-btn.active {
    border-color: #4facfe;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Print Styles */
@media print {
  .header-section,
  .nav-tabs,
  .search-section,
  .filter-buttons,
  .bottom-nav,
  .modal-overlay,
  .worker-actions {
    display: none !important;
  }
  
  .farm-workers-container {
    background: white !important;
    color: black !important;
  }
  
  .attendance-table,
  .performance-table {
    background: white !important;
    color: black !important;
    box-shadow: none !important;
    border: 2px solid black;
  }
  
  .table-header,
  .table-row,
  .perf-table-header,
  .perf-table-row {
    color: black !important;
    background: white !important;
  }
  
  .worker-card {
    border: 2px solid black !important;
    background: white !important;
    color: black !important;
    box-shadow: none !important;
  }
}

/* Dark mode support (if needed) */
@media (prefers-color-scheme: dark) {
  .form-input, .form-select {
    background: #333;
    color: white;
    border-color: #666;
  }
  
  .modal-content {
    background: #2a2a2a;
    color: white;
  }
  
  .modal-header h2 {
    color: white;
  }
  
  .form-group label {
    color: white;
  }
}
</style>