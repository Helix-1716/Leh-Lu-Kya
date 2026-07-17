<template>
  <!-- GLOBAL ADMIN WRAPPER WITH MAX-WIDTH -->
  <div class="min-h-screen bg-[#f8fafc] pb-12">
    
    <!-- DETERMINISTIC LOADING OVERLAY -->
    <div v-if="loading" class="fixed inset-0 bg-white/80 backdrop-blur-md z-[500] flex items-center justify-center">
       <div class="flex flex-col items-center gap-6 animate-pulse">
          <div class="w-20 h-20 bg-white p-4 rounded-2xl shadow-xl flex items-center justify-center relative">
             <img src="/Images/Kuli Logo.png" class="w-full h-full object-contain relative z-10" alt="Kuli Logo">
             <div class="absolute inset-0 border-2 border-kuli-red/20 border-t-kuli-red rounded-2xl animate-spin"></div>
          </div>
          <div class="text-center">
             <p class="text-xs font-black uppercase tracking-widest text-slate-800 mb-1">Station Central Sync</p>
             <p class="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400">Fetching live operational data...</p>
          </div>
       </div>
    </div>

    <!-- MAIN DASHBOARD CONTENT -->
    <div class="max-w-[1440px] mx-auto px-6 sm:px-10 space-y-8 animate-fade-in pt-6 pb-20">
      
      <!-- BRANDED DASHBOARD HEADER -->
      <header class="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-slate-100 pb-8 mt-4">
         <div class="flex items-center gap-5">
            <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-3 shadow-xl border border-slate-100 shrink-0 transition-transform hover:scale-110">
               <img src="/Images/Kuli Logo.png" class="w-full h-full object-contain" alt="Kuli Logo">
            </div>
            <div class="flex flex-col">
               <h1 class="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-1.5 font-sans">Station Command</h1>
               <div class="flex items-center gap-3">
                  <span class="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Operations Control Center</span>
                  <div class="w-1 h-1 bg-slate-300 rounded-full"></div>
                  <span class="text-[10px] font-black uppercase tracking-[0.3em] text-kuli-red">Live Station T1</span>
               </div>
            </div>
         </div>

         <div class="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
            <div class="flex flex-col items-end px-4">
               <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Admin Terminal</p>
               <p class="text-xs font-black text-slate-900 tracking-tight">SDH-ADMIN-ALPHA</p>
            </div>
            <div class="w-11 h-11 bg-slate-200 rounded-xl overflow-hidden border-2 border-white shadow-sm">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" class="w-full h-full object-cover">
            </div>
         </div>
      </header>
      

      <!-- TOP METRICS (Tightened Grid) -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         <div v-for="stat in statsCards" :key="stat.title" @click="handleStatClick(stat)" 
              class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group relative overflow-hidden h-24">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" :class="stat.bg">
               <component :is="stat.icon" class="w-6 h-6" :class="stat.color" />
            </div>
            <div class="min-w-0">
               <h4 class="text-xl font-black text-slate-900 uppercase tracking-tighter truncate leading-none mb-1">
                  {{ stat.isCurrency ? '₹' : '' }}{{ formatValue(stat.value) }}
               </h4>
               <p class="text-[9px] font-bold uppercase tracking-widest text-slate-400 truncate">{{ stat.title }}</p>
            </div>
         </div>
      </section>

      <!-- PRIMARY 2-COLUMN OPERATIONAL GRID -->
      <main class="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
         
         <!-- LEFT: ANALYTICS & LOGS -->
         <div class="space-y-8">
            <!-- REFINED RECOMMENDATION STRIP (Integrated) -->
            <div class="p-4 bg-amber-50 border border-amber-200/50 rounded-2xl flex flex-col sm:flex-row items-center gap-4 shadow-sm">
               <div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                  <TrendingUpIcon class="w-5 h-5 text-amber-600" />
               </div>
               <div class="flex-1">
                  <p class="text-[10px] font-black text-amber-900 uppercase tracking-widest mb-0.5">Yield Optimization Insight</p>
                  <p class="text-[11px] font-bold text-amber-700 leading-tight">Demand surge predicted near Platform 4. Deploy 2 additional Kulis within 15 minutes.</p>
               </div>
               <button class="px-5 py-2.5 bg-amber-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-amber-200 shrink-0 hover:bg-amber-700 active:scale-95 transition-all">
                  Optimize Now
               </button>
            </div>

            <!-- PRIMARY ANALYTICS -->
            <LoadAnalyticsWidget />

            <!-- CONSOLIDATED MONITORING CONSOLE -->
            <div class="space-y-4">
               <div class="flex items-center justify-between px-2">
                  <div class="flex items-center gap-3">
                     <ActivityIcon class="w-4 h-4 text-kuli-red" />
                     <h2 class="text-xs font-black text-slate-900 uppercase tracking-widest">Operations Console</h2>
                  </div>
                  <div class="flex items-center gap-4">
                     <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <div class="w-1 h-1 bg-green-500 rounded-full"></div> Live Sync Active
                     </span>
                     <button @click="refreshData" class="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] hover:opacity-70">
                        Refresh
                     </button>
                  </div>
               </div>

               <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[320px] flex flex-col">
                  <!-- DATA TABLE -->
                  <table v-if="liveRides.length > 0" class="w-full text-left">
                     <thead class="bg-slate-50 border-b border-slate-200">
                        <tr>
                           <th class="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Log ID</th>
                           <th class="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Porter / Kuli</th>
                           <th class="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status / Progress</th>
                           <th class="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Operational Fare</th>
                        </tr>
                     </thead>
                     <tbody class="divide-y divide-slate-100">
                        <tr v-for="ride in liveRides" :key="ride.id" class="hover:bg-slate-50 transition-colors cursor-pointer group">
                           <td class="px-6 py-4 text-xs font-black text-slate-400">#{{ ride.id?.substring(0,6).toUpperCase() }}</td>
                           <td class="px-6 py-4">
                              <div class="flex items-center gap-3 font-bold text-xs text-slate-900">
                                 <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] uppercase font-black text-slate-500">
                                    {{ ride.kuliName ? ride.kuliName.charAt(0) : 'P' }}
                                 </div>
                                 {{ ride.kuliName || 'Unassigned' }}
                              </div>
                           </td>
                           <td class="px-6 py-4">
                              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border" :class="getStatusColor(ride.status)">
                                 {{ ride.status || 'requested' }}
                              </div>
                           </td>
                           <td class="px-6 py-4 text-xs font-black text-slate-900 text-right">₹{{ ride.fare || 0 }}</td>
                        </tr>
                     </tbody>
                  </table>

                  <!-- COMPACT EMPTY STATE -->
                  <div v-else class="flex-1 flex flex-col items-center justify-center p-12 text-center">
                     <div class="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                        <HistoryIcon class="w-7 h-7 text-slate-200" />
                     </div>
                     <h3 class="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">No Active Operations</h3>
                     <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-[200px] leading-relaxed">
                        Station logic is monitoring but no porter events are currently active.
                     </p>
                  </div>
               </div>
            </div>
         </div>

         <!-- RIGHT: SIDEBAR SUPPORTING TOOLS -->
         <aside class="space-y-8 sticky top-6">
            <!-- IDENTITY REGISTRY AREA -->
            <div class="space-y-6">
               <AdminVerificationQueue 
                 :requests="verificationRequests"
                 @select="selectedRequest = $event"
               />
               
               <VerifiedKulisList 
                 @view="selectedRequest = $event"
               />
            </div>
            
            <!-- NETWORK SECURITY LOG (DYNAMIZED) -->
            <div class="bg-slate-900 rounded-[2rem] p-6 text-white overflow-hidden relative group shadow-2xl shadow-slate-200">
               <div class="relative z-10">
                  <div class="flex items-center justify-between mb-6">
                     <h4 class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Network Security Log</h4>
                     <div class="flex items-center gap-2">
                        <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                        <span class="text-[8px] font-black text-green-400 uppercase tracking-widest">Live Security Feed</span>
                     </div>
                  </div>
                  
                  <div class="space-y-4">
                     <!-- Node Status 1 -->
                     <div class="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                        <div class="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                           <ShieldAlertIcon class="w-4 h-4 text-kuli-red opacity-80" />
                        </div>
                        <div class="flex-1">
                           <p class="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Blockchain Node 01</p>
                           <div class="flex items-center gap-2">
                              <span class="text-[10px] font-bold text-white tracking-widest">SECURE / SYNCED</span>
                              <div class="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                                 <div class="h-full bg-green-500 w-[94%]"></div>
                              </div>
                           </div>
                        </div>
                     </div>

                     <!-- Node Status 2 -->
                     <div class="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                        <div class="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                           <CpuIcon class="w-4 h-4 text-blue-400 opacity-80" />
                        </div>
                        <div class="flex-1">
                           <p class="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Identity Verification Gate</p>
                           <div class="flex items-center gap-2">
                              <span class="text-[10px] font-bold text-white tracking-widest">MONITORING</span>
                              <div class="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                                 <div class="h-full bg-blue-500 w-[68%]"></div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div class="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                     <p class="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Protocol v4.0.12</p>
                     <p class="text-[8px] font-black text-green-400 uppercase tracking-widest bg-green-400/10 px-2 py-1 rounded-lg">All Nodes Active</p>
                  </div>
               </div>
               
               <!-- Subtle Background Decoration -->
               <AlertOctagonIcon class="absolute -right-4 -bottom-4 w-32 h-32 text-white/[0.02] rotate-12" />
               <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
            </div>
         </aside>
      </main>
    </div>

    <!-- Identity Request Detail Modal -->
    <VerificationRequestDetails 
      v-if="selectedRequest"
      :request="selectedRequest"
      @close="selectedRequest = null"
      @updated="refreshData"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { 
  BriefcaseIcon, 
  WalletIcon, 
  BarChart3Icon, 
  TrendingUpIcon, 
  ActivityIcon, 
  HistoryIcon, 
  UserCheckIcon, 
  AlertOctagonIcon, 
  PackageCheckIcon,
  Bell as BellIcon,
  ShieldAlert as ShieldAlertIcon,
  Cpu as CpuIcon
} from 'lucide-vue-next';
import { adminService } from '../../services/adminService';
import AdminVerificationQueue from '../../components/admin/AdminVerificationQueue.vue';
import VerifiedKulisList from '../../components/admin/VerifiedKulisList.vue';
import LoadAnalyticsWidget from '../../components/admin/LoadAnalyticsWidget.vue';
import VerificationRequestDetails from '../../components/admin/VerificationRequestDetails.vue';

