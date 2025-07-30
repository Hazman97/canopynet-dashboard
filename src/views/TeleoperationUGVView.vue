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
          <h1 class="text-3xl font-bold text-gray-800">UGV Control Center</h1>
          <p class="text-gray-600">Advanced teleoperation and autonomous control for unmanned ground vehicles</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-2 mb-6 flex space-x-4">
        <button
          @click="$emit('back-to-overview')"
          :class="{'text-gray-700 hover:bg-gray-100': true}"
          class="px-5 py-2 rounded-md font-medium transition-colors duration-200"
        >
          <i class="bx bx-grid-alt mr-2"></i>Overview
        </button>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 mb-6 flex items-center justify-between">
        <div class="flex items-center">
          <span class="w-3 h-3 rounded-full mr-3" :class="connectionStatus === 'Connected' ? 'bg-green-500' : 'bg-red-500'"></span>
          <h2 class="text-xl font-semibold text-gray-800">UGV-{{ ugvId }} Teleoperation</h2>
          <p class="text-gray-600 ml-4">Status: <span :class="{'text-green-600': connectionStatus === 'Connected', 'text-red-600': connectionStatus !== 'Connected', 'font-bold': true}">{{ connectionStatus }}</span></p>
        </div>
        <div class="flex items-center">
          <span class="text-gray-700 mr-3">Manual Mode</span>
          <label for="manualModeToggle" class="flex items-center cursor-pointer">
            <div class="relative">
              <input type="checkbox" id="manualModeToggle" class="sr-only" v-model="manualModeEnabled">
              <div class="block bg-gray-300 w-14 h-8 rounded-full"></div>
              <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform" :class="{ 'translate-x-6': manualModeEnabled }"></div>
            </div>
          </label>
        </div>
      </div>

      <div v-if="connectionStatus !== 'Connected'" class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-lg" role="alert">
        <div class="flex items-center">
          <div class="py-1"><i class="bx bx-info-circle text-2xl mr-3"></i></div>
          <div>
            <p class="font-bold">Connection Lost</p>
            <p>Attempting to reconnect...</p>
          </div>
        </div>
        <div class="mt-4">
          <div class="auto-refresh-section">
            <label class="flex items-center text-sm">
              <input type="checkbox" :checked="autoRefreshEnabled" @change="toggleAutoRefresh" class="mr-2">
              Auto-refresh on disconnect ({{ autoRefreshDelay }}s delay)
            </label>
            <div class="mt-2" v-if="autoRefreshEnabled">
              <label class="flex items-center text-sm">Refresh delay:
                <input type="range" min="3" max="30" step="1" :value="autoRefreshDelay" @input="updateAutoRefreshDelay($event.target.value)" class="ml-2 w-32">
                <span class="ml-2">{{ autoRefreshDelay }}s</span>
              </label>
            </div>
            <div v-if="refreshCountdown > 0" class="refresh-notification mt-2">
              🔄 Auto-refreshing in {{ refreshCountdown }}s...
            </div>
          </div>
        </div>
      </div>


      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div class="lg:col-span-1 bg-white rounded-lg shadow-md p-6 flex flex-col">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">UGV Position Tracking</h3>
          <div class="relative flex-grow bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
            <img src="https://placehold.co/400x300/E0E0E0/555555?text=Map+Placeholder" alt="Map Placeholder" class="w-full h-full object-cover">
            <div class="absolute top-2 left-2 flex flex-col space-y-1 z-10">
              <button class="bg-white p-1.5 rounded-md shadow-md text-gray-700 hover:bg-gray-100"><i class="bx bx-plus text-lg"></i></button>
              <button class="bg-white p-1.5 rounded-md shadow-md text-gray-700 hover:bg-gray-100"><i class="bx bx-minus text-lg"></i></button>
            </div>
            <div class="absolute bottom-2 left-2 text-xs text-gray-600 z-10">
              © Leaflet | © OpenStreetMap contributors
            </div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <i class="bx bx-current-location text-green-600 text-3xl"></i>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1 bg-gray-900 rounded-lg shadow-md p-6 text-white flex flex-col items-center justify-center relative overflow-hidden">
          <div class="absolute top-4 right-4 flex space-x-2 z-10">
            <button class="bg-gray-700 p-2 rounded-full hover:bg-gray-600"><i class="bx bx-cog text-xl"></i></button>
            <button class="bg-gray-700 p-2 rounded-full hover:bg-gray-600"><i class="bx bx-fullscreen text-xl"></i></button>
          </div>
          <img :src="cameraUrl" alt="UGV Camera Feed" class="w-full h-auto object-contain rounded-lg border-2 border-gray-700" v-if="connectionStatus === 'Connected'">
          <div v-else class="text-center">
            <i class="bx bx-video-off text-6xl text-gray-400 mb-4"></i>
            <p class="text-xl font-semibold mb-2">Camera Feed Unavailable</p>
            <p class="text-sm text-gray-400">Not connected to robot or stream error</p>
          </div>

          <div class="mt-4 text-sm space-y-1">
            <p>Linear Speed: <span class="font-medium">{{ motion.speed.toFixed(2) }} m/s</span></p>
            <p>Angular Speed: <span class="font-medium">{{ currentAngular.toFixed(2) }} rad/s</span></p>
            <p>Battery Voltage: <span class="font-medium">{{ dbw.battery_voltage.toFixed(2) }} V</span></p>
            <p>Battery Current: <span class="font-medium">{{ dbw.battery_current.toFixed(2) }} A</span></p>
            <p>Joystick Status: <span class="font-medium" :class="joystick.connection === 'Connected' ? 'text-green-400' : 'text-red-400'">{{ joystick.connection }} ({{ joystick.mode }})</span></p>
          </div>
        </div>

        <div class="lg:col-span-1 bg-white rounded-lg shadow-md p-6 flex flex-col">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Movement Controls</h3>
          <div :class="{'opacity-50 pointer-events-none bg-gray-100': !manualModeEnabled || connectionStatus !== 'Connected', 'bg-white': manualModeEnabled && connectionStatus === 'Connected'}" class="flex-grow flex flex-col items-center justify-center p-6 rounded-lg border border-gray-200 transition-all duration-300">
            <i class="bx bx-game text-6xl text-gray-400 mb-4"></i>
            <p class="text-lg text-gray-600 text-center mb-4">
              {{ manualModeEnabled && connectionStatus === 'Connected' ? 'Use joystick or keyboard for control' : 'Enable Manual Mode and connect to UGV to access teleoperation controls' }}
            </p>
            <div v-if="manualModeEnabled && connectionStatus === 'Connected'" class="grid grid-rows-3 grid-cols-3 gap-3 w-full max-w-xs">
              <div></div>
              <button class="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors active:bg-blue-700"
                      @mousedown="startMovement(maxLinearSpeed, 0)"
                      @mouseup="stopMovement"
                      @mouseleave="stopMovement"
                      @touchstart="startMovement(maxLinearSpeed, 0)"
                      @touchend="stopMovement">
                <i class="bx bx-up-arrow-alt"></i>
              </button>
              <div></div>
              <button class="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors active:bg-blue-700"
                      @mousedown="startMovement(0, maxAngularSpeed)"
                      @mouseup="stopMovement"
                      @mouseleave="stopMovement"
                      @touchstart="startMovement(0, maxAngularSpeed)"
                      @touchend="stopMovement">
                <i class="bx bx-left-arrow-alt"></i>
              </button>
              <button class="bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors active:bg-gray-700"
                      @click="sendCmd(0, 0)">
                Stop
              </button>
              <button class="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors active:bg-blue-700"
                      @mousedown="startMovement(0, -maxAngularSpeed)"
                      @mouseup="stopMovement"
                      @mouseleave="stopMovement"
                      @touchstart="startMovement(0, -maxAngularSpeed)"
                      @touchend="stopMovement">
                <i class="bx bx-right-arrow-alt"></i>
              </button>
              <div></div>
              <button class="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors active:bg-blue-700"
                      @mousedown="startMovement(-maxLinearSpeed, 0)"
                      @mouseup="stopMovement"
                      @mouseleave="stopMovement"
                      @touchstart="startMovement(-maxLinearSpeed, 0)"
                      @touchend="stopMovement">
                <i class="bx bx-down-arrow-alt"></i>
              </button>
              <div></div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Movement Settings</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="setting-item flex items-center">
            <label for="commandRateSelect" class="text-gray-700 mr-2">Command Rate (Hz):</label>
            <select id="commandRateSelect" @change="updateCommandRate($event.target.value)" class="form-select border border-gray-300 rounded-md p-2">
              <option value="20" :selected="commandRate === 50">20 Hz (50ms)</option>
              <option value="10" :selected="commandRate === 100">10 Hz (100ms)</option>
              <option value="30" :selected="commandRate === 33">30 Hz (33ms)</option>
              <option value="50" :selected="commandRate === 20">50 Hz (20ms)</option>
            </select>
          </div>
          <div class="setting-item flex items-center">
            <label for="maxLinearSpeedRange" class="text-gray-700 mr-2">Max Linear Speed:</label>
            <input type="range" id="maxLinearSpeedRange" min="0.1" max="2.0" step="0.1" :value="maxLinearSpeed" @input="updateMaxLinearSpeed($event.target.value)" class="flex-grow">
            <span class="ml-2 font-medium text-blue-600">{{ maxLinearSpeed.toFixed(1) }} m/s</span>
          </div>
          <div class="setting-item flex items-center">
            <label for="maxAngularSpeedRange" class="text-gray-700 mr-2">Max Angular Speed:</label>
            <input type="range" id="maxAngularSpeedRange" min="0.1" max="2.0" step="0.1" :value="maxAngularSpeed" @input="updateMaxAngularSpeed($event.target.value)" class="flex-grow">
            <span class="ml-2 font-medium text-blue-600">{{ maxAngularSpeed.toFixed(1) }} rad/s</span>
          </div>
        </div>
      </div>


      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Status Information</h3>
          <div class="space-y-2 text-gray-700 text-base">
            <p><span class="font-medium">PIU State:</span> {{ dbw.piu_state }}</p>
            <p><span class="font-medium">Estop Triggered:</span> <span :class="dbw.estop_trigger ? 'text-red-600 font-bold' : 'text-green-600 font-bold'">{{ dbw.estop_trigger ? 'YES' : 'NO' }}</span></p>
            <p><span class="font-medium">Front Motor Fault:</span> {{ dbw.front_md_fault }}</p>
            <p><span class="font-medium">Rear Motor Fault:</span> {{ dbw.rear_md_fault }}</p>
            <p><span class="font-medium">Left Encoder Ticks:</span> {{ motion.left_encoder_ticks }}</p>
            <p><span class="font-medium">Right Encoder Ticks:</span> {{ motion.right_encoder_ticks }}</p>
            <p><span class="font-medium">Current Task:</span> N/A (No ROS topic)</p>
            <p><span class="font-medium">Last Communication:</span> Live (via ROS)</p>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div class="grid grid-cols-2 gap-4">
            <button class="bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition-colors flex items-center justify-center">
              <i class="bx bx-home mr-2"></i> Return to Base
            </button>
            <button class="bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center">
              <i class="bx bx-bell mr-2"></i> Sound Alarm
            </button>
            <button class="bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition-colors flex items-center justify-center">
              <i class="bx bx-camera mr-2"></i> Take Photo
            </button>
            <button class="bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center">
              <i class="bx bx-reset mr-2"></i> Reboot System
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ROSLIB from 'roslib'; //
import { ref, watch, defineProps, defineEmits, onMounted, onUnmounted } from 'vue'; //

