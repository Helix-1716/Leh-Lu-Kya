<template>
  <div class="min-h-screen bg-kuli-station flex flex-col md:flex-row">
    <!-- Desktop Sidebar -->
    <aside class="hidden md:flex w-72 bg-kuli-blue-dark text-white flex-col p-8 fixed h-full z-40 shadow-2xl border-r border-white/5">
      <div class="flex items-center gap-3 mb-12">
        <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-lg border border-white/10 shrink-0 transition-transform hover:scale-110">
          <img src="/Images/Kuli Logo.png" class="w-full h-full object-contain" alt="Kuli Logo">
        </div>
        <div>
          <h1 class="text-sm font-black uppercase tracking-tight leading-none text-white">Leh Lu Kya?</h1>
          <p class="text-[8px] text-blue-200/70 font-black uppercase tracking-widest mt-1">Porter Portal</p>
        </div>
      </div>

      <nav class="flex-1 space-y-2">
        <router-link 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 font-bold text-sm tracking-wide text-blue-100/60 hover:text-white group"
          :class="$route.name === item.name ? 'bg-kuli-red text-white shadow-lg shadow-black/20 border border-white/10' : 'hover:bg-white/5'"
        >
          <component :is="item.icon" class="w-5 h-5 transition-transform group-hover:scale-110" />
          {{ item.title }}
        </router-link>
      </nav>

      <div class="mt-auto pt-8 border-t border-white/10">
        <div class="flex items-center gap-4 mb-4 group cursor-pointer" @click="router.push('/kuli/profile')">
            <div class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/10 overflow-hidden shadow-inner uppercase font-black text-xs group-hover:bg-white/20 transition-colors">
                <img v-if="authStore.profilePhoto && !imageError" 
                     :src="authStore.profilePhoto" 
                     referrerpolicy="no-referrer"
                     class="w-full h-full object-cover"
                     @error="imageError = true">
                <span v-else>{{ (authStore.userData?.name || authStore.user?.displayName || 'KY').split(' ').map(n => n[0]).join('').slice(0, 2) }}</span>
            </div>
            <div class="overflow-hidden">
              <h4 class="text-sm font-black truncate w-32 text-white">{{ authStore.userData?.name || authStore.user?.displayName || 'Porter' }}</h4>
              <p class="text-[10px] font-bold text-blue-200/50 uppercase tracking-widest">Badge #{{ authStore.userData?.badgeId || '1284' }}</p>
            </div>
        </div>

        <!-- Real-time Rating Pill -->
        <div class="bg-white/5 border border-white/10 rounded-xl p-3 mb-8 flex items-center justify-between">
           <div class="flex items-center gap-2">
              <StarIcon class="w-4 h-4 text-kuli-gold fill-current" />
              <span class="text-xs font-black text-white uppercase tracking-widest">Rating</span>
           </div>
           <div class="px-2 py-0.5 bg-kuli-gold/20 text-kuli-gold rounded-lg text-xs font-black border border-kuli-gold/20">
              {{ currentRating.toFixed(1) }}
           </div>
        </div>

        <button @click="handleLogout" class="flex items-center gap-4 px-4 py-3.5 w-full text-blue-100/60 hover:text-kuli-red hover:bg-white/5 rounded-xl font-bold transition-all group">
          <LogOutIcon class="w-5 h-5 group-hover:rotate-12 transition-transform" />
          Logout From Duty
        </button>
      </div>
    </aside>

    <!-- Mobile Navigation -->
    <nav class="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-kuli-earth-dark px-2 py-3 flex items-center justify-around z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
      <router-link 
        v-for="item in menuItems" 
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center gap-1.5 px-4 py-1 rounded-xl transition-all duration-300"
        :class="$route.name === item.name ? 'text-kuli-red scale-110' : 'text-gray-400 opacity-60 hover:opacity-100'"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span class="text-[9px] font-black uppercase tracking-widest">{{ item.title }}</span>
      </router-link>
      <button @click="handleLogout" class="flex flex-col items-center gap-1.5 text-gray-400 opacity-60 px-4 py-1">
        <LogOutIcon class="w-5 h-5" />
        <span class="text-[9px] font-black uppercase tracking-widest">Off-Duty</span>
      </button>
    </nav>

    <!-- Main Content -->
    <main class="flex-1 md:ml-72 pb-24 md:pb-0 min-h-screen">
      <!-- Header Mobile -->
      <header class="md:hidden bg-kuli-red px-6 py-4 border-b border-kuli-red-dark flex items-center justify-between sticky top-0 z-30 text-white shadow-md">
        <div class="flex items-center gap-2">
           <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-md">
             <img src="/Images/Kuli Logo.png" class="w-full h-full object-contain" alt="Kuli Logo">
           </div>
           <h1 class="text-sm font-black uppercase">Leh Lu Kya?</h1>
        </div>
        <router-link :to="{ name: 'kuli-profile' }" class="flex items-center gap-4">
           <div class="h-6 w-12 bg-white/20 rounded-full flex items-center px-1">
              <div class="w-4 h-4 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
           </div>
           <div class="w-8 h-8 rounded-full bg-white/20 overflow-hidden border border-white/20 flex items-center justify-center text-[10px] font-black uppercase">
              <img v-if="authStore.profilePhoto && !imageErrorMobile" 
                   :src="authStore.profilePhoto" 
                   referrerpolicy="no-referrer"
                   class="w-full h-full object-cover"
                   @error="imageErrorMobile = true">
              <span v-else>{{ (authStore.userData?.name || authStore.user?.displayName || 'KY').split(' ').map(n => n[0]).join('').slice(0, 2) }}</span>
           </div>
        </router-link>
      </header>

      <div class="p-6 md:p-10">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { kuliService } from '../services/kuliService';
import { 
  LayoutDashboardIcon, 
  WalletIcon, 
  UserIcon, 
  LogOutIcon, 
  StarIcon
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const imageError = ref(false);
const imageErrorMobile = ref(false);
const currentRating = ref(0);
let unsubscribeStats = null;

const menuItems = [
  { name: 'kuli-dashboard', path: '/kuli/dashboard', title: 'Duty', icon: LayoutDashboardIcon },
  { name: 'kuli-earnings', path: '/kuli/earnings', title: 'Earnings', icon: WalletIcon },
  { name: 'kuli-profile', path: '/kuli/profile', title: 'Porter ID', icon: UserIcon },
];

const handleLogout = async () => {
  await authStore.logout();
  router.push('/');
};

onMounted(() => {
  if (authStore.user?.uid) {
    unsubscribeStats = kuliService.listenToPorterRatings(authStore.user.uid, (data) => {
      currentRating.value = data.rating || 0;
    });
  }
});

onUnmounted(() => {
  if (unsubscribeStats) unsubscribeStats();
});
</script>
