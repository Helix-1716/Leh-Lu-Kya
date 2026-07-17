<template>
  <div class="animate-fade-in space-y-8">
    <!-- Welcome Header -->
    <header class="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
      <div>
        <h1 class="text-3xl md:text-4xl font-black text-kuli-blue mb-2">Namaste, {{ authStore.user?.displayName || 'Commuter' }}!</h1>
        <p class="text-gray-500 font-bold uppercase tracking-widest text-xs">Where are you heading today?</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="card p-3 shadow-md flex items-center gap-4 h-full">
           <div class="w-10 h-10 rounded-lg bg-kuli-red/10 flex items-center justify-center text-kuli-red">
             <WalletIcon class="w-5 h-5" />
           </div>
           <div>
             <p class="text-[10px] font-black uppercase text-gray-400">Balance</p>
             <h4 class="text-lg font-black text-kuli-blue leading-none tracking-tight">₹{{ (authStore.userData?.wallet || 0).toFixed(2) }}</h4>
           </div>
           <router-link :to="{name: 'customer-wallet'}" class="btn btn-primary p-2 h-10 w-10 min-w-10 rounded-lg shadow-sm">
             <PlusIcon class="w-5 h-5" />
           </router-link>
        </div>
      </div>
    </header>

    <!-- Location Permission Prompt Banner -->
    <div v-if="locationStore.status === 'prompt' || locationStore.status === 'denied'" class="card bg-indigo-50 border border-indigo-100 p-4 flex flex-col sm:flex-row items-center justify-between shadow-sm gap-4">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex flex-shrink-0 items-center justify-center">
          <MapPinIcon class="w-6 h-6" />
        </div>
        <div>
          <h4 class="text-xs font-black text-indigo-900 uppercase tracking-widest mb-1">Enable Location Services</h4>
          <p class="text-[10px] text-indigo-700 font-bold uppercase tracking-widest max-w-sm">{{ locationStore.status === 'denied' ? 'Location access denied. Please allow it in settings.' : 'Share your real-time location to find nearby Kulis instantly.' }}</p>
        </div>
      </div>
      <button @click="requestLocation" class="bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 transition-all px-6 py-3 w-full sm:w-auto rounded-lg text-xs font-black uppercase tracking-widest shadow-md">
        {{ locationStore.status === 'denied' ? 'Retry Access' : 'Allow Location' }}
      </button>
    </div>

    <!-- Quick Booking & Interactive Map -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
       <!-- Real-Time Interactive Map (Leaflet Integration) -->
       <div 
          class="lg:col-span-2 card p-0 overflow-hidden relative min-h-[450px] group border-2 border-white shadow-2xl bg-[#F1F5F9]"
       >
          <!-- Leaflet Map Container -->
          <div id="map" class="absolute inset-0 z-10 w-full h-full"></div>

          <!-- UI Overlay -->
          <div class="absolute inset-0 z-20 p-8 flex flex-col pointer-events-none">
             <!-- Top Status Pill -->
             <div class="pointer-events-auto self-start">
                <div class="glass px-5 py-2.5 rounded-full border border-white/40 shadow-xl flex items-center gap-4 bg-white/60">
                   <div class="relative flex items-center justify-center">
                      <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div class="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75"></div>
                   </div>
                   <div class="flex flex-col">
                      <span class="text-[8px] font-black uppercase text-gray-400 tracking-[0.2em] leading-none mb-0.5">Live Discovery</span>
                      <span class="text-[10px] font-black uppercase tracking-widest text-kuli-blue">Searching Near: {{ locationStore.addressName }}</span>
                   </div>
                </div>
             </div>

             <!-- Contextual Search Metrics -->
             <div class="mt-auto pointer-events-auto flex flex-col sm:flex-row justify-between items-end gap-6">
                <!-- Action CTA -->
                <router-link :to="{name: 'customer-book'}" class="group relative overflow-hidden btn btn-primary h-16 px-10 text-lg font-black uppercase tracking-[0.1em] scale-100 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_-10px_rgba(228,30,38,0.4)]">
                   <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                   <span class="relative z-10">Start Booking</span>
                   <ArrowRightIcon class="relative z-10 w-6 h-6 ml-2" />
                </router-link>

                <!-- Live Status Card -->
                <div class="glass p-5 rounded-2xl border border-white/50 shadow-2xl flex gap-8 bg-white/70 min-w-[220px]">
                   <div class="flex flex-col gap-1">
                      <p class="text-[9px] font-black uppercase text-gray-400 tracking-widest">Nearby Porters</p>
                      <div class="flex items-end gap-2">
                         <h4 class="text-2xl font-black text-kuli-blue leading-none">{{ onlineKuliCount }}</h4>
                         <span class="text-[10px] font-black text-green-500 uppercase pb-0.5">Live</span>
                      </div>
                   </div>
                   <div class="w-px bg-kuli-blue/10"></div>
                   <div class="flex flex-col gap-1">
                      <p class="text-[9px] font-black uppercase text-gray-400 tracking-widest">Est. Arrival</p>
                      <div class="flex items-end gap-2">
                         <h4 class="text-2xl font-black text-kuli-blue leading-none">{{ estimatedWaitTime }}</h4>
                         <span class="text-[10px] font-black text-gray-500 uppercase pb-0.5">Mins</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>

       <!-- Side Cards -->
       <div class="flex flex-col gap-6">
          <!-- Recent Station Card -->
          <router-link :to="{ name: 'customer-recent-station' }" class="card hover:border-kuli-red transition-all cursor-pointer group block">
             <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-kuli-gold/10 rounded-xl flex items-center justify-center text-kuli-gold">
                  <MapPinIcon class="w-6 h-6" />
                </div>
                <div>
                   <h4 class="font-black text-kuli-blue uppercase tracking-tight">Recent Station</h4>
                   <p class="text-xs text-gray-500 font-bold uppercase tracking-widest line-clamp-1">{{ recentStation }}</p>
                </div>
                <ChevronRightIcon class="ml-auto w-5 h-5 text-gray-300 group-hover:text-kuli-red transition-colors" />
             </div>
          </router-link>

          <!-- History Widget -->
          <div class="card p-0 overflow-hidden flex-1 border-kuli-earth flex flex-col min-h-[250px]">
             <div class="p-6 border-b border-kuli-earth-dark flex items-center justify-between">
                <h4 class="font-black text-kuli-blue uppercase tracking-widest text-xs">Recent Bookings</h4>
                <router-link :to="{ name: 'customer-recent-bookings' }" class="text-[10px] font-black text-kuli-red uppercase hover:underline">View All</router-link>
             </div>
             <div class="flex-1 overflow-y-auto max-h-[250px] p-4 space-y-3">
                <div v-for="booking in bookings" :key="booking.id" class="p-3 bg-kuli-station rounded-lg border border-transparent hover:border-kuli-earth-dark transition-colors flex items-center gap-3">
                   <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-2 shadow-sm border border-slate-100 shrink-0">
                      <img src="/Images/Kuli Logo.png" class="w-full h-full object-contain" alt="Logo">
                   </div>
                   <div class="flex-1 min-w-0">
                      <h5 class="text-xs font-black text-kuli-blue uppercase truncate">{{ booking.pickupStation || 'Unknown Station' }}</h5>
                      <p class="text-[10px] text-gray-400 font-bold">{{ formatDate(booking.createdAt) }} • ₹{{ booking.price || '0' }}</p>
                   </div>
                   <div class="px-2 py-1 bg-green-100 text-green-700 text-[8px] font-black rounded uppercase tracking-widest leading-none">{{ booking.status || 'Done' }}</div>
                </div>
                <div v-if="bookings.length === 0" class="h-full flex flex-col items-center justify-center text-center p-8">
                   <HistoryIcon class="w-8 h-8 text-gray-200 mb-2" />
                   <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">No Recent Bookings <br> Found on Station</p>
                </div>
             </div>
          </div>

          <!-- SOS Banner -->
          <router-link :to="{ name: 'customer-emergency-sos' }" class="w-full bg-red-600 rounded-xl p-4 text-white flex items-center justify-between group overflow-hidden relative active:scale-95 transition-transform">
             <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-12 -translate-y-12"></div>
             <div class="relative z-10 flex items-center gap-4">
                <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                   <ShieldAlertIcon class="w-5 h-5 text-white" />
                </div>
                <div class="text-left">
                   <h4 class="font-black text-sm uppercase tracking-widest leading-none mb-1">Emergency SOS</h4>
                   <p class="text-[10px] font-bold text-red-200 uppercase tracking-widest leading-none">Instant Help</p>
                </div>
             </div>
             <ChevronRightIcon class="w-5 h-5 text-white" />
          </router-link>
       </div>
    </div>

    <!-- Quick Services Grid -->
    <section>
       <h3 class="text-xs font-black text-kuli-red uppercase tracking-[0.2em] mb-6">Explore Services</h3>
       <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <router-link :to="{ name: service.routeName }" v-for="service in services" :key="service.title" class="card shadow-md hover:shadow-kuli-hover hover:border-kuli-red/30 cursor-pointer transition-all p-5 flex flex-col items-center text-center group">
             <div class="w-16 h-16 rounded-2xl bg-kuli-station group-hover:bg-kuli-red/10 flex items-center justify-center text-kuli-blue group-hover:text-kuli-red transition-colors mb-4">
                <component :is="service.icon" class="w-8 h-8" />
             </div>
             <h4 class="text-xs font-black text-kuli-blue uppercase tracking-widest leading-tight mb-1">{{ service.title }}</h4>
             <p class="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-tight">{{ service.desc }}</p>
          </router-link>
       </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useLocationStore } from '../../stores/location';
