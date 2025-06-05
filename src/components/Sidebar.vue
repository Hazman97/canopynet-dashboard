<template>
  <aside
    v-show="show"
    class="flex w-72 flex-col space-y-2 border-r-2 border-primary bg-sidebar p-2 text-[#abc0c0] rounded-r-2xl"
    :style="{ height: 'calc(100vh - 64px)' }"
  >
    <SidebarItem icon="bx-home" label="Dashboard" :to="{ name: 'dashboard' }" />
    <SidebarItem icon="bx-chalkboard" label="Insight" :to="{ name: 'cart' }" />
    <SidebarItem icon="bx-reflect-vertical" label="Fleet" :to="{ name: 'dashboard' }" />
    <SidebarItem icon="bx-rocket" label="Teleoperation" :to="{ name: 'teleoperation' }" />
    <SidebarItem icon="bx-cog" label="Setting" :to="{ name: 'dashboard' }" />

  </aside>
</template>


<script setup>
import SidebarItem from './SidebarItem.vue'
defineProps({
  show: Boolean
})
</script>
