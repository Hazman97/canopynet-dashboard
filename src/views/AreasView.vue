<template>
  <div class="flex-grow p-6 bg-gray-100 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">MPOB Kratong Area Management</h1>
      <button class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center">
        <i class="bx bx-plus mr-2"></i> Add Phase
      </button>
    </div>
    <p class="text-gray-600 mb-8">Comprehensive plantation management with phase structure and tree tracking</p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Total Phases</p>
          <p class="text-3xl font-bold text-gray-800">4</p>
        </div>
        <div class="p-3 bg-blue-100 rounded-full text-blue-500">
          <i class="bx bx-layer text-2xl"></i>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Total Blocks</p>
          <p class="text-3xl font-bold text-gray-800">2</p>
        </div>
        <div class="p-3 bg-green-100 rounded-full text-green-500">
          <i class="bx bx-map text-2xl"></i>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Total Trees</p>
          <p class="text-3xl font-bold text-gray-800">2</p>
        </div>
        <div class="p-3 bg-purple-100 rounded-full text-purple-500">
          <i class="bx bx-tree text-2xl"></i>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Total Area</p>
          <p class="text-3xl font-bold text-gray-800">946.8 ha</p>
        </div>
        <div class="p-3 bg-orange-100 rounded-full text-orange-500">
          <i class="bx bx-area text-2xl"></i>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Tree Health</p>
          <p class="text-3xl font-bold text-gray-800">50%</p>
        </div>
        <div class="p-3 bg-red-100 rounded-full text-red-500">
          <i class="bx bx-heart-circle text-2xl"></i>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Avg Trees/ha</p>
          <p class="text-3xl font-bold text-gray-800">0</p>
        </div>
        <div class="p-3 bg-yellow-100 rounded-full text-yellow-500">
          <i class="bx bx-bar-chart-alt text-2xl"></i>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-800">Phases (4)</h2>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <input
            type="text"
            placeholder="Search phases..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <i class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
        <select
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Development</option>
          <option>Maintenance</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold text-gray-800 flex items-center">
            <span class="inline-flex items-center justify-center w-8 h-8 mr-2 bg-green-500 text-white rounded-full text-sm font-bold">1</span>
            Phase 1 - North
          </h3>
          <span class="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">active</span>
        </div>
        <p class="text-gray-600 mb-4">Northern section of MPOB Kratong plantation</p>
        <div class="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-4">
          <div><span class="font-medium">Section</span><p>North</p></div>
          <div><span class="font-medium">Established</span><p>2015-03-15</p></div>
          <div><span class="font-medium">Total Area</span><p>250.5 ha</p></div>
          <div><span class="font-medium">Avg Yield</span><p>21750.0 kg/ha</p></div>
          <div><span class="font-medium">Blocks</span><p>5,277</p></div>
          <div><span class="font-medium">Trees/ha</span><p>21</p></div>
        </div>
        <div class="flex justify-between items-center">
          <button class="text-blue-600 hover:underline">View Blocks</button>
          <div class="flex space-x-2">
            <i class="bx bx-trash text-gray-400 hover:text-gray-600 cursor-pointer text-xl"></i>
            <i class="bx bx-edit text-gray-400 hover:text-gray-600 cursor-pointer text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold text-gray-800 flex items-center">
            <span class="inline-flex items-center justify-center w-8 h-8 mr-2 bg-green-500 text-white rounded-full text-sm font-bold">2</span>
            Phase 2 - East
          </h3>
          <span class="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">active</span>
        </div>
        <p class="text-gray-600 mb-4">Eastern section with mature palms</p>
        <div class="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-4">
          <div><span class="font-medium">Section</span><p>East</p></div>
          <div><span class="font-medium">Established</span><p>2012-08-20</p></div>
          <div><span class="font-medium">Total Area</span><p>180.3 ha</p></div>
          <div><span class="font-medium">Avg Yield</span><p>0.0 kg/ha</p></div>
          <div><span class="font-medium">Blocks</span><p>0</p></div>
          <div><span class="font-medium">Trees/ha</span><p>0</p></div>
        </div>
        <div class="flex justify-between items-center">
          <button class="text-blue-600 hover:underline">View Blocks</button>
          <div class="flex space-x-2">
            <i class="bx bx-trash text-gray-400 hover:text-gray-600 cursor-pointer text-xl"></i>
            <i class="bx bx-edit text-gray-400 hover:text-gray-600 cursor-pointer text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold text-gray-800 flex items-center">
            <span class="inline-flex items-center justify-center w-8 h-8 mr-2 bg-blue-500 text-white rounded-full text-sm font-bold">3</span>
            Phase 3 - South
          </h3>
          <span class="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">development</span>
        </div>
        <p class="text-gray-600 mb-4">Southern development area</p>
        <div class="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-4">
          <div><span class="font-medium">Section</span><p>South</p></div>
          <div><span class="font-medium">Established</span><p>2020-01-10</p></div>
          <div><span class="font-medium">Total Area</span><p>320.8 ha</p></div>
          <div><span class="font-medium">Avg Yield</span><p>0.0 kg/ha</p></div>
          <div><span class="font-medium">Blocks</span><p>0</p></div>
          <div><span class="font-medium">Trees/ha</span><p>0</p></div>
        </div>
        <div class="flex justify-between items-center">
          <button class="text-blue-600 hover:underline">View Blocks</button>
          <div class="flex space-x-2">
            <i class="bx bx-trash text-gray-400 hover:text-gray-600 cursor-pointer text-xl"></i>
            <i class="bx bx-edit text-gray-400 hover:text-gray-600 cursor-pointer text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-yellow-500">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold text-gray-800 flex items-center">
            <span class="inline-flex items-center justify-center w-8 h-8 mr-2 bg-yellow-500 text-white rounded-full text-sm font-bold">4</span>
            Phase 4 - West
          </h3>
          <span class="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">maintenance</span>
        </div>
        <p class="text-gray-600 mb-4">Western expansion area</p>
        <div class="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-4">
          <div><span class="font-medium">Section</span><p>West</p></div>
          <div><span class="font-medium">Established</span><p>2018-06-05</p></div>
          <div><span class="font-medium">Total Area</span><p>195.2 ha</p></div>
          <div><span class="font-medium">Avg Yield</span><p>0.0 kg/ha</p></div>
          <div><span class="font-medium">Blocks</span><p>0</p></div>
          <div><span class="font-medium">Trees/ha</span><p>0</p></div>
        </div>
        <div class="flex justify-between items-center">
          <button class="text-blue-600 hover:underline">View Blocks</button>
          <div class="flex space-x-2">
            <i class="bx bx-trash text-gray-400 hover:text-gray-600 cursor-pointer text-xl"></i>
            <i class="bx bx-edit text-gray-400 hover:text-gray-600 cursor-pointer text-xl"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No specific script logic is needed for this static display based on the image.
// You would add reactive data, API calls, and methods here if this were dynamic.
</script>

<style scoped>
/* No specific scoped styles are needed as Tailwind CSS classes are used directly in the template. */
</style>