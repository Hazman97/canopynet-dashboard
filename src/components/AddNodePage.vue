<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between p-6 border-b">
        <h2 class="text-2xl font-bold text-gray-800">Add New Mesh Node</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <i class="bx bx-x text-2xl"></i>
        </button>
      </div>

      <div class="p-6">
        <form @submit.prevent="submitForm" class="space-y-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 class="text-lg font-semibold text-gray-700 mb-4">Basic Information</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Node ID</label>
                  <div class="flex space-x-2">
                    <input
                      v-model="nodeData.nodeId"
                      type="text"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter node ID"
                    />
                    <button
                      type="button"
                      @click="generateNodeId"
                      class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Node Name</label>
                  <input
                    v-model="nodeData.nodeName"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter node name"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Mesh Role</label>
                  <select
                    v-model="nodeData.meshRole"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Endpoint">Endpoint</option>
                    <option value="Router">Router</option>
                    <option value="Coordinator">Coordinator</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    v-model="nodeData.status"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-gray-700 mb-4">Network Configuration</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">IP Address</label>
                  <div class="flex space-x-2">
                    <input
                      v-model="nodeData.ipAddress"
                      type="text"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="192.168.1.100"
                    />
                    <button
                      type="button"
                      @click="generateIpAddress"
                      class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">MAC Address</label>
                  <div class="flex space-x-2">
                    <input
                      v-model="nodeData.macAddress"
                      type="text"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="00:1A:2B:3C:4D:5E"
                    />
                    <button
                      type="button"
                      @click="generateMacAddress"
                      class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Network ID</label>
                    <input
                      v-model="nodeData.networkId"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Network ID"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Channel</label>
                    <input
                      v-model="nodeData.channel"
                      type="number"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1"
                      min="1"
                      max="16"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Frequency (MHz)</label>
                    <input
                      v-model="nodeData.frequency"
                      type="number"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="2400"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">TX Power (dBm)</label>
                    <input
                      v-model="nodeData.txPower"
                      type="number"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="20"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-4">Installation Details</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Installation Type</label>
                <select
                  v-model="nodeData.installationType"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Fixed Pole">Fixed Pole</option>
                  <option value="Mobile Unit">Mobile Unit</option>
                  <option value="Building Mount">Building Mount</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Pole Type</label>
                <select
                  v-model="nodeData.poleType"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Slave Pole">Slave Pole</option>
                  <option value="Master Pole">Master Pole</option>
                  <option value="Relay Pole">Relay Pole</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Pole Height (m)</label>
                <input
                  v-model="nodeData.poleHeight"
                  type="number"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">Pole ID</label>
              <input
                v-model="nodeData.poleId"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="POLE-001"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 class="text-lg font-semibold text-gray-700 mb-4">Location & Geotagging</h3>
              
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input
                      v-model="nodeData.latitude"
                      type="number"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="2.7768"
                      step="0.0001"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                      v-model="nodeData.longitude"
                      type="number"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="102.9195"
                      step="0.0001"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Altitude (m)</label>
                    <input
                      v-model="nodeData.altitude"
                      type="number"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">GPS Accuracy (m)</label>
                    <input
                      v-model="nodeData.gpsAccuracy"
                      type="number"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="5"
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="nodeData.isGeotagged"
                    type="checkbox"
                    id="geotagged"
                    class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label for="geotagged" class="text-sm text-gray-700">Node is geotagged</label>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-gray-700 mb-4">Hardware Information</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                  <div class="flex space-x-2">
                    <input
                      v-model="nodeData.serialNumber"
                      type="text"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="SN123456789"
                    />
                    <button
                      type="button"
                      @click="generateSerialNumber"
                      class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Firmware Version</label>
                    <input
                      v-model="nodeData.firmwareVersion"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="v1.2.3"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Hardware Version</label>
                    <input
                      v-model="nodeData.hardwareVersion"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="v2.1"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Installation Date</label>
                  <input
                    v-model="nodeData.installationDate"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              v-model="nodeData.notes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes about this node..."
            ></textarea>
          </div>

          <div class="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
            >
              Add Node
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddNodePage',
  data() {
    return {
      nodeData: {
        nodeId: '',
        nodeName: '',
        meshRole: 'Endpoint',
        status: 'Online',
        ipAddress: '',
        macAddress: '',
        networkId: '',
        channel: 1,
        frequency: 2400,
        txPower: 20,
        installationType: 'Fixed Pole',
        poleType: 'Slave Pole',
        poleHeight: 10,
        poleId: 'POLE-001',
        latitude: 2.7768,
        longitude: 102.9195,
        altitude: 0,
        gpsAccuracy: 5,
        isGeotagged: false,
        serialNumber: '',
        firmwareVersion: 'v1.2.3',
        hardwareVersion: 'v2.1',
        installationDate: new Date().toISOString().split('T')[0], // Today's date
        notes: ''
      }
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    
    generateNodeId() {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substr(2, 5);
      this.nodeData.nodeId = `NODE-${timestamp}-${random}`.toUpperCase();
    },
    
    generateIpAddress() {
      const baseIp = '192.168.1.';
      const lastOctet = Math.floor(Math.random() * 200) + 50; // 50-249
      this.nodeData.ipAddress = baseIp + lastOctet;
    },
    
    generateMacAddress() {
      const chars = '0123456789ABCDEF';
      let mac = '';
      for (let i = 0; i < 6; i++) {
        if (i > 0) mac += ':';
        mac += chars[Math.floor(Math.random() * 16)];
        mac += chars[Math.floor(Math.random() * 16)];
      }
      this.nodeData.macAddress = mac;
    },
    
    generateSerialNumber() {
      const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let serial = 'SN';
      for (let i = 0; i < 10; i++) {
        serial += chars[Math.floor(Math.random() * chars.length)];
      }
      this.nodeData.serialNumber = serial;
    },
    
    submitForm() {
      // Validate required fields
      if (!this.nodeData.nodeId || !this.nodeData.nodeName) {
        alert('Please fill in all required fields');
        return;
      }
      
      // Emit the node data to parent component
      this.$emit('node-added', { ...this.nodeData });
      
      // Show success message
      alert('Node added successfully!');
      
      // Close modal
      this.closeModal();
    }
  }
};
</script>

<style scoped>
/* Custom scrollbar for the modal */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>