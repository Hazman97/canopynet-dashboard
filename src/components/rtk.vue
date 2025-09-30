<template>
  <div class="rtk-container bg-white rounded-lg shadow-md p-6 flex flex-col">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <i class="bx bx-map-pin text-xl mr-2"></i>UGV Position Tracking
    </h3>
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
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p class="text-sm font-medium text-gray-700">Accuracy:</p>
        <p class="text-sm text-gray-800">{{ getPositionAccuracy() }} m</p>
      </div>
    </div>
    
    <div class="relative flex-grow bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
      <div :id="mapId" class="w-full h-full gps-map"></div>
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
    
    <div v-if="showHistoryModal" class="fixed inset-0 bg-black bg-opacity-60 z-50">
      <div class="flex h-full">
        <div class="flex-1" @click="showHistoryModal = false"></div>
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
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick, computed } from 'vue'

const props = defineProps({
  ros: Object,
  ugvId: String,
  mapId: String
});

// State for EKF and ROS data
const ekf = ref({
    // State: [x, y, heading_in_rads]
    state: [0, 0, 0],
    // Covariance matrix
    P: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
    // Process noise (tweak these based on real-world tests)
    Q: [[0.01, 0, 0], [0, 0.01, 0], [0, 0, 0.1]], 
    // Measurement noise (RTK noise, will be updated)
    R: [[1, 0], [0, 1]], 
    
    initialized: false,
    lastIMUTime: null,
});

const latestImuData = ref(null);
const latestEncoderData = ref(null);
const latestRtkData = ref(null);

// GPS data to display
const gpsData = ref({
  latitude: 0, longitude: 0, altitude: 0, status: 0, service: 0, position_covariance: [], timestamp: null
});

// Map-related variables
const map = ref(null);
const robotMarker = ref(null);
const trailPolyline = ref(null);
const trailPoints = ref([]);
const showTrail = ref(true);

// Trail History Management
const showHistoryModal = ref(false);
const trailHistory = ref([]);
let historicalTrailPolyline = null;

let rtkTopic = null;
let imuTopic = null;
let encoderTopic = null;
let ekfPredictionInterval = null;

// Conversion factor from meters to degrees (simplified)
const METERS_TO_DEGREES_LAT = 1 / 111132.95; 
const METERS_TO_DEGREES_LON = 1 / 88474.33; 

// EKF functions
function quaternionToEuler(q) {
  const x = q.x;
  const y = q.y;
  const z = q.z;
  const w = q.w;
  const sinr_cosp = 2 * (w * x + y * z);
  const cosr_cosp = 1 - 2 * (x * x + y * y);
  const roll = Math.atan2(sinr_cosp, cosr_cosp);

  const sinp = 2 * (w * y - z * x);
  let pitch;
  if (Math.abs(sinp) >= 1) {
    pitch = Math.sign(sinp) * Math.PI / 2;
  } else {
    pitch = Math.asin(sinp);
  }

  const siny_cosp = 2 * (w * z + x * y);
  const cosy_cosp = 1 - 2 * (y * y + z * z);
  const yaw = Math.atan2(siny_cosp, cosy_cosp);

  return { roll, pitch, yaw }; // yaw is the heading
}

function ekfPredict() {
    if (!ekf.value.initialized || !latestImuData.value || !latestEncoderData.value) {
        return;
    }

    const now = Date.now();
    const dt = (now - ekf.value.lastIMUTime) / 1000;
    if (dt <= 0) return;

    const { x: ang_vel_x, y: ang_vel_y, z: ang_vel_z } = latestImuData.value.angular_velocity;
    const linear_vel = latestEncoderData.value.speed;

    // Simplified motion model (straight-line + rotation)
    const psi = ekf.value.state[2];
    const new_x = ekf.value.state[0] + linear_vel * Math.cos(psi) * dt;
    const new_y = ekf.value.state[1] + linear_vel * Math.sin(psi) * dt;
    const new_psi = psi + ang_vel_z * dt;
    
    // Update state
    ekf.value.state = [new_x, new_y, new_psi];

    // Update covariance matrix (P)
    // For simplicity, we'll just add the process noise. A full EKF would have a more complex update.
    ekf.value.P[0][0] += ekf.value.Q[0][0];
    ekf.value.P[1][1] += ekf.value.Q[1][1];
    ekf.value.P[2][2] += ekf.value.Q[2][2];

    ekf.value.lastIMUTime = now;

    // Update the map with the new EKF state
    const newLat = gpsData.value.latitude + ekf.value.state[1] * METERS_TO_DEGREES_LAT;
    const newLng = gpsData.value.longitude + ekf.value.state[0] * METERS_TO_DEGREES_LON;
    updateMapLocation(newLat, newLng);
}

