<template>
  <div class="bg-white rounded-lg p-6 shadow space-y-4">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold">Network Map</h2>
      <div class="space-x-2">
        <button class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Refresh</button>
        <button class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Export</button>
      </div>
    </div>

    <!-- Map Display -->
    <div class="h-[500px] bg-gray-100 rounded">
      <!-- Replace this with Leaflet or any map integration -->
      <p class="text-center pt-48 text-gray-500">[Full Map Placeholder]</p>
    </div>

    <!-- Node Types & Connection Quality -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 mt-4">
      <div>
        <p class="font-semibold mb-1">Node Types</p>
        <p><span class="text-blue-500">●</span> Gateway</p>
        <p><span class="text-purple-500">●</span> Router</p>
        <p><span class="text-red-500">●</span> Endpoint</p>
      </div>
      <div>
        <p class="font-semibold mb-1">Connection Quality</p>
        <p>🟢 Excellent</p>
        <p>🔵 Good</p>
        <p>🟡 Fair</p>
        <p>🔴 Poor</p>
      </div>
      <div>
        <p class="font-semibold mb-1">Stats</p>
        <p>Total Nodes: 5</p>
        <p>Online: 3</p>
        <p>Offline: 1</p>
        <p>Warning: 1</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NetworkMap"
};
</script>
