<template>
  <div class="min-h-screen bg-kuli-earth-light flex flex-col md:flex-row">
    <!-- Desktop Sidebar -->
    <aside class="hidden md:flex w-72 bg-kuli-blue text-white flex-col p-8 fixed h-full z-40">
      <div class="flex items-center gap-3 mb-12">
        <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-lg shrink-0 transition-transform hover:scale-110">
          <img src="/Images/Kuli Logo.png" class="w-full h-full object-contain" alt="Kuli Logo">
        </div>
        <div>
          <h1 class="text-sm font-black uppercase tracking-tight leading-none leading-0">Leh Lu Kya?</h1>
          <p class="text-[8px] text-kuli-gold font-black uppercase tracking-widest">Commuter Portal</p>
        </div>
      </div>

      <nav class="flex-1 space-y-2">
        <router-link 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 font-bold text-sm tracking-wide text-blue-200/70 hover:text-white"
          :class="$route.name === item.name ? 'bg-kuli-red text-white shadow-lg shadow-kuli-red/20' : 'hover:bg-white/5'"
        >
          <component :is="item.icon" class="w-5 h-5" />
          {{ item.title }}
        </router-link>
      </nav>

      <div class="mt-auto pt-8 border-t border-white/10">
        <router-link :to="{ name: 'customer-profile' }" class="flex items-center gap-4 mb-8 p-3 -mx-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
            <div class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-kuli-red shadow-inner overflow-hidden border border-white/5 group-hover:scale-105 transition-transform">
                <img v-if="authStore.profilePhoto && !imageError" 
                     :src="authStore.profilePhoto" 
                     referrerpolicy="no-referrer"
                     class="w-full h-full object-cover"
                     @error="imageError = true">
                <UserIcon v-else class="w-6 h-6" />
            </div>
           <div class="overflow-hidden">
             <h4 class="text-sm font-black truncate w-32 text-white group-hover:text-kuli-red transition-colors">{{ authStore.userData?.name || authStore.user?.displayName || 'Commuter' }}</h4>
             <p class="text-[10px] font-bold text-blue-300 uppercase tracking-widest">{{ authStore.userData?.tier || 'General' }} User</p>
           </div>
        </router-link>
        <button @click="handleLogout" class="flex items-center gap-4 px-4 py-3.5 w-full text-red-400 hover:text-red-300 font-bold transition-colors">
          <LogOutIcon class="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>

    <!-- Mobile Navigation -->
    <nav class="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-kuli-earth-dark px-2 py-3 flex items-center justify-around z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <router-link 
        v-for="item in menuItems" 
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center gap-1.5 px-3 py-1 rounded-xl transition-all duration-300"
        :class="$route.name === item.name ? 'text-kuli-red transform -translate-y-1' : 'text-gray-400'"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span class="text-[10px] font-black uppercase tracking-widest">{{ item.title }}</span>
      </router-link>
      <button @click="handleLogout" class="flex flex-col items-center gap-1.5 text-gray-400">
        <LogOutIcon class="w-5 h-5" />
        <span class="text-[10px] font-black uppercase tracking-widest">Exit</span>
      </button>
    </nav>

    <!-- Main Content -->
    <main class="flex-1 md:ml-72 pb-24 md:pb-0 min-h-screen">
      <!-- Header Mobile -->
      <header class="md:hidden glass px-6 py-4 border-b border-kuli-earth-dark flex items-center justify-between sticky top-0 z-30">
        <div class="flex items-center gap-2">
           <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-sm border border-slate-100">
             <img src="/Images/Kuli Logo.png" class="w-full h-full object-contain" alt="Kuli Logo">
           </div>
           <h1 class="text-sm font-black text-kuli-blue uppercase">Leh Lu Kya?</h1>
        </div>
        <router-link :to="{ name: 'customer-profile' }" class="w-8 h-8 rounded-full bg-kuli-station overflow-hidden border border-kuli-earth flex items-center justify-center">
             <img v-if="authStore.profilePhoto && !imageErrorMobile" 
                  :src="authStore.profilePhoto" 
                  referrerpolicy="no-referrer"
                  class="w-full h-full object-cover"
                  @error="imageErrorMobile = true">
             <UserIcon v-else class="w-4 h-4 text-kuli-blue" />
        </router-link>
      </header>

      <div class="p-6 md:p-10">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { 
  LayoutDashboardIcon, 
  PlusCircleIcon, 
  MapPinIcon, 
  HistoryIcon, 
  WarehouseIcon, 
  WalletIcon, 
  UserIcon, 
  LogOutIcon, 
  MenuIcon 
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const imageError = ref(false);
const imageErrorMobile = ref(false);

const menuItems = [
  { name: 'customer-dashboard', path: '/customer/dashboard', title: 'Home', icon: LayoutDashboardIcon },
  { name: 'customer-book', path: '/customer/book', title: 'Book Kuli', icon: PlusCircleIcon },
  { name: 'customer-wallet', path: '/customer/wallet', title: 'Wallet', icon: WalletIcon },
  { name: 'customer-profile', path: '/customer/profile', title: 'Profile', icon: UserIcon },
];

const handleLogout = async () => {
  await authStore.logout();
  router.push('/');
};
</script>

<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
</style>
