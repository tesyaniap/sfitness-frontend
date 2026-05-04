<template>
  <div class="min-h-screen bg-gray-50 flex">

    <!-- Sidebar — desktop only -->
    <aside class="hidden lg:flex w-64 bg-white border-r border-pink-100 flex-col shadow-sm shrink-0">
      <div class="px-6 py-5 border-b border-pink-100">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <HeartIcon class="w-4 h-4 text-white" />
          </div>
          <span class="font-poppins font-bold text-xl text-secondary">S-Fitness</span>
        </div>
        <p class="text-xs text-gray-400 mt-1 ml-10">Admin Panel</p>
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
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-pink-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {{ auth.user?.name?.charAt(0)?.toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-dark truncate">{{ auth.user?.name }}</p>
            <p class="text-xs text-primary capitalize">{{ auth.user?.role?.replace('_', ' ') }}</p>
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
          <div class="flex lg:hidden items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <HeartIcon class="w-3.5 h-3.5 text-white" />
            </div>
            <span class="font-poppins font-bold text-lg text-secondary">S-Fitness</span>
          </div>
          <div class="hidden lg:block">
            <p class="text-xs text-gray-400">Admin Panel</p>
            <p class="font-semibold text-dark text-sm">{{ auth.user?.name }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs bg-pink-100 text-secondary font-semibold px-3 py-1 rounded-full capitalize hidden sm:block">
            {{ auth.user?.role?.replace('_', ' ') }}
          </span>
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
    <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-pink-100 z-30">
      <div class="flex items-center justify-around px-1 py-2">
        <RouterLink v-for="item in mobileNav" :key="item.to" :to="item.to"
          class="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-gray-400 transition-all min-w-0 flex-1"
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
  ChartBarIcon, CalendarDaysIcon, ShoppingBagIcon,
  UsersIcon, ReceiptRefundIcon, HeartIcon,
  ArrowRightOnRectangleIcon, CalculatorIcon,
  ClipboardDocumentListIcon, UserGroupIcon,
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'

const auth   = useAuthStore()
const router = useRouter()
const toast  = useToast()

const navItems = [
  { to: '/admin',              icon: ChartBarIcon,              label: 'Dashboard' },
  { to: '/admin/kasir',        icon: CalculatorIcon,            label: 'Kasir' },
  { to: '/admin/memberships',  icon: UserGroupIcon,             label: 'Membership' },
  { to: '/admin/attendance',   icon: ClipboardDocumentListIcon, label: 'Absensi' },
  { to: '/admin/classes',      icon: CalendarDaysIcon,          label: 'Kelas' },
  { to: '/admin/products',     icon: ShoppingBagIcon,           label: 'Produk Kantin' },
  { to: '/admin/members',      icon: UsersIcon,                 label: 'Member' },
  { to: '/admin/orders',       icon: ReceiptRefundIcon,         label: 'Transaksi' },
]

const mobileNav = [
  { to: '/admin',             icon: ChartBarIcon,              label: 'Dashboard' },
  { to: '/admin/kasir',       icon: CalculatorIcon,            label: 'Kasir' },
  { to: '/admin/memberships', icon: UserGroupIcon,             label: 'Member' },
  { to: '/admin/attendance',  icon: ClipboardDocumentListIcon, label: 'Absensi' },
  { to: '/admin/products',    icon: ShoppingBagIcon,           label: 'Produk' },
]

async function handleLogout() {
  await auth.logout()
  toast.info('Sampai jumpa! 👋')
  router.push('/login')
}
</script>
