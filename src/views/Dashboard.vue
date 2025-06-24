<template>
  <div class="min-h-screen bg-gray-100 p-4 space-y-4">
    <!-- Map Section (Top Full Width) -->
    <div class="w-full h-[50vh] bg-white rounded-lg shadow overflow-hidden">
      <MapView
        :locations="allMapLocations"
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
            <!-- This table still displays only the silo locations -->
            <tr v-for="loc in filteredLocations" :key="loc.name" class="border-b hover:bg-gray-50">
              <td class="py-1.5">{{ loc.name }}</td>
              <td>{{ loc.other }}%</td>
              <td>{{ loc.temperature }}°C</td>
              <td>{{ loc.ph }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- UGV Status Section -->
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
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import MapView from '../components/MapView.vue'
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue'
import { API_URL } from '../configapi'
import { h } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter();

// NodeItem component definition
const NodeItem = (props) => {
  return h('div', { class: 'flex items-start gap-2' }, [
    h('i', { class: 'bx ' + props.icon + ' text-blue-400 text-lg mt-0.5' }),
    h('div', [
      h('div', { class: 'font-medium text-gray-700' }, props.label),
      h('div', { class: 'text-gray-600' }, props.value)
    ])
  ])
}
NodeItem.props = {
  icon: String,
  label: String,
  value: [String, Number]
}

// UGV data (remains reactive)
const ugvs = reactive([
  { id: 1, name: 'UGV Alpha', coords: [5.353, 100.305], battery: 92, speed: 5, path: [] },
  { id: 2, name: 'UGV Bravo', coords: [5.3535, 100.306], battery: 87, speed: 4, path: [] },
  { id: 3, name: 'UGV Charlie', coords: [5.354, 100.304], battery: 78, speed: 6, path: [] },
  { id: 4, name: 'UGV Delta', coords: [5.3545, 100.305], battery: 83, speed: 7, path: [] },
  { id: 5, name: 'UGV Echo', coords: [5.355, 100.306], battery: 91, speed: 3, path: [] }
]);

// UGV Simulation Logic
let ugvSimulationInterval = null;

const startUGVSimulation = () => {
  if (ugvSimulationInterval) {
    clearInterval(ugvSimulationInterval);
  }
  ugvSimulationInterval = setInterval(() => {
    ugvs.forEach((ugv) => {
      const latOffset = (Math.random() - 0.5) * 0.0003;
      const lngOffset = (Math.random() - 0.5) * 0.0003;
      ugv.coords[0] += latOffset;
      ugv.coords[1] += lngOffset;
    });
  }, 2000);
};

const stopUGVSimulation = () => {
  if (ugvSimulationInterval) {
    clearInterval(ugvSimulationInterval);
    ugvSimulationInterval = null;
  }
};

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
    const lines = text.trim().split('\n').filter(line => line.startsWith('^DRPR:'))
    const parsedNodes = lines.map(line => {
      const parts = line.replace('^DRPR: ', '').split(',')
      return {
        id: parts[0], ip: parts[3]?.replace(/"/g, ''), rssi: parts[6]?.replace(/"/g, ''),
        lqi: parts[7], noise: parts[8]?.replace(/"/g, ''), margin: parts[9]?.replace(/"/g, ''),
        retries: parts[10], txPower: parts[11]?.replace(/"/g, ''), txPackets: parts[12],
        rxPackets: parts[14], txSuccess: parts[16], rxSuccess: parts[18], queue: parts[20],
        voltageIn: parts[22]?.replace(/"/g, ''), voltageOut: parts[23]?.replace(/"/g, ''),
      }
    })
    nodes.value = parsedNodes
    if (selectedNode.value) {
      const stillExists = parsedNodes.some(n => n.id === selectedNode.value.id)
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
  startPolling();
  startUGVSimulation();
});

onUnmounted(() => {
  stopPolling();
  stopUGVSimulation();
});

// Original Silo locations
const siloLocations = [
  {
    name: 'Cyberjaya Central',
    coords: [2.9226, 101.6491],
    ph: 6.8, ec: 1.3, temperature: 29, other: 44, nplStatus: 'OK'
  },
  {
    name: 'Putrajaya',
    coords: [2.9264, 101.6963],
    ph: 7.0, ec: 1.4, temperature: 28, other: 41, nplStatus: 'Warning'
  },
  {
    name: 'Sungai Merab',
    coords: [2.8700, 101.6500],
    ph: 6.5, ec: 1.1, temperature: 27, other: 39, nplStatus: 'OK'
  },
  {
    name: 'Puchong',
    coords: [3.0470, 101.6097],
    ph: 7.2, ec: 1.6, temperature: 30, other: 45, nplStatus: 'Critical'
  },
  {
    name: 'Kajang',
    coords: [2.9915, 101.7901],
    ph: 6.9, ec: 1.5, temperature: 31, other: 46, nplStatus: 'OK'
  },
  {
    name: 'Serdang',
    coords: [2.9853, 101.7083],
    ph: 6.7, ec: 1.2, temperature: 28, other: 43, nplStatus: 'OK'
  },
];

// NEW points of interest (converted from degrees, minutes, seconds)
const otherPointsOfInterest = [
  { name: 'Starlink (Water tank)', coords: [2.786111, 102.923888] },
  { name: 'Operation Centre', coords: [2.785000, 102.923888] },
  { name: 'Staff House', coords: [2.780277, 102.924444] },
  { name: 'Centre', coords: [2.776111, 102.926666] },
  { name: 'Master Node', coords: [2.776111, 102.919166] },
];

// Computed property to combine all locations for the map
const allMapLocations = computed(() => {
  return [...siloLocations, ...otherPointsOfInterest];
});

const selected = ref(null)

const onSelect = (name) => {
  // Only select if it's a silo location (to affect the Silos table)
  if (selected.value?.name === name) {
    selected.value = null
  } else {
    selected.value = siloLocations.find((loc) => loc.name === name) || null
  }
}

const filteredLocations = computed(() =>
  selected.value ? [selected.value] : siloLocations // Filter based on siloLocations
)

const goToAlarms = () => {
  router.push('/alarm');
};
</script>
