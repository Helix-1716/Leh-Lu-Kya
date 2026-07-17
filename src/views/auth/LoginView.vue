<template>
  <div class="min-h-screen bg-kuli-earth-light flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]">
    <div class="w-full max-w-md animate-slide-up">
      <!-- Logo and Heading -->
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
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Station Login</h2>
        <p class="text-slate-500 font-medium mt-2 text-sm">Welcome back to the station. Please login below.</p>
      </div>

      <!-- Login Card -->
      <div class="card p-8 shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-kuli-red/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        
        <form @submit.prevent="handleLogin" class="relative z-10 space-y-6">
          <div>
            <label class="block text-xs font-black text-kuli-blue uppercase tracking-widest mb-2">Email Address</label>
            <div class="relative">
              <MailIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                v-model="email" 
                type="email" 
                required 
                placeholder="e.g., ramesh@station.in" 
                class="input-field pl-11"
              >
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-xs font-black text-kuli-blue uppercase tracking-widest">Password</label>
              <a href="#" class="text-[10px] font-black text-kuli-red uppercase tracking-widest hover:underline">Forgot?</a>
            </div>
            <div class="relative">
              <LockIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                v-model="password" 
                :type="showPassword ? 'text' : 'password'" 
                required 
                placeholder="Your secure password" 
                class="input-field pl-11 pr-11"
              >
              <button 
                type="button" 
                @click="showPassword = !showPassword" 
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-kuli-blue"
              >
                <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                <EyeOffIcon v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div v-if="authStore.error" class="bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-lg font-bold flex items-center gap-3">
             <AlertCircleIcon class="w-5 h-5 flex-shrink-0" />
             {{ authStore.error }}
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="w-full btn btn-primary h-14 text-lg font-black uppercase tracking-[0.2em] shadow-xl group"
          >
            <span v-if="!loading" class="flex items-center gap-3">
              Proceed to Station
              <ArrowRightIcon class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div v-else class="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </button>
        </form>

        <div class="mt-8 pt-8 border-t border-kuli-earth-dark text-center">
          <p class="text-sm text-gray-500 font-bold mb-4 uppercase tracking-widest">Login via Mobile (Coming Soon)</p>
          <div class="flex gap-4">
             <button class="flex-1 border border-kuli-earth-dark py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors opacity-50 cursor-not-allowed">
                <PhoneIcon class="w-4 h-4 text-kuli-blue" />
                <span class="text-xs font-black uppercase">OTP Login</span>
             </button>
             <button @click="handleGoogleSignIn" type="button" class="flex-1 border border-kuli-earth-dark py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
                <!-- Using an inline SVG for Google G for a clean look since lucide doesn't have a brand icon by default -->
                <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>
                <span class="text-xs font-black uppercase text-kuli-blue pt-0.5">Google</span>
             </button>
          </div>
        </div>
      </div>

      <p class="mt-8 text-center text-sm font-bold text-kuli-blue">
        Don't have a station account? 
        <router-link :to="{name: 'signup'}" class="text-kuli-red underline underline-offset-4 hover:decoration-2">Create One Now</router-link>
      </p>

      <!-- Bottom Branding -->
      <div class="mt-12 text-center">
         <div class="inline-flex items-center gap-4 py-2 px-6 bg-white/50 backdrop-blur rounded-full border border-kuli-earth shadow-sm">
            <ShieldCheckIcon class="w-4 h-4 text-kuli-blue" />
            <span class="text-[10px] font-black uppercase tracking-widest text-kuli-blue">Ministry of Railway Trusted Partnership</span>
         </div>
        <div class="mt-8 pt-8 border-t border-kuli-earth-dark text-center">
           <p class="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Are you a Rail Official?</p>
           <router-link :to="{name: 'admin-login'}" class="btn bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl border border-slate-200 shadow-sm inline-flex items-center gap-2 group transition-all">
             Official Admin Portal <ArrowRightIcon class="w-3 h-3 group-hover:translate-x-1 transition-transform" />
           </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { 
  MailIcon, 
  LockIcon, 
  EyeIcon, 
  EyeOffIcon, 
  ArrowRightIcon, 
  AlertCircleIcon, 
  PhoneIcon, 
  ShieldCheckIcon 
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  try {
    const { role, verified } = await authStore.login(email.value, password.value);
    
    // Check verification status for email/password users
    if (!verified) {
      router.push({ name: 'verify-email' });
      return;
    }
    
    if (role === 'admin') router.push({ name: 'admin-dashboard' });
    else if (role === 'kuli') router.push({ name: 'kuli-dashboard' });
    else router.push({ name: 'customer-dashboard' });
    
  } catch (err) {
    console.error('Login failed:', err);
  } finally {
    loading.value = false;
  }
};

const handleGoogleSignIn = async () => {
  loading.value = true;
  try {
    const { role } = await authStore.signInWithGoogle();
    
    if (role === 'admin') router.push({ name: 'admin-dashboard' });
    else if (role === 'kuli') router.push({ name: 'kuli-dashboard' });
    else router.push({ name: 'customer-dashboard' });
  } catch (err) {
    console.error('Google Sign-In failed:', err);
  } finally {
    loading.value = false;
  }
};
</script>
