<template>
  <div class="p-6 bg-gray-50 min-h-screen font-sans">
    <!-- Show empty state if ugvId or initialUgvData not available -->
    <div v-if="!ugvId || !initialUgvData">
      <div class="flex flex-col items-center justify-center text-center p-20 bg-white rounded-lg shadow-md">
        <i class="bx bx-error-circle text-6xl text-gray-400 mb-4"></i>
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">No UGV Selected</h2>
        <p class="text-gray-500">Select a UGV from the list to access teleoperation controls</p>
      </div>
    </div>

    <div v-else class="h-full overflow-y-auto"> <!-- Added h-full and overflow-y-auto -->
      <!-- Header Section -->
      <div class="flex items-center mb-6">
        <i class="bx bxs-robot text-4xl text-gray-800 mr-3"></i>
        <div>
          <h1 class="text-3xl font-bold text-gray-800">UGV Control Center</h1>
          <p class="text-gray-600">Advanced teleoperation and autonomous control for unmanned ground vehicles</p>
        </div>
      </div>

      <!-- Tabs Section -->
      <div class="bg-white rounded-lg shadow-md p-2 mb-6 flex space-x-4">
        <button
          @click="$emit('back-to-overview')"
          :class="{'text-gray-700 hover:bg-gray-100': true}"
          class="px-5 py-2 rounded-md font-medium transition-colors duration-200"
        >
          <i class="bx bx-grid-alt mr-2"></i>Overview
        </button>
        <button
          :class="{'bg-blue-600 text-white': true}"
          class="px-5 py-2 rounded-md font-medium transition-colors duration-200"
        >
          <i class="bx bx-joystick mr-2"></i>Teleoperation
        </button>
      </div>

      <!-- UGV Teleoperation Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6 flex items-center justify-between">
        <div class="flex items-center">
          <span class="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
          <h2 class="text-xl font-semibold text-gray-800">UGV-{{ ugvId }} Teleoperation</h2>
          <p class="text-gray-600 ml-4">Connected - Ready for control</p>
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

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- ROS Connection Status -->
        <div class="lg:col-span-1 bg-white rounded-lg shadow-md p-6 flex flex-col">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">ROS Connection Status</h3>
          <div class="status-grid">
            <div class="status-item">
              <strong>ROS Bridge:</strong> <span :class="connectionStatus">{{ connectionStatus }}</span>
            </div>
            <div class="status-item">
              <strong>Joystick Connection:</strong>
              <span :class="joystick.connection === 'Connected' ? 'success' : 'error'">
                {{ joystick.connection }}
              </span>
            </div>
            <div class="status-item">
              <strong>Joystick Mode:</strong> {{ joystick.mode }}
            </div>
            <div class="status-item">
              <strong>Current Speed:</strong> Linear={{ currentLinear.toFixed(2) }} m/s, Angular={{ currentAngular.toFixed(2) }} rad/s
            </div>
          </div>
          <!-- Auto-refresh settings -->
          <div class="auto-refresh-section">
            <div class="setting-item">
              <label>
                <input type="checkbox" :checked="autoRefreshEnabled" @change="toggleAutoRefresh">
                Auto-refresh on disconnect ({{ autoRefreshDelay }}s delay)
              </label>
            </div>
            <div class="setting-item" v-if="autoRefreshEnabled">
              <label>Refresh delay:
                <input type="range" min="3" max="30" step="1" :value="autoRefreshDelay" @input="updateAutoRefreshDelay($event.target.value)">
                <span>{{ autoRefreshDelay }}s</span>
              </label>
            </div>
            <div v-if="refreshCountdown > 0" class="refresh-notification">
              🔄 Auto-refreshing in {{ refreshCountdown }}s...
            </div>
          </div>
        </div>

        <!-- UGV Live Stream (Camera Feed) -->
        <div class="lg:col-span-1 bg-gray-900 rounded-lg shadow-md p-6 text-white flex flex-col items-center justify-center relative overflow-hidden">
          <div class="absolute top-4 right-4 flex space-x-2 z-10">
            <button class="bg-gray-700 p-2 rounded-full hover:bg-gray-600"><i class="bx bx-cog text-xl"></i></button>
            <button class="bg-gray-700 p-2 rounded-full hover:bg-gray-600"><i class="bx bx-fullscreen text-xl"></i></button>
          </div>
          <!-- Camera Feed -->
          <img :src="cameraUrl" alt="Camera feed" style="max-width: 100%;" class="rounded-lg border-2 border-gray-700" />
          <p class="text-xl font-semibold mt-4 mb-2">UGV-{{ ugvId }} Live Stream</p>
          <p class="text-sm text-gray-400">1920x1080 - 30fps</p>
          <div class="mt-4 text-sm space-y-1">
            <p>Lat: <span class="font-medium">{{ initialUgvData.lat }}</span></p>
            <p>Lng: <span class="font-medium">{{ initialUgvData.lng }}</span></p>
            <p>Heading: <span class="font-medium">{{ initialUgvData.heading }}°</span></p>
            <p>Signal: <span class="font-medium">{{ initialUgvData.signal }}%</span></p>
          </div>
        </div>

        <!-- Movement Controls -->
        <div class="lg:col-span-1 bg-white rounded-lg shadow-md p-6 flex flex-col">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Movement Controls</h3>
          <div :class="{'opacity-50 pointer-events-none bg-gray-100': !manualModeEnabled, 'bg-white': manualModeEnabled}" class="flex-grow flex flex-col items-center justify-center p-6 rounded-lg border border-gray-200 transition-all duration-300">
            <i class="bx bx-game text-6xl text-gray-400 mb-4"></i>
            <p class="text-lg text-gray-600 text-center mb-4">
              {{ manualModeEnabled ? 'Use joystick or keyboard for control' : 'Enable Manual Mode to access teleoperation controls' }}
            </p>
            <div v-if="manualModeEnabled" class="grid grid-rows-3 grid-cols-3 gap-3 w-full max-w-xs">
              <div></div>
              <button class="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                @mousedown="startMovement(maxLinearSpeed, 0)"
                @mouseup="stopMovement"
                @mouseleave="stopMovement"
                @touchstart="startMovement(maxLinearSpeed, 0)"
                @touchend="stopMovement">
                <i class="bx bx-up-arrow-alt"></i>
              </button>
              <div></div>
              <button class="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                @mousedown="startMovement(0, maxAngularSpeed)"
                @mouseup="stopMovement"
                @mouseleave="stopMovement"
                @touchstart="startMovement(0, maxAngularSpeed)"
                @touchend="stopMovement">
                <i class="bx bx-left-arrow-alt"></i>
              </button>
              <button @click="sendCmd(0, 0)" class="bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors">■ Stop</button>
              <button class="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                @mousedown="startMovement(0, -maxAngularSpeed)"
                @mouseup="stopMovement"
                @mouseleave="stopMovement"
                @touchstart="startMovement(0, -maxAngularSpeed)"
                @touchend="stopMovement">
                <i class="bx bx-right-arrow-alt"></i>
              </button>
              <div></div>
              <button class="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                @mousedown="startMovement(-maxLinearSpeed, 0)"
                @mouseup="stopMovement"
                @mouseleave="stopMovement"
                @touchstart="startMovement(-maxLinearSpeed, 0)"
                @touchend="stopMovement">
                <i class="bx bx-down-arrow-alt"></i>
              </button>
              <div></div>
            </div>
            <!-- Movement Settings -->
            <div v-if="manualModeEnabled" class="settings-section mt-6 w-full max-w-xs">
              <h3 class="text-md font-semibold text-gray-700 mb-3">Settings</h3>
              <div class="settings-grid">
                <div class="setting-item">
                  <label class="text-sm">Command Rate (Hz):
                    <select @change="updateCommandRate($event.target.value)" class="border border-gray-300 rounded-md p-1">
                      <option value="20" :selected="commandRate === 50">20 Hz (50ms)</option>
                      <option value="10" :selected="commandRate === 100">10 Hz (100ms)</option>
                      <option value="30" :selected="commandRate === 33">30 Hz (33ms)</option>
                      <option value="50" :selected="commandRate === 20">50 Hz (20ms)</option>
                    </select>
                  </label>
                </div>
                <div class="setting-item">
                  <label class="text-sm">Max Linear Speed:
                    <input type="range" min="0.1" max="2.0" step="0.1" :value="maxLinearSpeed" @input="updateMaxLinearSpeed($event.target.value)" class="w-full">
                    <span>{{ maxLinearSpeed.toFixed(1) }} m/s</span>
                  </label>
                </div>
                <div class="setting-item">
                  <label class="text-sm">Max Angular Speed:
                    <input type="range" min="0.1" max="2.0" step="0.1" :value="maxAngularSpeed" @input="updateMaxAngularSpeed($event.target.value)" class="w-full">
                    <span>{{ maxAngularSpeed.toFixed(1) }} rad/s</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Status Information & Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Drive-by-Wire Status</h3>
          <div class="status-grid">
            <div class="status-item">
              <strong>PIU State:</strong> {{ dbw.piu_state }}
            </div>
            <div class="status-item">
              <strong>Battery Voltage:</strong> {{ dbw.battery_voltage }} V
            </div>
            <div class="status-item">
              <strong>Battery Current:</strong> {{ dbw.battery_current }} A
            </div>
            <div class="status-item">
              <strong>Estop Triggered:</strong>
              <span :class="dbw.estop_trigger ? 'error' : 'success'">
                {{ dbw.estop_trigger ? 'YES' : 'NO' }}
              </span>
            </div>
            <div class="status-item">
              <strong>Front Motor Fault:</strong> {{ dbw.front_md_fault }}
            </div>
            <div class="status-item">
              <strong>Rear Motor Fault:</strong> {{ dbw.rear_md_fault }}
            </div>
          </div>

          <h3 class="text-lg font-semibold text-gray-800 mb-4 mt-6">Motion Feedback</h3>
          <div class="status-grid">
            <div class="status-item">
              <strong>Left Encoder Ticks:</strong> {{ motion.left_encoder_ticks }}
            </div>
            <div class="status-item">
              <strong>Right Encoder Ticks:</strong> {{ motion.right_encoder_ticks }}
            </div>
            <div class="status-item">
              <strong>Front Left RPM:</strong> {{ motion.front_left_rpm }}
            </div>
            <div class="status-item">
              <strong>Rear Right RPM:</strong> {{ motion.rear_right_rpm }}
            </div>
            <div class="status-item">
              <strong>Speed:</strong> {{ motion.speed.toFixed(2) }} m/s
            </div>
            <div class="status-item">
              <strong>Left Wheel Speed:</strong> {{ motion.left_wheel_speed_mps.toFixed(2) }} m/s
            </div>
            <div class="status-item">
              <strong>Right Wheel Speed:</strong> {{ motion.right_wheel_speed_mps.toFixed(2) }} m/s
            </div>
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
import ROSLIB from 'roslib';
import { ref, watch, onMounted, onUnmounted, defineProps, defineEmits } from 'vue';

