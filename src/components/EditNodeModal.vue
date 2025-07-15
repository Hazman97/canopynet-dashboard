<template>
  <div v-if="isVisible" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center p-6 border-b">
        <h3 class="text-2xl font-bold text-gray-800">Edit Node: {{ editedNode.name }}</h3>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <i class="bx bx-x text-3xl"></i>
        </button>
      </div>
      <div class="p-6 space-y-4">
        <div>
          <label for="nodeId" class="block text-sm font-medium text-gray-700">Node ID</label>
          <input
            type="text"
            id="nodeId"
            v-model="editedNode.id"
            disabled
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 cursor-not-allowed text-gray-600"
          />
        </div>

        <div>
          <label for="nodeName" class="block text-sm font-medium text-gray-700">Node Name</label>
          <input
            type="text"
            id="nodeName"
            v-model="editedNode.name"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label for="nodeType" class="block text-sm font-medium text-gray-700">Type</label>
          <select
            id="nodeType"
            v-model="editedNode.type"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-8 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="gateway">Gateway</option>
            <option value="sensor">Sensor</option>
            <option value="camera">Camera</option>
            <option value="repeater">Repeater</option>
          </select>
        </div>

        <div>
          <label for="nodeStatus" class="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="nodeStatus"
            v-model="editedNode.status"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-8 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="warning">Warning</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        <div>
          <label for="nodeBattery" class="block text-sm font-medium text-gray-700">Battery (%)</label>
          <input
            type="number"
            id="nodeBattery"
            v-model.number="editedNode.battery"
            min="0"
            max="100"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label for="nodeSignal" class="block text-sm font-medium text-gray-700">Signal (dBm)</label>
          <input
            type="number"
            id="nodeSignal"
            v-model.number="editedNode.signal"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label for="nodeLastSeen" class="block text-sm font-medium text-gray-700">Last Seen</label>
          <input
            type="datetime-local"
            id="nodeLastSeen"
            v-model="editedNode.lastSeen"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div class="p-6 border-t flex justify-end space-x-3">
        <button
          @click="closeModal"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out"
        >
          Cancel
        </button>
        <button
          @click="saveChanges"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 ease-in-out"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  nodeData: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'update-node']);

const editedNode = ref({});

// Watch for changes in nodeData prop to update the local copy for editing
watch(() => props.nodeData, (newVal) => {
  if (newVal) {
    // Deep copy the object to avoid direct mutation of the prop
    editedNode.value = JSON.parse(JSON.stringify(newVal));
  }
}, { immediate: true }); // immediate: true runs the watcher once immediately on component mount

const saveChanges = () => {
  // Basic validation (can be expanded)
  if (!editedNode.value.name || !editedNode.value.type || editedNode.value.battery === null || editedNode.value.signal === null) {
    alert('Please fill in all required fields.');
    return;
  }
  emit('update-node', editedNode.value);
  closeModal();
};

const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
/* No additional scoped styles needed, Tailwind classes handle styling. */
</style>