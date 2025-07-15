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

    <router-view />
  </div>
</template>

<script>
import { useRoute } from 'vue-router'; // Import useRoute

export default {
  name: 'MeshView',
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
    const route = useRoute(); // Access the current route

    const isActive = (path) => {
      return route.path.includes(`/mesh/${path}`);
    };

    const addNode = () => {
      alert('Add Node functionality coming soon from MeshView!');
      // Here you would typically open a modal or navigate to a creation page
    };

    return {
      isActive,
      addNode
    };
  }
};
</script>

<style scoped>
/* No additional scoped styles needed, Tailwind classes handle styling. */
</style>