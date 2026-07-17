<template>
  <div class="animate-fade-in space-y-8">
    <header>
      <h1 class="text-3xl font-black text-kuli-blue mb-2 uppercase tracking-tight">Wallet & Earnings</h1>
      <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Track your daily income</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
       <!-- Balance Card -->
       <div class="md:col-span-1 card bg-kuli-blue text-white p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div class="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl"></div>
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-[#81ecff] mb-1">Total Earnings (This Week)</p>
            <h2 class="text-4xl font-black tracking-tighter">{{ formatCurrency(walletBalance) }}</h2>
          </div>
          <div>
            <button class="w-full bg-white text-kuli-blue py-3 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg hover:bg-gray-100 transition-colors">Withdraw Funds</button>
          </div>
       </div>

       <div class="md:col-span-2 card p-6 shadow-xl border border-gray-100 flex flex-col justify-center items-center text-center min-h-[220px]">
          <div class="w-20 h-20 bg-kuli-station rounded-full flex items-center justify-center text-kuli-blue mb-4">
             <BarChart3Icon class="w-10 h-10" />
          </div>
          <h4 class="text-sm font-black text-kuli-blue uppercase tracking-widest mb-1">Payout History</h4>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Connect your bank account to start receiving automated payouts</p>
          <button class="btn btn-primary px-6 h-10 mt-4 shadow-xl">Setup Payouts</button>
       </div>
    </div>
  </div>
</template>

<script setup>
import { BarChart3Icon } from 'lucide-vue-next';
import { useAuthStore } from '../../stores/auth';
import { computed } from 'vue';

const authStore = useAuthStore();
const walletBalance = computed(() => authStore.userData?.wallet || 0);

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};
</script>
