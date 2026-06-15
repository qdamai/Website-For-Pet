import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  { path: '/', name: 'Splash', component: () => import('../views/Splash.vue') },
  { path: '/auth', name: 'Auth', component: () => import('../views/Auth.vue') },
  { path: '/dashboard', name: 'Dashboard', component: () => import('../views/Dashboard.vue'), meta: { requiresAuth: true } },
  { path: '/report', name: 'ReportForm', component: () => import('../views/ReportForm.vue'), meta: { requiresAuth: true } },
  { path: '/explore', name: 'Explore', component: () => import('../views/Explore.vue') },
  { path: '/radar', name: 'PetRadarMap', component: () => import('../views/PetRadarMap.vue') },
  { path: '/pet/:type/:id', name: 'PetDetail', component: () => import('../views/PetDetail.vue') },
  { path: '/chat', name: 'LiveChat', component: () => import('../views/LiveChat.vue'), meta: { requiresAuth: true } },
  { path: '/profile', name: 'Profile', component: () => import('../views/Profile.vue'), meta: { requiresAuth: true } },
  { path: '/admin', name: 'AdminPanel', component: () => import('../views/AdminPanel.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  

];

export const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();
  
  if (authStore.loading) {
    await authStore.init();
  }

  const isAuthenticated = authStore.isAuthenticated;
  const isAdmin = authStore.isAdmin;

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'Auth' };
  } else if (to.meta.requiresAdmin && !isAdmin) {
    return { name: 'Dashboard' };
  } else if (to.name === 'Auth' && isAuthenticated) {
    return { name: 'Dashboard' };
  }
  
  return true;
});
