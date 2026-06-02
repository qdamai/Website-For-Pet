<template>
  <div class="dashboard-wrapper">
    
    <!-- Header -->
    <div class="dashboard-header">
      <div>
        <h1 class="header-title">Halo, {{ authStore.profile?.fullname || 'Pawpawer' }}!</h1>
        <p class="header-subtitle">Selamat datang di Pawpaw Finder.</p>
      </div>
      <div class="header-actions">
        <button v-if="authStore.isAdmin" class="btn-admin" @click="router.push({ name: 'AdminPanel' })">
          Admin Panel
        </button>
        <button class="btn-logout" @click="handleLogout">
          Keluar
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card bg-yellow">
        <h3 class="stat-number">124</h3>
        <p class="stat-label">Laporan Aktif</p>
      </div>
      <div class="stat-card bg-green">
        <h3 class="stat-number">87</h3>
        <p class="stat-label">Berhasil Diselamatkan</p>
      </div>
      <div class="stat-card bg-purple">
        <h3 class="stat-number">70%</h3>
        <p class="stat-label">Tingkat Keberhasilan</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <h2 class="section-title">Aksi Cepat</h2>
    <div class="actions-grid">
      
      <div class="action-card" @click="router.push({ name: 'ReportForm', query: { type: 'lost' } })">
        <div class="icon-circle bg-orange">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
        <h3 class="action-title">Lapor Hewan Hilang</h3>
      </div>
      
      <div class="action-card" @click="router.push({ name: 'ReportForm', query: { type: 'found' } })">
        <div class="icon-circle bg-green">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <h3 class="action-title">Lapor Hewan Ditemukan</h3>
      </div>

      <div class="action-card" @click="router.push({ name: 'Explore' })">
        <div class="icon-circle bg-purple">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        </div>
        <h3 class="action-title">Eksplorasi Katalog</h3>
      </div>

      <div class="action-card" @click="router.push({ name: 'PetRadarMap' })">
        <div class="icon-circle bg-yellow">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="18"></line><line x1="15" y1="6" x2="15" y2="21"></line></svg>
        </div>
        <h3 class="action-title">Radar Peta (Live)</h3>
      </div>

      <!-- NEW: Bantuan Cepat -->
      <div class="action-card" @click="startAdminChat">
        <div class="icon-circle bg-blue">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </div>
        <h3 class="action-title">Bantuan Cepat (Chat Admin)</h3>
      </div>

    </div>

    <!-- Deep Link Gateway -->
    <div class="adoption-banner bg-blue">
      <h3 class="banner-title">Ingin Mengadopsi Teman Baru?</h3>
      <p class="banner-subtitle">Kunjungi portal adopsi resmi kami untuk menemukan anabul impianmu.</p>
      <a href="https://example.com/pawpaw-adopt" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
        <button class="btn-adopt">Buka Pawpaw Adopt</button>
      </a>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = async () => {
  await authStore.logout();
  router.push({ name: 'Splash' });
};

const startAdminChat = async () => {
  if (!authStore.user) return;
  
  // Admin UID placeholder or specific ID. 
  // In a real app, query for an admin user. For now, we'll use a virtual 'admin_support' ID.
  const adminId = 'admin_support_pawpaw';
  const chatId = `support_${authStore.user.uid}`;
  
  const chatRef = doc(db, 'chats', chatId);
  const snap = await getDoc(chatRef);
  
  if (!snap.exists()) {
    await setDoc(chatRef, {
      chatId,
      participants: [authStore.user.uid, adminId],
      lastMessage: 'Memulai sesi bantuan...',
      updatedAt: serverTimestamp(),
      isAdminChat: true
    });
  }
  
  router.push({ name: 'LiveChat', query: { room: chatId } });
};
</script>

<style scoped>
.dashboard-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Nunito', sans-serif;
  background-color: var(--color-bg, #FFFDF9);
  min-height: 100vh;
}

/* Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.header-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  color: #1A1A1A;
  margin: 0 0 0.25rem 0;
}

.header-subtitle {
  font-size: 1.125rem;
  font-weight: 700;
  color: #555;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn-admin, .btn-logout, .btn-adopt {
  font-family: 'Fredoka', 'Nunito', sans-serif;
  font-weight: 800;
  padding: 0.75rem 1.5rem;
  border: 3px solid #1A1A1A;
  border-radius: 12px;
  box-shadow: 4px 4px 0px 0px #1A1A1A;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.btn-admin { background-color: #64B5F6; color: #1A1A1A; }
.btn-logout { background-color: #FF6B6B; color: white; }
.btn-adopt { background-color: #FFFDF9; color: #1A1A1A; font-size: 1.25rem; padding: 1rem 2rem; }

.btn-admin:hover, .btn-logout:hover, .btn-adopt:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px 0px #1A1A1A;
}

.btn-admin:active, .btn-logout:active, .btn-adopt:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

/* Grids */
.stats-grid, .actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

/* Stat Cards */
.stat-card {
  border: 4px solid #1A1A1A;
  border-radius: 9999px; /* Pill shape */
  padding: 2.5rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 6px 6px 0px 0px #1A1A1A;
  text-align: center;
}

.stat-number {
  font-family: 'Fredoka', sans-serif;
  font-size: 3rem;
  font-weight: 800;
  color: #1A1A1A;
  margin: 0 0 0.5rem 0;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #1A1A1A;
  margin: 0;
}

/* Section Title */
.section-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  color: #1A1A1A;
  margin-bottom: 1.5rem;
}

/* Action Cards */
.action-card {
  background-color: #FFFDF9;
  border: 4px solid #1A1A1A;
  border-radius: 24px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 6px 6px 0px 0px #1A1A1A;
  cursor: pointer;
  transition: all 0.2s;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 6px 10px 0px 0px #1A1A1A;
}

.icon-circle {
  width: 72px;
  height: 72px;
  border: 4px solid #1A1A1A;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  box-shadow: 4px 4px 0px 0px #1A1A1A;
}

.action-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #1A1A1A;
  margin: 0;
}

/* Banner */
.adoption-banner {
  border: 4px solid #1A1A1A;
  border-radius: 32px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 8px 8px 0px 0px #1A1A1A;
  margin-top: 1rem;
}

.banner-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 2.25rem;
  font-weight: 800;
  color: #1A1A1A;
  margin: 0 0 1rem 0;
}

.banner-subtitle {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1A1A1A;
  margin: 0 0 2rem 0;
}

/* Colors */
.bg-yellow { background-color: #FFF176; }
.bg-green { background-color: #4ADE80; }
.bg-purple { background-color: #B39DDB; }
.bg-orange { background-color: #FF8A65; }
.bg-blue { background-color: #64B5F6; }

@media (max-width: 768px) {
  .dashboard-wrapper { padding: 1rem; }
  .dashboard-header { flex-direction: column; align-items: flex-start; }
  .stat-card { border-radius: 24px; }
  .stats-grid, .actions-grid { grid-template-columns: 1fr; }
}
</style>