const props = defineProps({
  ugvId: String,
  // initialUgvData will no longer be used for live data, but kept if you need it for initial configuration
  // initialUgvData: Object
});

const emit = defineEmits(['back-to-overview']);

// UGV Teleoperation Specific
const manualModeEnabled = ref(false); //

// Camera configuration (from App.vue)
const cameraUrl = ref('http://192.168.100.5:8080/stream?topic=/zed2i/zed_node/rgb_raw/image_raw_color'); //

// Connection status (from App.vue)
const connectionStatus = ref('Disconnected'); //

// Auto-refresh functionality (from App.vue)
const autoRefreshEnabled = ref(true); //
const autoRefreshDelay = ref(5); //
const refreshCountdown = ref(0); //
let refreshTimeout = null; //
let countdownInterval = null; //

// Movement control variables (from App.vue)
const isMoving = ref(false); //
const currentLinear = ref(0); //
const currentAngular = ref(0); //
let movementInterval = null; //

// Status data (from App.vue)
const dbw = ref({
  piu_state: 'Unknown',
  battery_voltage: 0,
  battery_current: 0,
  estop_trigger: false,
  front_md_fault: 'Unknown',
  rear_md_fault: 'Unknown'
}); //

const motion = ref({
  left_encoder_ticks: 0,
  right_encoder_ticks: 0,
  front_left_rpm: 0,
  rear_right_rpm: 0,
  speed: 0,
  left_wheel_speed_mps: 0,
  right_wheel_speed_mps: 0
}); //

