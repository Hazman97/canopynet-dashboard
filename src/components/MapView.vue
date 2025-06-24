<template>
  <div class="h-96 w-full mb-6 rounded overflow-hidden shadow">
    <l-map
      :zoom="14"
      :center="[latitude, longitude]"
      style="height: 100%; width: 100%"
    >
      <l-tile-layer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
        :min-zoom="0"
        :max-zoom="19"
      />

      <l-marker
        v-for="loc in locations"
        :key="loc.name"
        :lat-lng="loc.coords"
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

// Fix missing marker icons (Leaflet default icon fix)
// This is essential for markers to display correctly with Vite/Vue 3
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
</script>

<style scoped>
/* No specific scoped styles needed as Tailwind CSS is used extensively. */
/* If you need to override Leaflet default styles or add custom map styles, you can do so here. */
</style>