import { 
  WalletIcon, 
  PlusIcon, 
  MapPinIcon, 
  ChevronRightIcon, 
  HistoryIcon, 
  ShieldAlertIcon, 
  BaggageClaimIcon, 
  UserPlusIcon, 
  TrendingUpIcon, 
  ArrowRightIcon, 
  InfoIcon, 
  PackageIcon, 
  AccessibilityIcon, 
  PersonStandingIcon 
} from 'lucide-vue-next';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const authStore = useAuthStore();
const locationStore = useLocationStore();
const bookings = ref([]); // Real data
const recentStation = ref('Main Junction');

// Leaflet Map References
let map = null;
let userMarker = null;
let kuliMarkers = [];
let routeLine = null;
const mapCenter = ref(locationStore.coords || [28.6613, 77.2232]); // Use session location if available

// Map & Kulis Data
const onlineKuliCount = ref(0);
const estimatedWaitTime = ref(3);

let unsubscribeKulis = null;
let unsubscribeBookings = null;

const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown Date';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

const initMap = () => {
  if (map) return;
  
  map = L.map('map', {
    zoomControl: false,
    attributionControl: false
  }).setView(mapCenter.value, 16);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19
  }).addTo(map);

  const userIcon = L.divIcon({
    className: 'custom-user-marker',
    html: `<div class="relative flex items-center justify-center">
             <div class="absolute w-12 h-12 bg-kuli-blue/5 rounded-full animate-ping"></div>
             <div class="w-4 h-4 bg-kuli-blue rounded-full border-2 border-white shadow-xl"></div>
           </div>`,
    iconSize: [48, 48]
  });

  userMarker = L.marker(mapCenter.value, { icon: userIcon }).addTo(map);
};

