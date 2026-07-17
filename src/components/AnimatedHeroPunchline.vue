<template>
  <div class="relative z-10 w-full max-w-[45rem] mx-auto md:mx-0 mt-4 md:mt-0">
    <!-- Subtle Background Motion Elements (Dots/Light Particles) -->
    <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[3rem]">
      <div v-for="i in 6" :key="i" 
           class="absolute w-2 h-2 rounded-full bg-slate-300 opacity-[0.15] animate-stray-float" 
           :style="getDotStyle(i)"></div>
    </div>
    
    <div class="relative z-10 flex flex-col items-center md:items-start">
      
      <!-- Slot for the existing badge -->
      <div class="animate-fade-in-up badge-wrapper z-10 relative">
         <slot name="badge"></slot>
      </div>
      
      <!-- Animated Main Punchline -->
      <h1 class="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 mt-6 mb-8 leading-[1.1] tracking-tight text-center md:text-left animated-heading w-full">
        <span class="block overflow-hidden pb-1 md:pb-2">
          <span class="inline-block animate-cooler-word-1 text-kuli-red drop-shadow-sm text-[1em]">Leh Lu Kya?</span>
        </span>
        <span class="block overflow-hidden py-1 md:py-2 mt-1 md:mt-2">
          <span class="inline-block animate-cooler-word-2 text-slate-800 text-[0.8em] tracking-tight font-extrabold drop-shadow-sm">— Desi Service,</span>
        </span>
        <span class="block overflow-hidden pt-1 relative">
          <span class="inline-block animate-cooler-word-3 relative z-10 text-[0.9em]">Smart Booking.</span>
          <!-- Dynamic Highlighting marker -->
          <span class="absolute bottom-1 md:bottom-2 left-0 w-0 h-3 md:h-5 bg-kuli-gold/40 -z-10 -rotate-2 animate-marker-highlight"></span>
        </span>
      </h1>
      
      <!-- Supporting Subtext -->
      <p class="text-lg md:text-xl text-slate-500 max-w-xl text-center md:text-left leading-relaxed font-sans mt-2 animate-fade-in-up-delayed font-medium">
        Book trusted station kulis in real time, track nearby availability, and move stress-free.
      </p>
      
      <!-- Slot for CTA buttons -->
      <div class="mt-12 flex flex-col sm:flex-row gap-4 justify-center md:justify-start w-full sm:w-auto animate-fade-in-up-more-delayed">
         <slot name="cta"></slot>
      </div>
      
    </div>
  </div>
</template>

<script setup>
const getDotStyle = (i) => {
  const top = Math.random() * 80 + 10;
  const left = Math.random() * 80 + 10;
  const delay = Math.random() * 3 + 's';
  const duration = Math.random() * 10 + 15 + 's';
  const scale = Math.random() * 1.5 + 0.5;
  return `top: ${top}%; left: ${left}%; animation-delay: ${delay}; animation-duration: ${duration}; transform: scale(${scale});`;
};
</script>

<style scoped>
/* Abstract Slide+Blur Reset */
@keyframes slideUpBlurIn {
  0% { opacity: 0; transform: translateY(30px); filter: blur(12px); }
  50% { filter: blur(4px); }
  100% { opacity: 1; transform: translateY(0); filter: blur(0); }
}

/* Post-entrance soft breathing motion for the text block */
@keyframes breathing {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

@keyframes sweepStroke {
  0% { width: 0; opacity: 0; }
  10% { opacity: 1; }
  100% { width: 100%; opacity: 1; }
}

@keyframes floatParticles {
  0% { transform: translate(0, 0) scale(1); opacity: 0; }
  20% { opacity: 0.2; }
  80% { opacity: 0.2; }
  100% { transform: translate(50px, -80px) scale(0.5); opacity: 0; }
}

/* Elements */
.animate-cooler-word-1,
.animate-cooler-word-2,
.animate-cooler-word-3 {
  opacity: 0;
  animation: slideUpClear 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

/* Precise Staggering */
.animate-cooler-word-1 { animation-delay: 0.1s; transform: translateY(110%); }
.animate-cooler-word-2 { animation-delay: 0.3s; transform: translateY(110%); }
.animate-cooler-word-3 { animation-delay: 0.5s; transform: translateY(110%); }

/* Hard slide-up reveal with blur from a clipped block */
@keyframes slideUpClear {
  0% { opacity: 0; transform: translateY(110%) scale(0.96) rotate(1deg); filter: blur(8px); }
  60% { filter: blur(2px); }
  100% { opacity: 1; transform: translateY(0) scale(1) rotate(0); filter: blur(0); }
}

@keyframes drawMarker {
  0% { width: 0; opacity: 0; transform: skewX(-20deg); }
  20% { opacity: 1; }
  100% { width: 105%; opacity: 1; transform: skewX(-15deg); }
}

.animate-marker-highlight {
  opacity: 0;
  animation: drawMarker 0.8s cubic-bezier(0.85, 0, 0.15, 1) forwards;
  animation-delay: 1.1s; 
}

/* The whole heading gently breathes after entrance */
.animated-heading {
  animation: breathing 6s ease-in-out infinite forwards;
  animation-delay: 2.2s; 
}

/* Standard supporting text entrance */
.animate-fade-in-up-delayed {
  opacity: 0;
  animation: slideUpBlurIn 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  animation-delay: 0.8s;
}

.animate-fade-in-up-more-delayed {
  opacity: 0;
  animation: slideUpBlurIn 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  animation-delay: 1.1s;
}

.animate-stray-float {
  animation: floatParticles linear infinite;
  opacity: 0;
}

.badge-wrapper {
  animation: slideUpBlurIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

/* Remove initial flicker */
h1 span {
  will-change: transform, opacity, filter;
}
</style>
