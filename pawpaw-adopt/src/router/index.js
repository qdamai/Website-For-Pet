import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  { path: '/', name: 'AdoptionCatalog', component: () => import('../views/AdoptionCatalog.vue') },
  { path: '/pet/:id', name: 'AdoptionPetDetail', component: () => import('../views/AdoptionPetDetail.vue') },
  { path: '/apply/:id', name: 'AdoptionForm', component: () => import('../views/AdoptionForm.vue'), meta: { requiresAuth: true } },
  { path: '/quiz', name: 'AdoptionQuiz', component: () => import('../views/AdoptionQuiz.vue') },
  { path: '/compare', name: 'AdoptionCompare', component: () => import('../views/AdoptionCompare.vue') },
  { path: '/stories', name: 'AdoptionStories', component: () => import('../views/AdoptionStories.vue') },
  { path: '/dashboard', name: 'AdoptionDashboard', component: () => import('../views/AdoptionDashboard.vue'), meta: { requiresAuth: true } },
  { path: '/auth', name: 'Auth', component: () => import('../views/Auth.vue') }, // Auth page for login/register
  { path: '/profile', name: 'Profile', component: () => import('../views/Profile.vue'), meta: { requiresAuth: true } },
  { path: '/upload', name: 'AdoptionUpload', component: () => import('../views/AdoptionUpload.vue'), meta: { requiresAuth: true } },
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
    return { name: 'AdoptionCatalog' };
  } else if (to.name === 'Auth' && isAuthenticated) {
    return { name: 'AdoptionDashboard' };
  }
  
  return true;
});