const updatePortersOnMap = (kulis) => {
  if (!map) return;

  // Clear old markers
  kuliMarkers.forEach(m => map.removeLayer(m));
  kuliMarkers = [];
  if (routeLine) map.removeLayer(routeLine);

  const kuliIcon = L.divIcon({
    className: 'custom-kuli-marker',
    html: `<div class="w-10 h-10 bg-white rounded-xl shadow-xl flex items-center justify-center border-2 border-kuli-red p-1.5 transition-transform hover:scale-110">
             <img src="/Images/Kuli Logo.png" class="w-full h-full object-contain" alt="Kuli">
           </div>`,
    iconSize: [40, 40]
  });

  kulis.forEach((kuli, index) => {
    // Simulate real placement near center
    const lat = mapCenter.value[0] + (kuli.pseudoY - 50) * 0.00015; 
    const lon = mapCenter.value[1] + (kuli.pseudoX - 50) * 0.00015;
    
    const marker = L.marker([lat, lon], { icon: kuliIcon }).addTo(map);
    kuliMarkers.push(marker);

    // Kuli Detail Popup on Hover/Click
    const avatarHtml = kuli.photoURL 
      ? `<img src="${kuli.photoURL}" class="w-full h-full object-cover rounded-lg" />`
      : `<div class="w-full h-full rounded-lg bg-kuli-red text-white flex items-center justify-center font-black text-xs">${kuli.name ? kuli.name.charAt(0) : 'K'}</div>`;

    const popupContent = `
      <div class="p-3 min-w-[140px] bg-white rounded-xl shadow-2xl border border-slate-100 animate-fade-in">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-lg shadow-sm border border-slate-50 flex-shrink-0 overflow-hidden">
            ${avatarHtml}
          </div>
          <div class="min-w-0">
            <h5 class="text-[10px] font-black uppercase text-kuli-blue tracking-tight leading-tight truncate px-1">${kuli.name || 'Porter'}</h5>
            <div class="flex items-center gap-0.5 text-kuli-gold mt-0.5 bg-kuli-gold/5 px-1.5 py-0.5 rounded-full w-fit">
              <span class="text-[10px] font-black">${kuli.rating || '4.8'}</span>
              <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            </div>
          </div>
        </div>
        <div class="py-1 px-2 bg-green-50 rounded-lg flex items-center justify-center gap-2">
          <div class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span class="text-[8px] font-black text-green-600 uppercase tracking-widest leading-none">Available</span>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, {
      closeButton: false,
      offset: [0, -10],
      className: 'kuli-detail-popup'
    });

    marker.on('mouseover', function(e) {
      this.openPopup();
    });

    // Show simulated 'Uber-style' road route to the nearest porter
    if (index === 0) {
      // Create a multi-point road-like path (not just a straight line)
      const roadPath = [
        [mapCenter.value[0], mapCenter.value[1]],
        [mapCenter.value[0] + (lat - mapCenter.value[0]) * 0.3, mapCenter.value[1]],
        [mapCenter.value[0] + (lat - mapCenter.value[0]) * 0.3, lon + (mapCenter.value[1] - lon) * 0.4],
        [mapCenter.value[0] + (lat - mapCenter.value[0]) * 0.7, lon + (mapCenter.value[1] - lon) * 0.4],
        [mapCenter.value[0] + (lat - mapCenter.value[0]) * 0.7, lon],
        [lat, lon]
      ];
      
      routeLine = L.polyline(roadPath, {
        color: '#E41E26',
        weight: 5,
        opacity: 0.4,
        dashArray: '1, 15',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      // Add a distance tooltip
      marker.bindTooltip(`${estimatedWaitTime.value} min away`, { 
        permanent: true, 
        direction: 'top', 
        className: 'route-tooltip' 
      }).openTooltip();
      
      // Animate the 'moving dots' on the line
      let offset = 0;
      const animateRoute = () => {
        offset--;
        if (routeLine) {
          routeLine.setStyle({ dashOffset: offset });
          requestAnimationFrame(animateRoute);
        }
      };
      animateRoute();
    }
  });
};

const requestLocation = () => {
  const isPreviouslyDenied = locationStore.status === 'denied';
  locationStore.status = 'loading';
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          mapCenter.value = [lat, lon];
          
          if (map) {
            map.setView(mapCenter.value, 16);
            if (userMarker) userMarker.setLatLng(mapCenter.value);
          } else {
            initMap();
          }

          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14`);
          const data = await res.json();
          
          let locName = 'Location Found';
          if (data && data.address) {
            locName = data.address.railway || data.address.suburb || data.address.city || data.address.town || data.address.village || 'Station Region';
          }
          
          locationStore.saveLocation(lat, lon, locName);

          // Update online count randomly for feel
          onlineKuliCount.value = Math.floor(Math.random() * 8) + 3;
        } catch (e) {
          locationStore.saveLocation(mapCenter.value[0], mapCenter.value[1], 'Location Found');
        }
      },
      (err) => {
        locationStore.setDenied();
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }
};

