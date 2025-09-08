//WebRTC.vue
<template>
  <div class="webrtc-container">
    <h2>📡 Robot Camera WebRTC Stream</h2>
    
    <!-- Connection Status -->
    <div class="status-panel">
      <div class="status-item">
        <span class="label">WebSocket:</span>
        <span :class="['status', wsConnected ? 'connected' : 'disconnected']">
          {{ wsConnected ? '✅ Connected' : '❌ Disconnected' }}
        </span>
      </div>
      <div class="status-item">
        <span class="label">WebRTC:</span>
        <span :class="['status', connectionState]">
          {{ getConnectionStatusText() }}
        </span>
      </div>
      <!--
      <div class="status-item">
        <span class="label">ROS2 Topic:</span>
        <span class="topic">/zed2i/zed_node/right/image_rect_color</span>
      </div>
      -->
    </div>
    </div>

    <!-- Video Stream -->
    <div class="video-container">
      <video 
        ref="videoRef" 
        autoplay 
        playsinline 
        controls 
        muted
        class="video-stream"
        :class="{ 'streaming': isStreaming }"
      ></video>
      
      <div v-if="!isStreaming" class="video-placeholder">
        <div class="placeholder-content">
          <div class="camera-icon">📹</div>
          <p>Click "Start Stream" to begin</p>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="controls">
      <button 
        @click="startConnection" 
        :disabled="connected || connecting"
        class="btn primary"
      >
        <span v-if="connecting">🔄 Connecting...</span>
        <span v-else>▶️ Start Stream</span>
      </button>
      
      <button 
        @click="stopConnection" 
        :disabled="!connected"
        class="btn secondary"
      >
        ⏹️ Stop Stream
      </button>
      
      <!-- <button 
        @click="toggleTestSource" 
        :disabled="!connected"
        class="btn tertiary"
      >
        {{ useTestSource ? '📹 Use ROS Camera' : '🎾 Use Test Pattern' }}
      </button> -->
    </div>

    <!-- Debug Info -->
    <!-- <div v-if="showDebug" class="debug-panel">
      <h4>🔧 Debug Information</h4>
      <div class="debug-item">
        <strong>ICE Connection State:</strong> {{ iceConnectionState }}
      </div>
      <div class="debug-item">
        <strong>Signaling State:</strong> {{ signalingState }}
      </div>
      <div class="debug-item">
        <strong>Messages Received:</strong> {{ messageCount }}
      </div>
    </div>

    <button @click="showDebug = !showDebug" class="debug-toggle">
      {{ showDebug ? 'Hide Debug' : 'Show Debug' }}
    </button>
   -->
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'

const videoRef = ref(null)
const connected = ref(false)
const connecting = ref(false)
const wsConnected = ref(false)
const isStreaming = ref(false)
const connectionState = ref('new')
const iceConnectionState = ref('new')
const signalingState = ref('stable')
const messageCount = ref(0)
const showDebug = ref(false)
const useTestSource = ref(false)

let pc = null
let ws = null

// Update this with your robot's IP address
const SIGNALING_SERVER = "ws://192.168.100.5:8765"

function getConnectionStatusText() {
  const stateMap = {
    'new': '⚪ New',
    'connecting': '🔄 Connecting',
    'connected': '✅ Connected', 
    'disconnected': '⚠️ Disconnected',
    'failed': '❌ Failed',
    'closed': '⭕ Closed'
  }
  return stateMap[connectionState.value] || `❓ ${connectionState.value}`
}

function startConnection() {
  if (connected.value || connecting.value) return

  console.log("🌐 Connecting to signaling server:", SIGNALING_SERVER)
  connecting.value = true
  
  ws = new WebSocket(SIGNALING_SERVER)

  ws.onopen = () => {
    console.log("✅ Connected to signaling server")
    wsConnected.value = true
    connecting.value = false
  }

  ws.onclose = () => {
    console.warn("⚠️ WebSocket closed")
    wsConnected.value = false
    connected.value = false
    connecting.value = false
    isStreaming.value = false
  }

  ws.onerror = (err) => {
    console.error("❌ WebSocket error:", err)
    connecting.value = false
  }

  ws.onmessage = async (event) => {
    try {
      const msg = JSON.parse(event.data)
      console.log("📩 Received message:", msg.type)
      messageCount.value++

      if (msg.type === "offer") {
        console.log("📡 Handling offer from robot")
        await handleOffer(msg.sdp)
      } else if (msg.type === "ice") {
        console.log("🔹 Adding ICE candidate from robot")
        if (pc) {
          await pc.addIceCandidate(new RTCIceCandidate({
            candidate: msg.candidate,
            sdpMLineIndex: msg.sdpMLineIndex
          }))
          console.log("✅ ICE candidate added")
        }
      } else {
        console.warn("⚠️ Unknown message type:", msg.type)
      }
    } catch (err) {
      console.error("❌ Failed to parse WebSocket message:", err)
    }
  }

  createPeerConnection()
}

