<template>
  <div class="min-h-screen bg-kuli-earth-light py-12 px-6 flex items-center justify-center">
    <div class="w-full max-w-2xl animate-fade-in relative z-10">
      <!-- Background Elements -->
       <div class="absolute -top-20 -left-20 w-64 h-64 bg-kuli-red/5 rounded-full blur-3xl animate-pulse"></div>
       <div class="absolute -bottom-20 -right-20 w-64 h-64 bg-kuli-blue/5 rounded-full blur-3xl animate-pulse"></div>

      <!-- Heading -->
      <div class="text-center mb-10 flex flex-col items-center">
        <router-link to="/" class="inline-flex items-center gap-4 mb-6 group px-4 py-2 rounded-2xl transition-all">
          <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-3 shadow-xl border border-slate-100 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
            <img src="/Images/Kuli Logo.png" class="w-full h-full object-contain" alt="Kuli Logo">
          </div>
          <div class="text-left flex flex-col justify-center pt-1">
            <h1 class="text-3xl font-black text-slate-900 tracking-tight leading-none mb-1.5 uppercase font-sans">Leh Lu Kya?</h1>
            <p class="text-[11px] font-bold text-slate-500 uppercase tracking-[0.25em] leading-none">Kuli Booking</p>
          </div>
        </router-link>
        <h2 class="text-4xl font-black text-slate-900 tracking-tight mb-2">Create Account</h2>
        <p class="text-slate-500 font-medium uppercase tracking-widest text-xs">Join India's Most Reliable Porter Network</p>
      </div>

      <!-- Role Selector -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <button 
          v-for="role in roles" 
          :key="role.id" 
          @click="selectedRole = role.id"
          class="flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 gap-3 group"
          :class="selectedRole === role.id ? 'bg-kuli-blue border-kuli-blue text-white shadow-xl scale-105' : 'bg-white border-kuli-earth-dark text-kuli-blue hover:border-kuli-red/50'"
        >
          <div class="w-10 h-10 rounded-full flex items-center justify-center transition-colors mb-1" 
               :class="selectedRole === role.id ? 'bg-white/20' : 'bg-kuli-station group-hover:bg-kuli-red/10'">
            <component :is="role.icon" class="w-5 h-5" :class="selectedRole === role.id ? 'text-white' : 'text-kuli-blue group-hover:text-kuli-red'" />
          </div>
          <span class="text-xs font-black uppercase tracking-widest">{{ role.name }}</span>
        </button>
      </div>

      <!-- Signup Form -->
      <div class="card p-10 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-kuli-gold/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        
        <form @submit.prevent="handleSignup" class="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Common Fields -->
          <div class="col-span-1">
            <label class="block text-[10px] font-black text-kuli-blue uppercase tracking-widest mb-2">Full Name</label>
            <input v-model="form.name" type="text" required class="input-field" placeholder="e.g., Arjun Verma">
          </div>

          <div class="col-span-1">
            <label class="block text-[10px] font-black text-kuli-blue uppercase tracking-widest mb-2">Email Address</label>
            <input v-model="form.email" type="email" required class="input-field" placeholder="e.g., arjun@example.com">
          </div>

          <div class="col-span-1">
             <label class="block text-[10px] font-black text-kuli-blue uppercase tracking-widest mb-2">Phone Number</label>
             <input v-model="form.phone" type="tel" required class="input-field" placeholder="e.g., +91 98XXX-XXXXX">
          </div>

          <div class="col-span-1">
             <label class="block text-[10px] font-black text-kuli-blue uppercase tracking-widest mb-2">Password</label>
             <div class="relative">
                <input 
                  v-model="form.password" 
                  :type="showPassword ? 'text' : 'password'" 
                  required 
                  class="input-field pr-11" 
                  placeholder="Min. 8 characters"
                >
                <button 
                  type="button" 
                  @click="showPassword = !showPassword" 
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-kuli-blue"
                >
                  <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                  <EyeOffIcon v-else class="w-5 h-5 transition-all" />
                </button>
             </div>
          </div>

          <!-- Kuli Specific Fields -->
          <template v-if="selectedRole === 'kuli'">
            <div class="col-span-2 border-t pt-6 mt-2 border-kuli-earth-dark">
               <h3 class="text-xs font-black text-kuli-red uppercase tracking-widest mb-6">Porter Verification Details</h3>
            </div>
            
            <div class="col-span-1">
               <label class="block text-[10px] font-black text-kuli-blue uppercase tracking-widest mb-2">Station / Zone</label>
               <select v-model="form.station" class="input-field bg-white">
                  <option value="">Select Primary Station</option>
                  <option v-for="s in stations" :key="s" :value="s">{{ s }}</option>
               </select>
            </div>

            <div class="col-span-1">
               <label class="block text-[10px] font-black text-kuli-blue uppercase tracking-widest mb-2">Badge / ID Number</label>
               <input v-model="form.badgeId" type="text" required class="input-field" placeholder="Railway Issued Badge ID">
            </div>

            <div class="col-span-2">
               <label class="block text-[10px] font-black text-kuli-blue uppercase tracking-widest mb-2">Service Category</label>
               <div class="flex flex-wrap gap-3">
                  <label v-for="cat in categories" :key="cat" class="flex items-center gap-2 bg-kuli-station px-4 py-2 rounded-lg cursor-pointer border border-transparent transition-colors hover:bg-white hover:border-kuli-red/30">
                     <input type="checkbox" :value="cat" v-model="form.categories" class="accent-kuli-red">
                     <span class="text-xs font-bold">{{ cat }}</span>
                  </label>
               </div>
            </div>
          </template>

          <div v-if="authStore.error" class="col-span-2 bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-lg font-bold flex items-center gap-3">
             <AlertCircleIcon class="w-5 h-5 flex-shrink-0" />
             {{ authStore.error }}
          </div>

          <div class="col-span-2 mt-4">
             <button 
              type="submit" 
              :disabled="loading"
              class="w-full btn btn-primary h-14 text-sm font-black uppercase tracking-[0.2em] shadow-xl group"
             >
               <span v-if="!loading" class="flex items-center gap-3">
                 Register on Station
                 <ArrowRightIcon class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </span>
               <div v-else class="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
             </button>
          </div>
          <div class="col-span-2 mt-2">
             <div class="relative flex items-center py-4">
                <div class="flex-grow border-t border-gray-200"></div>
                <span class="flex-shrink-0 mx-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Or Continue With</span>
                <div class="flex-grow border-t border-gray-200"></div>
             </div>
             <button @click="handleGoogleSignIn" type="button" class="w-full flex items-center justify-center gap-2 border border-gray-200 py-4 rounded-lg hover:bg-gray-50 transition-colors shadow-sm bg-white">
                <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>
                <span class="text-sm font-black uppercase text-kuli-blue pt-0.5">Google Direct Setup</span>
             </button>
          </div>
        </form>

        <div class="mt-8 pt-8 border-t border-kuli-earth-dark flex items-center justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
           <div>Security Protocols Active</div>
           <div class="flex items-center gap-2">
              <ShieldCheckIcon class="w-4 h-4 text-kuli-blue" />
              AES-256 Encrypted
           </div>
        </div>
      </div>

       <p class="mt-8 text-center text-sm font-bold text-kuli-blue">
        Already registered at a station? 
        <router-link :to="{name: 'login'}" class="text-kuli-red underline underline-offset-4 hover:decoration-2">Login Here</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { 
  UserIcon, 
  UserPlusIcon, 
  BriefcaseIcon, 
  ShieldCheckIcon, 
  LockIcon, 
  MailIcon, 
  PhoneIcon, 
  ArrowRightIcon, 
  AlertCircleIcon, 
  CheckCircle2Icon,
  EyeIcon,
  EyeOffIcon
} from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const roles = [
  { id: 'customer', name: 'Commuter', icon: UserIcon },
  { id: 'kuli', name: 'Porter / Kuli', icon: BriefcaseIcon },
];