const props = defineProps({
  ugvId: String,
  initialUgvData: Object
});

const emit = defineEmits(['back-to-overview']);

// Camera configuration
const cameraUrl = ref('http://192.168.100.226:8080/stream?topic=/zed2i/zed_node/rgb_raw/image_raw_color');

// Connection status
const connectionStatus = ref('Disconnected');

// Auto-refresh functionality
const autoRefreshEnabled = ref(true);
const autoRefreshDelay = ref(5);
const refreshCountdown = ref(0);
let refreshTimeout = null;
let countdownInterval = null;

// Movement control variables
const manualModeEnabled = ref(false); // From TeleoperationUGVView.vue
const isMoving = ref(false);
const currentLinear = ref(0);
const currentAngular = ref(0);
let movementInterval = null;

// Status data
const dbw = ref({
  piu_state: 'Unknown',
  battery_voltage: 0,
  battery_current: 0,
  estop_trigger: false,
  front_md_fault: 'Unknown',
  rear_md_fault: 'Unknown'
});

const motion = ref({
  left_encoder_ticks: 0,
  right_encoder_ticks: 0,
  front_left_rpm: 0,
  rear_right_rpm: 0,
  speed: 0,
  left_wheel_speed_mps: 0,
  right_wheel_speed_mps: 0
});