function stopConnection() {
  if (pc) {
    pc.close()
    pc = null
  }
  if (ws) {
    ws.close()
    ws = null
  }
  
  connected.value = false
  wsConnected.value = false
  isStreaming.value = false
  connectionState.value = 'closed'
  iceConnectionState.value = 'closed'
  
  if (videoRef.value) {
    videoRef.value.srcObject = null
  }
  
  console.log("🔌 Connection stopped")
}

function createPeerConnection() {
  pc = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" }
    ]
  })

  pc.onicecandidate = (event) => {
    if (event.candidate && ws && ws.readyState === WebSocket.OPEN) {
      console.log("🔹 Sending ICE candidate to robot")
      ws.send(JSON.stringify({
        type: "ice",
        candidate: event.candidate.candidate,
        sdpMLineIndex: event.candidate.sdpMLineIndex
      }))
    }
  }

  pc.ontrack = (event) => {
    console.log("🎥 Remote stream received")
    if (videoRef.value && event.streams[0]) {
      videoRef.value.srcObject = event.streams[0]
      isStreaming.value = true
    }
  }

  pc.onconnectionstatechange = () => {
    connectionState.value = pc.connectionState
    console.log("📶 PeerConnection state:", pc.connectionState)
    
    if (pc.connectionState === 'connected') {
      isStreaming.value = true
    } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
      isStreaming.value = false
    }
  }

  pc.oniceconnectionstatechange = () => {
    iceConnectionState.value = pc.iceConnectionState
    console.log("❄️ ICE connection state:", pc.iceConnectionState)
  }

  pc.onsignalingstatechange = () => {
    signalingState.value = pc.signalingState
    console.log("📡 Signaling state:", pc.signalingState)
  }

  connected.value = true
}

async function handleOffer(sdp) {
  if (!pc) return
  
  console.log("📡 Setting remote description")
  const desc = { type: "offer", sdp: sdp }
  await pc.setRemoteDescription(desc)
  console.log("✅ Remote description set")

  console.log("📡 Creating local answer")
  const answer = await pc.createAnswer()
  await pc.setLocalDescription(answer)
  console.log("✅ Local description (answer) set")

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: "answer",
      sdp: answer.sdp
    }))
    console.log("📤 Answer sent to robot")
  }
}

function toggleTestSource() {
  if (!ws || ws.readyState !== WebSocket.OPEN) return
  
  useTestSource.value = !useTestSource.value
  ws.send(JSON.stringify({
    type: "test_source",
    enable: useTestSource.value
  }))
  
  console.log(`🎾 Switched to ${useTestSource.value ? 'test pattern' : 'ROS camera'}`)
}

// Cleanup on component unmount
onBeforeUnmount(() => {
  stopConnection()
})
</script>

<style scoped>
.webrtc-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.status-panel {
  display: flex;
  gap: 20px;
  margin: 20px 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  flex-wrap: wrap;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  font-weight: 600;
  color: #495057;
}

.status.connected {
  color: #28a745;
}

.status.disconnected {
  color: #dc3545;
}

.topic {
  font-family: 'Monaco', 'Menlo', monospace;
  background: #e9ecef;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
}

.video-container {
  position: relative;
  margin: 20px 0;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  aspect-ratio: 16/9;  /* Match ZED2i 640x360 aspect ratio */
  min-height: 360px;
}

.video-stream {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: none;
}

.video-stream.streaming {
  border: 3px solid #28a745;
}

.video-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.placeholder-content {
  text-align: center;
}

.camera-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.controls {
  display: flex;
  gap: 12px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn.primary {
  background: #007bff;
  color: white;
}

.btn.primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn.secondary {
  background: #6c757d;
  color: white;
}

.btn.secondary:hover:not(:disabled) {
  background: #545b62;
}

.btn.tertiary {
  background: #17a2b8;
  color: white;
}

.btn.tertiary:hover:not(:disabled) {
  background: #138496;
}

.debug-panel {
  margin: 20px 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #17a2b8;
}

.debug-item {
  margin: 8px 0;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.9em;
}

.debug-toggle {
  margin-top: 10px;
  padding: 8px 16px;
  background: #e9ecef;
  border: 1px solid #ced4da;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.debug-toggle:hover {
  background: #dee2e6;
}

@media (max-width: 768px) {
  .status-panel {
    flex-direction: column;
    gap: 10px;
  }
  
  .controls {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>