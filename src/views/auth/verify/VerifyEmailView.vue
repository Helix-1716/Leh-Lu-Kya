<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-texture">
    <div class="w-full max-w-lg bg-white rounded-[3rem] shadow-3xl border border-slate-100 p-10 md:p-16 text-center animate-fade-in relative overflow-hidden">
      <!-- Background Accents -->
      <div class="absolute top-0 left-0 w-full h-2 bg-kuli-red"></div>
      <div class="absolute -top-12 -right-12 w-32 h-32 bg-slate-50 rounded-full"></div>

      <!-- Top Branding -->
      <div class="mb-10 flex flex-col items-center">
        <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-3 shadow-lg border border-slate-50 mb-4 transition-transform hover:scale-105">
          <img src="/Images/Kuli Logo.png" class="w-full h-full object-contain" alt="Kuli Logo">
        </div>
        <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Official Kuli Services</p>
      </div>

      <!-- Icon Section -->
      <div class="relative inline-block mb-10">
        <div class="w-24 h-24 bg-red-50 rounded-[2.5rem] flex items-center justify-center text-kuli-red mx-auto ring-8 ring-red-50/50">
          <MailIcon class="w-12 h-12" />
        </div>
        <div class="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center">
           <div class="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      <!-- Content -->
      <div class="space-y-4 mb-12">
        <h1 class="text-3xl font-black text-slate-800 uppercase tracking-tight">Verify Your Account</h1>
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Security Protocol Required</p>
        
        <div class="py-6 px-4 bg-slate-50 rounded-2xl border border-slate-100 mt-6 group">
           <p class="text-xs font-bold text-slate-500 mb-1 uppercase tracking-widest">A verification link was sent to:</p>
           <p class="text-sm font-black text-slate-900 break-all select-all">{{ displayEmail }}</p>
        </div>

        <p class="text-xs font-bold text-slate-400 leading-relaxed max-w-sm mx-auto">
          Please check your inbox (and spam folder) and click the link to verify your identity before accessing the dashboard.
        </p>
      </div>

      <!-- Actions -->
      <div class="space-y-4">
        <button 
          @click="checkVerification"
          :disabled="checking"
          class="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-kuli-red transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <RotateCwIcon v-if="checking" class="w-4 h-4 animate-spin" />
          <CheckCircleIcon v-else class="w-4 h-4" />
          I've Verified My Email
        </button>

        <div class="grid grid-cols-2 gap-4">
          <button 
            @click="handleResend"
            :disabled="resendCooldown > 0 || resending"
            class="py-4 bg-white border-2 border-slate-100 text-slate-800 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:border-kuli-red transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            <SendIcon class="w-3 h-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            {{ resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend Link' }}
          </button>
          
          <button 
            @click="handleLogout"
            class="py-4 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center gap-2"
          >
            <LogOutIcon class="w-3 h-3" />
            Exit Terminal
          </button>
        </div>
      </div>

      <!-- Feedback Toast (Simplified) -->
      <transition name="toast-up">
        <div v-if="message" class="fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest shadow-2xl z-[100]">
           {{ message }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/auth';
import { 
  MailIcon, CheckCircleIcon, RotateCwIcon, 
  SendIcon, LogOutIcon 
} from 'lucide-vue-next';

const authStore = useAuthStore();
const router = useRouter();
const user = authStore.user;
const displayEmail = user?.email || localStorage.getItem('admin-verification-email') || 'your registered email';

const checking = ref(false);
const resending = ref(false);
const resendCooldown = ref(0);
const message = ref('');
let timer = null;

const showMessage = (msg) => {
  message.value = msg;
  setTimeout(() => message.value = '', 3000);
};

const checkVerification = async () => {
  checking.value = true;
  try {
    // If user is completely logged out (e.g. Admin workaround flow), 
    // force them back to login instead of crashing when checking emailVerified.
    if (!authStore.user) {
      const savedEmail = localStorage.getItem('admin-verification-email');
      showMessage('Verification complete. Please log in.');
      setTimeout(() => {
        router.push(savedEmail ? '/admin/auth' : '/auth/login');
      }, 1500);
      return;
    }

    const verifiedUser = await authStore.reloadAndCheckVerification();
    
    if (verifiedUser && verifiedUser.emailVerified) {
       showMessage('Email verified successfully!');
       setTimeout(() => router.push(authStore.role === 'admin' ? '/admin/dashboard' : `/${authStore.role}/dashboard`), 1000);
    } else {
       showMessage('Email not verified yet. Please check your inbox.');
    }
  } catch (err) {
    showMessage('Failed to check status. Try again.');
    console.error(err);
  } finally {
    checking.value = false;
  }
};

const handleResend = async () => {
  if (resendCooldown.value > 0) return;
  resending.value = true;
  try {
    await authStore.sendVerificationEmail();
    showMessage('Verification email sent!');
    resendCooldown.value = 60;
    startCooldown();
  } catch (err) {
    showMessage('Too many requests. Please wait.');
  } finally {
    resending.value = false;
  }
};

const startCooldown = () => {
  timer = setInterval(() => {
    if (resendCooldown.value > 0) {
      resendCooldown.value--;
    } else {
      clearInterval(timer);
    }
  }, 1000);
};

const handleLogout = async () => {
  await authStore.logout();
  router.push('/');
};

onMounted(() => {
  if (user && user.emailVerified) {
    router.push(authStore.role === 'admin' ? '/admin/dashboard' : `/${authStore.role}/dashboard`);
  }
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.toast-up-enter-active, .toast-up-leave-active {
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.toast-up-enter-from, .toast-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
</style>