function ekfUpdate(measurement) {
    if (!ekf.value.initialized) {
        // Initialize EKF with the first RTK fix
        const { latitude, longitude, altitude } = measurement;
        ekf.value.state = [0, 0, 0];
        ekf.value.initialized = true;
        ekf.value.lastIMUTime = Date.now();
        gpsData.value.latitude = latitude;
        gpsData.value.longitude = longitude;
        gpsData.value.altitude = altitude;
        return;
    }

    // Convert RTK lat/lon to local x/y
    const measured_x = (measurement.latitude - gpsData.value.latitude) / METERS_TO_DEGREES_LAT;
    const measured_y = (measurement.longitude - gpsData.value.longitude) / METERS_TO_DEGREES_LON;
    const measured_state = [measured_x, measured_y];
    
    // Calculate Kalman Gain (K)
    const H = [[1, 0, 0], [0, 1, 0]]; // Observation matrix, for position
    const HT = [[1, 0], [0, 1], [0, 0]];
    const S = [[ekf.value.P[0][0] + ekf.value.R[0][0], ekf.value.P[0][1]], [ekf.value.P[1][0], ekf.value.P[1][1] + ekf.value.R[1][1]]]; // H*P*HT + R
    const S_inv = 1 / (S[0][0] * S[1][1] - S[0][1] * S[1][0]) * [[S[1][1], -S[0][1]], [-S[1][0], S[0][0]]];
    
    const K = [[ekf.value.P[0][0] * HT[0][0] + ekf.value.P[0][1] * HT[1][0], ekf.value.P[0][0] * HT[0][1] + ekf.value.P[0][1] * HT[1][1]],
               [ekf.value.P[1][0] * HT[0][0] + ekf.value.P[1][1] * HT[1][0], ekf.value.P[1][0] * HT[0][1] + ekf.value.P[1][1] * HT[1][1]],
               [ekf.value.P[2][0] * HT[0][0] + ekf.value.P[2][1] * HT[1][0], ekf.value.P[2][0] * HT[0][1] + ekf.value.P[2][1] * HT[1][1]]]; // P * HT
    const K_final = [[K[0][0] * S_inv[0][0] + K[0][1] * S_inv[1][0], K[0][0] * S_inv[0][1] + K[0][1] * S_inv[1][1]],
                     [K[1][0] * S_inv[0][0] + K[1][1] * S_inv[1][0], K[1][0] * S_inv[0][1] + K[1][1] * S_inv[1][1]],
                     [K[2][0] * S_inv[0][0] + K[2][1] * S_inv[1][0], K[2][0] * S_inv[0][1] + K[2][1] * S_inv[1][1]]]; // K_pre * S_inv

    // Update state vector
    const innovation = [measured_state[0] - ekf.value.state[0], measured_state[1] - ekf.value.state[1]];
    ekf.value.state[0] += K_final[0][0] * innovation[0] + K_final[0][1] * innovation[1];
    ekf.value.state[1] += K_final[1][0] * innovation[0] + K_final[1][1] * innovation[1];
    ekf.value.state[2] += K_final[2][0] * innovation[0] + K_final[2][1] * innovation[1];

    // Update covariance matrix
    const I = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    const I_KH = [[1-K_final[0][0]*H[0][0]-K_final[0][1]*H[1][0], -K_final[0][0]*H[0][1]-K_final[0][1]*H[1][1], 0],
                  [-K_final[1][0]*H[0][0]-K_final[1][1]*H[1][0], 1-K_final[1][0]*H[0][1]-K_final[1][1]*H[1][1], 0],
                  [-K_final[2][0]*H[0][0]-K_final[2][1]*H[1][0], -K_final[2][0]*H[0][1]-K_final[2][1]*H[1][1], 1]];
    
    const P_new = [[I_KH[0][0]*ekf.value.P[0][0] + I_KH[0][1]*ekf.value.P[1][0] + I_KH[0][2]*ekf.value.P[2][0], I_KH[0][0]*ekf.value.P[0][1] + I_KH[0][1]*ekf.value.P[1][1] + I_KH[0][2]*ekf.value.P[2][1], I_KH[0][0]*ekf.value.P[0][2] + I_KH[0][1]*ekf.value.P[1][2] + I_KH[0][2]*ekf.value.P[2][2]],
                   [I_KH[1][0]*ekf.value.P[0][0] + I_KH[1][1]*ekf.value.P[1][0] + I_KH[1][2]*ekf.value.P[2][0], I_KH[1][0]*ekf.value.P[0][1] + I_KH[1][1]*ekf.value.P[1][1] + I_KH[1][2]*ekf.value.P[2][1], I_KH[1][0]*ekf.value.P[0][2] + I_KH[1][1]*ekf.value.P[1][2] + I_KH[1][2]*ekf.value.P[2][2]],
                   [I_KH[2][0]*ekf.value.P[0][0] + I_KH[2][1]*ekf.value.P[1][0] + I_KH[2][2]*ekf.value.P[2][0], I_KH[2][0]*ekf.value.P[0][1] + I_KH[2][1]*ekf.value.P[1][1] + I_KH[2][2]*ekf.value.P[2][1], I_KH[2][0]*ekf.value.P[0][2] + I_KH[2][1]*ekf.value.P[1][2] + I_KH[2][2]*ekf.value.P[2][2]]];
    ekf.value.P = P_new;

    // Update base lat/lon to be the corrected RTK position
    gpsData.value.latitude = measurement.latitude;
    gpsData.value.longitude = measurement.longitude;
    gpsData.value.altitude = measurement.altitude;
    gpsData.value.status = measurement.status.status.status;
    gpsData.value.service = measurement.status.status.service;
    gpsData.value.position_covariance = measurement.status.position_covariance;
    gpsData.value.timestamp = Date.now();
}