// State Management
const loading = ref(true);
const liveRides = ref([]);
const verificationRequests = ref([]);
const selectedRequest = ref(null);

const showRegistryModal = ref(false);
const activeFleet = ref([]);
const loadingRegistry = ref(false);
let registryUnsub = null;

const showRevenueModal = ref(false);
const activeRevenue = ref([]);
const loadingRevenue = ref(false);
let revenueUnsub = null;

const showBookingsModal = ref(false);
const activeBookings = ref([]);
const loadingBookings = ref(false);
let bookingsUnsub = null;

const showAlertsModal = ref(false);
const activeAlerts = ref([]);
const loadingAlerts = ref(false);
let alertsUnsub = null;

const liveStats = ref({
  totalRevenue: 0,
  activeBookings: 0,
  totalKulis: 0,
  systemAlerts: 0,
  totalCustomers: 0,
  pendingApprovals: 0
});

// Deterministic Loading Resolution
const handleStatClick = (stat) => {
  if (stat.title === 'Active Fleet' && stat.value > 0) {
    showRegistryModal.value = true;
    loadingRegistry.value = true;
    if (registryUnsub) registryUnsub();
    registryUnsub = adminService.listenToUsers('kuli', (kulis) => {
      activeFleet.value = kulis.filter(k => k.status === 'active');
      loadingRegistry.value = false;
    });
  } else if (stat.title === 'Gross Revenue' && stat.value > 0) {
    showRevenueModal.value = true;
    loadingRevenue.value = true;
    if (revenueUnsub) revenueUnsub();
    revenueUnsub = adminService.listenToRevenue((rev) => {
      activeRevenue.value = rev;
      loadingRevenue.value = false;
    });
  } else if (stat.title === 'Live Bookings' && stat.value > 0) {
    showBookingsModal.value = true;
    loadingBookings.value = true;
    if (bookingsUnsub) bookingsUnsub();
    bookingsUnsub = adminService.listenToLiveBookings((bookings) => {
      activeBookings.value = bookings;
      loadingBookings.value = false;
    });
  } else if (stat.title === 'Security Alerts' && stat.value > 0) {
    showAlertsModal.value = true;
    loadingAlerts.value = true;
    if (alertsUnsub) alertsUnsub();
    alertsUnsub = adminService.listenToAlerts((alerts) => {
      activeAlerts.value = alerts;
      loadingAlerts.value = false;
    });
  }
};

