<template>
  <div class="flex-grow p-6 bg-gray-100 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Analytics Overview</h1>
      <div class="flex items-center space-x-4 text-gray-600">
        <span class="text-sm">Last Updated: July 14, 2025, 5:00 PM</span>
        <button class="px-3 py-1 bg-white rounded-md border border-gray-300 hover:bg-gray-50 transition duration-150 ease-in-out flex items-center text-sm">
          <i class="bx bx-refresh text-lg mr-1"></i> Refresh
        </button>
      </div>
    </div>
    <p class="text-gray-600 mb-8">Quick insights into plantation performance, health, and operational efficiency.</p>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      <div v-for="(data, key) in analyticsData" :key="key"
           class="bg-white rounded-lg shadow-md p-5 flex items-center justify-between border border-gray-200">
        <div>
          <p class="text-sm text-gray-500">{{ data.label }}</p>
          <p class="text-3xl font-bold text-gray-800">{{ data.value }}</p>
          <p v-if="data.change" class="text-xs" :class="data.change.includes('+') ? 'text-green-500' : (data.change.includes('-') ? 'text-red-500' : 'text-gray-500')">
            {{ data.change }}
          </p>
          <p v-if="data.target" class="text-xs text-gray-500">
            Target: {{ data.target }}
          </p>
        </div>
        <div :class="[data.iconBg, data.iconColor]" class="p-3 rounded-full">
          <i :class="['bx', data.icon]" class="text-2xl"></i>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Harvest Prediction</h2>
        <div class="h-80 flex items-center justify-center">
          <canvas id="harvestPredictionChart" class="w-full h-full"></canvas>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Yield Trends by Phase/Block</h2>
        <div class="h-80 flex items-center justify-center">
          <canvas id="yieldTrendsChart" class="w-full h-full"></canvas>
        </div>
      </div>

      <div class="lg:col-span-2 bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Tree Health Index Breakdown</h2>
        <div class="h-80 flex items-center justify-center">
          <canvas id="treeHealthIndexChart" class="w-full h-full"></canvas>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 class="text-xl font-bold text-gray-800 mb-4">Key Recommendations</h2>
      <ul class="space-y-4">
        <li v-for="(rec, index) in recommendations" :key="index" class="flex items-start bg-gray-50 p-4 rounded-lg border border-gray-100">
          <i :class="['bx mr-3 text-2xl', getRecommendationIcon(rec.priority), getRecommendationIconColor(rec.priority)]"></i>
          <div>
            <p class="font-semibold text-gray-800">{{ rec.title }}</p>
            <p class="text-gray-600 text-sm">{{ rec.description }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto'; // Make sure Chart.js is installed (npm install chart.js)

const analyticsData = ref({
  totalTrees: { label: 'Total Trees', value: '12,450', change: '+1.2% this month', icon: 'bxs-tree', iconBg: 'bg-blue-100', iconColor: 'text-blue-500' },
  avgTreeAge: { label: 'Average Tree Age', value: '5.2 Years', icon: 'bx-calendar', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-500' },
  avgYieldPerTree: { label: 'Avg Yield/Tree', value: '350 Kg', change: '+2.5% this harvest', icon: 'bxs-leaf', iconBg: 'bg-green-100', iconColor: 'text-green-500' },
  healthyTreesRatio: { label: 'Healthy Trees', value: '85%', target: '90%', icon: 'bxs-heart-circle', iconBg: 'bg-purple-100', iconColor: 'text-purple-500' },
  diseasedTreesCount: { label: 'Diseased Trees', value: '1,200', change: '-10% last month', icon: 'bxs-virus', iconBg: 'bg-red-100', iconColor: 'text-red-500' },
  treesUnderObservation: { label: 'Trees Under Observation', value: '50', change: 'Stable', icon: 'bxs-low-vision', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-500' },
  pestInfestationRate: { label: 'Pest Infestation Rate', value: '3.5%', change: '+0.5% this season', icon: 'bx-bug', iconBg: 'bg-gray-100', iconColor: 'text-gray-500' },
  fertilizerUsage: { label: 'Fertilizer Usage', value: '1,200 Tons', change: '+5% this month', icon: 'bxs-package', iconBg: 'bg-lime-100', iconColor: 'text-lime-600' },
  waterUsage: { label: 'Water Usage', value: '250,000 L', change: '-2% last quarter', icon: 'bx-water', iconBg: 'bg-cyan-100', iconColor: 'text-cyan-500' },
  energyConsumption: { label: 'Energy Consumption', value: '15,000 kWh', change: 'Stable', icon: 'bxs-bolt', iconBg: 'bg-amber-100', iconColor: 'text-amber-500' },
  laborEfficiency: { label: 'Labor Efficiency', value: '80%', target: '85%', icon: 'bxs-user-check', iconBg: 'bg-orange-100', iconColor: 'text-orange-500' },
  operationalCost: { label: 'Operational Cost', value: 'RM 45,000', change: '+3% this month', icon: 'bxs-dollar-circle', iconBg: 'bg-rose-100', iconColor: 'text-rose-500' },
});

const recommendations = ref([
  {
    priority: 'high',
    title: 'Address diseased trees in Block C-2 urgently',
    description: 'Immediate action required to prevent spread of disease. Deploy drones for targeted spraying.',
  },
  {
    priority: 'medium',
    title: 'Optimize fertilizer application in young palm areas',
    description: 'Based on soil analysis, adjust NPK ratios for better growth in newly planted blocks.',
  },
  {
    priority: 'low',
    title: 'Review water usage efficiency in Sector A-5',
    description: 'Analyze irrigation data for potential water savings without impacting yield.',
  },
  {
    priority: 'high',
    title: 'Repair faulty sensors in Section D-1',
    description: 'Data from these sensors is critical for accurate health monitoring and yield prediction.',
  },
]);

const getRecommendationIcon = (priority) => {
  switch (priority) {
    case 'high': return 'bxs-error'; // exclamation mark or warning
    case 'medium': return 'bxs-info-circle'; // info icon
    case 'low': return 'bxs-bulb'; // lightbulb for suggestion
    default: return 'bx-check-circle';
  }
};

const getRecommendationIconColor = (priority) => {
  switch (priority) {
    case 'high': return 'text-red-500';
    case 'medium': return 'text-orange-500';
    case 'low': return 'text-blue-500';
    default: return 'text-gray-500';
  }
};

onMounted(() => {
  // Harvest Prediction Chart
  const harvestPredictionCtx = document.getElementById('harvestPredictionChart');
  if (harvestPredictionCtx) {
    new Chart(harvestPredictionCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Actual Yield (Kg)',
            data: [3000, 3200, 2800, 3500, 3800, 4200, 4000, 4500, 4300, 4700, 4900, 5000],
            borderColor: '#22C55E', // Green
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            tension: 0.4,
            fill: false,
          },
          {
            label: 'Predicted Yield (Kg)',
            data: [3100, 3300, 2900, 3600, 3900, 4300, 4100, 4600, 4400, 4800, 5000, 5200], // Slightly higher prediction
            borderColor: '#3B82F6', // Blue
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderDash: [5, 5], // Dashed line for prediction
            tension: 0.4,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Yield (Kg)',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Month',
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
          },
        },
      },
    });
  }

  // Yield Trends by Phase/Block Chart
  const yieldTrendsCtx = document.getElementById('yieldTrendsChart');
  if (yieldTrendsCtx) {
    new Chart(yieldTrendsCtx, {
      type: 'bar',
      data: {
        labels: ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5'],
        datasets: [
          {
            label: 'Yield (Kg)',
            data: [15000, 18000, 12000, 20000, 16000],
            backgroundColor: [
              '#3B82F6', // blue-500
              '#8B5CF6', // purple-500
              '#EC4899', // pink-500
              '#10B981', // emerald-500
              '#F59E0B', // amber-500
            ],
            borderColor: [
              '#2563EB',
              '#7C3AED',
              '#DB2777',
              '#059669',
              '#D97706',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Yield (Kg)',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Phase/Block',
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  // Tree Health Index Breakdown Chart (Pie Chart)
  const treeHealthIndexCtx = document.getElementById('treeHealthIndexChart');
  if (treeHealthIndexCtx) {
    new Chart(treeHealthIndexCtx, {
      type: 'pie',
      data: {
        labels: ['Healthy', 'Diseased', 'Under Observation', 'Recovery'],
        datasets: [{
          data: [70, 15, 10, 5], // Example percentages
          backgroundColor: [
            '#22C55E', // Healthy - green-500
            '#EF4444', // Diseased - red-500
            '#F59E0B', // Under Observation - yellow-500
            '#3B82F6', // Recovery - blue-500
          ],
          borderColor: '#FFFFFF',
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 20,
              padding: 15,
            },
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed !== null) {
                  label += context.parsed + '%';
                }
                return label;
              }
            }
          }
        },
      },
    });
  }
});
</script>

<style scoped>
/* No specific scoped styles needed as Tailwind CSS classes handle most styling */
</style>