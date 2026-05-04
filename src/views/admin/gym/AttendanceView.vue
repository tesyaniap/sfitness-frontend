<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="font-poppins font-bold text-2xl text-dark">Absensi Kelas</h2>
        <p class="text-gray-400 text-sm mt-1">Input kehadiran peserta kelas</p>
      </div>
      <div class="flex gap-2">
        <button @click="showReport = true" class="btn-outline flex items-center gap-2 text-sm">
          <ChartBarIcon class="w-4 h-4" />
          <span class="hidden sm:inline">Laporan Harian</span>
        </button>
        <button @click="openModal()" class="btn-primary flex items-center gap-2 text-sm">
          <PlusIcon class="w-4 h-4" />
          <span class="hidden sm:inline">Input Absensi</span>
          <span class="sm:hidden">Input</span>
        </button>
      </div>
    </div>

    <!-- List absensi -->
    <div v-if="loading" class="card animate-pulse h-48 bg-pink-50" />
    <div v-else class="space-y-3">
      <div v-for="a in attendances" :key="a.id"
        class="card hover:shadow-md transition-shadow cursor-pointer"
        @click="viewDetail(a)">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center shrink-0">
              <CalendarDaysIcon class="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p class="font-semibold text-dark">{{ a.fitness_class?.name }}</p>
              <p class="text-sm text-gray-500 flex items-center gap-2 mt-0.5">
                <UserIcon class="w-3.5 h-3.5" />
                {{ a.instructor?.name }}
                <span class="text-gray-300">·</span>
                <CalendarDaysIcon class="w-3.5 h-3.5" />
                {{ formatDate(a.date) }}
              </p>
            </div>
          </div>
          <div class="text-right shrink-0">
            <p class="text-2xl font-bold text-secondary">{{ a.members_count }}</p>
            <p class="text-xs text-gray-400">peserta</p>
          </div>
        </div>
      </div>
      <div v-if="!attendances.length" class="card text-center py-12">
        <ClipboardDocumentListIcon class="w-12 h-12 text-pink-200 mx-auto mb-3" />
        <p class="text-gray-400">Belum ada data absensi</p>
      </div>
    </div>

    <!-- Modal Input Absensi -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        <div class="px-6 py-5 border-b border-pink-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10">
          <h3 class="font-semibold text-dark">Input Absensi Kelas</h3>
          <button @click="showModal = false" class="w-8 h-8 rounded-xl hover:bg-pink-50 flex items-center justify-center">
            <XMarkIcon class="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div class="p-6 space-y-5">
          <!-- Info kelas -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-dark mb-1.5">Kelas</label>
              <select v-model="form.class_id" class="input" required>
                <option value="">Pilih kelas...</option>
                <option v-for="c in classes" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-dark mb-1.5">Instruktur</label>
              <select v-model="form.instructor_id" class="input" required>
                <option value="">Pilih instruktur...</option>
                <option v-for="i in instructors" :key="i.id" :value="i.id">{{ i.name }}</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-dark mb-1.5">Tanggal</label>
            <input v-model="form.date" type="date" class="input" required />
          </div>

          <!-- Peserta -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <label class="text-sm font-medium text-dark">Peserta ({{ form.members.length }})</label>
              <div class="flex gap-2">
                <button type="button" @click="addMember('member')"
                  class="text-xs btn-outline py-1.5 px-3 flex items-center gap-1">
                  <UserIcon class="w-3.5 h-3.5" /> + Member
                </button>
                <button type="button" @click="addMember('single_visit')"
                  class="text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 py-1.5 px-3 rounded-xl flex items-center gap-1 transition-colors">
                  <UserPlusIcon class="w-3.5 h-3.5" /> + Single Visit
                </button>
              </div>
            </div>

            <div class="space-y-3">
              <div v-for="(member, i) in form.members" :key="i"
                class="bg-pink-50/50 rounded-2xl p-4 border border-pink-100">
                <div class="flex items-center justify-between mb-3">
                  <span :class="member.type === 'member' ? 'bg-pink-100 text-secondary' : 'bg-gray-100 text-gray-600'"
                    class="text-xs font-semibold px-2.5 py-1 rounded-full capitalize">
                    {{ member.type === 'member' ? 'Member' : 'Single Visit' }}
                  </span>
                  <button type="button" @click="removeMember(i)" class="text-red-400 hover:text-red-600">
                    <XMarkIcon class="w-4 h-4" />
                  </button>
                </div>

                <!-- Member: cari membership aktif -->
                <div v-if="member.type === 'member'" class="space-y-2">
                  <div class="relative">
                    <MagnifyingGlassIcon class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input v-model="member.searchQuery" @input="searchMembership(i)"
                      class="input pl-9 text-sm" placeholder="Cari nama member..." />
                  </div>
                  <div v-if="member.searchResults?.length" class="border border-pink-100 rounded-xl overflow-hidden">
                    <button v-for="ms in member.searchResults" :key="ms.id" type="button"
                      @click="selectMembership(i, ms)"
                      class="w-full text-left px-4 py-2.5 hover:bg-pink-50 text-sm border-b border-pink-50 last:border-0">
                      <p class="font-medium text-dark">{{ ms.user?.name }}</p>
                      <p class="text-xs text-gray-400">
                        {{ ms.package?.name }} · Sisa {{ ms.visit_remaining }} visit
                        <span v-if="ms.expired_date"> · Exp {{ formatDate(ms.expired_date) }}</span>
                      </p>
                    </button>
                  </div>
                  <div v-if="member.membership_id" class="bg-white rounded-xl px-3 py-2 border border-pink-200 text-sm">
                    <p class="font-medium text-secondary">{{ member.memberName }}</p>
                    <p class="text-xs text-gray-400">{{ member.packageName }} · Sisa {{ member.visitRemaining }} visit</p>
                  </div>
                </div>

                <!-- Single Visit: input nama -->
                <div v-else>
                  <input v-model="member.guest_name" class="input text-sm" placeholder="Nama peserta" required />
                </div>

                <!-- Harga -->
                <div class="mt-2">
                  <input v-model.number="member.price_paid" type="number" class="input text-sm" placeholder="Harga bayar" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-dark mb-1.5">Catatan</label>
            <textarea v-model="form.notes" class="input" rows="2" placeholder="Opsional..." />
          </div>

          <div class="flex gap-3">
            <button @click="saveAttendance" class="btn-primary flex-1 flex items-center justify-center gap-2" :disabled="saving">
              <ArrowPathIcon v-if="saving" class="w-4 h-4 animate-spin" />
              {{ saving ? 'Menyimpan...' : 'Simpan Absensi' }}
            </button>
            <button @click="showModal = false" class="btn-outline flex-1">Batal</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Detail Absensi -->
    <div v-if="detailData" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-5 border-b border-pink-100 flex items-center justify-between">
          <h3 class="font-semibold text-dark">Detail Absensi</h3>
          <button @click="detailData = null" class="w-8 h-8 rounded-xl hover:bg-pink-50 flex items-center justify-center">
            <XMarkIcon class="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-2 gap-4 mb-5">
            <div class="bg-pink-50 rounded-2xl p-4 text-center">
              <p class="text-2xl font-bold text-secondary">{{ detailData.members?.length || 0 }}</p>
              <p class="text-xs text-gray-500 mt-1">Total Peserta</p>
            </div>
            <div class="bg-pink-50 rounded-2xl p-4 text-center">
              <p class="text-2xl font-bold text-secondary">{{ formatRp(totalRevenue) }}</p>
              <p class="text-xs text-gray-500 mt-1">Total Pendapatan</p>
            </div>
          </div>
          <div class="space-y-2">
            <div v-for="m in detailData.members" :key="m.id"
              class="flex items-center justify-between p-3 bg-pink-50/50 rounded-xl">
              <div>
                <p class="font-medium text-sm text-dark">{{ m.user?.name || m.guest_name }}</p>
                <p class="text-xs text-gray-400">
                  {{ m.type === 'member' ? m.membership?.package?.name : 'Single Visit' }}
                </p>
              </div>
              <span class="font-semibold text-secondary text-sm">{{ formatRp(m.price_paid) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Laporan Harian -->
    <div v-if="showReport" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-5 border-b border-pink-100 flex items-center justify-between">
          <h3 class="font-semibold text-dark">Laporan Harian</h3>
          <button @click="showReport = false" class="w-8 h-8 rounded-xl hover:bg-pink-50 flex items-center justify-center">
            <XMarkIcon class="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div class="p-6">
          <div class="mb-4">
            <input v-model="reportDate" type="date" class="input" @change="loadReport" />
          </div>
          <div v-if="report" class="space-y-4">
            <div class="grid grid-cols-3 gap-3">
              <div class="bg-pink-50 rounded-2xl p-3 text-center">
                <p class="text-xl font-bold text-secondary">{{ report.total_classes }}</p>
                <p class="text-xs text-gray-500">Kelas</p>
              </div>
              <div class="bg-pink-50 rounded-2xl p-3 text-center">
                <p class="text-xl font-bold text-secondary">{{ report.total_present }}</p>
                <p class="text-xs text-gray-500">Peserta</p>
              </div>
              <div class="bg-pink-50 rounded-2xl p-3 text-center">
                <p class="text-lg font-bold text-secondary">{{ formatRp(report.total_revenue) }}</p>
                <p class="text-xs text-gray-500">Revenue</p>
              </div>
            </div>
            <div class="space-y-2">
              <div v-for="c in report.classes" :key="c.id" class="card !p-4">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-semibold text-dark">{{ c.fitness_class?.name }}</p>
                    <p class="text-xs text-gray-400 mt-0.5">Instruktur: {{ c.instructor?.name }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-bold text-secondary">{{ c.members_count }} peserta</p>
                    <p class="text-xs text-gray-400">{{ c.member_count }} member · {{ c.single_visit_count }} single</p>
                  </div>
                </div>
                <p v-if="c.notes" class="text-xs text-gray-400 mt-2 italic">{{ c.notes }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import { useToast } from '@/composables/useToast'
import {
  PlusIcon, XMarkIcon, ArrowPathIcon, MagnifyingGlassIcon,
  UserIcon, UserPlusIcon, CalendarDaysIcon, ChartBarIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/vue/24/outline'

const toast       = useToast()
const attendances = ref([])
const classes     = ref([])
const instructors = ref([])
const loading     = ref(true)
const showModal   = ref(false)
const saving      = ref(false)
const detailData  = ref(null)
const showReport  = ref(false)
const report      = ref(null)
const reportDate  = ref(new Date().toISOString().split('T')[0])

const form = ref({
  class_id: '', instructor_id: '', date: new Date().toISOString().split('T')[0],
  notes: '', members: [],
})

const totalRevenue = computed(() =>
  detailData.value?.members?.reduce((s, m) => s + parseFloat(m.price_paid || 0), 0) || 0
)

onMounted(async () => {
  await Promise.all([load(), loadClasses(), loadInstructors()])
  loading.value = false
})

async function load() {
  const { data } = await api.get('/attendances')
  attendances.value = data.data || data
}

async function loadClasses() {
  const { data } = await api.get('/classes')
  classes.value = data
}

async function loadInstructors() {
  const { data } = await api.get('/users', { params: { role: 'admin' } })
  instructors.value = data.data || data
}

function openModal() {
  form.value = {
    class_id: '', instructor_id: '',
    date: new Date().toISOString().split('T')[0],
    notes: '', members: [],
  }
  showModal.value = true
}

function addMember(type) {
  form.value.members.push({
    type, membership_id: null, user_id: null,
    guest_name: '', price_paid: 0,
    searchQuery: '', searchResults: [],
    memberName: '', packageName: '', visitRemaining: 0,
  })
}

function removeMember(i) {
  form.value.members.splice(i, 1)
}

let searchTimers = {}
async function searchMembership(i) {
  clearTimeout(searchTimers[i])
  const member = form.value.members[i]
  if (!member.searchQuery || !form.value.class_id) { member.searchResults = []; return }
  searchTimers[i] = setTimeout(async () => {
    const { data } = await api.get('/memberships', {
      params: { class_id: form.value.class_id, status: 'active', search: member.searchQuery }
    })
    member.searchResults = (data.data || data).slice(0, 5)
  }, 300)
}

function selectMembership(i, ms) {
  const member = form.value.members[i]
  member.membership_id  = ms.id
  member.user_id        = ms.user_id
  member.memberName     = ms.user?.name
  member.packageName    = ms.package?.name
  member.visitRemaining = ms.visit_remaining
  member.searchQuery    = ''
  member.searchResults  = []
}

async function saveAttendance() {
  if (!form.value.class_id || !form.value.instructor_id) {
    toast.error('Pilih kelas dan instruktur.')
    return
  }
  if (!form.value.members.length) {
    toast.error('Tambahkan minimal 1 peserta.')
    return
  }

  saving.value = true
  try {
    const payload = {
      ...form.value,
      members: form.value.members.map(m => ({
        type:          m.type,
        membership_id: m.membership_id || null,
        user_id:       m.user_id || null,
        guest_name:    m.guest_name || null,
        price_paid:    m.price_paid || 0,
      })),
    }
    await api.post('/attendances', payload)
    await load()
    showModal.value = false
    toast.success('Absensi berhasil disimpan!')
  } catch (e) {
    toast.apiError(e, 'Gagal menyimpan absensi.')
  } finally {
    saving.value = false
  }
}

async function viewDetail(a) {
  const { data } = await api.get(`/attendances/${a.id}`)
  detailData.value = data
}

async function loadReport() {
  const { data } = await api.get('/reports/daily', { params: { date: reportDate.value } })
  report.value = data
}

const formatRp   = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v || 0)
const formatDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'
</script>
