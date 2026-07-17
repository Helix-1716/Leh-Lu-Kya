<template>
  <div class="animate-fade-in space-y-8">
    <header>
      <h1 class="text-3xl font-black text-red-600 mb-2 uppercase tracking-tight">Emergency SOS</h1>
      <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Instant support and safety actions</p>
    </header>

    <div class="card p-6 md:p-8 bg-red-600 text-white border-red-700 shadow-2xl relative overflow-hidden">
      <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-16 -translate-y-16"></div>
      <div class="relative z-10">
        <div class="flex items-start gap-4 mb-6">
          <div class="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
            <ShieldAlertIcon class="w-7 h-7" />
          </div>
          <div>
            <h2 class="text-2xl font-black uppercase tracking-tight">Need immediate help?</h2>
            <p class="text-sm font-bold text-red-100 mt-1">Our team can assist during active trip incidents.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a href="tel:112" class="h-12 rounded-xl bg-white text-red-600 font-black uppercase tracking-widest text-xs inline-flex items-center justify-center gap-2 hover:bg-red-50 transition-colors">
            <PhoneIcon class="w-4 h-4" /> Call 112
          </a>
          <a href="tel:139" class="h-12 rounded-xl bg-white/15 border border-white/25 text-white font-black uppercase tracking-widest text-xs inline-flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
            <PhoneIcon class="w-4 h-4" /> Rail Helpline 139
          </a>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div class="card p-5 border-kuli-earth-dark">
        <h3 class="text-sm font-black text-kuli-blue uppercase tracking-widest mb-4">What to share</h3>
        <ul class="space-y-3 text-xs font-bold text-gray-600">
          <li class="flex items-start gap-2"><span class="mt-0.5 w-2 h-2 bg-kuli-red rounded-full"></span> Current station and platform number</li>
          <li class="flex items-start gap-2"><span class="mt-0.5 w-2 h-2 bg-kuli-red rounded-full"></span> Booking ID and porter badge details</li>
          <li class="flex items-start gap-2"><span class="mt-0.5 w-2 h-2 bg-kuli-red rounded-full"></span> Brief issue summary and immediate risk level</li>
        </ul>
      </div>

      <div class="card p-5 border-kuli-earth-dark">
        <h3 class="text-sm font-black text-kuli-blue uppercase tracking-widest mb-4">Safety shortcuts</h3>
        <div class="space-y-3">
          <router-link :to="{ name: 'safety' }" class="w-full h-11 rounded-xl border border-kuli-earth-dark text-kuli-blue font-black uppercase tracking-widest text-xs inline-flex items-center justify-between px-4 hover:border-kuli-red hover:text-kuli-red transition-colors">
            Safety Guidelines
            <ChevronRightIcon class="w-4 h-4" />
          </router-link>
          <router-link :to="{ name: 'customer-recent-bookings' }" class="w-full h-11 rounded-xl border border-kuli-earth-dark text-kuli-blue font-black uppercase tracking-widest text-xs inline-flex items-center justify-between px-4 hover:border-kuli-red hover:text-kuli-red transition-colors">
            Open Recent Bookings
            <ChevronRightIcon class="w-4 h-4" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ShieldAlertIcon, PhoneIcon, ChevronRightIcon } from 'lucide-vue-next';
</script>
