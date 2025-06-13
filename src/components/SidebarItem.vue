<template>
  <router-link
    :to="to"
    class="flex items-center gap-4 p-3 rounded hover:bg-primary transition-all duration-200"
    :class="collapsed ? 'justify-center' : ''"
  >
    <i :class="['bx', icon, 'text-xl']"></i>
    <span v-if="!collapsed" class="whitespace-nowrap">{{ label }}</span>
  </router-link>
</template>

<script setup>
defineProps({
  icon: String,
  label: String,
  to: Object,
  collapsed: Boolean
})
</script>
