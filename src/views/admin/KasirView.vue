<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="font-poppins font-bold text-xl lg:text-2xl text-dark">Kasir</h2>
        <p class="text-gray-400 text-xs mt-0.5 hidden sm:block">Point of Sale — Kantin S-Fitness</p>
      </div>
      <div class="flex items-center gap-2">
        <button @click="showBarcodeScanner = true"
          class="btn-outline flex items-center gap-1.5 text-xs py-2 px-3">
          <QrCodeIcon class="w-4 h-4" />
          <span class="hidden sm:inline">Scan Barcode</span>
        </button>
        <div class="flex items-center gap-2 text-xs text-gray-400 bg-white border border-pink-100 px-3 py-2 rounded-xl">
          <ClockIcon class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">{{ currentTime }}</span>
          <span class="sm:hidden">{{ shortTime }}</span>
        </div>
      </div>
    </div>

    <!-- Desktop: side by side | Mobile: stacked with cart toggle -->
    <div class="flex flex-col lg:flex-row gap-4 lg:h-[calc(100vh-160px)]">

      <!-- LEFT: Products -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- Search + Filter -->
        <div class="flex gap-2 mb-3">
          <div class="relative flex-1">
            <MagnifyingGlassIcon class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input v-model="search" class="input pl-9 text-sm" placeholder="Cari produk..." />
          </div>
          <div class="flex gap-1 overflow-x-auto">
            <button v-for="c in categories" :key="c.value"
              @click="filterCat = c.value"
              :class="filterCat === c.value ? 'bg-secondary text-white' : 'bg-white text-gray-500 border border-gray-200'"
              class="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0">
              <component :is="c.icon" class="w-3.5 h-3.5" />
              <span class="hidden sm:inline">{{ c.label }}</span>
            </button>
          </div>
        </div>

        <!-- Products Grid -->
        <div v-if="loadingProducts" class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:overflow-y-auto">
          <div v-for="i in 8" :key="i" class="bg-white rounded-2xl h-32 animate-pulse border border-pink-50" />
        </div>

        <div v-else class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:overflow-y-auto lg:pr-1 content-start">
          <button v-for="p in filteredProducts" :key="p.id"
            @click="addToCart(p)"
            :disabled="p.stock <= 0"
            class="bg-white border border-pink-100 rounded-2xl p-2.5 text-left hover:border-primary hover:shadow-md transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed group">
            <div class="w-full h-14 sm:h-16 bg-gradient-to-br from-pink-50 to-highlight rounded-xl mb-2 flex items-center justify-center">
              <component :is="categoryIcon(p.category)" class="w-6 h-6 text-primary/70 group-hover:text-secondary transition-colors" />
            </div>
            <p class="font-semibold text-xs text-dark leading-tight line-clamp-2">{{ p.name }}</p>
            <p class="text-secondary font-bold text-xs mt-0.5">{{ formatRp(p.price) }}</p>
            <p class="text-gray-400 text-xs">{{ p.stock }} stok</p>
          </button>

          <div v-if="!filteredProducts.length" class="col-span-4 text-center py-12 text-gray-400">
            <ShoppingBagIcon class="w-10 h-10 text-pink-200 mx-auto mb-2" />
            <p class="text-sm">Produk tidak ditemukan</p>
          </div>
        </div>
      </div>

      <!-- RIGHT: Cart — desktop -->
      <div class="hidden lg:flex w-80 shrink-0 flex-col bg-white rounded-3xl border border-pink-100 shadow-sm overflow-hidden">
        <CartContent
          :cart="cart" :cart-count="cartCount" :cart-total="cartTotal"
          :members="members" :payment-method="paymentMethod" :payment-methods="paymentMethods"
          :cash-received="cashReceived" :processing="processing"
          v-model:selected-member="selectedMember"
          v-model:payment-method="paymentMethod"
          v-model:cash-received="cashReceived"
          @update-qty="updateQty" @clear="clearCart" @checkout="checkout"
        />
      </div>
    </div>

    <!-- Mobile Cart FAB -->
    <button v-if="cart.length" @click="showCart = true"
      class="lg:hidden fixed bottom-20 right-4 z-40 bg-secondary text-white rounded-2xl px-4 py-3 shadow-lg shadow-pink-300 flex items-center gap-2 font-semibold text-sm">
      <ShoppingCartIcon class="w-5 h-5" />
      {{ cartCount }} · {{ formatRp(cartTotal) }}
    </button>

    <!-- Mobile Cart Drawer -->
    <Transition name="slide-up">
      <div v-if="showCart" class="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
        <div class="absolute inset-0 bg-black/40" @click="showCart = false" />
        <div class="relative bg-white rounded-t-3xl max-h-[90vh] flex flex-col overflow-hidden">
          <div class="flex items-center justify-between px-5 py-4 border-b border-pink-100 shrink-0">
            <h3 class="font-semibold text-dark flex items-center gap-2">
              <ShoppingCartIcon class="w-5 h-5 text-secondary" />
              Pesanan
            </h3>
            <button @click="showCart = false" class="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center">
              <XMarkIcon class="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div class="flex-1 overflow-y-auto">
            <CartContent
              :cart="cart" :cart-count="cartCount" :cart-total="cartTotal"
              :members="members" :payment-method="paymentMethod" :payment-methods="paymentMethods"
              :cash-received="cashReceived" :processing="processing"
              v-model:selected-member="selectedMember"
              v-model:payment-method="paymentMethod"
              v-model:cash-received="cashReceived"
              @update-qty="updateQty" @clear="clearCart"
              @checkout="() => { checkout(); showCart = false }"
            />
          </div>
        </div>
      </div>
    </Transition>

    <!-- Barcode Scanner Modal -->
    <div v-if="showBarcodeScanner" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm">
        <div class="px-5 py-4 border-b border-pink-100 flex items-center justify-between">
          <h3 class="font-semibold text-dark flex items-center gap-2">
            <QrCodeIcon class="w-5 h-5 text-secondary" />
            Scan Barcode
          </h3>
          <button @click="showBarcodeScanner = false" class="w-8 h-8 rounded-xl hover:bg-pink-50 flex items-center justify-center">
            <XMarkIcon class="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div class="p-5">
          <BarcodeScanner @scanned="onBarcodeScanned" @close="showBarcodeScanner = false" />
          <p class="text-xs text-gray-400 text-center mt-3">Scan barcode untuk tambah ke keranjang</p>
        </div>
      </div>
    </div>

    <!-- Receipt Modal -->
    <div v-if="receipt" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm">
        <div class="text-center px-6 pt-6 pb-4 border-b border-dashed border-pink-200">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-3">
            <CheckCircleIcon class="w-6 h-6 text-white" />
          </div>
          <h3 class="font-poppins font-bold text-lg text-dark">Pembayaran Berhasil!</h3>
          <p class="text-xs text-gray-400 mt-1">{{ receiptDate }}</p>
        </div>
        <div class="px-6 py-4 border-b border-dashed border-pink-200">
          <p class="text-xs text-gray-400 mb-3 font-mono">{{ receipt.invoice_number }}</p>
          <div class="space-y-2">
            <div v-for="item in receipt.items" :key="item.product_id" class="flex justify-between text-sm">
              <span class="text-gray-600">{{ item.name }} <span class="text-gray-400">x{{ item.quantity }}</span></span>
              <span class="font-medium text-dark">{{ formatRp(item.subtotal) }}</span>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 space-y-2">
          <div class="flex justify-between text-sm font-bold">
            <span>Total</span>
            <span class="text-secondary">{{ formatRp(receipt.total_amount) }}</span>
          </div>
          <div v-if="receipt.cash_received" class="flex justify-between text-sm text-gray-500">
            <span>Dibayar</span><span>{{ formatRp(receipt.cash_received) }}</span>
          </div>
          <div v-if="receipt.change > 0" class="flex justify-between text-sm font-semibold text-green-600">
            <span>Kembalian</span><span>{{ formatRp(receipt.change) }}</span>
          </div>
        </div>
        <div class="px-6 pb-6 flex gap-3">
          <button @click="printReceipt" class="flex-1 btn-outline flex items-center justify-center gap-2 text-sm py-2.5">
            <PrinterIcon class="w-4 h-4" /> Cetak
          </button>
          <button @click="receipt = null" class="flex-1 btn-primary flex items-center justify-center gap-2 text-sm py-2.5">
            <PlusIcon class="w-4 h-4" /> Baru
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, defineComponent, h } from 'vue'
import api from '@/services/api'
import { useMidtrans } from '@/composables/useMidtrans'
import { useToast } from '@/composables/useToast'
import BarcodeScanner from '@/components/barcode/BarcodeScanner.vue'
import {
  MagnifyingGlassIcon, ClockIcon, PlusIcon, MinusIcon,
  ShoppingCartIcon, ShoppingBagIcon, TrashIcon, UserIcon,
  CreditCardIcon, ArrowPathIcon, CheckCircleIcon, PrinterIcon,
  BeakerIcon, CakeIcon, SparklesIcon, Squares2X2Icon,
  GlobeAltIcon, BanknotesIcon, DevicePhoneMobileIcon, XMarkIcon, QrCodeIcon,
} from '@heroicons/vue/24/outline'