onMounted(() => {
  initMap();

  // Automatically request once per session if not already handled
  if (locationStore.status === 'prompt') {
    requestLocation();
  } else if (locationStore.status === 'granted' && locationStore.coords) {
    mapCenter.value = locationStore.coords;
    if (map) {
      map.setView(mapCenter.value, 16);
      if (userMarker) userMarker.setLatLng(mapCenter.value);
    }
  }

  // Recent Bookings
  if (authStore.user?.uid) {
    const bq = query(collection(db, 'bookings'), where('customerId', '==', authStore.user.uid));
    unsubscribeBookings = onSnapshot(bq, (snapshot) => {
      let fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      fetched.sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
      bookings.value = fetched.slice(0, 3);
      if (bookings.value.length > 0) recentStation.value = bookings.value[0].pickupStation || 'Station Area';
    });
  }

  // Online Kulis
  const q = query(collection(db, 'users'), where('role', '==', 'kuli'), where('isOnline', '==', true));
  unsubscribeKulis = onSnapshot(q, (snapshot) => {
    onlineKuliCount.value = snapshot.docs.length;
    estimatedWaitTime.value = onlineKuliCount.value > 10 ? 2 : onlineKuliCount.value > 5 ? 4 : onlineKuliCount.value > 0 ? 7 : 15;

    const mapData = snapshot.docs.slice(0, 5).map(doc => {
      const data = doc.data();
      // Ensure we resolve the correct photo URL similarly to authStore
      const resolvedPhoto = data.customPhotoURL || data.googlePhotoURL || data.photoURL;
      
      return {
        id: doc.id,
        name: data.name || 'Porter',
        photoURL: resolvedPhoto,
        rating: data.avgRating || 4.8,
        pseudoX: (parseInt(doc.id.substring(0, 4), 16) % 70) + 15,
        pseudoY: (parseInt(doc.id.substring(4, 8), 16) % 65) + 15
      };
    });
    
    updatePortersOnMap(mapData);
  });
});

