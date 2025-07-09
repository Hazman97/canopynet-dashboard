<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all scale-100 opacity-100 md:scale-100 md:opacity-100">
      <div class="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
        <h2 class="text-2xl font-semibold text-gray-800">Create New Task</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <i class="bx bx-x text-3xl"></i>
        </button>
      </div>

      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-700 mb-4">Task Type Templates</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 mb-8">
          <button
            v-for="taskType in taskTypes"
            :key="taskType.name"
            @click="newTask.type = taskType.name"
            :class="{ 'bg-blue-600 text-white': newTask.type === taskType.name, 'bg-gray-100 text-gray-700 hover:bg-gray-200': newTask.type !== taskType.name }"
            class="flex flex-col items-center p-3 rounded-lg text-sm transition-colors duration-200"
          >
            <i :class="[taskType.icon, 'text-2xl mb-1']"></i>
            <span>{{ taskType.name }}</span>
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-1">
            <h3 class="text-lg font-medium text-gray-700 mb-4">Basic Information</h3>
            <div class="space-y-4">
              <div>
                <label for="taskTitle" class="block text-sm font-medium text-gray-700">Task Title</label>
                <input type="text" id="taskTitle" v-model="newTask.title" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="description" v-model="newTask.description" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="taskNo" class="block text-sm font-medium text-gray-700">Task No</label>
                  <input type="text" id="taskNo" v-model="newTask.id" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Auto-generated or Manual">
                </div>
                <div>
                  <label for="gangNo" class="block text-sm font-medium text-gray-700">Gang No</label>
                  <input type="text" id="gangNo" v-model="newTask.gangNo" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
              </div>
              <div>
                <label for="priority" class="block text-sm font-medium text-gray-700">Priority</label>
                <select id="priority" v-model="newTask.priority" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                <select id="status" v-model="newTask.status" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Paused">Paused</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          <div class="lg:col-span-1">
            <h3 class="text-lg font-medium text-gray-700 mb-4">Assignment & Location</h3>
            <div class="space-y-4">
              <div>
                <label for="targetArea" class="block text-sm font-medium text-gray-700">Target Area</label>
                <select id="targetArea" v-model="newTask.targetArea" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select Area</option>
                  <option v-for="area in areas" :key="area.id" :value="area.name">{{ area.name }}</option>
                </select>
              </div>
              <div>
                <label for="blockNo" class="block text-sm font-medium text-gray-700">Block No</label>
                <input type="text" id="blockNo" v-model="newTask.blockNo" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label for="workDivision" class="block text-sm font-medium text-gray-700">Work Division</label>
                <input type="text" id="workDivision" v-model="newTask.workDivision" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label for="workNature" class="block text-sm font-medium text-gray-700">Work Nature</label>
                <input type="text" id="workNature" v-model="newTask.workNature" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label for="assignedWorkers" class="block text-sm font-medium text-gray-700">Assigned Workers</label>
                <select multiple id="assignedWorkers" v-model="newTask.assignedWorkers" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-24 focus:ring-blue-500 focus:border-blue-500">
                  <option v-for="worker in workers" :key="worker.id" :value="worker">{{ worker.name }} ({{ worker.code }}) - {{ worker.gangNo }}</option>
                </select>
              </div>
              <div>
                <label for="assignedAssets" class="block text-sm font-medium text-gray-700">Assigned Assets</label>
                <select multiple id="assignedAssets" v-model="newTask.assignedAssets" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-24 focus:ring-blue-500 focus:border-blue-500">
                  <option v-for="asset in assets" :key="asset.id" :value="asset">{{ asset.name }} ({{ asset.type }})</option>
                </select>
              </div>
            </div>
          </div>

          <div class="lg:col-span-1">
            <h3 class="text-lg font-medium text-gray-700 mb-4">Scheduling & Metrics</h3>
            <div class="space-y-4">
              <div>
                <label for="startDate" class="block text-sm font-medium text-gray-700">Start Date</label>
                <input type="date" id="startDate" v-model="newTask.startDate" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label for="endDate" class="block text-sm font-medium text-gray-700">End Date</label>
                <input type="date" id="endDate" v-model="newTask.endDate" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label for="estimatedDuration" class="block text-sm font-medium text-gray-700">Estimated Duration (hours)</label>
                <input type="number" id="estimatedDuration" v-model="newTask.estimatedDuration" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label for="progress" class="block text-sm font-medium text-gray-700">Progress (%)</label>
                <input type="number" id="progress" v-model="newTask.progress" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label for="areaCovered" class="block text-sm font-medium text-gray-700">Area Covered (Ha)</label>
                <input type="number" id="areaCovered" v-model="newTask.areaCovered" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label for="tonnage" class="block text-sm font-medium text-gray-700">Tonnage (Tonne)</label>
                <input type="number" id="tonnage" v-model="newTask.tonnage" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label for="bunchCount" class="block text-sm font-medium text-gray-700">Bunch Count</label>
                <input type="number" id="bunchCount" v-model="newTask.bunchCount" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label for="gumnyNo" class="block text-sm font-medium text-gray-700">Gumny No</label>
                <input type="text" id="gumnyNo" v-model="newTask.gumnyNo" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 border-t pt-6 border-gray-200">
            <label for="requirements" class="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
            <div class="flex gap-2 mb-4">
                <input type="text" v-model="currentRequirement" placeholder="Add requirement..." class="flex-grow border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                <button @click="addRequirement" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Add</button>
            </div>
            <div class="flex flex-wrap gap-2">
                <span v-for="(req, index) in newTask.requirements" :key="index" class="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full flex items-center">
                    {{ req }}
                    <button @click="removeRequirement(index)" class="ml-2 text-red-500 hover:text-red-700">
                        <i class="bx bx-x text-sm"></i>
                    </button>
                </span>
            </div>
        </div>

        <div class="mt-6">
          <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
          <textarea id="notes" v-model="newTask.notes" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>
      </div>

      <div class="p-6 border-t border-gray-200 flex justify-end space-x-3 sticky bottom-0 bg-white z-10">
        <button @click="$emit('close')" class="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 transition-colors">
          Cancel
        </button>
        <button @click="submitTask" class="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors">
          Create Task
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
  show: Boolean, // Controls modal visibility
  areas: Array, // Prop for available areas
  workers: Array, // Prop for available workers
  assets: Array, // Prop for available assets
});

