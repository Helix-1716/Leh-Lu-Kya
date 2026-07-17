<template>
  <div class="animate-fade-in space-y-8">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-black text-slate-800 mb-2 uppercase tracking-tight">Booking Logs</h1>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Station Operation Records</p>
      </div>
      <div class="flex gap-4">
        <div class="relative">
          <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            v-model="search" 
            placeholder="Search ID/Customer..." 
            class="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-kuli-red w-64 bg-white"
          />
        </div>
      </div>
    </header>

    <div v-if="loading" class="py-24 flex flex-col items-center justify-center gap-6 animate-pulse">
       <div class="w-16 h-16 bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center relative border border-slate-100">
          <img src="/Images/Kuli Logo.png" class="w-full h-full object-contain relative z-10" alt="Kuli Logo">
          <div class="absolute inset-0 border-2 border-slate-100 border-t-kuli-red rounded-2xl animate-spin"></div>
       </div>
       <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Booking Ledger...</p>
    </div>

    <div v-else class="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-slate-50 border-b border-slate-100">
            <tr>
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ref ID</th>
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ポーター / Kuli</th>
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</th>
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Fare (₹)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="ride in filteredBookings" :key="ride.id" class="hover:bg-slate-50/50 transition-all cursor-pointer group">
              <td class="px-8 py-6">
                <span class="text-[10px] font-black text-kuli-red">#{{ ride.id?.substring(0, 8).toUpperCase() }}</span>
              </td>
              <td class="px-8 py-6">
                 <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                       {{ ride.kuliName ? ride.kuliName.charAt(0) : 'P' }}
                    </div>
                    <span class="text-xs font-black text-slate-800">{{ ride.kuliName || 'Unassigned' }}</span>
                 </div>
              </td>
              <td class="px-8 py-6">
                <span class="text-xs font-bold text-slate-500">{{ ride.customerName || 'Station User' }}</span>
              </td>
              <td class="px-8 py-6">
                <span class="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{{ ride.pickupLocation || ride.station || 'Platform' }}</span>
              </td>
              <td class="px-8 py-6">
                 <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border" :class="getStatusStyles(ride.status)">
                    <span v-if="isLive(ride.status)" class="w-1 h-1 bg-current rounded-full animate-pulse"></span>
                    {{ ride.status || 'requested' }}
                 </div>
              </td>
              <td class="px-8 py-6 text-right font-black text-slate-900 text-sm italic">
                ₹{{ ride.fare || ride.offeredFare || 0 }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredBookings.length === 0" class="py-24 text-center">
         <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <HistoryIcon class="w-8 h-8 text-slate-200" />
         </div>
         <h3 class="font-black text-slate-400 uppercase tracking-widest mb-1">Station Quiet</h3>
         <p class="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No matching operation logs found</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { HistoryIcon, SearchIcon } from 'lucide-vue-next';
import { adminService } from '../../services/adminService';

// State
const bookings = ref([]);
const loading = ref(true);
const search = ref('');

// Computed
const filteredBookings = computed(() => {
  if (!search.value) return bookings.value;
  const s = search.value.toLowerCase();
  return bookings.value.filter(b => 
    b.id.toLowerCase().includes(s) || 
    (b.kuliName && b.kuliName.toLowerCase().includes(s)) ||
    (b.customerName && b.customerName.toLowerCase().includes(s))
  );
});

// Helpers
const getStatusStyles = (status) => {
  const map = {
    'requested': 'bg-slate-50 text-slate-400 border-slate-100',
    'negotiating': 'bg-amber-50 text-amber-600 border-amber-100',
    'accepted': 'bg-blue-50 text-blue-600 border-blue-100',
    'in_progress': 'bg-green-50 text-green-600 border-green-100',
    'completed': 'bg-green-100 text-green-800 border-green-200',
    'cancelled': 'bg-red-50 text-red-600 border-red-100',
    'disputed': 'bg-red-900 text-white border-red-950'
  };
  return map[status] || map.requested;
};

const isLive = (status) => ['negotiating', 'in_progress', 'arriving'].includes(status);

// Sync
let unsubscribe = null;

onMounted(() => {
  unsubscribe = adminService.listenToLiveBookings((logs) => {
    bookings.value = logs;
    loading.value = false;
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});
</script>

