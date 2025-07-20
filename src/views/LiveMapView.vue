<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <div class="w-80 bg-white p-6 shadow-lg flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-800">Log Buat Asahan</h2>
          <button class="text-gray-500 hover:text-gray-700">
            <i class="bx bx-refresh text-xl"></i>
          </button>
        </div>

        <div class="mb-6">
          <p class="text-gray-600 mb-2">7/1/2024 - 12/31/2024</p>
          <a href="#" class="text-blue-600 hover:underline text-sm">Machine Comparison</a>
        </div>

        <div class="mb-8">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Coverage Statistics</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Total Area</span>
              <span class="font-bold text-gray-800">156.7 HA</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Covered Today</span>
              <span class="font-bold text-green-600">8.9 HA</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Remaining</span>
              <span class="font-bold text-orange-500">147.8 HA</span>
            </div>
            <div class="mt-4">
              <span class="text-gray-600">Progress</span>
              <div class="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div class="bg-green-500 h-2.5 rounded-full" :style="{ width: progress + '%' }"></div>
              </div>
              <span class="text-sm font-medium text-gray-700 mt-1 block text-right">{{ progress }}%</span>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Active Machines</span>
            <span class="font-bold text-gray-800">3</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Avg Speed</span>
            <span class="font-bold text-gray-800">2.1 HA/day</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">ETA Completion</span>
            <span class="font-bold text-gray-800">70 days</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content (Map) -->
    <div class="flex-1 relative">
      <div id="map" class="h-full w-full rounded-lg shadow-md"></div>
    </div>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css';

export default {
  name: 'LiveMap',
  data() {
    return {
      progress: 5.7,
      map: null,
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      if (typeof window.L === 'undefined') {
        console.error("Leaflet (L) is not defined. Please ensure Leaflet is loaded globally (e.g., via a CDN).");
        return;
      }

      // Initialize map centered around the new nodes
      this.map = window.L.map('map').setView([2.777139, 102.920252], 15); // Adjusted center and zoom level

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      // --- Custom Icon Definitions ---
      // Node Icon
      const nodeIcon = window.L.divIcon({
        className: 'custom-div-icon',
        html: '<div style="background-color:#4299e1; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow: 0 2px 5px rgba(0,0,0,0.2);"><i class="bx bxs-network-chart text-white text-xl"></i></div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15], // Half of iconSize to center
        popupAnchor: [0, -15] // Adjust popup position
      });

      // Asset Icon (e.g., truck)
      const assetIcon = window.L.divIcon({
        className: 'custom-div-icon',
        html: '<div style="background-color:#ed8936; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow: 0 2px 5px rgba(0,0,0,0.2);"><i class="bx bxs-truck text-white text-xl"></i></div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
      });

      // Worker Icon
      const workerIcon = window.L.divIcon({
        className: 'custom-div-icon',
        html: '<div style="background-color:#38a169; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow: 0 2px 5px rgba(0,0,0,0.2);"><i class="bx bxs-face text-white text-xl"></i></div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
      });

      // UGV Icon
      const ugvIcon = window.L.divIcon({
        className: 'custom-div-icon',
        html: '<div style="background-color:#667eea; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow: 0 2px 5px rgba(0,0,0,0.2);"><i class="bx bx-bot text-white text-xl"></i></div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
      });

      // --- Define Data for different entities ---
      const nodes = [
        { lat: 2.7784855, lng: 102.9219589, name: 'Node 1' },
        { lat: 2.7787562, lng: 102.9191988, name: 'Node 2' },
        { lat: 2.7761805, lng: 102.9196005, name: 'Node 3' },
      ];

      const assets = [
        { lat: 2.7770000, lng: 102.9205000, name: 'Tractor Alpha' }, // Randomly near nodes
        { lat: 2.7790000, lng: 102.9225000, name: 'Harvester Beta' },
      ];

      const workers = [
        { lat: 2.7765000, lng: 102.9180000, name: 'Worker Ali' }, // Randomly near nodes
        { lat: 2.7775000, lng: 102.9210000, name: 'Worker Bala' },
      ];

      const ugvs = [
        { lat: 2.7780000, lng: 102.9200000, name: 'UGV-001' }, // Randomly near nodes
      ];

      // --- Add Markers and Circles for Nodes ---
      nodes.forEach(node => {
        window.L.marker([node.lat, node.lng], { icon: nodeIcon }).addTo(this.map)
          .bindPopup(`<b>${node.name}</b>`);

        window.L.circle([node.lat, node.lng], {
          color: 'blue',
          fillColor: '#3080ff',
          fillOpacity: 0.2,
          radius: 200 // Radius in meters
        }).addTo(this.map).bindPopup(`<b>${node.name}</b><br>Coverage Radius: 200m`);
      });

      // --- Add Markers for Assets ---
      assets.forEach(asset => {
        window.L.marker([asset.lat, asset.lng], { icon: assetIcon }).addTo(this.map)
          .bindPopup(`<b>${asset.name}</b>`);
      });

      // --- Add Markers for Workers ---
      workers.forEach(worker => {
        window.L.marker([worker.lat, worker.lng], { icon: workerIcon }).addTo(this.map)
          .bindPopup(`<b>${worker.name}</b>`);
      });

      // --- Add Markers for UGVs ---
      ugvs.forEach(ugv => {
        window.L.marker([ugv.lat, ugv.lng], { icon: ugvIcon }).addTo(this.map)
          .bindPopup(`<b>${ugv.name}</b>`);
      });
    }
  }
};
</script>

<style scoped>
#map {
  height: 100%;
  width: 100%;
}

/* Optional: Basic styling for the custom div icons if needed, though inline styles handle much of it */
.custom-div-icon {
  background: none !important; /* Ensure no default Leaflet background */
  border: none !important; /* Ensure no default Leaflet border */
}
</style>