<template>
  <div class="animate-fade-in space-y-8">
    <header>
      <h1 class="text-3xl font-black text-kuli-blue mb-2 uppercase tracking-tight">Book a Kuli</h1>
      <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Find assistance for your luggage</p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
       <!-- Form -->
       <div class="card p-6 shadow-xl relative overflow-hidden group border border-white">
          <div class="absolute top-0 right-0 w-32 h-32 bg-kuli-red/5 rounded-full -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-150"></div>
          <form @submit.prevent="submitBooking" class="relative z-10 space-y-6">
             <div>
                <label class="block text-xs font-black text-kuli-blue uppercase tracking-widest mb-2">Current Station</label>
                <div class="relative">
                   <MapPinIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                   <input list="station-list" v-model="form.station" placeholder="Search any station (e.g. NDLS, HWH)" class="input-field w-full pl-11 bg-white border border-gray-200 p-3 rounded-lg text-sm font-bold shadow-sm outline-none focus:border-kuli-red focus:ring-1 focus:ring-kuli-red">
                   <datalist id="station-list">
                     <option v-for="station in allStations" :key="station" :value="station"></option>
                   </datalist>
                </div>
             </div>

             <div>
                <label class="block text-xs font-black text-kuli-blue uppercase tracking-widest mb-2">Luggage Details</label>
                <div class="grid grid-cols-2 gap-4">
                  <div class="relative">
                    <LuggageIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="number" min="1" v-model="form.bags" placeholder="Bags" class="input-field pl-11 w-full bg-white border border-gray-200 p-3 rounded-lg text-sm font-bold shadow-sm outline-none focus:border-kuli-red focus:ring-1 focus:ring-kuli-red">
                  </div>
                  <div class="relative">
                    <WeightIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="number" min="1" v-model="form.weight" placeholder="Approx kg" class="input-field pl-11 w-full bg-white border border-gray-200 p-3 rounded-lg text-sm font-bold shadow-sm outline-none focus:border-kuli-red focus:ring-1 focus:ring-kuli-red">
                  </div>
                </div>
             </div>

             <div v-if="error" class="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-lg flex gap-2 items-center">
                <AlertCircleIcon class="w-4 h-4" /> {{ error }}
             </div>

             <button type="submit" class="w-full btn btn-primary h-14 text-lg font-black uppercase tracking-[0.2em] shadow-xl group/btn flex items-center justify-center gap-3">
                <span v-if="!loading">Find Porter</span>
                <span v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <SearchIcon v-if="!loading" class="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
             </button>
          </form>
       </div>

       <!-- Matching UI -->
       <div class="card p-6 border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center text-center min-h-[300px]">
          <div v-if="!matching">
            <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-3 shadow-sm mb-4 mx-auto border border-slate-100 transition-transform hover:scale-110">
               <img src="/Images/Kuli Logo.png" class="w-full h-full object-contain" alt="Logo">
            </div>
            <h4 class="text-sm font-black text-kuli-blue uppercase tracking-widest mb-2">Ready to Book</h4>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Provide details to locate kulis<br>nearby your location</p>
          </div>
          <div v-else class="w-full h-full flex flex-col items-center justify-center animate-fade-in py-8">
             
             <!-- Radar / Searching State -->
             <div v-if="!matchFound || !currentBooking" class="flex flex-col items-center">
               <div class="relative mb-6">
                  <div class="absolute inset-0 bg-kuli-blue rounded-full animate-ping opacity-20"></div>
                  <div class="w-16 h-16 bg-kuli-blue text-white rounded-full flex items-center justify-center shadow-2xl relative z-10">
                     <RadarIcon class="w-8 h-8 animate-spin-slow" />
                  </div>
               </div>
               <h4 class="text-sm font-black text-kuli-blue uppercase tracking-widest mb-2">Locating Nearby Porters</h4>
               <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Searching in {{ form.station || 'Station' }} zone...</p>
               <button @click="cancelSearch" class="mt-4 text-[10px] text-kuli-red uppercase font-black underline tracking-widest hover:text-black transition-colors z-20">Cancel Search</button>
             </div>
             
             <!-- Matched Kuli Section -->
             <div v-else class="w-full space-y-6 animate-scale-in">
                <div class="w-full p-4 bg-white rounded-xl shadow-xl border-l-4 border-kuli-red flex items-center justify-between">
                   <div class="flex items-center gap-4">
                      <div class="w-10 h-10 bg-kuli-red/10 text-kuli-red rounded-lg flex items-center justify-center font-black text-sm">
                        {{ getInitials(currentBooking.kuliName) }}
                      </div>
                      <div class="text-left">
                         <h5 class="text-xs font-black text-kuli-blue uppercase">{{ currentBooking.kuliName || 'Nearby Porter' }}</h5>
                         <p class="text-[10px] font-bold text-gray-500">4.8 ⭐ • Route Started</p>
                      </div>
                   </div>
                   <button class="bg-black text-white px-4 py-2 rounded-lg text-xs font-black uppercase shadow-md hover:bg-kuli-red transition-colors">Route ₹{{ currentBooking.price }}</button>
                </div>

                <!-- Live Route Map -->
                <div class="w-full h-48 bg-slate-50 rounded-xl shadow-inner border border-slate-200 relative overflow-hidden flex flex-col justify-end p-4">
                   <!-- Stylized Map Grid -->
                   <svg class="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 800 600">
                     <path d="M0,100 L800,100 M0,200 L800,200 M0,300 L800,300" stroke="#CBD5E1" stroke-width="2" />
                     <path d="M100,0 L100,600 M200,0 L200,600 M300,0 L300,600 M400,0 L400,600" stroke="#CBD5E1" stroke-width="2" />
                   </svg>

                   <!-- Route Path Dotted Line -->
                   <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                     <path class="route-line animate-dash" d="M 20,80 Q 50,20 80,40" fill="none" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="3,3" stroke-linecap="round" />
                   </svg>

                   <!-- Kuli Marker (Approaching from bottom-left) -->
                   <div class="absolute" style="top: 80%; left: 20%; transform: translate(-50%, -50%);">
                      <div class="w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-kuli-red p-1.5 relative z-10 animate-pulse">
                         <img src="/Images/Kuli Logo.png" class="w-full h-full object-contain" alt="Kuli">
                      </div>
                      <div class="absolute bg-white text-kuli-blue px-2 py-0.5 rounded shadow text-[8px] font-black uppercase -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">Porter Location</div>
                   </div>

                   <!-- You/Customer Marker (Waiting top-right) -->
                   <div class="absolute" style="top: 40%; left: 80%; transform: translate(-50%, -50%);">
                      <div class="w-10 h-10 bg-kuli-blue rounded-full border-4 border-white shadow-xl flex items-center justify-center relative z-10">
                        <div class="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <div class="absolute inset-x-[-10px] inset-y-[-10px] bg-kuli-blue opacity-30 rounded-full animate-ping"></div>
                      <div class="absolute bg-white px-2 py-0.5 rounded shadow text-[8px] font-black uppercase -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-bold text-slate-500">Your Location</div>
                   </div>

                   <!-- Radar overlay -->
                   <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-green-500/20 rounded-full opacity-50 pointer-events-none scale-150 animate-ping-slow"></div>
                </div>
             </div>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { 
  MapPinIcon, 
  LuggageIcon, 
  WeightIcon, 
  SearchIcon, 
  AlertCircleIcon,
  RadarIcon
} from 'lucide-vue-next';
import { useAuthStore } from '../../stores/auth';
import { db } from '../../firebase/config';
import { collection, addDoc, doc, onSnapshot, serverTimestamp, deleteDoc, query, where, getDocs } from 'firebase/firestore';