const joystick = ref({
  connection: 'Unknown',
  mode: 'Unknown'
});

// Adjustable parameters
const commandRate = ref(50); // milliseconds (20Hz)
const accelerationStep = ref(0.1);
const maxLinearSpeed = ref(1.0);
const maxAngularSpeed = ref(1.0);

// ROS connection setup
const ROBOT_IP = '192.168.100.226'; // Replace with your robot's IP
const ros = new ROSLIB.Ros({
  url: `ws://${ROBOT_IP}:9090`
});

// Auto-refresh functions
function startAutoRefresh() {
  if (!autoRefreshEnabled.value) return;

  console.log(`🔄 Starting auto-refresh countdown (${autoRefreshDelay.value}s)`);
  refreshCountdown.value = autoRefreshDelay.value;

  countdownInterval = setInterval(() => {
    refreshCountdown.value--;
    if (refreshCountdown.value <= 0) {
      clearInterval(countdownInterval);
      refreshPage();
    }
  }, 1000);
}

function cancelAutoRefresh() {
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
    refreshTimeout = null;
  }
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  refreshCountdown.value = 0;
  console.log('❌ Auto-refresh cancelled');
}

function refreshPage() {
  console.log('🔄 Auto-refreshing page...');
  window.location.reload();
}

function toggleAutoRefresh() {
  autoRefreshEnabled.value = !autoRefreshEnabled.value;
  if (!autoRefreshEnabled.value) {
    cancelAutoRefresh();
  }
  console.log(`Auto-refresh ${autoRefreshEnabled.value ? 'enabled' : 'disabled'}`);
}

