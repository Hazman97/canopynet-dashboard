<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-500 to-cyan-400">
    <div class="bg-gradient-to-r from-yellow-400 to-orange-400 p-4 shadow-lg rounded-b-3xl mx-4 mb-4">
      <div class="flex justify-between items-center">
        <div class="text-center flex-1">
          <h1 class="text-3xl font-bold text-white mb-2">My Farm Workers !</h1>
          <div class="flex justify-center gap-4">
            <div class="bg-white bg-opacity-30 rounded-full px-4 py-2 flex items-center gap-2">
              <img src="@/assets/crew.png" class="w-6 h-6" alt="Workers" />
              <span class="text-white font-bold">{{ totalWorkers }} Workers</span>
            </div>
            <div class="bg-white bg-opacity-30 rounded-full px-4 py-2 flex items-center gap-2">
              <img src="@/assets/active.png" class="w-6 h-6" alt="Active" />
              <span class="text-white font-bold">{{ activeWorkers }} Active</span>
            </div>
          </div>
        </div>
        <button @click="logout" class="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition text-sm font-bold">
          Log Out
        </button>
      </div>
    </div>

    <div class="px-4 mb-6">
      <div class="bg-white rounded-full p-2 flex gap-2 max-w-4xl mx-auto">
        <button
          @click="currentView = 'workers'"
          :class="[
            'flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all',
            currentView === 'workers'
              ? 'bg-blue-500 text-white'
              : 'text-blue-500 hover:bg-blue-50'
          ]"
        >
          <img src="@/assets/crew.png" class="w-5 h-5" alt="Workers" />
          Workers List
        </button>
        <button
          @click="currentView = 'attendance'"
          :class="[
            'flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all',
            currentView === 'attendance'
              ? 'bg-blue-500 text-white'
              : 'text-blue-500 hover:bg-blue-50'
          ]"
        >
          <img src="@/assets/attandence.png" class="w-5 h-5" alt="Attendance" />
          Attendance Table
        </button>
        <button
          @click="currentView = 'performance'"
          :class="[
            'flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all',
            currentView === 'performance'
              ? 'bg-blue-500 text-white'
              : 'text-blue-500 hover:bg-blue-50'
          ]"
        >
          <img src="@/assets/performance.png" class="w-5 h-5" alt="Performance" />
          Performance Report
        </button>
        <button
          @click="openAddWorkerModal"
          class="bg-teal-500 text-white px-6 py-3 rounded-full font-bold hover:bg-teal-600 transition-all flex items-center gap-2 ml-auto"
        >
          <span class="text-xl">+</span>
          Add New Worker
        </button>
      </div>
    </div>

    <div v-if="currentView === 'workers'" class="px-4">
      <div class="mb-6 space-y-4">
        <div class="relative max-w-2xl">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search"
            class="block w-full pl-10 pr-3 py-3 border-0 rounded-full bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="flex gap-4">
          <button
            @click="statusFilter = 'all'"
            :class="[
              'flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all',
              statusFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 hover:bg-blue-50'
            ]"
          >
            <img src="@/assets/crew.png" class="w-5 h-5" alt="All Workers" />
            All Workers
          </button>
          <button
            @click="statusFilter = 'active'"
            :class="[
              'flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all',
              statusFilter === 'active'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-green-600 hover:bg-green-50'
            ]"
          >
            <img src="@/assets/active.png" class="w-5 h-5" alt="Active" />
            Active
          </button>
          <button
            @click="statusFilter = 'inactive'"
            :class="[
              'flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all',
              statusFilter === 'inactive'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-red-600 hover:bg-red-50'
            ]"
          >
            <img src="@/assets/inactive.png" class="w-5 h-5" alt="Inactive" />
            Inactive
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
        <div
          v-for="worker in filteredWorkers"
          :key="worker.id"
          :class="[
            'rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-4',
            worker.status === 'Active'
              ? 'bg-green-100 border-green-400'
              : 'bg-red-100 border-red-400'
          ]"
        >
          <div class="flex items-start gap-3 mb-4">
            <img src="@/assets/crew.png" class="w-12 h-12" alt="Worker" />
            <div class="flex-1">
              <h3 class="text-xl font-bold text-black">{{ worker.name }}</h3>
              <p class="text-sm text-gray-600">ID: {{ worker.workerId }}</p>
            </div>
          </div>

          <div class="flex gap-1 mb-4">
            <span
              v-for="star in 5"
              :key="star"
              :class="[
                'text-2xl',
                star <= worker.rating ? 'text-yellow-400' : 'text-gray-300'
              ]"
            >
              ⭐
            </span>
          </div>

          <div class="flex justify-end gap-2">
            <button
              @click="editWorker(worker)"
              class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Worker"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
            <button
              @click="deleteWorker(worker)"
              class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Worker"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="currentView === 'attendance'" class="px-4">
      <div class="mb-6 space-y-4">
        <div class="relative max-w-2xl">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search"
            class="block w-full pl-10 pr-3 py-3 border-0 rounded-full bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="flex gap-4">
          <button
            @click="statusFilter = 'all'"
            :class="[
              'flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all',
              statusFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 hover:bg-blue-50'
            ]"
          >
            <img src="@/assets/crew.png" class="w-5 h-5" alt="All Workers" />
            All Workers
          </button>
          <button
            @click="statusFilter = 'active'"
            :class="[
              'flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all',
              statusFilter === 'active'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-green-600 hover:bg-green-50'
            ]"
          >
            <img src="@/assets/active.png" class="w-5 h-5" alt="Active" />
            Active
          </button>
          <button
            @click="statusFilter = 'inactive'"
            :class="[
              'flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all',
              statusFilter === 'inactive'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-red-600 hover:bg-red-50'
            ]"
          >
            <img src="@/assets/inactive.png" class="w-5 h-5" alt="Inactive" />
            Inactive
          </button>
        </div>
      </div>

      <div class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 mb-20">
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center gap-4">
            <h2 class="text-2xl font-bold text-white">Attendance Table -</h2>
            <div class="bg-blue-500 px-4 py-2 rounded-xl flex items-center gap-2">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
              </svg>
              <span class="text-white font-bold">{{ currentDate }}</span>
            </div>
          </div>
          <button class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Download file
          </button>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-1 bg-blue-500 text-white py-3 px-4 rounded-xl font-bold text-center">
            NO
          </div>
          <div class="col-span-7 bg-blue-500 text-white py-3 px-4 rounded-xl font-bold text-center">
            WORKER NAME - CODE
          </div>
          <div class="col-span-4 bg-blue-500 text-white py-3 px-4 rounded-xl font-bold text-center">
            ATTENDANCE
          </div>
        </div>

        <div class="space-y-2">
          <div
            v-for="(worker, index) in filteredWorkersForAttendance"
            :key="worker.id"
            class="grid grid-cols-12 gap-4 items-center"
          >
            <div class="col-span-1 text-white text-xl font-bold text-center py-4">
              {{ index + 1 }}
            </div>
            <div class="col-span-7 text-white text-lg font-bold text-center py-4">
              {{ worker.name.toUpperCase() }} - {{ worker.workerId.toUpperCase() }}
            </div>
            <div class="col-span-4 text-center py-4">
              <div
                :class="[
                  'inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold',
                  worker.todayAttendance === 'Present'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                ]"
              >
                <span v-if="worker.todayAttendance === 'Present'" class="text-lg">✓</span>
                <span v-else class="text-lg">✗</span>
                {{ worker.todayAttendance.toUpperCase() }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="currentView === 'performance'" class="px-4">
      <div class="mb-6 space-y-4">
        <div class="relative max-w-2xl">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search"
            class="block w-full pl-10 pr-3 py-3 border-0 rounded-full bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="flex gap-4">
          <button
            @click="timePeriod = 'today'"
            :class="[
              'px-6 py-3 rounded-full font-bold transition-all',
              timePeriod === 'today'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 hover:bg-blue-50'
            ]"
          >
            Today
          </button>
          <button
            @click="timePeriod = 'week'"
            :class="[
              'px-6 py-3 rounded-full font-bold transition-all',
              timePeriod === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 hover:bg-blue-50'
            ]"
          >
            This Week
          </button>
          <button
            @click="timePeriod = 'month'"
            :class="[
              'px-6 py-3 rounded-full font-bold transition-all',
              timePeriod === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 hover:bg-blue-50'
            ]"
          >
            This Month
          </button>
          <button
            @click="timePeriod = 'quarter'"
            :class="[
              'px-6 py-3 rounded-full font-bold transition-all',
              timePeriod === 'quarter'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 hover:bg-blue-50'
            ]"
          >
            This Quarter
          </button>
        </div>
      </div>

      <div class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 mb-20">
        <h2 class="text-2xl font-bold text-white mb-6">Performance Report</h2>

        <div class="grid grid-cols-16 gap-4 mb-4">
          <div class="col-span-1 bg-blue-500 text-white py-3 px-2 rounded-xl font-bold text-center text-sm">
            RANK
          </div>
          <div class="col-span-6 bg-blue-500 text-white py-3 px-4 rounded-xl font-bold text-center">
            WORKER NAME - CODE
          </div>
          <div class="col-span-3 bg-blue-500 text-white py-3 px-4 rounded-xl font-bold text-center">
            PRODUCTIVITY
          </div>
          <div class="col-span-2 bg-blue-500 text-white py-3 px-4 rounded-xl font-bold text-center">
            TREND
          </div>
          <div class="col-span-4 bg-blue-500 text-white py-3 px-4 rounded-xl font-bold text-center">
            STATUS
          </div>
        </div>

        <div class="space-y-2">
          <div
            v-for="(worker, index) in sortedWorkersByProductivity"
            :key="worker.id"
            class="grid grid-cols-16 gap-4 items-center"
          >
            <div class="col-span-1 text-center py-4">
              <div
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center font-bold',
                  index === 0 ? 'bg-yellow-400 text-black' :
                  index === 1 ? 'bg-gray-400 text-white' :
                  index === 2 ? 'bg-orange-600 text-white' :
                  'bg-blue-300 text-black'
                ]"
              >
                <span v-if="index < 3">{{ getRankIcon(index) }}</span>
                <span v-else>{{ index + 1 }}</span>
              </div>
            </div>
            <div class="col-span-6 text-white text-lg font-bold text-center py-4">
              {{ worker.name.toUpperCase() }} - {{ worker.workerId.toUpperCase() }}
            </div>
            <div class="col-span-3 text-white text-xl font-bold text-center py-4">
              {{ worker.productivity }}
            </div>
            <div class="col-span-2 text-center py-4">
              <div :class="[
                'inline-flex items-center gap-1 font-bold',
                worker.trend > 0 ? 'text-green-400' : worker.trend < 0 ? 'text-red-400' : 'text-white'
              ]">
                <span v-if="worker.trend > 0">📈</span>
                <span v-else-if="worker.trend < 0">📉</span>
                {{ worker.trend > 0 ? '+' : '' }}{{ worker.trend }}%
              </div>
            </div>
            <div class="col-span-4 text-center py-4">
              <span
                :class="[
                  'px-4 py-2 rounded-xl font-bold',
                  worker.performanceStatus === 'Active' ? 'bg-green-500 text-white' :
                  worker.performanceStatus === 'On-break' ? 'bg-yellow-500 text-black' :
                  'bg-red-500 text-white'
                ]"
              >
                {{ worker.performanceStatus }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showWorkerModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="closeWorkerModal"
    >
      <div
        class="bg-white rounded-3xl max-w-md w-full p-6"
        @click.stop
      >
        <div class="bg-blue-500 text-white p-4 rounded-2xl mb-6 text-center">
          <h2 class="text-2xl font-bold">{{ isEditMode ? 'Edit Worker' : 'Add New Worker' }}</h2>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-bold mb-2">Workers Name:</label>
            <input
              v-model="newWorker.name"
              type="text"
              class="w-full px-4 py-3 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter worker name"
            />
          </div>

          <div>
            <label class="block text-sm font-bold mb-2">Workers ID:</label>
            <input
              v-model="newWorker.workerId"
              type="text"
              class="w-full px-4 py-3 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter worker ID"
              :readonly="isEditMode"
            />
          </div>

          <div>
            <label class="block text-sm font-bold mb-2">Workers Status:</label>
            <div class="relative">
              <select
                v-model="newWorker.status"
                class="w-full px-4 py-3 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="">-- Choose Status --</option>
                <option value="Active">🟢 Active</option>
                <option value="Inactive">🔴 Inactive</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-6">
            <button
              @click="closeWorkerModal"
              class="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-bold"
            >
              Cancel
            </button>
            <button
              @click="saveWorker"
              class="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-bold"
            >
              {{ isEditMode ? 'Update' : 'Add' }}
            </button>
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
          <h3 class="text-lg font-medium text-gray-900 mb-2">Delete Worker</h3>
          <p class="text-sm text-gray-500 mb-6">
            Are you sure you want to delete "{{ workerToDelete?.name }}"? This action cannot be undone.
          </p>
          <div class="flex gap-3 justify-center">
            <button
              @click="closeDeleteModal"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="confirmDeleteWorker"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around py-2">
      <router-link to="/game-platform" class="flex flex-col items-center text-gray-400 hover:text-blue-500 transition-colors" exact-active-class="text-blue-500">
        <img src="@/assets/house.png" class="w-6 h-6" alt="Home" />
        <span class="text-xs">Home</span>
      </router-link>
      <router-link to="/tasks" class="flex flex-col items-center text-gray-400 hover:text-blue-500 transition-colors" active-class="text-blue-500">
        <img src="@/assets/task.png" class="w-6 h-6" alt="Tasks" />
        <span class="text-xs">Tasks</span>
      </router-link>
      <router-link to="/game-workers" class="flex flex-col items-center text-gray-400 hover:text-blue-500 transition-colors" active-class="text-blue-500">
        <img src="@/assets/crew.png" class="w-6 h-6" alt="Crew" />
        <span class="text-xs">Crew</span>
      </router-link>
      <router-link to="/map" class="flex flex-col items-center text-gray-400 hover:text-blue-500 transition-colors" active-class="text-blue-500">
        <img src="@/assets/map.png" class="w-6 h-6" alt="Map" />
        <span class="text-xs">Areas</span>
      </router-link>
      <router-link to="/assets" class="flex flex-col items-center text-gray-400 hover:text-blue-500 transition-colors" active-class="text-blue-500">
        <img src="@/assets/tractor.png" class="w-6 h-6" alt="Assets" />
        <span class="text-xs">Assets</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// State
const currentView = ref('workers');
const searchQuery = ref('');
const statusFilter = ref('all');
const timePeriod = ref('today');
const showWorkerModal = ref(false);
const showDeleteModal = ref(false);
const newWorker = ref({ name: '', workerId: '', status: '' });
const isEditMode = ref(false);
const workerToDelete = ref(null);

const workers = ref([
  { id: 1, name: 'Farah Nabila', workerId: 'S001', status: 'Active', rating: 5, productivity: 550.00, trend: 5, todayAttendance: 'Present', performanceStatus: 'Active' },
  { id: 2, name: 'Fatini Zahirah', workerId: 'S002', status: 'Inactive', rating: 3, productivity: 198.96, trend: 0, todayAttendance: 'Present', performanceStatus: 'On-break' },
  { id: 3, name: 'Hadyna Redwani', workerId: 'S003', status: 'Active', rating: 4, productivity: 480.25, trend: 1, todayAttendance: 'Absent', performanceStatus: 'Active' },
  { id: 4, name: 'Farah Shahira', workerId: 'S004', status: 'Inactive', rating: 1, productivity: 150.75, trend: -3, todayAttendance: 'Absent', performanceStatus: 'Inactive' },
  { id: 5, name: 'Izzatul Hanan', workerId: 'S005', status: 'Active', rating: 4, productivity: 200.00, trend: -0.5, todayAttendance: 'Present', performanceStatus: 'Active' },
]);

// Computed properties
const totalWorkers = computed(() => workers.value.length);
const activeWorkers = computed(() => workers.value.filter(worker => worker.status === 'Active').length);
const currentDate = computed(() => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}-${month}-${year}`;
});

const filteredWorkers = computed(() => {
  let filtered = workers.value;
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(worker => worker.status.toLowerCase() === statusFilter.value);
  }
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(worker =>
      worker.name.toLowerCase().includes(query) || worker.workerId.toLowerCase().includes(query)
    );
  }
  return filtered;
});

const filteredWorkersForAttendance = computed(() => {
  let filtered = workers.value;
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(worker =>
      worker.name.toLowerCase().includes(query) || worker.workerId.toLowerCase().includes(query)
    );
  }
  return filtered;
});

const sortedWorkersByProductivity = computed(() => {
  let filtered = workers.value;
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(worker =>
      worker.name.toLowerCase().includes(query) || worker.workerId.toLowerCase().includes(query)
    );
  }
  return filtered.sort((a, b) => b.productivity - a.productivity);
});

// Methods
const openAddWorkerModal = () => {
  isEditMode.value = false;
  newWorker.value = { name: '', workerId: '', status: '' };
  showWorkerModal.value = true;
};

const editWorker = (worker) => {
  isEditMode.value = true;
  newWorker.value = { ...worker };
  showWorkerModal.value = true;
};

const closeWorkerModal = () => {
  showWorkerModal.value = false;
};

const saveWorker = () => {
  if (isEditMode.value) {
    const index = workers.value.findIndex(w => w.id === newWorker.value.id);
    if (index !== -1) {
      workers.value[index] = { ...newWorker.value };
    }
  } else {
    const newId = workers.value.length > 0 ? Math.max(...workers.value.map(w => w.id)) + 1 : 1;
    workers.value.push({
      ...newWorker.value,
      id: newId,
      rating: 0,
      productivity: 0,
      trend: 0,
      todayAttendance: newWorker.value.status === 'Active' ? 'Present' : 'Absent',
      performanceStatus: newWorker.value.status === 'Active' ? 'Active' : 'Inactive',
    });
  }
  closeWorkerModal();
};

const deleteWorker = (worker) => {
  workerToDelete.value = worker;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  workerToDelete.value = null;
};

const confirmDeleteWorker = () => {
  if (workerToDelete.value) {
    workers.value = workers.value.filter(w => w.id !== workerToDelete.value.id);
  }
  closeDeleteModal();
};

const getRankIcon = (index) => {
  if (index === 0) return '🥇';
  if (index === 1) return '🥈';
  if (index === 2) return '🥉';
  return '';
};

const logout = () => {
  router.push('/login');
};
</script>

<style scoped>
/* No additional styles needed due to Tailwind CSS */
</style>