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
    <p class="text-gray-600 mb-8">Quick insights into plantation performance, health, and operational efficiency with timeline differentiation.</p>

    <div class="flex justify-end mb-6">
      <div class="relative inline-block text-left">
        <div>
          <button type="button" @click="toggleDropdown" class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" id="options-menu" aria-haspopup="true" :aria-expanded="isDropdownOpen ? 'true' : 'false'">
            {{ displayTimeline }}
            <i class="bx bx-chevron-down -mr-1 ml-2 h-5 w-5"></i>
          </button>
        </div>
        <div v-if="isDropdownOpen" class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <a v-for="option in timelineOptions" :key="option.value" href="#" @click.prevent="selectTimeline(option.value)" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">
              {{ option.label }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Total Trees Trend</h2>
        <div class="h-80 flex items-center justify-center">
          <canvas id="totalTreesChart" class="w-full h-full"></canvas>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Average Yield Per Tree Trend</h2>
        <div class="h-80 flex items-center justify-center">
          <canvas id="avgYieldPerTreeChart" class="w-full h-full"></canvas>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Healthy Trees Percentage Trend</h2>
        <div class="h-80 flex items-center justify-center">
          <canvas id="healthyTreesChart" class="w-full h-full"></canvas>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Diseased Trees Count Trend</h2>
        <div class="h-80 flex items-center justify-center">
          <canvas id="diseasedTreesChart" class="w-full h-full"></canvas>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-800">Productivity Trends</h2>
          <div class="relative inline-block text-left">
            <button type="button" @click="toggleProductivityDropdown" class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-3 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              {{ displayProductivityMetric }}
              <i class="bx bx-chevron-down -mr-1 ml-2 h-5 w-5"></i>
            </button>
            <div v-if="isProductivityDropdownOpen" class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div class="py-1">
                <a v-for="option in productivityMetricOptions" :key="option.value" href="#" @click.prevent="selectProductivityMetric(option.value)" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{{ option.label }}</a>
              </div>
            </div>
          </div>
        </div>
        <div class="h-80 flex items-center justify-center">
          <canvas id="productivityTrendsChart" class="w-full h-full"></canvas>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Area Performance Comparison (Yield)</h2>
        <div class="h-80 flex items-center justify-center">
          <canvas id="areaPerformanceChart" class="w-full h-full"></canvas>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Top Performers</h2>
        <ul class="space-y-3">
          <li v-for="(worker, index) in topWorkers" :key="index" class="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-100">
            <div class="flex items-center space-x-3">
              <span :class="getRankBadgeColor(index)" class="w-8 h-8 flex items-center justify-center rounded-full font-bold text-white text-sm">
                {{ index + 1 }}
              </span>
              <p class="text-gray-800 font-medium">{{ worker.name }}</p>
            </div>
            <div class="text-right">
              <p class="text-lg font-semibold text-green-700">{{ worker.yield }} Kg</p>
              <div class="w-24 bg-gray-200 rounded-full h-2.5">
                <div class="bg-green-500 h-2.5 rounded-full" :style="{ width: worker.yield / topWorkers[0].yield * 100 + '%' }"></div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Asset Utilization</h2>
        <div class="h-80 flex items-center justify-center">
          <canvas id="assetUtilizationChart" class="w-full h-full"></canvas>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Weather (Rainfall) vs. Productivity (Yield)</h2>
        <div class="h-80 flex items-center justify-center">
          <canvas id="weatherProductivityChart" class="w-full h-full"></canvas>
        </div>
      </div>

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

      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
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
import { ref, onMounted, watch, computed } from 'vue';
import Chart from 'chart.js/auto';

const selectedTimeline = ref('last_30_days');
const isDropdownOpen = ref(false);

const selectedProductivityMetric = ref('harvest_productivity');
const isProductivityDropdownOpen = ref(false);

const timelineOptions = ref([
  { label: 'Last 7 Days', value: 'last_7_days' },
  { label: 'Last 30 Days', value: 'last_30_days' },
  { label: 'Last 6 Months', value: 'last_6_months' },
  { label: 'Last 1 Year', value: 'last_1_year' },
]);

const productivityMetricOptions = ref([
  { label: 'Harvest Productivity', value: 'harvest_productivity' },
  { label: 'Worker Efficiency', value: 'worker_efficiency' },
  { label: 'Area Coverage', value: 'area_coverage' },
]);

const displayTimeline = computed(() => {
  const option = timelineOptions.value.find(opt => opt.value === selectedTimeline.value);
  return option ? option.label : 'Select Timeline';
});

const displayProductivityMetric = computed(() => {
  const option = productivityMetricOptions.value.find(opt => opt.value === selectedProductivityMetric.value);
  return option ? option.label : 'Select Metric';
});

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const selectTimeline = (timeline) => {
  selectedTimeline.value = timeline;
  isDropdownOpen.value = false;
  // Re-render all charts when timeline changes
  destroyCharts();
  renderCharts();
};

const toggleProductivityDropdown = () => {
  isProductivityDropdownOpen.value = !isProductivityDropdownOpen.value;
};

const selectProductivityMetric = (metric) => {
  selectedProductivityMetric.value = metric;
  isProductivityDropdownOpen.value = false;
  destroyCharts(); // Destroy all charts
  renderCharts(); // Re-render all charts, productivity chart will pick new metric
};

const getRecommendationIcon = (priority) => {
  switch (priority) {
    case 'high': return 'bxs-error';
    case 'medium': return 'bxs-info-circle';
    case 'low': return 'bxs-bulb';
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

const getRankBadgeColor = (index) => {
  switch (index) {
    case 0: return 'bg-yellow-500'; // Gold for 1st
    case 1: return 'bg-gray-400';   // Silver for 2nd
    case 2: return 'bg-orange-600'; // Bronze for 3rd
    default: return 'bg-gray-500'; // Other ranks
  }
};

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

const topWorkers = ref([
  { name: 'Worker Alex', yield: 1850 },
  { name: 'Worker Ben', yield: 1720 },
  { name: 'Worker Chloe', yield: 1600 },
  { name: 'Worker David', yield: 1480 },
]);


// Chart instances storage
let totalTreesChartInstance = null;
let avgYieldPerTreeChartInstance = null;
let healthyTreesChartInstance = null;
let diseasedTreesChartInstance = null;
let productivityTrendsChartInstance = null;
let areaPerformanceChartInstance = null;
// Removed topPerformersChartInstance
let assetUtilizationChartInstance = null;
let weatherProductivityChartInstance = null;
let harvestPredictionChartInstance = null;
let yieldTrendsChartInstance = null;
let treeHealthIndexChartInstance = null;

const destroyCharts = () => {
  if (totalTreesChartInstance) totalTreesChartInstance.destroy();
  if (avgYieldPerTreeChartInstance) avgYieldPerTreeChartInstance.destroy();
  if (healthyTreesChartInstance) healthyTreesChartInstance.destroy();
  if (diseasedTreesChartInstance) diseasedTreesChartInstance.destroy();
  if (productivityTrendsChartInstance) productivityTrendsChartInstance.destroy();
  if (areaPerformanceChartInstance) areaPerformanceChartInstance.destroy();
  // No destroy for topPerformersChartInstance as it's no longer a chart
  if (assetUtilizationChartInstance) assetUtilizationChartInstance.destroy();
  if (weatherProductivityChartInstance) weatherProductivityChartInstance.destroy();
  if (harvestPredictionChartInstance) harvestPredictionChartInstance.destroy();
  if (yieldTrendsChartInstance) yieldTrendsChartInstance.destroy();
  if (treeHealthIndexChartInstance) treeHealthIndexChartInstance.destroy();
};

const getChartData = (chartType) => {
  const data = {
    labels: [],
    datasets: [],
  };

  const getDailyLabels = (numDays) => Array.from({ length: numDays }, (_, i) => `Day ${i + 1}`);
  const getMonthlyLabels = (numMonths) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIndex = new Date().getMonth();
    return Array.from({ length: numMonths }, (_, i) => months[(currentMonthIndex - numMonths + 1 + i + 12) % 12]);
  };

  // Helper to generate data with a trend
  const generateTrendData = (length, start, end, variance) => {
    const arr = [];
    const step = (end - start) / (length - 1);
    for (let i = 0; i < length; i++) {
      const value = start + i * step + (Math.random() * variance * 2 - variance);
      arr.push(Math.max(0, Math.round(value))); // Ensure non-negative
    }
    return arr;
  };

  let labels = [];
  let numDataPoints;

  if (selectedTimeline.value === 'last_7_days') {
    labels = getDailyLabels(7);
    numDataPoints = 7;
  } else if (selectedTimeline.value === 'last_30_days') {
    labels = getDailyLabels(30);
    numDataPoints = 30;
  } else if (selectedTimeline.value === 'last_6_months') {
    labels = getMonthlyLabels(6);
    numDataPoints = 6;
  } else if (selectedTimeline.value === 'last_1_year') {
    labels = getMonthlyLabels(12);
    numDataPoints = 12;
  }

  data.labels = labels;

  switch (chartType) {
    case 'totalTrees':
      data.datasets.push({ label: 'Total Trees', data: generateTrendData(numDataPoints, 12000, 12500, 100), borderColor: '#3B82F6', backgroundColor: 'rgba(59, 130, 246, 0.2)', fill: false, tension: 0.4 });
      break;
    case 'avgYieldPerTree':
      data.datasets.push({ label: 'Avg Yield/Tree (Kg)', data: generateTrendData(numDataPoints, 300, 310, 10), borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.2)', fill: false, tension: 0.4 });
      break;
    case 'healthyTrees':
      data.datasets.push({ label: 'Healthy Trees (%)', data: generateTrendData(numDataPoints, 88, 92, 2), borderColor: '#22C55E', backgroundColor: 'rgba(34, 197, 94, 0.2)', fill: false, tension: 0.4 });
      break;
    case 'diseasedTrees':
      data.datasets.push({ label: 'Diseased Trees (Count)', data: generateTrendData(numDataPoints, 800, 600, 50), borderColor: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.2)', fill: false, tension: 0.4 });
      break;
    case 'productivityTrends':
      if (selectedProductivityMetric.value === 'harvest_productivity') {
        data.datasets.push({ label: 'Harvest Productivity (Kg/hr)', data: generateTrendData(numDataPoints, 450, 480, 20), borderColor: '#F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.2)', fill: false, tension: 0.4 });
      } else if (selectedProductivityMetric.value === 'worker_efficiency') {
        data.datasets.push({ label: 'Worker Efficiency (Trees/day)', data: generateTrendData(numDataPoints, 140, 155, 5), borderColor: '#8B5CF6', backgroundColor: 'rgba(139, 92, 246, 0.2)', fill: false, tension: 0.4 });
      } else if (selectedProductivityMetric.value === 'area_coverage') {
        data.datasets.push({ label: 'Area Coverage (Ha/day)', data: generateTrendData(numDataPoints, 4.5, 5.2, 0.5), borderColor: '#EC4899', backgroundColor: 'rgba(236, 72, 153, 0.2)', fill: false, tension: 0.4 });
      }
      break;
    case 'areaPerformance':
      data.labels = ['Block A-1', 'Block B-2', 'Block C-3', 'Block D-4', 'Block E-5'];
      data.datasets.push({
        label: 'Yield (Kg)',
        data: [7500, 8200, 6800, 7900, 7100],
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
        borderColor: ['#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED'],
        borderWidth: 1,
      });
      break;
    // Removed topPerformers case as it's no longer a chart
    case 'assetUtilization':
      data.labels = ['Operational', 'Maintenance', 'Offline', 'Standby'];
      data.datasets.push({
        data: [75, 12, 3, 10],
        backgroundColor: ['#22C55E', '#F59E0B', '#EF4444', '#3B82F6'],
        borderColor: '#FFFFFF',
        borderWidth: 2,
      });
      break;
    case 'weatherProductivity':
      const rainfallData = generateTrendData(numDataPoints, 30, 60, 10);
      const yieldData = rainfallData.map(r => 1200 + r * 5 + (Math.random() * 200 - 100));
      data.datasets.push(
        {
          label: 'Rainfall (mm)',
          data: rainfallData,
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.3)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y',
        },
        {
          label: 'Harvest Yield (Kg)',
          data: yieldData,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.3)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y1',
        }
      );
      break;
    case 'harvestPrediction':
      const actualYield = generateTrendData(numDataPoints, 1400, 1600, 50);
      const predictedYield = actualYield.map(y => y + (Math.random() * 80 - 40));
      data.datasets.push(
        { label: 'Actual (Kg)', data: actualYield, borderColor: '#22C55E', backgroundColor: 'rgba(34, 197, 94, 0.2)', tension: 0.4, fill: false },
        { label: 'Predicted (Kg)', data: predictedYield, borderColor: '#3B82F6', backgroundColor: 'rgba(59, 130, 246, 0.2)', borderDash: [5, 5], tension: 0.4, fill: false }
      );
      break;
    case 'yieldTrends':
      data.labels = ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4'];
      data.datasets.push({
        label: 'Yield (Kg)',
        data: [4500, 5100, 4800, 4200],
        backgroundColor: ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981'],
        borderColor: ['#2563EB', '#7C3AED', '#DB2777', '#059669'],
        borderWidth: 1,
      });
      break;
  }
  return data;
};

const renderCharts = () => {
  // Total Trees Chart
  const totalTreesCtx = document.getElementById('totalTreesChart');
  if (totalTreesCtx) {
    totalTreesChartInstance = new Chart(totalTreesCtx, {
      type: 'line',
      data: getChartData('totalTrees'),
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { y: { beginAtZero: false, title: { display: true, text: 'Number of Trees' } }, x: { title: { display: true, text: 'Time' } } },
        plugins: { legend: { display: false } },
      },
    });
  }

  // Average Yield Per Tree Chart
  const avgYieldPerTreeCtx = document.getElementById('avgYieldPerTreeChart');
  if (avgYieldPerTreeCtx) {
    avgYieldPerTreeChartInstance = new Chart(avgYieldPerTreeCtx, {
      type: 'line',
      data: getChartData('avgYieldPerTree'),
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { y: { beginAtZero: false, title: { display: true, text: 'Yield (Kg)' } }, x: { title: { display: true, text: 'Time' } } },
        plugins: { legend: { display: false } },
      },
    });
  }

  // Healthy Trees Percentage Chart
  const healthyTreesCtx = document.getElementById('healthyTreesChart');
  if (healthyTreesCtx) {
    healthyTreesChartInstance = new Chart(healthyTreesCtx, {
      type: 'line',
      data: getChartData('healthyTrees'),
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { y: { beginAtZero: false, max: 100, title: { display: true, text: 'Percentage (%)' } }, x: { title: { display: true, text: 'Time' } } },
        plugins: { legend: { display: false } },
      },
    });
  }

  // Diseased Trees Count Chart
  const diseasedTreesCtx = document.getElementById('diseasedTreesChart');
  if (diseasedTreesCtx) {
    diseasedTreesChartInstance = new Chart(diseasedTreesCtx, {
      type: 'line',
      data: getChartData('diseasedTrees'),
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { y: { beginAtZero: false, title: { display: true, text: 'Number of Trees' } }, x: { title: { display: true, text: 'Time' } } },
        plugins: { legend: { display: false } },
      },
    });
  }

  // Productivity Trends Chart
  const productivityTrendsCtx = document.getElementById('productivityTrendsChart');
  if (productivityTrendsCtx) {
    productivityTrendsChartInstance = new Chart(productivityTrendsCtx, {
      type: 'line',
      data: getChartData('productivityTrends'),
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { y: { beginAtZero: false, title: { display: true, text: displayProductivityMetric.value } }, x: { title: { display: true, text: 'Time' } } },
        plugins: { legend: { display: false } },
      },
    });
  }

  // Area Performance Comparison Chart
  const areaPerformanceCtx = document.getElementById('areaPerformanceChart');
  if (areaPerformanceCtx) {
    areaPerformanceChartInstance = new Chart(areaPerformanceCtx, {
      type: 'bar',
      data: getChartData('areaPerformance'),
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, title: { display: true, text: 'Yield (Kg)' } }, x: { title: { display: true, text: 'Area/Block' } } },
        plugins: { legend: { display: false } },
      },
    });
  }

  // Removed Top Performers Chart rendering logic

  // Asset Utilization Chart (Donut)
  const assetUtilizationCtx = document.getElementById('assetUtilizationChart');
  if (assetUtilizationCtx) {
    assetUtilizationChartInstance = new Chart(assetUtilizationCtx, {
      type: 'doughnut',
      data: getChartData('assetUtilization'),
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { boxWidth: 20, padding: 15 } },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.label || '';
                if (label) { label += ': '; }
                if (context.parsed !== null) { label += context.parsed + '%'; }
                return label;
              }
            }
          }
        },
      },
    });
  }

  // Weather vs. Productivity Chart (Area)
  const weatherProductivityCtx = document.getElementById('weatherProductivityChart');
  if (weatherProductivityCtx) {
    weatherProductivityChartInstance = new Chart(weatherProductivityCtx, {
      type: 'line', // Area chart is a line chart with fill: true
      data: getChartData('weatherProductivity'),
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: { display: true, text: 'Rainfall (mm)' },
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: { display: true, text: 'Harvest Yield (Kg)' },
            grid: { drawOnChartArea: false }, // Only draw grid lines for the first Y-axis
          },
          x: { title: { display: true, text: 'Time' } },
        },
        plugins: { legend: { display: true, position: 'bottom' } },
      },
    });
  }

  // Harvest Prediction Chart
  const harvestPredictionCtx = document.getElementById('harvestPredictionChart');
  if (harvestPredictionCtx) {
    harvestPredictionChartInstance = new Chart(harvestPredictionCtx, {
      type: 'line',
      data: getChartData('harvestPrediction'),
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, title: { display: true, text: 'Yield (Kg)' } }, x: { title: { display: true, text: 'Month' } } },
        plugins: { legend: { display: true, position: 'bottom' } },
      },
    });
  }

  // Yield Trends by Phase/Block Chart
  const yieldTrendsCtx = document.getElementById('yieldTrendsChart');
  if (yieldTrendsCtx) {
    yieldTrendsChartInstance = new Chart(yieldTrendsCtx, {
      type: 'bar',
      data: getChartData('yieldTrends'),
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, title: { display: true, text: 'Yield (Kg)' } }, x: { title: { display: true, text: 'Phase/Block' } } },
        plugins: { legend: { display: false } },
      },
    });
  }

  // Tree Health Index Breakdown Chart (Pie Chart) - static data
  const treeHealthIndexCtx = document.getElementById('treeHealthIndexChart');
  if (treeHealthIndexCtx) {
    treeHealthIndexChartInstance = new Chart(treeHealthIndexCtx, {
      type: 'pie',
      data: {
        labels: ['Healthy', 'Diseased', 'Under Observation', 'Recovery'],
        datasets: [{
          data: [70, 15, 10, 5],
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
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { boxWidth: 20, padding: 15 } },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.label || '';
                if (label) { label += ': '; }
                if (context.parsed !== null) { label += context.parsed + '%'; }
                return label;
              }
            }
          }
        },
      },
    });
  }
};

onMounted(() => {
  renderCharts();
});

// Watch for selectedTimeline changes to re-render charts
watch(selectedTimeline, () => {
  destroyCharts();
  renderCharts();
});

// Watch for selectedProductivityMetric changes to re-render charts
watch(selectedProductivityMetric, () => {
  destroyCharts();
  renderCharts();
});
</script>

<style scoped>
/* No additional scoped styles needed for Tailwind CSS classes */
</style>