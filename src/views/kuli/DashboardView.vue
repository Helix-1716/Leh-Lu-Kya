<template>
  <div class="animate-fade-in space-y-8">
    <!-- Header with Online Switch -->
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-3xl font-black text-kuli-blue mb-1">Porter Dashboard</h1>
        <p class="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Live Duty Status: <span :class="isOnline ? 'text-green-500' : 'text-red-500'">{{ isOnline ? 'Online' : 'Offline' }}</span></p>
      </div>

      <div class="flex items-center gap-6">
         <!-- Online Switch -->
         <button 
           @click="toggleDuty"
           :disabled="updatingStatus"
           class="h-14 px-8 rounded-full flex items-center gap-4 transition-all duration-300 shadow-xl disabled:opacity-50"
           :class="isOnline ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-kuli-blue text-white shadow-kuli-blue/20'"
         >
            <div class="w-6 h-6 rounded-full bg-white flex items-center justify-center">
               <div v-if="updatingStatus" class="w-3 h-3 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
               <div v-else :class="isOnline ? 'bg-green-500' : 'bg-gray-300'" class="w-2.5 h-2.5 rounded-full transition-colors"></div>
            </div>
            <span class="font-black uppercase tracking-widest text-sm">{{ isOnline ? 'On Duty' : 'Go Online' }}</span>
         </button>
      </div>
    </header>

    <!-- Earnings Overview (Static for now, will connect to payments in next step) -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
       <div class="card bg-kuli-blue text-white border-none p-8 flex flex-col justify-between group overflow-hidden relative">
          <TrendingUpIcon class="absolute bottom-0 right-0 w-32 h-32 text-white opacity-5 translate-x-1/2 translate-y-1/2" />
          <div>
             <p class="text-[10px] font-black uppercase tracking-widest text-blue-200 opacity-60 mb-2">Earnings Today</p>
             <h4 class="text-4xl font-black tracking-tight mb-8">₹{{ stats.earnings || 0 }}</h4>
          </div>
          <div class="flex items-center justify-between">
             <div class="text-[10px] font-black uppercase bg-white/10 px-3 py-1 rounded-full">{{ stats.trips || 0 }} Trips Done</div>
             <ChevronRightIcon class="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
          </div>
       </div>

       <div class="card p-8 group">
          <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Acceptance Rate</p>
          <div class="flex items-end gap-3 mb-6">
             <h4 class="text-3xl font-black text-kuli-blue">100%</h4>
             <div class="h-6 w-16 bg-green-100 rounded flex items-center justify-center text-[10px] font-black text-green-700 uppercase mb-1">Excellent</div>
          </div>
          <div class="w-full h-2 bg-kuli-station rounded-full overflow-hidden">
             <div class="w-[100%] h-full bg-green-500"></div>
          </div>
       </div>

       <div class="card p-8 group">
          <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Average Rating</p>
          <div v-if="stats.rating > 0" class="flex items-center gap-2 mb-6 text-kuli-gold">
             <h4 class="text-3xl font-black text-kuli-blue">{{ stats.rating.toFixed(1) }}</h4>
             <div class="flex">
               <StarIcon v-for="i in 5" :key="i" class="w-5 h-5" :class="i <= Math.round(stats.rating) ? 'fill-current' : 'text-gray-200'" />
             </div>
          </div>
          <div v-else class="flex items-center gap-2 mb-6 text-gray-300">
             <h4 class="text-3xl font-black text-gray-300 italic">0.0</h4>
             <div class="flex">
               <StarIcon v-for="i in 5" :key="i" class="w-5 h-5 text-gray-200" />
             </div>
          </div>
          <p class="text-xs font-bold uppercase tracking-widest" :class="stats.rating > 0 ? 'text-gray-500' : 'text-kuli-red'">
            {{ stats.rating > 0 ? 'Top Rated in ' + userZone : 'No ratings to show' }}
          </p>
       </div>
    </section>

    <!-- Active Mission Map Section -->
    <section v-if="activeMission" class="card overflow-hidden p-0 flex flex-col relative min-h-[500px]">
       <!-- Map Background Layer -->
       <div class="absolute inset-0 bg-slate-50 flex items-center justify-center z-0 pointer-events-none">
          <!-- Stylized Map Grid -->
          <svg class="w-full h-full opacity-20" viewBox="0 0 800 600">
             <path d="M0,100 L800,100 M0,200 L800,200 M0,300 L800,300 M0,400 L800,400 M0,500 L800,500" stroke="#CBD5E1" stroke-width="2" />
             <path d="M100,0 L100,600 M200,0 L200,600 M300,0 L300,600 M400,0 L400,600 M500,0 L500,600 M600,0 L600,600 M700,0 L700,600" stroke="#CBD5E1" stroke-width="2" />
          </svg>
          
          <!-- Animated Route Line SVG -->
          <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <!-- Dash array path indicating the route from Kuli(bottom-left) to Customer(top-right) -->
             <path class="route-line animate-dash" d="M 30,70 Q 50,70 50,50 T 80,30" fill="none" stroke="#2563EB" stroke-width="0.8" stroke-dasharray="2,2" stroke-linecap="round" />
          </svg>
          
          <!-- User / Customer Marker -->
          <div class="absolute" style="top: 30%; left: 80%; transform: translate(-50%, -50%);">
             <div class="relative group">
                <div class="absolute inset-x-[-10px] inset-y-[-10px] bg-kuli-blue shadow-lg opacity-20 rounded-full animate-ping"></div>
                <div class="w-8 h-8 bg-kuli-blue rounded-full border-4 border-white shadow-xl flex items-center justify-center relative z-10">
                   <UserIcon class="w-4 h-4 text-white" />
                </div>
                <div class="absolute bottom-full mb-2 -translate-x-1/2 left-1/2 bg-white px-3 py-1.5 rounded-lg shadow-xl text-[10px] font-black text-kuli-blue whitespace-nowrap z-20">
                   Customer: {{ activeMission.customerName || 'Waiting' }}
                </div>
             </div>
          </div>
          
          <!-- Kuli Position Marker -->
          <div class="absolute" style="top: 70%; left: 30%; transform: translate(-50%, -50%);">
             <div class="relative">
                <div class="absolute bottom-11 bg-kuli-red text-white px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg -translate-x-1/2 left-1/2 z-20 whitespace-nowrap">
                   You
                </div>
                <div class="w-10 h-10 bg-kuli-red text-white rounded-xl shadow-2xl flex items-center justify-center border-4 border-white relative z-10 animate-pulse-subtle">
                   <MapPinIcon class="w-5 h-5" />
                </div>
             </div>
          </div>
       </div>

       <!-- Overlay UI Panels -->
       <div class="relative z-10 flex flex-col h-full pointer-events-none p-4 pb-0 justify-between min-h-[500px]">
          <!-- Top Info Banner -->
          <div class="pointer-events-auto self-center bg-white/90 backdrop-blur shadow-2xl px-6 py-3 rounded-full border border-slate-100 flex items-center gap-4">
             <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <CompassIcon class="w-4 h-4 animate-spin-slow" />
             </div>
             <div>
                <p class="text-[9px] font-black uppercase text-gray-500 tracking-widest leading-none mb-1">Navigating to</p>
                <h3 class="text-sm font-black text-slate-800 uppercase leading-none">{{ activeMission.pickupStation || 'Station Location' }}</h3>
             </div>
             <div class="w-px h-6 bg-slate-200 mx-2"></div>
             <div>
                <h3 class="text-lg font-black text-kuli-red">~4 Min</h3>
                <p class="text-[9px] font-black text-red-400 uppercase tracking-widest leading-none">200 meters</p>
             </div>
          </div>

          <!-- Bottom Action Drawer -->
          <div class="pointer-events-auto bg-white mt-auto rounded-t-3xl shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.1)] w-full border-t border-slate-100 p-6">
             <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-4">
                   <div class="w-12 h-12 bg-kuli-station rounded-xl flex items-center justify-center text-kuli-blue">
                      <BaggageClaimIcon class="w-6 h-6" />
                   </div>
                   <div>
                      <h4 class="text-lg font-black text-slate-800 uppercase tracking-tight">{{ activeMission.itemsCount || activeMission.items || 1 }} Items • {{ activeMission.weightCategory || 'Standard' }}</h4>
                      <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Earnings: <span class="text-green-500">₹{{ activeMission.price || '0' }}</span></p>
                   </div>
                </div>
                <div class="px-4 py-2 bg-slate-100 text-slate-500 rounded-lg text-xs font-black uppercase tracking-widest">
                   {{ activeMission.status }}
                </div>
             </div>
             
             <div class="flex gap-4">
                <button class="bg-indigo-50 text-indigo-600 font-black uppercase tracking-widest text-xs h-12 px-6 rounded-xl shadow-sm hover:bg-indigo-100 flex items-center gap-2 transition-colors">
                   <PhoneIcon class="w-4 h-4" /> Call
                </button>
                <button @click="markAsComplete(activeMission.id)" class="flex-1 btn btn-primary h-12 text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">
                   <CheckCircleIcon class="w-4 h-4" /> Mark Completed
                </button>
             </div>
          </div>
       </div>
    </section>

    <!-- Real-time Requests Section -->
    <section v-else class="space-y-6">
       <div class="flex items-center justify-between">
          <h3 class="text-sm font-black text-kuli-red uppercase tracking-widest flex items-center gap-3 truncate pr-4">
             <BellIcon class="w-4 h-4 shrink-0" :class="{ 'animate-swing': requests.length > 0 }" /> 
             Near {{ userZone }} ({{ requests.length }} Requests)
          </h3>
          <button @click="handleUpdateZone" class="text-[10px] font-black text-kuli-blue uppercase underline tracking-widest cursor-pointer hover:text-kuli-red transition-colors shrink-0">Update Zone</button>
       </div>

       <!-- Data Loading State -->
       <div v-if="loading" class="card py-20 flex flex-col items-center justify-center text-center">
          <div class="w-12 h-12 border-4 border-kuli-red border-t-transparent rounded-full animate-spin mb-4"></div>
          <p class="text-xs font-black text-gray-400 uppercase tracking-widest">Scanning Network...</p>
       </div>

       <!-- Requests Grid -->
       <div v-else-if="requests.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="req in requests" :key="req.id" class="card relative group hover:border-kuli-red/30 transition-all transform hover:-translate-y-1 duration-300">
             <!-- Status Tag -->
             <div class="absolute top-4 right-4 bg-kuli-red/10 text-kuli-red px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                New Request
             </div>

             <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 rounded-xl bg-kuli-station flex items-center justify-center text-kuli-blue border border-kuli-earth overflow-hidden">
                   <UserIcon class="w-6 h-6" />
                </div>
                <div class="overflow-hidden">
                   <h4 class="font-black text-kuli-blue text-sm uppercase truncate w-32">{{ req.customerName || 'Anonymous' }}</h4>
                   <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ req.items || req.itemsCount || 0 }} Items • {{ req.weight || 'Medium' }}</p>
                </div>
             </div>

             <div class="space-y-4 mb-6 pt-4 border-t border-kuli-earth-dark">
                <div class="flex items-center gap-4">
                   <div class="w-8 h-8 rounded-lg bg-kuli-station flex items-center justify-center text-kuli-blue">
                      <MapPinIcon class="w-4 h-4" />
                   </div>
                   <div>
                      <p class="text-[8px] font-black uppercase text-gray-400">Arriving At</p>
                      <h5 class="text-xs font-black text-kuli-blue uppercase truncate w-40">{{ req.pickupStation || req.location }}</h5>
                   </div>
                </div>
                <div class="flex items-center gap-4">
                   <div class="w-8 h-8 rounded-lg bg-kuli-station flex items-center justify-center text-kuli-blue">
                      <ClockIcon class="w-4 h-4" />
                   </div>
                   <div>
                      <p class="text-[8px] font-black uppercase text-gray-400">Request Sent</p>
                      <h5 class="text-xs font-black text-kuli-blue uppercase">{{ formatTime(req.createdAt) }}</h5>
                   </div>
                </div>
             </div>

             <div class="flex items-center justify-between mb-6">
                <p class="text-[10px] font-black uppercase text-gray-400">Fixed Offer</p>
                <div class="text-2xl font-black text-kuli-red tracking-tight">₹{{ req.offeredPrice || req.price }}</div>
             </div>

             <!-- Actions -->
             <div class="flex gap-3">
                <button @click="acceptRequest(req.id)" class="flex-1 btn btn-primary h-12 text-xs uppercase tracking-widest rounded-xl">Accept</button>
                <button class="flex-1 btn bg-kuli-blue text-white h-12 text-xs uppercase tracking-widest rounded-xl hover:bg-kuli-blue-dark">Counter</button>
             </div>
             
             <button @click="passOffer(req.id)" class="w-full mt-3 text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest py-2 transition-colors">Pass Offer</button>
          </div>
       </div>

       <!-- Empty State: Custom Message for No Requests -->
       <div v-else class="card py-24 flex flex-col items-center justify-center text-center bg-gray-50/50">
          <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-xl border border-kuli-earth-dark animate-pulse-subtle">
             <RadioTowerIcon class="w-12 h-12 text-kuli-red" />
          </div>
          <h4 class="text-xl font-black text-kuli-blue uppercase tracking-[0.2em] mb-3">No Customer to Pic</h4>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed max-w-xs">
            Listening for signals from platforms... <br> 
            Check your cellular connection.
          </p>
          <div class="mt-8 flex gap-2">
             <div v-for="i in 3" :key="i" class="w-1.5 h-1.5 rounded-full bg-kuli-red/20" :class="'animate-ping-delay-' + i"></div>
          </div>
       </div>
    </section>

    <!-- UPDATE ZONE MODAL -->
    <div v-if="showZoneModal" class="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
       <div class="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 border border-slate-200 animate-slide-up">
          <div class="flex items-center justify-between mb-6">
             <h3 class="text-xl font-black text-slate-800 uppercase tracking-tight">Update Zone</h3>
             <button @click="showZoneModal = false" class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
             </button>
          </div>
          
          <form @submit.prevent="submitUpdateZone" class="space-y-4">
             <div>
                <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">State / Region</label>
                <input v-model="zoneForm.state" type="text" list="state-list" required placeholder="e.g. Maharashtra" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-kuli-blue focus:ring-2 focus:ring-kuli-blue/20 transition-all placeholder:font-normal" />
                <datalist id="state-list">
                  <option v-for="state in allStates" :key="state" :value="state"></option>
                </datalist>
             </div>
             
             <div>
                <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Station Name</label>
                <input v-model="zoneForm.station" type="text" list="station-list" required placeholder="e.g. Mumbai Central" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-kuli-blue focus:ring-2 focus:ring-kuli-blue/20 transition-all placeholder:font-normal" />
                <datalist id="station-list">
                  <option v-for="station in allStations" :key="station" :value="station"></option>
                </datalist>
             </div>
             
             <div class="grid grid-cols-2 gap-4">
                <div>
                   <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Platform No.</label>
                   <input v-model="zoneForm.platform" type="number" min="1" required placeholder="e.g. 4" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-kuli-blue focus:ring-2 focus:ring-kuli-blue/20 transition-all placeholder:font-normal" />
                </div>
                
                <div>
                   <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Direction</label>
                   <select v-model="zoneForm.direction" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-kuli-blue focus:ring-2 focus:ring-kuli-blue/20 transition-all" required>
                      <option value="up">Up</option>
                      <option value="down">Down</option>
                      <option value="both">Both/Any</option>
                   </select>
                </div>
             </div>
             
             <button type="submit" :disabled="updatingZone" class="w-full mt-4 py-3.5 bg-kuli-blue text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                <span v-if="updatingZone" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                {{ updatingZone ? 'Updating...' : 'Set Active Zone' }}
             </button>
          </form>
       </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { kuliService } from '../../services/kuliService';