// Data update functions from parent component
const updateEncoderData = (data) => {
    latestEncoderData.value = data;
};
const updateImuData = (data) => {
    latestImuData.value = data;
};

// Expose these functions to the parent
defineExpose({
    updateEncoderData,
    updateImuData,
    trailPoints
});


// Trail History Functions
const formatDate = (dateString) => new Date(dateString).toLocaleString();
const loadTrailHistory = () => {
  const savedHistory = localStorage.getItem(`trailHistory_${props.ugvId}`);
  if (savedHistory) {
    try { trailHistory.value = JSON.parse(savedHistory); } catch(e) { console.error("Could not parse saved trail history", e); trailHistory.value = []; }
  }
};
const saveTrailHistory = () => localStorage.setItem(`trailHistory_${props.ugvId}`, JSON.stringify(trailHistory.value));
const saveCurrentTrail = () => {
  if (trailPoints.value.length < 2) { alert("Not enough points in the current trail to save."); return; }
  const trailName = prompt("Enter a name for this trail:", `Trail - ${new Date().toLocaleString()}`);
  if (trailName) {
    const newTrail = { id: Date.now().toString(), name: trailName, date: new Date().toISOString(), points: JSON.parse(JSON.stringify(trailPoints.value)), editing: false };
    trailHistory.value.unshift(newTrail);
    saveTrailHistory();
    alert(`Trail "${trailName}" saved!`);
  }
};
const deleteFromHistory = (trailId) => {
  if (confirm("Are you sure you want to delete this trail?")) {
    trailHistory.value = trailHistory.value.filter(trail => trail.id === trailId);
    saveTrailHistory();
  }
};
const toggleEditTrail = (trail) => { trail.editing = !trail.editing; if (!trail.editing) { saveTrailHistory(); } };
const finishEditingTrail = (trail) => { trail.editing = false; saveTrailHistory(); };
const loadHistoricalTrail = (trailToLoad) => {
  if (typeof window.L === 'undefined') return;
  if (historicalTrailPolyline && map.value) { map.value.removeLayer(historicalTrailPolyline); }
  historicalTrailPolyline = window.L.polyline(trailToLoad.points, { color: '#8b5cf6', weight: 4, opacity: 0.8, }).addTo(map.value);
  if(map.value) { map.value.fitBounds(historicalTrailPolyline.getBounds()); }
  showHistoryModal.value = false;
};

// GPS utility functions
function getGpsStatusText() {
  const status = gpsData.value.status;
  switch(status) {
    case 0: return 'No Fix'; case 1: return 'GPS Fix'; case 2: return 'DGPS Fix';
    case 3: return 'PPS Fix'; case 4: return 'Real-time Kinematic'; case 5: return 'Float RTK';
    case 6: return 'Dead Reckoning'; case 7: return 'Manual Input'; case 8: return 'Simulation';
    default: return `Unknown (${status})`;
  }
}
function getGpsStatusClass() {
  const status = gpsData.value.status;
  if (status >= 4) return 'text-green-600';
  if (status >= 1) return 'text-yellow-600';
  return 'text-red-600';
}
function getPositionAccuracy() {
  const cov = gpsData.value.position_covariance;
  if (cov.length >= 9) {
    const horizontal_accuracy = Math.sqrt((cov[0] + cov[4]) / 2);
    return horizontal_accuracy.toFixed(2);
  }
  return 'N/A';
}
function formatTimestamp(timestamp) {
  if (!timestamp) return 'Never';
  return new Date(timestamp).toLocaleTimeString();
}

