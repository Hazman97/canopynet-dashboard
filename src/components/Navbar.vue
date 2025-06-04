<template>
  <header class="flex w-full items-center justify-between border-b-2 border-gray-200 bg-white p-2">
    <div class="flex items-center space-x-2">
      <button type="button" class="text-3xl" @click="$emit('toggle-sidebar')">
        <i class="bx bx-menu"></i>
      </button>
      <div>Logo</div>
    </div>

    <div class="relative">
      <button
        type="button"
        class="h-9 w-9 overflow-hidden rounded-full"
        @click="profileOpen = !profileOpen"
      >
        <img src="https://plchldr.co/i/40x40?bg=111111" alt="Profile" />
      </button>

      <div
        v-if="profileOpen"
        class="absolute right-0 mt-1 w-48 divide-y divide-gray-200 rounded-md border border-gray-200 bg-white shadow-md"
      >
        <div class="flex items-center space-x-2 p-2">
          <img src="https://plchldr.co/i/40x40?bg=111111" class="h-9 w-9 rounded-full" />
          <div class="font-medium">Hafiz Haziq</div>
        </div>

        <div class="flex flex-col space-y-3 p-2">
          <a href="#" class="hover:text-blue-600">My Profile</a>
          <a href="#" class="hover:text-blue-600">Edit Profile</a>
          <a href="#" class="hover:text-blue-600">Settings</a>
        </div>

        <div class="p-2">
          <button class="flex items-center space-x-2 hover:text-blue-600">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <div>Log Out</div>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
const profileOpen = ref(false)
</script>
