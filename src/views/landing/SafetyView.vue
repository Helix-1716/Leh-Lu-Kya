<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans">
    <!-- Navigation -->
    <nav class="sticky top-0 z-50 glass border-b border-kuli-earth-dark px-6 py-4 flex items-center justify-between">
      <router-link :to="{name: 'landing'}" class="flex items-center gap-3">
        <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-md border border-slate-100 flex-shrink-0 transition-transform hover:scale-110">
          <img src="/Images/Kuli Logo.png" class="w-full h-full object-contain" alt="Kuli Logo">
        </div>
        <div class="flex flex-col justify-center pt-0.5">
          <h1 class="text-xl font-black text-slate-900 uppercase tracking-tight leading-none mb-1">Leh Lu Kya?</h1>
          <p class="text-[9px] text-slate-500 font-bold uppercase tracking-[0.25em] leading-none">Safety First</p>
        </div>
      </router-link>
      <router-link :to="{name: 'landing'}" class="text-sm font-bold text-kuli-blue hover:text-kuli-red transition-colors capitalize px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm">Back to Home</router-link>
    </nav>

    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32 px-6">
      <div class="absolute inset-0 z-0 bg-gradient-to-br from-white via-white to-blue-50/30"></div>
      <div class="container mx-auto relative z-10 max-w-4xl text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-200 shadow-sm animate-fade-in">
          <ShieldCheckIcon class="w-3 h-3" /> Peace of Mind Guaranteed
        </div>
        <h2 class="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight animate-slide-up">
          Your <span class="text-kuli-red">Safety</span> Comes First
        </h2>
        <p class="text-lg md:text-xl text-slate-500 mb-10 leading-relaxed font-medium animate-slide-up-delayed">
          We've built a multi-layered security framework to ensure every station transfer is safe, verified, and completely stress-free for you and your family.
        </p>
      </div>
    </section>

    <!-- Safety Highlights Grid -->
    <section class="py-16 md:py-24 px-6 bg-white">
      <div class="container mx-auto max-w-6xl">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(item, idx) in safetyHighlights" :key="idx" 
               class="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1 group">
            <div class="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-kuli-red group-hover:text-white transition-all">
              <component :is="item.icon" class="w-7 h-7" />
            </div>
            <h3 class="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">{{ item.title }}</h3>
            <p class="text-sm text-slate-500 leading-relaxed">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How We Keep You Safe Process -->
    <section class="py-16 md:py-24 px-6 bg-slate-50">
      <div class="container mx-auto max-w-5xl">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-5xl font-black text-slate-900 mb-4 uppercase tracking-tighter">How We Protect You</h2>
          <div class="w-20 h-1.5 bg-kuli-red mx-auto rounded-full"></div>
        </div>
        
        <div class="space-y-12">
          <div v-for="(step, idx) in safetySteps" :key="idx" class="flex flex-col md:flex-row items-center gap-8 md:gap-16">
             <div class="flex-shrink-0 w-20 h-20 rounded-full bg-white shadow-lg border-2 border-slate-100 flex items-center justify-center text-3xl font-black text-slate-200 font-mono">
               {{ idx + 1 }}
             </div>
             <div class="flex-1 text-center md:text-left">
               <h3 class="text-2xl font-black text-slate-900 mb-3">{{ step.title }}</h3>
               <p class="text-slate-500 text-lg leading-relaxed">{{ step.description }}</p>
             </div>
             <div class="hidden md:block flex-shrink-0 w-32 text-slate-200">
                <component :is="step.icon" class="w-16 h-16 opacity-20" />
             </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trust Indicators -->
    <section class="py-12 bg-slate-900 text-white overflow-hidden">
      <div class="container mx-auto px-6 max-w-6xl">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
           <div v-for="(indicator, idx) in trustIndicators" :key="idx" class="text-center">
             <div class="text-3xl md:text-4xl font-black text-kuli-red mb-2">{{ indicator.value }}</div>
             <div class="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">{{ indicator.label }}</div>
           </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-16 md:py-24 px-6 bg-white">
      <div class="container mx-auto max-w-4xl">
        <h2 class="text-3xl md:text-5xl font-black text-slate-900 mb-12 text-center uppercase tracking-tighter">Safety FAQ</h2>
        <div class="space-y-4">
          <div v-for="(faq, idx) in safetyFaqs" :key="idx" class="border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
             <button @click="toggleFaq(idx)" class="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors">
                <span class="font-bold text-slate-900 text-lg">{{ faq.question }}</span>
                <ChevronDownIcon class="w-5 h-5 transition-transform" :class="activeFaq === idx ? 'rotate-180' : ''" />
             </button>
             <div v-show="activeFaq === idx" class="px-8 pb-6 text-slate-500 leading-relaxed text-base border-t border-slate-50 pt-4 bg-white animate-fade-in">
               {{ faq.answer }}
             </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Emergency Section -->
    <section class="py-16 md:py-24 px-6 bg-slate-50">
      <div class="container mx-auto max-w-4xl">
        <div class="p-1 md:p-12 rounded-[3.5rem] bg-white shadow-2xl overflow-hidden relative border border-slate-100">
          <div class="absolute top-0 right-0 w-40 h-40 bg-kuli-red opacity-[0.03] rounded-full translate-x-20 -translate-y-20"></div>
          <div class="relative z-10 text-center flex flex-col items-center">
             <div class="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-8 border-4 border-white shadow-lg animate-pulse">
                <ShieldAlertIcon class="w-10 h-10" />
             </div>
             <h2 class="text-2xl md:text-4xl font-black text-slate-900 mb-6">Need Immediate Help?</h2>
             <p class="text-lg text-slate-500 mb-10 max-w-lg">Our safety response team is available 24/7 to handle any emergencies, disputes, or safety concerns during your transit.</p>
             <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full px-8">
               <button class="btn bg-slate-900 text-white hover:bg-slate-800 h-16 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3">
                 <HeadphonesIcon class="w-5 h-5" /> Contact Support
               </button>
               <button class="btn bg-kuli-red text-white hover:bg-red-700 h-16 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-red-200">
                 <ShieldAlertIcon class="w-5 h-5" /> Emergency SOS
               </button>
             </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="py-20 bg-white border-t border-slate-100">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">Travel with <span class="text-blue-600">Confidence.</span></h2>
        <router-link :to="{name: 'signup'}" class="btn btn-primary h-16 px-10 text-lg uppercase tracking-widest font-black inline-flex items-center gap-4">
          Book a Trusted Kuli <ArrowRightIcon class="w-6 h-6" />
        </router-link>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-white border-t border-slate-100 py-12 px-6">
       <div class="container mx-auto text-center">
          <p class="text-sm text-slate-400 font-bold uppercase tracking-[0.2em] mb-4">Leh Lu Kya? Safety Portal</p>
          <div class="flex items-center justify-center gap-6">
            <a href="#" class="text-slate-400 hover:text-blue-500 transition-colors"><TwitterIcon class="w-5 h-5" /></a>
            <a href="#" class="text-slate-400 hover:text-blue-700 transition-colors"><FacebookIcon class="w-5 h-5" /></a>
            <a href="#" class="text-slate-400 hover:text-pink-600 transition-colors"><InstagramIcon class="w-5 h-5" /></a>
          </div>
       </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { 
  ShieldCheckIcon, ShieldAlertIcon, MapPinIcon, BadgeCheckIcon, LocateIcon, 
  CreditCardIcon, MessageCircleIcon, FileTextIcon, UserCheckIcon, 
  CheckCircleIcon, HeadphonesIcon, ArrowRightIcon, ChevronDownIcon,
  TwitterIcon, FacebookIcon, InstagramIcon
} from 'lucide-vue-next';

