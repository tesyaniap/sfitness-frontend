<template>
  <div>
    <div class="mb-6">
      <h2 class="font-poppins font-bold text-2xl text-dark">Manajemen Member</h2>
      <p class="text-gray-400 text-sm mt-1">Kelola akun member S-Fitness</p>
    </div>

    <div class="card mb-4">
      <div class="relative max-w-sm">
        <MagnifyingGlassIcon class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input v-model="search" class="input pl-10" placeholder="Cari nama atau email..." />
      </div>
    </div>

    <div v-if="loading" class="card animate-pulse h-48 bg-pink-50" />
    <div v-else class="card overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-pink-100 text-left text-xs text-gray-400 uppercase tracking-wide">
            <th class="pb-3 pr-4 font-medium">Member</th>
            <th class="pb-3 pr-4 font-medium">Email</th>
            <th class="pb-3 pr-4 font-medium">Role</th>
            <th class="pb-3 pr-4 font-medium">Status</th>
            <th class="pb-3 font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-pink-50">
          <tr v-for="u in users" :key="u.id" class="hover:bg-pink-50/40 transition-colors">
            <td class="py-3.5 pr-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xs shrink-0">
                  {{ u.name?.charAt(0)?.toUpperCase() }}
                </div>
                <span class="font-medium text-dark">{{ u.name }}</span>
              </div>
            </td>
            <td class="py-3.5 pr-4 text-gray-500">{{ u.email }}</td>
            <td class="py-3.5 pr-4">
              <span class="bg-pink-100 text-secondary text-xs font-medium px-2.5 py-1 rounded-full capitalize">
                {{ u.role.replace('_', ' ') }}
              </span>
            </td>
            <td class="py-3.5 pr-4">
              <span :class="u.is_active ? 'badge-confirmed' : 'badge-cancelled'">
                {{ u.is_active ? 'Aktif' : 'Nonaktif' }}
              </span>
            </td>
            <td class="py-3.5">
              <button @click="toggleActive(u)"
                :class="u.is_active
                  ? 'text-red-400 hover:bg-red-50'
                  : 'text-green-600 hover:bg-green-50'"
                class="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-colors">
                <component :is="u.is_active ? XCircleIcon : CheckCircleIcon" class="w-3.5 h-3.5" />
                {{ u.is_active ? 'Nonaktifkan' : 'Aktifkan' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!users.length" class="text-center py-12">
        <UsersIcon class="w-12 h-12 text-pink-200 mx-auto mb-3" />
        <p class="text-gray-400 text-sm">Tidak ada member ditemukan</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '@/services/api'
import { useToast } from '@/composables/useToast'
import { MagnifyingGlassIcon, UsersIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'

const users   = ref([])
const loading = ref(true)
const search  = ref('')
const toast   = useToast()

onMounted(() => load())
watch(search, () => load())

async function load() {
  loading.value = true
  const { data } = await api.get('/users', { params: { role: 'member', search: search.value } })
  users.value   = data.data || data
  loading.value = false
}

async function toggleActive(user) {
  try {
    await api.patch(`/users/${user.id}`, { is_active: !user.is_active })
    user.is_active = !user.is_active
    toast.success(user.is_active ? `${user.name} diaktifkan.` : `${user.name} dinonaktifkan.`)
  } catch (e) {
    toast.apiError(e, 'Gagal mengubah status member.')
  }
}
</script>
