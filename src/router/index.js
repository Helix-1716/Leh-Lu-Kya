import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('../views/landing/LandingView.vue'),
    },
    {
      path: '/auth/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
    },
    {
      path: '/auth/signup',
      name: 'signup',
      component: () => import('../views/auth/SignupView.vue'),
    },
    {
      path: '/auth/verify-email',
      name: 'verify-email',
      component: () => import('../views/auth/verify/VerifyEmailView.vue'),
    },
    {
      path: '/safety',
      name: 'safety',
      component: () => import('../views/landing/SafetyView.vue'),
    },
    {
      path: '/pricing',
      name: 'pricing',
      component: () => import('../views/landing/PricingView.vue'),
    },
    // Customer Routes
    {
      path: '/customer',
      component: () => import('../layout/CustomerLayout.vue'),
      meta: { requiresAuth: true, role: 'customer' },
      children: [
        { path: 'dashboard', name: 'customer-dashboard', component: () => import('../views/customer/DashboardView.vue') },
        { path: 'book', name: 'customer-book', component: () => import('../views/customer/BookView.vue') },
        { path: 'services/luggage', name: 'customer-luggage-move', component: () => import('../views/customer/LuggageMoveView.vue') },
        { path: 'services/elderly', name: 'customer-elderly-assist', component: () => import('../views/customer/ElderlyAssistView.vue') },
        { path: 'services/cargo', name: 'customer-cargo-carry', component: () => import('../views/customer/CargoCarryView.vue') },
        { path: 'services/medical', name: 'customer-medical-assist', component: () => import('../views/customer/MedicalAssistView.vue') },
        { path: 'recent-station', name: 'customer-recent-station', component: () => import('../views/customer/RecentStationView.vue') },
        { path: 'recent-bookings', name: 'customer-recent-bookings', component: () => import('../views/customer/RecentBookingsView.vue') },
        { path: 'emergency-sos', name: 'customer-emergency-sos', component: () => import('../views/customer/EmergencySosView.vue') },
        { path: 'profile', name: 'customer-profile', component: () => import('../views/customer/ProfileView.vue') },
        { path: 'wallet', name: 'customer-wallet', component: () => import('../views/customer/WalletView.vue') },
      ]
    },
    // Kuli Routes
    {
      path: '/kuli',
      component: () => import('../layout/KuliLayout.vue'),
      meta: { requiresAuth: true, role: 'kuli' },
      children: [
        { path: 'dashboard', name: 'kuli-dashboard', component: () => import('../views/kuli/DashboardView.vue') },
        { path: 'profile', name: 'kuli-profile', component: () => import('../views/kuli/ProfileView.vue') },
        { path: 'earnings', name: 'kuli-earnings', component: () => import('../views/kuli/EarningsView.vue') },
      ]
    },
    // Admin Login (Fully Separate Flow)
    {
      path: '/admin/auth',
      name: 'admin-login',
      component: () => import('../views/admin/AdminLoginView.vue'),
    },
    {
      path: '/admin/unauthorized',
      name: 'admin-unauthorized',
      component: () => import('../views/admin/UnauthorizedView.vue'),
    },
    // Admin Routes
    {
      path: '/admin',
      component: () => import('../layout/AdminLayout.vue'),
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        { path: 'dashboard', name: 'admin-dashboard', component: () => import('../views/admin/DashboardView.vue') },
        { path: 'users', name: 'admin-users', component: () => import('../views/admin/UsersView.vue') },
        { path: 'bookings', name: 'admin-bookings', component: () => import('../views/admin/BookingsView.vue') },
        { path: 'profile', name: 'admin-profile', component: () => import('../views/admin/ProfileView.vue') },
      ]
    },
  ],
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  
  // Wait for Firebase to check the auth state first
  if (authStore.loading) {
    await authStore.init();
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiredRole = to.meta.role;
  const isAuthPage = ['login', 'signup', 'admin-login'].includes(to.name);
  const isVerifyPage = to.name === 'verify-email';

  // State: Not Logged In
  if (requiresAuth && !authStore.user) {
    return to.path.startsWith('/admin') ? { name: 'admin-login' } : { name: 'login' };
  }

  // State: Logged In
  if (authStore.user) {
    // 1. Check Verification (Except for Verify Page, Public Pages, or Admin Users)
    // Admin accounts are auto-verified by railway official credentials
    if (!authStore.isVerified && !isVerifyPage && !to.matched.some(r => r.meta.public) && authStore.role !== 'admin') {
      // Allow Google users to skip if provider verified them (handled by store sync, but safety check here)
      return { name: 'verify-email' };
    }

    // 2. Prevent visiting Auth pages while logged in
    if (isAuthPage) {
      if (authStore.role === 'admin') return { name: 'admin-dashboard' };
      if (authStore.role === 'kuli') return { name: 'kuli-dashboard' };
      return { name: 'customer-dashboard' };
    }

    // 3. Role Authorization
    if (requiredRole && authStore.role !== requiredRole) {
      if (requiredRole === 'admin') return { name: 'admin-unauthorized' };
      if (authStore.role === 'customer') return { name: 'customer-dashboard' };
      if (authStore.role === 'kuli') return { name: 'kuli-dashboard' };
      return { name: 'landing' };
    }
  }

  return true;
});

export default router;