// Inline CartContent component
const CartContent = defineComponent({
  props: ['cart','cartCount','cartTotal','members','paymentMethod','paymentMethods','cashReceived','processing','selectedMember'],
  emits: ['update:selectedMember','update:paymentMethod','update:cashReceived','updateQty','clear','checkout'],
  setup(props, { emit }) {
    const fmt = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v || 0)
    return () => h('div', { class: 'flex flex-col h-full' }, [
      // Header
      h('div', { class: 'px-5 py-3 border-b border-pink-100' }, [
        h('div', { class: 'flex items-center justify-between mb-3' }, [
          h('div', { class: 'flex items-center gap-2' }, [
            h(ShoppingCartIcon, { class: 'w-4 h-4 text-secondary' }),
            h('span', { class: 'font-semibold text-sm text-dark' }, 'Pesanan'),
            props.cart.length && h('span', { class: 'w-5 h-5 rounded-full bg-secondary text-white text-xs flex items-center justify-center font-bold' }, props.cartCount),
          ]),
          props.cart.length && h('button', { onClick: () => emit('clear'), class: 'text-xs text-red-400 hover:bg-red-50 px-2 py-1 rounded-lg flex items-center gap-1' }, [
            h(TrashIcon, { class: 'w-3 h-3' }), 'Hapus',
          ]),
        ]),
        h('div', { class: 'relative' }, [
          h(UserIcon, { class: 'w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2' }),
          h('select', {
            value: props.selectedMember,
            onChange: (e) => emit('update:selectedMember', e.target.value),
            class: 'input text-xs pl-8 py-2',
          }, [
            h('option', { value: '' }, 'Walk-in Customer'),
            ...props.members.map(m => h('option', { value: m.id }, m.name)),
          ]),
        ]),
      ]),
      // Items
      h('div', { class: 'flex-1 overflow-y-auto px-5 py-3' }, [
        !props.cart.length
          ? h('div', { class: 'flex flex-col items-center justify-center py-10 text-center' }, [
              h(ShoppingCartIcon, { class: 'w-10 h-10 text-pink-200 mb-2' }),
              h('p', { class: 'text-gray-400 text-sm' }, 'Keranjang kosong'),
            ])
          : h('div', { class: 'space-y-2' }, props.cart.map(item =>
              h('div', { key: item.id, class: 'flex items-center gap-2 p-2 rounded-xl hover:bg-pink-50' }, [
                h('div', { class: 'flex-1 min-w-0' }, [
                  h('p', { class: 'text-xs font-semibold text-dark truncate' }, item.name),
                  h('p', { class: 'text-xs text-secondary' }, fmt(item.price)),
                ]),
                h('div', { class: 'flex items-center gap-1 shrink-0' }, [
                  h('button', { onClick: () => emit('updateQty', item.id, item.qty - 1), class: 'w-6 h-6 rounded-lg bg-pink-100 text-secondary flex items-center justify-center' }, h(MinusIcon, { class: 'w-3 h-3' })),
                  h('span', { class: 'w-5 text-center text-xs font-bold' }, item.qty),
                  h('button', { onClick: () => emit('updateQty', item.id, item.qty + 1), disabled: item.qty >= item.stock, class: 'w-6 h-6 rounded-lg bg-primary text-white flex items-center justify-center disabled:opacity-40' }, h(PlusIcon, { class: 'w-3 h-3' })),
                ]),
              ])
            )),
      ]),
      // Footer
      h('div', { class: 'px-5 py-4 border-t border-pink-100 space-y-3' }, [
        h('div', { class: 'flex justify-between items-center' }, [
          h('span', { class: 'text-sm text-gray-500' }, 'Total'),
          h('span', { class: 'text-lg font-bold text-secondary' }, fmt(props.cartTotal)),
        ]),
        h('div', { class: 'grid grid-cols-3 gap-1.5' }, props.paymentMethods.map(pm =>
          h('button', {
            key: pm.value,
            onClick: () => emit('update:paymentMethod', pm.value),
            class: `flex flex-col items-center gap-1 py-2 rounded-xl border text-xs font-medium transition-all ${props.paymentMethod === pm.value ? 'bg-secondary text-white border-secondary' : 'bg-white text-gray-500 border-gray-200'}`,
          }, [h(pm.icon, { class: 'w-4 h-4' }), pm.label])
        )),
        props.paymentMethod === 'cash' && h('div', {}, [
          h('input', {
            type: 'number',
            value: props.cashReceived,
            onInput: (e) => emit('update:cashReceived', +e.target.value),
            class: 'input text-sm',
            placeholder: `Min. ${fmt(props.cartTotal)}`,
          }),
          props.cashReceived >= props.cartTotal && props.cashReceived > 0 && h('div', { class: 'flex justify-between mt-2 bg-green-50 px-3 py-2 rounded-xl text-xs' }, [
            h('span', { class: 'text-gray-500' }, 'Kembalian'),
            h('span', { class: 'font-bold text-green-600' }, fmt(props.cashReceived - props.cartTotal)),
          ]),
        ]),
        h('button', {
          onClick: () => emit('checkout'),
          disabled: !props.cart.length || props.processing || (props.paymentMethod === 'cash' && props.cashReceived < props.cartTotal),
          class: 'w-full btn-primary flex items-center justify-center gap-2 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed',
        }, [
          props.processing ? h(ArrowPathIcon, { class: 'w-4 h-4 animate-spin' }) : h(CreditCardIcon, { class: 'w-4 h-4' }),
          props.processing ? 'Memproses...' : 'Bayar Sekarang',
        ]),
      ]),
    ])
  },
})

