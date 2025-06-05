<template>
  <main class="min-h-screen w-full overflow-y-hidden">
    <!-- Navbar -->
    <div>
      <Navbar @toggle-sidebar="asideOpen = !asideOpen" />
    </div>

    <!-- Main layout wrapper -->
    <div class="flex h-[calc(100vh-64px)]">
      <!-- Sidebar (conditionally hidden) -->
      <div
        v-if="asideOpen"
        class="w-64 shrink-0 h-full transition-all duration-300"
      >
        <Sidebar :show="asideOpen" class="h-full" />
      </div>

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
import { ref } from 'vue'
import Navbar from '../components/Navbar.vue'
import Sidebar from '../components/Sidebar.vue'

const asideOpen = ref(true)
</script>
