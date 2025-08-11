<template>
  <div class="min-h-screen bg-gradient-to-br from-cyan-400 to-green-400">
    <div class="bg-gradient-to-r from-cyan-400 to-blue-400 p-4 shadow-lg">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-white">Task Time!</h1>
        <button @click="logout" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm">
          Logout
        </button>
      </div>
    </div>

    <div class="p-4 space-y-4">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div class="relative">
          <select
            v-model="selectedStatus"
            class="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Complete">Complete</option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </div>

        <div class="relative">
          <select
            v-model="selectedTaskType"
            class="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Task Type</option>
            <option v-for="type in taskTypes" :key="type.name" :value="type.name">
              {{ type.name }}
            </option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </div>

        <button
          @click="openCreateModal"
          class="bg-yellow-400 text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-500 transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <span class="text-xl">+</span>
          Create New Task
        </button>
      </div>
    </div>

    <div class="p-4 pb-20">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div class="flex items-start gap-3 mb-4">
            <div class="text-3xl">
              <img 
                v-if="getTaskTypeIcon(task.type)" 
                :src="getTaskTypeIcon(task.type)" 
                class="w-12 h-12 object-contain"
                :alt="task.type"
              />
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-bold text-green-600 mb-2">{{ task.name }}</h3>
              <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                </svg>
                {{ task.date }}
              </div>
              <div class="flex items-center gap-2">
                <span
                  :class="getStatusBadgeClass(task.status)"
                  class="px-3 py-1 rounded-full text-xs font-bold"
                >
                  {{ task.area }}
                </span>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium">Progress:</span>
              <span class="text-sm font-bold">{{ task.progress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                :class="getProgressBarClass(task.status)"
                :style="{ width: task.progress + '%' }"
                class="h-2 rounded-full transition-all duration-300"
              ></div>
            </div>
            <div class="mt-2">
              <span
                :class="getStatusTextClass(task.status)"
                class="text-sm font-medium px-2 py-1 rounded"
              >
                {{ task.status }}
              </span>
            </div>
          </div>

          <div class="space-y-3">
            <div>
              <p class="text-sm font-bold text-gray-700 mb-1">Task ID: {{ task.taskId }}</p>
              <div class="flex items-center gap-1 text-sm">
                <img :src="crewIcon" class="w-5 h-5 object-contain" alt="workers icon" />
                <span class="font-bold">Assigned Workers:</span>
              </div>
              <div class="ml-6 space-y-1">
                <p v-for="worker in task.workers" :key="worker" class="text-sm">{{ worker }}</p>
              </div>
            </div>

            <div v-if="task.assets && task.assets.length > 0">
              <div class="flex items-center gap-1 text-sm">
                <img :src="getAssetIcon(task.assets[0])" class="w-5 h-5 object-contain" alt="assets icon" />
                <span class="font-bold">Assigned Assets:</span>
              </div>
              <div class="ml-6 space-y-1">
                <p v-for="asset in task.assets" :key="asset" class="text-sm">{{ asset }}</p>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-4">
            <button 
              @click="editTask(task)"
              class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Task"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
            <button 
              @click="deleteTask(task)"
              class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Task"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
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
        class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-auto"
        @click.stop
      >
        <div class="p-6">
          <div class="bg-green-500 text-white p-4 rounded-2xl mb-6">
            <h2 class="text-2xl font-bold text-center">
              {{ isEditMode ? 'Edit Task' : 'Create New Task' }}
            </h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-green-500 rounded-2xl p-4">
              <div v-if="currentModalView === 'taskTypes'">
                <h3 class="text-lg font-bold text-white mb-4">Task Type:</h3>
                <p class="text-white mb-4 text-sm">Drag and drop the task!</p>
                <div class="space-y-3">
                  <div
                    v-for="type in taskTypes"
                    :key="type.name"
                    class="bg-white rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
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
                    class="bg-white rounded-full w-12 h-12 flex items-center justify-center font-bold cursor-pointer hover:bg-gray-50 transition-colors"
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
                    class="bg-white rounded-full w-12 h-12 flex items-center justify-center font-bold cursor-pointer hover:bg-gray-50 transition-colors"
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
                    class="bg-white rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
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
                    class="bg-white rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
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
                <input
                  v-model="newTask.name"
                  type="text"
                  class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold mb-2">Task Type:</label>
                  <div
                    class="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-500 flex items-center justify-center min-h-[42px]"
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
                    <input
                      v-model="newTask.date"
                      type="date"
                      class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
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
                    class="flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-gray-500 flex items-center justify-center cursor-pointer"
                    @drop="dropPhase"
                    @dragover.prevent
                    @click="currentModalView = 'phases'"
                  >
                    <span v-if="newTask.phase">Phase {{ newTask.phase }}</span>
                    <span v-else>Drag the phases!</span>
                  </div>
                  <div
                    class="flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-gray-500 flex items-center justify-center cursor-pointer"
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
                  <div
                    class="w-full h-20 px-3 py-2 border rounded-lg bg-gray-50 overflow-y-auto cursor-pointer"
                    @drop="dropWorker"
                    @dragover.prevent
                    @click="currentModalView = 'workers'"
                  >
                    <div v-if="newTask.workers.length === 0" class="text-gray-500 text-center mt-6">
                      Drag workers here
                    </div>
                    <div v-else class="space-y-1">
                      <div
                        v-for="worker in newTask.workers"
                        :key="worker"
                        class="bg-white px-2 py-1 rounded text-sm flex justify-between items-center"
                      >
                        {{ worker }}
                        <button @click="removeWorker(worker)" class="text-red-500 hover:text-red-700">×</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-bold mb-2">Assigned Assets:</label>
                  <div
                    class="w-full h-20 px-3 py-2 border rounded-lg bg-gray-50 overflow-y-auto cursor-pointer"
                    @drop="dropAsset"
                    @dragover.prevent
                    @click="currentModalView = 'assets'"
                  >
                    <div v-if="newTask.assets.length === 0" class="text-gray-500 text-center mt-6">
                      Drag assets here
                    </div>
                    <div v-else class="space-y-1">
                      <div
                        v-for="asset in newTask.assets"
                        :key="asset"
                        class="bg-white px-2 py-1 rounded text-sm flex justify-between items-center"
                      >
                        {{ asset }}
                        <button @click="removeAsset(asset)" class="text-red-500 hover:text-red-700">×</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-bold mb-2">Notes:</label>
                <textarea
                  v-model="newTask.notes"
                  class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-20 resize-none"
                  placeholder="Additional notes..."
                ></textarea>
              </div>

              <div class="flex justify-end gap-3 pt-4">
                <button
                  @click="closeModal"
                  class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  @click="saveTask"
                  class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {{ isEditMode ? 'Update' : 'Add' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="closeDeleteModal"
    >
      <div
        class="bg-white rounded-2xl max-w-md w-full p-6"
        @click.stop
      >
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Delete Task</h3>
          <p class="text-sm text-gray-500 mb-6">
            Are you sure you want to delete "{{ taskToDelete?.name }}"? This action cannot be undone.
          </p>
          <div class="flex gap-3 justify-center">
            <button
              @click="closeDeleteModal"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="confirmDeleteTask"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around py-2">
      <router-link to="/game-platform" class="flex flex-col items-center text-sm text-green-700">
        <img :src="homeIcon" class="w-8 mb-1" />
        Home
      </router-link>
      <router-link to="/game-tasks" class="flex flex-col items-center text-sm text-red-700 font-bold">
        <img :src="taskIcon" class="w-8 mb-1" />
        Tasks
      </router-link>
      <router-link to="/game-workers" class="flex flex-col items-center text-sm text-yellow-700">
        <img :src="crewIcon" class="w-8 mb-1" />
        Crew
      </router-link>
      <router-link to="/" class="flex flex-col items-center text-sm text-blue-700">
        <img :src="mapIcon" class="w-8 mb-1" />
        Map
      </router-link>
      <router-link to="/" class="flex flex-col items-center text-sm text-brown-700">
        <img :src="tractorIcon" class="w-8 mb-1" />
        Assets
      </router-link>
    </div>
  </div>
</template>

<script>
  import crewIcon from '@/assets/crew.png';
  import tractorIcon from '@/assets/tractor.png';
  import ugvIcon from '@/assets/ugv.png';
  import checkingIcon from '@/assets/checking.png';
  import weedingIcon from '@/assets/weeding.png';
  import pruningIcon from '@/assets/pruning.png';
  import harvestingIcon from '@/assets/harvesting.png';
  import collectingIcon from '@/assets/collecting.png';
  import manuringIcon from '@/assets/manuring.png';
  import pestControlIcon from '@/assets/pest-control.png';
  import homeIcon from '@/assets/house.png';
  import taskIcon from '@/assets/task.png';
  import mapIcon from '@/assets/map.png';

  export default {
    data() {
      return {
        searchQuery: '',
        selectedStatus: '',
        selectedTaskType: '',
        showCreateModal: false,
        showDeleteModal: false,
        currentModalView: 'taskTypes',
        isEditMode: false,
        editingTaskId: null,
        taskToDelete: null,
        
        // Statically import images and assign them to data properties
        crewIcon,
        tractorIcon,
        ugvIcon,
        homeIcon,
        taskIcon,
        mapIcon,

        taskTypes: [
          { name: 'Checking', iconPath: checkingIcon },
          { name: 'Transporting', iconPath: tractorIcon },
          { name: 'Weeding', iconPath: weedingIcon },
          { name: 'Pruning', iconPath: pruningIcon },
          { name: 'Harvesting', iconPath: harvestingIcon },
          { name: 'Collecting', iconPath: collectingIcon },
          { name: 'Manuring', iconPath: manuringIcon },
          { name: 'Pest Control', iconPath: pestControlIcon },
          { name: 'Mechanisation', iconPath: ugvIcon }
        ],

        phases: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        blocks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],

        availableWorkers: [
          { name: 'Farah Nabila' },
          { name: 'Farah Shahira' },
          { name: 'Fatini Zahirah' },
          { name: 'Hadyna Redwani' },
          { name: 'Izzatul Hanan' }
        ],

        availableAssets: [
          { name: 'Tractor - #TRAC001', type: 'Tractor' },
          { name: 'Tractor - #TRAC002', type: 'Tractor' },
          { name: 'UGV - #UGV001', type: 'UGV' },
          { name: 'UGV - #UGV002', type: 'UGV' }
        ],

        tasks: [
          {
            id: 1,
            name: 'Palm Oil Bunch Checking',
            type: 'Checking',
            date: '2025-03-28',
            area: 'F1-B3',
            status: 'In Progress',
            progress: 63,
            taskId: 'T-001',
            workers: ['Farah Shahira', 'Izzatul Hanan'],
            assets: []
          },
          {
            id: 2,
            name: 'Weed Clearing',
            type: 'Weeding',
            date: '2025-07-8',
            area: 'F4-B28',
            status: 'Pending',
            progress: 0,
            taskId: 'T-002',
            workers: ['Farah Nabila', 'Hadyna Redwani'],
            assets: ['UGV - #UGV002']
          },
          {
            id: 3,
            name: 'Transportation to Klang',
            type: 'Transporting',
            date: '2025-03-28',
            area: 'F1-B3',
            status: 'In Progress',
            progress: 45,
            taskId: 'T-003',
            workers: ['Fatini Zahirah'],
            assets: ['Tractor - #TRAC001']
          }
        ],

        newTask: {
          id: 'Auto-generated',
          name: '',
          type: '',
          date: '',
          phase: '',
          block: '',
          workers: [],
          assets: [],
          notes: ''
        },

        draggedItem: null
      };
    },

    computed: {
      filteredTasks() {
        let filtered = this.tasks;

        if (this.searchQuery) {
          const query = this.searchQuery.toLowerCase();
          filtered = filtered.filter(task =>
            task.name.toLowerCase().includes(query) ||
            task.taskId.toLowerCase().includes(query) ||
            task.date.includes(query) ||
            task.workers.some(worker => worker.toLowerCase().includes(query))
          );
        }

        if (this.selectedStatus) {
          filtered = filtered.filter(task => task.status === this.selectedStatus);
        }

        if (this.selectedTaskType) {
          filtered = filtered.filter(task => task.type === this.selectedTaskType);
        }

        return filtered;
      }
    },

    methods: {
      getTaskTypeIcon(type) {
        const taskType = this.taskTypes.find(t => t.name === type);
        return taskType ? taskType.iconPath : '';
      },
      
      getAssetIcon(assetName) {
        if (assetName.includes('Tractor')) {
          return this.tractorIcon;
        } else if (assetName.includes('UGV')) {
          return this.ugvIcon;
        }
        return '';
      },

      getStatusBadgeClass(status) {
        switch (status) {
          case 'Pending':
            return 'bg-gray-200 text-gray-800';
          case 'In Progress':
            return 'bg-blue-200 text-blue-800';
          case 'Complete':
            return 'bg-green-200 text-green-800';
          default:
            return 'bg-gray-200 text-gray-800';
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
            return 'bg-gray-100 text-gray-700';
          case 'In Progress':
            return 'bg-blue-100 text-blue-700';
          case 'Complete':
            return 'bg-green-100 text-green-700';
          default:
            return 'bg-gray-100 text-gray-700';
        }
      },

      // Modal Management
      openCreateModal() {
        this.isEditMode = false;
        this.editingTaskId = null;
        this.resetNewTask();
        this.showCreateModal = true;
        this.currentModalView = 'taskTypes';
      },

      closeModal() {
        this.showCreateModal = false;
        this.currentModalView = 'taskTypes';
        this.isEditMode = false;
        this.editingTaskId = null;
        this.resetNewTask();
      },

      closeDeleteModal() {
        this.showDeleteModal = false;
        this.taskToDelete = null;
      },

      resetNewTask() {
        this.newTask = {
          id: 'Auto-generated',
          name: '',
          type: '',
          date: '',
          phase: '',
          block: '',
          workers: [],
          assets: [],
          notes: ''
        };
      },

      // Edit functionality
      editTask(task) {
        this.isEditMode = true;
        this.editingTaskId = task.id;
        
        // Extract phase and block from area (format: F1-B3)
        const areaMatch = task.area.match(/F(\d+)-B(\d+)/);
        const phase = areaMatch ? parseInt(areaMatch[1]) : '';
        const block = areaMatch ? parseInt(areaMatch[2]) : '';
        
        // Populate form with existing task data
        this.newTask = {
          id: task.taskId,
          taskId: task.taskId,
          name: task.name,
          type: task.type,
          date: task.date,
          phase: phase,
          block: block,
          workers: [...task.workers],
          assets: task.assets ? [...task.assets] : [],
          notes: task.notes || '',
          status: task.status,
          progress: task.progress
        };
        
        this.showCreateModal = true;
        this.currentModalView = 'taskTypes';
      },

      // Delete functionality
      deleteTask(task) {
        this.taskToDelete = task;
        this.showDeleteModal = true;
      },

      confirmDeleteTask() {
        if (this.taskToDelete) {
          const index = this.tasks.findIndex(t => t.id === this.taskToDelete.id);
          if (index > -1) {
            this.tasks.splice(index, 1);
            alert(`Task "${this.taskToDelete.name}" has been deleted successfully!`);
          }
        }
        this.closeDeleteModal();
      },

      // Drag and Drop Methods
      dragTaskType(type) {
        this.draggedItem = { type: 'taskType', data: type };
      },

      dragPhase(phase) {
        this.draggedItem = { type: 'phase', data: phase };
      },

      dragBlock(block) {
        this.draggedItem = { type: 'block', data: block };
      },

      dragWorker(worker) {
        this.draggedItem = { type: 'worker', data: worker };
      },

      dragAsset(asset) {
        this.draggedItem = { type: 'asset', data: asset };
      },

      dropTaskType() {
        if (this.draggedItem && this.draggedItem.type === 'taskType') {
          this.newTask.type = this.draggedItem.data.name;
          this.draggedItem = null;
        }
      },

      dropPhase() {
        if (this.draggedItem && this.draggedItem.type === 'phase') {
          this.newTask.phase = this.draggedItem.data;
          this.draggedItem = null;
        }
      },

      dropBlock() {
        if (this.draggedItem && this.draggedItem.type === 'block') {
          this.newTask.block = this.draggedItem.data;
          this.draggedItem = null;
        }
      },

      dropWorker() {
        if (this.draggedItem && this.draggedItem.type === 'worker') {
          if (!this.newTask.workers.includes(this.draggedItem.data.name)) {
            this.newTask.workers.push(this.draggedItem.data.name);
          }
          this.draggedItem = null;
        }
      },

      dropAsset() {
        if (this.draggedItem && this.draggedItem.type === 'asset') {
          if (!this.newTask.assets.includes(this.draggedItem.data.name)) {
            this.newTask.assets.push(this.draggedItem.data.name);
          }
          this.draggedItem = null;
        }
      },

      // Select Methods (for clicking)
      selectTaskType(type) {
        this.newTask.type = type.name;
      },

      selectPhase(phase) {
        this.newTask.phase = phase;
      },

      selectBlock(block) {
        this.newTask.block = block;
      },

      selectWorker(worker) {
        if (!this.newTask.workers.includes(worker.name)) {
          this.newTask.workers.push(worker.name);
        }
      },

      selectAsset(asset) {
        if (!this.newTask.assets.includes(asset.name)) {
          this.newTask.assets.push(asset.name);
        }
      },

      // Remove Methods
      removeWorker(workerName) {
        const index = this.newTask.workers.indexOf(workerName);
        if (index > -1) {
          this.newTask.workers.splice(index, 1);
        }
      },

      removeAsset(assetName) {
        const index = this.newTask.assets.indexOf(assetName);
        if (index > -1) {
          this.newTask.assets.splice(index, 1);
        }
      },

      // Save Task (Create or Update)
      saveTask() {
        if (this.isEditMode) {
          this.updateTask();
        } else {
          this.createTask();
        }
      },

      createTask() {
        // Validation
        if (!this.newTask.name || !this.newTask.type || !this.newTask.date || !this.newTask.phase || !this.newTask.block) {
          alert('Please fill in all required fields!');
          return;
        }

        // Generate new task ID
        const newId = this.tasks.length + 1;
        const newTaskId = `T-${String(newId).padStart(3, '0')}`;
        
        // Create area string from phase and block
        const area = `F${this.newTask.phase}-B${this.newTask.block}`;

        // Create the new task
        const task = {
          id: newId,
          name: this.newTask.name,
          type: this.newTask.type,
          date: this.newTask.date,
          area: area,
          status: 'Pending',
          progress: 0,
          taskId: newTaskId,
          workers: [...this.newTask.workers],
          assets: [...this.newTask.assets],
          notes: this.newTask.notes
        };

        // Add to tasks array
        this.tasks.unshift(task);

        // Close modal and reset
        this.closeModal();

        // Show success message
        alert('Task created successfully!');
      },

      updateTask() {
        // Validation
        if (!this.newTask.name || !this.newTask.type || !this.newTask.date || !this.newTask.phase || !this.newTask.block) {
          alert('Please fill in all required fields!');
          return;
        }

        // Find the task to update
        const taskIndex = this.tasks.findIndex(t => t.id === this.editingTaskId);
        if (taskIndex === -1) {
          alert('Task not found!');
          return;
        }

        // Create area string from phase and block
        const area = `F${this.newTask.phase}-B${this.newTask.block}`;

        // Update the task
        const updatedTask = {
          ...this.tasks[taskIndex],
          name: this.newTask.name,
          type: this.newTask.type,
          date: this.newTask.date,
          area: area,
          workers: [...this.newTask.workers],
          assets: [...this.newTask.assets],
          notes: this.newTask.notes,
          // Keep existing status and progress
          status: this.newTask.status || this.tasks[taskIndex].status,
          progress: this.newTask.progress || this.tasks[taskIndex].progress
        };

        // Replace the task in the array
        this.tasks.splice(taskIndex, 1, updatedTask);

        // Close modal and reset
        this.closeModal();

        // Show success message
        alert('Task updated successfully!');
      },
      // Logout functionality
      logout() {
        sessionStorage.removeItem('userToken'); // Clear token
        sessionStorage.removeItem('userRole');  // Clear role
        this.$router.push('/login'); // Redirect to login page
      }
    }
  };
</script>