const { payKantin, processing: midtransProcessing } = useMidtrans()
const toast              = useToast()
const showBarcodeScanner = ref(false)
const products           = ref([])
const members         = ref([])
const loadingProducts = ref(true)
const cart            = ref([])
const search          = ref('')
const filterCat       = ref('')
const selectedMember  = ref('')
const paymentMethod   = ref('cash')
const cashReceived    = ref(0)
const processing      = ref(false)
const receipt         = ref(null)
const currentTime     = ref('')
const shortTime       = ref('')
const receiptDate     = ref('')
const showCart        = ref(false)

let timer
onMounted(async () => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  await Promise.all([loadProducts(), loadMembers()])
})
onUnmounted(() => clearInterval(timer))

function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' })
  shortTime.value   = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

async function loadProducts() {
  const { data } = await api.get('/products', { params: { available: true } })
  products.value        = data
  loadingProducts.value = false
}

async function loadMembers() {
  const { data } = await api.get('/users', { params: { role: 'member' } })
  members.value = data.data || data
}

const categories = [
  { value: '',           label: 'Semua',    icon: Squares2X2Icon },
  { value: 'food',       label: 'Makanan',  icon: CakeIcon },
  { value: 'drink',      label: 'Minuman',  icon: BeakerIcon },
  { value: 'supplement', label: 'Suplemen', icon: SparklesIcon },
]

