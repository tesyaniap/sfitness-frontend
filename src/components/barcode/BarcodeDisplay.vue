<template>
  <div v-if="value" class="flex flex-col items-center gap-2">
    <svg ref="svgRef" class="max-w-full" />
    <p class="text-xs text-gray-400 font-mono tracking-widest">{{ value }}</p>
  </div>
  <div v-else class="flex flex-col items-center justify-center py-4 text-gray-300">
    <QrCodeIcon class="w-10 h-10 mb-1" />
    <p class="text-xs">Masukkan kode barcode</p>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import JsBarcode from 'jsbarcode'
import { QrCodeIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  value:  { type: String, default: '' },
  format: { type: String, default: 'CODE128' },
})

const svgRef = ref(null)

watch(() => props.value, async (val) => {
  if (!val) return
  await nextTick()
  try {
    JsBarcode(svgRef.value, val, {
      format:      props.format,
      lineColor:   '#4A4A4A',
      width:       2,
      height:      60,
      displayValue: false,
      margin:      8,
    })
  } catch {
    // invalid barcode value — ignore
  }
}, { immediate: true })
</script>
