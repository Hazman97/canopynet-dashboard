<template>
  <aside
    class="flex flex-col space-y-2 border-r-2 border-primary bg-sidebar p-2 text-[#abc0c0] transition-all duration-300 rounded-r-2xl"
    :class="collapsed ? 'w-20 items-center' : 'w-72'"
    :style="{ height: 'calc(100vh - 64px)' }"
  >
<!--   
    <div class="flex justify-center py-4">
      <img
        src="@/assets/logo.png"
        :class="collapsed ? 'w-10' : 'w-24'"
        class="transition-all duration-300"
        alt="Logo"
      />
    </div> -->

    <!-- Sidebar items -->
    <SidebarItem icon="bx-home" label="Dashboard" :to="{ name: 'dashboard' }" :collapsed="collapsed" />
    <SidebarItem icon="bx-map" label="Live Map" :to="{ name: 'livemap' }" :collapsed="collapsed" />
    <SidebarItem icon="bx-task" label="Task" :to="{ name: 'task' }" :collapsed="collapsed" />
    <SidebarItem icon="bx-group" label="Workers" :to="{ name: 'workers' }" :collapsed="collapsed" />
    <SidebarItem icon="bx-map-alt" label="Areas" :to="{ name: 'areas' }" :collapsed="collapsed" />
    <SidebarItem icon="bxs-truck" label="Assets" :to="{ name: 'assets' }" :collapsed="collapsed" />
    <SidebarItem icon="bx-bot" label="UGV" :to="{ name: 'ugv' }" :collapsed="collapsed" />
    <SidebarItem icon="bx-joystick" label="Teleoperation" :to="{ name: 'teleoperation' }" :collapsed="collapsed" />
    <SidebarItem icon="bx-bar-chart-alt-2" label="Analytics" :to="{ name: 'analytics' }" :collapsed="collapsed" />
    <SidebarItem icon="bxs-network-chart" label="Mesh Network" :to="{ name: 'mesh' }" :collapsed="collapsed" />
    <SidebarItem icon="bx-cog" label="Setting" :to="{ name: 'dashboard' }" :collapsed="collapsed" />
    <!-- <SidebarItem icon="bx-chalkboard" label="Insight" :to="{ name: 'cart' }" :collapsed="collapsed" />
    <SidebarItem icon="bx-reflect-vertical" label="Fleet" :to="{ name: 'dashboard' }" :collapsed="collapsed" /> 
    <SidebarItem icon="bx-error-alt" label="Alarm" :to="{ name: 'alarm' }" :collapsed="collapsed" /> -->
  </aside>
</template>

<script setup>
import SidebarItem from './SidebarItem.vue'

defineProps({
  collapsed: Boolean
})
</script>
