import { useToast as useVueToast } from 'vue-toastification'

export function useToast() {
  const toast = useVueToast()

  return {
    success: (msg) => toast.success(msg),
    error:   (msg) => toast.error(msg),
    warning: (msg) => toast.warning(msg),
    info:    (msg) => toast.info(msg),

    // Helper untuk error dari axios
    apiError: (e, fallback = 'Terjadi kesalahan.') => {
      const errors  = e?.response?.data?.errors
      const message = errors
        ? Object.values(errors).flat()[0]
        : e?.response?.data?.message || fallback
      toast.error(message)
    },
  }
}
