<template>
  <div v-if="isVisible" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center p-6 border-b">
        <h3 class="text-2xl font-bold text-gray-800">Edit Asset</h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <i class="bx bx-x text-3xl"></i>
        </button>
      </div>
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <h4 class="text-lg font-semibold text-gray-700 mb-4">Basic Information</h4>
          <div class="space-y-4">
            <div>
              <label for="editAssetName" class="block text-sm font-medium text-gray-700">Asset Name</label>
              <input type="text" id="editAssetName" v-model="editedAsset.name"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label for="editAssetTag" class="block text-sm font-medium text-gray-700">Asset Tag (e.g., TRAC-001)</label>
              <input type="text" id="editAssetTag" v-model="editedAsset.tag"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label for="editAssetType" class="block text-sm font-medium text-gray-700">Asset Type</label>
              <select id="editAssetType" v-model="editedAsset.type"
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
              <label for="editAssetStatus" class="block text-sm font-medium text-gray-700">Status</label>
              <select id="editAssetStatus" v-model="editedAsset.status"
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
              <label for="editAssetLocation" class="block text-sm font-medium text-gray-700">Location</label>
              <input type="text" id="editAssetLocation" v-model="editedAsset.location"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
          </div>
        </div>

        <div>
          <h4 class="text-lg font-semibold text-gray-700 mb-4">Optional Details</h4>
          <div class="space-y-4">
            <div>
              <label for="editWorkHours" class="block text-sm font-medium text-gray-700">Work Hours</label>
              <input type="number" id="editWorkHours" v-model.number="editedAsset.workHours"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label for="editBattery" class="block text-sm font-medium text-gray-700">Battery (%)</label>
              <input type="number" id="editBattery" v-model.number="editedAsset.battery" min="0" max="100"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label for="editSpeed" class="block text-sm font-medium text-gray-700">Speed (km/h)</label>
              <input type="number" id="editSpeed" v-model.number="editedAsset.speed"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label for="editEfficiency" class="block text-sm font-medium text-gray-700">Efficiency (%)</label>
              <input type="number" id="editEfficiency" v-model.number="editedAsset.efficiency" min="0" max="100"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label for="editLastService" class="block text-sm font-medium text-gray-700">Last Service Date</label>
              <input type="date" id="editLastService" v-model="editedAsset.lastService"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label for="editOperator" class="block text-sm font-medium text-gray-700">Operator</label>
              <input type="text" id="editOperator" v-model="editedAsset.operator"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label for="editAssignedWorker" class="block text-sm font-medium text-gray-700">Assigned Worker</label>
              <input type="text" id="editAssignedWorker" v-model="editedAsset.assignedWorker"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label for="editTodayCount" class="block text-sm font-medium text-gray-700">Today's Count</label>
              <input type="number" id="editTodayCount" v-model.number="editedAsset.todayCount"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label for="editTotalCount" class="block text-sm font-medium text-gray-700">Total Count</label>
              <input type="number" id="editTotalCount" v-model.number="editedAsset.totalCount"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label for="editSignal" class="block text-sm font-medium text-gray-700">Signal</label>
              <input type="text" id="editSignal" v-model="editedAsset.signal"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label for="editLastSync" class="block text-sm font-medium text-gray-700">Last Sync</label>
              <input type="datetime-local" id="editLastSync" v-model="editedAsset.lastSync"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
          </div>
        </div>
      </div>

      <div class="p-6 border-t flex justify-end space-x-3">
        <button @click="$emit('close')" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out">
          Cancel
        </button>
        <button @click="updateAsset" class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-150 ease-in-out">
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
  asset: { // This prop will receive the asset data to be edited
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['close', 'update-asset']);

const editedAsset = ref({});

// Watch for changes in the 'asset' prop and populate editedAsset
watch(() => props.asset, (newAsset) => {
  if (newAsset) {
    // Create a deep copy to avoid direct mutation of the prop
    editedAsset.value = { ...newAsset };

    // Format date and datetime fields for input type="date" and "datetime-local"
    if (editedAsset.value.lastService) {
      editedAsset.value.lastService = new Date(editedAsset.value.lastService).toISOString().split('T')[0];
    }
    if (editedAsset.value.lastSync) {
      // Ensure lastSync is in a format compatible with datetime-local (e.g., YYYY-MM-DDTHH:mm)
      const date = new Date(editedAsset.value.lastSync);
      editedAsset.value.lastSync = isNaN(date) ? '' : date.toISOString().slice(0, 16);
    }
  }
}, { immediate: true, deep: true }); // immediate: true to run on component mount, deep: true for nested changes

const updateAsset = () => {
  // Basic validation (optional, add more robust validation as needed)
  if (!editedAsset.value.name || !editedAsset.value.type || !editedAsset.value.status) {
    alert('Please fill in Asset Name, Type, and Status.');
    return;
  }
  emit('update-asset', editedAsset.value);
  emit('close');
};
</script>

<style scoped>
/* Add any specific styles for the modal here if needed */
</style>