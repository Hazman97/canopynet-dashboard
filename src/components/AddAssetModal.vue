<template>
  <div v-if="isVisible" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex">
      <div class="w-1/4 bg-gray-50 border-r border-gray-200 p-6 space-y-4">
        <h4 class="text-lg font-semibold text-gray-700 mb-4">Sections</h4>
        <button @click="currentSection = 'basic'"
                :class="{'bg-purple-100 text-purple-700 font-bold': currentSection === 'basic', 'text-gray-600 hover:bg-gray-100': currentSection !== 'basic'}"
                class="w-full text-left px-4 py-2 rounded-md transition duration-150 ease-in-out">
          Basic Information
        </button>
        <button @click="currentSection = 'technical'"
                :class="{'bg-purple-100 text-purple-700 font-bold': currentSection === 'technical', 'text-gray-600 hover:bg-gray-100': currentSection !== 'technical'}"
                class="w-full text-left px-4 py-2 rounded-md transition duration-150 ease-in-out">
          Technical Specifications
        </button>
        <button @click="currentSection = 'operational'"
                :class="{'bg-purple-100 text-purple-700 font-bold': currentSection === 'operational', 'text-gray-600 hover:bg-gray-100': currentSection !== 'operational'}"
                class="w-full text-left px-4 py-2 rounded-md transition duration-150 ease-in-out">
          Operational Data
        </button>
        <button @click="currentSection = 'financial'"
                :class="{'bg-purple-100 text-purple-700 font-bold': currentSection === 'financial', 'text-gray-600 hover:bg-gray-100': currentSection !== 'financial'}"
                class="w-full text-left px-4 py-2 rounded-md transition duration-150 ease-in-out">
          Financial Information
        </button>
        <button @click="currentSection = 'maintenance'"
                :class="{'bg-purple-100 text-purple-700 font-bold': currentSection === 'maintenance', 'text-gray-600 hover:bg-gray-100': currentSection !== 'maintenance'}"
                class="w-full text-left px-4 py-2 rounded-md transition duration-150 ease-in-out">
          Maintenance Information
        </button>
      </div>

      <div class="flex-1 flex flex-col">
        <div class="flex justify-between items-center p-6 border-b">
          <h3 class="text-2xl font-bold text-gray-800">Add New Asset</h3>
          <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
            <i class="bx bx-x text-3xl"></i>
          </button>
        </div>

        <div class="p-6 overflow-y-auto flex-grow">
          <div v-if="currentSection === 'basic'">
            <h4 class="text-lg font-semibold text-gray-700 mb-4">Basic Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <label for="deviceID" class="block text-sm font-medium text-gray-700">Device ID</label>
                <input type="text" id="deviceID" :value="newAsset.deviceID" readonly
                       class="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm py-2 px-3 cursor-not-allowed" />
              </div>
              <div>
                <label for="assetName" class="block text-sm font-medium text-gray-700">Asset Name</label>
                <input type="text" id="assetName" v-model="newAsset.name"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label for="assetCode" class="block text-sm font-medium text-gray-700">Asset Code</label>
                <input type="text" id="assetCode" v-model="newAsset.code"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label for="assetType" class="block text-sm font-medium text-gray-700">Asset Type</label>
                <select id="assetType" v-model="newAsset.type"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                  <option value="">Select Type</option>
                  <option v-for="typeOption in assetTypes" :key="typeOption" :value="typeOption">{{ typeOption }}</option>
                </select>
              </div>
              <div>
                <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
                <select id="category" v-model="newAsset.category"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                  <option value="">Select Category</option>
                  <option v-for="categoryOption in assetCategories" :key="categoryOption" :value="categoryOption">{{ categoryOption }}</option>
                </select>
              </div>
              <div>
                <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                <select id="status" v-model="newAsset.status"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                  <option value="">Select Status</option>
                  <option v-for="statusOption in assetStatuses" :key="statusOption" :value="statusOption">{{ statusOption }}</option>
                </select>
              </div>
              <div>
                <label for="manufacturer" class="block text-sm font-medium text-gray-700">Manufacturer</label>
                <input type="text" id="manufacturer" v-model="newAsset.manufacturer"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label for="model" class="block text-sm font-medium text-gray-700">Model</label>
                <input type="text" id="model" v-model="newAsset.model"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label for="year" class="block text-sm font-medium text-gray-700">Year</label>
                <input type="text" id="year" v-model="newAsset.year"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label for="serialNumber" class="block text-sm font-medium text-gray-700">Serial Number</label>
                <input type="text" id="serialNumber" v-model="newAsset.serialNumber"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
                <input type="text" id="location" v-model="newAsset.location"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label for="purchaseDate" class="block text-sm font-medium text-gray-700">Purchase Date</label>
                <input type="date" id="purchaseDate" v-model="newAsset.purchaseDate"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
              </div>
            </div>
          </div>

          <div v-if="currentSection === 'technical'">
            <h4 class="text-lg font-semibold text-gray-700 mb-4">Technical Specifications</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <label for="capacity" class="block text-sm font-medium text-gray-700">Capacity</label>
                <div class="flex mt-1">
                  <input type="number" id="capacity" v-model="newAsset.capacityValue"
                         class="block w-2/3 border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
                  <select v-model="newAsset.capacityUnit"
                          class="block w-1/3 border border-gray-300 rounded-r-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                    <option value="">Unit</option>
                    <option v-for="unit in capacityUnits" :key="unit" :value="unit">{{ unit }}</option>
                  </select>
                </div>
              </div>
              <div>
                <label for="enginePower" class="block text-sm font-medium text-gray-700">Engine Power</label>
                <div class="flex mt-1">
                  <input type="number" id="enginePower" v-model="newAsset.enginePowerValue"
                         class="block w-2/3 border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
                  <select v-model="newAsset.enginePowerUnit"
                          class="block w-1/3 border border-gray-300 rounded-r-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                    <option value="">Unit</option>
                    <option v-for="unit in enginePowerUnits" :key="unit" :value="unit">{{ unit }}</option>
                  </select>
                </div>
              </div>
              <div>
                <label for="fuelType" class="block text-sm font-medium text-gray-700">Fuel Type</label>
                <select id="fuelType" v-model="newAsset.fuelType"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                  <option value="">Select Fuel Type</option>
                  <option v-for="type in fuelTypes" :key="type" :value="type">{{ type }}</option>
                </select>
              </div>
              <div>
                <label for="fuelCapacity" class="block text-sm font-medium text-gray-700">Fuel Capacity (L)</label>
                <input type="number" id="fuelCapacity" v-model="newAsset.fuelCapacity"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label for="fuelConsumption" class="block text-sm font-medium text-gray-700">Fuel Consumption</label>
                <div class="flex mt-1">
                  <input type="number" id="fuelConsumption" v-model="newAsset.fuelConsumptionValue"
                         class="block w-2/3 border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
                  <select v-model="newAsset.fuelConsumptionUnit"
                          class="block w-1/3 border border-gray-300 rounded-r-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                    <option value="">Unit</option>
                    <option v-for="unit in fuelConsumptionUnits" :key="unit" :value="unit">{{ unit }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div v-if="currentSection === 'operational'">
            <h4 class="text-lg font-semibold text-gray-700 mb-4">Operational Data</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <label for="workHours" class="block text-sm font-medium text-gray-700">Work Hours</label>
                <input type="number" id="workHours" v-model="newAsset.workHours"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label for="totalWorkHours" class="block text-sm font-medium text-gray-700">Total Work Hours</label>
                <input type="number" id="totalWorkHours" v-model="newAsset.totalWorkHours"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label for="efficiency" class="block text-sm font-medium text-gray-700">Efficiency (%)</label>
                <input type="number" id="efficiency" v-model="newAsset.efficiency"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label for="gangNo" class="block text-sm font-medium text-gray-700">Gang No</label>
                <input type="text" id="gangNo" v-model="newAsset.gangNo"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label for="areaCovered" class="block text-sm font-medium text-gray-700">Area Covered (ha)</label>
                <input type="number" id="areaCovered" v-model="newAsset.areaCovered"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label for="tonnage" class="block text-sm font-medium text-gray-700">Tonnage</label>
                <input type="number" id="tonnage" v-model="newAsset.tonnage"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label for="workDivision" class="block text-sm font-medium text-gray-700">Work Division</label>
                <select id="workDivision" v-model="newAsset.workDivision"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                  <option value="">Select Work Division</option>
                  <option v-for="division in workDivisions" :key="division" :value="division">{{ division }}</option>
                </select>
              </div>
              <div>
                <label for="workNature" class="block text-sm font-medium text-gray-700">Work Nature</label>
                <select id="workNature" v-model="newAsset.workNature"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                  <option value="">Select Work Nature</option>
                  <option v-for="nature in workNatures" :key="nature" :value="nature">{{ nature }}</option>
                </select>
              </div>
            </div>
          </div>

          <div v-if="currentSection === 'financial'">
            <h4 class="text-lg font-semibold text-gray-700 mb-4">Financial Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <label for="purchasePrice" class="block text-sm font-medium text-gray-700">Purchase Price (RM)</label>
                <input type="number" id="purchasePrice" v-model="newAsset.purchasePrice"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label for="currentValue" class="block text-sm font-medium text-gray-700">Current Value (RM)</label>
                <input type="number" id="currentValue" v-model="newAsset.currentValue"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label for="dailyRate" class="block text-sm font-medium text-gray-700">Daily Rate (RM)</label>
                <input type="number" id="dailyRate" v-model="newAsset.dailyRate"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label for="monthlyRate" class="block text-sm font-medium text-gray-700">Monthly Rate (RM)</label>
                <input type="number" id="monthlyRate" v-model="newAsset.monthlyRate"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label for="operatingCostPerHour" class="block text-sm font-medium text-gray-700">Operating Cost/Hour (RM)</label>
                <input type="number" id="operatingCostPerHour" v-model="newAsset.operatingCostPerHour"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label for="maintenanceCost" class="block text-sm font-medium text-gray-700">Maintenance Cost (RM)</label>
                <input type="number" id="maintenanceCost" v-model="newAsset.maintenanceCost"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
              </div>
            </div>
          </div>

          <div v-if="currentSection === 'maintenance'">
            <h4 class="text-lg font-semibold text-gray-700 mb-4">Maintenance Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <label for="lastMaintenance" class="block text-sm font-medium text-gray-700">Last Maintenance</label>
                <input type="date" id="lastMaintenance" v-model="newAsset.lastMaintenance"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label for="nextMaintenance" class="block text-sm font-medium text-gray-700">Next Maintenance</label>
                <input type="date" id="nextMaintenance" v-model="newAsset.nextMaintenance"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label for="maintenanceInterval" class="block text-sm font-medium text-gray-700">Maintenance Interval (hours)</label>
                <input type="number" id="maintenanceInterval" v-model="newAsset.maintenanceInterval"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label for="warrantyExpiry" class="block text-sm font-medium text-gray-700">Warranty Expiry</label>
                <input type="date" id="warrantyExpiry" v-model="newAsset.warrantyExpiry"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label for="insuranceExpiry" class="block text-sm font-medium text-gray-700">Insurance Expiry</label>
                <input type="date" id="insuranceExpiry" v-model="newAsset.insuranceExpiry"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label for="roadTaxExpiry" class="block text-sm font-medium text-gray-700">Road Tax Expiry</label>
                <input type="date" id="roadTaxExpiry" v-model="newAsset.roadTaxExpiry"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label for="qrCode" class="block text-sm font-medium text-gray-700">QR Code</label>
                <input type="text" id="qrCode" v-model="newAsset.qrCode"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label for="rfidTag" class="block text-sm font-medium text-gray-700">RFID Tag</label>
                <input type="text" id="rfidTag" v-model="newAsset.rfidTag"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div class="md:col-span-2">
                <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
                <textarea id="notes" v-model="newAsset.notes" rows="3"
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"></textarea>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 border-t flex justify-end space-x-3">
          <button @click="resetForm" class="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-150 ease-in-out">
            Reset Form
          </button>
          <button @click="$emit('close')" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out">
            Cancel
          </button>
          <button @click="saveAsset" class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-150 ease-in-out">
            Add Asset
          </button>
        </div>
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

const currentSection = ref('basic'); // State to control visible section

const assetTypes = [
  'Tractors', 'Trucks', 'UGVs', 'Harvesters', 'Badang', 'Tools', 'Logging Devices',
  'Excavator', 'Bulldozer', 'Loader', 'Sprayer', 'Generator', 'Pump'
];

const assetCategories = [
  'Heavy Machinery', 'Light Machinery', 'Vehicle', 'Tool', 'Electronic Device'
];

const assetStatuses = [
  'Operational', 'Maintenance', 'Offline', 'Repair', 'Standby'
];

// New dropdown options
const capacityUnits = ['Tons', 'Liters', 'Kg', 'HP', 'KW', 'm³'];
const enginePowerUnits = ['HP', 'KW'];
const fuelTypes = ['Diesel', 'Petrol', 'Electric', 'Hybrid'];
const fuelConsumptionUnits = ['L/h', 'L/km', 'L/100km'];
const workDivisions = ['General workers', 'Harvesting', 'Manuring', 'Weeding', 'Pest & Disease', 'Mechanisation fleet'];
const workNatures = ['Security personnel', 'Gardeners/Line Sweepers', 'Mechanical Work', 'Electrical Work'];

const initialAssetState = () => ({
  deviceID: 'DEV-' + Date.now(), // Auto-generated Device ID
  name: '', // Asset Name
  code: '', // Asset Code
  type: '', // Asset Type
  category: '', // Category
  status: '', // Status
  manufacturer: '',
  model: '',
  year: '',
  serialNumber: '',
  location: '',
  purchaseDate: '',
  // Technical Specifications
  capacityValue: null,
  capacityUnit: '',
  enginePowerValue: null,
  enginePowerUnit: '',
  fuelType: '',
  fuelCapacity: null,
  fuelConsumptionValue: null,
  fuelConsumptionUnit: '',
  // Operational Data
  workHours: null,
  totalWorkHours: null,
  efficiency: null,
  gangNo: '',
  areaCovered: null,
  tonnage: null,
  workDivision: '',
  workNature: '',
  // Financial Information
  purchasePrice: null,
  currentValue: null,
  dailyRate: null,
  monthlyRate: null,
  operatingCostPerHour: null,
  maintenanceCost: null,
  // Maintenance Information
  lastMaintenance: '',
  nextMaintenance: '',
  maintenanceInterval: null,
  warrantyExpiry: '',
  insuranceExpiry: '',
  roadTaxExpiry: '',
  qrCode: '',
  rfidTag: '',
  notes: '',
});

const newAsset = ref(initialAssetState());

watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    resetForm();
    currentSection.value = 'basic'; // Always start at Basic Information
  }
});

const saveAsset = () => {
  // Basic validation for required fields in Basic Information
  if (!newAsset.value.name || !newAsset.value.type || !newAsset.value.status || !newAsset.value.category) {
    alert('Please fill in all required fields in the Basic Information section (Asset Name, Asset Type, Category, and Status).');
    return;
  }
  emit('add-asset', newAsset.value);
  emit('close');
};

const resetForm = () => {
  newAsset.value = initialAssetState();
};
</script>

<style scoped>
/* No additional scoped styles needed as Tailwind CSS classes are used for layout and styling */
</style>