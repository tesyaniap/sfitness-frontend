<template>
  <div>
    <div class="mb-6">
      <h2 class="font-poppins font-bold text-2xl text-dark">Transaksi Kantin</h2>
      <p class="text-gray-400 text-sm mt-1">Riwayat semua transaksi pembelian</p>
    </div>

    <div v-if="loading" class="card animate-pulse h-48 bg-pink-50" />
    <div v-else class="card overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-pink-100 text-left text-xs text-gray-400 uppercase tracking-wide">
            <th class="pb-3 pr-4 font-medium">Invoice</th>
            <th class="pb-3 pr-4 font-medium">Member</th>
            <th class="pb-3 pr-4 font-medium">Total</th>
            <th class="pb-3 pr-4 font-medium">Status</th>
            <th class="pb-3 font-medium">Tanggal</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-pink-50">
          <tr v-for="t in transactions" :key="t.id" class="hover:bg-pink-50/40 transition-colors">
            <td class="py-3.5 pr-4">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center shrink-0">
                  <ReceiptRefundIcon class="w-4 h-4 text-secondary" />
                </div>
                <span class="font-mono text-xs text-gray-600">{{ t.invoice_number }}</span>
              </div>
            </td>
            <td class="py-3.5 pr-4">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xs shrink-0">
                  {{ t.user?.name?.charAt(0)?.toUpperCase() }}
                </div>
                <span class="text-dark">{{ t.user?.name }}</span>
              </div>
            </td>
            <td class="py-3.5 pr-4 font-bold text-secondary">{{ formatRp(t.total_amount) }}</td>
            <td class="py-3.5 pr-4"><span :class="`badge-${t.status}`">{{ t.status }}</span></td>
            <td class="py-3.5 text-gray-400 flex items-center gap-1.5">
              <CalendarDaysIcon class="w-3.5 h-3.5" />
              {{ formatDate(t.created_at) }}
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!transactions.length" class="text-center py-12">
        <ReceiptRefundIcon class="w-12 h-12 text-pink-200 mx-auto mb-3" />
        <p class="text-gray-400 text-sm">Belum ada transaksi</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { ReceiptRefundIcon, CalendarDaysIcon } from '@heroicons/vue/24/outline'

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