const joystick = ref({
  connection: 'Unknown',
  mode: 'Unknown'
}); //

// Adjustable parameters (from App.vue)
const commandRate = ref(50); // milliseconds (20Hz) //
const accelerationStep = ref(0.1); //
const maxLinearSpeed = ref(1.0); //
const maxAngularSpeed = ref(1.0); //

// ROS connection setup (from App.vue)
const ROBOT_IP = '192.168.100.5'; // Replace with your robot's IP //
let ros = null;
let cmdVel = null;

const initializeRos = () => {
  if (ros && ros.isConnected) {
    ros.close(); // Close existing connection if any
  }
  ros = new ROSLIB.Ros({
    url: `ws://${ROBOT_IP}:9090`
  }); //

  // ROS connection event handlers (from App.vue)
  ros.on('connection', () => {
    console.log('✅ Connected to ROS'); //
    connectionStatus.value = 'Connected'; //
    cancelAutoRefresh(); // Cancel any pending refresh //
  });

  ros.on('error', (error) => {
    console.error('❌ Error connecting to ROS:', error); //
    connectionStatus.value = 'Error'; //
    startAutoRefresh(); // Start auto-refresh on error //
  });

  ros.on('close', () => {
    console.log('🔌 Connection to ROS closed'); //
    connectionStatus.value = 'Disconnected'; //
    startAutoRefresh(); // Start auto-refresh on disconnect //
  });

  // Define the /cmd_vel publisher (from App.vue)
  cmdVel = new ROSLIB.Topic({
    ros,
    name: '/cmd_vel',
    messageType: 'geometry_msgs/Twist'
  }); //

  // Setup ROS subscribers for status data (from App.vue)
  // Drive-by-wire topic
  const dbwTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/piu_dbw_feedback',
    messageType: 'rdc_dbw_interface/msg/DriveByWireStatus'
  }); //

  dbwTopic.subscribe((msg) => {
    dbw.value.piu_state = msg.piu_state; //
    dbw.value.battery_voltage = msg.battery_voltage; //
    dbw.value.battery_current = msg.battery_current; //
    dbw.value.estop_trigger = msg.estop_trigger; //
    dbw.value.front_md_fault = msg.front_md_fault; //
    dbw.value.rear_md_fault = msg.rear_md_fault; //
  });

  // Motion topic
  const motionTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/piu_motion_feedback',
    messageType: 'rdc_dbw_interface/msg/Encoder'
  }); //

  motionTopic.subscribe((msg) => {
    motion.value.left_encoder_ticks = msg.left_encoder_ticks; //
    motion.value.right_encoder_ticks = msg.right_encoder_ticks; //
    motion.value.front_left_rpm = msg.front_left_rpm; //
    motion.value.rear_right_rpm = msg.rear_right_rpm; //
    motion.value.speed = msg.speed; //
    motion.value.left_wheel_speed_mps = msg.left_wheel_speed_mps; //
    motion.value.right_wheel_speed_mps = msg.right_wheel_speed_mps; //
  });

  // Joystick connection topic
  const joystickConnTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/joystick_conn',
    messageType: 'std_msgs/msg/Bool'
  }); //

  joystickConnTopic.subscribe((msg) => {
    joystick.value.connection = msg.data ? 'Connected' : 'Disconnected'; //
  });

  // Joystick mode topic
  const joystickModeTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/joystick/mode',
    messageType: 'std_msgs/msg/String'
  }); //

  joystickModeTopic.subscribe((msg) => {
    joystick.value.mode = msg.data; //
  });
};

