<template>
  <div class="flex flex-col min-h-screen ml-5">
    <!-- 🗺 Map -->
    <div id="map" class="h-[400px] w-full z-0" />

    <!-- 📊 UGV Status Table -->
    <div class="mt-4 overflow-x-auto px-4">
      <table class="min-w-full border border-gray-300 text-sm">
        <thead class="bg-gray-100 text-left">
          <tr>
            <th class="px-4 py-2 border">Name</th>
            <th class="px-4 py-2 border">Battery</th>
            <th class="px-4 py-2 border">Speed</th>
            <th class="px-4 py-2 border">Latitude</th>
            <th class="px-4 py-2 border">Longitude</th>
            <th class="px-4 py-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ugv in ugvs" :key="ugv.id" class="hover:bg-gray-50">
            <td class="px-4 py-2 border">{{ ugv.name }}</td>
            <td class="px-4 py-2 border">{{ ugv.battery }}%</td>
            <td class="px-4 py-2 border">{{ ugv.speed }} km/h</td>
            <td class="px-4 py-2 border">{{ ugv.coords[0].toFixed(5) }}</td>
            <td class="px-4 py-2 border">{{ ugv.coords[1].toFixed(5) }}</td>
            <td class="px-4 py-2 border text-blue-600 cursor-pointer hover:underline" @click="openLiveView(ugv)">
              View
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 📺 Live View Modal -->
   <!-- 🌟 Improved Modal -->
<div
  v-if="selectedUGV"
  class="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-white/10"
>
  <div class="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl relative border border-gray-200">
    <!-- 🔘 Header -->
    <div class="flex justify-between items-center mb-4 border-b pb-3">
      <h2 class="text-xl font-semibold text-gray-800">📹 Live View: {{ selectedUGV.name }}</h2>
      <button
        class="text-gray-500 hover:text-red-500 text-2xl font-bold transition"
        @click="selectedUGV = null"
        aria-label="Close"
      >
        &times;
      </button>
    </div>

    <!-- 🎥 Stream Area -->
    <div class="aspect-video bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 text-base">
      Live camera stream from <strong>{{ selectedUGV.name }}</strong> goes here.
    </div>
  </div>
</div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// UGV data
const ugvs = reactive([
  { id: 1, name: 'UGV Alpha', coords: [5.353, 100.305], battery: 92, speed: 5, path: [] },
  { id: 2, name: 'UGV Bravo', coords: [5.3535, 100.306], battery: 87, speed: 4, path: [] },
  { id: 3, name: 'UGV Charlie', coords: [5.354, 100.304], battery: 78, speed: 6, path: [] },
  { id: 4, name: 'UGV Delta', coords: [5.3545, 100.305], battery: 83, speed: 7, path: [] },
  { id: 5, name: 'UGV Echo', coords: [5.355, 100.306], battery: 91, speed: 3, path: [] }
])

// Refs
const selectedUGV = ref(null)
const map = ref(null)
const markers = {}
const polylines = {}

// Open modal with selected UGV
function openLiveView(ugv) {
  selectedUGV.value = ugv
}

// Map init
onMounted(() => {
  map.value = L.map('map').setView([5.3535, 100.3055], 17)

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution:
    '&copy; OpenStreetMap contributors &copy; <a href="https://carto.com/">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map.value)


  ugvs.forEach((ugv) => {
    ugv.path.push([...ugv.coords])

    // Marker
    markers[ugv.id] = L.marker(ugv.coords, { title: ugv.name })
      .addTo(map.value)
      .bindPopup(`${ugv.name}<br>Battery: ${ugv.battery}%<br>Speed: ${ugv.speed} km/h`)

    // Polyline (path trail)
    polylines[ugv.id] = L.polyline(ugv.path, {
      color: getRandomColor(),
      weight: 3
    }).addTo(map.value)
  })

  // Simulate live movement
  let updates = 0
  const interval = setInterval(() => {
    if (++updates > 10) {
      clearInterval(interval)
      return
    }

    ugvs.forEach((ugv) => {
      const latOffset = (Math.random() - 0.5) * 0.0003
      const lngOffset = (Math.random() - 0.5) * 0.0003
      ugv.coords[0] += latOffset
      ugv.coords[1] += lngOffset

      // Update marker position
      markers[ugv.id]
        .setLatLng(ugv.coords)
        .setPopupContent(`${ugv.name}<br>Battery: ${ugv.battery}%<br>Speed: ${ugv.speed} km/h`)

      // Save history
      ugv.path.push([...ugv.coords])
      polylines[ugv.id].setLatLngs(ugv.path)
    })
  }, 2000)
})

// Random path color
function getRandomColor() {
  return `hsl(${Math.floor(Math.random() * 360)}, 80%, 50%)`
}
</script>

<style>
#map {
  height: 400px;
}
</style>
