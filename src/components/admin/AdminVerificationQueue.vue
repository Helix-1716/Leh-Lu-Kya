<template>
  <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
    <div class="px-6 py-5 bg-slate-900 text-white flex items-center justify-between relative overflow-hidden">
        <div class="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        <div class="relative z-10 flex items-center gap-3">
           <div class="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
             <UserCheck class="w-5 h-5 text-kuli-red" />
           </div>
           <div>
              <h2 class="text-sm font-black uppercase tracking-tight">Identity Registry</h2>
              <p class="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 leading-none">Verification Queue</p>
           </div>
        </div>
        <div v-if="requests.length" class="relative z-10 px-3 py-1 bg-kuli-red rounded-lg text-[9px] font-black uppercase">
           {{ requests.length }} Pending
        </div>
    </div>

    <div v-if="requests.length === 0" class="p-10 text-center space-y-3">
      <div class="w-16 h-16 bg-slate-50 text-slate-200 rounded-2xl flex items-center justify-center mx-auto border border-slate-100/50">
        <ShieldCheck class="w-8 h-8" />
      </div>
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed max-w-[120px] mx-auto">Queue Clear. No Pending Identities.</p>
    </div>

    <div v-else class="divide-y divide-slate-100 max-h-[440px] overflow-y-auto custom-scrollbar">
      <div v-for="req in requests" :key="req.id" 
           @click="$emit('select', req)"
           class="p-4 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group">
        <div class="flex items-center gap-4">
          <div class="w-11 h-11 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group-hover:border-kuli-red transition-all">
            <img :src="req.profilePhotoUrl" class="w-full h-full object-cover">
          </div>
          <div>
            <h4 class="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate max-w-[140px]">{{ req.fullName }}</h4>
            <div class="flex items-center gap-2 mt-0.5">
               <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ req.stationCode }}</span>
               <div class="w-1 h-1 bg-slate-200 rounded-full"></div>
               <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">{{ formatDate(req.submittedAt) }}</span>
            </div>
          </div>
        </div>
        
        <div class="flex items-center gap-4 shrink-0">
           <div class="text-right hidden sm:block">
             <p class="text-[8px] font-black text-slate-400 uppercase tracking-[0.1em] mb-0.5 leading-none">ID Number</p>
             <p class="text-[10px] font-mono font-bold text-slate-900 tracking-tighter">{{ req.idNumber }}</p>
           </div>
           <ChevronRight class="w-4 h-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  UserCheck, 
  ShieldCheck, 
  ChevronRight 
} from 'lucide-vue-next';

defineProps({
  requests: { type: Array, default: () => [] }
});

defineEmits(['select']);

const formatDate = (ts) => {
  if (!ts) return '';
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>