const authStore = useAuthStore();

const form = ref({
  station: '',
  bags: '',
  weight: ''
});

const loading = ref(false);
const error = ref('');
const matching = ref(false);
const matchFound = ref(false);
const currentBooking = ref(null);
let unsubscribe = null;
let currentBookingId = null;

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

const loadActiveBooking = async () => {
  try {
    const q = query(
      collection(db, 'bookings'),
      where('customerId', '==', authStore.user.uid)
    );
    const snap = await getDocs(q);
    
    // Sort client-side by date to get latest, and filter for active ones
    const activeDocs = snap.docs.filter(d => ['pending', 'accepted', 'started', 'arrived'].includes(d.data().status));
    
    if (activeDocs.length > 0) {
      // Get the most recent active booking
      activeDocs.sort((a, b) => b.data().createdAt?.toDate() - a.data().createdAt?.toDate());
      const activeDoc = activeDocs[0];
      const data = activeDoc.data();
      currentBookingId = activeDoc.id;
      
      if (data.status === 'pending') {
        matching.value = true;
        matchFound.value = false;
      } else {
        matching.value = false;
        matchFound.value = true;
        currentBooking.value = { id: activeDoc.id, ...data };
      }

      // Resume listening
      unsubscribe = onSnapshot(doc(db, 'bookings', currentBookingId), (docSnap) => {
        if (!docSnap.exists()) return;
        const liveData = docSnap.data();
        if (liveData.status === 'accepted') {
          matching.value = false;
          matchFound.value = true;
          currentBooking.value = { id: docSnap.id, ...liveData };
        } else if (liveData.status === 'completed' || liveData.status === 'cancelled') {
          matching.value = false;
          matchFound.value = false;
          currentBooking.value = null;
          currentBookingId = null;
          if (unsubscribe) {
            unsubscribe();
            unsubscribe = null;
          }
        }
      });
    }
  } catch (err) {
    console.error("Failed to load active booking", err);
  }
};