const closeAllModals = () => {
  showRegistryModal.value = false;
  showRevenueModal.value = false;
  showBookingsModal.value = false;
  showAlertsModal.value = false;

  if (registryUnsub) { registryUnsub(); registryUnsub = null; }
  if (revenueUnsub) { revenueUnsub(); revenueUnsub = null; }
  if (bookingsUnsub) { bookingsUnsub(); bookingsUnsub = null; }
  if (alertsUnsub) { alertsUnsub(); alertsUnsub = null; }
};

const closeRegistryModal = closeAllModals;

// We use a counter to ensure all primary dashboard streams have reported in at least once
let loadedStreams = ref(0);
const totalRequiredStreams = 3; // Stats, Bookings, Pending Kulis

const resolveLoading = () => {
    loadedStreams.value++;
    if (loadedStreams.value >= totalRequiredStreams) {
        // Slow down slightly for visual comfort
        setTimeout(() => {
            loading.value = false;
        }, 500);
    }
};

const refreshData = () => {
    window.location.reload();
};

// Computed UI Tokens
const statsCards = computed(() => [
  { 
    title: 'Gross Revenue', 
    value: liveStats.value.totalRevenue, 
    icon: WalletIcon, 
    color: 'text-kuli-red', 
    bg: 'bg-red-50', 
    isCurrency: true 
  },
  { 
    title: 'Live Bookings', 
    value: liveStats.value.activeBookings, 
    icon: ActivityIcon, 
    color: 'text-indigo-600', 
    bg: 'bg-indigo-50' 
  },
  { 
    title: 'Active Fleet', 
    value: liveStats.value.totalKulis, 
    icon: BriefcaseIcon, 
    color: 'text-amber-600', 
    bg: 'bg-amber-50' 
  },
  { 
    title: 'Security Alerts', 
    value: liveStats.value.systemAlerts, 
    icon: AlertOctagonIcon, 
    color: 'text-slate-900', 
    bg: 'bg-slate-100' 
  },
]);

