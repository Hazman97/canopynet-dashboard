<template>
  <div class="w-full mb-6 rounded overflow-hidden shadow">
    <l-map
      ref="mapInstance"
      :zoom="currentZoom"
      :center="currentCenter"
      style="height: 100%; width: 100%"
      @update:center="updateCenter"
      @update:zoom="updateZoom"
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
    </l-map>
  </div>
</template>

<script setup>
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { defineEmits, defineProps, ref, watch, onMounted } from 'vue' // Import onMounted

// Fix missing marker icons (Leaflet default icon fix)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
})

const emit = defineEmits(['location-selected', 'update:center', 'update:zoom'])

const props = defineProps({
  locations: Array,
  center: {
    type: Array,
    default: () => [2.7763448, 102.9267660] // Use the new Keratong coordinates as a default
  },
  zoom: {
    type: Number,
    default: 14 // Default zoom level
  }
})

// Internal refs to control map view, initialized from props
const currentCenter = ref(props.center);
const currentZoom = ref(props.zoom);
const mapInstance = ref(null); // Ref to get the Leaflet map instance

// Watch for changes in the 'center' prop and update the map view
watch(() => props.center, (newCenter) => {
  if (mapInstance.value && newCenter && (newCenter[0] !== currentCenter.value[0] || newCenter[1] !== currentCenter.value[1])) {
    mapInstance.value.leafletObject.setView(newCenter, currentZoom.value, { animate: true, duration: 0.5 });
    currentCenter.value = newCenter;
  }
}, { deep: true });

// Watch for changes in the 'zoom' prop and update the map view
watch(() => props.zoom, (newZoom) => {
  if (mapInstance.value && newZoom !== currentZoom.value) {
    mapInstance.value.leafletObject.setZoom(newZoom, { animate: true, duration: 0.5 });
    currentZoom.value = newZoom;
  }
});

// Update internal state and emit if map is dragged/zoomed by user
const updateCenter = (newCenter) => {
  currentCenter.value = newCenter;
  emit('update:center', newCenter);
};

const updateZoom = (newZoom) => {
  currentZoom.value = newZoom;
  emit('update:zoom', newZoom);
};

const select = (name) => {
  emit('location-selected', name)
}

// *** ADD THIS ON MOUNT HOOK ***
onMounted(() => {
  // Ensure the map instance is available
  if (mapInstance.value && mapInstance.value.leafletObject) {
    // Invalidate map size after component has mounted and had a chance to render
    // This forces Leaflet to recalculate its internal dimensions.
    mapInstance.value.leafletObject.invalidateSize();
  }
});

/**
 * Generates a custom Leaflet DivIcon with a Boxicon inside.
 * The icon styling is designed to mimic the provided reference image.
 * @param {string} iconClass - The Boxicon class (e.g., 'bx-water', 'bxs-business').
 * @param {string} iconColor - The color for the icon's background and border.
 * @returns {L.DivIcon} A Leaflet DivIcon instance.
 */
const getCustomIcon = (iconClass, iconColor) => {
  const bgColor = iconColor || '#10B981'; // Fallback to default green
  const borderColor = iconColor || '#059669'; // Fallback to darker green

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