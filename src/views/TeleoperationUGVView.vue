//teleoperationUGVView.vue
<template>
  <div class="p-6 bg-gray-50 min-h-screen font-sans">
    <div v-if="!ugvId">
      <div
        class="flex flex-col items-center justify-center text-center p-20 bg-white rounded-lg shadow-md"
      >
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
          <div class="border border-blue-200 rounded-lg p-4">
            <p class="text-sm font-medium text-gray-700">Current Speed:</p>
            <p class="text-sm text-gray-800">Linear={{ motion.speed.toFixed(2) }} m/s,</p>
            <p class="text-sm text-gray-800">Angular={{ currentAngular.toFixed(2) }} rad/s</p>
          </div>
        </div>

        <div v-if="refreshCountdown > 0" class="border-t pt-4">
          <div class="refresh-notification">🔄 Auto-refreshing in {{ refreshCountdown }}s...</div>
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
                <div
                  class="relative flex-grow bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center"
                >
                  <img
                    src="https://placehold.co/400x300/E0E0E0/555555?text=Map+Placeholder"
                    alt="Map Placeholder"
                    class="w-full h-full object-cover"
                  />
                  <div class="absolute top-2 left-2 flex flex-col space-y-1 z-10">
                    <button class="bg-white p-1 rounded shadow-md text-gray-700 hover:bg-gray-100">
                      <i class="bx bx-plus text-sm"></i>
                    </button>
                    <button class="bg-white p-1 rounded shadow-md text-gray-700 hover:bg-gray-100">
                      <i class="bx bx-minus text-sm"></i>
                    </button>
                  </div>
                  <div class="absolute bottom-1 left-1 text-xs text-gray-600 z-10">
                    © Leaflet | © OpenStreetMap
                  </div>
                  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <i class="bx bx-current-location text-green-600 text-2xl"></i>
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
              <img
                :src="cameraUrl"
                alt="UGV Camera Feed"
                class="w-full h-full object-cover rounded-lg"
                v-if="connectionStatus === 'Connected'"
              />
              <div v-else class="absolute inset-0 flex items-center justify-center text-center text-white">
                <i class="bx bx-video-off text-6xl text-gray-400 mb-4"></i>
                <div>
                  <p class="text-xl font-semibold mb-2">Camera Feed Unavailable</p>
                  <p class="text-sm text-gray-400">Not connected to robot or stream error</p>
                </div>
              </div>

              <div class="absolute inset-0 flex items-end justify-center z-10 pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" class="absolute inset-0">
                  <path d="M 50 100 L 40 80 A 15 15 0 0 1 60 80 L 50 100" fill="rgba(255, 255, 255, 0.3)" stroke="white" stroke-width="0.5" stroke-dasharray="1, 1"/>
                  <path d="M 40 80 L 30 65 A 30 30 0 0 1 70 65 L 60 80" fill="transparent" stroke="yellow" stroke-width="0.5" stroke-dasharray="1, 1"/>
                  <path d="M 30 65 L 20 50 A 50 50 0 0 1 80 50 L 70 65" fill="transparent" stroke="red" stroke-width="0.5" stroke-dasharray="1, 1"/>
                </svg>
              </div>
            </div>

            <div
              v-if="latencyMs !== null"
              class="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded"
            >
              <p class="text-sm">
                Latency: <span class="font-medium">{{ latencyMs.toFixed(2) }} ms</span>
              </p>
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
            <div
              class="relative flex-grow bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center"
            >
              <img
                src="https://placehold.co/400x300/E0E0E0/555555?text=Map+Placeholder"
                alt="Map Placeholder"
                class="w-full h-full object-cover"
              />
              <div class="absolute top-2 left-2 flex flex-col space-y-1 z-10">
                <button class="bg-white p-1.5 rounded-md shadow-md text-gray-700 hover:bg-gray-100">
                  <i class="bx bx-plus text-lg"></i>
                </button>
                <button class="bg-white p-1.5 rounded-md shadow-md text-gray-700 hover:bg-gray-100">
                  <i class="bx bx-minus text-lg"></i>
                </button>
              </div>
              <div class="absolute bottom-2 left-2 text-xs text-gray-600 z-10">
                © Leaflet | © OpenStreetMap contributors
              </div>
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <i class="bx bx-current-location text-green-600 text-3xl"></i>
              </div>
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
            <img
              :src="cameraUrl"
              alt="UGV Camera Feed"
              class="w-full h-auto object-contain rounded-lg border-2 border-gray-700"
              v-if="connectionStatus === 'Connected'"
            />
            <div v-else class="text-center">
              <i class="bx bx-video-off text-6xl text-gray-400 mb-4"></i>
              <p class="text-xl font-semibold mb-2">Camera Feed Unavailable</p>
              <p class="text-sm text-gray-400">Not connected to robot or stream error</p>
            </div>
            <div v-if="latencyMs !== null" class="mt-4 text-sm">
              <p>
                Latency: <span class="font-medium">{{ latencyMs.toFixed(2) }} ms</span>
              </p>
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
                  <i class="bx bx-down-arrow-alt"></i>
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

        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <i class="bx bx-cog text-xl mr-2"></i>Movement Settings
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="setting-item flex items-center">
              <label for="commandRateSelect" class="text-gray-700 mr-2">Command Rate (Hz):</label>
              <select
                id="commandRateSelect"
                @change="updateCommandRate($event.target.value)"
                class="form-select border border-gray-300 rounded-md p-2"
              >
                <option value="20" :selected="commandRate === 50">20 Hz (50ms)</option>
                <option value="10" :selected="commandRate === 100">10 Hz (100ms)</option>
                <option value="30" :selected="commandRate === 33">30 Hz (33ms)</option>
                <option value="50" :selected="commandRate === 20">50 Hz (20ms)</option>
              </select>
            </div>
            <div class="setting-item flex items-center">
              <label for="maxLinearSpeedRange" class="text-gray-700 mr-2">Max Linear Speed:</label>
              <input
                type="range"
                id="maxLinearSpeedRange"
                min="0.1"
                max="2.0"
                step="0.1"
                :value="maxLinearSpeed"
                @input="updateMaxLinearSpeed($event.target.value)"
                class="flex-grow"
              />
              <span class="ml-2 font-medium text-blue-600"
                >{{ maxLinearSpeed.toFixed(1) }} m/s</span
              >
            </div>
            <div class="setting-item flex items-center">
              <label for="maxAngularSpeedRange" class="text-gray-700 mr-2"
                >Max Angular Speed:</label
              >
              <input
                type="range"
                id="maxAngularSpeedRange"
                min="0.1"
                max="2.0"
                step="0.1"
                :value="maxAngularSpeed"
                @input="updateMaxAngularSpeed($event.target.value)"
                class="flex-grow"
              />
              <span class="ml-2 font-medium text-blue-600"
                >{{ maxAngularSpeed.toFixed(1) }} rad/s</span
              >
            </div>
            <div class="setting-item flex items-center">
              <label for="safetyKeySelect" class="text-gray-700 mr-2">Safety Key:</label>
              <select
                id="safetyKeySelect"
                @change="updateSafetyKey($event.target.value)"
                class="form-select border border-gray-300 rounded-md p-2"
              >
                <option value="Shift" :selected="safetyKey === 'Shift'">Shift (Left or Right)</option>
                <option value="Control" :selected="safetyKey === 'Control'">Ctrl (Left or Right)</option>
                <option value="Alt" :selected="safetyKey === 'Alt'">Alt (Left or Right)</option>
                <option value=" " :selected="safetyKey === ' '">Spacebar</option>
                <option value="x" :selected="safetyKey === 'x'">X Key</option>
                <option value="z" :selected="safetyKey === 'z'">Z Key</option>
              </select>
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
                <p class="text-sm font-medium text-gray-700">PIU State:</p>
                <p class="text-base font-bold text-gray-800">{{ dbw.piu_state }}</p>
              </div>
              <div class="border border-blue-200 rounded-lg p-3">
                <p class="text-sm font-medium text-gray-700">Battery Voltage:</p>
                <p class="text-base font-bold text-gray-800">
                  {{ dbw.battery_voltage.toFixed(2) }} V
                </p>
              </div>
              <div class="border border-blue-200 rounded-lg p-3">
                <p class="text-sm font-medium text-gray-700">Battery Current:</p>
                <p class="text-base font-bold text-gray-800">
                  {{ dbw.battery_current.toFixed(2) }} A
                </p>
              </div>
              <div class="border border-blue-200 rounded-lg p-3">
                <p class="text-sm font-medium text-gray-700">Battery Percentage:</p>
                <p class="text-base font-bold text-gray-800">{{ batteryPercentage.toFixed(0) }}%</p>
              </div>
              <div class="border border-blue-200 rounded-lg p-3">
                <p class="text-sm font-medium text-gray-700">Estop Triggered:</p>
                <p
                  class="text-base font-bold"
                  :class="dbw.estop_trigger ? 'text-red-600' : 'text-green-600'"
                >
                  {{ dbw.estop_trigger ? 'YES' : 'NO' }}
                </p>
              </div>
              <div class="border border-blue-200 rounded-lg p-3">
                <p class="text-sm font-medium text-gray-700">Front Motor Fault:</p>
                <p class="text-base font-bold text-gray-800">{{ dbw.front_md_fault }}</p>
              </div>
              <div class="border border-blue-200 rounded-lg p-3 md:col-span-2">
                <p class="text-sm font-medium text-gray-700">Rear Motor Fault:</p>
                <p class="text-base font-bold text-gray-800">{{ dbw.rear_md_fault }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <i class="bx bx-tachometer text-xl mr-2"></i>Motion Feedback
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="border border-blue-200 rounded-lg p-3">
                <p class="text-sm font-medium text-gray-700">Left Encoder Ticks:</p>
                <p class="text-base font-bold text-gray-800">{{ motion.left_encoder_ticks }}</p>
              </div>
              <div class="border border-blue-200 rounded-lg p-3">
                <p class="text-sm font-medium text-gray-700">Right Encoder Ticks:</p>
                <p class="text-base font-bold text-gray-800">{{ motion.right_encoder_ticks }}</p>
              </div>
              <div class="border border-blue-200 rounded-lg p-3">
                <p class="text-sm font-medium text-gray-700">Front Left RPM:</p>
                <p class="text-base font-bold text-gray-800">{{ motion.front_left_rpm }}</p>
              </div>
              <div class="border border-blue-200 rounded-lg p-3">
                <p class="text-sm font-medium text-gray-700">Rear Right RPM:</p>
                <p class="text-base font-bold text-gray-800">{{ motion.rear_right_rpm }}</p>
              </div>
              <div class="border border-blue-200 rounded-lg p-3">
                <p class="text-sm font-medium text-gray-700">Speed:</p>
                <p class="text-base font-bold text-gray-800">{{ motion.speed.toFixed(2) }} m/s</p>
              </div>
              <div class="border border-blue-200 rounded-lg p-3">
                <p class="text-sm font-medium text-gray-700">Left Wheel Speed:</p>
                <p class="text-base font-bold text-gray-800">
                  {{ motion.left_wheel_speed_mps.toFixed(2) }} m/s
                </p>
              </div>
              <div class="border border-blue-200 rounded-lg p-3 md:col-span-2">
                <p class="text-sm font-medium text-gray-700">Right Wheel Speed:</p>
                <p class="text-base font-bold text-gray-800">
                  {{ motion.right_wheel_speed_mps.toFixed(2) }} m/s
                </p>
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
import { ref, watch, defineProps, defineEmits, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  ugvId: String,
})

