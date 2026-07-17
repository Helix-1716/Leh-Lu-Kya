<template>
  <div class="animate-fade-in space-y-8">
    <header>
      <h1 class="text-3xl font-black text-kuli-blue mb-2 uppercase tracking-tight">Cargo Carry</h1>
      <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Bulk goods transfer</p>
    </header>

    <div class="card p-6 shadow-xl relative overflow-hidden flex flex-col items-center justify-center text-center space-y-4 py-16">
      <div class="w-20 h-20 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
      </div>
      <h2 class="text-xl font-black text-kuli-blue uppercase">Service Included</h2>
      <p class="text-xs text-gray-500 font-bold uppercase tracking-widest max-w-sm mx-auto">
        Trolleys for commercial goods and heavy logistics inside the railway network.
      </p>
      
      <button @click="$router.push({name: 'customer-book', query: { service: 'cargo' }})" class="btn btn-primary h-14 px-8 mt-6 text-lg font-black uppercase tracking-widest shadow-xl bg-orange-600 hover:bg-orange-700">
         Book Now
      </button>
    </div>
  </div>
</template>

<script setup>
</script>