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

      this.map = window.L.map('map').setView([2.7768, 102.9195], 13);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      window.L.marker([2.7768, 102.9195]).addTo(this.map)
        .bindPopup('A Mesh Node')
        .openPopup();

      window.L.marker([2.7800, 102.9250]).addTo(this.map)
        .bindPopup('Worker Location');
    }
  }
};
</script>

<style scoped>
#map {
  height: 100%;
  width: 100%;
}
</style>
