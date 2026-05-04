<template>
  <div>
    <div class="mb-4">
      <h2 class="font-poppins font-bold text-2xl text-dark">Kantin</h2>
      <p class="text-gray-400 text-sm mt-1">Pilih makanan & minuman sehat untuk kamu</p>
    </div>

    <!-- Filter -->
    <div class="flex gap-2 mb-4 flex-wrap">
      <button v-for="c in categories" :key="c.value"
        @click="filter = c.value"
        :class="filter === c.value
          ? 'bg-secondary text-white shadow-sm shadow-pink-200'
          : 'bg-white text-gray-500 border border-gray-200 hover:border-primary hover:text-secondary'"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all">
        <component :is="c.icon" class="w-3.5 h-3.5" />
        {{ c.label }}
      </button>
    </div>

    <div class="flex gap-5">
      <!-- Products -->
      <div class="flex-1 min-w-0">
        <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <div v-for="i in 6" :key="i" class="card animate-pulse h-44 bg-pink-50" />
        </div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <div v-for="p in filteredProducts" :key="p.id"
            class="card !p-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
            <div class="w-full h-20 sm:h-24 bg-gradient-to-br from-pink-50 to-highlight rounded-xl mb-2.5 flex items-center justify-center">
              <component :is="categoryIcon(p.category)" class="w-8 h-8 text-primary/60" />
            </div>
            <h3 class="font-semibold text-xs text-dark line-clamp-2 flex-1">{{ p.name }}</h3>
            <p class="text-secondary font-bold text-xs mt-1">{{ formatRp(p.price) }}</p>
            <p class="text-gray-400 text-xs mt-0.5">Stok: {{ p.stock }}</p>
            <button @click="addItem(p)"
              :disabled="p.stock <= 0"
              class="btn-primary w-full mt-2 text-xs py-1.5 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed">
              <PlusIcon class="w-3 h-3" />
              Tambah
            </button>
          </div>
        </div>
      </div>

      <!-- Cart — desktop sidebar -->
      <div class="hidden lg:block w-72 shrink-0">
        <div class="bg-white rounded-2xl border border-pink-100 shadow-sm sticky top-6">
          <CartPanel :items="cartItems" :total="cartTotal"
            @update="updateQty" @checkout="checkout" :checking-out="checkingOut" />
        </div>
      </div>
    </div>

    <!-- Mobile Cart FAB -->
    <button v-if="cartItems.length" @click="showCart = true"
      class="lg:hidden fixed bottom-20 right-4 z-40 bg-secondary text-white rounded-2xl px-4 py-3 shadow-lg shadow-pink-300 flex items-center gap-2 font-semibold text-sm">
      <ShoppingCartIcon class="w-5 h-5" />
      {{ cartItems.length }} item · {{ formatRp(cartTotal) }}
    </button>

    <!-- Mobile Cart Drawer -->
    <Transition name="slide-up">
      <div v-if="showCart" class="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
        <div class="absolute inset-0 bg-black/40" @click="showCart = false" />
        <div class="relative bg-white rounded-t-3xl max-h-[85vh] flex flex-col">
          <div class="flex items-center justify-between px-5 py-4 border-b border-pink-100">
            <h3 class="font-semibold text-dark flex items-center gap-2">
              <ShoppingCartIcon class="w-5 h-5 text-secondary" />
              Keranjang
            </h3>
            <button @click="showCart = false" class="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center">
              <XMarkIcon class="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div class="flex-1 overflow-y-auto">
            <CartPanel :items="cartItems" :total="cartTotal"
              @update="updateQty" @checkout="checkoutMobile" :checking-out="checkingOut" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineComponent, h } from 'vue'
import { useCartStore } from '@/stores/cart'
import api from '@/services/api'
import { useMidtrans } from '@/composables/useMidtrans'
import { useToast } from '@/composables/useToast'
import {
  ShoppingCartIcon, PlusIcon, MinusIcon, XMarkIcon,
  CreditCardIcon, ArrowPathIcon, Squares2X2Icon,
  BeakerIcon, CakeIcon, SparklesIcon,
} from '@heroicons/vue/24/outline'

