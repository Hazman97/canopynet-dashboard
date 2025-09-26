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
                <div class="text-sm text-gray-600 mt-2 text-center">
                  Live Trail Points: {{ rtkComponent?.trailPoints.length }}
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
                  @mousedown="startMovement(0, -maxAngularSpeed)"
                  @mouseup="stopMovement"
                  @mouseleave="stopMovement"
                  @touchstart="startMovement(0, -maxAngularSpeed)"
                  @touchend="stopMovement"
                  :disabled="!uiControlEnabled || !safetyButtonPressed"
                  :class="{ 'opacity-50 cursor-not-allowed': !uiControlEnabled || !safetyButtonPressed }"
                >
                  <i class="bx bx-left-arrow-alt text-2xl"></i>
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
          <rtk :ros="ros" :ugvId="ugvId" mapId="gps-map-normal" ref="rtkComponent" />
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
                  @mousedown="startMovement(0, -maxAngularSpeed)"
                  @mouseup="stopMovement"
                  @mouseleave="stopMovement"
                  @touchstart="startMovement(0, -maxAngularSpeed)"
                  @touchend="stopMovement"
                  :disabled="!uiControlEnabled || !safetyButtonPressed"
                  :class="{ 'opacity-50 cursor-not-allowed': !uiControlEnabled || !safetyButtonPressed }"
                >
                  <i class="bx bx-left-arrow-alt"></i>
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
import rtk from '../components/rtk.vue'

const props = defineProps({
  ugvId: String,
})

const emit = defineEmits(['back-to-overview'])
const rtkComponent = ref(null);

// Fullscreen state
const isFullscreen = ref(false)

// Connection status
const connectionStatus = ref('Disconnected')

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
  imu_data: null, // New reactive property for IMU data
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
const accelerationRate = ref(2.0)
const maxLinearSpeed = ref(1.0)
const maxAngularSpeed = ref(1.0)

// ROS connection setup
const ROBOT_IP = '192.168.100.5'
let ros = null
let cmdVel = null

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
    await nextTick();
    const mapContainer = document.getElementById('gps-map-fullscreen');
    if (mapContainer && !mapContainer._leaflet_id) {
        // Need to create the map manually here for fullscreen since it's not a component
        const L = window.L;
        const defaultLat = 2.92012435;
        const defaultLng = 101.636099842;
        const fullscreenMap = L.map('gps-map-fullscreen').setView([defaultLat, defaultLng], 18);
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
          maxZoom: 22
        }).addTo(fullscreenMap);
        setTimeout(() => fullscreenMap.invalidateSize(), 100);
        // We'd also need to manually handle the marker and trail, which is more complex.
        // For simplicity in this refactor, we'll just show the empty map container.
    }
  } else {
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('keyup', handleKeyUp)
    stopMovement()
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
    // Pass encoder data to the rtk component via props
    if (rtkComponent.value) {
      rtkComponent.value.updateEncoderData(msg);
    }
  })
  
  // New subscription for IMU data
  const imuTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/zed2i/zed_node/imu/data',
    messageType: 'sensor_msgs/msg/Imu',
  })
  imuTopic.subscribe((msg) => {
    // Pass IMU data to the rtk component via props
    if (rtkComponent.value) {
      rtkComponent.value.updateImuData(msg);
    }
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
    case 'w': case 'arrowup': event.preventDefault(); startMovement(maxLinearSpeed.value, 0); break;
    case 's': case 'arrowdown': event.preventDefault(); startMovement(-maxLinearSpeed.value, 0); break;
    // Reversed left/right directions:
    case 'a': case 'arrowleft': event.preventDefault(); startMovement(0, -maxAngularSpeed.value); break; // Now moves right
    case 'd': case 'arrowright': event.preventDefault(); startMovement(0, maxAngularSpeed.value); break; // Now moves left
    case 'escape': if (isFullscreen.value) toggleFullscreen(); break;
    case ' ': event.preventDefault(); emergencyStop(); break;
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

onMounted(async () => {
  const leafletCSS = document.createElement('link')
  leafletCSS.rel = 'stylesheet'
  leafletCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css'
  document.head.appendChild(leafletCSS)
  
  const leafletJS = document.createElement('script')
  leafletJS.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js'
  document.head.appendChild(leafletJS)

  if (props.ugvId) {
    initializeRos()
  }
  
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
.fixed { position: fixed; }
.inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
.z-50 { z-index: 50; }
button:disabled { opacity: 0.5; cursor: not-allowed; }
button:disabled:hover { transform: none; }
.safety-btn:active, .safety-btn.active { transform: scale(0.98); }
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
.text-green-600 { color: #16a34a; font-weight: bold; }
.text-yellow-600 { color: #ca8a04; font-weight: bold; }
.text-red-600 { color: #dc2626; font-weight: bold; }
</style>