<template>
  <div class="animate-fade-in space-y-8">
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
      <div>
        <h1 class="text-3xl font-black text-kuli-blue mb-2 uppercase tracking-tight">Wallet</h1>
        <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Manage your funds</p>
      </div>
      <div class="flex bg-white rounded-lg p-1 shadow border border-gray-100">
         <button class="px-6 py-2 rounded-md bg-kuli-station text-kuli-blue text-xs font-black uppercase shadow-sm">Balance</button>
         <button class="px-6 py-2 rounded-md text-gray-500 hover:text-kuli-blue text-xs font-black uppercase transition-colors">History</button>
      </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
       <!-- Balance Card -->
       <div class="md:col-span-1 card bg-kuli-blue text-white p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div class="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl"></div>
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-[#81ecff] mb-1">Available Balance</p>
            <h2 class="text-4xl font-black tracking-tighter">₹450.00</h2>
          </div>
          <div class="flex items-center gap-3">
             <button class="flex-1 bg-white text-kuli-blue py-3 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg hover:bg-gray-100 transition-colors">Add Money</button>
             <button class="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/10">
               <QrCodeIcon class="w-5 h-5 text-white" />
             </button>
          </div>
       </div>

       <!-- Quick Add & Stripe Integration Placeholder -->
       <div class="md:col-span-2 card p-6 shadow-xl border border-gray-100">
          <h3 class="text-xs font-black text-kuli-blue uppercase tracking-widest mb-6">Quick Add via Card (Stripe)</h3>
          
          <div class="grid grid-cols-3 gap-4 mb-6">
             <button v-for="amt in [100, 200, 500]" :key="amt" class="py-3 rounded-xl border-2 border-kuli-station text-kuli-blue font-black hover:border-kuli-red hover:text-kuli-red transition-all cursor-pointer">
                + ₹{{ amt }}
             </button>
          </div>

          <div class="p-4 bg-kuli-station rounded-xl border border-gray-200">
             <div class="flex items-center gap-4 mb-4">
                <CreditCardIcon class="w-6 h-6 text-gray-400" />
                <div class="flex-1">
                   <input type="text" placeholder="Card Number" class="w-full bg-transparent text-sm font-bold outline-none placeholder-gray-400">
                </div>
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" class="h-4 opacity-50 grayscale">
             </div>
             <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <input type="text" placeholder="MM/YY" class="bg-transparent text-sm font-bold outline-none placeholder-gray-400">
                <input type="text" placeholder="CVC" class="bg-transparent text-sm font-bold outline-none placeholder-gray-400">
             </div>
          </div>
          
          <button class="w-full mt-6 btn bg-black text-white hover:bg-kuli-blue h-14 text-sm font-black uppercase tracking-[0.2em] rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2">
            Securely Add Funds
            <ShieldCheckIcon class="w-4 h-4" />
          </button>
       </div>
    </div>
  </div>
</template>

<script setup>
import { 
  WalletIcon, 
  QrCodeIcon, 
  CreditCardIcon,
  ShieldCheckIcon
} from 'lucide-vue-next';
</script>
