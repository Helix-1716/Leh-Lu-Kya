<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navigation -->
    <nav class="sticky top-0 z-50 glass border-b border-kuli-earth-dark px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-sm border border-slate-100 shrink-0">
          <img src="/Images/Kuli Logo.png" class="w-full h-full object-contain" alt="Kuli Logo">
        </div>
        <div class="flex flex-col justify-center pt-0.5">
          <h1 class="text-xl font-black text-slate-900 uppercase tracking-tight leading-none mb-1 font-sans">Leh Lu Kya?</h1>
          <p class="text-[9px] text-slate-500 font-bold uppercase tracking-[0.25em] leading-none">Kuli Booking</p>
        </div>
      </div>
      
      <div class="hidden md:flex items-center gap-8 text-sm font-bold text-kuli-blue">
        <a href="#how-it-works" class="hover:text-kuli-red transition-colors capitalize">How it works</a>
        <router-link :to="{name: 'safety'}" class="hover:text-kuli-red transition-colors capitalize">Safety</router-link>
        <router-link :to="{name: 'pricing'}" class="hover:text-kuli-red transition-colors capitalize">Pricing</router-link>
      </div>

      <div class="flex items-center gap-4">
        <router-link :to="{name: 'login'}" class="text-sm font-bold text-kuli-blue hover:text-kuli-red transition-colors capitalize">Login</router-link>
        <router-link :to="{name: 'signup'}" class="btn btn-primary text-sm px-5 py-2 capitalize">Book Now</router-link>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-32 bg-linear-to-br from-kuli-earth-light via-white to-kuli-gold/10 min-h-[90vh] flex items-center">
      <!-- Decorative Background Text -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-black text-kuli-gold/5 select-none pointer-events-none uppercase">
        KULI
      </div>

      <div class="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
        <div class="flex-1 relative z-10 w-full mb-10 md:mb-0">
          <AnimatedHeroPunchline>
            <template #badge>
              <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-kuli-red/10 text-kuli-red text-[10px] font-black uppercase tracking-widest border border-kuli-red/20 shadow-sm transition-transform hover:scale-105">
                <MapPinIcon class="w-3.5 h-3.5" stroke-width="2.5" /> Real-time India Station Porter Service
              </div>
            </template>
            <template #cta>
              <router-link :to="{name: 'signup', query: {role: 'customer'}}" class="btn btn-primary h-14 px-8 text-base font-black uppercase tracking-widest group shadow-xl">
                Book a Kuli
                <ArrowRightIcon class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </router-link>
              <router-link :to="{name: 'signup', query: {role: 'kuli'}}" class="btn h-14 px-8 text-base font-black uppercase tracking-widest group bg-slate-900 border-slate-900 text-white hover:bg-slate-800 shadow-xl">
                Become a Kuli
                <UserCheckIcon class="w-5 h-5 group-hover:scale-110 transition-transform" />
              </router-link>
            </template>
          </AnimatedHeroPunchline>
          
          <div class="mt-12 flex items-center gap-6 justify-center md:justify-start animate-fade-in" style="animation-delay: 1.6s;">
            <div class="flex -space-x-4">
              <div v-for="i in 4" :key="i" class="w-12 h-12 rounded-full border-4 border-kuli-earth-light overflow-hidden bg-kuli-earth shadow-sm">
                <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=kuli${i}`" class="w-full h-full object-cover">
              </div>
            </div>
            <div class="text-sm font-bold text-kuli-blue">
              <span class="text-kuli-red">+10k</span> Verified Kulis Online
            </div>
          </div>
        </div>

        <div class="flex-1 relative animate-fade-in" style="animation-delay: 0.2s;">
          <div class="relative w-full aspect-square max-w-lg mx-auto">
             <!-- Mobile UI Mockup -->
             <div class="absolute top-0 right-0 w-full h-full bg-kuli-gold/10 rounded-[3rem] -rotate-3 border-2 border-kuli-gold/20"></div>
             <div class="relative w-full h-full bg-white rounded-[2.5rem] shadow-2xl border-8 border-kuli-blue overflow-hidden flex flex-col p-4">
                <div class="w-24 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
                <div class="flex items-center justify-between mb-6">
                  <div class="font-black text-xs uppercase tracking-widest text-kuli-blue leading-none">Map View</div>
                  <div class="w-6 h-6 rounded-full bg-kuli-red/10 flex items-center justify-center text-kuli-red">
                    <HistoryIcon class="w-3 h-3" />
                  </div>
                </div>
                <!-- Mock Map -->
                <div class="flex-1 bg-kuli-earth rounded-2xl relative overflow-hidden mb-4 border border-kuli-earth-dark">
                  <div class="absolute inset-0 bg-blue-50 opacity-20"></div>
                  <!-- Kuli Dots -->
                  <div class="absolute top-1/4 left-1/3 w-8 h-8 bg-white rounded-full flex items-center justify-center p-1 shadow-lg animate-bounce border border-slate-100">
                    <img src="/Images/Kuli Logo.png" class="w-full h-full object-contain" alt="Logo">
                  </div>
                   <div class="absolute bottom-1/3 right-1/4 w-3 h-3 bg-kuli-blue rounded-full border-2 border-white shadow-sm"></div>
                   <div class="absolute top-1/2 left-1/2 w-3 h-3 bg-kuli-blue rounded-full border-2 border-white shadow-sm"></div>
                </div>
                <!-- Mock Card -->
                 <button type="button" @click="openTripDetails(defaultTrip)" class="w-full bg-white rounded-xl p-3 shadow-lg border border-kuli-earth text-left transition-transform hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-kuli-red/30">
                  <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1.5 shrink-0 shadow-sm">
                      <img src="/Images/Kuli Logo.png" class="w-full h-full object-contain" alt="Logo">
                    </div>
                    <div class="min-w-0">
                      <h4 class="font-black text-sm text-slate-900 uppercase tracking-tight truncate">{{ defaultTrip.route }}</h4>
                      <p class="text-[10px] text-slate-500 font-bold">{{ defaultTrip.date }} · {{ defaultTrip.fare }}</p>
                    </div>
                    <div class="ml-auto shrink-0 px-3 py-1 rounded-full bg-green-100 text-green-700 text-[9px] font-black uppercase tracking-widest">
                      {{ defaultTrip.status }}
                    </div>
                  </div>
                  <p class="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Tap to view trip details</p>
                </button>
             </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Profile Section -->
    <section class="py-20 md:py-28 bg-[#f4f7ff]">
      <div class="container mx-auto px-6">
        <div class="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
          <div class="max-w-xl">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-kuli-blue/10 text-kuli-blue text-[10px] font-black uppercase tracking-widest border border-kuli-blue/15 shadow-sm mb-5">
              <UserCheckIcon class="w-3.5 h-3.5" stroke-width="2.5" /> Profile Preview
            </div>
            <h2 class="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-5">
              A clean profile section for verified users.
            </h2>
            <p class="text-base md:text-lg text-slate-600 leading-relaxed max-w-lg">
              Show identity, membership tier, and quick account actions in one compact panel. This is a lightweight preview of the user profile experience for Kuli app users.
            </p>

            <div class="mt-8 grid sm:grid-cols-2 gap-4">
              <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Verified badge</p>
                <p class="text-sm font-bold text-slate-900">Identity-confirmed and ready to book.</p>
              </div>
              <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Quick actions</p>
                <p class="text-sm font-bold text-slate-900">View bookings, wallet, safety, and support.</p>
              </div>
            </div>
          </div>

          <div class="relative">
            <div class="absolute inset-0 translate-x-6 translate-y-6 rounded-[2.25rem] bg-[#102f57] opacity-15 blur-2xl"></div>
            <div class="relative overflow-hidden rounded-[2.25rem] bg-[#16395f] text-white shadow-[0_30px_80px_rgba(16,47,87,0.35)] border border-white/10">
              <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_28%)]"></div>
              <div class="relative p-6 md:p-8">
                <div class="flex items-start gap-4">
                  <div class="w-20 h-20 rounded-full bg-white/10 ring-4 ring-white/15 overflow-hidden shrink-0 shadow-lg">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=helix" alt="Profile avatar" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-2">
                      <h3 class="text-2xl font-black uppercase tracking-tight truncate">Helix The Fir...</h3>
                      <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-blue-100 border border-white/10">
                        <CrownIcon class="w-3 h-3" /> Premium
                      </span>
                    </div>
                    <p class="text-sm font-bold uppercase tracking-[0.25em] text-blue-200/90">Premium User</p>

                    <div class="mt-4 flex flex-wrap gap-2">
                      <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-widest border border-white/10">
                        <ShieldCheckIcon class="w-3.5 h-3.5" /> Verified
                      </span>
                      <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-widest border border-white/10">
                        <MapPinIcon class="w-3.5 h-3.5" /> Howrah Station
                      </span>
                    </div>
                  </div>
                </div>

                <div class="mt-6 grid grid-cols-3 gap-3">
                  <div class="rounded-2xl bg-white/8 border border-white/10 p-4">
                    <p class="text-[9px] uppercase tracking-widest text-blue-200/70 font-black mb-1">Trips</p>
                    <p class="text-xl font-black">128</p>
                  </div>
                  <div class="rounded-2xl bg-white/8 border border-white/10 p-4">
                    <p class="text-[9px] uppercase tracking-widest text-blue-200/70 font-black mb-1">Rating</p>
                    <p class="text-xl font-black">4.9</p>
                  </div>
                  <div class="rounded-2xl bg-white/8 border border-white/10 p-4">
                    <p class="text-[9px] uppercase tracking-widest text-blue-200/70 font-black mb-1">Wallet</p>
                    <p class="text-xl font-black">₹840</p>
                  </div>
                </div>

                <div class="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-white/8 border border-white/10 p-4">
                  <div>
                    <p class="text-[9px] uppercase tracking-[0.25em] text-blue-200/70 font-black">Trip status</p>
                    <p class="text-sm font-bold text-white/90 mt-1">{{ defaultTrip.etaText }}</p>
                    <p class="text-[10px] text-blue-100/80 mt-1">{{ defaultTrip.liveNote }}</p>
                  </div>
                  <button class="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-[#16395f] transition-transform hover:scale-[1.02]">
                    Open Profile
                    <ArrowRightIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trip Details Modal -->
    <div v-if="showTripDetailsModal" class="fixed inset-0 z-120 flex items-center justify-center bg-slate-900/65 backdrop-blur-sm px-6" @click.self="closeTripDetails">
      <div class="w-full max-w-2xl overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-2xl animate-slide-up">
        <div class="flex items-start justify-between gap-4 border-b border-slate-100 bg-slate-50 px-6 py-5">
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.3em] text-kuli-red mb-2">Trip Details</p>
            <h3 class="text-2xl font-black text-slate-900 uppercase tracking-tight">{{ selectedTrip.route }}</h3>
            <p class="text-sm font-bold text-slate-500 mt-1">{{ selectedTrip.date }} · Booking #{{ selectedTrip.bookingId }}</p>
          </div>
          <button type="button" @click="closeTripDetails" class="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-colors flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div class="p-6">
          <div class="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-2 shadow-sm shrink-0">
                  <img src="/Images/Kuli Logo.png" class="w-full h-full object-contain" alt="Logo">
                </div>
                <div>
                  <p class="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Assigned porter</p>
                  <p class="text-base font-black text-slate-900">{{ selectedTrip.porter }}</p>
                </div>
              </div>

              <div class="space-y-3">
                <div class="rounded-2xl bg-white border border-green-100 px-4 py-3 mb-4 shadow-sm">
                  <p class="text-[9px] font-black uppercase tracking-[0.25em] text-green-600 mb-1">Estimated arrival</p>
                  <p class="text-xl font-black text-slate-900">{{ selectedTrip.etaText }}</p>
                  <p class="text-xs text-slate-500 font-medium mt-1">{{ selectedTrip.liveNote }}</p>
                </div>
                <div class="flex items-center justify-between gap-4">
                  <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Pickup</span>
                  <span class="text-sm font-bold text-slate-900 text-right">{{ selectedTrip.pickup }}</span>
                </div>
                <div class="flex items-center justify-between gap-4">
                  <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Drop</span>
                  <span class="text-sm font-bold text-slate-900 text-right">{{ selectedTrip.drop }}</span>
                </div>
                <div class="flex items-center justify-between gap-4">
                  <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Fare</span>
                  <span class="text-sm font-bold text-slate-900 text-right">{{ selectedTrip.fare }}</span>
                </div>
                <div class="flex items-center justify-between gap-4">
                  <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</span>
                  <span class="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-green-700">
                    <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    {{ selectedTrip.status }}
                  </span>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p class="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-4">Trip timeline</p>
              <div class="space-y-4">
                <div class="flex gap-3">
                  <div class="mt-1 h-3 w-3 rounded-full bg-kuli-red shrink-0"></div>
                  <div>
                    <p class="text-sm font-black text-slate-900">Accepted</p>
                    <p class="text-xs text-slate-500 font-medium">The porter accepted the request and is on the way.</p>
                  </div>
                </div>
                <div class="flex gap-3">
                  <div class="mt-1 h-3 w-3 rounded-full bg-green-500 shrink-0 animate-pulse"></div>
                  <div>
                    <p class="text-sm font-black text-slate-900">Coming in {{ selectedTrip.etaMinutes }} mins</p>
                    <p class="text-xs text-slate-500 font-medium">The kuli is moving toward the pickup point right now.</p>
                  </div>
                </div>
                <div class="flex gap-3">
                  <div class="mt-1 h-3 w-3 rounded-full bg-slate-200 shrink-0"></div>
                  <div>
                    <p class="text-sm font-black text-slate-900">Trip completed</p>
                    <p class="text-xs text-slate-500 font-medium">Trip summary, payment, and receipt will appear here.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-5 flex justify-end gap-3">
            <button type="button" @click="closeTripDetails" class="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-black uppercase tracking-widest hover:border-slate-300 hover:text-slate-800 transition-colors">
              Close
            </button>
            <button type="button" class="px-4 py-2 rounded-xl bg-kuli-red text-white text-xs font-black uppercase tracking-widest hover:bg-kuli-blue transition-colors">
              Contact Porter
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <section id="how-it-works" class="py-24 bg-white">
      <div class="container mx-auto px-6 text-center">
        <h3 class="text-kuli-gold uppercase tracking-[0.3em] font-black text-sm mb-4">How it works</h3>
        <h2 class="text-4xl font-black text-kuli-blue mb-16">Simple as <span class="text-kuli-red underline decoration-4 underline-offset-8 decoration-kuli-gold">One, Two, Three</span></h2>
        
        <div class="grid md:grid-cols-3 gap-12">
          <div class="flex flex-col items-center group">
            <div class="w-20 h-20 bg-kuli-blue text-white rounded-4xl flex items-center justify-center mb-8 shadow-xl group-hover:rotate-6 transition-transform">
              <SearchIcon class="w-10 h-10" />
            </div>
            <h4 class="text-xl font-bold mb-4">Search Station</h4>
            <p class="text-gray-500 leading-relaxed max-w-xs">Enter your arrival station and platform number to find nearby verified kulis.</p>
          </div>
          
          <div class="flex flex-col items-center group">
            <div class="w-20 h-20 bg-kuli-red text-white rounded-4xl flex items-center justify-center mb-8 shadow-xl group-hover:-rotate-6 transition-transform">
              <TagIcon class="w-10 h-10" />
            </div>
            <h4 class="text-xl font-bold mb-4">Select & Negotiate</h4>
            <p class="text-gray-500 leading-relaxed max-w-xs">Choose a porter based on rating. Offer a fair price or use our standard estimator.</p>
          </div>
          
          <div class="flex flex-col items-center group">
            <div class="w-20 h-20 bg-kuli-gold text-white rounded-4xl flex items-center justify-center mb-8 shadow-xl group-hover:rotate-6 transition-transform">
              <CreditCardIcon class="w-10 h-10" />
            </div>
            <h4 class="text-xl font-bold mb-4">Pay & Track</h4>
            <p class="text-gray-500 leading-relaxed max-w-xs">Pay securely through the app or cash. Track your porter live as they arrive.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-kuli-blue text-white relative overflow-hidden">
       <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
       <div class="absolute bottom-0 left-0 w-96 h-96 bg-kuli-red/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
       
       <div class="container mx-auto px-6 relative z-10 text-center">
         <h2 class="text-4xl md:text-6xl font-black mb-8 leading-tight">Ready to take the <br> <span class="text-kuli-red underline decoration-4 underline-offset-8">Weight off</span> your shoulders?</h2>
         <p class="text-xl text-blue-100 max-w-2xl mx-auto mb-12 font-sans font-medium">Digitalizing India's porter service, one station at a time. Trustworthy, trackable, and transparent.</p>
         <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
           <router-link :to="{name: 'signup'}" class="btn bg-white text-kuli-blue px-10 py-4 h-auto text-xl font-black uppercase tracking-widest hover:bg-kuli-red hover:text-white transition-colors">Start Booking</router-link>
           <button class="text-white border-b-2 border-white/30 pb-1 font-bold hover:border-kuli-red transition-all">Download App (Coming Soon)</button>
         </div>
       </div>
    </section>

    <!-- Footer -->
    <footer class="bg-kuli-earth py-16 border-t border-kuli-earth-dark">
      <div class="container mx-auto px-6">
        <div class="grid md:grid-cols-4 gap-12 mb-12">
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-sm border border-slate-100 shrink-0">
                <img src="/Images/Kuli Logo.png" class="w-full h-full object-contain" alt="Kuli Logo">
              </div>
              <div class="flex flex-col justify-center">
                 <h1 class="text-lg font-black text-slate-900 uppercase leading-none mb-0.5">Leh Lu Kya?</h1>
                 <p class="text-[8px] text-slate-500 font-bold uppercase tracking-[0.2em] leading-none">Kuli Booking</p>
              </div>
            </div>
            <p class="text-gray-500 max-w-sm mb-6 font-medium">Empowering traditional Indian porters with modern technology to provide better service and safety to commuters across the nation.</p>
            <div class="flex gap-4">
              <a href="#" class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-kuli-blue hover:bg-kuli-red hover:text-white transition-colors shadow-sm">
                <FacebookIcon class="w-5 h-5" />
              </a>
              <a href="#" class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-kuli-blue hover:bg-kuli-red hover:text-white transition-colors shadow-sm">
                <TwitterIcon class="w-5 h-5" />
              </a>
              <a href="#" class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-kuli-blue hover:bg-kuli-red hover:text-white transition-colors shadow-sm">
                <InstagramIcon class="w-5 h-5" />
              </a>
              <a href="#" class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-kuli-blue hover:bg-kuli-red hover:text-white transition-colors shadow-sm">
                <LinkedinIcon class="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h5 class="font-bold text-kuli-blue mb-6 uppercase tracking-widest text-xs">Platform</h5>
            <ul class="space-y-4 text-sm font-bold text-gray-500">
              <li><router-link to="/auth/signup?role=customer" class="hover:text-kuli-red">For Customers</router-link></li>
              <li><router-link to="/auth/signup?role=kuli" class="hover:text-kuli-red">For porters</router-link></li>
              <li><router-link to="/admin/dashboard" class="hover:text-kuli-red">Admin Portal</router-link></li>
              <li><a href="#" class="hover:text-kuli-red">Station Map</a></li>
            </ul>
          </div>

          <div>
            <h5 class="font-bold text-kuli-blue mb-6 uppercase tracking-widest text-xs">Help & Legal</h5>
            <ul class="space-y-4 text-sm font-bold text-gray-500">
              <li><a href="#" class="hover:text-kuli-red">Privacy Policy</a></li>
              <li><a href="#" class="hover:text-kuli-red">Terms of Service</a></li>
              <li><a href="#" class="hover:text-kuli-red">Safety Guidelines</a></li>
              <li><a href="#" class="hover:text-kuli-red">Contact Support</a></li>
            </ul>
          </div>
        </div>
        
        <div class="pt-12 border-t border-kuli-earth-dark flex flex-col md:flex-row justify-between items-center gap-6">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">© 2026 Leh Lu Kya? Porter Services Pvt Ltd.</p>
          <div class="flex items-center gap-2 text-xs font-bold text-gray-400">
             Made with <HeartIcon class="w-3 h-3 text-kuli-red fill-current" /> for Indian Commuters
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AnimatedHeroPunchline from '../../components/AnimatedHeroPunchline.vue';
import { 
  MapPinIcon, 
  ArrowRightIcon, 
  UserIcon, 
  HistoryIcon, 
  SearchIcon, 
  TagIcon, 
  CreditCardIcon, 
  HeartIcon, 
  UserCheckIcon,
  CrownIcon,
  ShieldCheckIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon
} from 'lucide-vue-next';

const showTripDetailsModal = ref(false);

const defaultTrip = {
  route: 'HOWRAH (HWH) | PF -',
  date: '3 April 2026',
  fare: '₹106',
  status: 'Accepted',
  etaMinutes: 50,
  etaText: 'Coming in 50 mins',
  liveNote: 'Kuli is on the way and will reach the station shortly.',
  bookingId: 'KULI-10284',
  porter: 'Ramesh Yadav',
  pickup: 'Howrah Station, Platform 4',
  drop: 'Station Exit Gate 2'
};

const selectedTrip = ref({ ...defaultTrip });

const openTripDetails = (trip) => {
  selectedTrip.value = { ...trip };
  showTripDetailsModal.value = true;
};

const closeTripDetails = () => {
  showTripDetailsModal.value = false;
};
</script>

<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
</style>
