<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 flex flex-col items-center justify-center px-6 py-12">
    <div v-if="showFakePopup" class="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-6">
      <div class="w-full max-w-2xl rounded-3xl border-2 border-red-300 bg-red-600 p-10 text-center shadow-[0_20px_80px_rgba(220,38,38,0.6)] animate-shake">
        <h2 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white leading-tight">
          You Fake Kiddo! Nice Try! Better Luck next time!
        </h2>
        <button
          type="button"
          @click="showFakePopup = false"
          class="mt-8 rounded-xl bg-white px-6 py-3 text-sm font-black uppercase tracking-widest text-red-700 hover:bg-red-100 transition-colors"
        >
          Close
        </button>
      </div>
    </div>

    <!-- Admin Portal Branding -->
     <div class="mb-14 text-center animate-fade-in">
        <div class="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center p-4 shadow-2xl shadow-red-900/40 mx-auto mb-8 border border-slate-700/50">
           <img src="/Images/Kuli Logo.png" class="w-full h-full object-contain" alt="Kuli Logo">
        </div>
        <h1 class="text-4xl font-black text-white uppercase tracking-tighter mb-3 leading-tight">Rail Official Portal</h1>
        <p class="text-slate-400 font-bold uppercase tracking-[0.3em] text-[11px] letter-spacing-wider">Restricted Access Area</p>
     </div>

    <!-- Login Card -->
    <div class="w-full max-w-md bg-slate-800/40 backdrop-blur-md rounded-[3rem] p-12 shadow-2xl border border-slate-700 relative overflow-hidden animate-slide-up">
      <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-kuli-red via-red-500 to-kuli-red/80"></div>
      
      <form @submit.prevent="handleAdminLogin" class="space-y-8">
        <!-- Your Email Field -->
        <div>
          <label class="block text-[11px] font-black uppercase tracking-widest text-slate-300 mb-3 ml-0.5">Your Email</label>
          <div class="relative group">
            <MailIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              v-model="userEmail" 
              type="email" 
              required
              placeholder="your.email@railway.gov.in"
              class="w-full bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:border-kuli-red focus:ring-2 focus:ring-kuli-red/20 transition-all placeholder:text-slate-400 font-semibold text-sm shadow-sm"
            />
          </div>
          <p class="text-[9px] text-slate-400 mt-2">A verification link will be sent to this email</p>
        </div>

        <!-- Official Mail ID Field (Read-only) -->
        <div>
          <label class="block text-[11px] font-black uppercase tracking-widest text-slate-300 mb-3 ml-0.5">Official Portal ID</label>
          <div class="relative group">
            <ShieldCheckIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text"
              value="adminaccess@portal.in"
              disabled
              class="w-full bg-gradient-to-br from-slate-100 to-blue-100 border border-slate-300 rounded-2xl py-4 pl-12 pr-4 text-slate-700 cursor-not-allowed font-semibold text-sm shadow-sm opacity-60"
            />
          </div>
          <p class="text-[9px] text-slate-400 mt-2">System reserved credential</p>
        </div>

        <!-- Password Field -->
        <div>
          <label class="block text-[11px] font-black uppercase tracking-widest text-slate-300 mb-3 ml-0.5">Security Key (Password)</label>
          <div class="relative group">
            <LockIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              required
              placeholder="••••••••"
              class="w-full bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-12 text-slate-900 focus:outline-none focus:border-kuli-red focus:ring-2 focus:ring-kuli-red/20 transition-all placeholder:text-slate-400 font-semibold text-sm shadow-sm"
            />
            <button 
              type="button" 
              @click="showPassword = !showPassword" 
              class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
            >
              <EyeIcon v-if="!showPassword" class="w-5 h-5" />
              <EyeOffIcon v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div v-if="error" class="bg-red-500/15 border border-red-500/30 text-red-600 p-4 rounded-xl text-xs font-bold flex items-center gap-3 animate-shake">
          <AlertCircleIcon class="w-4 h-4 flex-shrink-0" />
          {{ error }}
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-gradient-to-r from-kuli-red to-red-600 hover:from-red-700 hover:to-red-700 text-white h-14 rounded-2xl font-black uppercase tracking-widest text-base flex items-center justify-center gap-3 shadow-lg shadow-red-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95"
        >
          <span v-if="!loading" class="flex items-center gap-3">
             Access Dashboard <ArrowRightIcon class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
          <div v-else class="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </button>
      </form>

      <div class="mt-10 pt-8 border-t border-slate-600/50 text-center">
        <p class="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-5">Unauthorized access is monitored</p>
        <router-link :to="{name: 'landing'}" class="text-slate-300 hover:text-white transition-colors text-xs font-bold flex items-center justify-center gap-2 opacity-80 hover:opacity-100">
           <ArrowLeftIcon class="w-4 h-4" /> Return to Public Site
        </router-link>
      </div>
    </div>

    <!-- Security Badges -->
    <div class="mt-16 flex items-center gap-6 opacity-40">
       <div class="flex items-center gap-2">
         <ShieldCheckIcon class="w-5 h-5 text-slate-300" />
         <span class="text-[9px] font-black text-slate-300 uppercase tracking-widest">AES-256</span>
       </div>
       <div class="flex items-center gap-2">
         <KeyIcon class="w-5 h-5 text-slate-300" />
         <span class="text-[9px] font-black text-slate-300 uppercase tracking-widest">SSL Encrypted</span>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
