<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg p-6 shadow">
      <h2 class="text-xl font-semibold">Monitoring Dashboard</h2>
      <p class="text-gray-500">Real-time and historical metrics of all mesh network nodes.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg p-4 shadow">
        <h3 class="text-lg font-semibold mb-2">Battery Levels</h3>
        <Line :data="batteryData" :options="chartOptions" />
      </div>

      <div class="bg-white rounded-lg p-4 shadow">
        <h3 class="text-lg font-semibold mb-2">Signal Strength (dBm)</h3>
        <Line :data="signalData" :options="chartOptions" />
      </div>

      <div class="bg-white rounded-lg p-4 shadow">
        <h3 class="text-lg font-semibold mb-4">Signal Quality Monitor</h3>
        <div v-for="node in signalQualityNodes" :key="node.id" class="bg-gray-50 rounded-lg p-4 mb-3 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between last:mb-0">
          <div class="flex items-center mb-2 sm:mb-0">
            <span class="font-bold text-gray-800 text-lg mr-4">{{ node.id }}</span>
            <span
              :class="{
                'bg-green-100 text-green-700': node.status === 'Excellent',
                'bg-yellow-100 text-yellow-700': node.status === 'Good',
                'bg-orange-100 text-orange-700': node.status === 'Fair',
                'bg-red-100 text-red-700': node.status === 'Weak'
              }"
              class="text-xs font-semibold px-2.5 py-0.5 rounded-full"
            >
              {{ node.status }}
            </span>
          </div>
          <div class="flex flex-wrap text-sm text-gray-600 sm:space-x-6">
            <span class="mr-4 sm:mr-0">RSSI: <span class="font-medium text-gray-800">{{ node.rssi }} dBm</span></span>
            <span>Link Quality: <span class="font-medium text-gray-800">{{ node.linkQuality }}%</span></span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-4 shadow">
        <h3 class="text-lg font-semibold mb-4">Performance Metrics</h3>
        <div v-for="device in performanceMetricsDevices" :key="device.id" class="bg-gray-50 rounded-lg p-4 mb-3 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between last:mb-0">
          <div class="flex items-center mb-2 sm:mb-0">
            <span class="font-bold text-gray-800 text-lg mr-4">{{ device.id }}</span>
            <span
              :class="{
                'bg-green-100 text-green-700': device.status === 'online',
                'bg-red-100 text-red-700': device.status === 'warning',
                'bg-gray-100 text-gray-700': device.status === 'offline'
              }"
              class="text-xs font-semibold px-2.5 py-0.5 rounded-full"
            >
              {{ device.status }}
            </span>
          </div>
          <div class="flex flex-wrap text-sm text-gray-600 sm:space-x-6">
            <span class="mr-4 sm:mr-0">RSRP: <span class="font-medium text-gray-800">{{ device.rsrp }} dBm</span></span>
            <span class="mr-4 sm:mr-0">SNR: <span class="font-medium text-gray-800">{{ device.snr }} dB</span></span>
            <span>Distance: <span class="font-medium text-gray-800">{{ device.distance }}m</span></span>
          </div>
        </div>
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
      // Updated: Signal Quality Data for a list of nodes
      signalQualityNodes: [
        { id: 'NODE-001', rssi: -55, linkQuality: 95, status: 'Excellent' },
        { id: 'NODE-002', rssi: -70, linkQuality: 80, status: 'Good' },
        { id: 'NODE-003', rssi: -85, linkQuality: 60, status: 'Fair' },
        { id: 'NODE-004', rssi: -95, linkQuality: 40, status: 'Weak' }
      ],
      // Performance Metrics Data for all devices (as previously updated)
      performanceMetricsDevices: [
        { id: 'GW-001', rsrp: -80, snr: 15, distance: 0, status: 'online' },
        { id: 'RT-002', rsrp: -85, snr: 12, distance: 75, status: 'online' },
        { id: 'EP-003', rsrp: -95, snr: 8, distance: 120, status: 'warning' }
      ],
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

<style scoped>
/* No additional scoped styles needed, Tailwind classes handle styling. */
</style>