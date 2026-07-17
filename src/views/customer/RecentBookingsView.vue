<template>
  <div class="animate-fade-in space-y-8">
    <header class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black text-kuli-blue mb-2 uppercase tracking-tight">Recent Bookings</h1>
        <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Complete trip activity timeline</p>
      </div>
      <router-link :to="{ name: 'customer-book' }" class="btn btn-primary h-11 px-5 text-xs font-black uppercase tracking-widest self-start sm:self-auto">
        New Booking
      </router-link>
    </header>

    <div class="card p-0 overflow-hidden border-kuli-earth">
      <div class="p-5 border-b border-kuli-earth-dark bg-kuli-station">
        <p class="text-[10px] font-black uppercase tracking-widest text-gray-500">Latest to oldest</p>
      </div>

      <div v-if="loading" class="py-12 flex flex-col items-center justify-center text-center">
        <div class="w-10 h-10 border-4 border-kuli-blue border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-xs font-black text-gray-500 uppercase tracking-widest">Loading bookings...</p>
      </div>

      <div v-else-if="bookings.length > 0" class="p-4 space-y-3">
        <div v-for="booking in bookings" :key="booking.id" class="p-4 bg-kuli-station rounded-xl border border-kuli-earth-dark flex items-center gap-4">
          <div class="w-11 h-11 bg-white rounded-lg flex items-center justify-center p-2 shadow-sm border border-slate-100 shrink-0">
            <img src="/Images/Kuli Logo.png" class="w-full h-full object-contain" alt="Logo">
          </div>

          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-black text-kuli-blue uppercase truncate tracking-tight">
              {{ booking.pickupStation || 'Unknown Station' }} | PF {{ booking.pickupPlatform || '-' }}
            </h4>
            <p class="text-xs text-gray-500 font-bold mt-1">{{ formatDate(booking.createdAt) }} • ₹{{ booking.price || 0 }}</p>
          </div>

          <div class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest leading-none" :class="getStatusClass(booking.status)">
            {{ booking.status || 'unknown' }}
          </div>
        </div>
      </div>

      <div v-else class="py-12 flex flex-col items-center justify-center text-center">
        <HistoryIcon class="w-10 h-10 text-gray-200 mb-3" />
        <p class="text-xs font-black text-gray-400 uppercase tracking-widest">No bookings found</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { HistoryIcon } from 'lucide-vue-next';

const authStore = useAuthStore();
const bookings = ref([]);
const loading = ref(true);
let unsubscribe = null;

const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown Date';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

const getStatusClass = (status) => {
  const map = {
    requested: 'bg-amber-100 text-amber-700',
    accepted: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-indigo-100 text-indigo-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  };
  return map[status] || 'bg-slate-100 text-slate-600';
};

onMounted(() => {
  if (!authStore.user?.uid) {
    loading.value = false;
    return;
  }

  const q = query(collection(db, 'bookings'), where('customerId', '==', authStore.user.uid));
  unsubscribe = onSnapshot(q, (snapshot) => {
    bookings.value = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => {
        const aTs = a.createdAt?.toMillis?.() ?? 0;
        const bTs = b.createdAt?.toMillis?.() ?? 0;
        return bTs - aTs;
      });
    loading.value = false;
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});
</script>
