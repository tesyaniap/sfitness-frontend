<template>
  <div>
    <div class="mb-6">
      <h2 class="font-poppins font-bold text-2xl text-dark">Riwayat Pembelian</h2>
      <p class="text-gray-400 text-sm mt-1">Semua transaksi kantin kamu</p>
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="i in 4" :key="i" class="card animate-pulse h-28 bg-pink-50" />
    </div>

    <div v-else-if="!transactions.length" class="card text-center py-16">
      <ReceiptRefundIcon class="w-14 h-14 text-pink-200 mx-auto mb-3" />
      <p class="text-gray-400 font-medium">Belum ada transaksi</p>
    </div>

    <div v-else class="space-y-3">
      <div v-for="t in transactions" :key="t.id" class="card hover:shadow-md transition-shadow">
        <div class="flex justify-between items-start mb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center shrink-0">
              <ReceiptRefundIcon class="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p class="font-semibold text-sm text-dark font-mono">{{ t.invoice_number }}</p>
              <p class="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <CalendarDaysIcon class="w-3 h-3" />
                {{ formatDate(t.created_at) }}
              </p>
            </div>
          </div>
          <span :class="`badge-${t.status}`">{{ t.status }}</span>
        </div>

        <div class="bg-pink-50/50 rounded-xl p-3 space-y-1.5">
          <div v-for="item in t.items" :key="item.id" class="flex justify-between text-sm">
            <span class="text-gray-600">{{ item.product?.name }} <span class="text-gray-400">x{{ item.quantity }}</span></span>
            <span class="font-medium text-dark">{{ formatRp(item.subtotal) }}</span>
          </div>
        </div>

        <div class="flex justify-between items-center mt-3 pt-3 border-t border-pink-100">
          <span class="text-sm text-gray-500 flex items-center gap-1">
            <BanknotesIcon class="w-4 h-4" />
            Total
          </span>
          <span class="font-bold text-secondary">{{ formatRp(t.total_amount) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { ReceiptRefundIcon, CalendarDaysIcon, BanknotesIcon } from '@heroicons/vue/24/outline'

const transactions = ref([])
const loading      = ref(true)

onMounted(async () => {
  const { data } = await api.get('/transactions')
  transactions.value = data.data || data
  loading.value      = false
})

const formatRp   = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)
const formatDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'
</script>
