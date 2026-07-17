<template>
  <div class="animate-fade-in space-y-8">
    <header>
      <h1 class="text-3xl font-black text-kuli-blue mb-2 uppercase tracking-tight">Luggage Move</h1>
      <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Standard Porter Service</p>
    </header>

    <!-- Specific Form for Luggage Move -->
    <!-- Similar to BookView but tailored to luggage -->
    <div class="card p-6 shadow-xl relative overflow-hidden flex flex-col items-center justify-center text-center space-y-4 py-16">
      <div class="w-20 h-20 bg-blue-50 text-kuli-blue rounded-2xl flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-baggage-claim"><path d="M22 18H6a2 2 0 0 1-2-2V7a2 2 0 0 0-2-2"/><path d="M17 14V4a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v10"/><rect width="13" height="8" x="8" y="6" rx="1"/><circle cx="18" cy="20" r="2"/><circle cx="9" cy="20" r="2"/></svg>
      </div>
      <h2 class="text-xl font-black text-kuli-blue uppercase">Service Included</h2>
      <p class="text-xs text-gray-500 font-bold uppercase tracking-widest max-w-sm mx-auto">
        Efficiently transfer multiple bags or suitcases across platforms with our designated porters.
      </p>
      
      <button @click="$router.push({name: 'customer-book', query: { service: 'luggage' }})" class="btn btn-primary h-14 px-8 mt-6 text-lg font-black uppercase tracking-widest shadow-xl">
         Book Now
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
</script>