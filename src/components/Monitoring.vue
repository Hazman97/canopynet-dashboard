<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-lg p-6 shadow">
      <h2 class="text-xl font-semibold">Monitoring Dashboard</h2>
      <p class="text-gray-500">Real-time and historical metrics of all mesh network nodes.</p>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg p-4 shadow">
        <h3 class="text-lg font-semibold mb-2">Battery Levels</h3>
        <Line :data="batteryData" :options="chartOptions" />
      </div>

      <div class="bg-white rounded-lg p-4 shadow">
        <h3 class="text-lg font-semibold mb-2">Signal Strength (dBm)</h3>
        <Line :data="signalData" :options="chartOptions" />
      </div>

      <div class="bg-white rounded-lg p-4 shadow md:col-span-2">
        <h3 class="text-lg font-semibold mb-2">Node Uptime (%)</h3>
        <Bar :data="uptimeData" :options="barOptions" />
      </div>
    </div>
  </div>
</template>

<script>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale
} from 'chart.js';

import { Line, Bar } from 'vue-chartjs';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale
);

export default {
  name: 'Monitoring',
  components: {
    Line,
    Bar
  },
  data() {
    return {
      batteryData: {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
        datasets: [
          {
            label: 'Gateway',
            data: [80, 78, 76, 79, 77],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            tension: 0.3
          },
          {
            label: 'Endpoint Alpha',
            data: [55, 50, 48, 45, 40],
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            tension: 0.3
          }
        ]
      },
      signalData: {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
        datasets: [
          {
            label: 'Gateway',
            data: [-55, -54, -52, -53, -50],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            tension: 0.3
          },
          {
            label: 'Endpoint Alpha',
            data: [-75, -78, -80, -82, -85],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            tension: 0.3
          }
        ]
      },
      uptimeData: {
        labels: ['Gateway', 'Router 1', 'Endpoint Alpha', 'Endpoint Bravo'],
        datasets: [
          {
            label: 'Uptime (%)',
            data: [99, 95, 88, 70],
            backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444']
          }
        ]
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        },
        scales: {
          y: { beginAtZero: true }
        }
      },
      barOptions: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, max: 100 }
        }
      }
    };
  }
};
</script>
