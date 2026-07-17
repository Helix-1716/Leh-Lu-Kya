<template>
  <div class="relative group">
    <div 
      class="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 border cursor-default"
      :class="[status.bg, status.border || 'border-transparent']"
    >
      <div class="relative flex items-center justify-center">
        <div class="w-1.5 h-1.5 rounded-full" :class="status.color"></div>
        <div v-if="isAlert" class="absolute w-1.5 h-1.5 rounded-full animate-ping" :class="status.color"></div>
      </div>
      <span class="text-[10px] font-black uppercase tracking-widest" :class="status.text">
        {{ status.label }}
      </span>
    </div>

    <!-- Tooltip / Details -->
    <div class="absolute top-full mt-2 right-0 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-[60]">
      <div class="flex items-center justify-between mb-3 pb-3 border-b border-slate-50">
        <h4 class="text-[10px] font-black text-slate-800 uppercase tracking-widest">System Health</h4>
        <span class="text-[8px] font-bold text-slate-300">{{ formatTime(status.lastUpdated) }}</span>
      </div>
      
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-[9px] font-bold text-slate-400 uppercase">Core Services</span>
          <span class="text-[9px] font-black text-green-500 uppercase">Active</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-[9px] font-bold text-slate-400 uppercase">Database Sync</span>
          <span class="text-[9px] font-black text-green-500 uppercase">Stable</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-[9px] font-bold text-slate-400 uppercase">Incidents (Live)</span>
          <span class="text-[9px] font-black uppercase" :class="status.text">{{ isAlert ? '1 Reported' : 'Zero' }}</span>
        </div>
      </div>

      <div v-if="isAlert" class="mt-4 p-3 bg-red-50 rounded-xl border border-red-100">
         <p class="text-[8px] font-black text-red-600 uppercase mb-1">Active Incident</p>
         <p class="text-[9px] font-bold text-red-400 leading-tight">System has detected a synchronization delay in zone alerts.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { notificationService } from '../../services/notificationService';

const status = ref({
  state: 'operational',
  label: 'System Operational',
  color: 'bg-green-500',
  bg: 'bg-green-50',
  text: 'text-green-600',
  lastUpdated: new Date()
});

const isAlert = computed(() => ['critical', 'warning'].includes(status.value.state));

const formatTime = (date) => {
  if (!date) return 'Just now';
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
};

let unsubscribe = null;

onMounted(() => {
  unsubscribe = notificationService.listenToSystemStatus((newStatus) => {
    status.value = newStatus;
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});
</script>