// Auto-refresh functions (from App.vue)
function startAutoRefresh() {
  if (!autoRefreshEnabled.value) return; //

  console.log(`🔄 Starting auto-refresh countdown (${autoRefreshDelay.value}s)`); //
  refreshCountdown.value = autoRefreshDelay.value; //

  countdownInterval = setInterval(() => {
    refreshCountdown.value--; //
    if (refreshCountdown.value <= 0) {
      clearInterval(countdownInterval); //
      refreshPage(); //
    }
  }, 1000); //
}

function cancelAutoRefresh() {
  if (refreshTimeout) {
    clearTimeout(refreshTimeout); //
    refreshTimeout = null; //
  }
  if (countdownInterval) {
    clearInterval(countdownInterval); //
    countdownInterval = null; //
  }
  refreshCountdown.value = 0; //
  console.log('❌ Auto-refresh cancelled'); //
}

function refreshPage() {
  console.log('🔄 Auto-refreshing page...'); //
  window.location.reload(); //
}

function toggleAutoRefresh() {
  autoRefreshEnabled.value = !autoRefreshEnabled.value; //
  if (!autoRefreshEnabled.value) {
    cancelAutoRefresh(); //
  }
  console.log(`Auto-refresh ${autoRefreshEnabled.value ? 'enabled' : 'disabled'}`); //
}

