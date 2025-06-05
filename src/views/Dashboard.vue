<template>
  <div class="p-4 mx-auto ml-5 flex flex-col gap-8">
    <!-- Map container with fixed aspect ratio -->
    <div class="w-full max-w-3xl mx-auto bg-secondary rounded-lg p-2" style="aspect-ratio: 16 / 9;">
      <MapView
        :locations="locations"
        :latitude="2.9226"
        :longitude="101.6491"
        @location-selected="onSelect"
        class="h-full w-full rounded shadow"
      />
    </div>

    <!-- Data card for selected location -->
    <div v-if="selected" class="mt-1 text-center flex flex-col items-center">
      <h2 class="text-2xl font-bold mb-8 text-sidebar">{{ selected.name }}</h2>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-sidebar">
        <div class="bg-secondary p-4 rounded shadow">
          <h3 class="font-semibold mb-2">pH</h3>
          <p>{{ selected.ph }}</p>
        </div>
        <div class="bg-white p-4 rounded shadow">
          <h3 class="font-semibold mb-2">EC</h3>
          <p>{{ selected.ec }}</p>
        </div>
        <div class="bg-white p-4 rounded shadow">
          <h3 class="font-semibold mb-2">Temperature</h3>
          <p>{{ selected.temperature ?? 'N/A' }}</p>
        </div>
        <div class="bg-white p-4 rounded shadow">
          <h3 class="font-semibold mb-2">Other Data</h3>
          <p>{{ selected.other ?? 'N/A' }}</p>
        </div>
      </div>
    </div>

    <div v-else class="mt-6 text-center text-gray-500 flex justify-center">
      Click a marker to see data
    </div>

    <!-- Table showing all location data -->
   <div class="mt-12 overflow-x-auto">
  <table class="min-w-full table-auto border border-gray-300 shadow rounded-lg divide-y divide-gray-200">
    <thead class="bg-gray-100 text-sm font-medium text-gray-700">
      <tr>
        <th class="px-6 py-3 text-left">Name</th>
        <th class="px-6 py-3 text-left">Latitude</th>
        <th class="px-6 py-3 text-left">Longitude</th>
        <th class="px-6 py-3 text-left">pH</th>
        <th class="px-6 py-3 text-left">EC</th>
        <th class="px-6 py-3 text-left">Temperature</th>
        <th class="px-6 py-3 text-left">Other Data</th>
        <th class="px-6 py-3 text-left">NPL Status</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-100">
      <tr
        v-for="loc in locations"
        :key="loc.name"
        class="hover:bg-gray-50 cursor-pointer transition duration-200"
        @click="onSelect(loc.name)"
      >
        <td class="px-6 py-4 whitespace-nowrap">{{ loc.name }}</td>
        <td class="px-6 py-4 whitespace-nowrap">{{ loc.coords[0] }}</td>
        <td class="px-6 py-4 whitespace-nowrap">{{ loc.coords[1] }}</td>
        <td class="px-6 py-4 whitespace-nowrap">{{ loc.ph }}</td>
        <td class="px-6 py-4 whitespace-nowrap">{{ loc.ec }}</td>
        <td class="px-6 py-4 whitespace-nowrap">{{ loc.temperature ?? 'N/A' }}</td>
        <td class="px-6 py-4 whitespace-nowrap">{{ loc.other ?? 'N/A' }}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span
            :class="{
              'text-green-600 font-semibold': loc.nplStatus === 'OK',
              'text-yellow-600 font-semibold': loc.nplStatus === 'Warning',
              'text-red-600 font-semibold': loc.nplStatus === 'Critical'
            }"
          >
            {{ loc.nplStatus ?? 'Unknown' }}
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</div>

  </div>
</template>

<script setup>
import MapView from '../components/MapView.vue'
import { ref } from 'vue'

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
  selected.value = locations.find(loc => loc.name === name) || null
}
</script>
