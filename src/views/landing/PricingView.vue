<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans">
    <!-- Navigation -->
    <nav class="sticky top-0 z-50 glass border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <router-link :to="{name: 'landing'}" class="flex items-center gap-3">
        <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-md border border-slate-100">
          <img src="/Images/Kuli Logo.png" class="w-full h-full object-contain" alt="Kuli Logo">
        </div>
        <div class="flex flex-col justify-center pt-0.5">
          <h1 class="text-xl font-black text-slate-900 uppercase tracking-tight leading-none mb-1">Leh Lu Kya?</h1>
          <p class="text-[9px] text-slate-500 font-bold uppercase tracking-[0.25em] leading-none">Smart Tiers</p>
        </div>
      </router-link>
      <router-link :to="{name: authStore.user ? 'customer-dashboard' : 'landing'}" class="text-sm font-black text-kuli-blue hover:text-kuli-red transition-all uppercase tracking-widest px-6 py-2.5 bg-white rounded-xl border border-slate-200 shadow-sm">
        {{ authStore.user ? 'Dashboard' : 'Portal' }}
      </router-link>
    </nav>

    <!-- Hero -->
    <section class="relative overflow-hidden pt-20 pb-20 px-6 text-center">
      <div class="container mx-auto max-w-4xl relative z-10">
        <div class="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-kuli-gold/10 text-kuli-gold text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-kuli-gold/20 animate-fade-in shadow-inner">
          <CrownIcon class="w-3 h-3" /> Exclusive Account Tiers
        </div>
        <h2 class="text-4xl md:text-7xl font-black text-slate-900 mb-6 leading-tight tracking-tighter">
          Elevate Your <span class="text-kuli-red">Travel</span> Experience
        </h2>
        <p class="text-lg text-slate-500 mb-10 leading-relaxed font-medium max-w-2xl mx-auto">
          Choose a plan that fits your station requirements. From general access to elite premium benefits, we have the right bundle for you.
        </p>
      </div>
    </section>

    <!-- Subscription Plans -->
    <section class="py-16 pb-32 px-6">
       <div class="container mx-auto max-w-6xl">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div v-for="plan in plans" :key="plan.name" 
                  class="bg-white rounded-[3rem] p-10 border-2 transition-all duration-500 flex flex-col relative overflow-hidden group"
                  :class="plan.recommended ? 'border-kuli-blue shadow-2xl scale-105 z-10' : 'border-slate-100 shadow-xl hover:border-kuli-blue/30'"
             >
                <!-- Badge for recommended -->
                <div v-if="plan.recommended" class="absolute top-0 right-0 bg-kuli-blue text-white px-8 py-2 rounded-bl-[2rem] text-[10px] font-black uppercase tracking-widest">
                   Best Value
                </div>
                
                <div class="mb-10">
                   <div :class="plan.iconContainerClass" class="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner border">
                      <component :is="plan.icon" class="w-8 h-8" />
                   </div>
                   <h3 class="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">{{ plan.name }}</h3>
                   <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ plan.tagline }}</p>
                </div>

                <div class="mb-10">
                   <div class="flex items-baseline gap-1">
                      <span class="text-xs font-black text-slate-400 uppercase tracking-widest">INR</span>
                      <span class="text-5xl font-black text-slate-900 tracking-tighter">₹{{ plan.price }}</span>
                      <span v-if="plan.price > 0" class="text-slate-400 font-bold">/mo</span>
                   </div>
                   <p class="text-[10px] font-bold text-slate-400 mt-2 italic">*Subscription billed monthly</p>
                </div>

                <ul class="space-y-4 mb-12 flex-1">
                   <li v-for="feature in plan.features" :key="feature" class="flex items-center gap-3">
                      <div class="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                         <CheckIcon class="w-3 h-3" stroke-width="3" />
                      </div>
                      <span class="text-sm font-bold text-slate-600">{{ feature }}</span>
                   </li>
                </ul>

                <button 
                  @click="handleSubscription(plan.name)"
                  :disabled="authStore.userData?.tier === plan.name"
                  class="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-lg"
                  :class="[
                    authStore.userData?.tier === plan.name 
                      ? 'bg-slate-100 text-slate-400 cursor-default' 
                      : plan.recommended 
                        ? 'bg-kuli-blue text-white hover:bg-slate-800' 
                        : 'bg-slate-900 text-white hover:scale-105'
                  ]"
                >
                   {{ authStore.userData?.tier === plan.name ? 'Active Plan' : 'Subscribe Now' }}
                   <ArrowRightIcon v-if="authStore.userData?.tier !== plan.name" class="w-4 h-4" />
                </button>
             </div>
          </div>
       </div>
    </section>

    <!-- Detailed Benefits Table -->
    <section class="py-24 bg-white px-6">
       <div class="container mx-auto max-w-4xl">
          <div class="text-center mb-20">
             <h2 class="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">Benefit Matrix</h2>
             <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Compare features in detail</p>
          </div>

          <div class="overflow-x-auto rounded-[2.5rem] border border-slate-100 shadow-2xl">
             <table class="w-full text-left border-collapse">
                <thead>
                   <tr class="bg-slate-50">
                      <th class="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Features</th>
                      <th class="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">General</th>
                      <th class="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-kuli-gold-dark">Gold</th>
                      <th class="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-kuli-blue">Premium</th>
                   </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                   <tr v-for="row in matrixRows" :key="row.label" class="hover:bg-slate-50 transition-colors">
                      <td class="p-8 font-bold text-slate-700 text-sm italic">{{ row.label }}</td>
                      <td class="p-8 text-xs font-bold text-slate-500">{{ row.general }}</td>
                      <td class="p-8 text-xs font-black text-kuli-gold-dark">{{ row.gold }}</td>
                      <td class="p-8 text-xs font-black text-kuli-blue">{{ row.premium }}</td>
                   </tr>
                </tbody>
             </table>
          </div>
       </div>
    </section>

    <!-- Success Feedback Overlay -->
    <div v-if="showSuccess" class="fixed inset-0 z-[100] flex items-center justify-center bg-kuli-blue/40 backdrop-blur-md animate-fade-in p-6">
       <div class="bg-white rounded-[3rem] p-12 text-center shadow-2xl max-w-md w-full animate-box-in">
          <div class="w-20 h-20 bg-green-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
             <CheckCircle2Icon class="w-10 h-10" stroke-width="3" />
          </div>
          <h2 class="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">Subscription Activated</h2>
          <p class="text-slate-500 font-bold mb-10 leading-relaxed capitalize">You are now a {{ selectedTier }} user. Enjoy your elite station privileges.</p>
          <button @click="router.push('/customer/profile')" class="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl">Back to Profile</button>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { 
  UserIcon, 
  CrownIcon, 
  ZapIcon, 
  CheckIcon, 
  ArrowRightIcon,
  CheckCircle2Icon,
  StarIcon,
  ShieldCheckIcon
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const showSuccess = ref(false);
const selectedTier = ref('');

const plans = [
  {
    name: 'General',
    tagline: 'Standard access for everyone',
    price: 0,
    icon: UserIcon,
    iconContainerClass: 'bg-slate-50 text-slate-400 border-slate-100',
    features: [
      'Standard porter matching',
      'Normal fare estimation',
      'Community support',
      'Digital receipt history'
    ],
    recommended: false
  },
  {
    name: 'Gold',
    tagline: 'Priority and Savings',
    price: 99,
    icon: StarIcon,
    iconContainerClass: 'bg-kuli-gold/10 text-kuli-gold border-kuli-gold/20',
    features: [
      '10% Platform fee waiver',
      'Silver badge identification',
      'Priority support chat',
      'Advance station booking'
    ],
    recommended: false
  },
  {
    name: 'Premium',
    tagline: 'The Elite Station Experience',
    price: 199,
    icon: CrownIcon,
    iconContainerClass: 'bg-kuli-blue/5 text-kuli-blue border-kuli-blue/10',
    features: [
      'Zero platform fees',
      'Verified Elite porters only',
      'Emergency assist access',
      '20% Porter fare discount'
    ],
    recommended: true
  }
];

const matrixRows = [
  { label: 'Booking Priority', general: 'Standard', gold: 'High Priority', premium: 'Instant Search' },
  { label: 'Platform Fee', general: 'Full', gold: '-10% Waiver', premium: 'Zero Fee' },
  { label: 'Porter Quality', general: 'Rank 1-5', gold: 'Rank 3-5 only', premium: 'Elite Rank 5' },
  { label: 'Emergency Support', general: 'Ticket only', gold: 'Chat priority', premium: 'Direct Line' },
  { label: 'Ad-Free Interface', general: 'No', gold: 'Yes', premium: 'Yes (Exclusive)' }
];

const handleSubscription = async (tier) => {
  if (!authStore.user) {
    router.push('/login');
    return;
  }

  try {
    selectedTier.value = tier;
    await authStore.updateSubscriptionTier(tier);
    showSuccess.value = true;
  } catch (err) {
    alert('Failed to update subscription: ' + err.message);
  }
};
</script>

<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

@keyframes boxIn {
  from { opacity: 0; transform: scale(0.95) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-box-in {
  animation: boxIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}
</style>
