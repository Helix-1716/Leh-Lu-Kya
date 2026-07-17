<template>
  <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full relative group">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
          <Activity class="w-3 h-3 text-kuli-red" /> Live Load Factor
        </h4>
        <p class="text-xs font-black text-slate-900 uppercase">Station Workload Intelligence</p>
      </div>
      <div class="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
        <div class="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
        <span class="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Real-Time Sync</span>
      </div>
    </div>

    <!-- Main Chart Area -->
    <div class="flex-1 flex flex-col min-h-[320px]">
      <div class="flex-1 flex items-end justify-between gap-1 sm:gap-1.5 relative px-4">
        <!-- Y-Axis Background Lines -->
        <div class="absolute inset-x-0 inset-y-1 flex flex-col justify-between pointer-events-none opacity-10">
          <div v-for="i in 5" :key="i" class="w-full border-t border-slate-300 border-dashed"></div>
        </div>

        <!-- Bars -->
        <div v-for="(hour, index) in loadData" 
             :key="index"
             class="relative group/bar flex-1 flex flex-col items-center justify-end h-full min-w-[2px] sm:min-w-[4px]"
             @mouseenter="hoveredBar = index"
             @mouseleave="hoveredBar = null">
          
          <!-- Tooltip -->
          <Transition name="tooltip">
            <div v-if="hoveredBar === index" 
                 class="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-40 w-36 bg-slate-900 text-white rounded-xl p-3 shadow-2xl pointer-events-none border border-white/5 backdrop-blur-md">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[9px] font-black text-slate-400">H{{ hour.time }}</span>
                <span :class="getStatusColor(hour.load)" class="px-1.5 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-tight shadow-sm">
                  {{ getStatusText(hour.load) }}
                </span>
              </div>
              <div class="space-y-1">
                <div class="flex justify-between items-center text-slate-300">
                  <span class="text-[9px]">Bookings:</span>
                  <span class="text-[11px] font-black text-white">{{ hour.requests }}</span>
                </div>
              </div>
              <!-- Tooltip Arrow -->
              <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
            </div>
          </Transition>

          <!-- The Bar -->
          <div class="w-full rounded-t-lg transition-all duration-700 relative cursor-crosshair group-hover/bar:brightness-125 group-hover/bar:shadow-[0_0_15px_rgba(59,130,246,0.2)] overflow-hidden"
               :style="{ 
                 height: hour.load + '%',
                 background: getBarGradient(hour.load)
               }">
            <!-- Animated shimmer for peak bars -->
            <div v-if="hour.load > 85" class="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>

      <!-- X-Axis Labels -->
      <div class="flex justify-between px-4 pt-4 border-t border-slate-100 mt-3">
        <span v-for="label in ['00:00', '06:00', '12:00', '18:00', '24:00']" 
              :key="label" 
              class="text-[9px] font-black text-slate-400 font-mono tracking-tighter">
          {{ label }}
        </span>
      </div>
    </div>

    <!-- Analytics Insights Panel (Compact) -->
    <div class="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60">
      <div class="space-y-1 px-1">
        <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Peak Period</p>
        <p class="text-sm font-black text-slate-900 tracking-tight">18:00 – 22:00</p>
      </div>
      <div class="space-y-1 px-1 border-l border-slate-200">
        <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Avg Load</p>
        <p class="text-sm font-black text-slate-900 tracking-tight">62.4%</p>
      </div>
      <div class="space-y-1 px-1 border-l border-slate-200">
        <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Current Risk</p>
        <p class="text-sm font-black text-green-600 tracking-tight uppercase italic">Optimal</p>
      </div>
      <div class="space-y-1 px-1 border-l border-slate-200">
        <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Efficiency</p>
        <div class="flex items-center gap-2">
           <p class="text-sm font-black text-slate-900 tracking-tight">89.2%</p>
           <TrendingUp class="w-3 h-3 text-green-500" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Activity, Info, TrendingUp } from 'lucide-vue-next';

const hoveredBar = ref(null);
const loadData = ref([]);

const generateData = () => {
  const data = [];
  // Ensure we consistently generate exactly 24 data points for the 24-hour cycle
  for (let i = 0; i < 24; i++) {
    let baseLoad = 25;
    // Morning Rush (8 AM - 11 AM)
    if (i >= 8 && i <= 11) {
      baseLoad += 45 + Math.random() * 20;
    } 
    // Evening Rush (5 PM - 9 PM)
    else if (i >= 17 && i <= 21) {
      baseLoad += 55 + Math.random() * 25;
    } 
    // Baseline fluctuation
    else {
      baseLoad += Math.random() * 30;
    }

    data.push({
      time: i.toString().padStart(2, '0') + ':00',
      load: Math.min(Math.round(baseLoad), 98),
      requests: Math.floor(baseLoad * 1.5)
    });
  }
  loadData.value = data;
};

const getBarGradient = (load) => {
  if (load > 80) return 'linear-gradient(to top, #ef4444, #f87171)';
  if (load > 50) return 'linear-gradient(to top, #f59e0b, #fbbf24)';
  return 'linear-gradient(to top, #3b82f6, #60a5fa)';
};

const getStatusColor = (load) => {
  if (load > 80) return 'bg-red-500 text-white';
  if (load > 50) return 'bg-amber-500 text-white';
  return 'bg-blue-500 text-white';
};

const getStatusText = (load) => {
  if (load > 90) return 'CRITICAL';
  if (load > 80) return 'PEAK';
  if (load > 50) return 'MODERATE';
  return 'OPTIMAL';
};

// Initialize data immediately
generateData();

onMounted(() => {
  // Data is already generated, but we could add a small interval here if we wanted live updates
});
</script>

<style scoped>
.tooltip-enter-active, .tooltip-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.tooltip-enter-from, .tooltip-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}
</style>