function updateAutoRefreshDelay(delay) {
  autoRefreshDelay.value = parseInt(delay); //
}

// Send Twist command (from App.vue)
function sendCmd(linear, angular) {
  if (!cmdVel || !ros.isConnected) {
    console.warn('ROS not connected or cmdVel topic not initialized.');
    return;
  }
  linear = Math.max(-maxLinearSpeed.value, Math.min(maxLinearSpeed.value, linear)); //
  angular = Math.max(-maxAngularSpeed.value, Math.min(maxAngularSpeed.value, angular)); //

  const twist = new ROSLIB.Message({
    linear: { x: linear, y: 0, z: 0 },
    angular: { x: 0, y: 0, z: angular }
  }); //
  cmdVel.publish(twist); //
}

// Start continuous movement (from App.vue)
function startMovement(targetLinear, targetAngular) {
  if (!manualModeEnabled.value || connectionStatus.value !== 'Connected') return;

  if (movementInterval) {
    clearInterval(movementInterval); //
  }

  isMoving.value = true; //
  let currentLinearSpeed = currentLinear.value; //
  let currentAngularSpeed = currentAngular.value; //

  sendCmd(currentLinearSpeed, currentAngularSpeed); //

  movementInterval = setInterval(() => {
    if (isMoving.value) {
      if (Math.abs(currentLinearSpeed - targetLinear) > accelerationStep.value) {
        currentLinearSpeed += (targetLinear > currentLinearSpeed) ? accelerationStep.value : -accelerationStep.value; //
      } else {
        currentLinearSpeed = targetLinear; //
      }

      if (Math.abs(currentAngularSpeed - targetAngular) > accelerationStep.value) {
        currentAngularSpeed += (targetAngular > currentAngularSpeed) ? accelerationStep.value : -accelerationStep.value; //
      } else {
        currentAngularSpeed = targetAngular; //
      }

      currentLinear.value = currentLinearSpeed; //
      currentAngular.value = currentAngularSpeed; //
      sendCmd(currentLinearSpeed, currentAngularSpeed); //
    }
  }, commandRate.value); //
}

