<template>
  <div class="p-6 bg-gray-50 min-h-screen font-sans">
    <div v-if="!ugvId">
      <div class="flex flex-col items-center justify-center text-center p-20 bg-white rounded-lg shadow-md">
        <i class="bx bx-error-circle text-6xl text-gray-400 mb-4"></i>
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">No UGV Selected</h2>
        <p class="text-gray-500">Select a UGV from the list to access teleoperation controls</p>
      </div>
    </div>

    <div v-else>
      <div class="flex items-center mb-6">
        <i class="bx bxs-robot text-4xl text-gray-800 mr-3"></i>
        <div>
          <h1 class="text-3xl font-bold text-gray-800">UGV Control Centre</h1>
          <p class="text-gray-600">
            Advanced teleoperation and autonomous control for unmanned ground vehicles
          </p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-2 mb-6 flex space-x-4">
        <button
          @click="$emit('back-to-overview')"
          :class="{ 'text-gray-700 hover:bg-gray-100': true }"
          class="px-5 py-2 rounded-md font-medium transition-colors duration-200"
        >
          <i class="bx bx-grid-alt mr-2"></i>Overview
        </button>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 mb-6 flex items-center justify-between">
        <div class="flex items-center">
          <span
            class="w-3 h-3 rounded-full mr-3"
            :class="connectionStatus === 'Connected' ? 'bg-green-500' : 'bg-red-500'"
          ></span>
          <h2 class="text-xl font-semibold text-gray-800">{{ ugvId }} Teleoperation</h2>
          <p class="text-gray-600 ml-4">
            Status:
            <span
              :class="{
                'text-green-600': connectionStatus === 'Connected',
                'text-red-600': connectionStatus !== 'Connected',
                'font-bold': true,
              }"
              >{{ connectionStatus }}</span
            >
          </p>
        </div>
      </div>

      <!-- Trail History Modal - Fixed to right side -->
      <div v-if="showHistoryModal" class="fixed inset-0 bg-black bg-opacity-60 z-50">
        <div class="flex h-full">
          <!-- Left side - clickable overlay to close modal -->
          <div class="flex-1" @click="showHistoryModal = false"></div>
          
          <!-- Right side - modal content -->
          <div class="w-full max-w-md bg-white shadow-xl flex flex-col h-full">
            <div class="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 class="text-xl font-semibold text-gray-800">
                <i class="bx bx-history mr-2"></i>Saved Trail History
              </h3>
              <button @click="showHistoryModal = false" class="text-gray-500 hover:text-gray-800 text-2xl">
                &times;
              </button>
            </div>
            
            <div class="flex-1 p-4 overflow-y-auto">
              <div v-if="trailHistory.length === 0" class="text-center text-gray-500 p-8">
                <p>No saved trails yet.</p>
                <p class="text-sm">Use the "Save Current Trail" button on the map to save a trail.</p>
              </div>
              <ul v-else class="space-y-3">
                <li v-for="(trail, index) in trailHistory" :key="trail.id" 
                    class="bg-gray-50 p-3 rounded-lg border flex flex-col justify-between">
                  <div class="mb-2">
                    <input 
                      v-if="trail.editing" 
                      v-model="trail.name" 
                      @blur="finishEditingTrail(trail)" 
                      @keyup.enter="finishEditingTrail(trail)" 
                      class="w-full p-1 border rounded" 
                    />
                    <p v-else class="font-semibold text-gray-700">{{ trail.name }}</p>
                    <p class="text-xs text-gray-500">{{ trail.points.length }} points | Saved: {{ formatDate(trail.date) }}</p>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <button @click="loadHistoricalTrail(trail)" 
                            class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-xs rounded-md flex-1">
                      Load
                    </button>
                    <button @click="toggleEditTrail(trail)" 
                            class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 text-xs rounded-md flex-1">
                      {{ trail.editing ? 'Save' : 'Rename' }}
                    </button>
                    <button @click="deleteFromHistory(trail.id)" 
                            class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs rounded-md flex-1">
                      Delete
                    </button>
                  </div>
                </li>
              </ul>
            </div>
            
            <div class="p-4 border-t bg-gray-50">
              <button @click="showHistoryModal = false" 
                      class="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <i class="bx bx-link text-xl mr-2"></i>Connection Status
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div class="border border-blue-200 rounded-lg p-4">
            <p class="text-sm font-medium text-gray-700">ROS Bridge:</p>
            <p
              class="text-lg font-bold"
              :class="connectionStatus === 'Connected' ? 'text-green-600' : 'text-red-600'"
            >
              {{ connectionStatus }}
            </p>
          </div>
          <div class="border border-blue-200 rounded-lg p-4">
            <p class="text-sm font-medium text-gray-700">Joystick Connection:</p>
            <p
              class="text-lg font-bold"
              :class="joystick.connection === 'Connected' ? 'text-green-600' : 'text-red-600'"
            >
              {{ joystick.connection }}
            </p>
          </div>
          <div class="border border-blue-200 rounded-lg p-4">
            <p class="text-sm font-medium text-gray-700">Joystick Mode:</p>
            <p class="text-lg font-bold text-gray-800">{{ joystick.mode }}</p>
          </div>
        </div>
      </div>

      <div v-if="isFullscreen" class="fixed inset-0 z-50 bg-black flex flex-col overflow-y-auto">
        <div class="flex justify-between items-center p-4 bg-gray-900 text-white">
          <h3 class="text-lg font-semibold">Teleoperation Fullscreen View</h3>
          <button @click="toggleFullscreen" class="bg-gray-700 p-2 rounded-full hover:bg-gray-600">
            <i class="bx bx-exit-fullscreen text-xl"></i>
          </button>
        </div>

        <div class="flex-1 flex p-4 space-x-4">
          <div class="w-80 bg-gray-800 p-6 flex flex-col rounded-lg shadow-md overflow-y-auto">
            <div class="flex-1 flex flex-col">
              <div class="bg-gray-700 rounded-lg p-4 mb-4 flex-1 flex flex-col">
                <h4 class="text-md font-semibold text-white mb-3">UGV Position Tracking</h4>

                <div class="relative flex-grow bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                  <div id="gps-map-fullscreen" class="w-full h-full gps-map"></div>
                </div>
                
                <div class="flex flex-wrap gap-1 mt-2">
                  <button @click="centerMapOnRobot" class="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs">
                    🎯 Center
                  </button>
                  <button @click="toggleTrail" class="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs">
                    {{ showTrail ? '👁️ Hide' : '👁️ Show' }}
                  </button>
                  <button @click="clearTrail" class="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs">
                    🗑️ Clear
                  </button>
                  <button @click="saveCurrentTrail" class="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded text-sm">
                    💾 Save Current
                  </button>
                  <button @click="showHistoryModal = true" class="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm">
                    📜 View History
                  </button>
                </div>
                <div class="text-sm text-gray-600 mt-2 text-center">
                  Live Trail Points: {{ trailPoints.length }} | Last Update: {{ formatTimestamp(gpsData.timestamp) }}
                </div>
              </div>
              
              <div class="bg-gray-700 rounded-lg p-4 mb-4">
                <h4 class="text-md font-semibold text-white mb-3">Connection Status</h4>
                <div class="space-y-2">
                  <div class="flex justify-between items-center text-sm">
                    <span class="text-gray-300">Joystick:</span>
                    <span class="font-bold" :class="joystick.connection === 'Connected' ? 'text-green-400' : 'text-red-400'">
                      {{ joystick.connection }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center text-sm">
                    <span class="text-gray-300">Mode:</span>
                    <span class="font-bold text-white">{{ joystick.mode }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-auto mb-0 text-center">
              <button 
                @mousedown="activateVirtualSafety"
                @mouseup="deactivateVirtualSafety"
                @mouseleave="deactivateVirtualSafety"
                @touchstart="activateVirtualSafety"
                @touchend="deactivateVirtualSafety"
                :class="{ 'bg-green-600 border-green-500': virtualSafetyPressed, 'bg-red-600 border-red-500': !virtualSafetyPressed }"
                class="w-full py-2 px-4 text-white font-bold rounded-lg border-2 transition-colors text-sm"
                :disabled="!uiControlEnabled"
              >
                🛡️ {{ virtualSafetyPressed ? 'SAFETY ACTIVE' : 'HOLD FOR SAFETY' }}
              </button>
              <div class="text-xs text-gray-400 mt-1">Hold for touchscreen control</div>
            </div>
          </div>

          <div class="flex-1 flex flex-col items-center justify-center relative rounded-lg shadow-md bg-gray-900 overflow-hidden">
            <div class="relative w-full h-full">
              <webrtc 
                v-if="connectionStatus === 'Connected'"
                class="w-full h-full object-cover rounded-lg"
              />
              <div v-else class="absolute inset-0 flex items-center justify-center text-center text-white">
                <i class="bx bx-video-off text-6xl text-gray-400 mb-4"></i>
                <div>
                  <p class="text-xl font-semibold mb-2">Camera Feed Unavailable</p>
                  <p class="text-sm text-gray-400">Not connected to robot or stream error</p>
                </div>
              </div>
            </div>
          </div>

          <div class="w-80 bg-gray-800 p-6 flex flex-col rounded-lg shadow-md overflow-y-auto">
            <h3 class="text-lg font-semibold text-white mb-4">Movement Controls</h3>
            
            <div class="mb-4">
              <label class="flex items-center space-x-2 text-white cursor-pointer p-3 bg-gray-700 rounded-lg">
                <input 
                  type="checkbox" 
                  :checked="uiControlEnabled" 
                  @change="toggleUIControl"
                  class="w-4 h-4"
                >
                <span class="text-sm font-medium">Enable UI Control (disables joystick)</span>
              </label>
            </div>

            <div class="mb-4 p-3 bg-yellow-900 bg-opacity-50 rounded-lg border border-yellow-600 text-yellow-100">
              <div class="text-xs font-semibold mb-1">
                ⚠️ SAFETY: Hold <kbd class="px-1 py-0.5 bg-blue-600 rounded text-xs">{{ safetyKey }}</kbd> key or safety button
              </div>
              <div class="text-xs" :class="{ 'text-green-400': safetyButtonPressed && uiControlEnabled, 'text-red-400': !safetyButtonPressed || !uiControlEnabled }">
                Status: {{ getSafetyStatusText() }}
              </div>
            </div>

            <div class="flex-1 flex flex-col items-center justify-center mb-6">
              <div class="grid grid-rows-3 grid-cols-3 gap-3 w-full max-w-xs">
                <div></div>
                <button
                  class="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors active:bg-blue-700"
                  @mousedown="startMovement(maxLinearSpeed, 0)"
                  @mouseup="stopMovement"
                  @mouseleave="stopMovement"
                  @touchstart="startMovement(maxLinearSpeed, 0)"
                  @touchend="stopMovement"
                  :disabled="!uiControlEnabled || !safetyButtonPressed"
                  :class="{ 'opacity-50 cursor-not-allowed': !uiControlEnabled || !safetyButtonPressed }"
                >
                  <i class="bx bx-up-arrow-alt text-2xl"></i>
                </button>
                <div></div>
                <button
                  class="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors active:bg-blue-700"
                  @mousedown="startMovement(0, maxAngularSpeed)"
                  @mouseup="stopMovement"
                  @mouseleave="stopMovement"
                  @touchstart="startMovement(0, maxAngularSpeed)"
                  @touchend="stopMovement"
                  :disabled="!uiControlEnabled || !safetyButtonPressed"
                  :class="{ 'opacity-50 cursor-not-allowed': !uiControlEnabled || !safetyButtonPressed }"
                >
                  <i class="bx bx-left-arrow-alt text-2xl"></i>
                </button>
                <div></div>
                <button
                  class="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors active:bg-blue-700"
                  @mousedown="startMovement(0, -maxAngularSpeed)"
                  @mouseup="stopMovement"
                  @mouseleave="stopMovement"
                  @touchstart="startMovement(0, -maxAngularSpeed)"
                  @touchend="stopMovement"
                  :disabled="!uiControlEnabled || !safetyButtonPressed"
                  :class="{ 'opacity-50 cursor-not-allowed': !uiControlEnabled || !safetyButtonPressed }"
                >
                  <i class="bx bx-right-arrow-alt text-2xl"></i>
                </button>
                <div></div>
                <button
                  class="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors active:bg-blue-700"
                  @mousedown="startMovement(-maxLinearSpeed, 0)"
                  @mouseup="stopMovement"
                  @mouseleave="stopMovement"
                  @touchstart="startMovement(-maxLinearSpeed, 0)"
                  @touchend="stopMovement"
                  :disabled="!uiControlEnabled || !safetyButtonPressed"
                  :class="{ 'opacity-50 cursor-not-allowed': !uiControlEnabled || !safetyButtonPressed }"
                >
                  <i class="bx bx-down-arrow-alt text-2xl"></i>
                </button>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div class="lg:col-span-1 bg-white rounded-lg shadow-md p-6 flex flex-col">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">UGV Position Tracking</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p class="text-sm font-medium text-gray-700">GPS Status:</p>
                <p class="text-sm font-bold" :class="getGpsStatusClass()">{{ getGpsStatusText() }}</p>
              </div>
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p class="text-sm font-medium text-gray-700">Position:</p>
                <p class="text-xs text-gray-800">{{ gpsData.latitude.toFixed(6) }}°</p>
                <p class="text-xs text-gray-800">{{ gpsData.longitude.toFixed(6) }}°</p>
              </div>
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p class="text-sm font-medium text-gray-700">Altitude:</p>
                <p class="text-sm text-gray-800">{{ gpsData.altitude.toFixed(2) }} m</p>
              </div>
            </div>

            <div class="relative flex-grow bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
              <div id="gps-map-normal" class="w-full h-full gps-map"></div>
            </div>
            
            <div class="flex flex-wrap gap-2 mt-3">
              <button @click="centerMapOnRobot" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm">
                🎯 Center on Robot
              </button>
              <button @click="toggleTrail" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm">
                {{ showTrail ? '👁️ Hide Trail' : '👁️ Show Trail' }}
              </button>
              <button @click="clearTrail" class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm">
                🗑️ Clear Trail
              </button>
              <button @click="saveCurrentTrail" class="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded text-sm">
                💾 Save Current
              </button>
              <button @click="showHistoryModal = true" class="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm">
                📜 View History
              </button>
            </div>
              <div class="text-sm text-gray-600 mt-2 text-center">
                Live Trail Points: {{ trailPoints.length }} | Last Update: {{ formatTimestamp(gpsData.timestamp) }}
              </div>
            </div>

          <div
            class="lg:col-span-1 bg-gray-900 rounded-lg shadow-md p-6 text-white flex flex-col items-center justify-center relative overflow-hidden"
          >
            <div class="absolute top-4 right-4 flex space-x-2 z-10">
              <button
                @click="toggleFullscreen"
                class="bg-gray-700 p-2 rounded-full hover:bg-gray-600"
              >
                <i class="bx bx-fullscreen text-xl"></i>
              </button>
            </div>
            <webrtc 
              v-if="connectionStatus === 'Connected'"
              class="w-full h-auto object-contain rounded-lg border-2 border-gray-700"
            />
            <div v-else class="text-center">
              <i class="bx bx-video-off text-6xl text-gray-400 mb-4"></i>
              <p class="text-xl font-semibold mb-2">Camera Feed Unavailable</p>
              <p class="text-sm text-gray-400">Not connected to robot or stream error</p>
            </div>
          </div>

          <div class="lg:col-span-1 bg-white rounded-lg shadow-md p-6 flex flex-col">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Movement Controls</h3>
            
            <div class="mb-4">
              <label class="flex items-center space-x-3 cursor-pointer p-3 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors">
                <input 
                  type="checkbox" 
                  :checked="uiControlEnabled" 
                  @change="toggleUIControl"
                  class="w-5 h-5"
                >
                <span class="font-medium text-gray-700">Enable UI Control (disables joystick)</span>
              </label>
            </div>

            <div class="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div class="text-sm font-semibold text-yellow-800 mb-2">
                ⚠️ SAFETY: Hold <kbd class="px-2 py-1 bg-gray-200 rounded text-xs font-mono">{{ safetyKey }}</kbd> key or safety button while using controls
              </div>
              <div class="text-sm font-medium" :class="{ 'text-green-600': safetyButtonPressed && uiControlEnabled, 'text-red-600': !safetyButtonPressed || !uiControlEnabled }">
                Status: {{ getSafetyStatusText() }}
              </div>
            </div>

            <div class="mb-4 text-center">
              <button 
                @mousedown="activateVirtualSafety"
                @mouseup="deactivateVirtualSafety"
                @mouseleave="deactivateVirtualSafety"
                @touchstart="activateVirtualSafety"
                @touchend="deactivateVirtualSafety"
                :class="{ 
                  'bg-green-500 border-green-400 hover:bg-green-600': virtualSafetyPressed,
                  'bg-red-500 border-red-400 hover:bg-red-600': !virtualSafetyPressed,
                  'opacity-50 cursor-not-allowed': !uiControlEnabled
                }"
                class="w-full py-3 px-4 text-white font-bold rounded-lg border-2 transition-all duration-200 text-sm"
                :disabled="!uiControlEnabled"
              >
                🛡️ {{ virtualSafetyPressed ? 'SAFETY ACTIVE' : 'HOLD FOR SAFETY' }}
              </button>
              <div class="text-xs text-gray-500 mt-2">Hold this button for touchscreen control</div>
            </div>

            <div
              class="flex-grow flex flex-col items-center justify-center p-6 rounded-lg border border-gray-200"
              :class="{ 'opacity-30': !uiControlEnabled || !safetyButtonPressed }"
            >
              <div v-if="!safetyButtonPressed && uiControlEnabled" class="mb-4 p-2 bg-blue-50 rounded-lg text-center">
                <div class="text-sm text-blue-600 font-medium">👆 Hold the safety button above, then use these controls</div>
              </div>
              <div class="grid grid-rows-3 grid-cols-3 gap-3 w-full max-w-xs">
                <div></div>
                <button
                  class="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors active:bg-blue-700"
                  @mousedown="startMovement(maxLinearSpeed, 0)"
                  @mouseup="stopMovement"
                  @mouseleave="stopMovement"
                  @touchstart="startMovement(maxLinearSpeed, 0)"
                  @touchend="stopMovement"
                  :disabled="!uiControlEnabled || !safetyButtonPressed"
                  :class="{ 'opacity-50 cursor-not-allowed': !uiControlEnabled || !safetyButtonPressed }"
                >
                  <i class="bx bx-up-arrow-alt"></i>
                </button>
                <div></div>
                <button
                  class="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors active:bg-blue-700"
                  @mousedown="startMovement(0, maxAngularSpeed)"
                  @mouseup="stopMovement"
                  @mouseleave="stopMovement"
                  @touchstart="startMovement(0, maxAngularSpeed)"
                  @touchend="stopMovement"
                  :disabled="!uiControlEnabled || !safetyButtonPressed"
                  :class="{ 'opacity-50 cursor-not-allowed': !uiControlEnabled || !safetyButtonPressed }"
                >
                  <i class="bx bx-left-arrow-alt"></i>
                </button>
                <div></div>
                <button
                  class="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors active:bg-blue-700"
                  @mousedown="startMovement(0, -maxAngularSpeed)"
                  @mouseup="stopMovement"
                  @mouseleave="stopMovement"
                  @touchstart="startMovement(0, -maxAngularSpeed)"
                  @touchend="stopMovement"
                  :disabled="!uiControlEnabled || !safetyButtonPressed"
                  :class="{ 'opacity-50 cursor-not-allowed': !uiControlEnabled || !safetyButtonPressed }"
                >
                  <i class="bx bx-right-arrow-alt"></i>
                </button>
                <div></div>
                <button
                  class="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors active:bg-blue-700"
                  @mousedown="startMovement(-maxLinearSpeed, 0)"
                  @mouseup="stopMovement"
                  @mouseleave="stopMovement"
                  @touchstart="startMovement(-maxLinearSpeed, 0)"
                  @touchend="stopMovement"
                  :disabled="!uiControlEnabled || !safetyButtonPressed"
                  :class="{ 'opacity-50 cursor-not-allowed': !uiControlEnabled || !safetyButtonPressed }"
                >
                  <i class="bx bx-down-arrow-alt text-2xl"></i>
                </button>
                <div></div>
              </div>
              
              <button 
                @click="emergencyStop" 
                :disabled="!uiControlEnabled" 
                class="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ⏹️ EMERGENCY STOP
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <i class="bx bx-car text-xl mr-2"></i>Drive-by-Wire Status
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="border border-blue-200 rounded-lg p-3">
                <p class="text-sm font-medium text-gray-700">Battery Voltage:</p>
                <p class="text-base font-bold text-gray-800">
                  {{ dbw.battery_voltage.toFixed(2) }} V
                </p>
              </div>
              <div class="border border-blue-200 rounded-lg p-3">
                <p class="text-sm font-medium text-gray-700">Battery Percentage:</p>
                <p class="text-base font-bold text-gray-800">{{ batteryPercentage.toFixed(0) }}%</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <i class="bx bx-tachometer text-xl mr-2"></i>Motion Feedback
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="border border-blue-200 rounded-lg p-3 md:col-span-2">
                <p class="text-sm font-medium text-gray-700">Speed:</p>
                <p class="text-base font-bold text-gray-800">{{ motion.speed.toFixed(2) }} m/s</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ROSLIB from 'roslib'
import { ref, watch, defineProps, defineEmits, onMounted, onUnmounted, computed, nextTick } from 'vue'
import webrtc from '../components/webrtc.vue'
const props = defineProps({
  ugvId: String,
})

const emit = defineEmits(['back-to-overview'])

// Kalman Filter for GPS Smoothing
let kalmanFilter = {
  R: 0.00001,
  Q: 0.0001,
  A: 1,
  B: 0,
  C: 1,
  cov: null,
  x: null,

  init: function(initialValue) {
    this.x = initialValue;
    this.cov = 1;
  },

  filter: function(measurement) {
    if (this.x === null) {
      this.init(measurement);
      return measurement;
    }
    
    // Prediction
    const predX = this.A * this.x;
    const predCov = this.A * this.cov * this.A + this.R;

    // Correction
    const K = predCov * this.C * (1 / (this.C * predCov * this.C + this.Q));
    this.x = predX + K * (measurement - this.C * predX);
    this.cov = predCov - K * this.C * predCov;

    return this.x;
  }
};

let kfLat = Object.assign({}, kalmanFilter);
let kfLng = Object.assign({}, kalmanFilter);

// Fullscreen state
const isFullscreen = ref(false)

// Connection status
const connectionStatus = ref('Disconnected')

// GPS data
const gpsData = ref({
  latitude: 0,
  longitude: 0,
  altitude: 0,
  status: 0,
  service: 0,
  position_covariance: [],
  timestamp: null
})

// Trail History Management
const showHistoryModal = ref(false);
const trailHistory = ref([]);
let historicalTrailPolyline = null;

// Map-related variables
let map = null
let robotMarker = null
let trailPolyline = null
let fullscreenMap = null
let fullscreenRobotMarker = null
let fullscreenTrailPolyline = null
const trailPoints = ref([])
const showTrail = ref(true)

// Movement control variables
const isMoving = ref(false)
const currentLinear = ref(0)
const currentAngular = ref(0)
const targetLinear = ref(0)
const targetAngular = ref(0)
let movementInterval = null

// UI Control and Safety System
const uiControlEnabled = ref(false)
const safetyButtonPressed = ref(false)
const keyboardSafetyPressed = ref(false)
const virtualSafetyPressed = ref(false)
const safetyKey = ref('Shift')

// Status data
const dbw = ref({
  piu_state: 'Unknown',
  battery_voltage: 0,
  battery_current: 0,
  estop_trigger: false,
  front_md_fault: 'Unknown',
  rear_md_fault: 'Unknown',
})

const motion = ref({
  left_encoder_ticks: 0,
  right_encoder_ticks: 0,
  front_left_rpm: 0,
  rear_right_rpm: 0,
  speed: 0,
  left_wheel_speed_mps: 0,
  right_wheel_speed_mps: 0,
})

const joystick = ref({
  connection: 'Unknown',
  mode: 'Unknown',
})

// Computed property for battery percentage
const batteryPercentage = computed(() => {
  const voltage = dbw.value.battery_voltage
  const minVoltage = 10.0
  const maxVoltage = 12.0
  const percentage = ((voltage - minVoltage) / (maxVoltage - minVoltage)) * 100
  return Math.max(0, Math.min(100, percentage))
})

// Adjustable parameters
const commandRate = ref(50)
const accelerationStep = ref(0.1)
const accelerationRate = ref(2.0)
const maxLinearSpeed = ref(1.0)
const maxAngularSpeed = ref(1.0)

// ROS connection setup
const ROBOT_IP = '192.168.100.5'
let ros = null
let cmdVel = null

// Trail History Functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

const loadTrailHistory = () => {
  const savedHistory = localStorage.getItem(`trailHistory_${props.ugvId}`);
  if (savedHistory) {
    try {
      trailHistory.value = JSON.parse(savedHistory);
    } catch(e) {
      console.error("Could not parse saved trail history", e);
      trailHistory.value = [];
    }
  }
};

const saveTrailHistory = () => {
  localStorage.setItem(`trailHistory_${props.ugvId}`, JSON.stringify(trailHistory.value));
};

const saveCurrentTrail = () => {
  if (trailPoints.value.length < 2) {
    alert("Not enough points in the current trail to save.");
    return;
  }
  
  const trailName = prompt("Enter a name for this trail:", `Trail - ${new Date().toLocaleString()}`);
  if (trailName) {
    const newTrail = {
      id: Date.now().toString(),
      name: trailName,
      date: new Date().toISOString(),
      points: JSON.parse(JSON.stringify(trailPoints.value)),
      editing: false
    };
    
    trailHistory.value.unshift(newTrail);
    saveTrailHistory();
    alert(`Trail "${trailName}" saved!`);
  }
};

const deleteFromHistory = (trailId) => {
  if (confirm("Are you sure you want to delete this trail?")) {
    trailHistory.value = trailHistory.value.filter(trail => trail.id !== trailId);
    saveTrailHistory();
  }
};

const toggleEditTrail = (trail) => {
  trail.editing = !trail.editing;
  if (!trail.editing) {
    saveTrailHistory();
  }
};

const finishEditingTrail = (trail) => {
  trail.editing = false;
  saveTrailHistory();
};

const loadHistoricalTrail = (trailToLoad) => {
  if (typeof window.L === 'undefined') return;

  // Clear any previously loaded historical trail
  if (historicalTrailPolyline && map) {
    map.removeLayer(historicalTrailPolyline);
  }

  historicalTrailPolyline = window.L.polyline(trailToLoad.points, {
    color: '#8b5cf6',
    weight: 4,
    opacity: 0.8,
  }).addTo(map);

  // Fit map to the bounds of the loaded trail
  if(map) {
      map.fitBounds(historicalTrailPolyline.getBounds());
  }

  showHistoryModal.value = false;
};

// GPS utility functions
function getGpsStatusText() {
  const status = gpsData.value.status
  switch(status) {
    case 0: return 'No Fix'
    case 1: return 'GPS Fix'
    case 2: return 'DGPS Fix'
    case 3: return 'PPS Fix'
    case 4: return 'Real-time Kinematic'
    case 5: return 'Float RTK'
    case 6: return 'Dead Reckoning'
    case 7: return 'Manual Input'
    case 8: return 'Simulation'
    default: return `Unknown (${status})`
  }
}

function getGpsStatusClass() {
  const status = gpsData.value.status
  if (status >= 4) return 'text-green-600'
  if (status >= 1) return 'text-yellow-600'
  return 'text-red-600'
}

function getPositionAccuracy() {
  const cov = gpsData.value.position_covariance
  if (cov.length >= 9) {
    const horizontal_accuracy = Math.sqrt((cov[0] + cov[4]) / 2)
    return horizontal_accuracy.toFixed(2)
  }
  return 'N/A'
}

function formatTimestamp(timestamp) {
  if (!timestamp) return 'Never'
  const date = new Date(timestamp)
  return date.toLocaleTimeString()
}

// Enhanced map functions
function createRobotIcon() {
  if (typeof window.L === 'undefined') return null
  
  return window.L.divIcon({
    className: 'robot-marker',
    html: '<div class="robot-icon">🤖</div>',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  })
}

function createTrailPolyline() {
  if (typeof window.L === 'undefined') return null
  
  return window.L.polyline([], {
    color: '#007bff',
    weight: 3,
    opacity: 0.7
  })
}

async function initializeMapBase(mapId, defaultLat, defaultLng) {
  const L = window.L;
  const mapContainer = document.getElementById(mapId);
  if (mapContainer && !mapContainer._leaflet_id) {
    const newMap = L.map(mapId).setView([defaultLat, defaultLng], 18);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 22
    }).addTo(newMap);

    setTimeout(() => newMap.invalidateSize(), 100);
    return newMap;
  }
  return null;
}

