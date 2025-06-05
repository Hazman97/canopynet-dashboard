<template>
  <router-link
    :to="to"
    class="flex items-center space-x-1 rounded-md px-2 py-3 hover:bg-primary hover:text-sidebar"
  >
    <span class="text-2xl ml-2"><i :class="`bx ${icon}`"></i></span>
    <span>{{ label }}</span>
  </router-link>
</template>

<script setup>
defineProps(['icon', 'label', 'to'])
</script>