import { 
  TrendingUpIcon, 
  StarIcon, 
  ChevronRightIcon, 
  BellIcon, 
  UserIcon, 
  MapPinIcon, 
  ClockIcon, 
  RadioTowerIcon, 
  MapIcon,
  CompassIcon,
  PhoneIcon,
  CheckCircleIcon,
  BaggageClaimIcon
} from 'lucide-vue-next';
const authStore = useAuthStore();
const isOnline = ref(authStore.userData?.isOnline ?? true);
const userZone = ref(authStore.userData?.activeZone || 'Arrival Area');
const updatingStatus = ref(false);
const requests = ref([]);
const loading = ref(true);
const activeMission = ref(null);

// Zone Form State
const showZoneModal = ref(false);
const updatingZone = ref(false);
const zoneForm = ref({
   state: '',
   station: '',
   platform: '',
   direction: 'both'
});

const stats = ref({
  rating: 0,
  trips: 0,
  earnings: 0
});

const allStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
].sort();

const allStations = [
  "New Delhi (NDLS)", "Old Delhi (DLI)", "Hazrat Nizamuddin (NZM)", "Anand Vihar Trm (ANVT)", 
  "Howrah (HWH)", "Sealdah (SDAH)", "Kolkata (KOAA)", "Santragachi (KOAA)", "Chennai Central (CSMT)", 
  "Lokmanya Tilak Terminus (LTT)", "Bandra Terminus (BDTS)", "Dadar (DR)", "Mumbai Central (MMCT)",
  "Pune Junction (DR)", "Secunderabad (MAS)", "Chennai Egmore (MS)", "Vijayawada (SC)", "Hyderabad (HYB)",
  "Bengaluru Central (SBC)", "Yesvantpur (YPR)", "Trivandrum Central (TVC)", "Ernakulam Junction (ERS)",
  "Ahmedabad Junction (SBC)", "Bhubaneswar (BZA)", "Patna Junction (BBS)", "Guwahati (BBS)",
  "Kanpur Central (CNB)", "Varanasi Junction (CNB)", "Prayagraj Junction (BSB)", "Lucknow (LKO)",
  "Gorakhpur Junction (GKP)", "Jaipur Junction (JP)", "Jodhpur Junction (JP)", "Ajmer Junction (JU)",
  "Agra Cantt (AGC)", "Jhansi Junction (LKO)", "Amritsar Junction (GKP)", "Ludhiana Junction (ASR)",
  "Chandigarh Junction (SBC)", "Ambala Cantt (UMB)", "Jammu Tawi (JAT)", "Dehradun (CDG)",
  "Bhopal Junction (BPL)", "Indore Junction (BPL)", "Jabalpur (JBP)", "Gwalior (JHS)",
  "Raipur Junction (JBP)", "Nagpur Junction (R)", "Bilaspur Junction (BSP)", "Ranchi (R)",
  "Puri (BBS)", "Cuttack (BBS)", "Visakhapatnam (VSKP)", "Tirupati (TPTY)",
  "Coimbatore Junction (CBE)", "Madurai Junction (CBE)", "Tiruchirappalli (TPJ)", "Madurai (MDU)",
  "Kozhikode (MDU)", "Mangaluru Central (MAQ)", "Mysuru Junction (YPR)", "Hubballi Junction (SBC)",
  "Pune Junction (PUNE)", "Nashik Road (NK)", "Surat (ST)", "Vadodara Junction (BRC)",
  "Rajkot Junction (RJT)", "Bhavnagar Terminus (BVC)", "Gandinagar Capital (GNC)", "Gaya Junction (PNBE)",
  "Muzaffarpur Junction (MFP)", "Bhagalpur (BGP)", "Samastipur Junction (SPJ)", "Darbhanga Junction (DBG)",
  "Kharagpur Junction (KGP)", "Dhanbad Junction (DBG)", "Tatanagar Junction (TATA)", "Asansol Junction (ASN)",
  "Durgapur (ASN)", "Barddhaman (ASN)", "Malda Town (MLDT)", "New Jalpaiguri (NJP)",
  "Siliguri Junction (NJP)", "Alipurduar Junction (NCB)", "Dibrugarh (DBRG)", "Tinsukia (DBRG)",
  "Dimapur (DBRG)", "Agartala (AGTL)", "Silchar (AGTL)"
].sort();

