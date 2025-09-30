<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <!-- Removed h-screen and added overflow-y-auto -->
    <div class="w-80 bg-white p-6 shadow-lg flex flex-col justify-between overflow-y-auto">
      <div>
        <!--
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-800">Log Buat Asahan</h2>
          <button class="text-gray-500 hover:text-gray-700">
            <i class="bx bx-refresh text-xl"></i>
          </button>
        </div>
        -->

        <!-- Map Layers Control Box -->
        <div class="bg-white p-4 rounded-lg shadow-lg mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">Map Layers</h3>
          <div class="space-y-2">
            <label class="flex items-center text-gray-700 cursor-pointer">
              <input type="checkbox" v-model="showNodes" class="form-checkbox h-4 w-4 text-blue-600 rounded">
              <i class="bx bxs-network-chart text-blue-600 text-xl ml-2 mr-2"></i>
              <span>Nodes</span>
            </label>
            <label class="flex items-center text-gray-700 cursor-pointer">
              <input type="checkbox" v-model="showAssets" class="form-checkbox h-4 w-4 text-orange-600 rounded">
              <i class="bx bxs-truck text-orange-600 text-xl ml-2 mr-2"></i>
              <span>Assets</span>
            </label>
            <label class="flex items-center text-gray-700 cursor-pointer">
              <input type="checkbox" v-model="showWorkers" class="form-checkbox h-4 w-4 text-green-600 rounded">
              <i class="bx bxs-face text-green-600 text-xl ml-2 mr-2"></i>
              <span>Workers</span>
            </label>
            <label class="flex items-center text-gray-700 cursor-pointer">
              <input type="checkbox" v-model="showUgvs" class="form-checkbox h-4 w-4 text-purple-600 rounded">
              <i class="bx bx-bot text-purple-600 text-xl ml-2 mr-2"></i>
              <span>UGVs</span>
            </label>
            <label class="flex items-center text-gray-700 cursor-pointer">
              <input type="checkbox" v-model="showPerimeter" class="form-checkbox h-4 w-4 text-green-600 rounded">
              <i class="bx bxs-map text-green-600 text-xl ml-2 mr-2"></i>
              <span>Area Boundary</span>
            </label>
            <label class="flex items-center text-gray-700 cursor-pointer">
              <input type="checkbox" v-model="showCoveredPath" class="form-checkbox h-4 w-4 text-indigo-600 rounded">
              <i class="bx bx-stats text-indigo-600 text-xl ml-2 mr-2"></i>
              <span>Covered Path</span>
            </label>
            <label class="flex items-center text-gray-700 cursor-pointer">
              <input type="checkbox" v-model="showSkippedArea" class="form-checkbox h-4 w-4 text-red-600 rounded">
              <i class="bx bx-error-circle text-red-600 text-xl ml-2 mr-2"></i>
              <span>Skipped Area</span>
            </label>
          </div>
        </div>
        <!-- End Map Layers Control Box -->

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
import { ref, watch, onMounted } from 'vue'; // Import ref, watch, onMounted

