<template>
  <div class="space-y-3">
    <!-- Camera preview -->
    <div class="relative rounded-2xl overflow-hidden bg-black aspect-video">
      <video ref="videoRef" class="w-full h-full object-cover" />

      <!-- Scan overlay -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div class="w-48 h-24 border-2 border-primary rounded-xl relative">
          <!-- Corner marks -->
          <div class="absolute -top-0.5 -left-0.5 w-4 h-4 border-t-4 border-l-4 border-primary rounded-tl-lg" />
          <div class="absolute -top-0.5 -right-0.5 w-4 h-4 border-t-4 border-r-4 border-primary rounded-tr-lg" />
          <div class="absolute -bottom-0.5 -left-0.5 w-4 h-4 border-b-4 border-l-4 border-primary rounded-bl-lg" />
          <div class="absolute -bottom-0.5 -right-0.5 w-4 h-4 border-b-4 border-r-4 border-primary rounded-br-lg" />
          <!-- Scan line animation -->
          <div class="scan-line" />
        </div>
      </div>

      <!-- Status badge -->
      <div class="absolute top-3 left-3 right-3 flex justify-between items-center">
        <span class="bg-black/60 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full animate-pulse"
            :class="scanning ? 'bg-green-400' : 'bg-red-400'" />
          {{ scanning ? 'Scanning...' : 'Memulai kamera...' }}
        </span>
        <button @click="$emit('close')"
          class="bg-black/60 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors">
          <XMarkIcon class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Camera selector (if multiple cameras) -->
    <div v-if="cameras.length > 1">
      <select v-model="selectedCamera" @change="switchCamera" class="input text-sm">
        <option v-for="cam in cameras" :key="cam.deviceId" :value="cam.deviceId">
          {{ cam.label || `Kamera ${cameras.indexOf(cam) + 1}` }}
        </option>
      </select>
    </div>

    <!-- Error -->
    <div v-if="error" class="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
      <ExclamationCircleIcon class="w-4 h-4 shrink-0" />
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { XMarkIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['scanned', 'close'])

const videoRef      = ref(null)
const scanning      = ref(false)
const error         = ref('')
const cameras       = ref([])
const selectedCamera = ref('')

let reader   = null
let controls = null

onMounted(async () => {
  reader = new BrowserMultiFormatReader()
  try {
    const devices = await BrowserMultiFormatReader.listVideoInputDevices()
    cameras.value = devices

    // Prefer back camera on mobile
    const backCam = devices.find(d => /back|rear|environment/i.test(d.label))
    selectedCamera.value = backCam?.deviceId || devices[0]?.deviceId || ''

    await startScan()
  } catch (e) {
    error.value = 'Tidak bisa mengakses kamera. Pastikan izin kamera sudah diberikan.'
  }
})

onUnmounted(() => stopScan())

async function startScan() {
  if (!selectedCamera.value) return
  scanning.value = true
  error.value    = ''
  try {
    controls = await reader.decodeFromVideoDevice(
      selectedCamera.value,
      videoRef.value,
      (result, err) => {
        if (result) {
          emit('scanned', result.getText())
          stopScan()
        }
      }
    )
  } catch (e) {
    error.value    = 'Gagal memulai scanner.'
    scanning.value = false
  }
}

async function switchCamera() {
  stopScan()
  await startScan()
}

function stopScan() {
  controls?.stop()
  scanning.value = false
}
</script>

<style scoped>
.scan-line {
  position: absolute;
  left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #F4A6C5, transparent);
  animation: scan 1.5s ease-in-out infinite;
}
@keyframes scan {
  0%   { top: 0; }
  50%  { top: calc(100% - 2px); }
  100% { top: 0; }
}
</style>
