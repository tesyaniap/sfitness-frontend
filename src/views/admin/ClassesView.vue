<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="font-poppins font-bold text-2xl text-dark">Manajemen Kelas</h2>
        <p class="text-gray-400 text-sm mt-1">Kelola jadwal kelas fitness</p>
      </div>
      <button @click="openModal()" class="btn-primary flex items-center gap-2 text-sm">
        <PlusIcon class="w-4 h-4" />
        <span class="hidden sm:inline">Tambah Kelas</span>
        <span class="sm:hidden">Tambah</span>
      </button>
    </div>

    <div v-if="loading" class="card animate-pulse h-48 bg-pink-50" />
    <div v-else class="card overflow-x-auto -mx-4 sm:mx-0 rounded-none sm:rounded-2xl">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-pink-100 text-left text-xs text-gray-400 uppercase tracking-wide">
            <th class="pb-3 pr-4 font-medium">Nama</th>
            <th class="pb-3 pr-4 font-medium">Tipe</th>
            <th class="pb-3 pr-4 font-medium">Jadwal</th>
            <th class="pb-3 pr-4 font-medium">Kuota</th>
            <th class="pb-3 pr-4 font-medium">Harga</th>
            <th class="pb-3 pr-4 font-medium">Status</th>
            <th class="pb-3 font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-pink-50">
          <tr v-for="cls in classes" :key="cls.id" class="hover:bg-pink-50/40 transition-colors">
            <td class="py-3.5 pr-4 font-medium text-dark">{{ cls.name }}</td>
            <td class="py-3.5 pr-4">
              <span class="bg-pink-100 text-secondary text-xs font-medium px-2.5 py-1 rounded-full capitalize">{{ cls.type }}</span>
            </td>
            <td class="py-3.5 pr-4 text-gray-500">{{ formatDate(cls.schedule_at) }}</td>
            <td class="py-3.5 pr-4">
              <span class="text-gray-600">{{ cls.remaining_quota }}</span>
              <span class="text-gray-400">/{{ cls.quota }}</span>
            </td>
            <td class="py-3.5 pr-4 font-medium text-secondary">{{ formatRp(cls.price) }}</td>
            <td class="py-3.5 pr-4">
              <span :class="`badge-${cls.status === 'active' ? 'confirmed' : 'cancelled'}`">{{ cls.status }}</span>
            </td>
            <td class="py-3.5">
              <div class="flex items-center gap-2">
                <button @click="openModal(cls)"
                  class="flex items-center gap-1 text-xs text-secondary hover:bg-pink-100 px-2.5 py-1.5 rounded-lg transition-colors">
                  <PencilSquareIcon class="w-3.5 h-3.5" />
                  Edit
                </button>
                <button @click="deleteClass(cls)"
                  class="flex items-center gap-1 text-xs text-red-400 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors">
                  <TrashIcon class="w-3.5 h-3.5" />
                  Hapus
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-5 border-b border-pink-100 flex items-center justify-between">
          <h3 class="font-semibold text-dark">{{ editing ? 'Edit Kelas' : 'Tambah Kelas Baru' }}</h3>
          <button @click="showModal = false" class="w-8 h-8 rounded-xl hover:bg-pink-50 flex items-center justify-center transition-colors">
            <XMarkIcon class="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <form @submit.prevent="save" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-dark mb-1.5">Nama Kelas</label>
            <input v-model="form.name" class="input" placeholder="Nama kelas" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-dark mb-1.5">Tipe</label>
            <select v-model="form.type" class="input">
              <option value="zumba">Zumba</option>
              <option value="yoga">Yoga</option>
              <option value="pilates">Pilates</option>
              <option value="aerobic">Aerobic</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-dark mb-1.5">Jadwal</label>
            <input v-model="form.schedule_at" type="datetime-local" class="input" required />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-dark mb-1.5">Durasi (menit)</label>
              <input v-model.number="form.duration_minutes" type="number" class="input" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark mb-1.5">Kuota</label>
              <input v-model.number="form.quota" type="number" class="input" required />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-dark mb-1.5">Harga</label>
              <input v-model.number="form.price" type="number" class="input" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark mb-1.5">Lokasi</label>
              <input v-model="form.location" class="input" placeholder="Studio A" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-dark mb-1.5">Deskripsi</label>
            <textarea v-model="form.description" class="input" rows="2" placeholder="Deskripsi kelas..."></textarea>
          </div>
          <div class="flex gap-3 pt-2">
            <button type="submit" class="btn-primary flex-1 flex items-center justify-center gap-2" :disabled="saving">
              <ArrowPathIcon v-if="saving" class="w-4 h-4 animate-spin" />
              {{ saving ? 'Menyimpan...' : 'Simpan' }}
            </button>
            <button type="button" @click="showModal = false" class="btn-outline flex-1">Batal</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useToast } from '@/composables/useToast'
import { PlusIcon, PencilSquareIcon, TrashIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'

const classes   = ref([])
const loading   = ref(true)
const showModal = ref(false)
const editing   = ref(null)
const saving    = ref(false)
const form      = ref({})
const toast     = useToast()

onMounted(async () => { await load(); loading.value = false })

async function load() {
  const { data } = await api.get('/classes')
  classes.value  = data
}

function openModal(cls = null) {
  editing.value   = cls
  form.value      = cls
    ? { ...cls, schedule_at: cls.schedule_at?.slice(0, 16) }
    : { name: '', type: 'zumba', schedule_at: '', duration_minutes: 60, quota: 20, price: 0, location: '', description: '' }
  showModal.value = true
}

async function save() {
  saving.value = true
  try {
    editing.value
      ? await api.put(`/classes/${editing.value.id}`, form.value)
      : await api.post('/classes', { ...form.value, instructor_id: 1 })
    await load()
    showModal.value = false
    toast.success(editing.value ? 'Kelas berhasil diperbarui!' : 'Kelas berhasil ditambahkan!')
  } catch (e) {
    toast.apiError(e, 'Gagal menyimpan kelas.')
  } finally {
    saving.value = false
  }
}

async function deleteClass(cls) {
  if (!confirm(`Hapus kelas "${cls.name}"?`)) return
  try {
    await api.delete(`/classes/${cls.id}`)
    classes.value = classes.value.filter(c => c.id !== cls.id)
    toast.success('Kelas berhasil dihapus.')
  } catch (e) {
    toast.apiError(e, 'Gagal menghapus kelas.')
  }
}

const formatRp   = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)
const formatDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-'
</script>
