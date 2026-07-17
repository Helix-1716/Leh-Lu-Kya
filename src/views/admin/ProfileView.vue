<template>
  <div class="animate-fade-in pb-12 w-full max-w-4xl mx-auto space-y-8">
    <div class="flex items-center justify-between mb-8">
      <div v-if="!editMode" class="group">
        <h2 class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Administrator Profile</h2>
        <div class="flex items-center gap-4">
          <h1 class="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter glitch-text" :data-text="authStore.userData?.name || 'Chief Official'">
            {{ authStore.userData?.name || 'Chief Official' }}
          </h1>
          <button @click="editMode = true" class="p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100 rounded-xl text-slate-400 hover:text-kuli-red">
            <Edit3Icon class="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <!-- Admin Name Edit State -->
      <div v-else class="flex flex-col gap-2">
        <h2 class="text-xs font-black text-kuli-red uppercase tracking-[0.2em] mb-1">Modify System Identity</h2>
        <div class="flex gap-2">
           <input 
            v-model="editForm.name"
            type="text" 
            class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-kuli-red w-full md:w-80"
           >
           <button @click="saveProfile" class="p-3 bg-slate-900 text-white rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all">
             <SaveIcon class="w-5 h-5" />
           </button>
           <button @click="editMode = false" class="p-3 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-200 transition-all">
             <XIcon class="w-5 h-5" />
           </button>
        </div>
      </div>

      <div class="px-4 py-2 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 shadow-inner hidden md:flex">
        <ShieldCheckIcon class="w-5 h-5 text-kuli-red" />
        <span class="text-xs font-black uppercase text-red-600 tracking-widest">Level 5 Clearance</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Identity Card -->
      <div class="md:col-span-1 flex flex-col gap-6">
        <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-b from-slate-50 to-transparent"></div>
          
          <div class="w-32 h-32 rounded-[2.5rem] bg-slate-900 flex items-center justify-center text-white mb-6 relative z-10 shadow-2xl shadow-slate-900/20 group-hover:scale-105 transition-transform border-4 border-white">
            <template v-if="authStore.profilePhoto">
              <img :src="authStore.profilePhoto" class="w-full h-full object-cover rounded-[2.2rem]" />
            </template>
            <LockIcon v-else class="w-12 h-12 text-kuli-red" />
            
            <label class="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded-[2.2rem] z-20">
              <CameraIcon class="w-8 h-8 text-white mb-1" />
              <input type="file" class="hidden" accept="image/*" @change="handleFileUpload">
            </label>

            <div class="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <CheckIcon class="w-5 h-5 text-white" stroke-width="3" />
            </div>
          </div>
          
          <h3 class="text-xl font-black text-slate-900 uppercase tracking-tight relative z-10">Chief Official</h3>
          <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1 relative z-10">{{ authStore.role }} Portal</p>
          
          <div v-if="uploading" class="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
             <div class="w-8 h-8 border-4 border-kuli-red border-t-transparent rounded-full animate-spin"></div>
          </div>

          <div class="w-full mt-8 pt-6 border-t border-slate-100 relative z-10 text-left">
            <h4 class="text-[8px] font-black uppercase tracking-widest text-slate-300 mb-2">Assigned Email</h4>
            <p class="text-sm font-bold text-slate-700 truncate">{{ authStore.user?.email }}</p>
          </div>
        </div>

        <!-- Security Status -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Security Check</h4>
          <div class="space-y-4">
             <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                   <KeyIcon class="w-4 h-4 text-green-500" />
                   <span class="text-xs font-bold text-slate-700">AES-256 Encryption</span>
                </div>
                <span class="text-[9px] font-black uppercase text-green-500 bg-green-50 px-2 py-0.5 rounded">Active</span>
             </div>
             <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                   <ActivityIcon class="w-4 h-4 text-blue-500" />
                   <span class="text-xs font-bold text-slate-700">Audit Logging</span>
                </div>
                <span class="text-[9px] font-black uppercase text-blue-500 bg-blue-50 px-2 py-0.5 rounded">Active</span>
             </div>
          </div>
        </div>
      </div>

      <!-- Settings / Information -->
      <div class="md:col-span-2 space-y-6">
        <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h4 class="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
            <SettingsIcon class="w-5 h-5 text-kuli-red" />
            System Privileges
          </h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div v-for="priv in privileges" :key="priv.title" class="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors group">
                <component :is="priv.icon" class="w-6 h-6 text-slate-400 mb-3 group-hover:text-kuli-red transition-colors" />
                <h5 class="text-xs font-black uppercase text-slate-800 mb-1">{{ priv.title }}</h5>
                <p class="text-[10px] font-bold text-slate-500 leading-relaxed">{{ priv.desc }}</p>
             </div>
          </div>
        </div>

        <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h4 class="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
              <DatabaseIcon class="w-5 h-5 text-kuli-red" />
              Terminal Log
            </h4>
            <div class="bg-slate-900 rounded-2xl p-6 font-mono text-[10px] overflow-x-auto shadow-inner leading-relaxed">
              <div class="text-green-400">> root@railportal:~# connection --verify</div>
              <div class="text-slate-500">Nodes: 1.0.4 - Integrity: 100%</div>
              <div class="text-green-400">> root@railportal:~# auth --whoami</div>
              <div class="text-slate-300">Identity: {{ authStore.userData?.name || 'Chief' }}</div>
              <div class="text-slate-300">Role: SUPER_USER</div>
              <div class="text-green-400">> root@railportal:~# uptime</div>
              <div class="text-slate-300">Total operational: 1,240 hours</div>
              <div class="text-green-400">><span class="animate-pulse blink">_</span></div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { 
  ShieldCheckIcon, LockIcon, KeyIcon, ActivityIcon, 
  GlobeIcon, SettingsIcon, UsersIcon, HistoryIcon, 
  WalletIcon, AlertOctagonIcon, DatabaseIcon, CheckIcon,
  CameraIcon, Edit3Icon, SaveIcon, XIcon
} from 'lucide-vue-next';

const authStore = useAuthStore();
const uploading = ref(false);
const editMode = ref(false);
const editForm = reactive({
  name: authStore.userData?.name || 'Chief Official'
});

watch(() => authStore.userData?.name, (newVal) => {
  editForm.name = newVal || 'Chief Official';
});

const privileges = [
  { icon: UsersIcon, title: 'User Management', desc: 'Full capability to approve, deny, and ban passenger or porter accounts.' },
  { icon: HistoryIcon, title: 'Live Tracking', desc: 'Monitor live location, fare status, and history of all station trips.' },
  { icon: WalletIcon, title: 'Financial Oversight', desc: 'Access to all revenue data, system wide gross earnings, and porter cuts.' },
  { icon: AlertOctagonIcon, title: 'Emergency Protocols', desc: 'Authority to execute station-wide alerts or shutdown operations in crisis.' }
];

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  uploading.value = true;
  try {
    await authStore.updateProfilePicture(file);
  } catch (err) {
    console.error('Upload failed:', err);
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
</script>

<style scoped>
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.blink {
  animation: blink 1s step-end infinite;
}

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
  20% { transform: translate(-2px, -1px); }
  40% { transform: translate(2px, 1px); }
  60% { transform: translate(-1px, 2px); }
  80% { transform: translate(1px, -2px); }
  100% { transform: translate(0); }
}
</style>