const paymentMethods = [
  { value: 'cash',     label: 'Tunai',    icon: BanknotesIcon },
  { value: 'qris',     label: 'QRIS',     icon: DevicePhoneMobileIcon },
  { value: 'debit',    label: 'Debit',    icon: CreditCardIcon },
  { value: 'midtrans', label: 'Midtrans', icon: GlobeAltIcon },
]

const categoryIcon    = (cat) => cat === 'drink' ? BeakerIcon : cat === 'supplement' ? SparklesIcon : CakeIcon
const filteredProducts = computed(() => {
  let list = products.value
  if (filterCat.value) list = list.filter(p => p.category === filterCat.value)
  if (search.value)    list = list.filter(p => p.name.toLowerCase().includes(search.value.toLowerCase()))
  return list
})

const cartCount = computed(() => cart.value.reduce((s, i) => s + i.qty, 0))
const cartTotal = computed(() => cart.value.reduce((s, i) => s + i.price * i.qty, 0))

function addToCart(product) {
  const existing = cart.value.find(i => i.id === product.id)
  if (existing) { if (existing.qty < product.stock) existing.qty++ }
  else cart.value.push({ ...product, qty: 1 })
}

function updateQty(id, qty) {
  if (qty <= 0) cart.value = cart.value.filter(i => i.id !== id)
  else { const item = cart.value.find(i => i.id === id); if (item) item.qty = qty }
}

