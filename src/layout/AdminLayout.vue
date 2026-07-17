<template>
  <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row">
    <!-- Desktop Sidebar -->
    <aside class="hidden md:flex w-72 bg-slate-900 text-white flex-col p-8 fixed h-full z-40">
      <div class="flex items-center gap-3 mb-10">
        <div class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-3 shadow-xl border border-white/5 shrink-0 transition-transform hover:scale-110">
          <img src="/Images/Kuli Logo.png" class="w-full h-full object-contain" alt="Kuli Logo">
        </div>
        <div class="overflow-hidden">
          <h1 class="text-xs font-black uppercase tracking-tight text-white mb-0.5">Leh Lu Kya?</h1>
          <p class="text-[9px] text-slate-500 font-extrabold uppercase tracking-[0.2em]">Control Tower</p>
        </div>
      </div>

      <nav class="flex-1 space-y-2">
        <router-link 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 font-bold text-sm tracking-wide text-slate-400 hover:text-white"
          :class="$route.name === item.name ? 'bg-kuli-red text-white shadow-xl shadow-kuli-red/20 border border-kuli-red/10' : 'hover:bg-white/5'"
        >
          <component :is="item.icon" class="w-5 h-5" />
          {{ item.title }}
        </router-link>
      </nav>

      <div class="mt-auto pt-8 border-t border-white/5">
        <router-link :to="{ name: 'admin-profile' }" class="flex items-center gap-4 mb-4 p-3 -mx-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
           <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-kuli-red shadow-inner overflow-hidden border border-white/5 group-hover:scale-105 transition-transform">
               <ShieldCheckIcon class="w-6 h-6" />
           </div>
           <div>
             <h4 class="text-sm font-black truncate w-32 text-white group-hover:text-kuli-red transition-colors">Super Admin</h4>
             <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full Access</p>
           </div>
        </router-link>
        <button @click="handleLogout" class="flex items-center gap-4 px-4 py-2 w-full text-slate-400 hover:text-white font-bold transition-colors text-sm">
          <LogOutIcon class="w-5 h-5" />
          Logout Terminal
        </button>
      </div>
    </aside>

    <!-- Mobile Navigation -->
    <nav class="md:hidden fixed bottom-0 left-0 w-full bg-slate-900 border-t border-white/5 px-2 py-3 flex items-center justify-around z-50">
      <router-link 
        v-for="item in menuItems" 
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center gap-1.5 px-3 py-1 rounded-xl transition-all duration-300"
        :class="$route.name === item.name ? 'text-kuli-red transform -translate-y-1' : 'text-slate-500'"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span class="text-[10px] font-black uppercase tracking-widest">{{ item.title }}</span>
      </router-link>
      <button @click="handleLogout" class="flex flex-col items-center gap-1.5 text-slate-500">
        <LogOutIcon class="w-5 h-5" />
        <span class="text-[10px] font-black uppercase tracking-widest">Kill</span>
      </button>
    </nav>

    <!-- Main Content -->
    <main class="flex-1 md:ml-72 pb-24 md:pb-0 min-h-screen text-slate-900">
      <!-- Header Admin -->
      <header class="hidden md:flex bg-white px-10 py-6 border-b border-slate-200 items-center justify-between sticky top-0 z-30">
        <div>
          <h2 class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Station Management System</h2>
          <h1 class="text-lg font-black text-slate-900 uppercase">Control Panel v1.0.4</h1>
        </div>
        <div class="flex items-center gap-6">
           <!-- Real-time System Status Pill -->
           <SystemStatusPill />

           <!-- Real-time Notification Center -->
           <NotificationBell />
        </div>
      </header>

      <div class="p-6 md:p-10">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { 
  LayoutDashboardIcon, 
  UsersIcon, 
  HistoryIcon, 
  LogOutIcon, 
  ShieldCheckIcon 
} from 'lucide-vue-next';
import { markRaw } from 'vue';

// New Real-time Components
import SystemStatusPill from '../components/admin/SystemStatusPill.vue';
import NotificationBell from '../components/admin/NotificationBell.vue';

const router = useRouter();
const authStore = useAuthStore();

const menuItems = [
  { name: 'admin-dashboard', path: '/admin/dashboard', title: 'Home', icon: markRaw(LayoutDashboardIcon) },
  { name: 'admin-users', path: '/admin/users', title: 'Users', icon: markRaw(UsersIcon) },
  { name: 'admin-bookings', path: '/admin/bookings', title: 'Log', icon: markRaw(HistoryIcon) },
];

const handleLogout = async () => {
  await authStore.logout();
  router.push('/');
};
</script>