// Map initialization and management
async function initializeMap() {
  await nextTick()  
  if (typeof window.L === 'undefined') {
    console.error('Leaflet not loaded yet');
    return;
  }
  
  const defaultLat = gpsData.value.latitude || 2.92012435
  const defaultLng = gpsData.value.longitude || 101.636099842

  if (map) map.remove();
  
  map = await initializeMapBase('gps-map-normal', defaultLat, defaultLng);
  
  if (map) {
      const robotIcon = createRobotIcon();
      if (robotIcon) robotMarker = L.marker([defaultLat, defaultLng], { icon: robotIcon }).addTo(map);
      
      trailPolyline = createTrailPolyline();
      if (trailPolyline) {
          trailPolyline.addTo(map);
          trailPolyline.setLatLngs([...trailPoints.value]);
      }
  }
}

async function initializeFullscreenMap() {
  await nextTick();
  if (typeof window.L === 'undefined') {
    console.error('Leaflet not loaded yet');
    return;
  }

  const defaultLat = gpsData.value.latitude || 2.92012435;
  const defaultLng = gpsData.value.longitude || 101.636099842;
  
  if (fullscreenMap) fullscreenMap.remove();

  fullscreenMap = await initializeMapBase('gps-map-fullscreen', defaultLat, defaultLng);

  if (fullscreenMap) {
      const robotIcon = createRobotIcon();
      if (robotIcon) fullscreenRobotMarker = L.marker([defaultLat, defaultLng], { icon: robotIcon }).addTo(fullscreenMap);
      
      fullscreenTrailPolyline = createTrailPolyline();
      if (fullscreenTrailPolyline) {
          fullscreenTrailPolyline.setLatLngs([...trailPoints.value]);
          if (showTrail.value) fullscreenTrailPolyline.addTo(fullscreenMap);
      }
  }
}