function clearCart() { cart.value = []; cashReceived.value = 0; selectedMember.value = '' }

async function onBarcodeScanned(code) {
  showBarcodeScanner.value = false
  try {
    const { data } = await api.get('/products/barcode', { params: { barcode: code } })
    addToCart(data)
    toast.success(`${data.name} ditambahkan ke keranjang.`)
  } catch {
    toast.error(`Produk dengan barcode "${code}" tidak ditemukan.`)
  }
}

async function checkout() {
  if (!cart.value.length) return

  // Midtrans payment
  if (paymentMethod.value === 'midtrans') {
    const items = cart.value.map(i => ({ product_id: i.id, quantity: i.qty }))
    await payKantin(items, {
      onSuccess: (result) => {
        receiptDate.value = new Date().toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        receipt.value = {
          invoice_number: result.order_id,
          total_amount:   cartTotal.value,
          items:          cart.value.map(i => ({ name: i.name, quantity: i.qty, subtotal: i.price * i.qty })),
          cash_received:  null,
          change:         0,
          payment_method: 'midtrans',
        }
        loadProducts()
        clearCart()
        showCart.value = false
        toast.success('Pembayaran Midtrans berhasil!')
      },
      onPending: () => {
        clearCart()
        showCart.value = false
        toast.info('Pembayaran pending. Selesaikan pembayaran sesuai instruksi.')
      },
    })
    return
  }

  // Cash / QRIS / Debit — langsung
  processing.value = true
  try {
    const { data } = await api.post('/transactions', {
      items: cart.value.map(i => ({ product_id: i.id, quantity: i.qty })),
      payment_method: paymentMethod.value,
    })
    receiptDate.value = new Date().toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    receipt.value = {
      ...data,
      items: cart.value.map(i => ({ product_id: i.id, name: i.name, quantity: i.qty, subtotal: i.price * i.qty })),
      cash_received: paymentMethod.value === 'cash' ? cashReceived.value : null,
      change: paymentMethod.value === 'cash' ? cashReceived.value - cartTotal.value : 0,
    }
    await loadProducts()
    clearCart()
    toast.success('Transaksi berhasil!')
  } catch (e) {
    toast.apiError(e, 'Transaksi gagal.')
  } finally {
    processing.value = false
  }
}

function printReceipt() {
  const win = window.open('', '_blank', 'width=320,height=600')
  win.document.write(`<html><head><title>Struk</title><style>body{font-family:monospace;font-size:12px;padding:16px;max-width:280px;margin:0 auto}h2{text-align:center;margin:0 0 4px;font-size:16px}p{text-align:center;margin:2px 0;color:#666}hr{border:none;border-top:1px dashed #ccc;margin:10px 0}.row{display:flex;justify-content:space-between;margin:4px 0}.total{font-weight:bold;font-size:14px}.footer{text-align:center;margin-top:12px;color:#999;font-size:11px}</style></head><body><h2>S-FITNESS</h2><p>Kantin S-Fitness</p><p>${receiptDate.value}</p><hr><p style="text-align:left">${receipt.value.invoice_number}</p><hr>${receipt.value.items.map(i=>`<div class="row"><span>${i.name} x${i.quantity}</span><span>${formatRp(i.subtotal)}</span></div>`).join('')}<hr><div class="row total"><span>TOTAL</span><span>${formatRp(receipt.value.total_amount)}</span></div>${receipt.value.cash_received?`<div class="row"><span>Tunai</span><span>${formatRp(receipt.value.cash_received)}</span></div>`:''} ${receipt.value.change>0?`<div class="row"><span>Kembali</span><span>${formatRp(receipt.value.change)}</span></div>`:''}<hr><div class="footer">Terima kasih!<br>S-Fitness — Women Only</div></body></html>`)
  win.document.close()
  win.print()
}

const formatRp = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v || 0)
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); opacity: 0; }
</style>
