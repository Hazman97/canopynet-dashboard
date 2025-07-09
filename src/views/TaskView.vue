<template>
  <div class="p-6 bg-gray-100 min-h-screen">

    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Task Assignment & Management</h1>
        <p class="text-gray-600">Comprehensive task management for palm oil plantation operations</p>
      </div>
      <button
        @click="showCreateTaskModal = true"
        class="bg-green-600 text-white px-5 py-2 rounded-lg flex items-center shadow-md hover:bg-green-700 transition-colors"
      >
        <i class="bx bx-plus mr-2 text-xl"></i>
        <span>Create Task</span>
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-5 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Total Tasks</p>
          <p class="text-3xl font-bold text-gray-800">{{ totalTasks }}</p>
        </div>
        <i class="bx bx-notepad text-4xl text-gray-400"></i>
      </div>

      <div class="bg-white p-5 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Pending</p>
          <p class="text-3xl font-bold text-gray-800">{{ pendingTasks }}</p>
        </div>
        <i class="bx bx-time text-4xl text-gray-400"></i>
      </div>

      <div class="bg-white p-5 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">In Progress</p>
          <p class="text-3xl font-bold text-gray-800">{{ inProgressTasks }}</p>
        </div>
        <i class="bx bx-trending-up text-4xl text-gray-400"></i>
      </div>

      <div class="bg-white p-5 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Completed</p>
          <p class="text-3xl font-bold text-gray-800">{{ completedTasks }}</p>
        </div>
        <i class="bx bx-check-circle text-4xl text-green-500"></i>
      </div>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-md">

      <div class="flex border-b border-gray-200 mb-6">
        <button
          @click="activeTab = 'cards'"
          :class="{'text-blue-600 border-b-2 border-blue-600 font-medium': activeTab === 'cards', 'text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-600': activeTab !== 'cards'}"
          class="px-4 py-2 transition-colors"
        >Task Cards</button>
        <button
          @click="activeTab = 'report'"
          :class="{'text-blue-600 border-b-2 border-blue-600 font-medium': activeTab === 'report', 'text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-600': activeTab !== 'report'}"
          class="px-4 py-2 transition-colors"
        >Task Report</button>
      </div>
      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <div class="relative flex-grow">
          <input
            type="text"
            placeholder="Search tasks..."
            v-model="searchQuery"
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <i class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
        <select v-model="selectedStatus" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Paused">Paused</option>
          <option value="Completed">Completed</option>
        </select>
        <select v-model="selectedType" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Types</option>
          <option value="Checking">Checking</option>
          <option value="Pruning">Pruning</option>
          <option value="Harvesting">Harvesting</option>
          <option value="Collecting">Collecting</option>
          <option value="Transporting">Transporting</option>
          <option value="Manuring">Manuring</option>
          <option value="Weeding">Weeding</option>
          <option value="Pest Control">Pest Control</option>
          <option value="Mechanisation">Mechanisation</option>
        </select>
        <select v-model="selectedPriority" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>
      </div>
      <div v-if="activeTab === 'cards'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="bg-white border border-gray-200 rounded-lg shadow-sm p-6"
        >
          <div class="flex justify-between items-center mb-3">
            <div class="flex items-center space-x-2">
              <span
                :class="getTaskTypeColor(task.type)"
                class="text-xs font-semibold px-2.5 py-0.5 rounded-full"
              >{{ task.type }}</span>
              <span
                :class="getPriorityColor(task.priority)"
                class="text-xs font-semibold px-2.5 py-0.5 rounded-full"
              >{{ task.priority.toUpperCase() }}</span>
            </div>
            <span
              :class="getStatusColor(task.status)"
              class="text-white text-xs font-semibold px-2.5 py-0.5 rounded-full"
            >{{ task.status.toUpperCase() }}</span>
          </div>

          <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ task.title }}</h3>
          <p class="text-gray-600 text-sm mb-4">{{ task.description }}</p>
          <p class="text-gray-500 text-xs mb-4">Task #{{ task.id }} • {{ task.gangNo ? 'Gang ' + task.gangNo : 'N/A' }} • Block {{ task.blockNo || 'N/A' }}</p>

          <div class="mb-4">
            <p class="text-sm font-medium text-gray-700 mb-1">Progress</p>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div class="bg-green-500 h-2.5 rounded-full" :style="{ width: task.progress + '%' }"></div>
            </div>
            <p class="text-right text-sm text-gray-600 mt-1">{{ task.progress }}%</p>
          </div>

          <div class="space-y-2 text-sm text-gray-700 mb-6">
            <p v-if="task.targetArea" class="flex items-center"><i class="bx bx-map mr-2"></i> Area: {{ task.targetArea }}</p>
            <p class="flex items-center"><i class="bx bx-calendar mr-2"></i> Duration: {{ task.startDate }} - {{ task.endDate }}</p>
            <p v-if="task.estimatedDuration" class="flex items-center"><i class="bx bx-time mr-2"></i> Est. Time: {{ task.estimatedDuration }}h</p>
            <p v-if="task.workDivision" class="flex items-center"><i class="bx bx-category mr-2"></i> Division: <span class="font-semibold">{{ task.workDivision }}</span></p>
            <p v-if="task.areaCovered" class="flex items-center"><i class="bx bx-grid-alt mr-2"></i> Area: <span class="font-semibold">{{ task.areaCovered }} ha</span></p>
            <p v-if="task.tonnage" class="flex items-center"><i class="bx bx-box mr-2"></i> Tonnage: <span class="font-semibold">{{ task.tonnage }}</span></p>
            <p v-if="task.bunchCount" class="flex items-center"><i class="bx bx-box mr-2"></i> Bunches: <span class="font-semibold">{{ task.bunchCount }}</span></p>
            <p v-if="task.assignedWorkers && task.assignedWorkers.length" class="flex items-center"><i class="bx bx-user mr-2"></i> Workers: <span class="font-semibold">{{ task.assignedWorkers.map(w => w.name).join(', ') }}</span></p>
            <p v-if="task.assignedAssets && task.assignedAssets.length" class="flex items-center"><i class="bx bx-truck mr-2"></i> Assets: <span class="font-semibold">{{ task.assignedAssets.map(a => a.name).join(', ') }}</span></p>
          </div>

          <div v-if="task.requirements && task.requirements.length" class="mb-6">
            <p class="text-sm font-medium text-gray-700 mb-2">Requirements:</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(req, index) in task.requirements"
                :key="index"
                class="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
              >{{ req }}</span>
            </div>
          </div>
          <p v-if="task.notes" class="text-sm text-gray-700 mb-4">Notes: {{ task.notes }}</p>


          <div class="flex justify-end space-x-3">
            <button
              v-if="task.status === 'In Progress'"
              @click="updateTaskStatus(task.id, 'Paused')"
              class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg flex items-center hover:bg-gray-300 transition-colors"
            >
              <i class="bx bx-pause mr-2"></i> Pause
            </button>
            <button
              v-if="task.status === 'Pending'"
              @click="updateTaskStatus(task.id, 'In Progress')"
              class="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors"
            >
              <i class="bx bx-play mr-2"></i> Start
            </button>
             <button
              v-if="task.status === 'In Progress' || task.status === 'Paused'"
              @click="updateTaskStatus(task.id, 'Completed')"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
            >
              <i class="bx bx-check mr-2"></i> Complete
            </button>
            <button @click="editTask(task)" class="text-gray-500 hover:text-gray-700"><i class="bx bx-edit text-xl"></i></button>
            <button @click="deleteTask(task.id)" class="text-gray-500 hover:text-gray-700"><i class="bx bx-trash text-xl"></i></button>
          </div>
        </div>
      </div>
      <div v-else-if="activeTab === 'report'">
        <p class="text-gray-600 text-center py-10">Task Report content will go here.</p>
      </div>
      <div v-else-if="filteredTasks.length === 0" class="text-center py-10 text-gray-500">
        No tasks found matching your criteria.
      </div>
      </div>
    <CreateTaskModal
      :show="showCreateTaskModal"
      :areas="availableAreas"
      :workers="availableWorkers"
      :assets="availableAssets"
      @close="showCreateTaskModal = false"
      @create-task="handleCreateTask"
    />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import CreateTaskModal from '@/components/CreateTaskModal.vue'; // Import the new modal component