function updateMapLocation(lat, lng) {
  const newPosition = [lat, lng]
  
  // Update normal map robot marker position
  if (robotMarker) {
    robotMarker.setLatLng(newPosition)
  }
  
  // Update fullscreen robot marker if it exists
  if (fullscreenRobotMarker) {
    fullscreenRobotMarker.setLatLng(newPosition)
  }
  
  if (showTrail.value) {
    const lastPoint = trailPoints.value[trailPoints.value.length - 1]
    if (!lastPoint || 
        Math.abs(lastPoint[0] - lat) > 0.00001 || 
        Math.abs(lastPoint[1] - lng) > 0.00001) {
      
      trailPoints.value.push(newPosition)
      
      // Limit trail points
      if (trailPoints.value.length > 2000) {
        trailPoints.value.shift()
      }
      
      if (trailPolyline) trailPolyline.setLatLngs([...trailPoints.value]);
      if (fullscreenTrailPolyline) fullscreenTrailPolyline.setLatLngs([...trailPoints.value]);

      localStorage.setItem(`trail_${props.ugvId}`, JSON.stringify(trailPoints.value));
    }
  }
}

function centerMapOnRobot() {
  // Center main map
  if (map && robotMarker) {
    const position = robotMarker.getLatLng()
    map.setView([position.lat, position.lng], map.getZoom())
  }
  
  // Center fullscreen map if it exists
  if (fullscreenMap && fullscreenRobotMarker) {
    const fullscreenPosition = fullscreenRobotMarker.getLatLng()
    fullscreenMap.setView([fullscreenPosition.lat, fullscreenPosition.lng], fullscreenMap.getZoom())
  }
}