onMounted(() => {
  loadActiveBooking();
});

const submitBooking = async () => {
  if (currentBookingId) {
    error.value = "You already have an active request.";
    return;
  }
  if (!form.value.station || !form.value.bags) {
    error.value = "Please select station and bag count.";
    return;
  }
  error.value = '';
  loading.value = true;
  matching.value = false;
  matchFound.value = false;
  currentBooking.value = null;

  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
  
  try {
    const calculatedPrice = (form.value.bags * 50) + ((form.value.weight || 0) * 2);
    
    // Create the booking in Firestore
    const docRef = await addDoc(collection(db, 'bookings'), {
      customerId: authStore.user.uid,
      customerName: authStore.userData?.name || authStore.user?.displayName || 'Customer',
      pickupStation: form.value.station,
      items: form.value.bags,
      weight: form.value.weight || 0,
      price: calculatedPrice,
      status: 'pending',
      createdAt: serverTimestamp()
    });
    
    currentBookingId = docRef.id;

    loading.value = false;
    matching.value = true;

    // Listen for Kuli to accept
    unsubscribe = onSnapshot(doc(db, 'bookings', docRef.id), (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      
      if (data.status === 'accepted') {
        matchFound.value = true;
        matching.value = false;
        currentBooking.value = { id: snap.id, ...data };
        
        // Stop listening after accepted (or could listen for 'completed')
        if (unsubscribe) {
          unsubscribe();
          unsubscribe = null;
        }
      }
    });

  } catch (err) {
    console.error("Booking error:", err);
    error.value = "Failed to dispatch booking. Please try again.";
    loading.value = false;
  }
};

const getInitials = (name) => {
  if (!name) return 'PR';
  let parts = name.split(' ');
  return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].substring(0, 2).toUpperCase();
};

const cancelSearch = async () => {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
  matching.value = false;
  if (currentBookingId) {
    try {
      await deleteDoc(doc(db, 'bookings', currentBookingId));
    } catch (e) {
      console.error('Error cancelling:', e);
    }
    currentBookingId = null;
  }
};

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});
</script>