// Cart Panel component (inline)
const CartPanel = defineComponent({
  props: ['items', 'total', 'checkingOut'],
  emits: ['update', 'checkout'],
  setup(props, { emit }) {
    const formatRp = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v || 0)
    return () => h('div', { class: 'p-5' }, [
      !props.items.length
        ? h('div', { class: 'text-center py-10' }, [
            h(ShoppingCartIcon, { class: 'w-10 h-10 text-pink-200 mx-auto mb-2' }),
            h('p', { class: 'text-gray-400 text-sm' }, 'Keranjang kosong'),
          ])
        : h('div', { class: 'space-y-3 mb-4' }, props.items.map(item =>
            h('div', { key: item.id, class: 'flex items-center gap-3 p-2 rounded-xl hover:bg-pink-50 transition-colors' }, [
              h('div', { class: 'flex-1 min-w-0' }, [
                h('p', { class: 'text-xs font-semibold text-dark truncate' }, item.name),
                h('p', { class: 'text-xs text-secondary' }, formatRp(item.price)),
              ]),
              h('div', { class: 'flex items-center gap-1.5 shrink-0' }, [
                h('button', { onClick: () => emit('update', item.id, item.quantity - 1), class: 'w-6 h-6 rounded-lg bg-pink-100 text-secondary flex items-center justify-center hover:bg-pink-200' }, h(MinusIcon, { class: 'w-3 h-3' })),
                h('span', { class: 'w-5 text-center text-xs font-bold' }, item.quantity),
                h('button', { onClick: () => emit('update', item.id, item.quantity + 1), class: 'w-6 h-6 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-secondary' }, h(PlusIcon, { class: 'w-3 h-3' })),
              ]),
            ])
          )),
      props.items.length && h('div', { class: 'border-t border-pink-100 pt-4 space-y-3' }, [
        h('div', { class: 'flex justify-between items-center' }, [
          h('span', { class: 'text-sm text-gray-500' }, 'Total'),
          h('span', { class: 'font-bold text-secondary' }, formatRp(props.total)),
        ]),
        h('button', {
          onClick: () => emit('checkout'),
          disabled: props.checkingOut,
          class: 'w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50',
        }, [
          props.checkingOut ? h(ArrowPathIcon, { class: 'w-4 h-4 animate-spin' }) : h(CreditCardIcon, { class: 'w-4 h-4' }),
          props.checkingOut ? 'Memproses...' : 'Checkout',
        ]),
      ]),
    ])
  },
})

const cart        = useCartStore()
const { payKantin, processing: midtransProcessing, error: midtransError } = useMidtrans()
const toast       = useToast()
const products    = ref([])
const loading     = ref(true)
const checkingOut = computed(() => midtransProcessing.value)
const filter      = ref('')
const showCart    = ref(false)

const cartItems = computed(() => cart.items)
const cartTotal = computed(() => cart.total)

const categories = [
  { value: '',           label: 'Semua',    icon: Squares2X2Icon },
  { value: 'food',       label: 'Makanan',  icon: CakeIcon },
  { value: 'drink',      label: 'Minuman',  icon: BeakerIcon },
  { value: 'supplement', label: 'Suplemen', icon: SparklesIcon },
]

const categoryIcon = (cat) => cat === 'drink' ? BeakerIcon : cat === 'supplement' ? SparklesIcon : CakeIcon

const filteredProducts = computed(() =>
  filter.value ? products.value.filter(p => p.category === filter.value) : products.value
)

onMounted(async () => {
  const { data } = await api.get('/products', { params: { available: true } })
  products.value = data
  loading.value  = false
})

function addItem(p) { cart.addItem(p) }
function updateQty(id, qty) { cart.updateQty(id, qty) }

async function doCheckout() {
  if (!cart.items.length) return
  const items = cart.items.map(i => ({ product_id: i.id, quantity: i.quantity }))
  await payKantin(items, {
    onSuccess: () => {
      cart.clear()
      showCart.value = false
      toast.success('Pembayaran berhasil! Terima kasih 🎉')
    },
    onPending: () => {
      cart.clear()
      showCart.value = false
      toast.info('Pembayaran pending. Selesaikan pembayaran sesuai instruksi.')
    },
    onError: () => toast.error(midtransError.value || 'Pembayaran gagal.'),
  })
}

function checkout() { doCheckout() }
function checkoutMobile() { doCheckout(); showCart.value = false }

const formatRp = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); opacity: 0; }
</style>
