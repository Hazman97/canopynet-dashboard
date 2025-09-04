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
            <p class="text-sm font-medium text-gray-700">WebRTC Stream:</p>
            <p
              class="text-lg font-bold"
              :class="webrtcConnected ? 'text-green-600' : 'text-red-600'"
            >
              {{ webrtcConnected ? 'Connected' : 'Disconnected' }}
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
                </div>
                <div class="text-xs text-gray-400 mt-1 text-center">
                  Trail Points: {{ trailPoints.length }}
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

          <!-- WebRTC Video Stream (Fullscreen) -->
          <div class="flex-1 flex flex-col items-center justify-center relative rounded-lg shadow-md bg-gray-900 overflow-hidden">
            <div class="webrtc-container bg-black h-full w-full">
              <!-- Video Stream -->
              <div class="video-container h-full">
                <video 
                  ref="videoRef" 
                  autoplay 
                  playsinline 
                  controls 
                  muted
                  class="video-stream h-full w-full"
                  :class="{ 'streaming': isStreaming }"
                ></video>
                
                <div v-if="!isStreaming" class="video-placeholder">
                  <div class="placeholder-content">
                    <div class="camera-icon">📹</div>
                    <p>Click "Start Stream" to begin</p>
                  </div>
                </div>
              </div>

              <!-- Controls -->
              <div class="controls absolute bottom-4 left-4 right-4 flex justify-center gap-2">
                <button 
                  @click="startWebRTCConnection" 
                  :disabled="webrtcConnected || webrtcConnecting"
                  class="btn primary"
                >
                  <span v-if="webrtcConnecting">🔄 Connecting...</span>
                  <span v-else>▶️ Start Stream</span>
                </button>
                
                <button 
                  @click="stopWebRTCConnection" 
                  :disabled="!webrtcConnected"
                  class="btn secondary"
                >
                  ⏹️ Stop Stream
                </button>
                
                <button 
                  @click="toggleTestSource" 
                  :disabled="!webrtcConnected"
                  class="btn tertiary"
                >
                  {{ useTestSource ? '📹 Use ROS Camera' : '🎾 Use Test Pattern' }}
                </button>
              </div>

              <!-- Status Info -->
              <div class="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded text-sm">
                <div class="flex items-center gap-2">
                  <span :class="['status-dot', webrtcConnected ? 'connected' : 'disconnected']"></span>
                  WebRTC: {{ getWebRTCStatusText() }}
                </div>
                <div class="flex items-center gap-2 mt-1">
                  <span :class="['status-dot', wsConnected ? 'connected' : 'disconnected']"></span>
                  WebSocket: {{ wsConnected ? 'Connected' : 'Disconnected' }}
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
            </div>
            <div class="text-sm text-gray-600 mt-2 text-center">
              Trail Points: {{ trailPoints.length }} | Last Update: {{ formatTimestamp(gpsData.timestamp) }}
            </div>
          </div>

          <!-- WebRTC Video Stream (Normal View) -->
          <div class="lg:col-span-1 bg-gray-900 rounded-lg shadow-md p-6 text-white flex flex-col items-center justify-center relative overflow-hidden">
            <div class="absolute top-4 right-4 flex space-x-2 z-10">
              <button
                @click="toggleFullscreen"
                class="bg-gray-700 p-2 rounded-full hover:bg-gray-600"
              >
                <i class="bx bx-fullscreen text-xl"></i>
              </button>
            </div>
            
            <div class="webrtc-container h-full w-full">
              <!-- Video Stream -->
              <div class="video-container h-full">
                <video 
                  ref="videoRef" 
                  autoplay 
                  playsinline 
                  controls 
                  muted
                  class="video-stream h-full w-full"
                  :class="{ 'streaming': isStreaming }"
                ></video>
                
                <div v-if="!isStreaming" class="video-placeholder">
                  <div class="placeholder-content">
                    <div class="camera-icon">📹</div>
                    <p>Click "Start Stream" to begin</p>
                  </div>
                </div>
              </div>

              <!-- Controls -->
              <div class="controls absolute bottom-4 left-4 right-4 flex justify-center gap-2">
                <button 
                  @click="startWebRTCConnection" 
                  :disabled="webrtcConnected || webrtcConnecting"
                  class="btn primary text-sm"
                >
                  <span v-if="webrtcConnecting">🔄 Connecting...</span>
                  <span v-else>▶️ Start Stream</span>
                </button>
                
                <button 
                  @click="stopWebRTCConnection" 
                  :disabled="!webrtcConnected"
                  class="btn secondary text-sm"
                >
                  ⏹️ Stop
                </button>
                
                <button 
                  @click="toggleTestSource" 
                  :disabled="!webrtcConnected"
                  class="btn tertiary text-sm"
                >
                  {{ useTestSource ? '📹 Camera' : '🎾 Test' }}
                </button>
              </div>

              <!-- Status Info -->
              <div class="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded text-sm">
                <div class="flex items-center gap-2">
                  <span :class="['status-dot', webrtcConnected ? 'connected' : 'disconnected']"></span>
                  WebRTC: {{ getWebRTCStatusText() }}
                </div>
              </div>
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
              <div class="border border-blue-200 rounded-lg p-3">
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