const emit = defineEmits(['close', 'create-task']);

// Initial state for a new task form
const initialNewTaskState = {
  id: '', // Will be generated or manually entered
  type: '',
  title: '',
  description: '',
  gangNo: '',
  blockNo: '',
  priority: 'Medium', // Default priority
  status: 'Pending', // Default status
  targetArea: '',
  startDate: new Date().toISOString().slice(0, 10), // Default to today's date
  endDate: new Date().toISOString().slice(0, 10), // Default to today's date
  estimatedDuration: null,
  progress: 0,
  areaCovered: null,
  tonnage: null,
  bunchCount: null,
  workDivision: '',
  workNature: '',
  assignedWorkers: [], // Array to hold selected worker objects
  assignedAssets: [],  // Array to hold selected asset objects
  requirements: [],    // Array to hold added requirements
  notes: '',
  gumnyNo: '' // Added the gumnyNo field
};

const newTask = ref({ ...initialNewTaskState }); // Reactive object for form data
const currentRequirement = ref(''); // For the single requirement input field

// List of all task types with their Boxicons
const taskTypes = ref([
  { name: 'Checking', icon: 'bx bx-show' },
  { name: 'Pruning', icon: 'bx bx-cut' },
  { name: 'Harvesting', icon: 'bx bx-spa' },
  { name: 'Collecting', icon: 'bx bx-cube' },
  { name: 'Transporting', icon: 'bx bxs-truck' }, // Corrected icon class
  { name: 'Manuring', icon: 'bx bx-fork' },
  { name: 'Weeding', icon: 'bx bx-leaf' },
  { name: 'Pest Control', icon: 'bx bx-bug' },
  { name: 'Mechanisation', icon: 'bx bx-bot' },
]);


// Reset form when modal is opened/closed
watch(() => props.show, (newVal) => {
  if (newVal) {
    // Reset form when modal opens
    Object.assign(newTask.value, initialNewTaskState);
    // Optionally auto-generate task ID here if needed, or leave blank for user input
  }
});

const addRequirement = () => {
  if (currentRequirement.value.trim() !== '') {
    newTask.value.requirements.push(currentRequirement.value.trim());
    currentRequirement.value = ''; // Clear input field
  }
};

const removeRequirement = (index) => {
  newTask.value.requirements.splice(index, 1);
};

// Handle form submission
const submitTask = () => {
  // Basic validation (you'll want more robust validation in a real app)
  if (!newTask.value.title || !newTask.value.type || !newTask.value.targetArea) {
    alert('Please fill in Task Title, Type, and Target Area.');
    return;
  }

  // Emit the new task data to the parent component (TaskView.vue)
  emit('create-task', { ...newTask.value });
};
</script>

<style scoped>
/* Scoped styles for the modal */
/* Custom scrollbar for webkit browsers */
.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>