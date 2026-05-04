<template>
  <div class="max-w-lg">
    <div class="mb-6">
      <h2 class="font-poppins font-bold text-2xl text-dark">Profil Saya</h2>
      <p class="text-gray-400 text-sm mt-1">Kelola informasi akun kamu</p>
    </div>

    <div class="card">
      <!-- Avatar -->
      <div class="flex items-center gap-4 mb-6 pb-6 border-b border-pink-100">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-pink-200">
          {{ auth.user?.name?.charAt(0)?.toUpperCase() }}
        </div>
        <div>
          <p class="font-semibold text-lg text-dark">{{ auth.user?.name }}</p>
          <p class="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
            <EnvelopeIcon class="w-3.5 h-3.5" />
            {{ auth.user?.email }}
          </p>
          <span class="text-xs bg-pink-100 text-secondary font-semibold px-2.5 py-0.5 rounded-full mt-1 inline-block capitalize">
            {{ auth.user?.role }}
          </span>
        </div>
      </div>

      <form @submit.prevent="save" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-dark mb-1.5">Nama Lengkap</label>
          <div class="relative">
            <UserIcon class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input v-model="form.name" type="text" class="input pl-10" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-dark mb-1.5">No. HP</label>
          <div class="relative">
            <PhoneIcon class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input v-model="form.phone" type="tel" class="input pl-10" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-dark mb-1.5">Tanggal Lahir</label>
          <div class="relative">
            <CalendarDaysIcon class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input v-model="form.birth_date" type="date" class="input pl-10" />
          </div>
        </div>

        <div v-if="msg"
          :class="msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'"
          class="flex items-center gap-2 text-sm px-4 py-3 rounded-xl">
          <CheckCircleIcon v-if="msg.type === 'success'" class="w-4 h-4 shrink-0" />
          <ExclamationCircleIcon v-else class="w-4 h-4 shrink-0" />
          {{ msg.text }}
        </div>

        <button type="submit" class="btn-primary flex items-center gap-2" :disabled="saving">
          <ArrowPathIcon v-if="saving" class="w-4 h-4 animate-spin" />
          <CheckIcon v-else class="w-4 h-4" />
          {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import { useToast } from '@/composables/useToast'
import {
  UserIcon, EnvelopeIcon, PhoneIcon, CalendarDaysIcon,
  CheckCircleIcon, ExclamationCircleIcon, ArrowPathIcon, CheckIcon,
} from '@heroicons/vue/24/outline'

const auth   = useAuthStore()
const saving = ref(false)
const msg    = ref(null)
const toast  = useToast()

const form = ref({
  name:       auth.user?.name || '',
  phone:      auth.user?.phone || '',
  birth_date: auth.user?.birth_date || '',
})

async function save() {
  saving.value = true
  msg.value    = null
  try {
    const { data } = await api.patch('/profile', form.value)
    auth.user = data
    localStorage.setItem('user', JSON.stringify(data))
    msg.value = { type: 'success', text: 'Profil berhasil diperbarui!' }
    toast.success('Profil berhasil diperbarui!')
  } catch {
    msg.value = { type: 'error', text: 'Gagal menyimpan.' }
    toast.error('Gagal menyimpan profil.')
  } finally {
    saving.value = false
  }
}
</script>