// Reactive state variables
const showCreateTaskModal = ref(false); // Controls the visibility of the create task modal
const activeTab = ref('cards'); // Controls which tab is active ('cards' or 'report')
const searchQuery = ref(''); // Stores the search input
const selectedStatus = ref(''); // Stores the selected status filter
const selectedType = ref(''); // Stores the selected type filter
const selectedPriority = ref(''); // Stores the selected priority filter

// Dummy data for available areas, workers, and assets (replace with actual data fetching)
const availableAreas = ref([
  { id: 'b1', name: 'Block 1', blockNo: '1' },
  { id: 'b2', name: 'Block 2', blockNo: '2' },
  { id: 'b3', name: 'Block 3', blockNo: '3' },
  { id: 'b4', name: 'Block 4', blockNo: '4' },
]);

const availableWorkers = ref([
  { id: 'w1', name: 'Ahmad Rahman', code: 'A001', gangNo: 'Gang 3' },
  { id: 'w2', name: 'Siti Nurhaiza', code: 'A002', gangNo: 'Gang 2' },
  { id: 'w3', name: 'John Smith', code: 'M001', gangNo: 'Gang 1' },
]);

const availableAssets = ref([
  { id: 'a1', name: 'M8052 (tractor)', code: 'M8052', type: 'tractor' },
  { id: 'a2', name: 'Transport Truck-01', code: 'T001', type: 'truck' },
  { id: 'a3', name: 'Sprayer-02', code: 'S002', type: 'sprayer' },
]);


