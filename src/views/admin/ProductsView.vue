<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="font-poppins font-bold text-2xl text-dark">Produk Kantin</h2>
        <p class="text-gray-400 text-sm mt-1">Kelola stok dan produk kantin</p>
      </div>
      <div class="flex items-center gap-2">
        <!-- Scan to find product -->
        <button @click="showScanFind = true"
          class="btn-outline flex items-center gap-2 text-sm py-2 px-4">
          <QrCodeIcon class="w-4 h-4" />
          <span class="hidden sm:inline">Scan Produk</span>
        </button>
        <button @click="openModal()" class="btn-primary flex items-center gap-2 text-sm">
          <PlusIcon class="w-4 h-4" />
          <span class="hidden sm:inline">Tambah Produk</span>
          <span class="sm:hidden">Tambah</span>
        </button>
      </div>
    </div>

    <!-- Highlighted product from scan -->
    <Transition name="fade">
      <div v-if="scannedProduct" class="mb-4 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <CheckCircleIcon class="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p class="font-semibold text-sm text-dark">{{ scannedProduct.name }}</p>
            <p class="text-xs text-gray-500">Barcode: {{ scannedProduct.barcode }} · Stok: {{ scannedProduct.stock }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button @click="openModal(scannedProduct)" class="text-xs text-secondary hover:bg-pink-100 px-3 py-1.5 rounded-lg flex items-center gap-1">
            <PencilSquareIcon class="w-3.5 h-3.5" /> Edit
          </button>
          <button @click="scannedProduct = null" class="text-gray-400 hover:text-gray-600">
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </Transition>

    <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <div v-for="i in 8" :key="i" class="card animate-pulse h-48 bg-pink-50" />
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <div v-for="p in products" :key="p.id"
        :class="scannedProduct?.id === p.id ? 'ring-2 ring-green-400' : ''"
        class="card hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
        <div class="w-full h-24 bg-gradient-to-br from-pink-50 to-highlight rounded-xl mb-3 flex items-center justify-center">
          <component :is="categoryIcon(p.category)" class="w-10 h-10 text-primary/60" />
        </div>
        <p class="font-semibold text-sm text-dark">{{ p.name }}</p>
        <p class="text-secondary font-bold text-sm mt-1">{{ formatRp(p.price) }}</p>
        <div class="flex items-center justify-between mt-1">
          <p class="text-xs text-gray-400 flex items-center gap-1">
            <ArchiveBoxIcon class="w-3 h-3" />
            {{ p.stock }} stok
          </p>
          <span :class="p.is_available ? 'badge-confirmed' : 'badge-cancelled'" class="text-xs">
            {{ p.is_available ? 'Tersedia' : 'Habis' }}
          </span>
        </div>
        <!-- Barcode indicator -->
        <div v-if="p.barcode" class="mt-2 flex items-center gap-1 text-xs text-gray-400">
          <QrCodeIcon class="w-3 h-3" />
          <span class="font-mono truncate">{{ p.barcode }}</span>
        </div>
        <div class="flex gap-2 mt-3 pt-3 border-t border-pink-50">
          <button @click="openModal(p)"
            class="flex-1 flex items-center justify-center gap-1 text-xs text-secondary hover:bg-pink-100 py-1.5 rounded-lg transition-colors border border-pink-200">
            <PencilSquareIcon class="w-3.5 h-3.5" />
            Edit
          </button>
          <button @click="deleteProduct(p)"
            class="flex items-center justify-center gap-1 text-xs text-red-400 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors">
            <TrashIcon class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- ===== ADD/EDIT MODAL ===== -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto">
        <div class="px-6 py-5 border-b border-pink-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10">
          <h3 class="font-semibold text-dark">{{ editing ? 'Edit Produk' : 'Tambah Produk Baru' }}</h3>
          <button @click="showModal = false" class="w-8 h-8 rounded-xl hover:bg-pink-50 flex items-center justify-center transition-colors">
            <XMarkIcon class="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form @submit.prevent="save" class="p-6 space-y-4">
          <!-- Nama -->
          <div>
            <label class="block text-sm font-medium text-dark mb-1.5">Nama Produk</label>
            <input v-model="form.name" class="input" placeholder="Nama produk" required />
          </div>

          <!-- Barcode field + scan button -->
          <div>
            <label class="block text-sm font-medium text-dark mb-1.5">Kode Barcode</label>
            <div class="flex gap-2">
              <div class="relative flex-1">
                <QrCodeIcon class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  v-model="form.barcode"
                  class="input pl-10 font-mono"
                  placeholder="Contoh: 8991234567890"
                  @input="onBarcodeInput"
                />
              </div>
              <button type="button" @click="showScanner = true"
                class="btn-outline px-3 py-2 flex items-center gap-1.5 text-sm shrink-0">
                <CameraIcon class="w-4 h-4" />
                <span class="hidden sm:inline">Scan</span>
              </button>
            </div>
            <p class="text-xs text-gray-400 mt-1">Kosongkan jika tidak pakai barcode</p>
          </div>

          <!-- Barcode Preview -->
          <div v-if="form.barcode" class="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <div class="flex items-center justify-between mb-3">
              <p class="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                <QrCodeIcon class="w-3.5 h-3.5" />
                Preview Barcode
              </p>
              <button type="button" @click="printBarcode"
                class="text-xs text-secondary hover:bg-pink-100 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors">
                <PrinterIcon class="w-3 h-3" />
                Print
              </button>
            </div>
            <div id="barcode-preview-wrapper" class="bg-white rounded-xl p-3 flex justify-center">
              <BarcodeDisplay :value="form.barcode" />
            </div>
          </div>

          <!-- Kategori -->
          <div>
            <label class="block text-sm font-medium text-dark mb-1.5">Kategori</label>
            <select v-model="form.category" class="input">
              <option value="food">Makanan</option>
              <option value="drink">Minuman</option>
              <option value="supplement">Suplemen</option>
            </select>
          </div>

          <!-- Harga & Stok -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-dark mb-1.5">Harga</label>
              <input v-model.number="form.price" type="number" class="input" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark mb-1.5">Stok</label>
              <input v-model.number="form.stock" type="number" class="input" required />
            </div>
          </div>

          <!-- Deskripsi -->
          <div>
            <label class="block text-sm font-medium text-dark mb-1.5">Deskripsi</label>
            <textarea v-model="form.description" class="input" rows="2" placeholder="Deskripsi produk..."></textarea>
          </div>

          <!-- Tersedia -->
          <label class="flex items-center gap-2.5 text-sm cursor-pointer">
            <input v-model="form.is_available" type="checkbox" class="w-4 h-4 accent-secondary rounded" />
            <span class="text-dark font-medium">Produk tersedia</span>
          </label>

          <!-- Error -->
          <div v-if="saveError" class="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
            <ExclamationCircleIcon class="w-4 h-4 shrink-0" />
            {{ saveError }}
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

    <!-- ===== SCANNER MODAL (in form) ===== -->
    <div v-if="showScanner" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm">
        <div class="px-5 py-4 border-b border-pink-100 flex items-center justify-between">
          <h3 class="font-semibold text-dark flex items-center gap-2">
            <QrCodeIcon class="w-5 h-5 text-secondary" />
            Scan Barcode Produk
          </h3>
          <button @click="showScanner = false" class="w-8 h-8 rounded-xl hover:bg-pink-50 flex items-center justify-center">
            <XMarkIcon class="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div class="p-5">
          <BarcodeScanner
            @scanned="onScanForForm"
            @close="showScanner = false"
          />
          <p class="text-xs text-gray-400 text-center mt-3">
            Arahkan kamera ke barcode produk
          </p>
        </div>
      </div>
    </div>

    <!-- ===== SCANNER MODAL (find product) ===== -->
    <div v-if="showScanFind" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm">
        <div class="px-5 py-4 border-b border-pink-100 flex items-center justify-between">
          <h3 class="font-semibold text-dark flex items-center gap-2">
            <QrCodeIcon class="w-5 h-5 text-secondary" />
            Cari Produk via Barcode
          </h3>
          <button @click="showScanFind = false" class="w-8 h-8 rounded-xl hover:bg-pink-50 flex items-center justify-center">
            <XMarkIcon class="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div class="p-5">
          <BarcodeScanner
            @scanned="onScanToFind"
            @close="showScanFind = false"
          />
          <p class="text-xs text-gray-400 text-center mt-3">
            Scan barcode untuk menemukan produk
          </p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useToast } from '@/composables/useToast'
