<template>
  <div>
    <div class="mb-6">
      <h2 class="font-poppins font-bold text-2xl text-dark">Booking Saya</h2>
      <p class="text-gray-400 text-sm mt-1">Riwayat dan jadwal kelas kamu</p>
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="i in 4" :key="i" class="card animate-pulse h-20 bg-pink-50" />
    </div>

    <div v-else-if="!bookings.length" class="card text-center py-16">
      <CalendarDaysIcon class="w-14 h-14 text-pink-200 mx-auto mb-3" />
      <p class="text-gray-400 font-medium">Belum ada booking</p>
      <RouterLink to="/classes" class="text-secondary text-sm font-semibold hover:underline mt-2 inline-block">
        Cari kelas sekarang
      </RouterLink>
    </div>

    <div v-else class="space-y-3">
      <div v-for="b in bookings" :key="b.id"
        class="card flex items-center justify-between hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4">
          <div class="w-11 h-11 rounded-xl bg-pink-100 flex items-center justify-center shrink-0">
            <SparklesIcon class="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p class="font-semibold text-dark text-sm">{{ b.fitness_class?.name }}</p>
            <div class="flex items-center gap-3 mt-1">
              <span class="flex items-center gap-1 text-xs text-gray-400">
                <ClockIcon class="w-3 h-3" />
                {{ formatDate(b.fitness_class?.schedule_at) }}
              </span>
              <span class="flex items-center gap-1 text-xs text-gray-400">
                <MapPinIcon class="w-3 h-3" />
                {{ b.fitness_class?.location }}
              </span>
            </div>
            <p class="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <UserIcon class="w-3 h-3" />
              {{ b.fitness_class?.instructor?.name }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <span :class="`badge-${b.status}`">{{ b.status }}</span>
          <button v-if="b.status === 'confirmed'" @click="cancel(b)"
            class="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors">
            <XCircleIcon class="w-3.5 h-3.5" />
            Batalkan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useToast } from '@/composables/useToast'
import {
  CalendarDaysIcon, SparklesIcon, ClockIcon,
  MapPinIcon, UserIcon, XCircleIcon,
} from '@heroicons/vue/24/outline'

const bookings = ref([])
const loading  = ref(true)
const toast    = useToast()

onMounted(async () => {
  const { data } = await api.get('/my-bookings')
  bookings.value = data
  loading.value  = false
})

async function cancel(booking) {
  if (!confirm('Batalkan booking ini?')) return
  try {
    await api.delete(`/classes/${booking.class_id}/book`)
    booking.status = 'cancelled'
    toast.success('Booking berhasil dibatalkan.')
  } catch (e) {
    toast.apiError(e, 'Gagal membatalkan booking.')
  }
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-'
</script>
