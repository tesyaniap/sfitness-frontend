import { ref } from 'vue'
import api from '@/services/api'

export function useMidtrans() {
  const processing = ref(false)
  const error      = ref('')

  /**
   * Open Midtrans Snap popup
   * @param {string} snapToken
   * @param {object} callbacks - { onSuccess, onPending, onError, onClose }
   */
  function openSnap(snapToken, callbacks = {}) {
    window.snap.pay(snapToken, {
      onSuccess(result) {
        confirmPayment(result)
        callbacks.onSuccess?.(result)
      },
      onPending(result) {
        confirmPayment(result)
        callbacks.onPending?.(result)
      },
      onError(result) {
        error.value = 'Pembayaran gagal.'
        callbacks.onError?.(result)
      },
      onClose() {
        callbacks.onClose?.()
      },
    })
  }

  async function confirmPayment(result) {
    try {
      await api.post('/payment/confirm', {
        order_id:           result.order_id,
        transaction_status: result.transaction_status,
        fraud_status:       result.fraud_status,
        payment_type:       result.payment_type,
      })
    } catch (e) {
      console.error('Confirm payment error:', e)
    }
  }

  /**
   * Kantin checkout via Midtrans
   * @param {Array} items - [{ product_id, quantity }]
   * @param {object} callbacks
   */
  async function payKantin(items, callbacks = {}) {
    processing.value = true
    error.value      = ''
    try {
      const { data } = await api.post('/payment/kantin', { items })
      openSnap(data.snap_token, callbacks)
    } catch (e) {
      error.value = e.response?.data?.message || 'Gagal membuat pembayaran.'
      callbacks.onError?.(e)
    } finally {
      processing.value = false
    }
  }

  /**
   * Booking kelas via Midtrans
   * @param {number} classId
   * @param {object} callbacks
   */
  async function payBooking(classId, callbacks = {}) {
    processing.value = true
    error.value      = ''
    try {
      const { data } = await api.post(`/payment/booking/${classId}`)
      openSnap(data.snap_token, callbacks)
    } catch (e) {
      error.value = e.response?.data?.message || 'Gagal membuat pembayaran.'
      callbacks.onError?.(e)
    } finally {
      processing.value = false
    }
  }

  return { processing, error, payKantin, payBooking }
}
