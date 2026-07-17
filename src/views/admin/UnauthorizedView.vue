<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
    <div class="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-8 animate-bounce-soft">
      <ShieldAlertIcon class="w-12 h-12" />
    </div>
    
    <h1 class="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Unauthorized Access</h1>
    <p class="text-lg text-slate-500 max-w-md mb-10 font-medium">
      This area is restricted to authorized Rail Officials. Your access attempt has been logged for security purposes.
    </p>

    <div class="flex flex-col sm:flex-row gap-4">
      <router-link :to="{name: 'admin-login'}" class="btn bg-slate-900 text-white px-8 h-14 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3">
        Try Admin Login
      </router-link>
      <router-link :to="{name: 'landing'}" class="btn border border-slate-200 text-slate-600 px-8 h-14 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3">
        Return Home
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ShieldAlertIcon } from 'lucide-vue-next';
</script>

<style scoped>
@keyframes bounceSoft {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-bounce-soft {
  animation: bounceSoft 3s ease-in-out infinite;
}
</style>