const props = defineProps({
  ugvId: String,
})

const emit = defineEmits(['back-to-overview'])

// WebRTC variables (from WebRTC.vue)
const videoRef = ref(null)
const webrtcConnected = ref(false)
const webrtcConnecting = ref(false)
const wsConnected = ref(false)
const isStreaming = ref(false)
const connectionState = ref('new')
const iceConnectionState = ref('new')
const signalingState = ref('stable')
const messageCount = ref(0)
const useTestSource = ref(false)

let pc = null
let ws = null

// Update this with your robot's IP address
const SIGNALING_SERVER = "ws://192.168.100.5:8765"

// Fullscreen state
const isFullscreen = ref(false)

// Connection status
const connectionStatus = ref('Disconnected')

// GPS data (integrated from App.vue)
const gpsData = ref({
  latitude: 0,
  longitude: 0,
  altitude: 0,
  status: 0,
  service: 0,
  position_covariance: [],
  timestamp: null
})

// Map-related variables (integrated from App.vue)
let map = null
let robotMarker = null
let trailPolyline = null
let fullscreenMap = null
let fullscreenRobotMarker = null
let fullscreenTrailPolyline = null
const trailPoints = ref([])
const showTrail = ref(true)

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
  // PUI state, Battery Current, Estop Triggered, Front Motor Fault, Rear Motor Fault are removed
  battery_voltage: 0,
})

const motion = ref({
  // All features except speed are removed
  speed: 0,
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

// WebRTC Functions (from WebRTC.vue)
function getWebRTCStatusText() {
  const stateMap = {
    'new': '⚪ New',
    'connecting': '🔄 Connecting',
    'connected': '✅ Connected', 
    'disconnected': '⚠️ Disconnected',
    'failed': '❌ Failed',
    'closed': '⭕ Closed'
  }
  return stateMap[connectionState.value] || `❓ ${connectionState.value}`
}

function startWebRTCConnection() {
  if (webrtcConnected.value || webrtcConnecting.value) return

  console.log("🌐 Connecting to signaling server:", SIGNALING_SERVER)
  webrtcConnecting.value = true
  
  ws = new WebSocket(SIGNALING_SERVER)

  ws.onopen = () => {
    console.log("✅ Connected to signaling server")
    wsConnected.value = true
    webrtcConnecting.value = false
  }

  ws.onclose = () => {
    console.warn("⚠️ WebSocket closed")
    wsConnected.value = false
    webrtcConnected.value = false
    webrtcConnecting.value = false
    isStreaming.value = false
  }

  ws.onerror = (err) => {
    console.error("❌ WebSocket error:", err)
    webrtcConnecting.value = false
  }

  ws.onmessage = async (event) => {
    try {
      const msg = JSON.parse(event.data)
      console.log("📩 Received message:", msg.type)
      messageCount.value++

      if (msg.type === "offer") {
        console.log("📡 Handling offer from robot")
        await handleOffer(msg.sdp)
      } else if (msg.type === "ice") {
        console.log("🔹 Adding ICE candidate from robot")
        if (pc) {
          await pc.addIceCandidate(new RTCIceCandidate({
            candidate: msg.candidate,
            sdpMLineIndex: msg.sdpMLineIndex
          }))
          console.log("✅ ICE candidate added")
        }
      } else {
        console.warn("⚠️ Unknown message type:", msg.type)
      }
    } catch (err) {
      console.error("❌ Failed to parse WebSocket message:", err)
    }
  }

  createPeerConnection()
}

function stopWebRTCConnection() {
  if (pc) {
    pc.close()
    pc = null
  }
  if (ws) {
    ws.close()
    ws = null
  }
  
  webrtcConnected.value = false
  wsConnected.value = false
  isStreaming.value = false
  connectionState.value = 'closed'
  iceConnectionState.value = 'closed'
  
  if (videoRef.value) {
    videoRef.value.srcObject = null
  }
  
  console.log("🔌 Connection stopped")
}

function createPeerConnection() {
  pc = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" }
    ]
  })

  pc.onicecandidate = (event) => {
    if (event.candidate && ws && ws.readyState === WebSocket.OPEN) {
      console.log("🔹 Sending ICE candidate to robot")
      ws.send(JSON.stringify({
        type: "ice",
        candidate: event.candidate.candidate,
        sdpMLineIndex: event.candidate.sdpMLineIndex
      }))
    }
  }

  pc.ontrack = (event) => {
    console.log("🎥 Remote stream received")
    if (videoRef.value && event.streams[0]) {
      videoRef.value.srcObject = event.streams[0]
      isStreaming.value = true
    }
  }

  pc.onconnectionstatechange = () => {
    connectionState.value = pc.connectionState
    console.log("📶 PeerConnection state:", pc.connectionState)
    webrtcConnected.value = pc.connectionState === 'connected'
    
    if (pc.connectionState === 'connected') {
      isStreaming.value = true
    } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
      isStreaming.value = false
    }
  }

  pc.oniceconnectionstatechange = () => {
    iceConnectionState.value = pc.iceConnectionState
    console.log("❄️ ICE connection state:", pc.iceConnectionState)
  }

  pc.onsignalingstatechange = () => {
    signalingState.value = pc.signalingState
    console.log("📡 Signaling state:", pc.signalingState)
  }

  webrtcConnected.value = true
}