function toggleTrail() {
  showTrail.value = !showTrail.value
  
  if (map && trailPolyline) {
    if (showTrail.value) {
      trailPolyline.addTo(map)
    } else {
      map.removeLayer(trailPolyline)
    }
  }
  
  if (fullscreenMap && fullscreenTrailPolyline) {
    if (showTrail.value) {
      fullscreenTrailPolyline.addTo(fullscreenMap)
    } else {
      fullscreenMap.removeLayer(fullscreenTrailPolyline)
    }
  }
}

function clearTrail() {
  trailPoints.value = []
  if (trailPolyline) trailPolyline.setLatLngs([]);
  if (fullscreenTrailPolyline) fullscreenTrailPolyline.setLatLngs([]);
  localStorage.removeItem(`trail_${props.ugvId}`);
}

// Safety System Functions
function activateVirtualSafety(event) {
  event.preventDefault()
  virtualSafetyPressed.value = true
  updateSafetyState()
}

function deactivateVirtualSafety(event) {
  event.preventDefault()
  virtualSafetyPressed.value = false
  updateSafetyState()
  if (!keyboardSafetyPressed.value) {
    targetLinear.value = 0
    targetAngular.value = 0
  }
}

function updateSafetyState() {
  safetyButtonPressed.value = keyboardSafetyPressed.value || virtualSafetyPressed.value
}