function updateAutoRefreshDelay(delay) {
  autoRefreshDelay.value = parseInt(delay);
}

// ROS connection event handlers
ros.on('connection', () => {
  console.log('✅ Connected to ROS');
  connectionStatus.value = 'Connected';
  cancelAutoRefresh(); // Cancel any pending refresh
});

ros.on('error', (error) => {
  console.error('❌ Error connecting to ROS:', error);
  connectionStatus.value = 'Error';
  startAutoRefresh(); // Start auto-refresh on error
});

ros.on('close', () => {
  console.log('🔌 Connection to ROS closed');
  connectionStatus.value = 'Disconnected';
  startAutoRefresh(); // Start auto-refresh on disconnect
});

// Define the /cmd_vel publisher
const cmdVel = new ROSLIB.Topic({
  ros,
  name: '/cmd_vel',
  messageType: 'geometry_msgs/Twist'
});

// Send Twist command
function sendCmd(linear, angular) {
  linear = Math.max(-maxLinearSpeed.value, Math.min(maxLinearSpeed.value, linear));
  angular = Math.max(-maxAngularSpeed.value, Math.min(maxAngularSpeed.value, angular));

  const twist = new ROSLIB.Message({
    linear: { x: linear, y: 0, z: 0 },
    angular: { x: 0, y: 0, z: angular }
  });
  cmdVel.publish(twist);
}

