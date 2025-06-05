<template>
  <div class="h-96 w-full mb-6 rounded overflow-hidden shadow">
    <l-map
      :zoom="14"
      :center="[latitude, longitude]"
      style="height: 100%; width: 100%"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
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