function getSafetyStatusText() {
  if (!uiControlEnabled.value) return 'UI Control Disabled'
  if (safetyButtonPressed.value) {
    if (virtualSafetyPressed.value && keyboardSafetyPressed.value) {
      return 'ARMED - Both virtual and keyboard safety active'
    } else if (virtualSafetyPressed.value) {
      return 'ARMED - Virtual safety button held'
    } else if (keyboardSafetyPressed.value) {
      return 'ARMED - Keyboard safety key held'
    }
    return 'ARMED - Robot can move'
  }
  return 'SAFE - Hold safety button/key to enable movement'
}

function updateSafetyKey(key) {
  safetyKey.value = key
}

function toggleUIControl() {
  uiControlEnabled.value = !uiControlEnabled.value
  
  if (!uiControlEnabled.value) {
    emergencyStop()
  }
}

function emergencyStop() {
  targetLinear.value = 0
  targetAngular.value = 0
  currentLinear.value = 0
  currentAngular.value = 0
  isMoving.value = false
  
  if (movementInterval) {
    clearInterval(movementInterval)
    movementInterval = null
  }
  
  if (uiControlEnabled.value && cmdVel && ros && ros.isConnected) {
    sendCmd(0, 0)
  }
}

// Enhanced Fullscreen toggle function
const toggleFullscreen = async () => {
  isFullscreen.value = !isFullscreen.value

  if (isFullscreen.value) {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    setTimeout(initializeFullscreenMap, 200)
  } else {
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('keyup', handleKeyUp)
    stopMovement()
    
    if (fullscreenMap) {
      fullscreenMap.remove()
      fullscreenMap = null
      fullscreenRobotMarker = null
      fullscreenTrailPolyline = null
    }
    
    setTimeout(async () => {
      await initializeMap()
      if (gpsData.value.latitude && gpsData.value.longitude) {
        updateMapLocation(gpsData.value.latitude, gpsData.value.longitude)
      }
    }, 300)
  }
}

