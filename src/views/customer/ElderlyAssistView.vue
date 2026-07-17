<template>
  <div class="animate-fade-in space-y-8">
    <header>
      <h1 class="text-3xl font-black text-kuli-blue mb-2 uppercase tracking-tight">Elderly Assist</h1>
      <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Platform Assistance</p>
    </header>

    <div class="card p-6 shadow-xl relative overflow-hidden flex flex-col items-center justify-center text-center space-y-4 py-16">
      <div class="w-20 h-20 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-person-standing"><circle cx="12" cy="5" r="1"/><path d="m9 20 3-6 3 6"/><path d="m6 8 6 2 6-2"/><path d="M12 10v4"/></svg>
      </div>
      <h2 class="text-xl font-black text-kuli-blue uppercase">Service Included</h2>
      <p class="text-xs text-gray-500 font-bold uppercase tracking-widest max-w-sm mx-auto">
        Personal assistant to guide elderly family members safely to trains, navigate crowds, and carry light baggage.
      </p>
      
      <button @click="$router.push({name: 'customer-book', query: { service: 'elderly' }})" class="btn btn-primary h-14 px-8 mt-6 text-lg font-black uppercase tracking-widest shadow-xl bg-green-600 hover:bg-green-700">
         Book Now
      </button>
    </div>
  </div>
</template>

<script setup>
</script>