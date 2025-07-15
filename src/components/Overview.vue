<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg p-4 shadow">
        <p class="text-gray-600 text-sm">Online Nodes</p>
        <p class="text-2xl font-semibold text-green-500">3</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow">
        <p class="text-gray-600 text-sm">Warning Nodes</p>
        <p class="text-2xl font-semibold text-yellow-500">1</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow">
        <p class="text-gray-600 text-sm">Offline Nodes</p>
        <p class="text-2xl font-semibold text-red-500">1</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow">
        <p class="text-gray-600 text-sm">Avg Battery</p>
        <p class="text-2xl font-semibold text-blue-500">57%</p>
      </div>
    </div>

    <!-- Map & Network Health -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Network Topology Map -->
      <div class="lg:col-span-2 bg-white rounded-lg p-4 shadow">
        <div class="flex justify-between items-center mb-3">
          <h2 class="text-lg font-semibold">Network Topology Map</h2>
          <div class="space-x-2">
            <button class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Refresh</button>
            <button class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Export</button>
          </div>
        </div>
        <div class="h-64 bg-gray-100 rounded">
          <!-- Replace this with real Leaflet/OpenStreetMap -->
          <p class="text-center pt-24 text-gray-500">[Map Placeholder]</p>
        </div>

        <!-- Legends -->
        <div class="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div>
            <p class="font-semibold mb-1">Node Types</p>
            <p><span class="text-blue-500">●</span> Gateway</p>
            <p><span class="text-purple-500">●</span> Router</p>
            <p><span class="text-red-500">●</span> Endpoint</p>
          </div>
          <div>
            <p class="font-semibold mb-1">Connection Quality</p>
            <p>🟢 Excellent</p>
            <p>🟡 Fair</p>
            <p>🔴 Poor</p>
          </div>
          <div>
            <p class="font-semibold mb-1">Network Stats</p>
            <p>Total Nodes: 5</p>
            <p>Online: 3</p>
            <p>Coverage: 85%</p>
          </div>
        </div>
      </div>

      <!-- Network Health & Alerts -->
      <div class="space-y-6">
        <!-- Network Health -->
        <div class="bg-white rounded-lg p-4 shadow">
          <h2 class="text-lg font-semibold mb-2">Network Health</h2>
          <p><strong>Status:</strong> <span class="text-green-500 font-medium">Healthy</span></p>
          <p><strong>Coverage:</strong> 85%</p>
          <p><strong>Avg Signal:</strong> -55 dBm</p>
          <p><strong>Network Load:</strong> 42%</p>
        </div>

        <!-- Recent Alerts -->
        <div class="bg-white rounded-lg p-4 shadow">
          <h2 class="text-lg font-semibold mb-2">Recent Alerts</h2>
          <div class="text-sm">
            <p class="mb-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              ⚠️ Low Battery Warning — <strong>EP-003</strong> at 25%
            </p>
            <p class="bg-red-100 text-red-800 px-2 py-1 rounded">
              ❌ Node Offline — <strong>EP-005</strong> disconnected 2h ago
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Overview"
};
</script>
