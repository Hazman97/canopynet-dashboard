<template>
  <div class="p-4 bg-yellow-50 min-h-screen">
    <h1 class="text-3xl font-bold text-center text-blue-800 mb-4">Task Time!</h1>
    <p class="text-center text-brown-800 font-medium mb-6">
      Drag a task from the left and drop it onto a worker on the right to assign it!
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Available Tasks -->
      <div class="bg-orange-100 p-4 rounded-xl shadow-md">
        <h2 class="text-2xl font-bold mb-4 text-center">Available Tasks</h2>
        <div class="space-y-4">
          <div
            v-for="task in tasks"
            :key="task.id"
            class="cursor-move p-4 bg-orange-200 hover:bg-orange-300 rounded-xl flex items-center gap-2 font-bold text-lg"
            draggable="true"
            @dragstart="dragTask(task)"
          >
            <span class="text-xl">{{ task.icon }}</span> {{ task.name }}
          </div>
        </div>
      </div>

      <!-- Farm Crew -->
      <div class="bg-blue-50 p-4 rounded-xl shadow-md">
        <h2 class="text-2xl font-bold mb-4 text-center text-blue-700">Farm Crew</h2>
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="worker in workers"
            :key="worker.id"
            class="p-4 bg-blue-100 rounded-xl flex flex-col items-center"
            @drop="assignTask(worker)"
            @dragover.prevent
          >
            <span class="text-3xl">🧑‍🌾</span>
            <p class="text-lg font-bold text-center">{{ worker.name }}</p>
            <div class="mt-2 p-2 w-full text-center bg-white rounded-md border border-dashed border-gray-400">
              <span v-if="worker.task">{{ worker.task.icon }} {{ worker.task.name }}</span>
              <span v-else class="text-gray-500">Idle</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Nav -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around py-2">
      <router-link to="/dashboard" class="flex flex-col items-center text-sm text-green-700">
        <img src="@/assets/house.png" class="w-8 mb-1" />
        Home
      </router-link>
      <router-link to="/tasks" class="flex flex-col items-center text-sm text-red-700 font-bold">
        <img src="@/assets/task.png" class="w-8 mb-1" />
        Tasks
      </router-link>
      <router-link to="/crew" class="flex flex-col items-center text-sm text-yellow-700">
        <img src="@/assets/crew.png" class="w-8 mb-1" />
        Crew
      </router-link>
      <router-link to="/map" class="flex flex-col items-center text-sm text-blue-700">
        <img src="@/assets/map.png" class="w-8 mb-1" />
        Map
      </router-link>
      <router-link to="/assets" class="flex flex-col items-center text-sm text-brown-700">
        <img src="@/assets/tractor.png" class="w-8 mb-1" />
        Assets
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tasks: [
        { id: 1, name: 'Water Plants', icon: '💧' },
        { id: 2, name: 'Harvest Fruit', icon: '🥭' },
        { id: 3, name: 'Prune Trees', icon: '✂️' },
        { id: 4, name: 'Plant Seeds', icon: '🌱' },
        { id: 5, name: 'Fix Fence', icon: '🔧' }
      ],
      workers: [
        { id: 1, name: 'Andy', task: null },
        { id: 2, name: 'Betty', task: null },
        { id: 3, name: 'Carl', task: null },
        { id: 4, name: 'Diana', task: null },
        { id: 5, name: 'Evan', task: null },
        { id: 6, name: 'Fiona', task: null },
        { id: 7, name: 'George', task: null },
        { id: 8, name: 'Hannah', task: null }
      ],
      draggedTask: null
    };
  },
  methods: {
    dragTask(task) {
      this.draggedTask = task;
    },
    assignTask(worker) {
      worker.task = this.draggedTask;
      this.draggedTask = null;
    }
  }
};
</script>

<style scoped>
.text-brown-800 {
  color: #8B4513;
}
</style>