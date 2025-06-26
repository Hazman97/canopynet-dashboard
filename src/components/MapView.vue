<template>
  <div class="w-full mb-6 rounded overflow-hidden shadow">
    <l-map
      ref="mapInstance"
      :zoom="currentZoom"
      :center="currentCenter"
      style="height: 100%; width: 100%"
      @update:center="updateCenter"
      @update:zoom="updateZoom"
      @click="handleMapClick"
    >
      <l-tile-layer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
        :min-zoom="0"
        :max-zoom="19"
      />

      <l-tile-layer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
        attribution="Esri, HERE, Garmin, USGS, NGA, EPA, USDA, NPS"
        :min-zoom="0"
        :max-zoom="19"
      />

      <l-marker
        v-for="loc in locations"
        :key="loc.name"
        :lat-lng="loc.coords"
        :icon="getCustomIcon(loc.icon, loc.color)"
        @click="select(loc.name)"
      >
        <l-popup>{{ loc.name }}</l-popup>
      </l-marker>

      <l-polygon :lat-lngs="perimeterCoordinates" :color="'#A0C878'" :fillColor="'#A0C878'" :fillOpacity="0.0">
        <l-popup>Phase 1 Perimeter</l-popup>
      </l-polygon>
    </l-map>
  </div>
</template>

<script setup>
import { LMap, LTileLayer, LMarker, LPopup, LPolygon } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { defineEmits, defineProps, ref, watch, onMounted, computed } from 'vue' // Import computed

// Fix missing marker icons 
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
})

const emit = defineEmits(['location-selected', 'update:center', 'update:zoom', 'map-click'])

const props = defineProps({
  locations: Array,
  center: {
    type: Array,
    default: () => [2.7763448, 102.926766],
  },
  zoom: {
    type: Number,
    default: 14, // Default zoom level
  },
})

// Internal refs to control map view, initialized from props
const currentCenter = ref(props.center)
const currentZoom = ref(props.zoom)
const mapInstance = ref(null) // Ref to get the Leaflet map instance

// Watch for changes in the 'center' prop and update the map view
watch(
  () => props.center,
  (newCenter) => {
    if (
      mapInstance.value &&
      newCenter &&
      (newCenter[0] !== currentCenter.value[0] || newCenter[1] !== currentCenter.value[1])
    ) {
      mapInstance.value.leafletObject.setView(newCenter, currentZoom.value, { animate: true, duration: 0.5 })
      currentCenter.value = newCenter
    }
  },
  { deep: true }
)

// Watch for changes in the 'zoom' prop and update the map view
watch(() => props.zoom, (newZoom) => {
  if (mapInstance.value && newZoom !== currentZoom.value) {
    mapInstance.value.leafletObject.setZoom(newZoom, { animate: true, duration: 0.5 })
    currentZoom.value = newZoom
  }
})

// Update internal state and emit if map is dragged/zoomed by user
const updateCenter = (newCenter) => {
  currentCenter.value = newCenter
  emit('update:center', newCenter)
}

const updateZoom = (newZoom) => {
  currentZoom.value = newZoom
  emit('update:zoom', newZoom)
}

const select = (name) => {
  emit('location-selected', name)
}

// Handle map click events
const handleMapClick = (event) => {
  emit('map-click', event)
}

onMounted(() => {
  // Ensure the map instance is available
  if (mapInstance.value && mapInstance.value.leafletObject) {
    // Invalidate map size after component has mounted and had a chance to render
    // This forces Leaflet to recalculate its internal dimensions.
    mapInstance.value.leafletObject.invalidateSize()
  }
})

/**
 * @param {string} iconClass - The Boxicon class (e.g., 'bx-water', 'bxs-business').
 * @param {string} iconColor - The color for the icon's background and border.
 * @returns {L.DivIcon} A Leaflet DivIcon instance.
 */
const getCustomIcon = (iconClass, iconColor) => {
  const bgColor = iconColor || '#10B981' // Fallback to default green
  const borderColor = iconColor || '#059669' // Fallback to darker green

  return L.divIcon({
    className: 'custom-leaflet-marker', // Apply custom CSS class
    html: `
      <div class="marker-circle" style="background-color: ${bgColor}; border-color: ${borderColor};">
        <i class="bx ${iconClass} marker-icon"></i>
      </div>
      <div class="marker-pointer" style="border-top-color: ${bgColor};"></div>
    `,
    iconSize: [40, 40], // Size of the visible icon area
    iconAnchor: [20, 40], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -40], // Point from which the popup should open relative to the iconAnchor
  })
}

// Perimeter coordinates for Phase 1
const perimeterCoordinates = computed(() => {
  const coordsString =
    '102.9165450890077,2.772497192403033,0 102.9355133975941,2.771992497136516,0 102.9400255477051,2.779857061689484,0 102.9364739797056,2.779897401574271,0 102.9309327370254,2.779959421751386,0 102.9183844977419,2.780084843074441,0 102.9165375388878,2.775658007094284,0 102.9165450890077,2.772497192403033,0'
  const coordsArray = coordsString.split(' ').map((coordStr) => {
    const parts = coordStr.split(',')
    // Leaflet expects [latitude, longitude]
    return [parseFloat(parts[1]), parseFloat(parts[0])]
  })
  return coordsArray
})
</script>

<style>

.custom-leaflet-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  /* Adjustments to ensure pointer aligns correctly below the icon */
  margin-top: -20px; /* Half of iconSize height to center pointer */
  margin-left: -20px; /* Half of iconSize width to center pointer */
}

.marker-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white; /* Icon color */
  font-size: 20px; /* Icon size */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1; /* Ensure circle is above pointer base */
}

.marker-icon {
  line-height: 1; /* Ensure icon is vertically centered */
}

.marker-pointer {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 10px solid #10b981; /* Matches circle background color */
  position: absolute;
  bottom: -10px; /* Positions pointer below the circle */
  z-index: 0; /* Ensure pointer is behind the circle */
}
</style>