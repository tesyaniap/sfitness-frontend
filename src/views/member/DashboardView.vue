<template>
  <div>
    <div class="mb-8">
      <h2 class="font-poppins font-bold text-2xl text-dark">Halo, {{ auth.user?.name?.split(' ')[0] }} 👋</h2>
      <p class="text-gray-400 text-sm mt-1">Semangat hari ini!</p>
    </div>

    <!-- Skeleton -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div v-for="i in 3" :key="i" class="card animate-pulse h-24 bg-pink-50" />
    </div>

    <template v-else>
      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div class="card flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center shrink-0">
            <CalendarDaysIcon class="w-6 h-6 text-secondary" />
          </div>
          <div>
            <p class="text-2xl font-bold text-dark">{{ stats.total_bookings }}</p>
            <p class="text-xs text-gray-400 mt-0.5">Total Booking</p>
          </div>
        </div>
        <div class="card flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center shrink-0">
            <ShoppingBagIcon class="w-6 h-6 text-secondary" />
          </div>
          <div>
            <p class="text-2xl font-bold text-dark">{{ stats.total_transactions }}</p>
            <p class="text-xs text-gray-400 mt-0.5">Transaksi</p>
          </div>
        </div>
        <div class="card flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center shrink-0">
            <BanknotesIcon class="w-6 h-6 text-secondary" />
          </div>
          <div>
            <p class="text-xl font-bold text-dark">{{ formatRp(stats.total_spent) }}</p>
            <p class="text-xs text-gray-400 mt-0.5">Total Belanja</p>
          </div>
        </div>
      </div>

      <!-- Upcoming Bookings -->
      <div class="card">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-semibold text-dark flex items-center gap-2">
            <CalendarDaysIcon class="w-5 h-5 text-secondary" />
            Kelas Mendatang
          </h3>
          <RouterLink to="/classes" class="text-xs text-secondary hover:underline font-medium">Lihat semua</RouterLink>
        </div>

        <div v-if="!stats.upcoming_bookings?.length" class="text-center py-10">
          <CalendarDaysIcon class="w-12 h-12 text-pink-200 mx-auto mb-3" />
          <p class="text-gray-400 text-sm">Belum ada booking.</p>
          <RouterLink to="/classes" class="text-secondary text-sm font-semibold hover:underline mt-1 inline-block">Cari kelas sekarang</RouterLink>
        </div>

        <div v-else class="space-y-3">
          <div v-for="b in stats.upcoming_bookings" :key="b.id"
            class="flex items-center justify-between p-4 bg-pink-50/60 rounded-2xl border border-pink-100">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-white border border-pink-100 flex items-center justify-center shrink-0">
                <SparklesIcon class="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p class="font-semibold text-sm text-dark">{{ b.fitness_class?.name }}</p>
                <p class="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <ClockIcon class="w-3 h-3" />
                  {{ formatDate(b.fitness_class?.schedule_at) }}
                </p>
              </div>
            </div>
            <span class="badge-confirmed">Confirmed</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import {
  CalendarDaysIcon, ShoppingBagIcon, BanknotesIcon,
  SparklesIcon, ClockIcon,
} from '@heroicons/vue/24/outline'

const auth    = useAuthStore()
const stats   = ref({})
const loading = ref(true)

onMounted(async () => {
  const { data } = await api.get('/dashboard/member')
  stats.value    = data
  loading.value  = false
})

const formatRp   = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v || 0)
const formatDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-'
</script>
