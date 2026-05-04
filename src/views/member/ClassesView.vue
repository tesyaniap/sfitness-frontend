<template>
  <div>
    <div class="mb-6">
      <h2 class="font-poppins font-bold text-2xl text-dark">Kelas Fitness</h2>
      <p class="text-gray-400 text-sm mt-1">Pilih kelas favoritmu dan booking sekarang</p>
    </div>

    <!-- Filter -->
    <div class="flex gap-2 mb-6 flex-wrap">
      <button v-for="t in types" :key="t.value"
        @click="filter = t.value"
        :class="filter === t.value
          ? 'bg-secondary text-white shadow-sm shadow-pink-200'
          : 'bg-white text-gray-500 border border-gray-200 hover:border-primary hover:text-secondary'"
        class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all">
        <component :is="t.icon" class="w-4 h-4" />
        {{ t.label }}
      </button>
    </div>

    <!-- Skeleton -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="i in 6" :key="i" class="card animate-pulse h-56 bg-pink-50" />
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="cls in filteredClasses" :key="cls.id"
        class="card hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
        <!-- Header -->
        <div class="flex justify-between items-start mb-4">
          <span class="bg-pink-100 text-secondary text-xs font-semibold px-3 py-1 rounded-full capitalize">
            {{ cls.type }}
          </span>
          <span :class="cls.remaining_quota > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'"
            class="text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
            <UserGroupIcon class="w-3 h-3" />
            {{ cls.remaining_quota > 0 ? `${cls.remaining_quota} slot` : 'Penuh' }}
          </span>
        </div>

        <h3 class="font-semibold text-dark text-base">{{ cls.name }}</h3>
        <p class="text-xs text-gray-400 mt-1 line-clamp-2">{{ cls.description }}</p>

        <div class="mt-4 space-y-2 text-xs text-gray-500 flex-1">
          <div class="flex items-center gap-2">
            <CalendarDaysIcon class="w-4 h-4 text-primary shrink-0" />
            {{ formatDate(cls.schedule_at) }}
          </div>
          <div class="flex items-center gap-2">
            <ClockIcon class="w-4 h-4 text-primary shrink-0" />
            {{ cls.duration_minutes }} menit
          </div>
          <div class="flex items-center gap-2">
            <MapPinIcon class="w-4 h-4 text-primary shrink-0" />
            {{ cls.location }}
          </div>
          <div class="flex items-center gap-2">
            <UserIcon class="w-4 h-4 text-primary shrink-0" />
            {{ cls.instructor?.name }}
          </div>
        </div>

        <div class="flex items-center justify-between mt-5 pt-4 border-t border-pink-50">
          <p class="font-bold text-secondary">{{ formatRp(cls.price) }}</p>
          <button @click="book(cls)"
            :disabled="cls.remaining_quota <= 0 || bookingIds.has(cls.id) || bookingLoadingId === cls.id"
            :class="bookingIds.has(cls.id)
              ? 'bg-green-100 text-green-700 cursor-default'
              : 'btn-primary'"
            class="text-sm py-2 px-4 rounded-xl font-semibold flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            <CheckCircleIcon v-if="bookingIds.has(cls.id)" class="w-4 h-4" />
            <ArrowPathIcon v-else-if="bookingLoadingId === cls.id" class="w-4 h-4 animate-spin" />
            <PlusIcon v-else class="w-4 h-4" />
            {{ bookingIds.has(cls.id) ? 'Booked' : bookingLoadingId === cls.id ? 'Loading...' : 'Booking' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import { useMidtrans } from '@/composables/useMidtrans'
import { useToast } from '@/composables/useToast'
import {
  CalendarDaysIcon, ClockIcon, MapPinIcon, UserIcon,
  UserGroupIcon, CheckCircleIcon, PlusIcon, ArrowPathIcon,
  Squares2X2Icon, SparklesIcon,
} from '@heroicons/vue/24/outline'

const classes    = ref([])
const loading    = ref(true)
const filter     = ref('')
const bookingIds = ref(new Set())
const toast      = useToast()
const { payBooking, processing: bookingProcessing, error: bookingError } = useMidtrans()
const bookingLoadingId = ref(null)

const types = [
  { value: '', label: 'Semua', icon: Squares2X2Icon },
  { value: 'zumba',   label: 'Zumba',   icon: SparklesIcon },
  { value: 'yoga',    label: 'Yoga',    icon: SparklesIcon },
  { value: 'pilates', label: 'Pilates', icon: SparklesIcon },
  { value: 'aerobic', label: 'Aerobic', icon: SparklesIcon },
]

const filteredClasses = computed(() =>
  filter.value ? classes.value.filter(c => c.type === filter.value) : classes.value
)

onMounted(async () => {
  const [classRes, bookingRes] = await Promise.all([
    api.get('/classes'),
    api.get('/my-bookings'),
  ])
  classes.value = classRes.data
  bookingRes.data.forEach(b => {
    if (b.status === 'confirmed') bookingIds.value.add(b.class_id)
  })
  loading.value = false
})

async function book(cls) {
  bookingLoadingId.value = cls.id
  await payBooking(cls.id, {
    onSuccess: () => {
      bookingIds.value.add(cls.id)
      cls.remaining_quota--
      bookingLoadingId.value = null
      toast.success(`Booking ${cls.name} berhasil! 🎉`)
    },
    onPending: () => {
      bookingLoadingId.value = null
      toast.info('Pembayaran pending. Selesaikan pembayaran untuk konfirmasi booking.')
    },
    onError: () => {
      bookingLoadingId.value = null
      toast.error(bookingError.value || 'Pembayaran gagal.')
    },
    onClose: () => {
      bookingLoadingId.value = null
    },
  })
}

const formatRp   = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)
const formatDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-'
</script>
