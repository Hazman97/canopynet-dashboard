<template>
  <div class="flex-grow p-6 bg-gray-100 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Dashboard</h1>
      <div class="flex items-center space-x-4 text-gray-600">
        <span class="text-sm">Last Updated: July 14, 2025, 5:00 PM</span>
        <button class="px-3 py-1 bg-white rounded-md border border-gray-300 hover:bg-gray-50 transition duration-150 ease-in-out flex items-center text-sm">
          <i class="bx bx-refresh text-lg mr-1"></i> Refresh
        </button>
      </div>
    </div>
    <p class="text-gray-600 mb-8">Quick overview of key metrics and operations across the plantation.</p>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between border border-gray-200">
        <div>
          <p class="text-sm text-gray-500">Harvested Today (Kg)</p>
          <p class="text-3xl font-bold text-gray-800">{{ dashboardData.harvestedToday.value }}</p>
          <p class="text-xs" :class="dashboardData.harvestedToday.change.includes('+') ? 'text-green-500' : 'text-red-500'">
            {{ dashboardData.harvestedToday.change }}
          </p>
        </div>
        <div :class="[dashboardData.harvestedToday.iconBg, dashboardData.harvestedToday.iconColor]"
             class="p-3 rounded-full">
          <i :class="['bx', dashboardData.harvestedToday.icon]" class="text-2xl"></i>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between border border-gray-200">
        <div>
          <p class="text-sm text-gray-500">Total Yield (Kg)</p>
          <p class="text-3xl font-bold text-gray-800">{{ dashboardData.totalYield.value }}</p>
          <p class="text-xs" :class="dashboardData.totalYield.change.includes('+') ? 'text-green-500' : 'text-red-500'">
            {{ dashboardData.totalYield.change }}
          </p>
        </div>
        <div :class="[dashboardData.totalYield.iconBg, dashboardData.totalYield.iconColor]"
             class="p-3 rounded-full">
          <i :class="['bx', dashboardData.totalYield.icon]" class="text-2xl"></i>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between border border-gray-200">
        <div>
          <p class="text-sm text-gray-500">Active Workers</p>
          <p class="text-3xl font-bold text-gray-800">{{ dashboardData.activeWorkers.value }}</p>
          <p class="text-xs text-gray-500">{{ dashboardData.activeWorkers.change }}</p>
        </div>
        <div :class="[dashboardData.activeWorkers.iconBg, dashboardData.activeWorkers.iconColor]"
             class="p-3 rounded-full">
          <i :class="['bx', dashboardData.activeWorkers.icon]" class="text-2xl"></i>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between border border-gray-200">
        <div>
          <p class="text-sm text-gray-500">Areas Covered</p>
          <p class="text-3xl font-bold text-gray-800">{{ dashboardData.areasCovered.value }}</p>
          <p class="text-xs text-gray-500">{{ dashboardData.areasCovered.change }}</p>
        </div>
        <div :class="[dashboardData.areasCovered.iconBg, dashboardData.areasCovered.iconColor]"
             class="p-3 rounded-full">
          <i :class="['bx', dashboardData.areasCovered.icon]" class="text-2xl"></i>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between border border-gray-200">
        <div>
          <p class="text-sm text-gray-500">Assets Active</p>
          <p class="text-3xl font-bold text-gray-800">{{ dashboardData.assetsActive.value }}</p>
          <p class="text-xs text-gray-500">{{ dashboardData.assetsActive.change }}</p>
        </div>
        <div :class="[dashboardData.assetsActive.iconBg, dashboardData.assetsActive.iconColor]"
             class="p-3 rounded-full">
          <i :class="['bx', dashboardData.assetsActive.icon]" class="text-2xl"></i>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Tree Health Overview</h2>
        <div class="flex flex-col md:flex-row items-center md:justify-around space-y-4 md:space-y-0 md:space-x-8">
          <div class="w-full md:w-1/2 h-64 flex items-center justify-center relative">
            <div class="pie-chart-container w-48 h-48 rounded-full shadow-lg relative"
                 :style="{ background: generatePieChartGradient }">
                 <span class="absolute text-sm text-gray-700 font-semibold" style="top: 50%; left: 50%; transform: translate(-50%, -50%);">
                   {{ treeHealthOverview.healthy + treeHealthOverview.diseased + treeHealthOverview.underObservation }}% Total
                 </span>
            </div>
            </div>
          <div class="w-full md:w-1/2 p-4">
            <p class="text-gray-600 mb-4">Distribution of tree health across the plantation:</p>
            <ul class="space-y-2 text-lg">
              <li class="flex items-center">
                <span class="inline-block w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                Healthy: <span class="font-semibold ml-1">{{ treeHealthOverview.healthy }}%</span>
              </li>
              <li class="flex items-center">
                <span class="inline-block w-4 h-4 rounded-full bg-red-500 mr-2"></span>
                Diseased: <span class="font-semibold ml-1">{{ treeHealthOverview.diseased }}%</span>
              </li>
              <li class="flex items-center">
                <span class="inline-block w-4 h-4 rounded-full bg-yellow-500 mr-2"></span>
                Under Observation: <span class="font-semibold ml-1">{{ treeHealthOverview.underObservation }}%</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Monthly Yield Trend</h2>
        <div class="h-64 flex items-center justify-center">
          <canvas id="monthlyYieldChart" class="w-full h-full"></canvas>
        </div>
      </div>

      <div class="lg:col-span-2 bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Live Activities</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(activity, index) in liveActivities" :key="index">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ activity.time }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <i :class="['bx', activity.icon, getIconColor(activity.status)]" class="mr-2"></i>
                  {{ activity.description }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusBadgeColor(activity.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ getDisplayStatus(activity.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4 text-sm text-gray-500 text-center">
          <a href="#" class="text-blue-600 hover:underline">View all activities</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Chart from 'chart.js/auto'; // Make sure Chart.js is installed (npm install chart.js)

const dashboardData = ref({
  // Harvested Today (Kg) Card - Now separate
  harvestedToday: { value: '1,500 Kg', change: '+5.2% Today', icon: 'bxs-lemon', iconBg: 'bg-orange-100', iconColor: 'text-orange-500' },
  // Total Yield (Kg) Card - New, separate from Harvested Today
  totalYield: { value: '50,000 Kg', change: '+5% this month', icon: 'bxs-leaf', iconBg: 'bg-green-100', iconColor: 'text-green-500' },

  // Active Workers Card (retained)
  activeWorkers: { value: '120', change: '+5 this week', icon: 'bxs-group', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-500' },
  // Areas Covered Card (retained)
  areasCovered: { value: '2,500 Acres', change: '85% of total', icon: 'bx-area', iconBg: 'bg-teal-100', iconColor: 'text-teal-500' },
  // Assets Active Card (retained)
  assetsActive: { value: '45', change: '90% operational', icon: 'bxs-truck', iconBg: 'bg-pink-100', iconColor: 'text-pink-500' },

  // Existing Cards (retained)
  totalTreesPlanted: { value: '12,450', change: '+1.2% this month', icon: 'bxs-tree', iconBg: 'bg-blue-100', iconColor: 'text-blue-500' },
  totalHarvested: { value: '50,000', change: '+5% this month', icon: 'bxs-leaf', iconBg: 'bg-green-100', iconColor: 'text-green-500' }, // This is the overall total, kept separate.
  treesHealthyRatio: { value: '85', target: '90%', icon: 'bxs-heart-circle', iconBg: 'bg-purple-100', iconColor: 'text-purple-500' },
  diseasedTrees: { value: '1,200', change: '-10% last month', icon: 'bxs-virus', iconBg: 'bg-red-100', iconColor: 'text-red-500' },
  treesUnderObservation: { value: '50', change: 'Stable', icon: 'bxs-low-vision', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-500' },
});

// Data for the Tree Health Overview pie chart
const treeHealthOverview = ref({
  healthy: 85,
  diseased: 10,
  underObservation: 5,
});

// Computed property to generate the conic-gradient for the dummy pie chart
const generatePieChartGradient = computed(() => {
  const healthyEnd = treeHealthOverview.value.healthy;
  const diseasedEnd = healthyEnd + treeHealthOverview.value.diseased;
  const underObservationEnd = diseasedEnd + treeHealthOverview.value.underObservation;

  return `conic-gradient(
    #22C55E 0% ${healthyEnd}%, /* green-500 */
    #EF4444 ${healthyEnd}% ${diseasedEnd}%, /* red-500 */
    #F59E0B ${diseasedEnd}% ${underObservationEnd}% /* yellow-500 */
  )`;
});

// Dummy data for Monthly Yield Trend Line Chart
const monthlyYieldData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  yields: [3000, 3200, 2800, 3500, 3800, 4200, 4000, 4500, 4300, 4700, 4900, 5000], // Example yield in Kg
});

// Dummy data for Live Activities
const liveActivities = ref([
  { time: '2 mins ago', description: 'UGV-003 completed Block A-1 scan.', status: 'completed', icon: 'bx-bot' },
  { time: '15 mins ago', description: 'Tractor T-001 started harvesting in Block B-2.', status: 'in_progress', icon: 'bxs-truck' },
  { time: '30 mins ago', description: 'Sensor L-005 detected low soil moisture in Sector C-3.', status: 'alert', icon: 'bx-water' },
  { time: '1 hour ago', description: 'Worker ID-045 reported tree T-234 under observation.', status: 'reported', icon: 'bxs-user' },
  { time: '2 hours ago', description: 'Daily yield data for July 13th uploaded.', status: 'completed', icon: 'bx-cloud-upload' },
  { time: '4 hours ago', description: 'New tree seedlings planted in Block D-5.', status: 'completed', icon: 'bxs-tree' },
]);

// Helper functions for Live Activities styling
const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-700';
    case 'in_progress': return 'bg-blue-100 text-blue-700';
    case 'alert': return 'bg-red-100 text-red-700';
    case 'reported': return 'bg-yellow-100 text-yellow-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getDisplayStatus = (status) => {
  switch (status) {
    case 'completed': return 'Completed';
    case 'in_progress': return 'In Progress';
    case 'alert': return 'Alert';
    case 'reported': return 'Reported';
    default: return status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  }
};

const getIconColor = (status) => {
  switch (status) {
    case 'completed': return 'text-green-500';
    case 'in_progress': return 'text-blue-500';
    case 'alert': return 'text-red-500';
    case 'reported': return 'text-yellow-500';
    default: return 'text-gray-500';
  }
};


// Initialize charts using Chart.js on component mount
onMounted(() => {
  // Monthly Yield Line Chart
  const monthlyYieldCtx = document.getElementById('monthlyYieldChart');
  if (monthlyYieldCtx) {
    new Chart(monthlyYieldCtx, {
      type: 'line',
      data: {
        labels: monthlyYieldData.value.labels,
        datasets: [{
          label: 'Yield (Kg)',
          data: monthlyYieldData.value.yields,
          borderColor: '#4F46E5', // indigo-600
          backgroundColor: 'rgba(79, 70, 229, 0.2)', // Semi-transparent fill
          tension: 0.4, // Makes the line curved
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Yield (Kg)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Month'
            }
          }
        },
        plugins: {
          legend: {
            display: false, // Hide legend if only one dataset
          },
          title: {
            display: false, // Title is already in H2 tag
            text: 'Monthly Yield Trend'
          }
        }
      }
    });
  }
});
</script>

<style scoped>
/* No additional scoped styles needed for Tailwind CSS classes */

/* CSS for the dummy pie chart */
.pie-chart-container {
  /* This will be styled by the inline 'background' property with conic-gradient */
  background: white; /* Fallback */
}
</style>