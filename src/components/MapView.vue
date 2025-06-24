<template>
  <div class="h-96 w-full mb-6 rounded overflow-hidden shadow">
    <l-map
      :zoom="14"
      :center="[latitude, longitude]"
      style="height: 100%; width: 100%"
    >
      <!-- Base Satellite Imagery Layer -->
      <l-tile-layer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
        :min-zoom="0"
        :max-zoom="19"
      />

      <!-- Overlay Layer for Labels (Boundaries and Places) -->
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
        :icon="getCustomIcon(loc.icon)"
        @click="select(loc.name)"
      >
        <l-popup>{{ loc.name }}</l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script setup>
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { defineEmits, defineProps } from 'vue'

// Boxicons CSS import (already confirmed as present, but good to note)
// import 'boxicons/css/boxicons.min.css';

// Fix missing marker icons (Leaflet default icon fix)
// We are using custom DivIcons, so the default icon fix might not be strictly needed for markers,
// but it's good to keep if you ever use default Leaflet markers elsewhere.
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
})

const emit = defineEmits(['location-selected'])

defineProps({
  locations: Array,
  latitude: Number,
  longitude: Number,
})

const select = (name) => {
  emit('location-selected', name)
}

/**
 * Generates a custom Leaflet DivIcon with a Boxicon inside.
 * The icon styling is designed to mimic the provided reference image.
 * @param {string} iconClass - The Boxicon class (e.g., 'bx-water', 'bxs-business').
 * @returns {L.DivIcon} A Leaflet DivIcon instance.
 */
const getCustomIcon = (iconClass) => {
  return L.divIcon({
    className: 'custom-leaflet-marker', // Apply custom CSS class
    html: `
      <div class="marker-circle">
        <i class="bx ${iconClass} marker-icon"></i>
      </div>
      <div class="marker-pointer"></div>
    `,
    iconSize: [40, 40], // Size of the visible icon area
    iconAnchor: [20, 40], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -40], // Point from which the popup should open relative to the iconAnchor
  });
};
</script>

<style>
/* Global styles for custom Leaflet markers (not scoped to MapView.vue) */
/* This is important so Leaflet can apply them directly to the map container */

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
  background-color: #10B981; /* Green color, adjust as needed */
  border: 2px solid #059669; /* Darker green border */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white; /* Icon color */
  font-size: 20px; /* Icon size */
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
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
  border-top: 10px solid #10B981; /* Matches circle background color */
  position: absolute;
  bottom: -10px; /* Positions pointer below the circle */
  z-index: 0; /* Ensure pointer is behind the circle */
}
</style>

