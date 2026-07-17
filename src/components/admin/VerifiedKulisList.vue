<template>
  <div class="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col max-h-[440px] overflow-hidden">
    <!-- Header -->
    <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <BadgeCheck class="w-5 h-5" />
        </div>
        <h3 class="text-xs font-black text-slate-900 uppercase tracking-widest">Verified Kulis</h3>
      </div>
      <span class="text-[10px] font-black text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-lg">
        {{ verifiedKulis.length }} TOTAL
      </span>
    </div>

    <!-- Search/Filter (Optional but nice) -->
    <div class="px-6 py-3 bg-white border-b border-slate-50">
      <div class="relative">
        <input v-model="searchQuery" 
               type="text" 
               placeholder="Search by ID or Name..." 
               class="w-full pl-8 pr-4 py-2 bg-slate-50 rounded-xl border border-transparent focus:border-blue-100 focus:bg-white outline-none text-[10px] font-bold text-slate-600 transition-all">
        <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
      </div>
    </div>

    <!-- Scrollable List -->
    <div class="flex-1 overflow-y-auto custom-scrollbar p-2">
      <div v-if="filteredKulis.length > 0" class="space-y-1">
        <div v-for="kuli in filteredKulis" :key="kuli.id" class="p-3 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
             <img v-if="kuli.customPhotoURL || kuli.photoURL" :src="kuli.customPhotoURL || kuli.photoURL" class="w-full h-full object-cover">
             <div v-else class="w-full h-full flex items-center justify-center text-slate-300">
               <User class="w-4 h-4" />
             </div>
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-[11px] font-black text-slate-900 uppercase truncate mb-0.5">{{ kuli.name || 'Official Porter' }}</h4>
            <div class="flex items-center gap-2">
              <span class="text-[9px] font-mono font-black text-blue-600 bg-blue-50 px-1.5 rounded uppercase">{{ kuli.kuliId || 'NO ID' }}</span>
              <span class="text-[8px] font-bold text-slate-400 uppercase tracking-tighter truncate">{{ kuli.station || 'Station T1' }}</span>
            </div>
          </div>
          <button @click="$emit('view', kuli)" class="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-sm">
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="h-full flex flex-col items-center justify-center py-12 text-center select-none">
        <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-3">
          <BadgeCheck class="w-6 h-6 text-slate-200" />
        </div>
        <p class="text-[9px] font-black text-slate-300 uppercase tracking-widest">No verified porters</p>
      </div>
    </div>

    <!-- Footer Action -->
    <div class="p-4 bg-slate-50 border-t border-slate-100 text-center">
      <button class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-blue-600 transition-colors">
        Export Registry CSV
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { BadgeCheck, User, Search, ChevronRight } from 'lucide-vue-next';
import { adminService } from '../../services/adminService';

const props = defineProps({
  // Optional: can pass initial list if already fetched
});

defineEmits(['view']);

const verifiedKulis = ref([]);
const searchQuery = ref('');
const loading = ref(true);
let unsub = null;

const filteredKulis = computed(() => {
  if (!searchQuery.value) return verifiedKulis.value;
  const q = searchQuery.value.toLowerCase();
  return verifiedKulis.value.filter(k => 
    (k.name?.toLowerCase().includes(q)) || 
    (k.kuliId?.toLowerCase().includes(q))
  );
});

onMounted(() => {
  unsub = adminService.listenToUsers('kuli', (kulis) => {
    // Only show the ones that are actually verified
    verifiedKulis.value = kulis.filter(k => k.verificationStatus === 'verified' || k.isVerified);
    loading.value = false;
  });
});

onUnmounted(() => {
  if (unsub) unsub();
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 3px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>
