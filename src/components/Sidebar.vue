<template>
  <aside
    v-show="show"
    class="flex w-72 flex-col space-y-2 border-r-2 border-gray-200 bg-white p-2 h-screen"
  >
    <SidebarItem icon="bx-home" label="Dashboard" to="/MainLayout" />
    <SidebarItem icon="bx-cart" label="Cart" to="/MainLayout/cart" />
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
