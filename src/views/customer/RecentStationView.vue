<template>
  <div class="animate-fade-in space-y-8">
    <header>
      <h1 class="text-3xl font-black text-kuli-blue mb-2 uppercase tracking-tight">Recent Station</h1>
      <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Your latest station activity</p>
    </header>

    <div class="card p-6 md:p-8 shadow-xl">
      <div v-if="loading" class="py-12 flex flex-col items-center justify-center text-center">
        <div class="w-10 h-10 border-4 border-kuli-blue border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-xs font-black text-gray-500 uppercase tracking-widest">Loading station data...</p>
      </div>

      <div v-else-if="latestBooking" class="space-y-6">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 bg-kuli-gold/10 rounded-2xl flex items-center justify-center text-kuli-gold">
            <MapPinIcon class="w-7 h-7" />
          </div>
          <div>
            <h2 class="text-2xl font-black text-kuli-blue uppercase tracking-tight">{{ latestBooking.pickupStation || 'Unknown Station' }}</h2>
            <p class="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
              Platform {{ latestBooking.pickupPlatform || '-' }} • Last booking on {{ formatDate(latestBooking.createdAt) }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 rounded-xl bg-kuli-station border border-kuli-earth-dark">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Recent Fare</p>
            <p class="text-lg font-black text-kuli-blue">₹{{ latestBooking.price || 0 }}</p>
          </div>
          <div class="p-4 rounded-xl bg-kuli-station border border-kuli-earth-dark">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
            <p class="text-lg font-black text-kuli-blue uppercase">{{ latestBooking.status || 'unknown' }}</p>
          </div>
          <div class="p-4 rounded-xl bg-kuli-station border border-kuli-earth-dark">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Booking ID</p>
            <p class="text-lg font-black text-kuli-blue">#{{ latestBooking.id.slice(0, 8).toUpperCase() }}</p>
          </div>
        </div>

        <div class="flex flex-wrap gap-3">
          <router-link :to="{ name: 'customer-book' }" class="btn btn-primary h-12 px-6 text-xs font-black uppercase tracking-widest">
            Book At This Station
          </router-link>
          <router-link :to="{ name: 'customer-recent-bookings' }" class="btn h-12 px-6 text-xs font-black uppercase tracking-widest border border-kuli-earth-dark text-kuli-blue hover:border-kuli-red hover:text-kuli-red">
            View Booking History
          </router-link>
        </div>
      </div>

      <div v-else class="py-12 flex flex-col items-center justify-center text-center">
        <MapPinIcon class="w-10 h-10 text-gray-200 mb-3" />
        <p class="text-xs font-black text-gray-400 uppercase tracking-widest">No recent station found</p>
        <router-link :to="{ name: 'customer-book' }" class="mt-4 btn btn-primary h-11 px-5 text-xs font-black uppercase tracking-widest">Start First Booking</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { MapPinIcon } from 'lucide-vue-next';

const authStore = useAuthStore();
const latestBooking = ref(null);
const loading = ref(true);
let unsubscribe = null;

const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown Date';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

onMounted(() => {
  if (!authStore.user?.uid) {
    loading.value = false;
    return;
  }

  const q = query(collection(db, 'bookings'), where('customerId', '==', authStore.user.uid));
  unsubscribe = onSnapshot(q, (snapshot) => {
    const items = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => {
        const aTs = a.createdAt?.toMillis?.() ?? 0;
        const bTs = b.createdAt?.toMillis?.() ?? 0;
        return bTs - aTs;
      });

    latestBooking.value = items[0] || null;
    loading.value = false;
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});
</script>
