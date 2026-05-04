import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  const total = computed(() =>
    items.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
  )
  const count = computed(() =>
    items.value.reduce((sum, i) => sum + i.quantity, 0)
  )

  function addItem(product) {
    const existing = items.value.find(i => i.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  function removeItem(productId) {
    items.value = items.value.filter(i => i.id !== productId)
  }

  function updateQty(productId, qty) {
    const item = items.value.find(i => i.id === productId)
    if (item) {
      qty <= 0 ? removeItem(productId) : (item.quantity = qty)
    }
  }

  function clear() {
    items.value = []
  }

  return { items, total, count, addItem, removeItem, updateQty, clear }
})