// Map functions
function createRobotIcon() {
  if (typeof window.L === 'undefined') return null;
  return window.L.divIcon({ className: 'robot-marker', html: '<div class="robot-icon">🤖</div>', iconSize: [30, 30], iconAnchor: [15, 15] });
}
function createTrailPolyline() {
  if (typeof window.L === 'undefined') return null;
  return window.L.polyline([], { color: '#007bff', weight: 3, opacity: 0.7 });
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

async function initializeMap() {
  await nextTick();
  if (typeof window.L === 'undefined') { console.error('Leaflet not loaded yet'); return; }
  const defaultLat = gpsData.value.latitude || 2.92012435;
  const defaultLng = gpsData.value.longitude || 101.636099842;
  
  if (map.value) map.value.remove();
  
  map.value = await initializeMapBase(props.mapId, defaultLat, defaultLng);
  
  if (map.value) {
    const robotIcon = createRobotIcon();
    if (robotIcon) robotMarker.value = L.marker([defaultLat, defaultLng], { icon: robotIcon }).addTo(map.value);
    
    trailPolyline.value = createTrailPolyline();
    if (trailPolyline.value) {
      trailPolyline.value.addTo(map.value);
      trailPolyline.value.setLatLngs([...trailPoints.value]);
    }
  }
}

function updateMapLocation(lat, lng) {
  const newPosition = [lat, lng];
  if (robotMarker.value) { robotMarker.value.setLatLng(newPosition); }
  
  if (showTrail.value) {
    const lastPoint = trailPoints.value[trailPoints.value.length - 1];
    if (!lastPoint || Math.abs(lastPoint[0] - lat) > 0.00001 || Math.abs(lastPoint[1] - lng) > 0.00001) {
      trailPoints.value.push(newPosition);
      if (trailPoints.value.length > 2000) { trailPoints.value.shift(); }
      if (trailPolyline.value) { trailPolyline.value.setLatLngs([...trailPoints.value]); }
      localStorage.setItem(`trail_${props.ugvId}`, JSON.stringify(trailPoints.value));
    }
  }
}

function centerMapOnRobot() {
  if (map.value && robotMarker.value) {
    const position = robotMarker.value.getLatLng();
    map.value.setView([position.lat, position.lng], map.value.getZoom());
  }
}

function toggleTrail() {
  showTrail.value = !showTrail.value;
  if (map.value && trailPolyline.value) {
    if (showTrail.value) { map.value.addLayer(trailPolyline.value); } else { map.value.removeLayer(trailPolyline.value); }
  }
}

function clearTrail() {
  trailPoints.value = [];
  if (trailPolyline.value) { trailPolyline.value.setLatLngs([]); }
  localStorage.removeItem(`trail_${props.ugvId}`);
}

const subscribeToRosTopics = () => {
  if (!props.ros || !props.ros.isConnected) return;
  
  if (rtkTopic) rtkTopic.unsubscribe();
  if (imuTopic) imuTopic.unsubscribe();
  if (encoderTopic) encoderTopic.unsubscribe();

  // RTK Topic Subscription (for EKF update)
  rtkTopic = new ROSLIB.Topic({
    ros: props.ros,
    name: '/rtklib_nav',
    messageType: 'rtklib_msgs/msg/RtklibNav'
  });
  rtkTopic.subscribe((msg) => {
      // Use RTK data for the EKF update step
      ekfUpdate(msg);
  });
  
  // Encoder Topic Subscription
  encoderTopic = new ROSLIB.Topic({
    ros: props.ros,
    name: '/piu_motion_feedback',
    messageType: 'rdc_dbw_interface/msg/Encoder',
  });
  encoderTopic.subscribe((msg) => {
      latestEncoderData.value = msg;
  });

  // IMU Topic Subscription
  imuTopic = new ROSLIB.Topic({
    ros: props.ros,
    name: '/zed2i/zed_node/imu/data',
    messageType: 'sensor_msgs/msg/Imu',
  });
  imuTopic.subscribe((msg) => {
      latestImuData.value = msg;
  });

  // Start the EKF prediction loop
  if (ekfPredictionInterval) clearInterval(ekfPredictionInterval);
  ekfPredictionInterval = setInterval(ekfPredict, 50); // Run at 20Hz
};


watch(() => props.ros?.isConnected, (isConnected) => {
  if (isConnected) {
    subscribeToRosTopics();
  }
});

onMounted(async () => {
  const savedTrail = localStorage.getItem(`trail_${props.ugvId}`);
  if (savedTrail) {
    try { trailPoints.value = JSON.parse(savedTrail); } catch(e) { console.error("Could not parse saved trail", e); }
  }
  loadTrailHistory();
  await nextTick();
  await initializeMap();
});

onUnmounted(() => {
  if (rtkTopic) rtkTopic.unsubscribe();
  if (imuTopic) imuTopic.unsubscribe();
  if (encoderTopic) encoderTopic.unsubscribe();
  if (ekfPredictionInterval) clearInterval(ekfPredictionInterval);
  if (map.value) map.value.remove();
});
</script>

<style scoped>
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
</style>