<template>
  <div class="min-h-screen bg-white font-sans overflow-x-hidden">

    <!-- ===== NAVBAR ===== -->
    <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      :class="scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-pink-100' : 'bg-transparent'">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md shadow-pink-200">
            <HeartIcon class="w-4 h-4 text-white" />
          </div>
          <span class="font-poppins font-bold text-xl text-secondary">S-Fitness</span>
        </div>

        <!-- Nav Links -->
        <div class="hidden md:flex items-center gap-8">
          <a v-for="link in navLinks" :key="link.href" :href="link.href"
            class="text-sm text-gray-500 hover:text-secondary transition-colors font-medium">
            {{ link.label }}
          </a>
        </div>

        <!-- CTA -->
        <div class="flex items-center gap-3">
          <RouterLink to="/login"
            class="text-sm font-semibold text-secondary hover:text-dark transition-colors hidden md:block">
            Masuk
          </RouterLink>
          <RouterLink to="/register"
            class="btn-primary text-sm py-2 px-5 shadow-md shadow-pink-200">
            Daftar Gratis
          </RouterLink>
        </div>
      </div>
    </nav>

    <!-- ===== HERO ===== -->
    <section class="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#fff0f6] via-white to-[#fce7f3]">
      <!-- Background blobs -->
      <div class="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 pointer-events-none" />
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4 pointer-events-none" />
      <div class="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-accent/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div class="max-w-6xl mx-auto px-6 pt-24 pb-16 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <!-- Left -->
        <div>
          <div class="inline-flex items-center gap-2 bg-pink-100 text-secondary text-xs font-semibold px-4 py-2 rounded-full mb-6">
            <SparklesIcon class="w-3.5 h-3.5" />
            Women Only Fitness Platform
          </div>
          <h1 class="font-poppins font-bold text-5xl md:text-6xl text-dark leading-tight mb-6">
            Sehat &amp; Percaya Diri
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary block">
              Bersama S-Fitness
            </span>
          </h1>
          <p class="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">
            Platform fitness khusus wanita yang aman, nyaman, dan privat. Booking kelas, pantau progress, dan nikmati kantin sehat — semua dalam satu tempat.
          </p>
          <div class="flex flex-wrap gap-3">
            <RouterLink to="/register"
              class="btn-primary flex items-center gap-2 shadow-lg shadow-pink-200 text-base py-3 px-7">
              Mulai Sekarang
              <ArrowRightIcon class="w-4 h-4" />
            </RouterLink>
            <a href="#classes"
              class="btn-outline flex items-center gap-2 text-base py-3 px-7">
              Lihat Kelas
            </a>
          </div>

          <!-- Stats -->
          <div class="flex gap-8 mt-10">
            <div v-for="stat in heroStats" :key="stat.label">
              <p class="font-poppins font-bold text-2xl text-dark">{{ stat.value }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ stat.label }}</p>
            </div>
          </div>
        </div>

        <!-- Right: Visual Card Stack -->
        <div class="relative hidden md:flex items-center justify-center h-[480px]">
          <!-- Main card -->
          <div class="absolute bg-white rounded-3xl shadow-2xl shadow-pink-200 p-6 w-72 top-8 right-8 border border-pink-100">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <CalendarDaysIcon class="w-5 h-5 text-white" />
              </div>
              <div>
                <p class="font-semibold text-sm text-dark">Zumba Morning</p>
                <p class="text-xs text-gray-400">Senin, 08:00 — Studio A</p>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex -space-x-2">
                <div v-for="i in 4" :key="i"
                  class="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                  :class="['bg-primary', 'bg-secondary', 'bg-pink-400', 'bg-pink-300'][i-1]">
                  {{ ['A','B','C','D'][i-1] }}
                </div>
                <div class="w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">+8</div>
              </div>
              <span class="bg-green-100 text-green-600 text-xs font-semibold px-2.5 py-1 rounded-full">12 slot</span>
            </div>
            <button class="w-full mt-4 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold py-2.5 rounded-xl">
              Booking Sekarang
            </button>
          </div>

          <!-- Floating card 2 -->
          <div class="absolute bg-white rounded-2xl shadow-xl shadow-pink-100 p-4 w-52 bottom-16 left-4 border border-pink-100">
            <div class="flex items-center gap-2 mb-3">
              <ShoppingBagIcon class="w-4 h-4 text-secondary" />
              <p class="text-xs font-semibold text-dark">Kantin Sehat</p>
            </div>
            <div class="space-y-2">
              <div v-for="item in kantinItems" :key="item.name"
                class="flex items-center justify-between">
                <span class="text-xs text-gray-500">{{ item.name }}</span>
                <span class="text-xs font-semibold text-secondary">{{ item.price }}</span>
              </div>
            </div>
          </div>

          <!-- Floating badge -->
          <div class="absolute top-4 left-12 bg-white rounded-2xl shadow-lg shadow-pink-100 px-4 py-3 border border-pink-100 flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center">
              <CheckCircleIcon class="w-4 h-4 text-accent" />
            </div>
            <div>
              <p class="text-xs font-bold text-dark">Women Only</p>
              <p class="text-xs text-gray-400">100% Privat & Aman</p>
            </div>
          </div>

          <!-- Floating notification -->
          <div class="absolute bottom-8 right-4 bg-white rounded-2xl shadow-lg shadow-pink-100 px-4 py-3 border border-pink-100 flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
              <HeartIcon class="w-4 h-4 text-primary" />
            </div>
            <div>
              <p class="text-xs font-bold text-dark">Booking Confirmed!</p>
              <p class="text-xs text-gray-400">Yoga Relaxation — Selasa</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Wave -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L60 69.3C120 58.7 240 37.3 360 32C480 26.7 600 37.3 720 42.7C840 48 960 48 1080 42.7C1200 37.3 1320 26.7 1380 21.3L1440 16V80H0Z" fill="white"/>
        </svg>
      </div>
    </section>

    <!-- ===== FEATURES ===== -->
    <section id="features" class="py-24 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-16">
          <span class="text-xs font-semibold text-secondary bg-pink-100 px-4 py-2 rounded-full">Kenapa S-Fitness?</span>
          <h2 class="font-poppins font-bold text-4xl text-dark mt-4 mb-4">Semua yang Kamu Butuhkan</h2>
          <p class="text-gray-400 max-w-md mx-auto">Platform lengkap yang dirancang khusus untuk kenyamanan dan privasi wanita</p>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <div v-for="feature in features" :key="feature.title"
            class="group p-6 rounded-3xl border border-pink-100 hover:border-primary hover:shadow-xl hover:shadow-pink-100 hover:-translate-y-1 transition-all duration-300 bg-white">
            <div :class="`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`">
              <component :is="feature.icon" :class="`w-7 h-7 ${feature.color}`" />
            </div>
            <h3 class="font-poppins font-semibold text-lg text-dark mb-2">{{ feature.title }}</h3>
            <p class="text-gray-400 text-sm leading-relaxed">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CLASSES ===== -->
    <section id="classes" class="py-24 bg-gradient-to-br from-[#fff0f6] to-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-16">
          <span class="text-xs font-semibold text-secondary bg-pink-100 px-4 py-2 rounded-full">Kelas Fitness</span>
          <h2 class="font-poppins font-bold text-4xl text-dark mt-4 mb-4">Pilih Kelas Favoritmu</h2>
          <p class="text-gray-400 max-w-md mx-auto">Berbagai pilihan kelas yang dipandu instruktur berpengalaman</p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div v-for="cls in classTypes" :key="cls.name"
            class="group relative overflow-hidden rounded-3xl cursor-pointer"
            @click="$router.push('/register')">
            <div :class="`h-52 bg-gradient-to-br ${cls.gradient} flex flex-col items-center justify-center p-6 transition-transform duration-300 group-hover:scale-105`">
              <component :is="cls.icon" class="w-12 h-12 text-white/80 mb-3" />
              <h3 class="font-poppins font-bold text-xl text-white">{{ cls.name }}</h3>
              <p class="text-white/70 text-xs mt-1">{{ cls.desc }}</p>
            </div>
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-end p-4 opacity-0 group-hover:opacity-100">
              <span class="bg-white text-secondary text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                <PlusIcon class="w-3 h-3" /> Daftar Sekarang
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== HOW IT WORKS ===== -->
    <section id="how" class="py-24 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-16">
          <span class="text-xs font-semibold text-secondary bg-pink-100 px-4 py-2 rounded-full">Cara Kerja</span>
          <h2 class="font-poppins font-bold text-4xl text-dark mt-4 mb-4">Mulai dalam 3 Langkah</h2>
          <p class="text-gray-400 max-w-md mx-auto">Mudah, cepat, dan langsung bisa digunakan</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 relative">
          <!-- Connector line -->
          <div class="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary to-secondary opacity-30" />

          <div v-for="(step, i) in steps" :key="step.title" class="text-center relative">
            <div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-5 shadow-lg shadow-pink-200 relative z-10">
              <component :is="step.icon" class="w-9 h-9 text-white" />
              <div class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-dark text-white text-xs font-bold flex items-center justify-center">
                {{ i + 1 }}
              </div>
            </div>
            <h3 class="font-poppins font-semibold text-lg text-dark mb-2">{{ step.title }}</h3>
            <p class="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== TESTIMONIALS ===== -->
    <section id="testimonials" class="py-24 bg-gradient-to-br from-[#fff0f6] to-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-16">
          <span class="text-xs font-semibold text-secondary bg-pink-100 px-4 py-2 rounded-full">Testimoni</span>
          <h2 class="font-poppins font-bold text-4xl text-dark mt-4 mb-4">Kata Mereka</h2>
          <p class="text-gray-400 max-w-md mx-auto">Member setia S-Fitness berbagi pengalaman mereka</p>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <div v-for="t in testimonials" :key="t.name"
            class="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm hover:shadow-lg hover:shadow-pink-100 transition-all duration-300">
            <!-- Stars -->
            <div class="flex gap-1 mb-4">
              <StarIcon v-for="i in 5" :key="i" class="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </div>
            <p class="text-gray-600 text-sm leading-relaxed mb-5">"{{ t.text }}"</p>
            <div class="flex items-center gap-3">
              <div :class="`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm`">
                {{ t.name.charAt(0) }}
              </div>
              <div>
                <p class="font-semibold text-sm text-dark">{{ t.name }}</p>
                <p class="text-xs text-gray-400">{{ t.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CTA BANNER ===== -->
    <section class="py-20 bg-gradient-to-r from-secondary via-primary to-pink-400 relative overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div class="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
      </div>
      <div class="max-w-3xl mx-auto px-6 text-center relative z-10">
        <h2 class="font-poppins font-bold text-4xl text-white mb-4">
          Siap Mulai Perjalanan Fitnesmu?
        </h2>
        <p class="text-white/80 text-lg mb-8">
          Bergabung dengan ratusan wanita yang sudah merasakan manfaat S-Fitness
        </p>
        <div class="flex flex-wrap gap-4 justify-center">
          <RouterLink to="/register"
            class="bg-white text-secondary font-bold px-8 py-3.5 rounded-2xl hover:bg-pink-50 transition-colors flex items-center gap-2 shadow-lg">
            Daftar Sekarang — Gratis!
            <ArrowRightIcon class="w-4 h-4" />
          </RouterLink>
          <RouterLink to="/login"
            class="border-2 border-white text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-white/10 transition-colors">
            Sudah Punya Akun
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ===== FOOTER ===== -->
    <footer class="bg-dark text-white py-16">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid md:grid-cols-4 gap-10 mb-12">
          <!-- Brand -->
          <div class="md:col-span-2">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <HeartIcon class="w-4 h-4 text-white" />
              </div>
              <span class="font-poppins font-bold text-xl">S-Fitness</span>
            </div>
            <p class="text-gray-400 text-sm leading-relaxed max-w-xs">
              Platform fitness digital khusus wanita yang aman, nyaman, dan empowering.
            </p>
            <p class="text-xs text-gray-500 mt-4 italic">
              "Safe, private, and empowering digital space for women to stay fit and confident."
            </p>
          </div>

          <!-- Links -->
          <div>
            <h4 class="font-semibold text-sm mb-4">Platform</h4>
            <ul class="space-y-2.5">
              <li v-for="link in footerLinks" :key="link">
                <a :href="`#${link.toLowerCase()}`" class="text-gray-400 text-sm hover:text-primary transition-colors">{{ link }}</a>
              </li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="font-semibold text-sm mb-4">Kontak</h4>
            <ul class="space-y-2.5">
              <li class="flex items-center gap-2 text-gray-400 text-sm">
                <EnvelopeIcon class="w-4 h-4 text-primary shrink-0" />
                hello@sfitness.id
              </li>
              <li class="flex items-center gap-2 text-gray-400 text-sm">
                <PhoneIcon class="w-4 h-4 text-primary shrink-0" />
                +62 812-3456-7890
              </li>
              <li class="flex items-center gap-2 text-gray-400 text-sm">
                <MapPinIcon class="w-4 h-4 text-primary shrink-0" />
                Jakarta, Indonesia
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p class="text-gray-500 text-sm">© 2025 S-Fitness. All rights reserved.</p>
          <p class="text-gray-500 text-sm flex items-center gap-1">
            Made with <HeartIcon class="w-3.5 h-3.5 text-primary inline" /> for women
          </p>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  HeartIcon, SparklesIcon, ArrowRightIcon, CalendarDaysIcon,
  ShoppingBagIcon, CheckCircleIcon, PlusIcon, StarIcon,
  UserGroupIcon, LockClosedIcon, DevicePhoneMobileIcon,
  ClipboardDocumentListIcon, EnvelopeIcon, PhoneIcon, MapPinIcon,
  BoltIcon, ShieldCheckIcon,
} from '@heroicons/vue/24/outline'

const scrolled = ref(false)

function onScroll() { scrolled.value = window.scrollY > 20 }
onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const navLinks = [
  { href: '#features',     label: 'Fitur' },
  { href: '#classes',      label: 'Kelas' },
  { href: '#how',          label: 'Cara Kerja' },
  { href: '#testimonials', label: 'Testimoni' },
]

const heroStats = [
  { value: '500+', label: 'Member Aktif' },
  { value: '20+',  label: 'Kelas / Bulan' },
  { value: '98%',  label: 'Kepuasan' },
]

const kantinItems = [
  { name: 'Jus Alpukat',  price: 'Rp 18.000' },
  { name: 'Salad Buah',   price: 'Rp 25.000' },
  { name: 'Protein Bar',  price: 'Rp 35.000' },
]

const features = [
  {
    icon: LockClosedIcon,
    title: 'Privat & Aman',
    desc: 'Lingkungan khusus wanita yang terjaga privasi dan keamanannya. Bebas bergerak tanpa rasa tidak nyaman.',
    bg: 'bg-pink-100', color: 'text-secondary',
  },
  {
    icon: CalendarDaysIcon,
    title: 'Booking Kelas Mudah',
    desc: 'Pilih kelas favoritmu, cek jadwal, dan booking dalam hitungan detik langsung dari smartphone.',
    bg: 'bg-purple-100', color: 'text-purple-500',
  },
  {
    icon: ShoppingBagIcon,
    title: 'Kantin Sehat',
    desc: 'Nikmati makanan dan minuman sehat langsung di tempat. Pesan via app, bayar di kasir.',
    bg: 'bg-green-100', color: 'text-green-600',
  },
  {
    icon: ClipboardDocumentListIcon,
    title: 'Pantau Progress',
    desc: 'Dashboard personal untuk memantau riwayat kelas, transaksi, dan aktivitas fitnesmu.',
    bg: 'bg-blue-100', color: 'text-blue-500',
  },
  {
    icon: UserGroupIcon,
    title: 'Komunitas Wanita',
    desc: 'Bergabung dengan komunitas wanita aktif yang saling mendukung dan memotivasi satu sama lain.',
    bg: 'bg-orange-100', color: 'text-orange-500',
  },
  {
    icon: BoltIcon,
    title: 'Akses 24/7',
    desc: 'Akses platform kapan saja dan di mana saja. Jadwal, riwayat, dan informasi selalu tersedia.',
    bg: 'bg-yellow-100', color: 'text-yellow-600',
  },
]

const classTypes = [
  {
    name: 'Zumba',
    desc: 'Dance & Fun Cardio',
    icon: SparklesIcon,
    gradient: 'from-pink-400 to-rose-500',
  },
  {
    name: 'Yoga',
    desc: 'Relax & Flexibility',
    icon: ShieldCheckIcon,
    gradient: 'from-purple-400 to-indigo-500',
  },
  {
    name: 'Pilates',
    desc: 'Core Strength',
    icon: BoltIcon,
    gradient: 'from-secondary to-pink-600',
  },
  {
    name: 'Aerobic',
    desc: 'Cardio & Endurance',
    icon: HeartIcon,
    gradient: 'from-orange-400 to-pink-500',
  },
]

const steps = [
  {
    icon: UserGroupIcon,
    title: 'Daftar Akun',
    desc: 'Buat akun gratis dalam 1 menit. Cukup nama, email, dan password.',
  },
  {
    icon: CalendarDaysIcon,
    title: 'Pilih Kelas',
    desc: 'Browse jadwal kelas, pilih yang sesuai, dan booking dengan satu klik.',
  },
  {
    icon: HeartIcon,
    title: 'Mulai Berlatih',
    desc: 'Datang ke studio, scan booking, dan nikmati sesi fitness terbaikmu!',
  },
]

const testimonials = [
  {
    name: 'Sari Dewi',
    role: 'Member sejak 2024',
    text: 'S-Fitness benar-benar mengubah rutinitas harianku. Kelas Zumba-nya seru banget dan suasananya nyaman karena sesama wanita semua!',
    gradient: 'from-primary to-secondary',
  },
  {
    name: 'Rina Putri',
    role: 'Member sejak 2024',
    text: 'Booking kelas jadi super gampang lewat app. Kantin sehatnya juga enak-enak, jadi makin semangat olahraga!',
    gradient: 'from-purple-400 to-pink-500',
  },
  {
    name: 'Maya Sari',
    role: 'Member sejak 2023',
    text: 'Akhirnya ada gym khusus wanita yang punya sistem digital. Bisa pantau progress dan riwayat kelas dari HP sendiri.',
    gradient: 'from-secondary to-pink-700',
  },
]

const footerLinks = ['Fitur', 'Kelas', 'Cara Kerja', 'Testimoni']
</script>
