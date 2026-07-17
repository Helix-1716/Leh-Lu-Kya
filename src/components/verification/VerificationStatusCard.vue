<template>
  <div class="w-full flex items-center gap-4 p-5 rounded-[2.5rem] border-2 transition-all duration-300 shadow-sm relative overflow-hidden"
       :class="[
         status === 'verified' ? 'border-blue-500/30 bg-blue-50/50' : 
         status === 'pending' ? 'border-amber-400/30 bg-amber-50/30' : 
         status === 'rejected' ? 'border-red-400/30 bg-red-50/30' : 'border-slate-100 bg-white'
       ]">
    
    <!-- 1. LEFT: Icon Container (Fixed Size) -->
    <div class="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border"
         :class="[
           status === 'verified' ? 'bg-blue-600 text-white border-blue-700' : 
           status === 'pending' ? 'bg-amber-100 text-amber-600 border-amber-200' : 
           status === 'rejected' ? 'bg-red-100 text-red-500 border-red-200' : 'bg-slate-50 text-slate-300 border-slate-100'
         ]">
      <VerifiedIcon v-if="status === 'verified'" class="w-7 h-7" />
      <ClockIcon v-else-if="status === 'pending'" class="w-7 h-7" />
      <AlertCircleIcon v-else-if="status === 'rejected'" class="w-7 h-7" />
      <ShieldIcon v-else class="w-7 h-7" />
    </div>
    
    <!-- 2. CENTER: Text Content (Flexible) -->
    <div class="flex-1 min-w-0 flex flex-col justify-center">
      <h3 class="text-[11px] md:text-xs font-black uppercase tracking-[0.2em] leading-tight mb-1 truncate"
          :class="status === 'verified' ? 'text-blue-900' : 'text-slate-900'">
        Identity Verification
      </h3>
      <p class="text-[10px] md:text-[11px] font-bold leading-relaxed line-clamp-2"
         :class="status === 'verified' ? 'text-blue-600/70' : 'text-slate-400'">
        {{ statusLabel }}
      </p>
      
      <div v-if="status === 'verified' && kuliId" class="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-white border border-blue-100 rounded-lg w-max">
        <span class="text-[7px] font-black text-blue-300 uppercase">KULI ID</span>
        <span class="text-[9px] font-black text-blue-600 font-mono">{{ kuliId }}</span>
      </div>
    </div>

    <!-- 3. RIGHT: Action Area (Fixed Size / No Overlap) -->
    <div class="shrink-0 flex items-center justify-end">
      <div v-if="status === 'unverified' || status === 'rejected'" 
           @click="$emit('open-modal')"
           class="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:bg-black transition-all active:scale-95 group/btn">
        <ArrowRightIcon class="w-5 h-5 transition-transform group-hover/btn:translate-x-0.5" />
      </div>
      
      <div v-else-if="status === 'pending'" class="px-4 py-2 bg-amber-100 border border-amber-200 rounded-xl">
        <span class="text-[8px] font-black text-amber-700 uppercase tracking-widest">Awaiting Seal</span>
      </div>

      <div v-else-if="status === 'verified'" 
           @click="$emit('show-badge')"
           class="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:bg-blue-700 transition-all active:scale-95">
        <ArrowRightIcon class="w-5 h-5" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { 
  ShieldCheckIcon as VerifiedIcon,
  ClockIcon,
  AlertCircleIcon,
  ArrowRightIcon,
  ShieldIcon
} from 'lucide-vue-next';

const props = defineProps({
  status: { type: String, default: 'unverified' },
  kuliId: { type: String, default: null },
  rejectionReason: { type: String, default: null }
});

const statusLabel = computed(() => {
  switch (props.status) {
    case 'verified': return 'Status: Authenticated. Digital badge is active.';
    case 'pending': return 'Status: Pending. Station admin review in progress.';
    case 'rejected': return 'Status: Registry Error. Update required.';
    default: return 'Unlock premium status and gain passenger trust.';
  }
});

defineEmits(['open-modal', 'show-badge']);
</script>
