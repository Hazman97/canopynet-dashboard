<template>
  <div class="min-h-screen p-4 flex flex-col items-center"> 
    <!-- Camera toggle buttons (centered) -->
    <div class="mb-4 flex gap-2 justify-center">
      <button
        @click="showCamera('front')"
        :class="buttonClass(cameraView === 'front')"
      >
        Front Camera
      </button>
      <button
        @click="showCamera('rear')"
        :class="buttonClass(cameraView === 'rear')"
      >
        Rear Camera
      </button>
      <button
        @click="showCamera('both')"
        :class="buttonClass(cameraView === 'both')"
      >
        Show Both
      </button>
    </div>

    <!-- Camera views -->
    <div class="flex gap-4 mb-4 flex-1 w-full max-w-5xl">
      <div
        :class="cameraView === 'both' ? 'w-1/2' : 'w-full'"
        class="bg-black rounded overflow-hidden relative"
        v-show="cameraView === 'front' || cameraView === 'both'"
      >
        <video
          ref="camera1"
          autoplay
          muted
          playsinline
          controls
          class="w-full h-full object-cover"
        ></video>
      </div>

      <div
        :class="cameraView === 'both' ? 'w-1/2' : 'w-full'"
        class="bg-black rounded overflow-hidden relative"
        v-show="cameraView === 'rear' || cameraView === 'both'"
      >
        <video
          ref="camera2"
          autoplay
          muted
          playsinline
          controls
          class="w-full h-full object-cover"
        ></video>
      </div>
    </div>

    <!-- Connection status with centered UGV name -->
    <div class="mb-4 text-center text-dark">
      <p class="text-2xl font-bold mb-2">UGV Teleoperation</p>
      <p>
        Connection Status:
        <span :class="connectionStatus === 'connected' ? 'text-green-400' : 'text-red-400'" class="font-semibold">
          {{ connectionStatus }}
        </span>
      </p>
    </div>

    <!-- Movement controls (centered) -->
    <div class="flex justify-center gap-4 text-light">
      <button @click="move('forward')" class="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition font-semibold shadow-md">Forward</button>
      <button @click="move('left')" class="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition font-semibold shadow-md">Left</button>
      <button @click="move('stop')" class="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition font-semibold shadow-md">Stop</button>
      <button @click="move('right')" class="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition font-semibold shadow-md">Right</button>
      <button @click="move('backward')" class="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition font-semibold shadow-md">Backward</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const camera1 = ref(null)
const camera2 = ref(null)
const connectionStatus = ref('disconnected')
const cameraView = ref('front')

function showCamera(view) {
  cameraView.value = view
}

function move(direction) {
  console.log('Move command:', direction)
}

function setupVideos() {
  if (camera1.value) {
    camera1.value.src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    camera1.value.load()
    setTimeout(() => camera1.value.play(), 100)
  }

  if (camera2.value) {
    camera2.value.src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
    camera2.value.load()
    setTimeout(() => camera2.value.play(), 100)
  }
}

function buttonClass(active) {
  return [
    'px-5 py-2 rounded font-semibold transition',
    active
      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
      : 'bg-gray-700 hover:bg-gray-600 text-gray-300',
  ].join(' ')
}

onMounted(() => {
  connectionStatus.value = 'connected'
  setupVideos()
})

watch(cameraView, (newView) => {
  setTimeout(() => {
    if ((newView === 'front' || newView === 'both') && camera1.value) {
      camera1.value.play()
    }
    if ((newView === 'rear' || newView === 'both') && camera2.value) {
      camera2.value.play()
    }
  }, 300)
})
</script>

<style scoped>
video {
  height: 100%;
}
</style>
