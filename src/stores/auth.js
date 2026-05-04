import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user  = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref(localStorage.getItem('token') || null)

  const isLoggedIn    = computed(() => !!token.value)
  const isMember      = computed(() => user.value?.role === 'member')
  const isAdmin       = computed(() => ['admin', 'super_admin'].includes(user.value?.role))
  const isSuperAdmin  = computed(() => user.value?.role === 'super_admin')

  async function login(credentials) {
    const { data } = await api.post('/login', credentials)
    setAuth(data)
  }

  async function register(payload) {
    const { data } = await api.post('/register', payload)
    setAuth(data)
  }

  async function logout() {
    await api.post('/logout').catch(() => {})
    clearAuth()
  }

  function setAuth({ user: u, token: t }) {
    user.value  = u
    token.value = t
    localStorage.setItem('user', JSON.stringify(u))
    localStorage.setItem('token', t)
  }

  function clearAuth() {
    user.value  = null
    token.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return { user, token, isLoggedIn, isMember, isAdmin, isSuperAdmin, login, register, logout }
})
