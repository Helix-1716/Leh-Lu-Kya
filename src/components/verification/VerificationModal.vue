<template>
  <div v-if="isOpen" class="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fade-in group">
    <div class="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-box-in relative">
      
      <!-- Close Button -->
      <button @click="close" class="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all z-20">
        <X class="w-5 h-5" />
      </button>

      <!-- Sidebar-style Header for Desktop / Top for Mobile -->
      <div class="bg-kuli-blue p-10 text-white relative flex flex-col justify-end min-h-[160px]">
        <div class="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
        <div class="relative z-10">
          <div class="flex items-center gap-3 mb-4">
             <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
               <Shield class="w-6 h-6 text-kuli-red" />
             </div>
             <h2 class="text-2xl font-black uppercase tracking-tighter">Identity Onboarding</h2>
          </div>
          <div class="flex items-center gap-8">
            <div v-for="s in [1, 2, 3]" :key="s" class="flex items-center gap-2">
              <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all"
                   :class="step >= s ? 'bg-white text-kuli-blue border-white' : 'border-white/20 text-white/30'">
                {{ s }}
              </div>
              <span class="text-[9px] font-black uppercase tracking-widest" :class="step >= s ? 'text-white' : 'text-white/30'">
                {{ ['Personal', 'Documents', 'Confirm'][s-1] }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Scrollable Form Area -->
      <div v-if="!isSuccess" class="flex-1 overflow-y-auto p-10 custom-scrollbar">
        
        <!-- STEP 1: PERSONAL DETAILS -->
        <div v-if="step === 1" class="space-y-6 animate-slide-in">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name (As per ID)</label>
              <input v-model="form.fullName" type="text" placeholder="John Doe" class="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-kuli-blue focus:bg-white outline-none font-bold text-slate-900 transition-all">
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Aadhaar / National ID</label>
              <input v-model="form.idNumber" type="text" placeholder="XXXX-XXXX-XXXX" class="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-kuli-blue focus:bg-white outline-none font-bold text-slate-900 transition-all">
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
              <div class="flex gap-2 w-full">
                <!-- Country Code Selector -->
                <div class="relative w-24 shrink-0">
                  <select v-model="form.countryCode" 
                          class="w-full h-full px-2 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-kuli-blue focus:bg-white outline-none font-bold text-slate-800 transition-all appearance-none cursor-pointer text-xs">
                    <option v-for="c in countries" :key="c.iso" :value="c.code">
                      {{ c.flag }} {{ c.code }}
                    </option>
                  </select>
                  <div class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronDown class="w-3 h-3" />
                  </div>
                </div>
                <!-- Number Input -->
                <div class="flex-1 min-w-0">
                  <input v-model="form.phone" 
                         type="text" 
                         @input="handlePhoneInput"
                         placeholder="99XXXXXXXX" 
                         maxlength="12"
                         class="w-full px-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-kuli-blue focus:bg-white outline-none font-bold text-slate-900 transition-all text-sm truncate">
                </div>
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Preferred Station/Zone</label>
              <select v-model="form.stationCode" class="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-kuli-blue focus:bg-white outline-none font-bold text-slate-900 transition-all">
                <option value="HWH">Howrah (HWH)</option>
                <option value="NDLS">New Delhi (NDLS)</option>
                <option value="SDAH">Sealdah (SDAH)</option>
                <option value="KGP">Kharagpur (KGP)</option>
                <option value="BCT">Mumbai Central (BCT)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- STEP 2: DOCUMENTS -->
        <div v-if="step === 2" class="space-y-6 animate-slide-in">
          <div class="p-6 bg-slate-900 rounded-[2rem] text-white flex items-center gap-4 border border-white/10 shadow-xl mb-6">
             <div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
               <Camera class="w-6 h-6 text-kuli-red" />
             </div>
             <div>
               <p class="text-[9px] font-black uppercase tracking-widest text-[#81ecff]">Secure Upload</p>
               <h3 class="text-sm font-black uppercase tracking-tight">Identity Documents</h3>
             </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Profile Selfie -->
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selfie Photo</label>
              <div @click="$refs.profileInput.click()" class="h-44 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-3 cursor-pointer group hover:border-kuli-blue transition-all overflow-hidden relative">
                <img v-if="previews.profile" :src="previews.profile" class="absolute inset-0 w-full h-full object-cover">
                <div v-else class="flex flex-col items-center">
                  <User class="w-8 h-8 text-slate-300 group-hover:text-kuli-blue" />
                  <span class="text-[10px] font-black uppercase text-slate-400 group-hover:text-blue-600 mt-2">TAP TO SNAP</span>
                </div>
                <input ref="profileInput" type="file" accept="image/*" class="hidden" @change="e => handleFile(e, 'profile')">
              </div>
            </div>

            <!-- ID Front -->
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Card (Front)</label>
              <div @click="$refs.frontInput.click()" class="h-44 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-3 cursor-pointer group hover:border-kuli-blue transition-all overflow-hidden relative">
                <img v-if="previews.idFront" :src="previews.idFront" class="absolute inset-0 w-full h-full object-cover">
                <div v-else class="flex flex-col items-center">
                  <CreditCard class="w-8 h-8 text-slate-300 group-hover:text-kuli-blue" />
                  <span class="text-[10px] font-black uppercase text-slate-400 group-hover:text-blue-600 mt-2">UPLOAD FRONT</span>
                </div>
                <input ref="frontInput" type="file" accept="image/*" class="hidden" @change="e => handleFile(e, 'idFront')">
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 3: CONFIRM & HASH -->
        <div v-if="step === 3" class="space-y-8 animate-slide-in">
           <div class="text-center py-6">
              <div class="w-20 h-20 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100">
                <Fingerprint class="w-10 h-10" />
              </div>
              <h3 class="text-xl font-black text-slate-900 uppercase tracking-tight">Final Certification</h3>
              <p class="text-xs font-bold text-slate-400 mt-2 max-w-sm mx-auto uppercase tracking-widest">Your data will be hashed and cross-referenced with the blockchain ledger upon approval.</p>
           </div>

           <div class="bg-slate-50 p-6 rounded-[2rem] border-2 border-slate-100 space-y-4">
              <div class="flex items-center gap-4 text-xs font-bold text-slate-600">
                <Check class="w-4 h-4 text-green-500 shrink-0" />
                <span>Identity details encrypted via SHA-256</span>
              </div>
              <div class="flex items-center gap-4 text-xs font-bold text-slate-600">
                <Check class="w-4 h-4 text-green-500 shrink-0" />
                <span>Documents stored in secure cold storage</span>
              </div>
              <div class="flex items-center gap-4 text-xs font-bold text-slate-500 italic">
                <div class="w-4 h-4 border-2 border-slate-300 rounded flex items-center justify-center">
                  <input type="checkbox" v-model="form.consent" class="accent-kuli-blue">
                </div>
                <span>I confirm that the submitted details are correct and belong to me.</span>
              </div>
           </div>
        </div>
      </div>

      <!-- SUCCESS STATE -->
      <div v-if="isSuccess" class="flex-1 flex flex-col items-center justify-center p-12 text-center animate-fade-in">
        <div class="w-24 h-24 bg-green-50 text-green-500 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-sm border border-green-100 scale-110 active:scale-100 transition-transform">
          <Check class="w-12 h-12" />
        </div>
        <h3 class="text-2xl font-black text-slate-900 uppercase tracking-tight mb-3">Submission Successful</h3>
        <p class="text-slate-500 font-bold max-w-xs leading-relaxed uppercase tracking-widest text-[10px]">
          Your verification process is going on. Our team will review your documents within 24 hours.
        </p>
        <button @click="close" class="mt-10 px-10 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl">
           Got it, Thanks
        </button>
      </div>

      <!-- Action Area -->
      <div v-if="!isSuccess" class="p-10 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-6">
        <button v-if="step > 1" @click="step--" class="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 flex items-center gap-2">
          <ArrowLeft class="w-4 h-4" /> Back
        </button>
        <div v-else></div>

        <button @click="handleNext" 
                :disabled="isSubmitting"
                class="min-w-[200px] btn bg-slate-900 text-white hover:bg-black py-5 px-10 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3">
          <template v-if="isSubmitting">
            <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Processing...
          </template>
          <template v-else>
            {{ step === 3 ? 'Seal & Submit' : 'Continue' }}
            <ArrowRight v-if="step < 3" class="w-4 h-4" />
            <ShieldCheck v-else class="w-4 h-4 transition-transform group-hover:scale-110" />
          </template>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { 
  X, 
  Shield, 
  User, 
  CreditCard, 
  Camera,
  Check,
  Fingerprint,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  ChevronDown
} from 'lucide-vue-next';
import { verificationService } from '../../services/verificationService';

const props = defineProps({
  isOpen: Boolean,
  uid: String
});

const emit = defineEmits(['close', 'submitted']);

const step = ref(1);
const isSubmitting = ref(false);
const isSuccess = ref(false);

const countries = [
  { name: 'India', code: '+91', flag: '🇮🇳', iso: 'IN' },
  { name: 'United States', code: '+1', flag: '🇺🇸', iso: 'US' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧', iso: 'GB' },
  { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪', iso: 'AE' },
  { name: 'Saudi Arabia', code: '+966', flag: '🇸🇦', iso: 'SA' },
  { name: 'Singapore', code: '+65', flag: '🇸🇬', iso: 'SG' },
  { name: 'Australia', code: '+61', flag: '🇦🇺', iso: 'AU' },
  { name: 'Canada', code: '+1', flag: '🇨🇦', iso: 'CA' },
  { name: 'Germany', code: '+49', flag: '🇩🇪', iso: 'DE' },
  { name: 'France', code: '+33', flag: '🇫🇷', iso: 'FR' },
  { name: 'Bangladesh', code: '+880', flag: '🇧🇩', iso: 'BD' },
];

const form = reactive({
  fullName: '',
  idNumber: '',
  phone: '',
  countryCode: '+91',
  stationCode: 'HWH',
  consent: false
});

const files = reactive({
  profile: null,
  idFront: null,
  idBack: null
});

const previews = reactive({
  profile: null,
  idFront: null,
  idBack: null
});

const handleFile = (event, key) => {
  const file = event.target.files[0];
  if (file) {
    files[key] = file;
    previews[key] = URL.createObjectURL(file);
  }
};

const handlePhoneInput = (e) => {
  form.phone = e.target.value.replace(/\D/g, '');
};

const handleNext = async () => {
  try {
    if (step.value < 3) {
      if (step.value === 1 && (!form.fullName || !form.idNumber || !form.phone)) {
        alert("Please fill in your details.");
        return;
      }
      if (step.value === 2 && (!files.profile || !files.idFront)) {
        alert("Please upload required documents.");
        return;
      }
      step.value++;
    } else {
      if (!form.consent) {
        alert("Please provide the legal consent.");
        return;
      }
      if (!props.uid) {
        alert("Session error. Please log in again.");
        return;
      }
      
      isSubmitting.value = true;
      const submissionData = { ...form };
      submissionData.phone = `${form.countryCode} ${form.phone}`;
      
      const resultId = await verificationService.submitRequest(props.uid, submissionData, files);
      if (resultId) {
         isSuccess.value = true;
      }
    }
  } catch (err) {
    console.error("Submission Error:", err);
    alert("Submission Failed: " + err.message);
  } finally {
    isSubmitting.value = false;
  }
};

const close = () => {
  if (isSuccess.value) {
    emit('submitted');
  }
  step.value = 1;
  isSuccess.value = false;
  emit('close');
};
</script>

<style scoped>
@keyframes boxIn {
  from { opacity: 0; transform: scale(0.95) translateY(40px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-box-in {
  animation: boxIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}
.animate-slide-in {
  animation: slideIn 0.4s ease-out forwards;
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
