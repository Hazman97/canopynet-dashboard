<template>
  <div v-if="isVisible" class="fixed inset-0 bg-gray-900 bg-opacity-20 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col transform scale-95 opacity-0 animate-fade-in-up">
      <div class="flex items-center justify-between p-6 text-gray-800 rounded-t-xl" style="background-color: #abc0c0;">
        <h3 class="text-2xl font-extrabold flex items-center">
          <i class="bx bxs-tree text-3xl mr-3"></i> Tree Details: <span class="ml-2">{{ treeData.name }}</span>
        </h3>
        <button @click="$emit('close')" class="text-gray-600 hover:text-gray-800 transition-colors duration-200">
          <i class="bx bx-x text-3xl"></i>
        </button>
      </div>

      <div class="p-8 flex-grow overflow-y-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
          <div class="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 class="text-xl font-bold text-gray-800 mb-5 border-b pb-3 border-gray-200 flex items-center">
              <i class="bx bx-info-circle text-2xl mr-2 text-blue-600"></i> Basic Information
            </h4>
            <div class="space-y-4 text-gray-700">
              <div class="flex items-center">
                <i class="bx bx-id-card text-xl mr-3 text-indigo-500"></i>
                <p><span class="font-semibold">Tree ID:</span> {{ treeData.id }}</p>
              </div>
              <div class="flex items-center">
                <i class="bx bx-map-alt text-xl mr-3 text-green-500"></i>
                <p><span class="font-semibold">Location:</span> Block {{ treeData.blockName }} (ID: {{ treeData.blockId }}), Phase {{ treeData.phaseId }}</p>
              </div>
              <div class="flex items-center">
                <i class="bx bx-tag text-xl mr-3 text-purple-500"></i>
                <p><span class="font-semibold">Tag:</span> {{ treeData.tag }}</p>
              </div>
              <div class="flex items-center">
                <i class="bx bxs-leaf text-xl mr-3 text-green-600"></i>
                <p><span class="font-semibold">Variety:</span> {{ treeData.variety }}</p>
              </div>
              <div class="flex items-center">
                <i class="bx bx-timer text-xl mr-3 text-orange-500"></i>
                <p><span class="font-semibold">Age:</span> {{ treeData.age }} years</p>
              </div>
              <div class="flex items-center">
                <i class="bx bx-up-arrow-alt text-xl mr-3 text-teal-500"></i>
                <p><span class="font-semibold">Height:</span> {{ treeData.height }}m</p>
              </div>
              <div class="flex items-center">
                <i class="bx bx-package text-xl mr-3 text-yellow-600"></i>
                <p><span class="font-semibold">Estimated Yield:</span> {{ treeData.yield }}kg</p>
              </div>
              <div class="flex items-center">
                <i class="bx bx-calendar-check text-xl mr-3 text-pink-500"></i>
                <p><span class="font-semibold">Last Check:</span> {{ treeData.lastCheck }}</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 class="text-xl font-bold text-gray-800 mb-5 border-b pb-3 border-gray-200 flex items-center">
              <i class="bx bx-first-aid text-2xl mr-2 text-red-600"></i> Health & Diseases
            </h4>
            <div class="space-y-4 text-gray-700">
              <div class="flex items-center">
                <i class="bx bx-plus-medical text-xl mr-3 text-gray-500"></i>
                <p><span class="font-semibold">Health Score:</span> {{ treeData.health }}/10</p>
              </div>
              <div class="flex items-center">
                <i class="bx bx-heart-circle text-xl mr-3 text-gray-500"></i>
                <p>
                  <span class="font-semibold">Health Status:</span>
                  <span :class="['text-sm font-bold px-3 py-1 rounded-full ml-3', getStatusBadgeColor(treeData.healthStatus)]">
                    {{ getDisplayHealthStatus(treeData.healthStatus) }}
                  </span>
                </p>
              </div>
              <div v-if="treeData.diseases && treeData.diseases.length > 0">
                <p class="font-semibold flex items-center mt-4 mb-2">
                  <i class="bx bx-bug text-xl mr-3 text-red-500"></i> Known Diseases:
                </p>
                <ul class="list-none space-y-2 pl-2">
                  <li v-for="(disease, index) in treeData.diseases" :key="index"
                      class="flex items-center text-red-700 bg-red-50 px-3 py-1.5 rounded-md border border-red-200">
                    <i class="bx bxs-error-alt text-lg mr-2"></i> {{ disease }}
                  </li>
                </ul>
              </div>
              <p v-else class="text-gray-500 flex items-center mt-4">
                <i class="bx bx-check-circle text-xl mr-3 text-green-500"></i> No known diseases.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="p-6 border-t bg-gray-100 flex justify-end rounded-b-xl">
        <button @click="$emit('close')"
                class="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-200 font-medium">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  treeData: {
    type: Object,
    default: () => ({
      id: '',
      phaseId: null,
      blockId: '',
      name: '',
      tag: '',
      health: null,
      healthStatus: '',
      age: null,
      yield: null,
      height: null,
      lastCheck: '',
      blockName: '',
      variety: '',
      diseases: [],
    }),
  },
});

const emit = defineEmits(['close']);

// Helper functions for dynamic styling based on health status (copied from TreeViews.vue)
const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'healthy':
      return 'bg-green-200 text-green-800';
    case 'diseased':
      return 'bg-red-200 text-red-800';
    case 'under_observation':
      return 'bg-yellow-200 text-yellow-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

const getDisplayHealthStatus = (status) => {
  switch (status) {
    case 'healthy': return 'Healthy';
    case 'diseased': return 'Diseased';
    case 'under_observation': return 'Under Observation';
    default: return status;
  }
};
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out forwards;
}

.transition-opacity {
  transition: opacity 0.3s ease-out;
}
</style>