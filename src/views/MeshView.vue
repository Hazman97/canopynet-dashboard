<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-1">
      <h1 class="text-2xl font-bold">Mesh Network Management</h1>
      <button
        @click="addNode"
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center shadow-sm transition duration-150 ease-in-out"
      >
        <i class="bx bx-plus mr-2 text-lg"></i> Add Node
      </button>
    </div>
    <p class="text-gray-500 mb-6">Monitor and manage plantation mesh network infrastructure</p>

    <div class="flex space-x-6 border-b mb-6">
      <router-link
        v-for="tab in tabs"
        :key="tab.name"
        :to="`/mesh/${tab.path}`"
        class="pb-2 px-3 transition"
        :class="{
          'border-b-2 border-orange-500 text-orange-500 font-medium': isActive(tab.path),
          'text-gray-500 hover:text-orange-500': !isActive(tab.path)
        }"
      >
        {{ tab.name }}
      </router-link>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Network Status</h2>
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-600">Total Nodes:</span>
          <span class="font-bold text-blue-600">45</span>
        </div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-600">Online Nodes:</span>
          <span class="font-bold text-green-600">42</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-gray-600">Offline Nodes:</span>
          <span class="font-bold text-red-600">3</span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Data Traffic (Last 24h)</h2>
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-600">Total Data Sent:</span>
          <span class="font-bold text-purple-600">1.2 GB</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-gray-600">Total Data Received:</span>
          <span class="font-bold text-purple-600">980 MB</span>
        </div>
        <p class="text-sm text-gray-500 mt-2">Average latency: 25ms</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 col-span-1 md:col-span-2 lg:col-span-1">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Network Health</h2>
        <div class="flex items-center mb-2">
          <div class="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
          <span class="text-gray-700 font-medium">Stable (95% uptime)</span>
        </div>
        <p class="text-sm text-gray-500">No major issues detected. Regular maintenance recommended.</p>
      </div>
    </div>
    
    <router-view />

    <AddNodePage 
      v-if="showAddNodeModal" 
      @close="closeAddNodeModal"
      @node-added="handleNodeAdded"
    />
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import AddNodePage from '../components/AddNodePage.vue'; // Import the AddNodePage component

export default {
  name: 'MeshView',
  components: {
    AddNodePage // Register the component
  },
  data() {
    return {
      tabs: [
        { name: 'Overview', path: 'overview' },
        { name: 'Network Map', path: 'network-map' },
        { name: 'Node Management', path: 'node-management' },
        { name: 'Monitoring', path: 'monitoring' }
      ]
    };
  },
  setup() {
    const route = useRoute();
    const showAddNodeModal = ref(false);

    const isActive = (path) => {
      return route.path.includes(`/mesh/${path}`);
    };

    const addNode = () => {
      showAddNodeModal.value = true;
    };

    const closeAddNodeModal = () => {
      showAddNodeModal.value = false;
    };

    const handleNodeAdded = (nodeData) => {
      // Handle the new node data here
      console.log('New node added:', nodeData);
      
      // You can add logic here to:
      // 1. Send data to your backend API
      // 2. Update local state
      // 3. Show success notification
      // 4. Refresh node list
      
      closeAddNodeModal();
    };

    return {
      isActive,
      addNode,
      showAddNodeModal,
      closeAddNodeModal,
      handleNodeAdded
    };
  }
};
</script>

<style scoped>
/* No additional scoped styles needed, Tailwind classes handle styling. */
</style>