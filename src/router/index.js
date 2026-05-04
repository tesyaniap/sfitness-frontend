import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  // Landing Page — public
  { path: '/', name: 'Landing', component: () => import('@/views/LandingPage.vue') },

  // Auth
  { path: '/login',    name: 'Login',    component: () => import('@/views/auth/LoginView.vue'),    meta: { guest: true } },
  { path: '/register', name: 'Register', component: () => import('@/views/auth/RegisterView.vue'), meta: { guest: true } },

  // Member
  {
    path: '/dashboard',
    component: () => import('@/components/layouts/MemberLayout.vue'),
    meta: { auth: true, role: 'member' },
    children: [
      { path: '',        name: 'MemberDashboard', component: () => import('@/views/member/DashboardView.vue') },
      { path: 'classes', name: 'Classes',         component: () => import('@/views/member/ClassesView.vue') },
      { path: 'kantin',  name: 'Kantin',          component: () => import('@/views/member/KantinView.vue') },
      { path: 'bookings',name: 'MyBookings',      component: () => import('@/views/member/BookingsView.vue') },
      { path: 'orders',  name: 'MyOrders',        component: () => import('@/views/member/OrdersView.vue') },
      { path: 'profile', name: 'Profile',         component: () => import('@/views/member/ProfileView.vue') },
    ],
  },

  // Admin
  {
    path: '/admin',
    component: () => import('@/components/layouts/AdminLayout.vue'),
    meta: { auth: true, role: 'admin' },
    children: [
      { path: '',         name: 'AdminDashboard', component: () => import('@/views/admin/DashboardView.vue') },
      { path: 'classes',  name: 'AdminClasses',   component: () => import('@/views/admin/ClassesView.vue') },
      { path: 'products', name: 'AdminProducts',  component: () => import('@/views/admin/ProductsView.vue') },
      { path: 'members',  name: 'AdminMembers',   component: () => import('@/views/admin/MembersView.vue') },
      { path: 'orders',   name: 'AdminOrders',    component: () => import('@/views/admin/OrdersView.vue') },
      { path: 'kasir',       name: 'AdminKasir',       component: () => import('@/views/admin/KasirView.vue') },
      { path: 'memberships',  name: 'AdminMemberships', component: () => import('@/views/admin/gym/MembershipsView.vue') },
      { path: 'attendance',   name: 'AdminAttendance',  component: () => import('@/views/admin/gym/AttendanceView.vue') },
    ],
  },

  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.guest && auth.isLoggedIn) {
    return auth.isAdmin ? '/admin' : '/dashboard'
  }

  if (to.meta.auth && !auth.isLoggedIn) {
    return '/login'
  }

  if (to.meta.role === 'admin' && !auth.isAdmin) {
    return '/dashboard'
  }

  if (to.meta.role === 'member' && auth.isAdmin) {
    return '/admin'
  }
})

export default router