// Start continuous movement
function startMovement(targetLinear, targetAngular) {
  if (!manualModeEnabled.value) return; // Only allow movement if manual mode is enabled
  if (movementInterval) {
    clearInterval(movementInterval);
  }

  isMoving.value = true;
  let currentLinearSpeed = currentLinear.value;
  let currentAngularSpeed = currentAngular.value;

  sendCmd(currentLinearSpeed, currentAngularSpeed);

  movementInterval = setInterval(() => {
    if (isMoving.value) {
      if (Math.abs(currentLinearSpeed - targetLinear) > accelerationStep.value) {
        currentLinearSpeed += (targetLinear > currentLinearSpeed) ? accelerationStep.value : -accelerationStep.value;
      } else {
        currentLinearSpeed = targetLinear;
      }

      if (Math.abs(currentAngularSpeed - targetAngular) > accelerationStep.value) {
        currentAngularSpeed += (targetAngular > currentAngularSpeed) ? accelerationStep.value : -accelerationStep.value;
      } else {
        currentAngularSpeed = targetAngular;
      }

      currentLinear.value = currentLinearSpeed;
      currentAngular.value = currentAngularSpeed;
      sendCmd(currentLinearSpeed, currentAngularSpeed);
    }
  }, commandRate.value);
}

// Stop movement
function stopMovement() {
  isMoving.value = false;

  if (movementInterval) {
    clearInterval(movementInterval);
    movementInterval = null;
  }

  let currentLinearSpeed = currentLinear.value;
  let currentAngularSpeed = currentAngular.value;

  const decelerationInterval = setInterval(() => {
    if (Math.abs(currentLinearSpeed) > accelerationStep.value) {
      currentLinearSpeed *= 0.7;
    } else {
      currentLinearSpeed = 0;
    }

    if (Math.abs(currentAngularSpeed) > accelerationStep.value) {
      currentAngularSpeed *= 0.7;
    } else {
      currentAngularSpeed = 0;
    }

    sendCmd(currentLinearSpeed, currentAngularSpeed);

    if (Math.abs(currentLinearSpeed) < 0.01 && Math.abs(currentAngularSpeed) < 0.01) {
      clearInterval(decelerationInterval);
      currentLinear.value = 0;
      currentAngular.value = 0;
      sendCmd(0, 0);
    }
  }, commandRate.value);
}

// Keyboard controls
function handleKeyDown(event) {
  if (!manualModeEnabled.value) return; // Only allow keyboard control if manual mode is enabled
  if (isMoving.value) return; // Prevent multiple movement intervals

  switch(event.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      event.preventDefault();
      startMovement(maxLinearSpeed.value, 0);
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      event.preventDefault();
      startMovement(-maxLinearSpeed.value, 0);
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      event.preventDefault();
      startMovement(0, maxAngularSpeed.value);
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      event.preventDefault();
      startMovement(0, -maxAngularSpeed.value);
      break;
  }
}

function handleKeyUp(event) {
  if (!manualModeEnabled.value) return; // Only allow keyboard control if manual mode is enabled

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
      event.preventDefault();
      stopMovement();
      break;
  }
}

// Settings update functions
function updateCommandRate(hz) {
  commandRate.value = 1000 / parseInt(hz);
}

function updateMaxLinearSpeed(speed) {
  maxLinearSpeed.value = parseFloat(speed);
}

function updateMaxAngularSpeed(speed) {
  maxAngularSpeed.value = parseFloat(speed);
}

// Watch for manualModeEnabled changes to stop movement when disabled
watch(manualModeEnabled, (value) => {
  console.log('Manual mode:', value);
  if (!value) {
    stopMovement(); // Stop robot if manual mode is turned off
  }
});