const emit = defineEmits(['back-to-overview'])

// Fullscreen state
const isFullscreen = ref(false)

// Camera configuration
const cameraUrl = ref(
  'http://192.168.100.5:8080/stream?topic=/zed2i/zed_node/rgb_raw/image_raw_color',
)
const latencyMs = ref(null)

// Connection status
const connectionStatus = ref('Disconnected')

// Auto-refresh functionality (always enabled)
const autoRefreshDelay = ref(3) // Fixed delay at 3 seconds
const refreshCountdown = ref(0)
let countdownInterval = null

// Movement control variables - Enhanced with safety system
const isMoving = ref(false)
const currentLinear = ref(0)
const currentAngular = ref(0)
const targetLinear = ref(0)
const targetAngular = ref(0)
let movementInterval = null

// UI Control and Safety System (from App.vue)
const uiControlEnabled = ref(false)
const safetyButtonPressed = ref(false) // Combined state (keyboard OR virtual)
const keyboardSafetyPressed = ref(false) // Track keyboard safety separately
const virtualSafetyPressed = ref(false) // Track virtual safety separately
const safetyKey = ref('Shift') // Default safety key

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
  const minVoltage = 10.0 // Assume 10V is 0%
  const maxVoltage = 12.0 // Assume 12V is 100%
  const percentage = ((voltage - minVoltage) / (maxVoltage - minVoltage)) * 100
  return Math.max(0, Math.min(100, percentage)) // Ensure the value is between 0 and 100
})