async function handleOffer(sdp) {
  if (!pc) return
  
  console.log("📡 Setting remote description")
  const desc = { type: "offer", sdp: sdp }
  await pc.setRemoteDescription(desc)
  console.log("✅ Remote description set")

  console.log("📡 Creating local answer")
  const answer = await pc.createAnswer()
  await pc.setLocalDescription(answer)
  console.log("✅ Local description (answer) set")

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: "answer",
      sdp: answer.sdp
    }))
    console.log("📤 Answer sent to robot")
  }
}

function toggleTestSource() {
  if (!ws || ws.readyState !== WebSocket.OPEN) return
  
  useTestSource.value = !useTestSource.value
  ws.send(JSON.stringify({
    type: "test_source",
    enable: useTestSource.value
  }))
  
  console.log(`🎾 Switched to ${useTestSource.value ? 'test pattern' : 'ROS camera'}`)
}

// GPS utility functions (integrated from App.vue)
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
  if (status >= 4) return 'text-green-600' // RTK quality
  if (status >= 1) return 'text-yellow-600' // Basic GPS fix
  return 'text-red-600' // No fix
}

function getPositionAccuracy() {
  // This function is removed as per the request to delete the Accuracy feature
  return 'N/A'
}

function formatTimestamp(timestamp) {
  if (!timestamp) return 'Never'
  const date = new Date(timestamp)
  return date.toLocaleTimeString()
}

// Enhanced map functions to fix the disappearing issue
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

// Map initialization and management (enhanced to fix the issue)
async function initializeMap() {
  await nextTick()
  
  // Wait for Leaflet to be available
  if (typeof window.L === 'undefined') {
    console.error('Leaflet not loaded yet')
    return
  }
  
  const L = window.L // Get Leaflet from global scope
  
  // Default to Malaysia coordinates if no GPS data yet
  const defaultLat = gpsData.value.latitude || 2.92012435
  const defaultLng = gpsData.value.longitude || 101.636099842
  
  // Try to initialize normal mode map first
  const normalMapContainer = document.getElementById('gps-map-normal')
  if (normalMapContainer && !normalMapContainer._leaflet_id) {
    // Clean up any existing map
    if (map) {
      map.remove()
      map = null
      robotMarker = null
      trailPolyline = null
    }
    
    // Initialize Leaflet map for normal mode
    map = L.map('gps-map-normal').setView([defaultLat, defaultLng], 18)
    
    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 22
    }).addTo(map)
    
    // Create robot marker
    const robotIcon = createRobotIcon()
    if (robotIcon) {
      robotMarker = L.marker([defaultLat, defaultLng], {
        icon: robotIcon
      }).addTo(map)
    }
    
    // Initialize trail polyline
    trailPolyline = createTrailPolyline()
    if (trailPolyline) {
      trailPolyline.addTo(map)
      // Update with existing trail points
      trailPolyline.setLatLngs([...trailPoints.value])
    }
    
    // Force map to resize after initialization
    setTimeout(() => {
      if (map) {
        map.invalidateSize()
      }
    }, 100)
  }
}

