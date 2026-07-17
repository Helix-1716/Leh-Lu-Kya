<template>
  <div v-if="request" class="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-6">
    <div class="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-box-in border border-slate-100">
      
      <!-- Top Nav -->
      <div class="p-8 bg-white border-b border-gray-100 flex items-center justify-between">
         <div class="flex items-center gap-4">
            <button @click="$emit('close')" class="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-all">
              <ArrowLeftIcon class="w-5 h-5" />
            </button>
            <div>
              <h2 class="text-xl font-black uppercase tracking-tight text-slate-900">{{ request.fullName }}</h2>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Request ID: {{ request.id }}</p>
            </div>
         </div>
         <div class="flex items-center gap-3">
            <div class="px-4 py-1 bg-amber-100 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-200">
              PENDING SEAL
            </div>
         </div>
      </div>

      <div class="flex-1 overflow-y-auto p-10 custom-scrollbar bg-slate-50/50">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          <!-- Image Comparison Column -->
          <div class="space-y-8">
            <h3 class="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <CameraIcon class="w-4 h-4 text-kuli-red" />
              Visual Evidence Comparison
            </h3>
            
            <div class="grid grid-cols-1 gap-6">
               <div class="space-y-3">
                 <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference Selfie</p>
                 <div class="aspect-square rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-slate-100 group">
                   <img :src="request.profilePhotoUrl" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                 </div>
               </div>
               
               <div class="space-y-3">
                 <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Front Copy</p>
                 <div class="aspect-video rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-slate-100 group relative">
                   <img :src="request.idFrontUrl" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                   <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button @click="openImage(request.idFrontUrl)" class="p-4 bg-white rounded-2xl mt-4 shadow-2xl">
                        <MaximizeIcon class="w-6 h-6 text-slate-900" />
                      </button>
                   </div>
                 </div>
               </div>
            </div>
          </div>

          <!-- Data & Decision Column -->
          <div class="space-y-8">
            <h3 class="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <ShieldIcon class="w-4 h-4 text-kuli-blue" />
              Registry Cross-Check
            </h3>

            <!-- Data Card -->
            <div class="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-6">
               <div v-for="field in details" :key="field.label" class="flex justify-between items-end border-b border-slate-50 pb-4">
                  <div>
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{{ field.label }}</p>
                    <p class="text-sm font-black text-slate-900 uppercase tracking-tight">{{ field.value }}</p>
                  </div>
                  <CheckCircleIcon class="w-4 h-4 text-slate-200" />
               </div>
            </div>

            <!-- Decision Box -->
            <div class="space-y-6">
               <div v-if="isRejecting" class="animate-slide-in">
                  <label class="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2 block">Rejection Reason</label>
                  <textarea v-model="rejectionReason" placeholder="Explain why identity was rejected..." class="w-full h-24 p-5 bg-red-50/50 border-2 border-red-100 rounded-2xl outline-none font-bold text-red-900 text-sm focus:border-red-400 transition-all"></textarea>
                  <div class="flex gap-4 mt-4">
                     <button @click="handleReject" :disabled="!rejectionReason || loading" class="flex-1 py-4 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-200 disabled:opacity-50">Confirm Rejection</button>
                     <button @click="isRejecting = false" class="px-6 py-4 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
                  </div>
               </div>

               <div v-else class="flex flex-col gap-4">
                  <button @click="handleApprove" 
                          :disabled="loading"
                          class="w-full py-6 bg-slate-900 text-white rounded-[1.5rem] shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4 group disabled:opacity-50">
                     <template v-if="loading">
                       <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                       Engraving Blockchain Ledger...
                     </template>
                     <template v-else>
                       <ShieldCheckIcon class="w-6 h-6 text-kuli-red group-hover:scale-110 transition-transform" />
                       <span class="text-sm font-black uppercase tracking-widest">Verify & Seal Identity</span>
                     </template>
                  </button>
                  
                  <button @click="isRejecting = true" class="w-full py-4 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors">
                    Flag Identity for Resubmission
                  </button>
               </div>
            </div>

            <!-- Trust Note -->
            <div class="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-4">
               <InfoIcon class="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
               <p class="text-[10px] font-bold text-blue-600 uppercase leading-relaxed tracking-wider">Approval will auto-generate a KULI-{{ request.stationCode }} ID and link it to the Station Registry.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { 
  ArrowLeftIcon, 
  CameraIcon, 
  ShieldIcon, 
  CheckCircleIcon,
  MaximizeIcon,
  ShieldCheckIcon,
  InfoIcon
} from 'lucide-vue-next';
import { adminService } from '../../services/adminService';

const props = defineProps({
  request: Object
});

const emit = defineEmits(['close', 'updated']);

const loading = ref(false);
const isRejecting = ref(false);
const rejectionReason = ref('');

const details = computed(() => [
  { label: 'Full Legal Name', value: props.request?.fullName },
  { label: 'National ID Number', value: props.request?.idNumber },
  { label: 'Verified Phone', value: props.request?.phone },
  { label: 'Operating Area', value: props.request?.stationCode }
]);

const handleApprove = async () => {
  if (!confirm("Confirm Identity Approval? This will write a proof to the ledger.")) return;
  
  loading.value = true;
  try {
    await adminService.approveIdentity(props.request.id, props.request.uid, props.request.stationCode);
    emit('updated');
    emit('close');
  } catch (err) {
    alert("Approval failed: " + err.message);
  } finally {
    loading.value = false;
  }
};

const handleReject = async () => {
  loading.value = true;
  try {
    await adminService.rejectIdentity(props.request.id, props.request.uid, rejectionReason.value);
    emit('updated');
    emit('close');
  } catch (err) {
    alert("Rejection failed: " + err.message);
  } finally {
    loading.value = false;
  }
};

const openImage = (url) => {
  window.open(url, '_blank');
};
</script>

<style scoped>
@keyframes boxIn {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-box-in {
  animation: boxIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@keyframes slideIn {
  from { opacity: 0; transform: scaleY(0.9); transform-origin: top; }
  to { opacity: 1; transform: scaleY(1); }
}
.animate-slide-in {
  animation: slideIn 0.3s ease-out forwards;
}

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
