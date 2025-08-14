<template>
  <div class="farm-workers-container">
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <h1 class="main-title">Task Time!</h1>
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
            v-model="searchQuery"
            type="text"
            placeholder="Search"
            class="search-input"
          />
        </div>

        <div class="filter-buttons">
          <div class="relative">
            <select
              v-model="selectedStatus"
              class="filter-btn appearance-none"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Complete">Complete</option>
            </select>
          </div>

          <div class="relative">
            <select
              v-model="selectedTaskType"
              class="filter-btn appearance-none"
            >
              <option value="">All Task Type</option>
              <option v-for="type in taskTypes" :key="type.name" :value="type.name">
                {{ type.name }}
              </option>
            </select>
          </div>

          <button
            @click="openCreateModal"
            class="add-worker-btn"
          >
            <span class="plus-icon">+</span>
            Create New Task
          </button>
        </div>
      </div>

      <div class="workers-grid">
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="worker-card"
          :class="getTaskStatusClass(task.status)"
        >
          <div class="worker-info">
            <div class="worker-avatar">
              <img
                v-if="getTaskTypeIcon(task.type)"
                :src="getTaskTypeIcon(task.type)"
                class="w-8 h-8 object-contain"
                :alt="task.type"
              />
            </div>
            <div class="worker-details">
              <h3 class="worker-name">{{ task.name }}</h3>
              <p class="worker-id">ID: {{ task.taskId }}</p>
            </div>
          </div>
          <div class="worker-rating">
            <div class="stars">
              <span class="star filled">📅</span>
              <span class="text-sm text-gray-600">{{ task.date }}</span>
            </div>
          </div>
          <div class="progress-bar-container">
            <span class="text-sm font-medium">Progress:</span>
            <span class="text-sm font-bold">{{ task.progress }}%</span>
            <div class="progress-bar-bg">
              <div
                :class="getProgressBarClass(task.status)"
                :style="{ width: task.progress + '%' }"
                class="h-2 rounded-full transition-all duration-300"
              ></div>
            </div>
          </div>
          <div class="task-details">
            <div class="detail-item">
              <span class="detail-label">Status:</span>
              <span :class="getStatusBadgeClass(task.status)">{{ task.status }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Area:</span>
              <span>{{ task.area }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Workers:</span>
              <div class="workers-list">
                <p v-for="worker in task.workers" :key="worker">{{ worker }}</p>
              </div>
            </div>
            <div v-if="task.assets && task.assets.length > 0" class="detail-item">
              <span class="detail-label">Assets:</span>
              <div class="assets-list">
                <p v-for="asset in task.assets" :key="asset">{{ asset }}</p>
              </div>
            </div>
          </div>
          <div class="worker-actions">
            <button
              @click="editTask(task)"
              class="edit-btn"
              title="Edit Task"
            >
              ✏️
            </button>
            <button
              @click="deleteTask(task)"
              class="delete-btn"
              title="Delete Task"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="closeModal"
    >
      <div
        class="modal-content"
        @click.stop
      >
        <div class="modal-header">
          <h2>
            {{ isEditMode ? 'Edit Task' : 'Create New Task' }}
          </h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="modal-left-panel">
              <div v-if="currentModalView === 'taskTypes'">
                <h3 class="text-lg font-bold text-white mb-4">Task Type:</h3>
                <p class="text-white mb-4 text-sm">Drag and drop the task!</p>
                <div class="space-y-3">
                  <div
                    v-for="type in taskTypes"
                    :key="type.name"
                    class="modal-list-item"
                    @click="selectTaskType(type)"
                    draggable="true"
                    @dragstart="dragTaskType(type)"
                  >
                    <span class="text-2xl">
                      <img
                        :src="type.iconPath"
                        class="w-8 h-8 object-contain"
                        :alt="type.name"
                      />
                    </span>
                    <span class="font-bold">{{ type.name }}</span>
                  </div>
                </div>
              </div>

              <div v-else-if="currentModalView === 'phases'">
                <h3 class="text-lg font-bold text-white mb-4">Phase list:</h3>
                <p class="text-white mb-4 text-sm">Drag and drop the phases!</p>
                <div class="grid grid-cols-4 gap-3">
                  <div
                    v-for="phase in phases"
                    :key="phase"
                    class="modal-list-item-circle"
                    @click="selectPhase(phase)"
                    draggable="true"
                    @dragstart="dragPhase(phase)"
                  >
                    {{ phase }}
                  </div>
                </div>
              </div>

              <div v-else-if="currentModalView === 'blocks'">
                <h3 class="text-lg font-bold text-white mb-4">Block list:</h3>
                <p class="text-white mb-4 text-sm">Drag and drop the block!</p>
                <div class="grid grid-cols-4 gap-3">
                  <div
                    v-for="block in blocks"
                    :key="block"
                    class="modal-list-item-circle"
                    @click="selectBlock(block)"
                    draggable="true"
                    @dragstart="dragBlock(block)"
                  >
                    {{ block }}
                  </div>
                </div>
              </div>

              <div v-else-if="currentModalView === 'workers'">
                <h3 class="text-lg font-bold text-white mb-4">Workers list:</h3>
                <p class="text-white mb-4 text-sm">Drag and drop your workers!</p>
                <div class="space-y-3">
                  <div
                    v-for="worker in availableWorkers"
                    :key="worker.name"
                    class="modal-list-item"
                    @click="selectWorker(worker)"
                    draggable="true"
                    @dragstart="dragWorker(worker)"
                  >
                    <span class="text-2xl">
                      <img :src="crewIcon" class="w-8 h-8 object-contain" alt="worker icon" />
                    </span>
                    <span class="font-bold">{{ worker.name }}</span>
                  </div>
                </div>
              </div>

              <div v-else-if="currentModalView === 'assets'">
                <h3 class="text-lg font-bold text-white mb-4">Assets list:</h3>
                <p class="text-white mb-4 text-sm">Drag and drop your assets!</p>
                <div class="space-y-3">
                  <div
                    v-for="asset in availableAssets"
                    :key="asset.name"
                    class="modal-list-item"
                    @click="selectAsset(asset)"
                    draggable="true"
                    @dragstart="dragAsset(asset)"
                  >
                    <span class="text-2xl">
                      <img
                        :src="getAssetIcon(asset.type)"
                        class="w-8 h-8 object-contain"
                        :alt="asset.name"
                      />
                    </span>
                    <span class="font-bold">{{ asset.name }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-bold mb-2">Task ID:</label>
                <input
                  type="text"
                  :value="newTask.id"
                  class="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-500"
                  :placeholder="isEditMode ? newTask.taskId : 'Auto-generated'"
                  readonly
                />
              </div>
              <div>
                <label class="block text-sm font-bold mb-2">Task Title:</label>
                <input v-model="newTask.name" type="text" class="form-input" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold mb-2">Task Type:</label>
                  <div
                    class="form-input-drop-area"
                    @drop="dropTaskType"
                    @dragover.prevent
                    @click="currentModalView = 'taskTypes'"
                  >
                    <span v-if="newTask.type">{{ newTask.type }}</span>
                    <span v-else class="cursor-pointer">Drag and drop here!</span>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-bold mb-2">Start Date:</label>
                  <div class="relative">
                    <input v-model="newTask.date" type="date" class="form-input" />
                    <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                      <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label class="block text-sm font-bold mb-2">Target Area:</label>
                <div class="flex gap-2">
                  <div
                    class="form-input-drop-area"
                    @drop="dropPhase"
                    @dragover.prevent
                    @click="currentModalView = 'phases'"
                  >
                    <span v-if="newTask.phase">Phase {{ newTask.phase }}</span>
                    <span v-else>Drag the phases!</span>
                  </div>
                  <div
                    class="form-input-drop-area"
                    @drop="dropBlock"
                    @dragover.prevent
                    @click="currentModalView = 'blocks'"
                  >
                    <span v-if="newTask.block">Block {{ newTask.block }}</span>
                    <span v-else>Drag the block!</span>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold mb-2">Assigned Workers:</label>
                  <div class="form-input-drop-area min-h-[100px]" @drop="dropWorker" @dragover.prevent @click="currentModalView = 'workers'">
                    <div v-if="newTask.workers.length">
                      <p v-for="worker in newTask.workers" :key="worker.name" class="text-sm">{{ worker.name }}</p>
                    </div>
                    <span v-else class="cursor-pointer">Drag and drop workers here!</span>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-bold mb-2">Assigned Assets:</label>
                  <div class="form-input-drop-area min-h-[100px]" @drop="dropAsset" @dragover.prevent @click="currentModalView = 'assets'">
                    <div v-if="newTask.assets.length">
                      <p v-for="asset in newTask.assets" :key="asset.name" class="text-sm">{{ asset.name }}</p>
                    </div>
                    <span v-else class="cursor-pointer">Drag and drop assets here!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-6">
            <button
              @click="closeModal"
              class="cancel-btn"
            >
              Cancel
            </button>
            <button
              @click="saveTask"
              class="add-btn"
            >
              {{ isEditMode ? 'Save Changes' : 'Create Task' }}
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
      <div @click="$router.push('/game-tasks')" class="flex flex-col items-center text-yellow-700 font-bold">
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
      <div @click="$router.push('/game-assets')" class="flex flex-col items-center cursor-pointer hover:text-black-700 transition">
        <img src="@/assets/tractor.png" class="w-8 mb-1" alt="Assets" />
        <span class="text-sm">Assets</span>
      </div>
    </div>
  </div>
</template>

<script>
import TaskIcon from '@/assets/task.png';
import CrewIcon from '@/assets/crew.png';
import TractorIcon from '@/assets/tractor.png';
import CowIcon from '@/assets/cow.png';

export default {
  name: 'GameTaskView',
  data() {
    return {
      searchQuery: '',
      selectedStatus: '',
      selectedTaskType: '',
      tasks: [
        { id: 1, taskId: '#T001', name: 'Planting Season', type: 'Planting', area: 'Phase 1 - Block 1', date: '2024-08-01', status: 'In Progress', progress: 50, workers: ['Farah Nabila'], assets: ['Tractor A'] },
        { id: 2, taskId: '#T002', name: 'Livestock Feeding', type: 'Livestock', area: 'Phase 1 - Block 2', date: '2024-08-05', status: 'Pending', progress: 0, workers: ['Hadyna Redwani'], assets: ['Cow Feed'] },
        { id: 3, taskId: '#T003', name: 'Harvesting Corn', type: 'Harvesting', area: 'Phase 2 - Block 3', date: '2024-08-10', status: 'Complete', progress: 100, workers: ['Farah Nabila', 'Fatini Zahirah'], assets: ['Harvesting Machine'] },
        { id: 4, taskId: '#T004', name: 'Maintenance Check', type: 'Maintenance', area: 'Phase 2 - Block 4', date: '2024-08-12', status: 'Pending', progress: 0, workers: ['Izzatul Hanan'], assets: ['Tool Kit'] },
      ],
      taskTypes: [
        { name: 'Planting', iconPath: TaskIcon },
        { name: 'Harvesting', iconPath: TaskIcon },
        { name: 'Livestock', iconPath: CowIcon },
        { name: 'Maintenance', iconPath: TractorIcon },
        { name: 'General', iconPath: TaskIcon },
      ],
      availableWorkers: [
        { name: 'Farah Nabila', iconPath: CrewIcon },
        { name: 'Fatini Zahirah', iconPath: CrewIcon },
        { name: 'Hadyna Redwani', iconPath: CrewIcon },
        { name: 'Izzatul Hanan', iconPath: CrewIcon },
      ],
      availableAssets: [
        { name: 'Tractor A', type: 'Tractor', iconPath: TractorIcon },
        { name: 'Cow Feed', type: 'Feed', iconPath: CowIcon },
        { name: 'Harvesting Machine', type: 'Machine', iconPath: TractorIcon },
        { name: 'Tool Kit', type: 'Tool', iconPath: TaskIcon },
      ],
      phases: ['1', '2', '3', '4'],
      blocks: ['1', '2', '3', '4'],
      showCreateModal: false,
      isEditMode: false,
      newTask: {
        id: null,
        taskId: '',
        name: '',
        type: null,
        area: '',
        date: '',
        status: 'Pending',
        progress: 0,
        workers: [],
        assets: [],
        phase: null,
        block: null
      },
      editingTask: null,
      currentModalView: 'taskTypes',
      crewIcon: CrewIcon,
    };
  },
  computed: {
    filteredTasks() {
      let filtered = this.tasks;

      if (this.selectedStatus) {
        filtered = filtered.filter(task => task.status === this.selectedStatus);
      }
      if (this.selectedTaskType) {
        filtered = filtered.filter(task => task.type === this.selectedTaskType);
      }
      if (this.searchQuery) {
        filtered = filtered.filter(task =>
          task.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          task.taskId.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      return filtered;
    }
  },
  methods: {
    logout() {
      if (confirm('Are you sure you want to log out?')) {
        console.log('Logging out...');
      }
    },
    openCreateModal() {
      this.isEditMode = false;
      this.resetNewTask();
      this.showCreateModal = true;
    },
    editTask(task) {
      this.isEditMode = true;
      this.editingTask = task;
      this.newTask = { ...task };
      const [phase, block] = task.area.replace('Phase ', '').split(' - Block ');
      this.newTask.phase = phase;
      this.newTask.block = block;
      this.newTask.workers = task.workers.map(name => ({ name }));
      this.newTask.assets = task.assets.map(name => {
        const asset = this.availableAssets.find(a => a.name === name);
        return { name, type: asset ? asset.type : '' };
      });
      this.showCreateModal = true;
    },
    saveTask() {
      if (this.isEditMode) {
        const index = this.tasks.findIndex(t => t.id === this.editingTask.id);
        if (index !== -1) {
          const updatedTask = {
            ...this.newTask,
            area: `Phase ${this.newTask.phase} - Block ${this.newTask.block}`,
            workers: this.newTask.workers.map(w => w.name),
            assets: this.newTask.assets.map(a => a.name)
          };
          this.tasks.splice(index, 1, updatedTask);
          alert('Task updated successfully!');
        }
      } else {
        const newId = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1;
        const newTaskId = `#T${String(newId).padStart(3, '0')}`;
        const finalNewTask = {
          ...this.newTask,
          id: newId,
          taskId: newTaskId,
          area: `Phase ${this.newTask.phase} - Block ${this.newTask.block}`,
          workers: this.newTask.workers.map(w => w.name),
          assets: this.newTask.assets.map(a => a.name)
        };
        this.tasks.push(finalNewTask);
        alert('New task created successfully!');
      }
      this.closeModal();
    },
    deleteTask(taskToDelete) {
      if (confirm(`Are you sure you want to delete task "${taskToDelete.name}"?`)) {
        this.tasks = this.tasks.filter(task => task.id !== taskToDelete.id);
        alert('Task deleted successfully!');
      }
    },
    closeModal() {
      this.showCreateModal = false;
      this.resetNewTask();
    },
    resetNewTask() {
      this.newTask = {
        id: null,
        taskId: '',
        name: '',
        type: null,
        area: '',
        date: '',
        status: 'Pending',
        progress: 0,
        workers: [],
        assets: [],
        phase: null,
        block: null
      };
      this.editingTask = null;
      this.currentModalView = 'taskTypes';
    },
    getTaskTypeIcon(type) {
      const taskType = this.taskTypes.find(t => t.name === type);
      return taskType ? taskType.iconPath : '';
    },
    getStatusBadgeClass(status) {
      switch (status) {
        case 'Pending':
          return 'status-badge pending';
        case 'In Progress':
          return 'status-badge in-progress';
        case 'Complete':
          return 'status-badge complete';
        default:
          return 'status-badge';
      }
    },
    getTaskStatusClass(status) {
      switch (status) {
        case 'Pending':
          return 'on-break';
        case 'In Progress':
          return 'active';
        case 'Complete':
          return 'complete';
        default:
          return 'default';
      }
    },
    getProgressBarClass(status) {
      switch (status) {
        case 'Pending':
          return 'bg-gray-400';
        case 'In Progress':
          return 'bg-blue-500';
        case 'Complete':
          return 'bg-green-500';
        default:
          return 'bg-gray-400';
      }
    },
    getStatusTextClass(status) {
      switch (status) {
        case 'Pending':
          return 'bg-gray-200 text-gray-700';
        case 'In Progress':
          return 'bg-blue-100 text-blue-700';
        case 'Complete':
          return 'bg-green-100 text-green-700';
        default:
          return 'bg-gray-200 text-gray-700';
      }
    },
    getAssetIcon(assetType) {
      if (assetType === 'Tractor') return TractorIcon;
      if (assetType === 'Cow Feed') return CowIcon;
      if (assetType === 'Machine') return TractorIcon;
      return TaskIcon;
    },
    dragTaskType(type) {
      this.draggedItem = type;
    },
    dropTaskType() {
      if (this.draggedItem) {
        this.newTask.type = this.draggedItem.name;
        this.draggedItem = null;
      }
    },
    dragPhase(phase) {
      this.draggedItem = phase;
    },
    dropPhase() {
      if (this.draggedItem) {
        this.newTask.phase = this.draggedItem;
        this.draggedItem = null;
      }
    },
    dragBlock(block) {
      this.draggedItem = block;
    },
    dropBlock() {
      if (this.draggedItem) {
        this.newTask.block = this.draggedItem;
        this.draggedItem = null;
      }
    },
    dragWorker(worker) {
      this.draggedItem = worker;
    },
    dropWorker() {
      if (this.draggedItem && !this.newTask.workers.some(w => w.name === this.draggedItem.name)) {
        this.newTask.workers.push(this.draggedItem);
        this.draggedItem = null;
      }
    },
    dragAsset(asset) {
      this.draggedItem = asset;
    },
    dropAsset() {
      if (this.draggedItem && !this.newTask.assets.some(a => a.name === this.draggedItem.name)) {
        this.newTask.assets.push(this.draggedItem);
        this.draggedItem = null;
      }
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

.worker-card.complete {
  border-color: #00bcd4;
  background: linear-gradient(135deg, #b2ebf2 0%, #80deea 100%);
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

.worker-rating {
  margin-bottom: 15px;
}

.stars {
  display: flex;
  align-items: center;
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

.progress-bar-container {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.progress-bar-container > * {
  margin-bottom: 5px;
}

.progress-bar-bg {
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 9999px;
  height: 8px;
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
}

.status-badge.pending {
  background-color: #ff9800;
}

.status-badge.in-progress {
  background-color: #2196f3;
}

.status-badge.complete {
  background-color: #4caf50;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

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

.modal-list-item-circle {
  background: white;
  color: #333;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
}

.modal-list-item-circle:hover {
  background: #f0f0f0;
}

.form-input {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.form-input-drop-area {
  background: #f8f8f8;
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  color: #999;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.add-btn {
  background: #4caf50;
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
}

.cancel-btn {
  background: #f44336;
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
}
</style>