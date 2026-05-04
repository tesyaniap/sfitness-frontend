<template>
  <div class="min-h-screen bg-gradient-to-br from-highlight via-white to-pink-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Card -->
      <div class="bg-white rounded-3xl shadow-xl shadow-pink-100 p-8">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-200">
            <HeartIcon class="w-8 h-8 text-white" />
          </div>
          <h1 class="font-poppins font-bold text-2xl text-dark">Selamat Datang</h1>
          <p class="text-gray-400 text-sm mt-1">Masuk ke akun S-Fitness kamu</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-dark mb-1.5">Email</label>
            <div class="relative">
              <EnvelopeIcon class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input v-model="form.email" type="email" class="input pl-10" placeholder="email@example.com" required />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-dark mb-1.5">Password</label>
            <div class="relative">
              <LockClosedIcon class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input v-model="form.password" type="password" class="input pl-10" placeholder="••••••••" required />
            </div>
          </div>

          <!-- Error -->
          <div v-if="error" class="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
            <ExclamationCircleIcon class="w-4 h-4 shrink-0" />
            {{ error }}
          </div>

          <button type="submit" class="btn-primary w-full flex items-center justify-center gap-2 mt-2" :disabled="loading">
            <ArrowPathIcon v-if="loading" class="w-4 h-4 animate-spin" />
            {{ loading ? 'Memproses...' : 'Masuk' }}
          </button>
        </form>

        <p class="text-center text-sm text-gray-400 mt-6">
          Belum punya akun?
          <RouterLink to="/register" class="text-secondary font-semibold hover:underline">Daftar sekarang</RouterLink>
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
  HeartIcon, EnvelopeIcon, LockClosedIcon,
  ExclamationCircleIcon, ArrowPathIcon,
} from '@heroicons/vue/24/outline'

const auth   = useAuthStore()
const router = useRouter()
const toast  = useToast()

const form    = ref({ email: '', password: '' })
const error   = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value   = ''
  loading.value = true
  try {
    await auth.login(form.value)
    toast.success('Selamat datang kembali! 👋')
    router.push(auth.isAdmin ? '/admin' : '/dashboard')
  } catch (e) {
    error.value = e.response?.data?.message || 'Login gagal.'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}
</script>
