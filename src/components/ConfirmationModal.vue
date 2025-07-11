<template>
  <transition name="fade">
    <div v-if="isVisible" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 transform transition-all duration-300 scale-100 opacity-100">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold text-gray-800">{{ title }}</h3>
          <button @click="cancel" class="text-gray-400 hover:text-gray-600">
            <i class="bx bx-x text-2xl"></i>
          </button>
        </div>
        <div class="mb-6 text-gray-700">
          <p>{{ message }}</p>
        </div>
        <div class="flex justify-end space-x-3">
          <button
            @click="cancel"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-150 ease-in-out"
          >
            {{ cancelButtonText }}
          </button>
          <button
            @click="confirm"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-150 ease-in-out"
          >
            {{ confirmButtonText }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    default: 'Are you sure you want to proceed?'
  },
  confirmButtonText: {
    type: String,
    default: 'OK'
  },
  cancelButtonText: {
    type: String,
    default: 'Cancel'
  }
});

const emit = defineEmits(['confirm', 'cancel']);

const confirm = () => {
  emit('confirm');
};

const cancel = () => {
  emit('cancel');
};
</script>

<style scoped>
/* Transition styles for fade effect */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>