// Stop movement (from App.vue)
function stopMovement() {
  if (!manualModeEnabled.value || connectionStatus.value !== 'Connected') return;

  isMoving.value = false; //

  if (movementInterval) {
    clearInterval(movementInterval); //
    movementInterval = null; //
  }

  let currentLinearSpeed = currentLinear.value; //
  let currentAngularSpeed = currentAngular.value; //

  const decelerationInterval = setInterval(() => {
    if (Math.abs(currentLinearSpeed) > accelerationStep.value) {
      currentLinearSpeed *= 0.7; //
    } else {
      currentLinearSpeed = 0; //
    }

    if (Math.abs(currentAngularSpeed) > accelerationStep.value) {
      currentAngularSpeed *= 0.7; //
    } else {
      currentAngularSpeed = 0; //
    }

    sendCmd(currentLinearSpeed, currentAngularSpeed); //

    if (Math.abs(currentLinearSpeed) < 0.01 && Math.abs(currentAngularSpeed) < 0.01) {
      clearInterval(decelerationInterval); //
      currentLinear.value = 0; //
      currentAngular.value = 0; //
      sendCmd(0, 0); //
    }
  }, commandRate.value); //
}

// Keyboard controls (from App.vue)
function handleKeyDown(event) {
  if (!manualModeEnabled.value || connectionStatus.value !== 'Connected') return; // Only enable if manual mode is on and connected
  if (isMoving.value) return; // Prevent multiple commands while already moving

  switch(event.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      event.preventDefault(); //
      startMovement(maxLinearSpeed.value, 0); //
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      event.preventDefault(); //
      startMovement(-maxLinearSpeed.value, 0); //
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      event.preventDefault(); //
      startMovement(0, maxAngularSpeed.value); //
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      event.preventDefault(); //
      startMovement(0, -maxAngularSpeed.value); //
      break;
  }
}

function handleKeyUp(event) {
  if (!manualModeEnabled.value || connectionStatus.value !== 'Connected') return; // Only enable if manual mode is on and connected

  switch(event.key) {
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
      event.preventDefault(); //
      stopMovement(); //
      break;
  }
}

// Settings update functions (from App.vue)
function updateCommandRate(hz) {
  commandRate.value = 1000 / hz; //
}

function updateMaxLinearSpeed(speed) {
  maxLinearSpeed.value = parseFloat(speed); //
}

function updateMaxAngularSpeed(speed) {
  maxAngularSpeed.value = parseFloat(speed); //
}

watch(manualModeEnabled, (value) => {
  console.log('Manual mode:', value);
  if (value && connectionStatus.value === 'Connected') {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
  } else {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
    stopMovement(); // Ensure robot stops if manual mode is disabled
  }
});

watch(connectionStatus, (status) => {
  if (status !== 'Connected') {
    // Stop movement and disable keyboard controls if connection is lost
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
    stopMovement();
  } else if (manualModeEnabled.value) {
    // Re-enable keyboard controls if connected and manual mode is enabled
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
  }
});


onMounted(() => {
  if (props.ugvId) {
    initializeRos();
  }
});

onUnmounted(() => {
  // Cleanup ROS connection, intervals, and event listeners
  if (movementInterval) {
    clearInterval(movementInterval); //
  }
  cancelAutoRefresh(); //
  if (ros && ros.isConnected) {
    sendCmd(0, 0); // Stop robot movement before unmounting //
    ros.close();
  }
  document.removeEventListener('keydown', handleKeyDown); //
  document.removeEventListener('keyup', handleKeyUp); //
});
</script>

<style scoped>
.dot {
  transition: transform 0.3s ease;
}

/* Custom toggle switch styling */
input:checked + .block {
  background-color: #2563eb; /* blue-600 */
}
input:checked + .block .dot {
  transform: translateX(100%);
}

/* Styles for Auto-refresh section from App.vue */
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
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

.setting-item label {
  display: flex;
  align-items: center;
  font-weight: 500;
}
</style>