const activeFaq = ref(null);

const toggleFaq = (idx) => {
  activeFaq.value = activeFaq.value === idx ? null : idx;
};

const safetyHighlights = [
  { icon: UserCheckIcon, title: 'Verified Kulis', description: 'Every kuli on our platform undergoes a rigorous 3-step background and ID verification.' },
  { icon: BadgeCheckIcon, title: 'ID & Badge Check', description: 'Cross-verify kuli badge numbers and official railway IDs directly before handing over luggage.' },
  { icon: MapPinIcon, title: 'Live Booking Status', description: 'Stay updated with active status notification from booking to completion.' },
  { icon: LocateIcon, title: 'Location Visibility', description: 'Track active booking movement in real-time within the station vicinity.' },
  { icon: ShieldAlertIcon, title: 'Emergency Support', description: 'Direct 24/7 access to our specialized safety response team via the SOS button.' },
  { icon: CreditCardIcon, title: 'Secure Payments', description: 'Escrow-based digital payments ensure you only pay when you are satisfied.' },
  { icon: MessageCircleIcon, title: 'Dispute Support', description: 'Quick dispute resolution mechanism to handle any luggage or behavior issues.' },
  { icon: FileTextIcon, title: 'Booking History', description: 'Access permanent digital records of all your interactions for complete transparency.' }
];

const safetySteps = [
  { icon: UserCheckIcon, title: 'Registration & Verification', description: 'Porters must submit their official Railway Badge and Government identification for manual verification by our admin team.' },
  { icon: ShieldCheckIcon, title: 'Admin Approval', description: 'Our team cross-checks verification details before allowing any kuli to accept booking requests.' },
  { icon: FileTextIcon, title: 'Customer Booking Record', description: 'Upon booking, all details of the selected porter are instantly shared with you, including their photo and badge ID.' },
  { icon: LocateIcon, title: 'Booking Tracking', description: 'We monitor active bookings to ensure the service is being completed within the designated station zones.' },
  { icon: CreditCardIcon, title: 'Payment Transparency', description: 'The fare is locked before the journey starts. No hidden charges or last-minute price hikes allowed.' },
  { icon: ShieldAlertIcon, title: 'Review & Dispute', description: 'Passengers can rate their experience and file instant complaints if they face any issues during the service.' }
];

const trustIndicators = [
  { value: '100%', label: 'Porters Verified' },
  { value: '24/7', label: 'Safety Support' },
  { value: '500+', label: 'Stations Covered' },
  { value: 'Zero', label: 'Hidden Charges' }
];

const safetyFaqs = [
  { question: 'Are kulis verified before joining?', answer: 'Yes, every kuli on Leh Lu Kya? must provide their official Indian Railways Porter Badge and valid government ID. Our admin team manually validates these documents before granting access to our platform.' },
  { question: 'Can I see kuli details before booking?', answer: 'Absolutely. Once you place an request and a kuli offers their service, you can see their profile picture, official badge number, rating, and successful booking history before confirming.' },
  { question: 'What if I face an issue during service?', answer: 'We have a high-priority "Emergency SOS" button in your active booking view. Pressing this alerts our 24/7 safety team who will immediately intervene or contact station authorities if necessary.' },
  { question: 'Is my payment secure?', answer: 'We use a secure escrow system. Your payment is held by the platform and only transferred to the porter after you confirm that the service was successful and safe.' },
  { question: 'Can I report misconduct?', answer: 'Yes. Post-service, you are encouraged to rate the porter. Any report of misconduct triggers an immediate internal investigation and can lead to permanent banning of that porter.' }
];
</script>

<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

.animate-slide-up {
  animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.animate-slide-up-delayed {
  opacity: 0;
  animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  animation-delay: 0.2s;
}

.animate-pulsate {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
