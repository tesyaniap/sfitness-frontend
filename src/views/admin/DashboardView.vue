<template>
  <div>
    <div class="mb-8">
      <h2 class="font-poppins font-bold text-2xl text-dark">Dashboard</h2>
      <p class="text-gray-400 text-sm mt-1">Ringkasan aktivitas S-Fitness hari ini</p>
    </div>

    <div v-if="loading" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="i in 4" :key="i" class="card animate-pulse h-28 bg-pink-50" />
    </div>

    <template v-else>
      <!-- Stat Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div v-for="stat in statCards" :key="stat.label"
          class="card flex items-center gap-4 hover:shadow-md transition-shadow">
          <div :class="`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center shrink-0`">
            <component :is="stat.icon" :class="`w-6 h-6 ${stat.color}`" />
          </div>
          <div>
            <p class="text-xl font-bold text-dark">{{ stat.value }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ stat.label }}</p>
          </div>
        </div>
      </div>

      <!-- Bottom row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="card">
          <div class="flex items-center gap-2 mb-3">
            <BanknotesIcon class="w-5 h-5 text-secondary" />
            <h3 class="font-semibold text-dark">Revenue Bulan Ini</h3>
          </div>
          <p class="text-2xl font-bold text-secondary">{{ formatRp(stats.revenue_this_month) }}</p>
          <p class="text-xs text-gray-400 mt-1">Total pendapatan kantin</p>
        </div>

        <div class="card">
          <div class="flex items-center gap-2 mb-3">
            <ExclamationTriangleIcon class="w-5 h-5 text-amber-500" />
            <h3 class="font-semibold text-dark">Stok Menipis</h3>
          </div>
          <div v-if="!stats.low_stock_products?.length" class="flex items-center gap-2 text-sm text-green-600">
            <CheckCircleIcon class="w-4 h-4" />
            Semua stok aman
          </div>
          <div v-else class="space-y-2">
            <div v-for="p in stats.low_stock_products" :key="p.id"
              class="flex justify-between items-center text-sm">
              <span class="text-gray-600">{{ p.name }}</span>
              <span class="text-red-500 font-semibold bg-red-50 px-2 py-0.5 rounded-lg text-xs">{{ p.stock }} sisa</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import {
  UsersIcon, CalendarDaysIcon, ClipboardDocumentListIcon,
  BanknotesIcon, ExclamationTriangleIcon, CheckCircleIcon,
} from '@heroicons/vue/24/outline'

const stats   = ref({})
const loading = ref(true)

onMounted(async () => {
  const { data } = await api.get('/dashboard/admin')
  stats.value    = data
  loading.value  = false
})

const statCards = computed(() => [
  { label: 'Total Member',      value: stats.value.total_members,   icon: UsersIcon,                    bg: 'bg-pink-100',   color: 'text-secondary' },
  { label: 'Kelas Aktif',       value: stats.value.total_classes,   icon: CalendarDaysIcon,             bg: 'bg-purple-100', color: 'text-purple-500' },
  { label: 'Booking Hari Ini',  value: stats.value.bookings_today,  icon: ClipboardDocumentListIcon,    bg: 'bg-blue-100',   color: 'text-blue-500' },
  { label: 'Revenue Hari Ini',  value: formatRp(stats.value.revenue_today), icon: BanknotesIcon,        bg: 'bg-green-100',  color: 'text-green-600' },
])

const formatRp = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v || 0)
</script>