// Setup ROS subscribers for status data
onMounted(() => {
  // Drive-by-wire topic
  const dbwTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/piu_dbw_feedback',
    messageType: 'rdc_dbw_interface/msg/DriveByWireStatus'
  });

  dbwTopic.subscribe((msg) => {
    dbw.value.piu_state = msg.piu_state;
    dbw.value.battery_voltage = msg.battery_voltage;
    dbw.value.battery_current = msg.battery_current;
    dbw.value.estop_trigger = msg.estop_trigger;
    dbw.value.front_md_fault = msg.front_md_fault;
    dbw.value.rear_md_fault = msg.rear_md_fault;
  });

  // Motion topic
  const motionTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/piu_motion_feedback',
    messageType: 'rdc_dbw_interface/msg/Encoder'
  });

  motionTopic.subscribe((msg) => {
    motion.value.left_encoder_ticks = msg.left_encoder_ticks;
    motion.value.right_encoder_ticks = msg.right_encoder_ticks;
    motion.value.front_left_rpm = msg.front_left_rpm;
    motion.value.rear_right_rpm = msg.rear_right_rpm;
    motion.value.speed = msg.speed;
    motion.value.left_wheel_speed_mps = msg.left_wheel_speed_mps;
    motion.value.right_wheel_speed_mps = msg.right_wheel_speed_mps;
  });

  // Joystick connection topic
  const joystickConnTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/joystick_conn',
    messageType: 'std_msgs/msg/Bool'
  });

  joystickConnTopic.subscribe((msg) => {
    joystick.value.connection = msg.data ? 'Connected' : 'Disconnected';
  });

  // Joystick mode topic
  const joystickModeTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/joystick/mode',
    messageType: 'std_msgs/msg/String'
  });

  joystickModeTopic.subscribe((msg) => {
    joystick.value.mode = msg.data;
  });

  // Add keyboard event listeners
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
});

// Cleanup
onUnmounted(() => {
  if (movementInterval) {
    clearInterval(movementInterval);
  }
  cancelAutoRefresh();
  sendCmd(0, 0); // Send stop command on component unmount
  document.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('keyup', handleKeyUp);
});
</script>

<style scoped>
/* Styles from original App.vue, adapted for TeleoperationUGVView.vue */
.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Adjusted for smaller space */
  gap: 15px;
  margin-bottom: 20px;
}

.status-item {
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.settings-grid {
  display: grid;
  grid-template-columns: 1fr; /* Single column for settings in this view */
  gap: 15px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.auto-refresh-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.refresh-notification {
  background-color: #fff3cd;
  color: #856404;
  padding: 10px;
  border-radius: 8px;
  border-left: 4px solid #ffc107;
  margin-top: 10px;
  font-weight: bold;
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

.control-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.button-row {
  display: flex;
  gap: 10px;
}

button {
  padding: 12px 20px;
  font-size: 16px;
  border: 2px solid #007bff;
  background-color: #007bff;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
  min-width: 80px;
}

button:hover {
  background-color: #0056b3;
  transform: translateY(-1px);
}

button:active {
  background-color: #004494;
  transform: translateY(0);
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

.Connected {
  color: #28a745;
  font-weight: bold;
}

.Disconnected {
  color: #dc3545;
  font-weight: bold;
}

.Error {
  color: #ffc107;
  font-weight: bold;
}

.success {
  color: #28a745;
  font-weight: bold;
}

.error {
  color: #dc3545;
  font-weight: bold;
}

img {
  border: 2px solid #ddd;
  border-radius: 8px;
  width: 100%;
  max-width: 640px; /* Adjust as needed for the layout */
  height: auto;
}

select, input[type="range"] {
  margin: 5px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

input[type="range"] {
  width: 100%; /* Make range input responsive */
}

input[type="checkbox"] {
  margin-right: 8px;
}

label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
}

span {
  font-weight: bold;
  /* color: #007bff; Removed specific color to allow status colors to apply */
}

/* Custom toggle switch styling */
.dot {
  transition: transform 0.3s ease;
}
input:checked + .block {
  background-color: #2563eb; /* blue-600 */
}
input:checked + .block .dot {
  transform: translateX(100%);
}
</style>
