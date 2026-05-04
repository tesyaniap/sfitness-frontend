<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="font-poppins font-bold text-2xl text-dark">Membership</h2>
        <p class="text-gray-400 text-sm mt-1">Daftar & kelola paket member kelas</p>
      </div>
      <button @click="openModal()" class="btn-primary flex items-center gap-2 text-sm">
        <PlusIcon class="w-4 h-4" />
        <span class="hidden sm:inline">Daftarkan Member</span>
        <span class="sm:hidden">Daftar</span>
      </button>
    </div>

    <!-- Filter -->
    <div class="card mb-4 flex flex-wrap gap-3">
      <div class="relative flex-1 min-w-48">
        <MagnifyingGlassIcon class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input v-model="search" class="input pl-9 text-sm" placeholder="Cari nama member..." />
      </div>
      <select v-model="filterStatus" class="input text-sm w-36">
        <option value="">Semua Status</option>
        <option value="active">Aktif</option>
        <option value="expired">Expired</option>
        <option value="used_up">Habis</option>
      </select>
    </div>

    <div v-if="loading" class="card animate-pulse h-48 bg-pink-50" />
    <div v-else class="card overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-pink-100 text-left text-xs text-gray-400 uppercase tracking-wide">
            <th class="pb-3 pr-4 font-medium">Member</th>
            <th class="pb-3 pr-4 font-medium">Kelas</th>
            <th class="pb-3 pr-4 font-medium">Paket</th>
            <th class="pb-3 pr-4 font-medium">Visit</th>
            <th class="pb-3 pr-4 font-medium">Expired</th>
            <th class="pb-3 pr-4 font-medium">Status</th>
            <th class="pb-3 font-medium">Harga</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-pink-50">
          <tr v-for="m in memberships" :key="m.id" class="hover:bg-pink-50/40 transition-colors">
            <td class="py-3 pr-4">
              <p class="font-medium text-dark text-sm">{{ m.user?.name }}</p>
              <p class="text-xs text-gray-400">{{ m.user?.member_number || m.user?.phone }}</p>
            </td>
            <td class="py-3 pr-4 text-gray-600">{{ m.class_?.name }}</td>
            <td class="py-3 pr-4">
              <span class="bg-pink-100 text-secondary text-xs font-medium px-2.5 py-1 rounded-full">
                {{ m.package?.name }}
              </span>
            </td>
            <td class="py-3 pr-4">
              <span class="font-semibold text-dark">{{ m.visit_remaining }}</span>
              <span class="text-gray-400">/{{ m.visit_quota }}</span>
            </td>
            <td class="py-3 pr-4 text-gray-500 text-xs">
              {{ m.expired_date ? formatDate(m.expired_date) : 'Tidak ada' }}
            </td>
            <td class="py-3 pr-4">
              <span :class="{
                'badge-confirmed': m.status === 'active',
                'badge-cancelled': m.status === 'expired' || m.status === 'used_up',
              }">{{ statusLabel(m.status) }}</span>
            </td>
            <td class="py-3 font-semibold text-secondary">{{ formatRp(m.price) }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="!memberships.length" class="text-center py-12">
        <UserGroupIcon class="w-12 h-12 text-pink-200 mx-auto mb-3" />
        <p class="text-gray-400 text-sm">Belum ada membership</p>
      </div>
    </div>

    <!-- Modal Daftar Member -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto">
        <div class="px-6 py-5 border-b border-pink-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl">
          <h3 class="font-semibold text-dark">Daftarkan Member Baru</h3>
          <button @click="showModal = false" class="w-8 h-8 rounded-xl hover:bg-pink-50 flex items-center justify-center">
            <XMarkIcon class="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <form @submit.prevent="save" class="p-6 space-y-4">

          <!-- Cari member -->
          <div>
            <label class="block text-sm font-medium text-dark mb-1.5">Member</label>
            <div class="relative">
              <UserIcon class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input v-model="memberSearch" @input="searchMembers" class="input pl-10" placeholder="Cari nama atau WA member..." />
            </div>
            <!-- Dropdown hasil pencarian -->
            <div v-if="memberResults.length" class="border border-pink-100 rounded-xl mt-1 overflow-hidden shadow-sm">
              <button v-for="m in memberResults" :key="m.id" type="button"
                @click="selectMember(m)"
                class="w-full text-left px-4 py-2.5 hover:bg-pink-50 text-sm flex items-center gap-3 border-b border-pink-50 last:border-0">
                <div class="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {{ m.name?.charAt(0) }}
                </div>
                <div>
                  <p class="font-medium text-dark">{{ m.name }}</p>
                  <p class="text-xs text-gray-400">{{ m.whatsapp || m.phone }}</p>
                </div>
              </button>
            </div>
            <div v-if="form.user_id" class="mt-2 bg-pink-50 rounded-xl px-4 py-2 flex items-center justify-between">
              <span class="text-sm font-medium text-secondary">{{ selectedMemberName }}</span>
              <button type="button" @click="form.user_id = ''; selectedMemberName = ''" class="text-gray-400 hover:text-red-500">
                <XMarkIcon class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Pilih kelas -->
          <div>
            <label class="block text-sm font-medium text-dark mb-1.5">Kelas</label>
            <select v-model="form.class_id" class="input" required>
              <option value="">Pilih kelas...</option>
              <option v-for="c in classes" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>

          <!-- Pilih paket -->
          <div>
            <label class="block text-sm font-medium text-dark mb-1.5">Paket</label>
            <div class="grid grid-cols-3 gap-2">
              <button v-for="pkg in packages" :key="pkg.id" type="button"
                @click="selectPackage(pkg)"
                :class="form.package_id === pkg.id
                  ? 'border-secondary bg-pink-50 text-secondary'
                  : 'border-gray-200 text-gray-500 hover:border-primary'"
                class="border-2 rounded-xl p-3 text-center transition-all">
                <p class="font-semibold text-sm">{{ pkg.name }}</p>
                <p class="text-xs mt-0.5 text-gray-400">{{ pkg.visit_quota }}x visit</p>
                <p v-if="pkg.active_days > 0" class="text-xs text-gray-400">{{ pkg.active_days }} hari</p>
              </button>
            </div>
          </div>

          <!-- Harga -->
          <div>
            <label class="block text-sm font-medium text-dark mb-1.5">Harga</label>
            <input v-model.number="form.price" type="number" class="input" placeholder="0" required />
          </div>

          <!-- Metode bayar -->
          <div>
            <label class="block text-sm font-medium text-dark mb-1.5">Metode Pembayaran</label>
            <select v-model="form.payment_method" class="input">
              <option value="cash">Tunai</option>
              <option value="qris">QRIS</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>

          <!-- Catatan -->
          <div>
            <label class="block text-sm font-medium text-dark mb-1.5">Catatan</label>
            <textarea v-model="form.notes" class="input" rows="2" placeholder="Opsional..." />
          </div>

          <div class="flex gap-3 pt-2">
            <button type="submit" class="btn-primary flex-1 flex items-center justify-center gap-2" :disabled="saving">
              <ArrowPathIcon v-if="saving" class="w-4 h-4 animate-spin" />
              {{ saving ? 'Menyimpan...' : 'Daftarkan' }}
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
import {
  PlusIcon, XMarkIcon, ArrowPathIcon,
  MagnifyingGlassIcon, UserIcon, UserGroupIcon,
} from '@heroicons/vue/24/outline'

const toast       = useToast()
const memberships = ref([])
const packages    = ref([])
const classes     = ref([])
const loading     = ref(true)
const showModal   = ref(false)
const saving      = ref(false)
const search      = ref('')
const filterStatus = ref('')
const memberSearch  = ref('')
const memberResults = ref([])
const selectedMemberName = ref('')

const form = ref({
  user_id: '', class_id: '', package_id: '',
  price: 0, payment_method: 'cash', notes: '',
})

onMounted(async () => {
  await Promise.all([load(), loadPackages(), loadClasses()])
  loading.value = false
})

async function load() {
  const { data } = await api.get('/memberships', {
    params: { status: filterStatus.value, search: search.value }
  })
  memberships.value = data.data || data
}

async function loadPackages() {
  const { data } = await api.get('/member-packages')
  packages.value = data
}

async function loadClasses() {
  const { data } = await api.get('/classes')
  classes.value = data
}

let searchTimer
async function searchMembers() {
  clearTimeout(searchTimer)
  if (!memberSearch.value) { memberResults.value = []; return }
  searchTimer = setTimeout(async () => {
    const { data } = await api.get('/users', { params: { role: 'member', search: memberSearch.value } })
    memberResults.value = (data.data || data).slice(0, 5)
  }, 300)
}

function selectMember(m) {
  form.value.user_id = m.id
  selectedMemberName.value = m.name
  memberSearch.value = ''
  memberResults.value = []
}

function selectPackage(pkg) {
  form.value.package_id = pkg.id
}

function openModal() {
  form.value = { user_id: '', class_id: '', package_id: '', price: 0, payment_method: 'cash', notes: '' }
  selectedMemberName.value = ''
  memberSearch.value = ''
  memberResults.value = []
  showModal.value = true
}

async function save() {
  if (!form.value.user_id) { toast.error('Pilih member terlebih dahulu.'); return }
  if (!form.value.package_id) { toast.error('Pilih paket terlebih dahulu.'); return }
  saving.value = true
  try {
    await api.post('/memberships', form.value)
    await load()
    showModal.value = false
    toast.success('Member berhasil didaftarkan!')
  } catch (e) {
    toast.apiError(e, 'Gagal mendaftarkan member.')
  } finally {
    saving.value = false
  }
}

const statusLabel = (s) => ({ active: 'Aktif', expired: 'Expired', used_up: 'Habis' }[s] || s)
const formatRp    = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v || 0)
const formatDate  = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'
</script>
