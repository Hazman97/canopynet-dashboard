<template>
  <div class="p-6 bg-gray-50 min-h-screen font-sans">
    <div class="flex items-center mb-6">
      <i class="bx bx-history text-4xl text-gray-800 mr-3"></i>
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Trail History</h1>
        <p class="text-gray-600">View and manage saved UGV trails</p>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-2 mb-6 flex space-x-4">
      <button
        @click="$emit('back-to-teleoperation')"
        class="px-5 py-2 rounded-md font-medium transition-colors duration-200 text-gray-700 hover:bg-gray-100"
      >
        <i class="bx bx-arrow-back mr-2"></i>Back to Control
      </button>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Trails for {{ ugvId }}</h2>
      
      <div v-if="trailHistory.length === 0" class="text-center py-8 text-gray-500">
        <i class="bx bx-map text-4xl mb-3"></i>
        <p>No trail history saved for this UGV</p>
      </div>
      
      <div v-else class="space-y-4">
        <div 
          v-for="(trail, index) in trailHistory" 
          :key="index"
          class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h3 class="font-semibold text-lg">{{ trail.name }}</h3>
              <p class="text-sm text-gray-500">{{ formatDate(trail.date) }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ trail.points.length }} points</p>
              
              <div class="mt-3">
                <div class="relative h-40 bg-gray-100 rounded overflow-hidden">
                  <div :id="'mini-map-' + trail.id" class="w-full h-full mini-map"></div>
                </div>
              </div>
            </div>
            
            <div class="flex flex-col space-y-2 ml-4">
              <button 
                @click="viewOnMainMap(trail)"
                class="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 flex items-center"
                title="View on main map"
              >
                <i class="bx bx-show mr-1"></i> View
              </button>
              <button 
                @click="downloadTrail(trail)"
                class="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200 flex items-center"
                title="Download as GPX"
              >
                <i class="bx bx-download mr-1"></i> GPX
              </button>
              <button 
                @click="deleteTrail(index)"
                class="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 flex items-center"
                title="Delete trail"
              >
                <i class="bx bx-trash mr-1"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-6 flex justify-between items-center">
        <p class="text-sm text-gray-500">Showing {{ trailHistory.length }} saved trails</p>
        <button 
          @click="clearAllHistory"
          :disabled="trailHistory.length === 0"
          :class="{ 'bg-red-500 hover:bg-red-600': trailHistory.length > 0, 'bg-gray-300 cursor-not-allowed': trailHistory.length === 0 }"
          class="px-4 py-2 text-white rounded transition-colors"
        >
          Clear All History
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits, nextTick } from 'vue'

const props = defineProps({
  ugvId: String
})

const emit = defineEmits(['back-to-teleoperation', 'load-trail'])

const trailHistory = ref([])

// Load trail history from localStorage
onMounted(() => {
  if (props.ugvId) {
    const savedHistory = localStorage.getItem(`trail_history_${props.ugvId}`)
    if (savedHistory) {
      try {
        trailHistory.value = JSON.parse(savedHistory)
        // Initialize mini maps after a short delay
        setTimeout(initializeMiniMaps, 300)
      } catch (e) {
        console.error("Could not parse saved trail history", e)
      }
    }
  }
})

// Initialize mini maps for each trail
function initializeMiniMaps() {
  trailHistory.value.forEach(trail => {
    nextTick(() => {
      const mapElement = document.getElementById(`mini-map-${trail.id}`)
      if (mapElement && typeof window.L !== 'undefined') {
        const L = window.L
        
        // Create map centered on the first point of the trail
        if (trail.points.length > 0) {
          const center = trail.points[0]
          const map = L.map(`mini-map-${trail.id}`, {
            zoomControl: false,
            attributionControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false
          }).setView(center, 15)
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
          }).addTo(map)
          
          // Add the trail
          L.polyline(trail.points, {
            color: '#007bff',
            weight: 2
          }).addTo(map)
          
          // Fit map to trail bounds
          const bounds = L.latLngBounds(trail.points)
          map.fitBounds(bounds, { padding: [10, 10] })
        }
      }
    })
  })
}

// View trail on the main map
function viewOnMainMap(trail) {
  emit('load-trail', trail)
  emit('back-to-teleoperation')
}

// Download trail as GPX file
function downloadTrail(trail) {
  let gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="UGV Control System" xmlns="http://www.topografix.com/GPX/1/1">
  <trk>
    <name>${trail.name}</name>
    <time>${trail.date}</time>
    <trkseg>
`

  trail.points.forEach(point => {
    gpxContent += `      <trkpt lat="${point[0]}" lon="${point[1]}"></trkpt>\n`
  })

  gpxContent += `    </trkseg>
  </trk>
</gpx>`

  const blob = new Blob([gpxContent], { type: 'application/gpx+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${trail.name.replace(/\s+/g, '_')}.gpx`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Delete a trail from history
function deleteTrail(index) {
  if (confirm("Delete this trail from history?")) {
    trailHistory.value.splice(index, 1)
    saveTrailHistory()
  }
}

// Clear all trail history
function clearAllHistory() {
  if (confirm("Delete all trail history? This cannot be undone.")) {
    trailHistory.value = []
    saveTrailHistory()
  }
}

// Save trail history to localStorage
function saveTrailHistory() {
  localStorage.setItem(`trail_history_${props.ugvId}`, JSON.stringify(trailHistory.value))
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}
</script>

<style scoped>
.mini-map {
  min-height: 160px;
}
</style>