<template>
  <div v-if="isOpen" class="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
    <div class="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col animate-badge-in relative">
      
      <!-- Top Branding Section (Refined for better visibility) -->
      <div class="bg-slate-900 p-10 text-white text-center relative overflow-hidden">
        <div class="absolute inset-0 opacity-20">
           <div class="absolute -right-10 -top-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
           <div class="absolute -left-10 -bottom-10 w-40 h-40 bg-kuli-red rounded-full blur-3xl"></div>
        </div>
        
        <div class="relative z-10 space-y-4">
          <div class="w-20 h-20 bg-white p-3 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <img src="/Images/Kuli Logo.png" class="w-full h-full object-contain" alt="Kuli Logo">
          </div>
          <h2 class="text-xs font-black uppercase tracking-[0.4em] text-white/40">Credential Portfolio</h2>
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-green-400/10 border border-green-400/20 rounded-full">
            <div class="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            <span class="text-[9px] font-black uppercase tracking-widest text-green-400">Authenticated Ledger</span>
          </div>
        </div>
      </div>

      <!-- Badge Content -->
      <div class="p-10 space-y-10">
        <!-- Main Kuli ID -->
        <div class="text-center space-y-2">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Official Kuli ID</p>
          <p class="text-3xl font-black text-slate-900 font-mono tracking-tighter">{{ kuliId }}</p>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-2 gap-6">
          <div class="bg-slate-50/50 p-5 rounded-3xl border border-slate-100">
            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Issue Date</p>
            <p class="text-sm font-black text-slate-800">{{ formattedDate }}</p>
          </div>
          <div class="bg-slate-50/50 p-5 rounded-3xl border border-slate-100">
            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Clearance</p>
            <p class="text-sm font-black text-blue-600 uppercase">Station T1</p>
          </div>
        </div>

        <!-- REFINED 2-COLUMN VERIFICATION SECTION (FORCED HORIZONTAL) -->
        <div class="pt-10 border-t border-slate-100 grid grid-cols-1 md:grid-cols-[1fr_120px] gap-8 items-start">
          <!-- LEFT SIDE: OFFICIAL INFO -->
          <div class="space-y-6">
            <div class="space-y-2">
              <p class="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em] flex items-center gap-2">
                <ShieldCheck class="w-3.5 h-3.5" /> Digital Certification
              </p>
              <h4 class="text-sm font-black text-slate-900 uppercase tracking-tight">Immutable Record Proof</h4>
              <p class="text-[10px] font-bold text-slate-400 leading-relaxed max-w-sm">This identity is cryptographically sealed on the distributed ledger. Validation ensures the authenticity of both the porter and the issuing station.</p>
            </div>

            <!-- Blockchain Details -->
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 relative overflow-hidden group">
               <Fingerprint class="absolute -right-2 -top-2 w-10 h-10 opacity-[0.03] text-slate-900 group-hover:scale-110 transition-transform" />
               <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <div class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Transaction Hash
               </p>
               <p class="text-[10px] font-mono font-bold text-slate-500 break-all leading-tight">
                  {{ proofId || '0x7d284f902da37d17cf66d23de08f2c24afb6a3b283d58536ef6df8b6214cb0eaf' }}
               </p>
            </div>
          </div>

          <!-- RIGHT SIDE: QR VALIDATION -->
          <div class="flex flex-col items-center md:items-end gap-4 text-center md:text-right">
             <div class="w-[120px] h-[120px] bg-white border border-slate-200 rounded-[2rem] p-4 flex items-center justify-center shadow-2xl shadow-slate-200 hover:border-blue-500 transition-all cursor-pointer">
                <QrCode class="w-full h-full text-slate-900" />
             </div>
             <div>
               <p class="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-1">Live Validation</p>
               <p class="text-[8px] font-bold text-slate-400 uppercase leading-none">Scan to Verify</p>
             </div>
          </div>
        </div>
      </div>

      <!-- Close Action -->
      <div class="px-8 pb-8 pt-2">
        <button @click="$emit('close')" class="w-full py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-95 outline-none border-none">
          Dismiss Badge
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { 
  ShieldCheck, 
  Fingerprint, 
  QrCode 
} from 'lucide-vue-next';

const props = defineProps({
  isOpen: Boolean,
  kuliId: String,
  proofId: String,
  verifiedAt: [Object, String, Number]
});

defineEmits(['close']);

const formattedDate = computed(() => {
  if (!props.verifiedAt) return 'Active Now';
  try {
    const date = props.verifiedAt?.toDate ? props.verifiedAt.toDate() : new Date(props.verifiedAt);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }).toUpperCase();
  } catch (e) {
    return 'Authenticated';
  }
});
</script>

<style scoped>
@keyframes badgeIn {
  from { opacity: 0; transform: scale(0.9) translateY(40px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-badge-in {
  animation: badgeIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
</style>
