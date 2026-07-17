<template>
  <div class="animate-fade-in space-y-8">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-black text-slate-800 mb-2 uppercase tracking-tight">Access Control</h1>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform Users & Role Management</p>
      </div>
      <div class="flex gap-2">
         <select v-model="filterRole" class="bg-white border border-slate-200 text-[10px] font-black uppercase px-4 py-2 rounded-xl focus:outline-none focus:border-kuli-red">
            <option value="">All Personas</option>
            <option value="customer">Commuters</option>
            <option value="kuli">Porters</option>
            <option value="admin">Rail Officials</option>
         </select>
      </div>
    </header>

    <div v-if="loading" class="py-20 flex flex-col items-center justify-center gap-4">
       <div class="w-10 h-10 border-4 border-slate-200 border-t-kuli-red rounded-full animate-spin"></div>
       <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Fetching Registry...</p>
    </div>

    <div v-else class="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-slate-50 border-b border-slate-100 italic">
            <tr>
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity / Email</th>
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Designated Role</th>
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Security Status</th>
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Verification</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-8 py-6">
                <div class="flex items-center gap-4">
                   <div class="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 transition-colors group-hover:bg-kuli-red/10 group-hover:text-kuli-red">
                      <component :is="getPersonaIcon(user.role)" class="w-5 h-5" />
                   </div>
                   <div>
                      <p class="text-xs font-black text-slate-800">{{ user.name || 'Station User' }}</p>
                      <p class="text-[10px] font-bold text-slate-400">{{ user.email }}</p>
                   </div>
                </div>
              </td>
              <td class="px-8 py-6">
                 <span class="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border" :class="getRoleColor(user.role)">
                    {{ user.role || 'Unassigned' }}
                 </span>
              </td>
              <td class="px-8 py-6 text-center">
                 <div class="flex items-center justify-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full" :class="user.status === 'active' ? 'bg-green-500' : 'bg-amber-500'"></span>
                    <span class="text-[9px] font-black uppercase text-slate-500 tracking-wider">{{ user.status || 'pending' }}</span>
                 </div>
              </td>
              <td class="px-8 py-6 text-right">
                 <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button v-if="user.status !== 'active'" @click="handleStatusUpdate(user.id, 'active')" class="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm">
                       <ShieldCheckIcon class="w-4 h-4" />
                    </button>
                    <button v-if="user.status !== 'blocked'" @click="handleStatusUpdate(user.id, 'blocked')" class="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm">
                       <ShieldAlertIcon class="w-4 h-4" />
                    </button>
                 </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="filteredUsers.length === 0" class="py-24 text-center">
         <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users2Icon class="w-8 h-8 text-slate-200" />
         </div>
         <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry Entry Not Found</p>
         <p class="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">No users match the current filtering criteria</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { 
  Users2Icon, UserIcon, BriefcaseIcon, ShieldIcon,
  ShieldCheckIcon, ShieldAlertIcon 
} from 'lucide-vue-next';
import { adminService } from '../../services/adminService';

// State
const users = ref([]);
const loading = ref(true);
const filterRole = ref('');

// Computed
const filteredUsers = computed(() => {
  if (!filterRole.value) return users.value;
  return users.value.filter(u => u.role === filterRole.value);
});

// Persona Mapping
const getPersonaIcon = (role) => {
  if (role === 'kuli') return BriefcaseIcon;
  if (role === 'admin') return ShieldIcon;
  return UserIcon;
};

const getRoleColor = (role) => {
  if (role === 'admin') return 'bg-slate-900 text-white border-slate-900';
  if (role === 'kuli') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-blue-50 text-blue-700 border-blue-200';
};

// Actions
const handleStatusUpdate = async (uid, status) => {
  try {
    await adminService.updateUserStatus(uid, status);
  } catch (err) {
    console.error("Status update failed:", err);
  }
};

// Sync
let unsubscribe = null;

onMounted(() => {
  unsubscribe = adminService.listenToUsers(null, (registry) => {
    users.value = registry;
    loading.value = false;
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});
</script>