const initializeRos = () => {
  if (ros && ros.isConnected) {
    ros.close()
  }
  ros = new ROSLIB.Ros({
    url: `ws://${ROBOT_IP}:9090`,
  })

  // ROS connection event handlers
  ros.on('connection', () => {
    console.log('✅ Connected to ROS')
    connectionStatus.value = 'Connected'
    startPublishing()
  })

  ros.on('error', (error) => {
    console.error('❌ Error connecting to ROS:', error)
    connectionStatus.value = 'Error'
    stopPublishing()
  })

  ros.on('close', () => {
    console.log('🔌 Connection to ROS closed')
    connectionStatus.value = 'Disconnected'
    stopPublishing()
  })

  // Define the /cmd_vel publisher
  cmdVel = new ROSLIB.Topic({
    ros,
    name: '/cmd_vel_ui',
    messageType: 'geometry_msgs/msg/Twist',
  })

  const rtkTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/rtklib_nav',
    messageType: 'rtklib_msgs/msg/RtklibNav'
  })

  rtkTopic.subscribe((msg) => {
    const smoothedLat = kfLat.filter(msg.status.latitude);
    const smoothedLng = kfLng.filter(msg.status.longitude);
    
    gpsData.value = {
        ...gpsData.value,
        latitude: smoothedLat,
        longitude: smoothedLng,
        altitude: msg.status.altitude,
        status: msg.status.status.status,
        service: msg.status.status.service,
        position_covariance: msg.status.position_covariance,
        timestamp: Date.now()
    };
    
    updateMapLocation(smoothedLat, smoothedLng);
  })

  const dbwTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/piu_dbw_feedback',
    messageType: 'rdc_dbw_interface/msg/DriveByWireStatus',
  })

  dbwTopic.subscribe((msg) => {
    dbw.value.battery_voltage = msg.battery_voltage
  })

  const motionTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/piu_motion_feedback',
    messageType: 'rdc_dbw_interface/msg/Encoder',
  })

  motionTopic.subscribe((msg) => {
    motion.value.speed = msg.speed
  })

  const joystickConnTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/joystick_conn',
    messageType: 'std_msgs/msg/Bool',
  })

  joystickConnTopic.subscribe((msg) => {
    joystick.value.connection = msg.data ? 'Connected' : 'Disconnected'
  })

  const joystickModeTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/joystick/mode',
    messageType: 'std_msgs/msg/String',
  })

  joystickModeTopic.subscribe((msg) => {
    joystick.value.mode = msg.data
  })

  imageListener.subscribe(function (message) {
    const imageData =
      'data:image/jpeg;base64,' + btoa(String.fromCharCode.apply(null, message.data))
    cameraUrl.value = imageData
  })
}