import BarcodeDisplay from '@/components/barcode/BarcodeDisplay.vue'
import BarcodeScanner from '@/components/barcode/BarcodeScanner.vue'
import {
  PlusIcon, PencilSquareIcon, TrashIcon, XMarkIcon,
  ArrowPathIcon, ArchiveBoxIcon, BeakerIcon, CakeIcon, SparklesIcon,
  QrCodeIcon, CameraIcon, PrinterIcon, CheckCircleIcon, ExclamationCircleIcon,
} from '@heroicons/vue/24/outline'

const products       = ref([])
const loading        = ref(true)
const showModal      = ref(false)
const showScanner    = ref(false)
const showScanFind   = ref(false)
const editing        = ref(null)
const saving         = ref(false)
const saveError      = ref('')
const scannedProduct = ref(null)
const form           = ref({})
const toast          = useToast()

const categoryIcon = (cat) => cat === 'drink' ? BeakerIcon : cat === 'supplement' ? SparklesIcon : CakeIcon

onMounted(async () => { await load(); loading.value = false })

async function load() {
  const { data } = await api.get('/products')
  products.value = data
}

function openModal(p = null) {
  editing.value  = p
  saveError.value = ''
  form.value     = p
    ? { ...p }
    : { name: '', barcode: '', category: 'food', price: 0, stock: 0, description: '', is_available: true }
  showModal.value = true
}