const selectedRole = ref(route.query.role || 'customer');
const loading = ref(false);
const showPassword = ref(false);

const stations = ["Howrah Junction", "New Delhi Railway Station", "Mumbai Central", "Bangalore City", "Chennai Central", "Kolkata Station", "Sealdah"];
const categories = ["Luggage Carrying", "Elderly Assistance", "Platform Transfer", "Wheelchair Support", "Bulk Goods Move"];

const form = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  // Kuli fields
  station: '',
  badgeId: '',
  categories: [],
});

const handleSignup = async () => {
  loading.value = true;
    // Security Check: Only allow customer or kuli roles from this view
    if (selectedRole.value === 'admin') {
      loading.value = false;
      return;
    }
    
  try {
    const signupData = {
      name: form.value.name,
      phone: form.value.phone,
      role: selectedRole.value,
    };

    if (selectedRole.value === 'kuli') {
      signupData.station = form.value.station;
      signupData.badgeId = form.value.badgeId;
      signupData.categories = form.value.categories;
      signupData.status = 'pending_verification';
    }

    await authStore.signup(form.value.email, form.value.password, signupData);
    router.push({ name: 'verify-email' });
    
  } catch (err) {
    console.error('Signup failed:', err);
  } finally {
    loading.value = false;
  }
};

const handleGoogleSignIn = async () => {
  loading.value = true;
  try {
    const { role } = await authStore.signInWithGoogle(selectedRole.value);
    
    // Auto-redirect
    if (role === 'admin') router.push({ name: 'admin-dashboard' });
    else if (role === 'kuli') router.push({ name: 'kuli-dashboard' });
    else router.push({ name: 'customer-dashboard' });
  } catch (err) {
    console.error('Google Sign-In failed:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (route.query.role) selectedRole.value = route.query.role;
});
</script>