let unsubscribeRequests = null;
let unsubscribeStats = null;
let unsubscribeMission = null;

const markAsComplete = async (bookingId) => {
  try {
    await kuliService.completeMission(bookingId);
    activeMission.value = null;
    alert('Mission Completed! Great Job.');
  } catch (err) {
    console.error("Failed to complete:", err);
  }
};

const toggleDuty = async () => {
  updatingStatus.value = true;
  try {
    await kuliService.updateDutyStatus(authStore.user.uid, !isOnline.value);
    isOnline.value = !isOnline.value;
    setupRequestSubscription();
  } catch (err) {
    console.error("Failed to update status:", err);
  } finally {
    updatingStatus.value = false;
  }
};

const handleUpdateZone = () => {
   showZoneModal.value = true;
};

const submitUpdateZone = async () => {
   updatingZone.value = true;
   try {
      const { state, station, platform, direction } = zoneForm.value;
      const formattedZone = `${station} (PF-${platform} ${direction.toUpperCase()})`;
      
      await kuliService.updateZone(authStore.user.uid, formattedZone);
      
      userZone.value = formattedZone;
      showZoneModal.value = false;
      setupRequestSubscription();
   } catch (err) {
      console.error("Failed to update zone:", err);
      alert("Could not update zone. Check connection.");
   } finally {
      updatingZone.value = false;
   }
};

