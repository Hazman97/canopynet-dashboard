<template>
  <aside
    v-show="show"
    class="flex w-72 flex-col space-y-2 border-r-2 border-primary bg-sidebar p-2 text-[#abc0c0] rounded-r-2xl"
    :style="{ height: 'calc(100vh - 64px)' }"
  >
    <SidebarItem icon="bx-home" label="Dashboard" to="/" />
    <SidebarItem icon="bx-cart" label="Cart" to="/cart" />
    <SidebarItem icon="bx-shopping-bag" label="Shopping" to="/MainLayout/shopping" />
    <SidebarItem icon="bx-heart" label="My Favourite" to="/MainLayout/favourite" />
    <SidebarItem icon="bx-user" label="Profile" to="/MainLayout/profile" />
  </aside>
</template>


<script setup>
import SidebarItem from './SidebarItem.vue'
defineProps({
  show: Boolean
})
</script>
