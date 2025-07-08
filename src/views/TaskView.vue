<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Task Assignment & Management</h1>
        <p class="text-gray-600">Comprehensive task management for palm oil plantation operations</p>
      </div>
      <button class="bg-green-600 text-white px-5 py-2 rounded-lg flex items-center shadow-md hover:bg-green-700 transition-colors">
        <i class="bx bx-plus mr-2 text-xl"></i>
        <span>Create Task</span>
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-5 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Total Tasks</p>
          <p class="text-3xl font-bold text-gray-800">2</p>
        </div>
        <i class="bx bx-notepad text-4xl text-gray-400"></i>
      </div>

      <div class="bg-white p-5 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Pending</p>
          <p class="text-3xl font-bold text-gray-800">1</p>
        </div>
        <i class="bx bx-time text-4xl text-gray-400"></i>
      </div>

      <div class="bg-white p-5 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">In Progress</p>
          <p class="text-3xl font-bold text-gray-800">1</p>
        </div>
        <i class="bx bx-trending-up text-4xl text-gray-400"></i>
      </div>

      <div class="bg-white p-5 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Completed</p>
          <p class="text-3xl font-bold text-gray-800">0</p>
        </div>
        <i class="bx bx-check-circle text-4xl text-green-500"></i>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="flex border-b border-gray-200 mb-6">
        <button class="px-4 py-2 text-blue-600 border-b-2 border-blue-600 font-medium">Task Cards</button>
        <button class="px-4 py-2 text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-600 transition-colors">Task Report</button>
      </div>

      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <div class="relative flex-grow">
          <input
            type="text"
            placeholder="Search tasks..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <i class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
        <select class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Status</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <select class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Types</option>
          <option>Checking</option>
          <option>Transporting</option>
        </select>
        <select class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Priorities</option>
          <option>High</option>
          <option>Urgent</option>
          <option>Normal</option>
        </select>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-3">
            <div class="flex items-center space-x-2">
              <span class="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">Checking</span>
              <span class="bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">HIGH</span>
            </div>
            <span class="bg-blue-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">IN PROGRESS</span>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">Palm Oil Bunch Checking - Block 1</h3>
          <p class="text-gray-600 text-sm mb-4">Inspect palm trees for ripe FFB's with bright orange fruitlets</p>
          <p class="text-gray-500 text-xs mb-4">Task #1001 • Gang 3 • Block A-12</p>

          <div class="mb-4">
            <p class="text-sm font-medium text-gray-700 mb-1">Progress</p>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div class="bg-green-500 h-2.5 rounded-full" style="width: 65%"></div>
            </div>
            <p class="text-right text-sm text-gray-600 mt-1">65%</p>
          </div>

          <div class="space-y-2 text-sm text-gray-700 mb-6">
            <p class="flex items-center"><i class="bx bx-map mr-2"></i> Area: Block 1</p>
            <p class="flex items-center"><i class="bx bx-calendar mr-2"></i> Duration: 2024-01-15 - 2024-01-15</p>
            <p class="flex items-center"><i class="bx bx-time mr-2"></i> Est. Time: 4h</p>
            <p class="flex items-center"><i class="bx bx-category mr-2"></i> Division: <span class="font-semibold">Harvesting</span></p>
            <p class="flex items-center"><i class="bx bx-grid-alt mr-2"></i> Area: <span class="font-semibold">2.5 ha</span></p>
            <p class="flex items-center"><i class="bx bx-box mr-2"></i> Bunches: <span class="font-semibold">45</span></p>
            <p class="flex items-center"><i class="bx bx-user mr-2"></i> Workers: <span class="font-semibold">Ahmad Rahman</span></p>
          </div>

          <div class="mb-6">
            <p class="text-sm font-medium text-gray-700 mb-2">Requirements:</p>
            <div class="flex flex-wrap gap-2">
              <span class="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">Visual inspection skills</span>
              <span class="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">Knowledge of ripeness indications</span>
              <span class="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">Safety equipment</span>
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg flex items-center hover:bg-gray-300 transition-colors">
              <i class="bx bx-pause mr-2"></i> Pause
            </button>
            <button class="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
              <i class="bx bx-check mr-2"></i> Complete
            </button>
            <button class="text-gray-500 hover:text-gray-700"><i class="bx bx-edit text-xl"></i></button>
            <button class="text-gray-500 hover:text-gray-700"><i class="bx bx-trash text-xl"></i></button>
          </div>
        </div>

        <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-3">
            <div class="flex items-center space-x-2">
              <span class="bg-purple-100 text-purple-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">Transporting</span>
              <span class="bg-orange-100 text-orange-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">URGENT</span>
            </div>
            <span class="bg-gray-400 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">PENDING</span>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">FFB Transportation to Mill</h3>
          <p class="text-gray-600 text-sm mb-4">Transport harvested FFB to processing mill within 24 hours</p>
          <p class="text-gray-500 text-xs mb-4">Task #1002 • Gang 2 • Block B-8</p>

          <div class="mb-4">
            <p class="text-sm font-medium text-gray-700 mb-1">Progress</p>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div class="bg-green-500 h-2.5 rounded-full" style="width: 0%"></div>
            </div>
            <p class="text-right text-sm text-gray-600 mt-1">0%</p>
          </div>

          <div class="space-y-2 text-sm text-gray-700 mb-6">
            <p class="flex items-center"><i class="bx bx-map mr-2"></i> Area: Block 2</p>
            <p class="flex items-center"><i class="bx bx-calendar mr-2"></i> Duration: 2024-01-16 - 2024-01-16</p>
            <p class="flex items-center"><i class="bx bx-time mr-2"></i> Est. Time: 4h</p>
            <p class="flex items-center"><i class="bx bx-category mr-2"></i> Division: <span class="font-semibold">Mechanisation Fleet</span></p>
            <p class="flex items-center"><i class="bx bx-user mr-2"></i> Workers: <span class="font-semibold">John Smith</span></p>
            <p class="flex items-center"><i class="bx bx-box mr-2"></i> Assets: <span class="font-semibold">Transport Truck-01</span></p>
          </div>

          <div class="mb-6">
            <p class="text-sm font-medium text-gray-700 mb-2">Requirements:</p>
            <div class="flex flex-wrap gap-2">
              <span class="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">Transport vehicle</span>
              <span class="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">Loading equipment</span>
              <span class="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">Documentation</span>
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button class="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors">
              <i class="bx bx-play mr-2"></i> Start
            </button>
            <button class="text-gray-500 hover:text-gray-700"><i class="bx bx-edit text-xl"></i></button>
            <button class="text-gray-500 hover:text-gray-700"><i class="bx bx-trash text-xl"></i></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No specific script logic is needed for this static layout,
// but you would add reactive data, methods, etc., here if this
// were a dynamic component.
</script>

<style scoped>
/* No specific <style> block is strictly necessary if you're only using Tailwind CSS.
   However, if you have custom styles or overrides, they would go here.
   The 'scoped' attribute ensures these styles only apply to this component. */
</style>