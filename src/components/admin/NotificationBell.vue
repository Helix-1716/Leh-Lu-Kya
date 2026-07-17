<template>
  <div class="relative">
    <!-- Notification Bell Button -->
    <button 
      @click="toggleDropdown"
      class="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative group"
      :class="isOpen ? 'bg-kuli-red text-white shadow-xl shadow-kuli-red/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'"
    >
      <BellIcon class="w-6 h-6 group-active:scale-90 transition-transform" />
      
      <!-- Unread Badge -->
      <span 
        v-if="unreadCount > 0" 
        class="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-kuli-red text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce shadow-lg"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- Notification Dropdown Panel -->
    <transition name="panel-slide">
      <div 
        v-if="isOpen" 
        v-click-outside="closeDropdown"
        class="absolute top-full mt-4 right-0 w-96 bg-white rounded-[2.5rem] shadow-3xl border border-slate-100 flex flex-col z-[70] overflow-hidden"
      >
        <!-- Header -->
        <header class="p-6 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h3 class="text-sm font-black text-slate-800 uppercase tracking-widest">Station Alerts</h3>
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ unreadCount }} Unread Events</p>
          </div>
          <button 
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            class="text-[9px] font-black text-kuli-red uppercase tracking-widest hover:underline"
          >
            Mark All Read
          </button>
        </header>

        <!-- Filters -->
        <div class="flex items-center gap-3 px-6 py-4 bg-slate-50 overflow-x-auto no-scrollbar border-b border-slate-100">
          <button 
            v-for="f in ['All', 'Unread', 'Critical', 'Bookings']" :key="f"
            class="px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap"
            :class="activeFilter === f ? 'bg-kuli-red text-white' : 'bg-white text-slate-400 hover:bg-slate-200'"
            @click="activeFilter = f"
          >
            {{ f }}
          </button>
        </div>

        <!-- Notification List -->
        <div class="flex-1 max-h-[480px] overflow-y-auto custom-scrollbar p-2">
          <div v-if="loading" class="py-20 flex justify-center items-center">
            <div class="w-8 h-8 border-4 border-slate-100 border-t-kuli-red rounded-full animate-spin"></div>
          </div>

          <div v-else-if="filteredNotifications.length === 0" class="py-24 text-center">
            <div class="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 grayscale">
              <PackageCheckIcon class="w-8 h-8 text-slate-300" />
            </div>
            <h4 class="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-1">Queue Clear</h4>
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">All station events accounted for</p>
          </div>

          <div v-else class="space-y-1">
            <div 
              v-for="n in filteredNotifications" :key="n.id"
              @click="handleNotificationClick(n)"
              class="p-4 rounded-3xl transition-all cursor-pointer group flex gap-4 relative overflow-hidden"
              :class="n.read ? 'hover:bg-slate-50 opacity-60' : 'bg-slate-50 group-unread'"
            >
              <div v-if="!n.read" class="absolute left-0 top-0 bottom-0 w-1 bg-kuli-red"></div>
              
              <div class="w-10 h-10 rounded-2xl flex items-center justify-center transition-colors shadow-sm" :class="getIconBg(n.type, n.severity)">
                 <component :is="getIcon(n.type)" class="w-5 h-5" :class="getIconColor(n.type, n.severity)" />
              </div>

              <div class="flex-1 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-[8px] font-black uppercase tracking-widest" :class="getTypeColor(n.type)">{{ n.type || 'Platform' }}</span>
                  <span class="text-[8px] font-bold text-slate-300">{{ formatTimestamp(n.createdAt) }}</span>
                </div>
                <h5 class="text-[10px] font-black text-slate-800 uppercase leading-tight group-hover:text-kuli-red transition-colors">{{ n.title }}</h5>
                <p class="text-[10px] font-bold text-slate-400 line-clamp-2 leading-relaxed">{{ n.message }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <footer class="p-6 border-t border-slate-50 bg-slate-50/50">
           <button class="w-full py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-[1.5rem] hover:bg-kuli-red transition-all shadow-xl active:scale-95">
              Access Full Ops Log
           </button>
        </footer>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { 
  BellIcon, PackageCheckIcon, ShieldAlertIcon, 
  HistoryIcon, UserCheckIcon, WalletIcon 
} from 'lucide-vue-next';
import { notificationService } from '../../services/notificationService';

// Directive for outside clicks
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener("click", el.clickOutsideEvent);
  },
};

const isOpen = ref(false);
const loading = ref(true);
const notifications = ref([]);
const unreadCount = ref(0);
const activeFilter = ref('All');

const toggleDropdown = (event) => {
  event.stopPropagation();
  isOpen.value = !isOpen.value;
};
const closeDropdown = () => {
  if (isOpen.value) {
    isOpen.value = false;
  }
};

// Helpers
const getIcon = (type) => {
  if (type === 'booking') return HistoryIcon;
  if (type === 'kuli') return UserCheckIcon;
  if (type === 'payment') return WalletIcon;
  return ShieldAlertIcon;
};

const getIconBg = (type, severity) => {
  if (severity === 'critical') return 'bg-red-50';
  if (type === 'booking') return 'bg-blue-50';
  if (type === 'kuli') return 'bg-amber-50';
  return 'bg-slate-50';
};

const getIconColor = (type, severity) => {
  if (severity === 'critical') return 'text-red-500';
  if (type === 'booking') return 'text-blue-500';
  if (type === 'kuli') return 'text-amber-500';
  return 'text-slate-500';
};

const getTypeColor = (type) => {
  if (type === 'booking') return 'text-blue-600';
  if (type === 'kuli') return 'text-amber-600';
  return 'text-slate-400';
};

const formatTimestamp = (ts) => {
  if (!ts) return 'Just now';
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  const diff = Math.floor((new Date() - date) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
};

const filteredNotifications = computed(() => {
  let list = notifications.value;
  if (activeFilter.value === 'Unread') list = list.filter(n => !n.read);
  if (activeFilter.value === 'Critical') list = list.filter(n => n.severity === 'critical');
  if (activeFilter.value === 'Bookings') list = list.filter(n => n.type === 'booking');
  return list;
});

// Actions
const markAllAsRead = async () => {
  try {
    await notificationService.markAllAsRead(notifications.value);
  } catch (err) {
    console.error("Mark all as read failed:", err);
  }
};

const handleNotificationClick = async (n) => {
  if (!n.read) {
    try {
      await notificationService.markAsRead(n.id);
    } catch (err) {
      console.error("Mark as read failed:", err);
    }
  }
  // Potential routing logic here
};

// Sync
const unsubscribers = [];

onMounted(() => {
  unsubscribers.push(notificationService.listenToNotifications((data) => {
    notifications.value = data;
    loading.value = false;
  }));

  unsubscribers.push(notificationService.listenToUnreadCount((count) => {
    unreadCount.value = count;
  }));
});

onUnmounted(() => {
  unsubscribers.forEach(unsub => unsub());
});
</script>

<style scoped>
.panel-slide-enter-active, .panel-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.panel-slide-enter-from, .panel-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 3px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #f1f5f9;
  border-radius: 10px;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
