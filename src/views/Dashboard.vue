<template>
  <div class="min-h-screen bg-gray-100 p-4 space-y-4">
    <div class="w-full h-[65vh] bg-white rounded-lg shadow overflow-hidden">
      <MapView
        :locations="filteredMapLocations"
        :center="mapCenter"
        :zoom="mapZoom"
        @map-click="clearSelectedLocation"
        @location-selected="handleMapLocationSelected"
        class="w-full h-full"
      />
    </div>

    <!-- Dashboard Panels Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg shadow p-4 col-span-1 xl:col-span-1">
        <h3 class="font-semibold mb-2 text-gray-800">UGV Status</h3>
        <table class="text-sm w-full">
          <thead>
            <tr class="text-left text-gray-500 border-b">
              <th class="py-1.5">Name</th>
              <th class="py-1.5">Batt</th>
              <th class="py-1.5">Speed</th>
              <th class="py-1.5">Lat</th>
              <th class="py-1.5">Lon</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ugv in ugvs" :key="ugv.id" class="border-b hover:bg-gray-50">
              <td class="py-1.5">{{ ugv.name }}</td>
              <td class="py-1.5">{{ ugv.battery }}%</td>
              <td class="py-1.5">{{ ugv.speed }}km/h</td>
              <td class="py-1.5">{{ ugv.coords[0].toFixed(3) }}</td>
              <td class="py-1.5">{{ ugv.coords[1].toFixed(3) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- End UGV Status Section -->

      <!-- Node Status Card -->
      <div class="bg-white rounded-lg shadow p-4 col-span-1 xl:col-span-1">
        <h3 class="font-semibold mb-2 text-gray-800">Node</h3>
        <div class="flex flex-wrap gap-2 mb-4">
          <button
            v-for="node in nodes"
            :key="node.id"
            class="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            :class="{ 'bg-blue-800': selectedNode?.id === node.id }"
            @click="selectedNode = node"
          >
            Node {{ node.id }}
          </button>
        </div>

        <div v-if="selectedNode" class="bg-white p-5 rounded-xl shadow-md w-full max-w-xl text-gray-800 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <NodeItem icon="bx-id-card" label="Node ID" :value="selectedNode.id" />
            <NodeItem icon="bx-globe" label="IP Address" :value="selectedNode.ip" />
            <NodeItem icon="bx-signal-5" label="RSSI" :value="`${selectedNode.rssi} dBm`" />
            <NodeItem icon="bx-bar-chart-alt-2" label="LQI" :value="selectedNode.lqi" />
            <NodeItem icon="bx-volume-low" label="Noise Floor" :value="`${selectedNode.noise} dBm`" />
            <NodeItem icon="bx-magnet" label="Signal Margin" :value="selectedNode.margin" />
            <NodeItem icon="bx-repeat" label="Retries" :value="selectedNode.retries" />
            <NodeItem icon="bx-bolt-circle" label="TX Power" :value="selectedNode.txPower" />
            <NodeItem icon="bx-upload" label="TX Packets" :value="selectedNode.txPackets" />
            <NodeItem icon="bx-download" label="RX Packets" :value="selectedNode.rxPackets" />
            <NodeItem icon="bx-stats" label="TX Success Rate" :value="`${selectedNode.txSuccess}%`" />
            <NodeItem icon="bx-stats" label="RX Success Rate" :value="`${selectedNode.rxSuccess}%`" />
            <NodeItem icon="bx-list-ul" label="Queue Size" :value="selectedNode.queue" />
            <NodeItem icon="bx-battery" label="Voltage In" :value="selectedNode.voltageIn" />
            <NodeItem icon="bx-battery-charging" label="Voltage Out" :value="selectedNode.voltageOut" />
          </div>
        </div>

        <!-- Default prompt -->
        <div v-else class="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-500 text-sm">
          Select a node to view status
        </div>
      </div>

      <!-- Alarms -->
      <div
        class="bg-white rounded-lg shadow p-4 col-span-1 xl:col-span-1 cursor-pointer hover:shadow-lg transition-shadow duration-200"
        @click="goToAlarms"
      >
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

      <div class="bg-white rounded-lg shadow p-4 col-span-1 xl:col-span-1">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-semibold text-gray-800">Map Legend</h3>
          <button
            v-if="selectedLocation"
            @click="clearSelectedLocation"
            class="text-gray-400 hover:text-gray-600 transition-colors"
            title="Clear filter"
          >
            <i class="bx bx-x text-lg"></i>
          </button>
        </div>

        <div v-if="selectedLocation" class="mb-3 p-2 bg-blue-50 border border-blue-200 rounded">
          <div class="flex items-center gap-2 text-sm text-blue-800">
            <div
              class="legend-icon-circle"
              :style="{ backgroundColor: selectedLocation.color || '#10B981', borderColor: selectedLocation.color || '#059669' }"
            >
              <i :class="['bx', selectedLocation.icon, 'legend-icon']"></i>
            </div>
            <span class="font-medium">{{ selectedLocation.name }}</span>
            <span class="text-xs text-blue-600">(filtered)</span>
          </div>
          <div v-if="selectedLocation.type === 'node'" class="mt-2 text-xs text-gray-700">
            <p>
              Status:
              <span
                :class="{
                  'text-green-600 font-semibold': selectedLocation.status === 'Online',
                  'text-red-600 font-semibold': selectedLocation.status === 'Offline',
                }"
                >{{ selectedLocation.status }}</span
              >
            </p>
            <p>Signal Strength: {{ selectedLocation.signalStrength }} dBm</p>
          </div>
        </div>

        <ul class="text-sm space-y-2">
          <li
            v-for="point in otherPointsOfInterest"
            :key="point.name"
            class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded -mx-1 transition-colors"
            :class="{
              'bg-blue-50 border border-blue-200': selectedLocation?.name === point.name,
              'opacity-50': selectedLocation && selectedLocation.name !== point.name,
            }"
            @click="selectLocation(point)"
          >
            <div
              class="legend-icon-circle"
              :style="{ backgroundColor: point.color || '#10B981', borderColor: point.color || '#059669' }"
            >
              <i :class="['bx', point.icon, 'legend-icon']"></i>
            </div>
            <span>{{ point.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import MapView from '../components/MapView.vue'
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue'
import { API_URL } from '../configapi'
import { h } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// NodeItem component definition
const NodeItem = (props) => {
  return h('div', { class: 'flex items-start gap-2' }, [
    h('i', { class: 'bx ' + props.icon + ' text-blue-400 text-lg mt-0.5' }),
    h('div', [
      h('div', { class: 'font-medium text-gray-700' }, props.label),
      h('div', { class: 'text-gray-600' }, props.value),
    ]),
  ])
}
NodeItem.props = {
  icon: String,
  label: String,
  value: [String, Number],
}

// UGV data (remains reactive)
const ugvs = reactive([
  { id: 1, name: 'UGV Alpha', coords: [5.353, 100.305], battery: 92, speed: 5, path: [] },
  { id: 2, name: 'UGV Bravo', coords: [5.3535, 100.306], battery: 87, speed: 4, path: [] },
  { id: 3, name: 'UGV Charlie', coords: [5.354, 100.304], battery: 78, speed: 6, path: [] },
  { id: 4, name: 'UGV Delta', coords: [5.3545, 100.305], battery: 83, speed: 7, path: [] },
  { id: 5, name: 'UGV Echo', coords: [5.355, 100.306], battery: 91, speed: 3, path: [] },
])

// UGV Simulation Logic
let ugvSimulationInterval = null

const startUGVSimulation = () => {
  if (ugvSimulationInterval) {
    clearInterval(ugvSimulationInterval)
  }
  ugvSimulationInterval = setInterval(() => {
    ugvs.forEach((ugv) => {
      const latOffset = (Math.random() - 0.5) * 0.0003
      const lngOffset = (Math.random() - 0.5) * 0.0003
      ugv.coords[0] += latOffset
      ugv.coords[1] += lngOffset
    })
  }, 2000)
}

const stopUGVSimulation = () => {
  if (ugvSimulationInterval) {
    clearInterval(ugvSimulationInterval)
    ugvSimulationInterval = null
  }
}

// Existing Node data and fetching logic
const nodes = ref([])
const selectedNode = ref(null)
let pollInterval = null
let isFetching = false

const fetchNodeData = async () => {
  if (isFetching) return
  isFetching = true
  const url = `${API_URL}/api/send-at?cmd=AT^DRPR=2`
  try {
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    const text = await res.text()
    const lines = text.trim().split('\n').filter((line) => line.startsWith('^DRPR:'))
    const parsedNodes = lines.map((line) => {
      const parts = line.replace('^DRPR: ', '').split(',')
      return {
        id: parts[0],
        ip: parts[3]?.replace(/"/g, ''),
        rssi: parts[6]?.replace(/"/g, ''),
        lqi: parts[7],
        noise: parts[8]?.replace(/"/g, ''),
        margin: parts[9]?.replace(/"/g, ''),
        retries: parts[10],
        txPower: parts[11]?.replace(/"/g, ''),
        txPackets: parts[12],
        rxPackets: parts[14],
        txSuccess: parts[16],
        rxSuccess: parts[18],
        queue: parts[20],
        voltageIn: parts[22]?.replace(/"/g, ''),
        voltageOut: parts[23]?.replace(/"/g, ''),
      }
    })
    nodes.value = parsedNodes
    if (selectedNode.value) {
      const stillExists = parsedNodes.some((n) => n.id === selectedNode.value.id)
      if (!stillExists) {
        selectedNode.value = parsedNodes[0] || null
      }
    } else {
      selectedNode.value = parsedNodes[0] || null
    }
  } catch (err) {
    console.error('❌ Failed to fetch mesh node data', err)
  } finally {
    isFetching = false
  }
}

const startPolling = (interval = 5000) => {
  stopPolling()
  fetchNodeData()
  pollInterval = setInterval(fetchNodeData, interval)
}

const stopPolling = () => {
  if (pollInterval) {
    clearInterval(pollInterval)
    pollInterval = null
  }
}

onMounted(() => {
  startPolling()
  startUGVSimulation()
})

onUnmounted(() => {
  stopPolling()
  stopUGVSimulation()
})

// Keratong locations
const otherPointsOfInterest = reactive([
  { name: 'Starlink (Water tank)', coords: [2.786111, 102.924167], icon: 'bx-water', color: '#5dade2', type: 'poi' }, // Blue
  { name: 'Operation Centre', coords: [2.785000, 102.923889], icon: 'bxs-business', color: '#58d68d', type: 'poi' }, // Green
  { name: 'Staff House', coords: [2.780278, 102.924445], icon: 'bx-building-house', color: '#58d68d', type: 'poi' }, // Green
  { name: 'Fertilizer Store', coords: [2.777500, 102.920556], icon: 'bxs-factory', color: '#5dade2', type: 'poi' }, // Blue
  { name: 'Office Farm', coords: [2.7762165, 102.9193214], icon: 'bx-home-alt', color: '#5dade2', type: 'poi' }, // Blue
  {
    name: 'Master Node',
    coords: [2.776233, 102.9192424],
    icon: 'bx-sitemap',
    color: '#e74c3c',
    type: 'node',
    status: 'Online',
    signalStrength: -65,
  }, // Red
  {
    name: 'Node 1',
    coords: [2.776161, 102.9186266],
    icon: 'bx-network-chart',
    color: '#f39c12',
    type: 'node',
    status: 'Online',
    signalStrength: -72,
  }, // Orange
  {
    name: 'Node 2',
    coords: [2.7780436, 102.9183831],
    icon: 'bx-network-chart',
    color: '#f39c12',
    type: 'node',
    status: 'Offline',
    signalStrength: null,
  }, // Orange
  {
    name: 'Node 3',
    coords: [2.7790717, 102.9197222],
    icon: 'bx-network-chart',
    color: '#f39c12',
    type: 'node',
    status: 'Online',
    signalStrength: -80,
  }, // Orange
  {
    name: 'Node 4',
    coords: [2.7798398, 102.9212139],
    icon: 'bx-network-chart',
    color: '#f39c12',
    type: 'node',
    status: 'Online',
    signalStrength: -75,
  }, // Orange
  {
    name: 'Node 5',
    coords: [2.7773601, 102.9198678],
    icon: 'bx-network-chart',
    color: '#f39c12',
    type: 'node',
    status: 'Online',
    signalStrength: -68,
  }, // Orange
  {
    name: 'Node 6',
    coords: [2.7783504, 102.9214836],
    icon: 'bx-network-chart',
    color: '#f39c12',
    type: 'node',
    status: 'Offline',
    signalStrength: null,
  }, // Orange
  {
    name: 'Node 7',
    coords: [2.7765668, 102.9213325],
    icon: 'bx-network-chart',
    color: '#f39c12',
    type: 'node',
    status: 'Online',
    signalStrength: -70,
  }, // Orange
  {
    name: 'Node 8',
    coords: [2.7755845, 102.9199512],
    icon: 'bx-network-chart',
    color: '#f39c12',
    type: 'node',
    status: 'Online',
    signalStrength: -78,
  }, // Orange
])

// Selected location state for filtering
const selectedLocation = ref(null)

// Computed property to filter map locations
const filteredMapLocations = computed(() => {
  if (selectedLocation.value) {
    return [selectedLocation.value]
  }
  return otherPointsOfInterest
})

// Map control state
const initialLatitude = 2.7763448 // Keratong Latitude
const initialLongitude = 102.926766 // Keratong Longitude
const initialZoom = 16 // Adjust this initial zoom

// Use a reactive object to hold center and zoom for the map
const mapCenter = ref([initialLatitude, initialLongitude])
const mapZoom = ref(initialZoom)

// Function to select a location (filter mode)
const selectLocation = (point) => {
  selectedLocation.value = point
  // Zoom to the selected location
  mapCenter.value = point.coords
  mapZoom.value = 18
}

// Handler for when a location is selected from the MapView component
const handleMapLocationSelected = (name) => {
  const location = otherPointsOfInterest.find((p) => p.name === name)
  if (location) {
    selectLocation(location)
  }
}

// Function to clear the selected location filter
const clearSelectedLocation = () => {
  selectedLocation.value = null
  // Reset to initial view
  mapCenter.value = [initialLatitude, initialLongitude]
  mapZoom.value = initialZoom
}

// Function to zoom to a specific location 
const zoomToLocation = (coords) => {
  mapCenter.value = coords
  mapZoom.value = 18 // Zoom in closer when a legend item is clicked
}

const selected = ref(null)
const onSelect = (name) => {
  if (selected.value?.name === name) {
    selected.value = null
  } else {
    selected.value = null
  }
}

const goToAlarms = () => {
  router.push('/alarm')
}
</script>

<style scoped>
/* Scoped styles for the legend icons to mimic the map marker appearance */
.legend-icon-circle {
  width: 24px; /* Smaller size for legend */
  height: 24px;
  background-color: #10b981; /* Default green, will be overridden by point.color */
  border: 1px solid #059669; /* Darker green border, will be overridden */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px; /* Smaller icon size for legend */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.legend-icon {
  line-height: 1; /* Ensure icon is vertically centered */
}
</style>