onUnmounted(() => {
  if (unsubscribeKulis) unsubscribeKulis();
  if (unsubscribeBookings) unsubscribeBookings();
  if (map) {
    map.remove();
    map = null;
  }
});

const services = [
  { icon: BaggageClaimIcon, title: 'Luggage Move', desc: 'Standard porter service', routeName: 'customer-luggage-move' },
  { icon: PersonStandingIcon, title: 'Elderly Assist', desc: 'Platform assistance', routeName: 'customer-elderly-assist' },
  { icon: PackageIcon, title: 'Cargo Carry', desc: 'Bulk goods transfer', routeName: 'customer-cargo-carry' },
  { icon: AccessibilityIcon, title: 'Medical Assist', desc: 'Wheelchair & support', routeName: 'customer-medical-assist' },
];
</script>

<style>
.route-tooltip {
  background: #1A365D !important;
  color: white !important;
  border: none !important;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2) !important;
  font-weight: 800 !important;
  text-transform: uppercase !important;
  font-size: 10px !important;
  letter-spacing: 0.05em !important;
  border-radius: 8px !important;
  padding: 4px 10px !important;
}

.route-tooltip::before {
  border-top-color: #1A365D !important;
}

.custom-user-marker, .custom-kuli-marker {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* Hide leaflet attribution in premium look */
.leaflet-control-attribution {
  display: none !important;
}
</style>
