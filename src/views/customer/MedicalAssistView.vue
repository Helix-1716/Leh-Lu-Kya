<template>
  <div class="animate-fade-in space-y-8">
    <header>
      <h1 class="text-3xl font-black text-kuli-blue mb-2 uppercase tracking-tight">Medical Assist</h1>
      <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Wheelchair & Support</p>
    </header>

    <div class="card p-6 shadow-xl relative overflow-hidden flex flex-col items-center justify-center text-center space-y-4 py-16">
      <div class="w-20 h-20 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-accessibility"><circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1"/><path d="m5 8 3-3 5.5 3-2.36 3.5"/><path d="M4.24 14.5a5 5 0 0 0 6.88 6"/><path d="M13.76 17.5a5 5 0 0 0-6.88-6"/></svg>
      </div>
      <h2 class="text-xl font-black text-kuli-blue uppercase">Service Included</h2>
      <p class="text-xs text-gray-500 font-bold uppercase tracking-widest max-w-sm mx-auto">
        Priority wheelchair allocation and expert handling for differently abled passengers.
      </p>
      
      <button @click="$router.push({name: 'customer-book', query: { service: 'medical' }})" class="btn btn-primary h-14 px-8 mt-6 text-lg font-black uppercase tracking-widest shadow-xl bg-red-600 hover:bg-red-700">
         Book Now
      </button>
    </div>
  </div>
</template>

<script setup>
</script>