import { auth } from '../../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { 
  ShieldCheckIcon, MailIcon, LockIcon, ArrowRightIcon, 
  AlertCircleIcon, ArrowLeftIcon, KeyIcon, EyeIcon, EyeOffIcon 
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const userEmail = ref('');
const password = ref('');
const loading = ref(false);
const error = ref(null);
const showPassword = ref(false);
const showFakePopup = ref(false);

const OFFICIAL_EMAIL = 'adminaccess@portal.in';
const OFFICIAL_PASSWORD = 'admin@2026';

const createTempPassword = () => {
  return `Kuli@${Math.random().toString(36).slice(2, 10)}!`;
};

const isVerifiedStaffEmail = async (email) => {
  const staffQuery = query(collection(db, 'users'), where('email', '==', email));
  const snapshot = await getDocs(staffQuery);
  if (snapshot.empty) return false;

  return snapshot.docs.some((document) => document.data()?.emailVerified === true);
};

const handleAdminLogin = async () => {
  loading.value = true;
  error.value = null;

  const normalizedEmail = userEmail.value.trim().toLowerCase();
  const normalizedPassword = password.value.trim();

  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    showFakePopup.value = true;
    loading.value = false;
    return;
  }

  if (normalizedPassword !== OFFICIAL_PASSWORD) {
    loading.value = false;
    error.value = "Invalid Security Key. Access Denied.";
    return;
  }

  try {
    const signInMethods = await fetchSignInMethodsForEmail(auth, normalizedEmail).catch(() => []);
    const alreadyVerified = await isVerifiedStaffEmail(normalizedEmail);

    if (alreadyVerified || signInMethods.length > 0) {
      const { role } = await authStore.login(OFFICIAL_EMAIL, OFFICIAL_PASSWORD);

      if (role === 'admin') {
        localStorage.setItem('admin-verification-email', normalizedEmail);
        router.push({ name: 'admin-dashboard' });
        return;
      }

      await authStore.logout();
      error.value = 'Unauthorized Access: Entry Restricted to Rail Officials only.';
      return;
    }

    // Create a temporary auth identity for this inbox and send the real verification email.
    const tempPassword = createTempPassword();
    const result = await createUserWithEmailAndPassword(auth, normalizedEmail, tempPassword);
    await sendEmailVerification(result.user);
    await signOut(auth);
    localStorage.setItem('admin-verification-email', normalizedEmail);
    router.push({ name: 'verify-email' });
  } catch (err) {
    console.error('Login Error:', err);
    if (err.code === 'auth/email-already-in-use') {
      // The email exists in Auth, but may not be in Firestore or not verified.
      // We can just log in with official credentials
      const { role } = await authStore.login(OFFICIAL_EMAIL, OFFICIAL_PASSWORD);
      if (role === 'admin') {
        localStorage.setItem('admin-verification-email', normalizedEmail);
        router.push({ name: 'admin-dashboard' });
        return;
      }
      await authStore.logout();
      error.value = 'Unauthorized Access: Entry Restricted to Rail Officials only.';
      return;
    }
    error.value = "Invalid Official Credentials. Access Denied. (" + err.message + ")";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

.animate-slide-up {
  animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.animate-shake {
  animation: shake 0.4s ease-in-out;
}
</style>
