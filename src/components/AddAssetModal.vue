<template>
  <div v-if="isVisible" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center p-6 border-b">
        <h3 class="text-2xl font-bold text-gray-800">Add New Asset</h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <i class="bx bx-x text-3xl"></i>
        </button>
      </div>
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <h4 class="text-lg font-semibold text-gray-700 mb-4">Basic Information</h4>
          <div class="space-y-4">
            <div>
              <label for="assetName" class="block text-sm font-medium text-gray-700">Asset Name</label>
              <input type="text" id="assetName" v-model="newAsset.name"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label for="assetTag" class="block text-sm font-medium text-gray-700">Asset Tag (e.g., TRAC-001)</label>
              <input type="text" id="assetTag" v-model="newAsset.tag"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label for="assetType" class="block text-sm font-medium text-gray-700">Asset Type</label>
              <select id="assetType" v-model="newAsset.type"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                <option value="">Select Type</option>
                <option value="tractor">Tractor</option>
                <option value="truck">Truck</option>
                <option value="ugv">UGV</option>
                <option value="harvester">Harvester</option>
                <option value="badang">Badang</option>
                <option value="tool">Tool</option>
                <option value="logging_device">Logging Device</option>
              </select>
            </div>
            <div>
              <label for="assetStatus" class="block text-sm font-medium text-gray-700">Status</label>
              <select id="assetStatus" v-model="newAsset.status"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                <option value="">Select Status</option>
                <option value="operational">Operational</option>
                <option value="maintenance">Maintenance</option>
                <option value="offline">Offline</option>
                <option value="repair">Repair</option>
                <option value="standby">Standby</option>
              </select>
            </div>
            <div>
              <label for="assetLocation" class="block text-sm font-medium text-gray-700">Location</label>
              <input type="text" id="assetLocation" v-model="newAsset.location"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
          </div>
        </div>

        <div>
          <h4 class="text-lg font-semibold text-gray-700 mb-4">Optional Details</h4>
          <div class="space-y-4">
            <div>
              <label for="workHours" class="block text-sm font-medium text-gray-700">Work Hours</label>
              <input type="number" id="workHours" v-model.number="newAsset.workHours"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label for="battery" class="block text-sm font-medium text-gray-700">Battery (%)</label>
              <input type="number" id="battery" v-model.number="newAsset.battery" min="0" max="100"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label for="speed" class="block text-sm font-medium text-gray-700">Speed (km/h)</label>
              <input type="number" id="speed" v-model.number="newAsset.speed"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label for="efficiency" class="block text-sm font-medium text-gray-700">Efficiency (%)</label>
              <input type="number" id="efficiency" v-model.number="newAsset.efficiency" min="0" max="100"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label for="lastService" class="block text-sm font-medium text-gray-700">Last Service Date</label>
              <input type="date" id="lastService" v-model="newAsset.lastService"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label for="operator" class="block text-sm font-medium text-gray-700">Operator</label>
              <input type="text" id="operator" v-model="newAsset.operator"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label for="assignedWorker" class="block text-sm font-medium text-gray-700">Assigned Worker</label>
              <input type="text" id="assignedWorker" v-model="newAsset.assignedWorker"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label for="todayCount" class="block text-sm font-medium text-gray-700">Today's Count</label>
              <input type="number" id="todayCount" v-model.number="newAsset.todayCount"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label for="totalCount" class="block text-sm font-medium text-gray-700">Total Count</label>
              <input type="number" id="totalCount" v-model.number="newAsset.totalCount"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label for="signal" class="block text-sm font-medium text-gray-700">Signal</label>
              <input type="text" id="signal" v-model="newAsset.signal"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label for="lastSync" class="block text-sm font-medium text-gray-700">Last Sync</label>
              <input type="datetime-local" id="lastSync" v-model="newAsset.lastSync"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
          </div>
        </div>
      </div>

      <div class="p-6 border-t flex justify-end space-x-3">
        <button @click="$emit('close')" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out">
          Cancel
        </button>
        <button @click="saveAsset" class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-150 ease-in-out">
          Add Asset
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
});

const emit = defineEmits(['close', 'add-asset']);

const initialAssetState = () => ({
  name: '',
  tag: '',
  type: '',
  status: '',
  location: '',
  workHours: null,
  battery: null,
  speed: null,
  efficiency: null,
  lastService: '',
  operator: '',
  assignedWorker: '',
  todayCount: null,
  totalCount: null,
  signal: '',
  lastSync: '',
});

const newAsset = ref(initialAssetState());

watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    newAsset.value = initialAssetState(); // Reset form when modal opens
  }
});

const saveAsset = () => {
  // Basic validation
  if (!newAsset.value.name || !newAsset.value.type || !newAsset.value.status) {
    alert('Please fill in Asset Name, Type, and Status.');
    return;
  }
  emit('add-asset', newAsset.value);
  emit('close');
};
</script>

<style scoped>
/* Add any specific styles for the modal here if needed */
</style>