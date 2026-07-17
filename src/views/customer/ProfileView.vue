<template>
  <div class="animate-fade-in space-y-10 max-w-4xl mx-auto pb-20">
    <!-- Premium Header Section -->
    <div class="relative overflow-hidden rounded-[3rem] bg-kuli-blue p-8 md:p-12 shadow-2xl group">
      <!-- Animated Background Elements -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-kuli-red/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

      <div class="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <!-- Profile Photo -->
        <div class="relative">
          <div class="w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] bg-white p-1 shadow-2xl transition-transform group-hover:scale-[1.02] duration-500">
            <div class="w-full h-full rounded-[2.2rem] overflow-hidden bg-kuli-station flex items-center justify-center relative">
              <img v-if="authStore.profilePhoto && !imageError" 
                   :src="authStore.profilePhoto" 
                   referrerpolicy="no-referrer"
                   class="w-full h-full object-cover"
                   @error="imageError = true">
              <span v-else class="text-kuli-blue font-black text-5xl md:text-6xl uppercase tracking-tighter">
                {{ (authStore.userData?.name || 'C').charAt(0) }}
              </span>
              
              <!-- Upload Action -->
              <label class="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer group/upload">
                <CameraIcon class="w-8 h-8 text-white mb-1 group-hover/upload:scale-110 transition-transform" />
                <span class="text-[9px] font-black text-white uppercase tracking-widest">Update</span>
                <input type="file" class="hidden" accept="image/*" @change="handleFileUpload">
              </label>
            </div>
          </div>
          
          <!-- Premium Ring -->
          <div class="absolute -inset-2 border-2 border-dashed border-white/30 rounded-[3rem] animate-spin-slow pointer-events-none"></div>
          
          <!-- Verification Tag -->
          <div class="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-xl shadow-lg border-2 border-white">
            <CheckCircle2Icon class="w-4 h-4" />
          </div>
        </div>

        <!-- Name & Status -->
        <div class="text-center md:text-left flex-1 space-y-4">
          <div v-if="!editMode" class="space-y-1">
            <h1 class="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter glitch-text" :data-text="authStore.userData?.name || 'Commuter'">
              {{ authStore.userData?.name || 'Commuter' }}
            </h1>
            <div class="flex items-center justify-center md:justify-start gap-4">
              <div class="flex flex-col md:flex-row items-center gap-3">
                <div class="px-4 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                  <span class="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
                    <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    {{ authStore.userData?.tier || 'General' }} Account
                  </span>
                </div>
                <router-link :to="{ name: 'pricing' }" class="px-4 py-1 bg-kuli-gold/20 hover:bg-kuli-gold/40 backdrop-blur-md rounded-full border border-kuli-gold/30 text-[10px] font-black text-kuli-gold uppercase tracking-widest transition-all">
                  Upgrade Offers
                </router-link>
              </div>
              <button @click="editMode = true" class="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white/60 hover:text-white">
                <Edit3Icon class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Edit Name State -->
          <div v-else class="space-y-4">
            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-black text-white/60 uppercase tracking-widest">Update Name Signature</label>
              <div class="flex gap-2">
                <input 
                  v-model="editForm.name"
                  type="text" 
                  class="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-kuli-red w-full md:w-80"
                  placeholder="Enter Name"
                >
                <button @click="saveProfile" class="p-3 bg-kuli-red text-white rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all">
                  <SaveIcon class="w-5 h-5" />
                </button>
                <button @click="editMode = false" class="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all">
                  <XIcon class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-4 border-t border-white/10">
            <div class="flex items-center gap-2 text-white/60">
              <MailIcon class="w-4 h-4" />
              <span class="text-[10px] font-bold uppercase tracking-widest">{{ authStore.user?.email }}</span>
            </div>
            <div class="flex items-center gap-2 text-white/60">
              <PhoneIcon class="w-4 h-4" />
              <span class="text-[10px] font-bold uppercase tracking-widest">{{ authStore.userData?.phone || '+91 99XXXXXX' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Upload Loading Overlay -->
      <div v-if="uploading" class="absolute inset-0 bg-kuli-blue/80 backdrop-blur-md z-50 flex flex-col items-center justify-center gap-4 text-white">
        <div class="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <p class="text-[10px] font-bold uppercase tracking-[0.4em]">Optimizing Profile Assets...</p>
      </div>
    </div>

    <!-- Quick Actions Card -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
       <!-- Performance Card -->
       <div class="card p-6 bg-white shadow-xl flex items-center justify-between border-l-4 border-kuli-blue">
          <div>
            <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest">Account standing</p>
            <h4 class="text-xl font-black text-kuli-blue uppercase">Tier 1 Elite</h4>
          </div>
          <div class="w-10 h-10 rounded-xl bg-kuli-blue/10 flex items-center justify-center text-kuli-blue shadow-inner">
            <TrendingUpIcon class="w-5 h-5" />
          </div>
       </div>

       <!-- Wallet Quick View -->
       <div class="card p-6 bg-white shadow-xl flex items-center justify-between border-l-4 border-kuli-red">
          <div>
            <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest">Digital Balance</p>
            <h4 class="text-xl font-black text-kuli-red uppercase">₹{{ authStore.userData?.wallet || 0 }}</h4>
          </div>
          <router-link :to="{ name: 'customer-wallet' }" class="p-2 hover:bg-red-50 rounded-lg transition-colors text-kuli-red">
            <WalletIcon class="w-5 h-5" />
          </router-link>
       </div>

       <!-- Safety Score -->
       <div class="card p-6 bg-white shadow-xl flex items-center justify-between border-l-4 border-green-500">
          <div>
            <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest">Reliability Score</p>
            <h4 class="text-xl font-black text-green-600 uppercase">100% Secure</h4>
          </div>
          <div class="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
            <ShieldCheckIcon class="w-5 h-5" />
          </div>
       </div>
    </div>

    <!-- Detailed Information Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div class="lg:col-span-2 space-y-8">
        <section>
          <h2 class="text-xs font-black text-kuli-blue uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
             <div class="w-1.5 h-1.5 bg-kuli-red rounded-full"></div> Profile Credentials
          </h2>
          <div class="bg-white rounded-3xl border border-kuli-earth-dark shadow-sm divide-y divide-gray-50 overflow-hidden">
            <div v-for="field in profileFields" :key="field.label" class="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors group/row">
               <div class="flex items-center gap-4">
                  <div class="p-3 bg-kuli-station border border-kuli-earth-dark rounded-2xl text-gray-400 group-hover/row:text-kuli-blue group-hover/row:bg-white transition-all">
                    <component :is="field.icon" class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{{ field.label }}</p>
                    <p class="text-sm font-bold text-kuli-blue uppercase tracking-tight">{{ field.value || 'Not Configured' }}</p>
                  </div>
               </div>
               <button v-if="field.editable" @click="handleEditField(field)" class="text-[10px] font-black text-gray-300 hover:text-kuli-red uppercase tracking-widest flex items-center gap-2">
                 Modify <ChevronRightIcon class="w-3.5 h-3.5" />
               </button>
            </div>
          </div>
        </section>
      </div>

      <!-- Station Preferences Card -->
      <aside class="space-y-8">
        <section>
          <h2 class="text-xs font-black text-kuli-blue uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
             <div class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Travel Core
          </h2>
          <div class="bg-kuli-blue rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]"></div>
            
            <div class="relative z-10 space-y-8">
               <div>
                  <label class="text-[9px] font-black text-white/50 uppercase tracking-[0.2em] block mb-4">Base Station</label>
                  <div class="flex items-center gap-4 p-4 bg-white/10 rounded-2xl border border-white/10 group-hover:border-white/30 transition-all">
                    <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-kuli-blue shadow-lg">
                      <MapPinIcon class="w-5 h-5" />
                    </div>
                    <span class="font-black uppercase tracking-widest text-sm">{{ authStore.userData?.station || 'Select Station' }}</span>
                  </div>
               </div>

               <div class="pt-8 border-t border-white/10">
                 <button @click="handleEditField({label: 'Station', key: 'station', value: authStore.userData?.station})" class="w-full py-4 bg-white text-kuli-blue text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all">
                   Manage Preferences
                 </button>
               </div>
            </div>
          </div>
        </section>

        <!-- Security Quick Stats -->
        <div class="bg-gray-100/50 p-6 rounded-[2rem] border border-gray-200">
          <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center mb-4">Security Protocol</p>
          <div class="flex justify-center gap-1">
             <div v-for="i in 10" :key="i" class="w-1 h-3 rounded-full bg-green-500/50"></div>
             <div class="w-1 h-3 rounded-full bg-gray-200"></div>
             <div class="w-1 h-3 rounded-full bg-gray-200"></div>
          </div>
          <p class="text-[8px] font-bold text-green-600 uppercase text-center mt-3">High Security Active</p>
        </div>
      </aside>
    </div>

    <!-- Edit Overlay Modal -->
    <div v-if="activeEditField" class="fixed inset-0 z-[100] flex items-center justify-center bg-kuli-blue/40 backdrop-blur-sm p-6">
       <div class="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-box-in">
          <h2 class="text-xl font-black text-kuli-blue uppercase tracking-tighter mb-2">Modify {{ activeEditField.label }}</h2>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">Update your official profile parameters</p>
          
          <div class="space-y-6">
             <div class="space-y-3">
               <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest">New {{ activeEditField.label }}</label>
               <input 
                v-model="activeEditField.editValue"
                type="text" 
                class="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold text-kuli-blue focus:outline-none focus:ring-2 focus:ring-kuli-blue transition-all"
               >
             </div>
             
             <div class="flex gap-4">
                <button @click="saveFieldEdit" class="flex-1 py-4 bg-kuli-blue text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-slate-800 transition-all">Save Changes</button>
                <button @click="activeEditField = null" class="flex-1 py-4 bg-gray-100 text-gray-500 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-all">Cancel</button>
             </div>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { 
  CameraIcon, 
  CheckCircle2Icon, 
  MailIcon, 
  ShieldCheckIcon, 
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  Edit3Icon,
  SaveIcon,
  XIcon,
  TrendingUpIcon,
  WalletIcon,
  ChevronRightIcon,
  FingerprintIcon
} from 'lucide-vue-next';

const authStore = useAuthStore();
const uploading = ref(false);
const editMode = ref(false);
const imageError = ref(false);

const editForm = reactive({
  name: authStore.userData?.name || ''
});

// Update editForm when authStore data loads
watch(() => authStore.userData?.name, (newVal) => {
  editForm.name = newVal || '';
});

// Reset image error if photo changes
watch(() => authStore.profilePhoto, () => {
  imageError.value = false;
});

const activeEditField = ref(null);

const profileFields = computed(() => [
  { 
    label: 'Official Name', 
    value: authStore.userData?.name, 
    icon: UserIcon, 
    key: 'name',
    editable: true 
  },
  { 
    label: 'Mobile Contact', 
    value: authStore.userData?.phone, 
    icon: PhoneIcon, 
    key: 'phone',
    editable: true 
  },
  { 
    label: 'Primary Station', 
    value: authStore.userData?.station, 
    icon: MapPinIcon, 
    key: 'station',
    editable: true 
  },
  { 
    label: 'Digital Token (UID)', 
    value: authStore.user?.uid, 
    icon: FingerprintIcon, 
    key: 'uid',
    editable: false 
  },
  { 
    label: 'Verification Status', 
    value: authStore.isVerified ? 'Fully Verified' : 'Pending', 
    icon: CheckCircle2Icon, 
    key: 'verified',
    editable: false 
  }
]);

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  uploading.value = true;
  try {
    await authStore.updateProfilePicture(file);
  } catch (err) {
    console.error('Upload failed:', err);
    alert('Upload failed: ' + err.message);
  } finally {
    uploading.value = false;
    event.target.value = '';
  }
};

const saveProfile = async () => {
  try {
    await authStore.updateProfileDetails({ name: editForm.name });
    editMode.value = false;
  } catch (err) {
    alert('Failed to update name: ' + err.message);
  }
};

const handleEditField = (field) => {
  activeEditField.value = { ...field, editValue: field.value };
};

const saveFieldEdit = async () => {
  if (!activeEditField.value) return;
  try {
    const updates = {};
    updates[activeEditField.value.key] = activeEditField.value.editValue;
    await authStore.updateProfileDetails(updates);
    activeEditField.value = null;
  } catch (err) {
    alert('Update failed: ' + err.message);
  }
};
</script>

<script>
// Separate script for file-wide styles if needed, but scoped style is preferred
</script>

<style scoped>
.glitch-text {
  position: relative;
  text-shadow: 0.05em 0 0 rgba(255,0,0,.75),
              -0.025em -0.05em 0 rgba(0,255,0,.75),
              0.025em 0.05em 0 rgba(0,0,255,.75);
  animation: glitch 1000ms infinite;
}

.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.8;
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
  transform: translate(-1px, -2px);
  animation: glitch 250ms infinite;
}

@keyframes glitch {
  0% { transform: translate(0); text-shadow: 0.05em 0 0 rgba(255,0,0,.75), -0.025em -0.05em 0 rgba(0,255,0,.75), 0.025em 0.05em 0 rgba(0,0,255,.75); }
  15% { transform: translate(-2px, -1px); }
  30% { transform: translate(2px, 1px); }
  45% { transform: translate(-1px, 2px); }
  60% { transform: translate(1px, -2px); }
  100% { transform: translate(0); }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin-slow {
  animation: spin-slow 12s linear infinite;
}

@keyframes boxIn {
  from { opacity: 0; transform: scale(0.95) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-box-in {
  animation: boxIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}
</style>