// Adjustable parameters
const commandRate = ref(50) // milliseconds (20Hz)
const accelerationStep = ref(0.1)
const accelerationRate = ref(2.0) // m/s² or rad/s² (from App.vue)
const maxLinearSpeed = ref(1.0)
const maxAngularSpeed = ref(1.0)

// ROS connection setup
const ROBOT_IP = '192.168.100.5' // Replace with your robot's IP
let ros = null
let cmdVel = null

// Safety System Functions (from App.vue)
function activateVirtualSafety(event) {
  event.preventDefault()
  virtualSafetyPressed.value = true
  updateSafetyState()
}

function deactivateVirtualSafety(event) {
  event.preventDefault()
  virtualSafetyPressed.value = false
  updateSafetyState()
  // Smooth deceleration when virtual safety is released
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
    // When disabling UI control, immediately stop the robot
    emergencyStop()
  }
}

function emergencyStop() {
  // Immediate stop - set both current and target to zero
  targetLinear.value = 0
  targetAngular.value = 0
  currentLinear.value = 0
  currentAngular.value = 0
  isMoving.value = false
  
  if (movementInterval) {
    clearInterval(movementInterval)
    movementInterval = null
  }
  
  // Always publish immediate stop command
  if (uiControlEnabled.value && cmdVel && ros && ros.isConnected) {
    sendCmd(0, 0)
  }
}