// Helpers
const formatValue = (val) => {
  if (val >= 1000) return (val / 1000).toFixed(1) + 'k';
  return val;
};

const getStatusColor = (status) => {
  const map = {
    'requested': 'bg-slate-50 text-slate-400 border-slate-100',
    'negotiating': 'bg-amber-50 text-amber-600 border-amber-100',
    'accepted': 'bg-blue-50 text-blue-600 border-blue-100',
    'in_progress': 'bg-green-50 text-green-600 border-green-100',
    'completed': 'bg-green-100 text-green-800 border-green-200',
    'cancelled': 'bg-red-50 text-red-600 border-red-100'
  };
  return map[status] || map.requested;
};

// Actions
const handleApprove = async (id) => {
  try {
    await adminService.approveKuli(id);
  } catch (err) {
    console.error("Action Failed:", err);
  }
};

const handleReject = async (id) => {
  if (!confirm("Confirm rejection of application?")) return;
  try {
    await adminService.rejectKuli(id);
  } catch (err) {
    console.error("Action Failed:", err);
  }
};

// Live Sync Lifecycle
const unsubscribers = [];

onMounted(() => {
  // 1. Stats Stream
  unsubscribers.push(adminService.listenToStats((stats) => {
    liveStats.value = stats;
    if (loading.value) resolveLoading();
  }));

  // 2. Identity Verification Queue Stream
  unsubscribers.push(adminService.listenToVerificationRequests((reqs) => {
    verificationRequests.value = reqs;
    if (loading.value) resolveLoading();
  }));

  // 3. Bookings Stream
  unsubscribers.push(adminService.listenToLiveBookings((bookings) => {
    liveRides.value = bookings;
    if (loading.value) resolveLoading();
  }));
});

onUnmounted(() => {
  unsubscribers.forEach(unsub => unsub());
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.animate-slide-in {
  animation: slideIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
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
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>