// Initial dummy task data
const tasks = ref([
  {
    id: '1001',
    type: 'Checking',
    priority: 'High',
    status: 'In Progress',
    title: 'Palm Oil Bunch Checking - Block 1',
    description: "Inspect palm trees for ripe FFB's with bright orange fruitlets",
    gangNo: '3',
    blockNo: 'A-12',
    progress: 65,
    targetArea: 'Block 1',
    startDate: '2024-01-15',
    endDate: '2024-01-15',
    estimatedDuration: 4,
    workDivision: 'Harvesting',
    areaCovered: 2.5,
    bunchCount: 45,
    assignedWorkers: [{ id: 'w1', name: 'Ahmad Rahman', code: 'A001', gangNo: 'Gang 3' }],
    requirements: ['Visual inspection skills', 'Knowledge of ripeness indications', 'Safety equipment'],
    notes: ''
  },
  {
    id: '1002',
    type: 'Transporting',
    priority: 'Urgent',
    status: 'Pending',
    title: 'FFB Transportation to Mill',
    description: 'Transport harvested FFB to processing mill within 24 hours',
    gangNo: '2',
    blockNo: 'B-8',
    progress: 0,
    targetArea: 'Block 2',
    startDate: '2024-01-16',
    endDate: '2024-01-16',
    estimatedDuration: 4,
    workDivision: 'Mechanisation Fleet',
    assignedWorkers: [{ id: 'w3', name: 'John Smith', code: 'M001', gangNo: 'Gang 1' }],
    assignedAssets: [{ id: 'a2', name: 'Transport Truck-01', code: 'T001', type: 'truck' }],
    requirements: ['Transport vehicle', 'Loading equipment', 'Documentation'],
    notes: ''
  },
]);

// Computed properties for task statistics (for the cards at the top)
const totalTasks = computed(() => tasks.value.length);
const pendingTasks = computed(() => tasks.value.filter(task => task.status === 'Pending').length);
const inProgressTasks = computed(() => tasks.value.filter(task => task.status === 'In Progress').length);
const completedTasks = computed(() => tasks.value.filter(task => task.status === 'Completed').length);

// Computed property for filtered tasks based on search and filters
const filteredTasks = computed(() => {
  let filtered = tasks.value;

  // Apply search query filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(task =>
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      task.id.includes(query)
    );
  }

  // Apply status filter
  if (selectedStatus.value) {
    filtered = filtered.filter(task => task.status === selectedStatus.value);
  }

  // Apply type filter
  if (selectedType.value) {
    filtered = filtered.filter(task => task.type === selectedType.value);
  }

  // Apply priority filter
  if (selectedPriority.value) {
    filtered = filtered.filter(task => task.priority === selectedPriority.value);
  }

  return filtered;
});

// Function to handle the creation of a new task from the modal
const handleCreateTask = (newTaskData) => {
  // Generate a simple unique ID for the new task
  const newId = (parseInt(tasks.value[tasks.value.length - 1]?.id || '1000') + 1).toString();

  tasks.value.push({
    id: newId,
    progress: 0, // New tasks start at 0% progress
    ...newTaskData, // Spread all data received from the modal
  });
  showCreateTaskModal.value = false; // Close the modal
};

// Function to delete a task
const deleteTask = (idToDelete) => {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks.value = tasks.value.filter(task => task.id !== idToDelete);
  }
};

// Function to update task status
const updateTaskStatus = (id, newStatus) => {
  const taskIndex = tasks.value.findIndex(task => task.id === id);
  if (taskIndex !== -1) {
    tasks.value[taskIndex].status = newStatus;
    // Optionally update progress for completed tasks
    if (newStatus === 'Completed') {
      tasks.value[taskIndex].progress = 100;
    }
  }
};

// Function to handle editing (placeholder for now)
const editTask = (task) => {
  alert(`Edit Task: ${task.title}. This will open the modal with pre-filled data.`);
  // In a real app, you'd populate the modal's form with `task` data
  // showCreateTaskModal.value = true;
  // modalFormData.value = { ...task }; // Or similar
};


// Helper functions for dynamic tag colors
const getTaskTypeColor = (type) => {
  switch (type) {
    case 'Checking': return 'bg-blue-100 text-blue-700';
    case 'Pruning': return 'bg-purple-100 text-purple-700';
    case 'Harvesting': return 'bg-yellow-100 text-yellow-700';
    case 'Collecting': return 'bg-indigo-100 text-indigo-700';
    case 'Transporting': return 'bg-teal-100 text-teal-700';
    case 'Manuring': return 'bg-lime-100 text-lime-700';
    case 'Weeding': return 'bg-emerald-100 text-emerald-700';
    case 'Pest Control': return 'bg-rose-100 text-rose-700';
    case 'Mechanisation': return 'bg-cyan-100 text-cyan-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Low': return 'bg-green-100 text-green-700';
    case 'Medium': return 'bg-yellow-100 text-yellow-700';
    case 'High': return 'bg-red-100 text-red-700';
    case 'Urgent': return 'bg-orange-100 text-orange-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending': return 'bg-gray-400';
    case 'In Progress': return 'bg-blue-500';
    case 'Paused': return 'bg-yellow-500';
    case 'Completed': return 'bg-green-500';
    default: return 'bg-gray-400';
  }
};
</script>

<style scoped>
/* Any component-specific styles go here.
   Tailwind CSS handles most styling, so custom styles might be minimal. */
</style>