// Fullscreen toggle function
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value

  if (isFullscreen.value) {
    // Enable keyboard controls when entering fullscreen
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
  } else {
    // Remove keyboard controls when exiting fullscreen
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('keyup', handleKeyUp)
    stopMovement()
  }
}

const initializeRos = () => {
  if (ros && ros.isConnected) {
    ros.close() // Close existing connection if any
  }
  ros = new ROSLIB.Ros({
    url: `ws://${ROBOT_IP}:9090`,
  })

  // ROS connection event handlers
  ros.on('connection', () => {
    console.log('✅ Connected to ROS')
    connectionStatus.value = 'Connected'
    cancelAutoRefresh() // Cancel any pending refresh
    startPublishing() // Start continuous publishing with safety system
  })

  ros.on('error', (error) => {
    console.error('❌ Error connecting to ROS:', error)
    connectionStatus.value = 'Error'
    stopPublishing()
    startAutoRefresh() // Start auto-refresh on error
  })

  ros.on('close', () => {
    console.log('🔌 Connection to ROS closed')
    connectionStatus.value = 'Disconnected'
    stopPublishing()
    startAutoRefresh() // Start auto-refresh on disconnect
  })

  // Define the /cmd_vel publisher
  cmdVel = new ROSLIB.Topic({
    ros,
    name: '/cmd_vel_ui',
    messageType: 'geometry_msgs/msg/Twist',
  })

  // Setup ROS subscribers for status data
  // Drive-by-wire topic
  const dbwTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/piu_dbw_feedback',
    messageType: 'rdc_dbw_interface/msg/DriveByWireStatus',
  })

  dbwTopic.subscribe((msg) => {
    dbw.value.piu_state = msg.piu_state
    dbw.value.battery_voltage = msg.battery_voltage
    dbw.value.battery_current = msg.battery_current
    dbw.value.estop_trigger = msg.estop_trigger
    dbw.value.front_md_fault = msg.front_md_fault
    dbw.value.rear_md_fault = msg.rear_md_fault
  })

  // Motion topic
  const motionTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/piu_motion_feedback',
    messageType: 'rdc_dbw_interface/msg/Encoder',
  })

  motionTopic.subscribe((msg) => {
    motion.value.left_encoder_ticks = msg.left_encoder_ticks
    motion.value.right_encoder_ticks = msg.right_encoder_ticks
    motion.value.front_left_rpm = msg.front_left_rpm
    motion.value.rear_right_rpm = msg.rear_right_rpm
    motion.value.speed = msg.speed
    motion.value.left_wheel_speed_mps = msg.left_wheel_speed_mps
    motion.value.right_wheel_speed_mps = msg.right_wheel_speed_mps
  })

  // Joystick connection topic
  const joystickConnTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/joystick_conn',
    messageType: 'std_msgs/msg/Bool',
  })

  joystickConnTopic.subscribe((msg) => {
    joystick.value.connection = msg.data ? 'Connected' : 'Disconnected'
  })

  // Joystick mode topic
  const joystickModeTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/joystick/mode',
    messageType: 'std_msgs/msg/String',
  })

  joystickModeTopic.subscribe((msg) => {
    joystick.value.mode = msg.data
  })

  // Create a subscriber for the compressed image topic
  const imageListener = new ROSLIB.Topic({
    ros: ros,
    name: '/zed2i/zed_node/rgb/image_rect_color/compressed',
    messageType: 'sensor_msgs/CompressedImage',
  })

  imageListener.subscribe(function (message) {
    // 1. Get the ROS capture timestamp
    const robotCaptureTimeSec = message.header.stamp.sec
    const robotCaptureTimeNanosec = message.header.stamp.nanosec
    const robotCaptureTimeMs = robotCaptureTimeSec * 1000 + robotCaptureTimeNanosec / 1000000

    // 2. Get the current client-side time (when the message is received/about to be displayed)
    const clientReceiveTimeMs = Date.now() // Current time in milliseconds since epoch

    // Calculate the latency
    latencyMs.value = clientReceiveTimeMs - robotCaptureTimeMs

    // Now, render the image data
    const imageData =
      'data:image/jpeg;base64,' + btoa(String.fromCharCode.apply(null, message.data))
    cameraUrl.value = imageData
  })
}

