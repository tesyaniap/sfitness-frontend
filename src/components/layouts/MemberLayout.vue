<template>
  <div class="min-h-screen bg-[#fdf6f9] flex">

    <!-- Sidebar — desktop only -->
    <aside class="hidden lg:flex w-64 bg-white border-r border-pink-100 flex-col shadow-sm shrink-0">
      <div class="px-6 py-5 border-b border-pink-100">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <HeartIcon class="w-4 h-4 text-white" />
          </div>
          <span class="font-poppins font-bold text-xl text-secondary">S-Fitness</span>
        </div>
        <p class="text-xs text-gray-400 mt-1 ml-10">Women Only</p>
      </div>

      <nav class="flex-1 px-3 py-4 space-y-0.5">
        <RouterLink v-for="item in navItems" :key="item.to" :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-pink-50 hover:text-secondary transition-all duration-150"
          active-class="bg-pink-50 text-secondary font-semibold">
          <component :is="item.icon" class="w-5 h-5 shrink-0" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="px-3 py-4 border-t border-pink-100">
        <div class="flex items-center gap-3 px-3 py-2 rounded-xl bg-pink-50 mb-2">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shrink-0">
            {{ auth.user?.name?.charAt(0)?.toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-dark truncate">{{ auth.user?.name }}</p>
            <p class="text-xs text-gray-400 truncate">{{ auth.user?.email }}</p>
          </div>
        </div>
        <button @click="handleLogout"
          class="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 py-2 rounded-xl transition-colors">
          <ArrowRightOnRectangleIcon class="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top bar -->
      <div class="bg-white border-b border-pink-100 px-4 lg:px-8 py-3 lg:py-4 flex items-center justify-between sticky top-0 z-20">
        <div class="flex items-center gap-3">
          <!-- Mobile logo -->
          <div class="flex lg:hidden items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <HeartIcon class="w-3.5 h-3.5 text-white" />
            </div>
            <span class="font-poppins font-bold text-lg text-secondary">S-Fitness</span>
          </div>
          <!-- Desktop greeting -->
          <div class="hidden lg:block">
            <p class="text-xs text-gray-400">Selamat datang kembali,</p>
            <p class="font-semibold text-dark text-sm">{{ auth.user?.name }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
            {{ auth.user?.name?.charAt(0)?.toUpperCase() }}
          </div>
          <!-- Mobile logout -->
          <button @click="handleLogout" class="lg:hidden p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
            <ArrowRightOnRectangleIcon class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Page content -->
      <main class="flex-1 overflow-auto p-4 lg:p-8 pb-24 lg:pb-8">
        <RouterView />
      </main>
    </div>

    <!-- Bottom Nav — mobile only -->
    <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-pink-100 z-30 safe-bottom">
      <div class="flex items-center justify-around px-2 py-2">
        <RouterLink v-for="item in mobileNav" :key="item.to" :to="item.to"
          class="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-gray-400 transition-all min-w-0"
          active-class="text-secondary">
          <component :is="item.icon" class="w-5 h-5 shrink-0" />
          <span class="text-[10px] font-medium truncate">{{ item.label }}</span>
        </RouterLink>
      </div>
    </nav>

  </div>
</template>

<script setup>
import {
  HomeIcon, CalendarDaysIcon, ShoppingBagIcon,
  ClipboardDocumentListIcon, ReceiptRefundIcon,
  UserCircleIcon, ArrowRightOnRectangleIcon, HeartIcon,
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'

const auth   = useAuthStore()
const router = useRouter()
const toast  = useToast()

const navItems = [
  { to: '/dashboard',          icon: HomeIcon,                  label: 'Dashboard' },
  { to: '/dashboard/classes',  icon: CalendarDaysIcon,          label: 'Kelas Fitness' },
  { to: '/dashboard/kantin',   icon: ShoppingBagIcon,           label: 'Kantin' },
  { to: '/dashboard/bookings', icon: ClipboardDocumentListIcon, label: 'Booking Saya' },
  { to: '/dashboard/orders',   icon: ReceiptRefundIcon,         label: 'Riwayat Beli' },
  { to: '/dashboard/profile',  icon: UserCircleIcon,            label: 'Profil' },
]

// Mobile bottom nav — max 5 items
const mobileNav = [
  { to: '/dashboard',          icon: HomeIcon,                  label: 'Home' },
  { to: '/dashboard/classes',  icon: CalendarDaysIcon,          label: 'Kelas' },
  { to: '/dashboard/kantin',   icon: ShoppingBagIcon,           label: 'Kantin' },
  { to: '/dashboard/bookings', icon: ClipboardDocumentListIcon, label: 'Booking' },
  { to: '/dashboard/profile',  icon: UserCircleIcon,            label: 'Profil' },
]

async function handleLogout() {
  await auth.logout()
  toast.info('Sampai jumpa! 👋')
  router.push('/login')
}
</script>
