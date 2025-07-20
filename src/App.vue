<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- This is your main application entry point. -->
    <!-- You can add a navigation bar or other global elements here. -->
    <UGVView />
  </div>
</template>

<script setup>
import UGVView from './views/UGVView.vue'; // Assuming UGVView is in the 'views' folder

// No ROS logic directly in App.vue anymore.
// It's now a container for your main application views.
</script>

<style>
/* Global styles if any, otherwise Tailwind handles most of it */
body {
  margin: 0;
  font-family: 'Inter', sans-serif; /* Using Inter font as per instructions */
}
</style>