let publishingInterval = null

function startPublishing() {
  if (publishingInterval) {
    clearInterval(publishingInterval)
  }
  
  publishingInterval = setInterval(() => {
    if (!uiControlEnabled.value) return;

    const dt = commandRate.value / 1000;
    const accelerationStepVal = accelerationRate.value * dt;
    
    let newLinear = currentLinear.value;
    let newAngular = currentAngular.value;
    
    if (Math.abs(targetLinear.value - currentLinear.value) > accelerationStepVal) {
      newLinear += Math.sign(targetLinear.value - currentLinear.value) * accelerationStepVal;
    } else {
      newLinear = targetLinear.value;
    }
    
    if (Math.abs(targetAngular.value - currentAngular.value) > accelerationStepVal) {
      newAngular += Math.sign(targetAngular.value - currentAngular.value) * accelerationStepVal;
    } else {
      newAngular = targetAngular.value;
    }
    
    currentLinear.value = newLinear
    currentAngular.value = newAngular
    
    sendCmd(newLinear, newAngular)
  }, commandRate.value)
}

function stopPublishing() {
  if (publishingInterval) {
    clearInterval(publishingInterval)
    publishingInterval = null
  }
}

function sendCmd(linear, angular) {
  if (!cmdVel || !ros.isConnected) {
    console.warn('ROS not connected or cmdVel topic not initialized.')
    return
  }
  linear = Math.max(-maxLinearSpeed.value, Math.min(maxLinearSpeed.value, linear))
  angular = Math.max(-maxAngularSpeed.value, Math.min(maxAngularSpeed.value, angular))

  const twist = new ROSLIB.Message({
    linear: { x: linear, y: 0, z: 0 },
    angular: { x: 0, y: 0, z: angular },
  })
  cmdVel.publish(twist)
}