async function initializeFullscreenMap() {
  await nextTick()
  
  if (typeof window.L === 'undefined') {
    console.error('Leaflet not loaded yet')
    return
  }
  
  const L = window.L
  
  const fullscreenMapContainer = document.getElementById('gps-map-fullscreen')
  if (fullscreenMapContainer && !fullscreenMapContainer._leaflet_id) {
    // Clean up any existing fullscreen map
    if (fullscreenMap) {
      fullscreenMap.remove()
      fullscreenMap = null
      fullscreenRobotMarker = null
      fullscreenTrailPolyline = null
    }
    
    const defaultLat = gpsData.value.latitude || 2.92012435
    const defaultLng = gpsData.value.longitude || 101.636099842
    
    fullscreenMap = L.map('gps-map-fullscreen').setView([defaultLat, defaultLng], 18)
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 22
    }).addTo(fullscreenMap)
    
    const robotIcon = createRobotIcon()
    if (robotIcon) {
      fullscreenRobotMarker = L.marker([defaultLat, defaultLng], {
        icon: robotIcon
      }).addTo(fullscreenMap)
    }
    
    fullscreenTrailPolyline = createTrailPolyline()
    if (fullscreenTrailPolyline) {
      fullscreenTrailPolyline.setLatLngs([...trailPoints.value])
      if (showTrail.value) {
        fullscreenTrailPolyline.addTo(fullscreenMap)
      }
    }
    
    // Force map to resize after initialization
    setTimeout(() => {
      if (fullscreenMap) {
        fullscreenMap.invalidateSize()
      }
    }, 100)
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
  
  // Add to trail if enabled and position has changed significantly
  if (showTrail.value) {
    const lastPoint = trailPoints.value[trailPoints.value.length - 1]
    if (!lastPoint || 
        Math.abs(lastPoint[0] - lat) > 0.00001 || 
        Math.abs(lastPoint[1] - lng) > 0.00001) {
      
      trailPoints.value.push(newPosition)
      
      // Limit trail points to prevent memory issues
      if (trailPoints.value.length > 1000) {
        trailPoints.value.shift()
      }
      
      // Update normal trail polyline
      if (trailPolyline) {
        trailPolyline.setLatLngs([...trailPoints.value])
      }
      
      // Update fullscreen trail polyline if it exists
      if (fullscreenTrailPolyline) {
        fullscreenTrailPolyline.setLatLngs([...trailPoints.value])
      }
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
  
  if (trailPolyline) {
    trailPolyline.setLatLngs([])
  }
  
  if (fullscreenTrailPolyline) {
    fullscreenTrailPolyline.setLatLngs([])
  }
}

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

// Enhanced Fullscreen toggle function to fix map issue
const toggleFullscreen = async () => {
  isFullscreen.value = !isFullscreen.value

  if (isFullscreen.value) {
    // Enable keyboard controls when entering fullscreen
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    
    // Initialize fullscreen map after a delay to ensure DOM is ready
    setTimeout(initializeFullscreenMap, 200)
  } else {
    // Remove keyboard controls when exiting fullscreen
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('keyup', handleKeyUp)
    stopMovement()
    
    // Clean up fullscreen map references
    if (fullscreenMap) {
      fullscreenMap.remove()
      fullscreenMap = null
      fullscreenRobotMarker = null
      fullscreenTrailPolyline = null
    }
    
    // CRITICAL FIX: Reinitialize the normal map after exiting fullscreen
    setTimeout(async () => {
      await initializeMap()
      // Force update map location with current GPS data
      if (gpsData.value.latitude && gpsData.value.longitude) {
        updateMapLocation(gpsData.value.latitude, gpsData.value.longitude)
      }
    }, 300)
  }
}

const initializeRos = () => {
  if (ros && ros.isConnected) {
    ros.close() // Close existing connection if any
  }
  ros = new ROSLIB.Ros({
    url: `ws://${ROBOT_IP}:9090`,
  })

  // Define the /cmd_vel publisher
  cmdVel = new ROSLIB.Topic({
    ros,
    name: '/cmd_vel_ui',
    messageType: 'geometry_msgs/msg/Twist',
  })

  // Setup ROS subscribers for status data
  
  // RTK GPS topic (integrated from App.vue)
  const rtkTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/rtklib_nav',
    messageType: 'rtklib_msgs/msg/RtklibNav'
  })

  rtkTopic.subscribe((msg) => {
    gpsData.value.latitude = msg.status.latitude
    gpsData.value.longitude = msg.status.longitude
    gpsData.value.altitude = msg.status.altitude
    gpsData.value.status = msg.status.status.status
    gpsData.value.service = msg.status.status.service
    gpsData.value.position_covariance = msg.status.position_covariance
    gpsData.value.timestamp = Date.now()
    
    // Update map location
    updateMapLocation(msg.status.latitude, msg.status.longitude)
  })

  // Drive-by-wire topic
  const dbwTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/piu_dbw_feedback',
    messageType: 'rdc_dbw_interface/msg/DriveByWireStatus',
  })

  dbwTopic.subscribe((msg) => {
    // Only subscribe to the battery voltage, other features removed
    dbw.value.battery_voltage = msg.battery_voltage
  })

  // Motion topic
  const motionTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/piu_motion_feedback',
    messageType: 'rdc_dbw_interface/msg/Encoder',
  })

  motionTopic.subscribe((msg) => {
    // Only subscribe to the speed, other features removed
    motion.value.speed = msg.speed
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

  connectionStatus.value = 'Connected'
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

// Watch for fullscreen changes to handle map reinitialization
watch(isFullscreen, async (newValue) => {
  if (!newValue) {
    // Exiting fullscreen - reinitialize normal map after a delay
    await nextTick()
    setTimeout(async () => {
      await initializeMap()
      // Update with current GPS location
      if (gpsData.value.latitude && gpsData.value.longitude) {
        updateMapLocation(gpsData.value.latitude, gpsData.value.longitude)
      }
    }, 500)
  }
})

onMounted(async () => {
  // Load Leaflet CSS and JS (integrated from App.vue)
  const leafletCSS = document.createElement('link')
  leafletCSS.rel = 'stylesheet'
  leafletCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css'
  document.head.appendChild(leafletCSS)
  
  const leafletJS = document.createElement('script')
  leafletJS.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js'
  leafletJS.onload = () => {
    // Wait a bit to ensure Leaflet is fully loaded
    setTimeout(initializeMap, 100)
  }
  document.head.appendChild(leafletJS)

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
  stopWebRTCConnection()
  emergencyStop()
  if (ros && ros.isConnected) {
    sendCmd(0, 0)
    ros.close()
  }
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('keyup', handleKeyUp)
  
  // Clean up map references
  if (map) {
    map.remove()
    map = null
    robotMarker = null
    trailPolyline = null
  }
  
  if (fullscreenMap) {
    fullscreenMap.remove()
    fullscreenMap = null
    fullscreenRobotMarker = null
    fullscreenTrailPolyline = null
  }
})
</script>

<style scoped>
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

/* GPS Map Styles (integrated from App.vue) */
.gps-map {
  width: 100%;
  height: 300px;
  border-radius: 8px;
  border: 2px solid #ddd;
  min-height: 200px;
}

/* Robot marker styles (integrated from App.vue) */
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

/* GPS status color classes */
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

/* WebRTC Styles (from WebRTC.vue) */
.webrtc-container {
  height: 100%;
  width: 100%;
  position: relative;
}

.video-container {
  position: relative;
  height: 100%;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  aspect-ratio: 16/9;  /* Match ZED2i 640x360 aspect ratio */
}

.video-stream {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: none;
}

.video-stream.streaming {
  border: 3px solid #28a745;
}

.video-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.placeholder-content {
  text-align: center;
}

.camera-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.controls {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn.primary {
  background: #007bff;
  color: white;
}

.btn.primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn.secondary {
  background: #6c757d;
  color: white;
}

.btn.secondary:hover:not(:disabled) {
  background: #545b62;
}

.btn.tertiary {
  background: #17a2b8;
  color: white;
}

.btn.tertiary:hover:not(:disabled) {
  background: #138496;
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 4px;
}

.status-dot.connected {
  background-color: #28a745;
}

.status-dot.disconnected {
  background-color: #dc3545;
}
</style>