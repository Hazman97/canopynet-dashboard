<template>
  <main class="min-h-screen w-full overflow-y-hidden">
    <!-- Navbar -->
    <div>
      <Navbar @toggle-sidebar="asideOpen = !asideOpen" />
    </div>

    <!-- Layout -->
    <div class="flex h-[calc(100vh-64px)]">
      <!-- Sidebar with dynamic width -->
      <Sidebar :collapsed="!asideOpen" class="transition-all duration-300" />

      <!-- Main content area -->
      <div
        :class="[
          'transition-all duration-300 overflow-auto p-4 h-full',
          asideOpen ? 'flex-1' : 'w-full'
        ]"
      >
        <router-view />
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, watch } from 'vue'
import Navbar from '../components/Navbar.vue'
import Sidebar from '../components/Sidebar.vue'

const asideOpen = ref(
  localStorage.getItem('asideOpen') === 'false' ? false : true
)

watch(asideOpen, (newVal) => {
  localStorage.setItem('asideOpen', newVal)
})
</script>
