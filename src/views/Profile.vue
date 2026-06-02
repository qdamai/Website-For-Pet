<template>
  <div class="profile-container">
    <h1 class="page-title">Profil Komunitas</h1>
    
    <div class="profile-layout">
      <!-- Sidebar / User Info -->
      <div class="profile-card sidebar">
        <div class="avatar-wrapper">
          <img :src="profile?.profilePhoto || 'https://api.dicebear.com/7.x/notionists/svg?seed=pawpaw'" alt="Profile" class="avatar-img">
        </div>
        <h2 class="user-name">{{ profile?.fullname || 'Pengguna' }}</h2>
        <p class="user-meta">{{ profile?.email }}</p>
        
        <!-- Badges -->
        <div class="badges-container">
          <span class="badge badge-hero" title="Telah membantu menemukan 1 hewan">Pahlawan Bulu Pemula 🥉</span>
          <span class="badge badge-radar" title="Sering mengecek radar map">Radar Berjalan 📡</span>
        </div>
        
        <div class="bio-box">
          <p><b>Bio:</b> {{ profile?.bio || 'Penyayang binatang sejati.' }}</p>
          <p><b>Lokasi:</b> {{ profile?.location || 'Tidak diketahui' }}</p>
          <p><b>Bergabung:</b> {{ new Date(profile?.createdAt?.toMillis?.() || Date.now()).toLocaleDateString('id-ID') }}</p>
        </div>
        
        <button class="btn-neo btn-full">Edit Profil</button>
      </div>

      <!-- Main Content / Tabs -->
      <div class="profile-card main-content">
        
        <div class="tabs-header">
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'reports' }" 
            @click="activeTab = 'reports'"
          >Laporan Saya</button>
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'discussions' }" 
            @click="activeTab = 'discussions'"
          >Diskusi</button>
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'bookmarks' }" 
            @click="activeTab = 'bookmarks'"
          >Bookmark</button>
        </div>

        <div class="tab-content">
          <!-- TAB 1: Laporan Saya -->
          <div v-if="activeTab === 'reports'">
            <div v-if="loading" class="loading-state">
              <SkeletonLoader height="80px" v-for="i in 3" :key="i" />
            </div>
            <div v-else-if="myReports.length === 0">
              <EmptyState title="Belum Ada Laporan" description="Anda belum membuat laporan hewan hilang atau ditemukan." />
            </div>
            <div v-else class="list-container">
              <div v-for="rep in myReports" :key="rep.id" class="list-item">
                <div class="item-info">
                  <h4 class="item-title">{{ rep.name || 'Laporan Penemuan' }}</h4>
                  <p class="item-meta">{{ rep.date }} • {{ rep.type }}</p>
                </div>
                <div class="item-actions">
                  <span class="status-badge" :class="rep.isLost ? 'bg-orange' : 'bg-green'">
                    {{ rep.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 2: Diskusi Komunitas -->
          <div v-if="activeTab === 'discussions'">
            <EmptyState title="Belum Ada Diskusi" description="Anda belum pernah memberikan komentar pada laporan manapun." />
          </div>

          <!-- TAB 3: Bookmark -->
          <div v-if="activeTab === 'bookmarks'">
            <EmptyState title="Bookmark Kosong" description="Laporan yang Anda simpan akan muncul di sini." />
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import SkeletonLoader from '../components/SkeletonLoader.vue';
import EmptyState from '../components/EmptyState.vue';

const authStore = useAuthStore();
const profile = ref(authStore.profile);
const myReports = ref([]);
const loading = ref(true);
const activeTab = ref('reports');

onMounted(async () => {
  if (authStore.user) {
    await fetchReports();
  }
});

const fetchReports = async () => {
  loading.value = true;
  try {
    const lostQ = query(collection(db, 'lost_pets'), where('userId', '==', authStore.user.uid));
    const foundQ = query(collection(db, 'found_pets'), where('userId', '==', authStore.user.uid));
    
    const [lostSnap, foundSnap] = await Promise.all([getDocs(lostQ), getDocs(foundQ)]);
    
    const lost = lostSnap.docs.map(d => {
      const data = d.data();
      return { id: d.id, ...data, isLost: true, date: data.lostDate };
    });
    
    const found = foundSnap.docs.map(d => {
      const data = d.data();
      return { id: d.id, ...data, isLost: false, date: data.foundDate };
    });
    
    myReports.value = [...lost, ...found].sort((a, b) => {
      return (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0);
    });
  } catch (error) {
    console.error("Failed fetching reports", error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Nunito', sans-serif;
  min-height: 100vh;
}

.page-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  color: #1A1A1A;
  margin-bottom: 2rem;
}

.profile-layout {
  display: flex;
  gap: 2rem;
  flex-direction: column;
}

@media (min-width: 768px) {
  .profile-layout {
    flex-direction: row;
    align-items: flex-start;
  }
  .sidebar { width: 35%; position: sticky; top: 2rem; }
  .main-content { width: 65%; }
}

.profile-card {
  background-color: #FFFDF9;
  border: 4px solid #1A1A1A;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 8px 8px 0px 0px #1A1A1A;
}

.avatar-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.avatar-img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 4px solid #1A1A1A;
  object-fit: cover;
  box-shadow: 4px 4px 0px 0px #1A1A1A;
  background-color: #f3f4f6;
}

.user-name {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.8rem;
  font-weight: 800;
  text-align: center;
  margin: 0 0 0.25rem 0;
}

.user-meta {
  text-align: center;
  color: #555;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.badges-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.badge {
  font-size: 0.8rem;
  font-weight: 800;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  border: 2px solid #1A1A1A;
  white-space: nowrap;
}

.badge-hero { background-color: #FFD54F; color: #1A1A1A; }
.badge-radar { background-color: #4DD0E1; color: #1A1A1A; }

.bio-box {
  background-color: #F3E5F5;
  border: 3px solid #1A1A1A;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.bio-box p { margin: 0 0 0.5rem 0; font-weight: 600; color: #333; }
.bio-box p:last-child { margin: 0; }

.btn-neo {
  font-family: 'Fredoka', sans-serif;
  font-weight: 800;
  padding: 0.75rem 1.5rem;
  background-color: #FF8A65;
  color: #FFFDF9;
  border: 3px solid #1A1A1A;
  border-radius: 12px;
  box-shadow: 4px 4px 0px 0px #1A1A1A;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.btn-neo:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.btn-full { width: 100%; }

/* TABS */
.tabs-header {
  display: flex;
  border-bottom: 4px solid #1A1A1A;
  margin-bottom: 2rem;
  overflow-x: auto;
}

.tab-btn {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.2rem;
  font-weight: 800;
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  border-right: 4px solid #1A1A1A;
  cursor: pointer;
  color: #555;
  white-space: nowrap;
  transition: all 0.2s;
}

.tab-btn:last-child { border-right: none; }
.tab-btn:hover { background-color: #f3f4f6; }

.tab-btn.active {
  background-color: #1A1A1A;
  color: #FFFDF9;
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background-color: white;
  border: 3px solid #1A1A1A;
  border-radius: 16px;
  box-shadow: 4px 4px 0px 0px #1A1A1A;
}

.item-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.2rem;
  font-weight: 800;
  margin: 0 0 0.25rem 0;
  color: #1A1A1A;
}

.item-meta {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: #666;
}

.status-badge {
  font-size: 0.85rem;
  font-weight: 800;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  border: 2px solid #1A1A1A;
}

.bg-orange { background-color: #FF8A65; color: #FFFDF9; }
.bg-green { background-color: #4ADE80; color: #1A1A1A; }
</style>