// Barcode input handler — debounce tidak perlu, langsung update preview
function onBarcodeInput() {
  // Preview auto-updates via watcher in BarcodeDisplay
}

// Scan result → isi field barcode di form
function onScanForForm(code) {
  form.value.barcode = code
  showScanner.value  = false
}

// Scan result → cari produk
async function onScanToFind(code) {
  showScanFind.value = false
  try {
    const { data } = await api.get('/products/barcode', { params: { barcode: code } })
    scannedProduct.value = data
    toast.success(`Produk ditemukan: ${data.name}`)
    setTimeout(() => {
      document.getElementById(`product-${data.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 300)
  } catch {
    toast.error(`Produk dengan barcode "${code}" tidak ditemukan.`)
  }
}

async function save() {
  saving.value    = true
  saveError.value = ''
  try {
    const payload = { ...form.value }
    if (!payload.barcode) payload.barcode = null
    editing.value
      ? await api.put(`/products/${editing.value.id}`, payload)
      : await api.post('/products', payload)
    await load()
    showModal.value = false
    toast.success(editing.value ? 'Produk berhasil diperbarui!' : 'Produk berhasil ditambahkan!')
  } catch (e) {
    const errors = e.response?.data?.errors
    saveError.value = errors
      ? Object.values(errors).flat()[0]
      : e.response?.data?.message || 'Gagal menyimpan.'
    toast.error(saveError.value)
  } finally {
    saving.value = false
  }
}

async function deleteProduct(p) {
  if (!confirm(`Hapus produk "${p.name}"?`)) return
  try {
    await api.delete(`/products/${p.id}`)
    products.value = products.value.filter(x => x.id !== p.id)
    toast.success('Produk berhasil dihapus.')
  } catch (e) {
    toast.apiError(e, 'Gagal menghapus produk.')
  }
}

function printBarcode() {
  const win = window.open('', '_blank', 'width=400,height=300')
  const svg = document.querySelector('#barcode-preview-wrapper svg')
  if (!svg) return
  win.document.write(`
    <html><head><title>Barcode - ${form.value.name}</title>
    <style>
      body { font-family: monospace; text-align: center; padding: 20px; }
      h3 { font-size: 14px; margin: 0 0 8px; }
      p  { font-size: 12px; color: #666; margin: 4px 0 0; letter-spacing: 2px; }
    </style></head>
    <body>
      <h3>${form.value.name}</h3>
      ${svg.outerHTML}
      <p>${form.value.barcode}</p>
    </body></html>
  `)
  win.document.close()
  win.print()
}

const formatRp = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
