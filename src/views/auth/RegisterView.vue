<template>
  <div class="min-h-screen bg-gradient-to-br from-highlight via-white to-pink-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-3xl shadow-xl shadow-pink-100 p-8">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-200">
            <HeartIcon class="w-8 h-8 text-white" />
          </div>
          <h1 class="font-poppins font-bold text-2xl text-dark">Buat Akun</h1>
          <p class="text-gray-400 text-sm mt-1">Bergabung dengan komunitas S-Fitness</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-dark mb-1.5">Nama Lengkap</label>
            <div class="relative">
              <UserIcon class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input v-model="form.name" type="text" class="input pl-10" placeholder="Nama kamu" required />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-dark mb-1.5">Email</label>
            <div class="relative">
              <EnvelopeIcon class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input v-model="form.email" type="email" class="input pl-10" placeholder="email@example.com" required />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-dark mb-1.5">No. HP</label>
            <div class="relative">
              <PhoneIcon class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input v-model="form.phone" type="tel" class="input pl-10" placeholder="08xxxxxxxxxx" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-dark mb-1.5">Password</label>
            <div class="relative">
              <LockClosedIcon class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input v-model="form.password" type="password" class="input pl-10" placeholder="Min. 8 karakter" required />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-dark mb-1.5">Konfirmasi Password</label>
            <div class="relative">
              <LockClosedIcon class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input v-model="form.password_confirmation" type="password" class="input pl-10" placeholder="Ulangi password" required />
            </div>
          </div>

          <div v-if="error" class="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
            <ExclamationCircleIcon class="w-4 h-4 shrink-0" />
            {{ error }}
          </div>

          <button type="submit" class="btn-primary w-full flex items-center justify-center gap-2 mt-2" :disabled="loading">
            <ArrowPathIcon v-if="loading" class="w-4 h-4 animate-spin" />
            {{ loading ? 'Memproses...' : 'Daftar Sekarang' }}
          </button>
        </form>

        <p class="text-center text-sm text-gray-400 mt-6">
          Sudah punya akun?
          <RouterLink to="/login" class="text-secondary font-semibold hover:underline">Masuk</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import {
  HeartIcon, UserIcon, EnvelopeIcon, PhoneIcon,
  LockClosedIcon, ExclamationCircleIcon, ArrowPathIcon,
} from '@heroicons/vue/24/outline'

const auth   = useAuthStore()
const router = useRouter()
const toast  = useToast()

const form    = ref({ name: '', email: '', phone: '', password: '', password_confirmation: '' })
const error   = ref('')
const loading = ref(false)

async function handleRegister() {
  error.value   = ''
  loading.value = true
  try {
    await auth.register(form.value)
    toast.success('Akun berhasil dibuat! Selamat bergabung 🌸')
    router.push('/dashboard')
  } catch (e) {
    const errors = e.response?.data?.errors
    error.value  = errors ? Object.values(errors).flat()[0] : 'Registrasi gagal.'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}
</script>
