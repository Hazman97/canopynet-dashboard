<template>
  <div class="flex-grow p-6 bg-gray-100 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Mesh Network Overview</h1>
      <div class="flex items-center space-x-4 text-gray-600">
        <span class="text-sm">Last Updated: July 14, 2025, 5:00 PM</span>
        <button class="px-3 py-1 bg-white rounded-md border border-gray-300 hover:bg-gray-50 transition duration-150 ease-in-out flex items-center text-sm">
          <i class="bx bx-refresh text-lg mr-1"></i> Refresh
        </button>
      </div>
    </div>
    <p class="text-gray-600 mb-8">Real-time monitoring and management of the plantation's mesh network infrastructure.</p>

    <div class="bg-white rounded-lg shadow-md p-4 mb-8 sticky top-0 z-10 border-b border-gray-200">
      <nav class="flex space-x-6">
        <a @click.prevent="scrollToSection('overview-section')"
           :class="{'text-indigo-600 font-semibold border-b-2 border-indigo-600': activeSection === 'overview-section', 'text-gray-600 hover:text-indigo-600': activeSection !== 'overview-section'}"
           class="pb-2 cursor-pointer transition duration-150 ease-in-out">Overview</a>
        <a @click.prevent="scrollToSection('network-map-section')"
           :class="{'text-indigo-600 font-semibold border-b-2 border-indigo-600': activeSection === 'network-map-section', 'text-gray-600 hover:text-indigo-600': activeSection !== 'network-map-section'}"
           class="pb-2 cursor-pointer transition duration-150 ease-in-out">Network Map</a>
        <a @click.prevent="scrollToSection('node-management-section')"
           :class="{'text-indigo-600 font-semibold border-b-2 border-indigo-600': activeSection === 'node-management-section', 'text-gray-600 hover:text-indigo-600': activeSection !== 'node-management-section'}"
           class="pb-2 cursor-pointer transition duration-150 ease-in-out">Node Management</a>
        <a @click.prevent="scrollToSection('monitoring-section')"
           :class="{'text-indigo-600 font-semibold border-b-2 border-indigo-600': activeSection === 'monitoring-section', 'text-gray-600 hover:text-indigo-600': activeSection !== 'monitoring-section'}"
           class="pb-2 cursor-pointer transition duration-150 ease-in-out">Monitoring</a>
      </nav>
    </div>

    <div id="overview-section" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between border border-gray-200">
        <div>
          <p class="text-sm text-gray-500">Total Devices</p>
          <p class="text-3xl font-bold text-gray-800">25</p>
        </div>
        <div class="p-3 bg-blue-100 rounded-full text-blue-500">
          <i class="bx bx-wifi text-2xl"></i>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between border border-gray-200">
        <div>
          <p class="text-sm text-gray-500">Online Devices</p>
          <p class="text-3xl font-bold text-green-700">22</p>
        </div>
        <div class="p-3 bg-green-100 rounded-full text-green-500">
          <i class="bx bx-check-circle text-2xl"></i>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between border border-gray-200">
        <div>
          <p class="text-sm text-gray-500">Offline Devices</p>
          <p class="text-3xl font-bold text-red-700">3</p>
        </div>
        <div class="p-3 bg-red-100 rounded-full text-red-500">
          <i class="bx bx-x-circle text-2xl"></i>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between border border-gray-200">
        <div>
          <p class="text-sm text-gray-500">Avg. Latency</p>
          <p class="text-3xl font-bold text-orange-700">25 <span class="text-lg font-normal">ms</span></p>
        </div>
        <div class="p-3 bg-orange-100 rounded-full text-orange-500">
          <i class="bx bx-time text-2xl"></i>
        </div>
      </div>
    </div>

    <div id="network-map-section" class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div class="lg:col-span-2 bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Mesh Network Topology</h2>
        <div id="meshMap" style="height: 500px;" class="rounded-md bg-gray-100"></div>
      </div>

      <div class="lg:col-span-1 bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col justify-between">
        <div>
          <h2 class="text-xl font-bold text-gray-800 mb-4">Data Throughput (Current)</h2>
          <div class="flex items-end justify-center h-48">
            <p class="text-6xl font-extrabold text-indigo-700">125.8 <span class="text-3xl font-bold text-gray-600">Mbps</span></p>
          </div>
        </div>
        <div class="text-center text-gray-600 mt-4">
          <p class="text-sm">Peak: 150 Mbps, Average: 110 Mbps</p>
        </div>
      </div>
    </div>

    <div id="node-management-section" class="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
      <h2 class="text-xl font-bold text-gray-800 mb-4">Device Status Overview</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latency</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Seen</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="device in devices" :key="device.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ device.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ device.type }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadgeColor(device.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ getDisplayStatus(device.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ device.latency }} ms</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ device.lastSeen }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a href="#" class="text-indigo-600 hover:text-indigo-900">View Details</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div id="monitoring-section" class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 class="text-xl font-bold text-gray-800 mb-4">Network Recommendations</h2>
      <ul class="space-y-4">
        <li v-for="(rec, index) in recommendations" :key="index" class="flex items-start bg-gray-50 p-4 rounded-lg border border-gray-100">
          <i :class="['bx mr-3 text-2xl', getRecommendationIcon(rec.priority), getRecommendationIconColor(rec.priority)]"></i>
          <div>
            <p class="font-semibold text-gray-800">{{ rec.title }}</p>
            <p class="text-gray-600 text-sm">{{ rec.description }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// State for active section for navigation highlighting
const activeSection = ref('overview-section'); // Default active section

// Dummy data for devices in the table
const devices = ref([
  { id: 'dev-001', name: 'Gateway Node 1', type: 'Gateway', status: 'online', latency: 15, lastSeen: '2025-07-14 17:00' },
  { id: 'dev-002', name: 'Sensor Node A3', type: 'Sensor', status: 'online', latency: 22, lastSeen: '2025-07-14 17:00' },
  { id: 'dev-003', name: 'Camera Node B1', type: 'Camera', status: 'offline', latency: '-', lastSeen: '2025-07-14 16:30' },
  { id: 'dev-004', name: 'Repeater C', type: 'Repeater', status: 'online', latency: 18, lastSeen: '2025-07-14 17:00' },
  { id: 'dev-005', name: 'Sensor Node D5', type: 'Sensor', status: 'online', latency: 20, lastSeen: '2025-07-14 17:00' },
  { id: 'dev-006', name: 'Weather Station', type: 'Sensor', status: 'offline', latency: '-', lastSeen: '2025-07-14 10:00' },
  { id: 'dev-007', name: 'Gateway Node 2', type: 'Gateway', status: 'online', latency: 16, lastSeen: '2025-07-14 17:00' },
  { id: 'dev-008', name: 'UGV Charger', type: 'Utility', status: 'maintenance', latency: '-', lastSeen: '2025-07-13 09:00' },
]);

// Dummy data for recommendations
const recommendations = ref([
  {
    priority: 'high',
    title: 'Investigate offline Camera Node B1',
    description: 'Connectivity issue detected. Prioritize investigation and repair to restore surveillance.',
  },
  {
    priority: 'medium',
    title: 'Optimize repeater placement in Northern section',
    description: 'Signal strength degradation observed. Consider adding or relocating a repeater for better coverage.',
  },
  {
    priority: 'low',
    title: 'Schedule firmware update for all sensor nodes',
    description: 'Ensure all sensor nodes are running the latest firmware for improved performance and security.',
  },
]);

// Helper functions for dynamic styling (similar to AnalyticsView)
const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'online':
      return 'bg-green-100 text-green-700';
    case 'offline':
      return 'bg-red-100 text-red-700';
    case 'maintenance':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getDisplayStatus = (status) => {
  switch (status) {
    case 'online':
      return 'Online';
    case 'offline':
      return 'Offline';
    case 'maintenance':
      return 'Maintenance';
    default:
      return status;
  }
};

const getRecommendationIcon = (priority) => {
  switch (priority) {
    case 'high': return 'bxs-error';
    case 'medium': return 'bxs-info-circle';
    case 'low': return 'bxs-bulb';
    default: return 'bx-check-circle';
  }
};

const getRecommendationIconColor = (priority) => {
  switch (priority) {
    case 'high': return 'text-red-500';
    case 'medium': return 'text-orange-500';
    case 'low': return 'text-blue-500';
    default: return 'text-gray-500';
  }
};

// Function to scroll to a section
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// Intersection Observer to update active section on scroll
let observer;
onMounted(() => {
  const map = L.map('meshMap').setView([3.0, 101.7], 13); // Centered roughly on Selangor/KL area

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Dummy Nodes and Connections for the Mesh Map
  const nodes = [
    { id: 'g1', lat: 3.01, lng: 101.71, name: 'Gateway 1', status: 'online', type: 'gateway' },
    { id: 's1', lat: 3.02, lng: 101.72, name: 'Sensor A1', status: 'online', type: 'sensor' },
    { id: 's2', lat: 2.99, lng: 101.70, name: 'Sensor A2', status: 'online', type: 'sensor' },
    { id: 'c1', lat: 3.005, lng: 101.73, name: 'Camera B1', status: 'offline', type: 'camera' },
    { id: 'r1', lat: 3.03, lng: 101.715, name: 'Repeater 1', status: 'online', type: 'repeater' },
    { id: 'g2', lat: 2.98, lng: 101.72, name: 'Gateway 2', status: 'online', type: 'gateway' },
    { id: 's3', lat: 2.995, lng: 101.735, name: 'Sensor B2', status: 'online', type: 'sensor' },
  ];

  const connections = [
    { from: 'g1', to: 's1', status: 'good' },
    { from: 'g1', to: 's2', status: 'good' },
    { from: 'g1', to: 'r1', status: 'good' },
    { from: 's1', to: 'r1', status: 'good' },
    { from: 's2', to: 'c1', status: 'degraded' }, // Simulate a degraded connection
    { from: 'g2', to: 's2', status: 'good' },
    { from: 'g2', to: 's3', status: 'good' },
  ];

  // Custom icons for nodes
  const getIcon = (type, status) => {
    let iconUrl;
    let className = 'mesh-icon ';
    switch (type) {
      case 'gateway': iconUrl = '/icons/gateway-icon.png'; break; // Placeholder, you'd have actual icons
      case 'sensor': iconUrl = '/icons/sensor-icon.png'; break;
      case 'camera': iconUrl = '/icons/camera-icon.png'; break;
      case 'repeater': iconUrl = '/icons/repeater-icon.png'; break;
      case 'utility': iconUrl = '/icons/utility-icon.png'; break;
      default: iconUrl = '/icons/default-icon.png';
    }

    switch (status) {
      case 'online': className += 'online'; break;
      case 'offline': className += 'offline'; break;
      case 'maintenance': className += 'maintenance'; break;
    }

    return L.icon({
      iconUrl: iconUrl,
      iconSize: [32, 32], // size of the icon
      iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
      popupAnchor: [0, -32], // point from which the popup should open relative to the iconAnchor
      className: className
    });
  };

  const markers = {};

  // Add nodes to map
  nodes.forEach(node => {
    const marker = L.marker([node.lat, node.lng], { icon: getIcon(node.type, node.status) })
      .bindPopup(`<b>${node.name}</b><br>Status: ${getDisplayStatus(node.status)}<br>Type: ${node.type}`)
      .addTo(map);
    markers[node.id] = marker;
  });

  // Add connections to map
  connections.forEach(conn => {
    const fromMarker = markers[conn.from];
    const toMarker = markers[conn.to];

    if (fromMarker && toMarker) {
      const latlngs = [fromMarker.getLatLng(), toMarker.getLatLng()];
      let polylineColor = '#22C55E'; // green-500 for good
      if (conn.status === 'degraded') {
        polylineColor = '#F59E0B'; // orange-500 for degraded
      } else if (conn.status === 'offline') {
        polylineColor = '#EF4444'; // red-500 for offline
      }

      L.polyline(latlngs, { color: polylineColor, weight: 3 }).addTo(map);
    }
  });

  // Fit map to markers
  const group = new L.featureGroup(Object.values(markers));
  map.fitBounds(group.getBounds().pad(0.5)); // Add some padding

  // Intersection Observer for section highlighting
  const sections = ['overview-section', 'network-map-section', 'node-management-section', 'monitoring-section'];
  const options = {
    root: null, // viewport
    rootMargin: '-50% 0px -49% 0px', // When 50% of the section is in view
    threshold: 0
  };

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id;
      }
    });
  }, options);

  sections.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      observer.observe(element);
    }
  });
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
/* Basic styling for custom Leaflet icons to show status visually */
.mesh-icon {
  border-radius: 50%;
  border: 2px solid;
  box-shadow: 0 0 5px rgba(0,0,0,0.3);
}

.mesh-icon.online {
  border-color: #22C55E; /* green-500 */
}

.mesh-icon.offline {
  border-color: #EF4444; /* red-500 */
}

.mesh-icon.maintenance {
  border-color: #F59E0B; /* yellow-500 */
}
</style>