// Auto-refresh functions (always enabled)
function startAutoRefresh() {
  console.log(`🔄 Starting auto-refresh countdown (${autoRefreshDelay.value}s)`)
  refreshCountdown.value = autoRefreshDelay.value

  countdownInterval = setInterval(() => {
    refreshCountdown.value--
    if (refreshCountdown.value <= 0) {
      clearInterval(countdownInterval)
      initializeRos() // Re-initialize the ROS connection instead of reloading the page
    }
  }, 1000)
}

function cancelAutoRefresh() {
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
  refreshCountdown.value = 0
  console.log('❌ Auto-refresh cancelled')
}

// Enhanced Publishing System (from App.vue)
let publishingInterval = null

function startPublishing() {
  if (publishingInterval) {
    clearInterval(publishingInterval)
  }
  
  publishingInterval = setInterval(() => {
    // Always publish if UI control is enabled (for smooth deceleration)
    if (!uiControlEnabled.value) {
      return // Don't publish if UI control is disabled
    }

    // Calculate acceleration step for this iteration
    const dt = commandRate.value / 1000 // Convert ms to seconds
    const accelerationStep = accelerationRate.value * dt
    
    // Smoothly approach target speeds
    let newLinear = currentLinear.value
    let newAngular = currentAngular.value
    
    // Linear acceleration
    if (Math.abs(targetLinear.value - currentLinear.value) > accelerationStep) {
      if (targetLinear.value > currentLinear.value) {
        newLinear = currentLinear.value + accelerationStep
      } else {
        newLinear = currentLinear.value - accelerationStep
      }
    } else {
      newLinear = targetLinear.value
    }
    
    // Angular acceleration
    if (Math.abs(targetAngular.value - currentAngular.value) > accelerationStep) {
      if (targetAngular.value > currentAngular.value) {
        newAngular = currentAngular.value + accelerationStep
      } else {
        newAngular = currentAngular.value - accelerationStep
      }
    } else {
      newAngular = targetAngular.value
    }
    
    // Update current values
    currentLinear.value = newLinear
    currentAngular.value = newAngular
    
    // Publish the command
    sendCmd(newLinear, newAngular)
  }, commandRate.value)
}

function stopPublishing() {
  if (publishingInterval) {
    clearInterval(publishingInterval)
    publishingInterval = null
  }
}

// Send Twist command
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