const formatTime = (date) => {
  if (!date) return 'Just now';
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const acceptRequest = async (id) => {
  try {
    const kuliName = authStore.userData?.name || authStore.user?.displayName || 'Porter';
    await kuliService.acceptRequest(id, authStore.user.uid, kuliName);
    alert('Booking Accepted! Navigate to location.');
  } catch (err) {
    console.error("Accept failed:", err);
    alert('Already assigned or expired.');
  }
};

const ignoredRequests = ref(new Set());

const passOffer = (id) => {
  ignoredRequests.value.add(id);
  requests.value = requests.value.filter(req => req.id !== id);
};

const setupRequestSubscription = () => {
  if (unsubscribeRequests) {
    unsubscribeRequests();
    unsubscribeRequests = null;
  }
  
  // Extract base station out of formatted activeZone (e.g. "Sealdah (SDAH)" => "sealdah")
  let baseStation = (userZone.value || '').split(' (')[0].toLowerCase().trim();
  
  loading.value = true;
  unsubscribeRequests = kuliService.listenToAvailableRequests(baseStation, (data) => {
    requests.value = data.filter(req => !ignoredRequests.value.has(req.id));
    loading.value = false;
  });
};

onMounted(() => {
  // Listen for Active Mission (Highest priority widget)
  unsubscribeMission = kuliService.listenToActiveMission(authStore.user.uid, (data) => {
    activeMission.value = data;
  });

  // Listen for Live Requests based on zone and online duty
  setupRequestSubscription();

  // Listen for Live Ratings/Stats
  unsubscribeStats = kuliService.listenToPorterRatings(authStore.user.uid, (data) => {
    stats.value = data;
  });
});

onUnmounted(() => {
  if (unsubscribeMission) unsubscribeMission();
  if (unsubscribeRequests) unsubscribeRequests();
  if (unsubscribeStats) unsubscribeStats();
});
</script>

<style scoped>
@keyframes swing {
  0% { transform: rotate(0deg); }
  20% { transform: rotate(15deg); }
  40% { transform: rotate(-10deg); }
  60% { transform: rotate(5deg); }
  80% { transform: rotate(-5deg); }
  100% { transform: rotate(0deg); }
}
.animate-swing {
  animation: swing 1s ease-in-out infinite;
}

@keyframes pulse-subtle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(0.98); }
}
.animate-pulse-subtle {
  animation: pulse-subtle 3s infinite ease-in-out;
}

.animate-ping-delay-1 { animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
.animate-ping-delay-2 { animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite 0.5s; }
.animate-ping-delay-3 { animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite 1s; }
</style>
