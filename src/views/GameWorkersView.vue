<template>
  <div class="farm-workers-container">
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
      <button class="add-worker-btn" @click="openModal()">
        <span class="plus-icon">+</span>
        Add New Worker
      </button>
    </div>

    <div v-if="currentTab === 'workers'" class="workers-content">
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

      <div class="workers-grid">
        <div 
          v-for="worker in filteredWorkers" 
          :key="worker.id"
          class="worker-card"
          :class="{ 
            active: worker.status === 'Active', 
            inactive: worker.status === 'Inactive',
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
            <button class="edit-btn" @click="openModal(worker)">✏️</button>
            <button class="delete-btn" @click="deleteWorker(worker.id)">🗑️</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="currentTab === 'attendance'" class="attendance-content">
      <div class="attendance-header">
        <div class="attendance-title">
          <h2 class="inline-flex items-center">Attendance Table - 
            <label for="attendance-date" class="sr-only">Choose a date</label>
            <input 
              type="date" 
              id="attendance-date" 
              v-model="selectedAttendanceDate" 
              class="ml-2 bg-transparent text-white border-0 focus:ring-0 cursor-pointer"
            />
          </h2>
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
          <div v-for="(worker, index) in workersForAttendance" :key="worker.id" class="table-row">
            <div class="table-col">{{ index + 1 }}</div>
            <div class="table-col">{{ worker.name.toUpperCase() }} - {{ worker.id }}</div>
            <div class="table-col">
              <label class="attendance-checkbox-container">
                <input 
                  type="checkbox" 
                  :checked="isWorkerPresent(worker.id)"
                  @change="toggleAttendance(worker.id, $event.target.checked)"
                />
                <span class="checkmark"></span>
                <span class="status-text">{{ isWorkerPresent(worker.id) ? 'Present' : 'Absent' }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

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
          <div v-for="(worker, index) in sortedWorkersByPerformance" :key="worker.id" class="perf-table-row">
            <div class="perf-col">
              <div class="rank-badge" :class="getRankClass(index)">
                <span v-if="index === 0">🥇</span>
                <span v-else-if="index === 1">🥈</span>
                <span v-else-if="index === 2">🥉</span>
                <span v-else>{{ index + 1 }}</span>
              </div>
            </div>
            <div class="perf-col">{{ worker.name.toUpperCase() }} - {{ worker.id }}</div>
            <div class="perf-col">{{ worker.performance[timeFilter].productivity }}</div>
            <div class="perf-col">
              <span class="trend" :class="{ positive: worker.performance[timeFilter].trend > 0, negative: worker.performance[timeFilter].trend < 0, neutral: worker.performance[timeFilter].trend === 0 }">
                <span v-if="worker.performance[timeFilter].trend > 0">📈</span>
                <span v-else-if="worker.performance[timeFilter].trend < 0">📉</span>
                {{ worker.performance[timeFilter].trend > 0 ? '+' : '' }}{{ worker.performance[timeFilter].trend }}%
              </span>
            </div>
            <div class="perf-col">
              <span class="status-badge" :class="worker.status.toLowerCase().replace('-', '')">{{ worker.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header-light">
          <h2>{{ isEditMode ? 'Edit Worker Details' : 'Add New Worker' }}</h2>
        </div>
        <form @submit.prevent="saveWorker" class="worker-form">
          <div class="form-group">
            <label>Workers Name:</label>
            <input type="text" v-model="currentWorker.name" required class="form-input" />
          </div>
          <div class="form-group">
            <label>Workers ID:</label>
            <input type="text" v-model="currentWorker.id" required class="form-input" :readonly="isEditMode" />
          </div>
          <div class="form-group">
            <label>Workers Status:</label>
            <select v-model="currentWorker.status" required class="form-select">
              <option value="">-- Choose Status --</option>
              <option value="Active">🟢 Active</option>
              <option value="Inactive">🔴 Inactive</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="submit" class="add-btn">{{ isEditMode ? 'Save Changes' : 'Add Worker' }}</button>
            <button type="button" class="cancel-btn" @click="closeModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>

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
    const today = new Date().toISOString().split('T')[0];
    return {
      currentTab: 'workers',
      workerFilter: 'all',
      timeFilter: 'today',
      searchQuery: '',
      showModal: false,
      isEditMode: false,
      currentWorker: {
        name: '',
        id: '',
        status: ''
      },
      workers: [
        { id: '#S001', name: 'Farah Nabila', status: 'Active', rating: 5, performance: { today: { productivity: 550.00, trend: 5 }, week: { productivity: 2750.00, trend: 10 }, month: { productivity: 11000.00, trend: 20 }, quarter: { productivity: 33000.00, trend: 15 } } },
        { id: '#S002', name: 'Fatini Zahirah', status: 'Active', rating: 3, performance: { today: { productivity: 198.96, trend: 0 }, week: { productivity: 994.80, trend: 2 }, month: { productivity: 3979.20, trend: -5 }, quarter: { productivity: 11937.60, trend: -3 } } },
        { id: '#S003', name: 'Hadyna Redwani', status: 'Active', rating: 4, performance: { today: { productivity: 480.25, trend: 1 }, week: { productivity: 2401.25, trend: 3 }, month: { productivity: 9605.00, trend: 8 }, quarter: { productivity: 28815.00, trend: 5 } } },
        { id: '#S004', name: 'Farah Shahira', status: 'Inactive', rating: 1, performance: { today: { productivity: 0, trend: 0 }, week: { productivity: 0, trend: 0 }, month: { productivity: 0, trend: 0 }, quarter: { productivity: 0, trend: 0 } } },
        { id: '#S005', name: 'Izzatul Hanan', status: 'Active', rating: 5, performance: { today: { productivity: 200.00, trend: -0.5 }, week: { productivity: 1000.00, trend: -1 }, month: { productivity: 4000.00, trend: 5 }, quarter: { productivity: 12000.00, trend: 10 } } },
        { id: '#S006', name: 'Nurul Huda', status: 'Active', rating: 4, performance: { today: { productivity: 350.00, trend: 2 }, week: { productivity: 1750.00, trend: 4 }, month: { productivity: 7000.00, trend: 6 }, quarter: { productivity: 21000.00, trend: 8 } } },
        { id: '#S007', name: 'Alif Zulkarnain', status: 'Inactive', rating: 2, performance: { today: { productivity: 10.00, trend: -2 }, week: { productivity: 50.00, trend: -5 }, month: { productivity: 200.00, trend: -10 }, quarter: { productivity: 600.00, trend: -15 } } },
        { id: '#S008', name: 'Siti Aisyah', status: 'Inactive', rating: 3, performance: { today: { productivity: 0, trend: 0 }, week: { productivity: 0, trend: 0 }, month: { productivity: 0, trend: 0 }, quarter: { productivity: 0, trend: 0 } } },
        { id: '#S009', name: 'Ahmad bin Ali', status: 'Active', rating: 5, performance: { today: { productivity: 620.00, trend: 8 }, week: { productivity: 3100.00, trend: 12 }, month: { productivity: 12400.00, trend: 15 }, quarter: { productivity: 37200.00, trend: 25 } } },
        { id: '#S010', name: 'Kamal bin Hashim', status: 'Active', rating: 4, performance: { today: { productivity: 450.00, trend: 3 }, week: { productivity: 2250.00, trend: 7 }, month: { productivity: 9000.00, trend: 10 }, quarter: { productivity: 27000.00, trend: 12 } } },
        { id: '#S011', name: 'Aminah binti Idris', status: 'Active', rating: 5, performance: { today: { productivity: 580.00, trend: 6 }, week: { productivity: 2900.00, trend: 11 }, month: { productivity: 11600.00, trend: 18 }, quarter: { productivity: 34800.00, trend: 22 } } }
      ],
      selectedAttendanceDate: today,
      attendanceRecords: {
        [today]: {
          '#S001': true,
          '#S002': true,
          '#S003': false,
          '#S004': false,
          '#S005': true,
          '#S006': true,
          '#S007': false,
          '#S008': false,
          '#S009': true,
          '#S010': true,
          '#S011': true,
        },
        '2024-08-13': {
          '#S001': true,
          '#S002': true,
          '#S003': true,
          '#S004': false,
          '#S005': true,
          '#S006': false,
          '#S007': false,
          '#S008': false,
          '#S009': true,
          '#S010': true,
          '#S011': true,
        },
      }
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
      return this.selectedAttendanceDate;
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
    workersForAttendance() {
      return this.workers;
    },
    sortedWorkersByPerformance() {
      const workersWithPerformance = this.workers.map(worker => ({
        ...worker,
        currentPerformance: worker.performance[this.timeFilter]
      }));
      
      return workersWithPerformance.sort((a, b) => b.currentPerformance.productivity - a.currentPerformance.productivity);
    }
  },
  methods: {
    isWorkerPresent(workerId) {
      const attendance = this.attendanceRecords[this.selectedAttendanceDate];
      return attendance ? attendance[workerId] : false;
    },
    toggleAttendance(workerId, isPresent) {
      if (!this.attendanceRecords[this.selectedAttendanceDate]) {
        this.$set(this.attendanceRecords, this.selectedAttendanceDate, {});
      }
      this.$set(this.attendanceRecords[this.selectedAttendanceDate], workerId, isPresent);
    },
    logout() {
      if (confirm('Are you sure you want to log out?')) {
        console.log('Logging out...');
      }
    },
    openModal(worker = null) {
      this.isEditMode = !!worker;
      if (this.isEditMode) {
        this.currentWorker = { ...worker };
      } else {
        this.currentWorker = { name: '', id: '', status: '' };
      }
      this.showModal = true;
    },
    saveWorker() {
      if (this.isEditMode) {
        const index = this.workers.findIndex(w => w.id === this.currentWorker.id);
        if (index !== -1) {
          this.$set(this.workers, index, { ...this.currentWorker });
          alert(`Worker ${this.currentWorker.name} updated successfully!`);
        }
      } else {
        const maxId = Math.max(...this.workers.map(w => parseInt(w.id.replace('#S', ''))));
        const newId = `#S${String(maxId + 1).padStart(3, '0')}`;
        const newWorkerData = {
          ...this.currentWorker,
          id: newId,
          rating: 3,
          performance: {
            today: { productivity: 0, trend: 0 },
            week: { productivity: 0, trend: 0 },
            month: { productivity: 0, trend: 0 },
            quarter: { productivity: 0, trend: 0 }
          },
        };
        this.workers.push(newWorkerData);
        alert(`Worker ${newWorkerData.name} added successfully!`);
      }
      this.closeModal();
    },
    closeModal() {
      this.showModal = false;
      this.currentWorker = { name: '', id: '', status: '' };
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
      const workersForCsv = this.workersForAttendance;
      const attendance = this.attendanceRecords[this.selectedAttendanceDate] || {};
      
      workersForCsv.forEach((worker, index) => {
        const status = attendance[worker.id] ? 'Present' : 'Absent';
        csv += `${index + 1},"${worker.name.toUpperCase()} - ${worker.id}",${status.toUpperCase()}\n`;
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

.worker-stats {
  display: flex;
  gap: 20px;
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

.stat-item.active {
  background: rgba(255, 255, 255, 0.3);
}

.stat-item.complete {
  background: rgba(255, 255, 255, 0.3);
}

.stat-icon {
  font-size: 1.2rem;
}

.stat-text {
  font-size: 1rem;
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
  background: rgba(255, 255, 255, 0.9);
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
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.nav-tab.active {
  background: white;
  color: #4facfe;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
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
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
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
}

.filter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.filter-btn.active {
  background: #4facfe;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
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
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 3px solid transparent;
  position: relative;
}

.worker-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.worker-card.active {
  border-color: #2196f3;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}

.worker-card.inactive {
  border-color: #f44336;
  background: linear-gradient(135deg, #ffcdd2 0%, #ef9a9a 100%);
}


.worker-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.worker-avatar {
  background: #e0e0e0;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.worker-name {
  font-weight: bold;
  font-size: 1.2rem;
  color: #333;
}

.worker-id {
  font-size: 0.9rem;
  color: #666;
}

.worker-rating {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.stars {
  font-size: 1.2rem;
}

.star {
  color: #ccc;
}

.star.filled {
  color: #ffc107;
}

.worker-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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

/* Attendance Table */
.attendance-content,
.performance-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.attendance-header,
.performance-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.attendance-title h2,
.performance-header h2 {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.download-btn {
  background: #4caf50;
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

.download-btn:hover {
  background: #43a047;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.attendance-table,
.performance-table {
  background: white;
  border-radius: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header,
.perf-table-header {
  display: grid;
  grid-template-columns: 0.5fr 3fr 1fr;
  background: #4facfe;
  color: white;
  font-weight: bold;
  padding: 15px 20px;
  text-transform: uppercase;
}

.attendance-table .table-body {
  max-height: 400px;
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 0.5fr 3fr 1fr;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
}

.table-row:last-child {
  border-bottom: none;
}

.table-col {
  color: #333;
  font-size: 0.9rem;
}

.attendance-checkbox-container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.attendance-checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #eee;
  border-radius: 5px;
}

.attendance-checkbox-container:hover input ~ .checkmark {
  background-color: #ccc;
}

.attendance-checkbox-container input:checked ~ .checkmark {
  background-color: #4caf50;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.attendance-checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.attendance-checkbox-container .checkmark:after {
  left: 7px;
  top: 3px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

.status-text {
  font-weight: bold;
  margin-left: 10px;
}

/* Performance Table */
.time-filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.time-filter {
  background: rgba(255, 255, 255, 0.8);
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  color: #666;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.time-filter:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.time-filter.active {
  background: #4facfe;
  color: white;
}

.performance-table .perf-table-header {
  grid-template-columns: 0.5fr 2fr 1fr 1fr 1fr;
}

.performance-table .perf-table-body {
  max-height: 400px; 
  overflow-y: auto;
}

.perf-table-row {
  display: grid;
  grid-template-columns: 0.5fr 2fr 1fr 1fr 1fr;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
}

.perf-table-row:last-child {
  border-bottom: none;
}

.perf-col {
  color: #333;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  font-weight: bold;
  color: white;
  font-size: 0.8rem;
}

.rank-badge.gold {
  background: #ffc107;
}

.rank-badge.silver {
  background: #c0c0c0;
}

.rank-badge.bronze {
  background: #cd7f32;
}

.rank-badge.default {
  background: #a5d6a7;
}

.trend {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-weight: bold;
}

.trend.positive {
  color: #4caf50;
}

.trend.negative {
  color: #f44336;
}

.trend.neutral {
  color: #9e9e9e;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: bold;
  color: white;
  text-transform: uppercase;
}

.status-badge.active {
  background-color: #2196f3;
}

.status-badge.inactive {
  background-color: #f44336;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header-light {
  background: linear-gradient(135deg, #bbdefb 0%, #e3f2fd 100%);
  color: #333;
  padding: 20px;
  border-radius: 20px 20px 0 0;
  text-align: center;
  font-weight: bold;
  font-size: 1.5rem;
  border-bottom: 2px solid #a5d6a7;
}

.worker-form {
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
.form-select {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #f9f9f9;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}

.add-btn {
  background: #4caf50;
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
}

.add-btn:hover {
  background: #43a047;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.cancel-btn {
  background: #f44336;
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #e53935;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}
</style>