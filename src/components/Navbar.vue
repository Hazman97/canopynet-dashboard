<template>
  <header class="relative flex w-full items-center justify-between border-b-2 border-gray-200 bg-white px-4 py-2 h-16">
    <!-- Sidebar toggle -->
    <button type="button" class="text-3xl z-10" @click="$emit('toggle-sidebar')">
      <i class="bx bx-menu"></i>
    </button>

    <!-- Centered Logo -->
    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div class="flex h-12 w-36 items-center overflow-hidden">
        <img
          src="../assets/logo.png"
          alt="Logo"
          class="h-[150px] w-auto object-contain"
        />
      </div>
    </div>

    <!-- Right Section: Profile + Logout -->
    <div class="flex items-center space-x-4 z-10">
      <button class="text-sm bg-dark px-3 py-2 rounded-lg text-primary font-semibold hover:text-[#abc0c0]">
        Log Out
      </button>
      <img
        src="https://plchldr.co/i/40x40?bg=111111"
        alt="Profile"
        class="h-10 w-10 rounded-full object-cover"
      />
    </div>
  </header>
</template>

<script setup>
</script>