function startMovement(linear, angular) {
  if (!uiControlEnabled.value || !safetyButtonPressed.value) return;
  targetLinear.value = linear
  targetAngular.value = angular
  isMoving.value = true
}

function stopMovement() {
  if (!uiControlEnabled.value) return;
  targetLinear.value = 0
  targetAngular.value = 0
  isMoving.value = false
}

function handleKeyDown(event) {
  if (event.key === safetyKey.value || 
      (safetyKey.value === 'Shift' && ['ShiftLeft', 'ShiftRight'].includes(event.code)) ||
      (safetyKey.value === 'Control' && ['ControlLeft', 'ControlRight'].includes(event.code)) ||
      (safetyKey.value === 'Alt' && ['AltLeft', 'AltRight'].includes(event.code))) {
    event.preventDefault()
    keyboardSafetyPressed.value = true
    updateSafetyState()
    return
  }

  if (!uiControlEnabled.value || !safetyButtonPressed.value) return

  switch (event.key.toLowerCase()) {
    case 'w': case 'arrowup':
      event.preventDefault(); startMovement(maxLinearSpeed.value, 0); break;
    case 's': case 'arrowdown':
      event.preventDefault(); startMovement(-maxLinearSpeed.value, 0); break;
    case 'a': case 'arrowleft':
      event.preventDefault(); startMovement(0, maxAngularSpeed.value); break;
    case 'd': case 'arrowright':
      event.preventDefault(); startMovement(0, -maxAngularSpeed.value); break;
    case 'escape':
      if (isFullscreen.value) toggleFullscreen();
      break;
    case ' ':
      event.preventDefault(); emergencyStop(); break;
  }
}

function handleKeyUp(event) {
  if (event.key === safetyKey.value || 
      (safetyKey.value === 'Shift' && ['ShiftLeft', 'ShiftRight'].includes(event.code)) ||
      (safetyKey.value === 'Control' && ['ControlLeft', 'ControlRight'].includes(event.code)) ||
      (safetyKey.value === 'Alt' && ['AltLeft', 'AltRight'].includes(event.code))) {
    event.preventDefault()
    keyboardSafetyPressed.value = false
    updateSafetyState()
    stopMovement()
    return
  }

  if (!uiControlEnabled.value) return

  if (['w', 's', 'a', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(event.key.toLowerCase())) {
      event.preventDefault();
      stopMovement();
  }
}

function updateCommandRate(hz) {
  commandRate.value = 1000 / hz
  if (publishingInterval && connectionStatus.value === 'Connected') {
    startPublishing()
  }
}

function updateMaxLinearSpeed(speed) {
  maxLinearSpeed.value = parseFloat(speed)
}

function updateMaxAngularSpeed(speed) {
  maxAngularSpeed.value = parseFloat(speed)
}

watch(connectionStatus, (status) => {
  if (status !== 'Connected') {
    if (isFullscreen.value) {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
    stopMovement()
    emergencyStop()
  } else if (isFullscreen.value) {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
  }
})

// Watch for safety state changes
watch(safetyButtonPressed, (isPressed) => {
  if (!isPressed) {
    stopMovement()
  }
})

// Watch for fullscreen changes to handle map reinitialization
watch(isFullscreen, async (newValue) => {
  if (!newValue) {
    await nextTick()
    setTimeout(async () => {
      await initializeMap()
      if (gpsData.value.latitude && gpsData.value.longitude) {
        updateMapLocation(gpsData.value.latitude, gpsData.value.longitude)
      }
    }, 500)
  }
})

onMounted(async () => {
  // Load Leaflet CSS and JS
  const leafletCSS = document.createElement('link')
  leafletCSS.rel = 'stylesheet'
  leafletCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css'
  document.head.appendChild(leafletCSS)
  
  const leafletJS = document.createElement('script')
  leafletJS.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js'
  leafletJS.onload = () => {
    setTimeout(initializeMap, 100)
  }
  document.head.appendChild(leafletJS)

  if (props.ugvId) {
    // Load saved trail
    const savedTrail = localStorage.getItem(`trail_${props.ugvId}`);
    if (savedTrail) {
        try {
            trailPoints.value = JSON.parse(savedTrail);
        } catch(e) {
            console.error("Could not parse saved trail", e);
        }
    }
    
    // Load trail history
    loadTrailHistory();
    
    initializeRos()
  }
  
  // Add keyboard event listeners for normal mode
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
  if (movementInterval) clearInterval(movementInterval);
  stopPublishing()
  emergencyStop()
  if (ros && ros.isConnected) {
    sendCmd(0, 0)
    ros.close()
  }
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('keyup', handleKeyUp)
  
  if (map) map.remove();
  if (fullscreenMap) fullscreenMap.remove();
})
</script>

<style scoped>
.setting-item label {
  display: flex;
  align-items: center;
  font-weight: 500;
}

kbd {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 2px 6px;
  font-family: monospace;
  font-size: 12px;
  font-weight: bold;
}

.fixed {
  position: fixed;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.z-50 {
  z-index: 50;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button:disabled:hover {
  transform: none;
}

.safety-btn:active, 
.safety-btn.active {
  transform: scale(0.98);
}

.gps-map {
  width: 100%;
  height: 300px;
  border-radius: 8px;
  border: 2px solid #ddd;
  min-height: 200px;
}

:global(.robot-marker) {
  background: none !important;
  border: none !important;
}

:global(.robot-icon) {
  font-size: 24px;
  text-align: center;
  line-height: 30px;
  background: white;
  border: 2px solid #007bff;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.text-green-600 {
  color: #16a34a;
  font-weight: bold;
}

.text-yellow-600 {
  color: #ca8a04;
  font-weight: bold;
}

.text-red-600 {
  color: #dc2626;
  font-weight: bold;
}
</style>