export default {
  name: 'LiveMap',
  setup() {
    const progress = ref(5.7);
    const map = ref(null);

    // Reactive properties for layer visibility
    const showNodes = ref(true);
    const showAssets = ref(true);
    const showWorkers = ref(true);
    const showUgvs = ref(true);
    const showPerimeter = ref(true);
    const showCoveredPath = ref(true);
    const showSkippedArea = ref(true);

    // References to Leaflet layers
    const nodeMarkers = ref([]);
    const assetMarkers = ref([]);
    const workerMarkers = ref([]);
    const ugvMarkers = ref([]);
    const perimeterLayer = ref(null);
    const coveredPathLayer = ref(null);
    const skippedAreaLayer = ref(null);

    const initMap = () => {
      if (typeof window.L === 'undefined') {
        console.error("Leaflet (L) is not defined. Please ensure Leaflet is loaded globally (e.g., via a CDN).");
        return;
      }

      // --- Define Perimeter Points ---
      const perimeterPoints = [
        [2.7800541, 102.9183970], // point 1
        [2.7756339, 102.9165464], // point 2
        [2.7724868, 102.9165470], // point 3
        [2.7718940, 102.9355398], // point 4
        [2.7797947, 102.9400275], // point 5
      ];

      // Initialize map and fit to the bounds of the new polygon
      map.value = window.L.map('map').fitBounds(perimeterPoints);

      window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      }).addTo(map.value);

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
      const nodesData = [
        { lat: 2.7784855, lng: 102.9219589, name: 'Node 1' },
        { lat: 2.7787562, lng: 102.9191988, name: 'Node 2' },
        { lat: 2.7761805, lng: 102.9196005, name: 'Node 3' },
      ];

      const assetsData = [
        { lat: 2.7770000, lng: 102.9205000, name: 'Tractor Alpha' },
        { lat: 2.7790000, lng: 102.9225000, name: 'Harvester Beta' },
      ];

      const workersData = [
        { lat: 2.7765000, lng: 102.9180000, name: 'Worker Ali' },
        { lat: 2.7775000, lng: 102.9210000, name: 'Worker Bala' },
      ];

      const ugvsData = [
        { lat: 2.7780000, lng: 102.9200000, name: 'UGV-001' },
      ];

      // --- Define Skipped Area Points (adjusted to be near an asset) ---
      const skippedAreaPoints = [
        [2.7768000, 102.9207000],
        [2.7772000, 102.9212000],
        [2.7770000, 102.9215000],
        [2.7766000, 102.9210000],
        [2.7768000, 102.9207000]
      ];

      // --- Define Covered Path Points (adjusted to be near the UGV) ---
      const coveredPathPoints = [
        [2.7780000, 102.9198000],
        [2.7778000, 102.9203000],
        [2.7782000, 102.9208000],
        [2.7780000, 102.9213000],
        [2.7775000, 102.9210000],
      ];

      // --- Create Leaflet Layers and store references ---

      // Nodes
      nodeMarkers.value = nodesData.map(node => {
        const marker = window.L.marker([node.lat, node.lng], { icon: nodeIcon }).bindPopup(`<b>${node.name}</b>`);
        window.L.circle([node.lat, node.lng], {
          color: 'blue',
          fillColor: '#3080ff',
          fillOpacity: 0.2,
          radius: 200 // Radius in meters
        }).addTo(marker.__parent || map.value).bindPopup(`<b>${node.name}</b><br>Coverage Radius: 200m`);
        return marker;
      });

      // Assets
      assetMarkers.value = assetsData.map(asset => {
        return window.L.marker([asset.lat, asset.lng], { icon: assetIcon }).bindPopup(`<b>${asset.name}</b>`);
      });

      // Workers
      workerMarkers.value = workersData.map(worker => {
        return window.L.marker([worker.lat, worker.lng], { icon: workerIcon }).bindPopup(`<b>${worker.name}</b>`);
      });

      // UGVs
      ugvMarkers.value = ugvsData.map(ugv => {
        return window.L.marker([ugv.lat, ugv.lng], { icon: ugvIcon }).bindPopup(`<b>${ugv.name}</b>`);
      });

      // Perimeter
      perimeterLayer.value = window.L.polygon(perimeterPoints, {
        color: 'green',
        fillColor: 'green',
        fillOpacity: 0,
      }).bindPopup(`<b>Defined Area Boundary</b>`);

      // Skipped Area
      skippedAreaLayer.value = window.L.polygon(skippedAreaPoints, {
        color: 'red',
        fillColor: 'red',
        fillOpacity: 0.1,
        dashArray: '5, 5',
        weight: 2
      }).bindPopup(`<b>Skipped Area</b>`);

      // Covered Path
      coveredPathLayer.value = window.L.polyline(coveredPathPoints, {
        color: '#667eea',
        weight: 4,
        opacity: 0.7
      }).bindPopup(`<b>UGV Covered Path</b>`);

      // Initial display of layers
      updateMapLayers();
    };

    // Function to add/remove layers based on visibility state
    const updateMapLayers = () => {
      const layers = [
        { show: showNodes.value, layer: nodeMarkers.value },
        { show: showAssets.value, layer: assetMarkers.value },
        { show: showWorkers.value, layer: workerMarkers.value },
        { show: showUgvs.value, layer: ugvMarkers.value },
        { show: showPerimeter.value, layer: perimeterLayer.value },
        { show: showCoveredPath.value, layer: coveredPathLayer.value },
        { show: showSkippedArea.value, layer: skippedAreaLayer.value },
      ];

      layers.forEach(({ show, layer }) => {
        if (Array.isArray(layer)) { // Handle arrays of markers
          layer.forEach(marker => {
            if (show) {
              if (!map.value.hasLayer(marker)) {
                marker.addTo(map.value);
              }
            } else {
              if (map.value.hasLayer(marker)) {
                map.value.removeLayer(marker);
              }
            }
          });
        } else if (layer) { // Handle single layers (polygon, polyline)
          if (show) {
            if (!map.value.hasLayer(layer)) {
              layer.addTo(map.value);
            }
          } else {
            if (map.value.hasLayer(layer)) {
              map.value.removeLayer(layer);
            }
          }
        }
      });
    };

    // Watchers for each visibility state
    watch(showNodes, updateMapLayers);
    watch(showAssets, updateMapLayers);
    watch(showWorkers, updateMapLayers);
    watch(showUgvs, updateMapLayers);
    watch(showPerimeter, updateMapLayers);
    watch(showCoveredPath, updateMapLayers);
    watch(showSkippedArea, updateMapLayers);

    onMounted(() => {
      initMap();
    });

    return {
      progress,
      showNodes,
      showAssets,
      showWorkers,
      showUgvs,
      showPerimeter,
      showCoveredPath,
      showSkippedArea,
    };
  },
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

/* Custom checkbox styling (optional, Tailwind's form-checkbox is usually sufficient) */
.form-checkbox:checked {
  background-color: var(--tw-ring-color); /* Uses ring color for checked state */
  border-color: transparent;
}
.form-checkbox:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
</style>