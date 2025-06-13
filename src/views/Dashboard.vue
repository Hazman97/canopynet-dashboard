<template>
  <div class="min-h-screen bg-gray-100 p-4 space-y-4">
    <!-- Map Section (Top Full Width) -->
    <div class="w-full h-[50vh] bg-white rounded-lg shadow overflow-hidden">
    <MapView
  :locations="locations"
  :latitude="2.9226"
  :longitude="101.6491"
  @location-selected="onSelect"
  @map-click="selected = null"
  class="w-full h-full"
/>

    </div>

    <!-- Dashboard Panels Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <!-- Silos Info -->
      <div class="bg-white rounded-lg shadow p-4 col-span-1 xl:col-span-1">
        <h3 class="font-semibold mb-2 text-gray-800">Silos</h3>
        <table class="text-sm w-full">
          <thead>
            <tr class="text-left text-gray-500 border-b">
              <th>Name</th>
              <th>Crop</th>
              <th>Temp</th>
              <th>Moist</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="loc in filteredLocations" :key="loc.name" class="border-b hover:bg-gray-50">
              <td class="py-1.5">{{ loc.name }}</td>
              <td>{{ loc.other }}%</td>
              <td>{{ loc.temperature }}°C</td>
              <td>{{ loc.ph }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Silos Temperature Chart -->
      <div class="bg-white rounded-lg shadow p-4 col-span-1 xl:col-span-1">
        <h3 class="font-semibold mb-2 text-gray-800">Silos Temperature</h3>
        <div class="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400">
          [Temperature Chart Here]
        </div>
      </div>

      <!-- Crop Level Chart -->
      <div class="bg-white rounded-lg shadow p-4 col-span-1 xl:col-span-1">
        <h3 class="font-semibold mb-2 text-gray-800">Crop Level</h3>
        <div class="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400">
          [Crop Level Chart Here]
        </div>
      </div>

      <!-- Alarms -->
      <div class="bg-white rounded-lg shadow p-4 col-span-1 xl:col-span-1">
        <h3 class="font-semibold mb-2 text-gray-800">Alarms</h3>
        <ul class="text-sm space-y-2">
          <li>
            <span class="text-red-600 font-semibold">[High]</span> - Silo B temp delta<br />
            <span class="text-xs text-gray-500">2024-07-16 11:53:46</span>
          </li>
          <li>
            <span class="text-yellow-500 font-semibold">[Warning]</span> - pH spike in Putrajaya<br />
            <span class="text-xs text-gray-500">2024-07-16 11:40:00</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import MapView from '../components/MapView.vue'
import { ref, computed } from 'vue'

const locations = [
  {
    name: 'Cyberjaya Central',
    coords: [2.9226, 101.6491],
    ph: 6.8,
    ec: 1.3,
    temperature: 29,
    other: 44,
    nplStatus: 'OK',
  },
  {
    name: 'Putrajaya',
    coords: [2.9264, 101.6963],
    ph: 7.0,
    ec: 1.4,
    temperature: 28,
    other: 41,
    nplStatus: 'Warning',
  },
  {
    name: 'Sungai Merab',
    coords: [2.8700, 101.6500],
    ph: 6.5,
    ec: 1.1,
    temperature: 27,
    other: 39,
    nplStatus: 'OK',
  },
  {
    name: 'Puchong',
    coords: [3.0470, 101.6097],
    ph: 7.2,
    ec: 1.6,
    temperature: 30,
    other: 45,
    nplStatus: 'Critical',
  },
  {
    name: 'Kajang',
    coords: [2.9915, 101.7901],
    ph: 6.9,
    ec: 1.5,
    temperature: 31,
    other: 46,
    nplStatus: 'OK',
  },
  {
    name: 'Serdang',
    coords: [2.9853, 101.7083],
    ph: 6.7,
    ec: 1.2,
    temperature: 28,
    other: 43,
    nplStatus: 'OK',
  },
]

const selected = ref(null)

const onSelect = (name) => {
  // Toggle selection: if same name clicked again, deselect
  if (selected.value?.name === name) {
    selected.value = null
  } else {
    selected.value = locations.find((loc) => loc.name === name) || null
  }
}

// Computed list based on selected location
const filteredLocations = computed(() =>
  selected.value ? [selected.value] : locations
)

</script>