// Enhanced Movement Controls (from App.vue with safety integration)
function startMovement(linear, angular) {
  if (!uiControlEnabled.value || !safetyButtonPressed.value) return // Safety check
  
  targetLinear.value = linear
  targetAngular.value = angular
  isMoving.value = true
}

function stopMovement() {
  if (!uiControlEnabled.value) return // Don't process if UI control is disabled
  
  targetLinear.value = 0
  targetAngular.value = 0
  isMoving.value = false
}

// Enhanced Keyboard controls with safety system
function handleKeyDown(event) {
  // Handle safety key (dead man's switch)
  if (event.key === safetyKey.value || 
      (safetyKey.value === 'Shift' && (event.key === 'ShiftLeft' || event.key === 'ShiftRight')) ||
      (safetyKey.value === 'Control' && (event.key === 'ControlLeft' || event.key === 'ControlRight')) ||
      (safetyKey.value === 'Alt' && (event.key === 'AltLeft' || event.key === 'AltRight'))) {
    event.preventDefault()
    keyboardSafetyPressed.value = true
    updateSafetyState()
    return
  }

  if (!uiControlEnabled.value || !safetyButtonPressed.value) return

  switch (event.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      event.preventDefault()
      startMovement(maxLinearSpeed.value, 0)
      break
    case 'ArrowDown':
    case 's':
    case 'S':
      event.preventDefault()
      startMovement(-maxLinearSpeed.value, 0)
      break
    case 'ArrowLeft':
    case 'a':
    case 'A':
      event.preventDefault()
      startMovement(0, maxAngularSpeed.value)
      break
    case 'ArrowRight':
    case 'd':
    case 'D':
      event.preventDefault()
      startMovement(0, -maxAngularSpeed.value)
      break
    case 'Escape':
      if (isFullscreen.value) {
        toggleFullscreen()
      }
      break
    case ' ': // Spacebar for emergency stop
      event.preventDefault()
      emergencyStop()
      break
  }
}

function handleKeyUp(event) {
  // Handle safety key release (dead man's switch)
  if (event.key === safetyKey.value || 
      (safetyKey.value === 'Shift' && (event.key === 'ShiftLeft' || event.key === 'ShiftRight')) ||
      (safetyKey.value === 'Control' && (event.key === 'ControlLeft' || event.key === 'ControlRight')) ||
      (safetyKey.value === 'Alt' && (event.key === 'AltLeft' || event.key === 'AltRight'))) {
    event.preventDefault()
    keyboardSafetyPressed.value = false
    updateSafetyState()
    // Immediately stop movement when safety key is released
    stopMovement()
    return
  }

  if (!uiControlEnabled.value) return

  switch (event.key) {
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowLeft':
    case 'ArrowRight':
    case 'w':
    case 'W':
    case 's':
    case 'S':
    case 'a':
    case 'A':
    case 'd':
    case 'D':
      event.preventDefault()
      stopMovement()
      break
  }
}

// Settings update functions
function updateCommandRate(hz) {
  commandRate.value = 1000 / hz
  // Restart publishing with new rate if already running
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

// Watch for connection status changes to handle safety
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

onMounted(() => {
  if (props.ugvId) {
    initializeRos()
  }
  
  // Add keyboard event listeners for normal mode
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
  if (movementInterval) {
    clearInterval(movementInterval)
  }
  stopPublishing()
  cancelAutoRefresh()
  emergencyStop()
  if (ros && ros.isConnected) {
    sendCmd(0, 0)
    ros.close()
  }
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('keyup', handleKeyUp)
})
</script>

<style scoped>
/* Auto-refresh section styles */
.auto-refresh-section {
  padding-top: 10px;
}

.refresh-notification {
  background-color: #fff3cd;
  color: #856404;
  padding: 8px;
  border-radius: 6px;
  border-left: 4px solid #ffc107;
  font-weight: bold;
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

.setting-item label {
  display: flex;
  align-items: center;
  font-weight: 500;
}

/* Keyboard key styling */
kbd {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 2px 6px;
  font-family: monospace;
  font-size: 12px;
  font-weight: bold;
}

/* Fullscreen styles */
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

/* Enhanced button styles */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button:disabled:hover {
  transform: none;
}

/* Safety button specific styles */
.safety-btn:active, 
.safety-btn.active {
  transform: scale(0.98);
}
</style>