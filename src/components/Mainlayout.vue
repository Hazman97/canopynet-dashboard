<!-- MainLayout.vue -->
<template>
  <main class="min-h-screen w-full bg-gray-100 text-gray-700">
    <Navbar @toggle-sidebar="asideOpen = !asideOpen" />

    <div class="flex">
      <Sidebar :show="asideOpen" />
      <div class="w-full p-4">
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
