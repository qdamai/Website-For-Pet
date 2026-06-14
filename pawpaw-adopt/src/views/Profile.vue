<template>
  <div class="profile-container">
    <h1 class="page-title">{{ langStore.t('profile') }}</h1>
    
    <div class="profile-layout">
      <!-- Sidebar / User Info Card -->
      <div class="profile-card sidebar">
        <div class="avatar-wrapper">
          <img :src="profile?.profilePhoto || `https://api.dicebear.com/7.x/notionists/svg?seed=${profile?.fullname || 'pawpaw'}`" alt="Profile" class="avatar-img">
        </div>
        <h2 class="user-name">{{ profile?.fullname || 'Pengguna' }}</h2>
        <p class="user-meta">{{ profile?.email }}</p>
        
        <!-- Badges (Cleaned of Emojis) -->
        <div class="badges-container">
          <span class="badge badge-hero" title="Telah membantu menemukan hewan">Pahlawan Bulu Pemula</span>
          <span class="badge badge-radar" title="Sering mengecek radar map">Radar Berjalan</span>
        </div>
        
        <div class="bio-box">
          <p><b>{{ langStore.t('bio') }}:</b> {{ profile?.bio || 'Penyayang binatang sejati.' }}</p>
          <p><b>{{ langStore.t('domicile') }}:</b> {{ profile?.location || 'Tidak diketahui' }}</p>
          <p><b>{{ langStore.t('phone') }}:</b> {{ profile?.phone || 'Tidak dicantumkan' }}</p>
        </div>
        
        <button class="btn-neo btn-full" @click="toggleEditForm">
          {{ isEditing ? langStore.t('back') : langStore.t('editProfile') }}
        </button>
      </div>

      <!-- Main Content / Edit Form or Tabs -->
      <div class="profile-card main-content">
        
        <!-- Edit Profile Form -->
        <div v-if="isEditing" class="edit-form-wrapper">
          <h2 class="section-title">{{ langStore.t('editProfile') }}</h2>
          <form @submit.prevent="saveProfile" class="flex flex-col gap-4">
            <div class="form-group">
              <label class="font-bold">{{ langStore.t('fullname') }}</label>
              <input v-model="editData.fullname" type="text" class="neo-input" required>
            </div>
            
            <div class="form-group">
              <label class="font-bold">{{ langStore.t('bio') }}</label>
              <textarea v-model="editData.bio" class="neo-input" rows="3"></textarea>
            </div>

            <div class="form-group">
              <label class="font-bold">{{ langStore.t('domicile') }}</label>
              <input v-model="editData.location" type="text" class="neo-input">
            </div>

            <div class="form-group">
              <label class="font-bold">{{ langStore.t('phone') }}</label>
              <input v-model="editData.phone" type="text" class="neo-input">
            </div>

            <!-- Upload Photo -->
            <div class="form-group">
              <label class="font-bold">{{ langStore.t('changePhoto') }}</label>
              <input type="file" @change="handleAvatarChange" accept="image/*" class="neo-input">
              <div v-if="avatarPreview" class="avatar-preview-wrapper mt-3">
                <img :src="avatarPreview" alt="Avatar Preview" class="avatar-preview-img">
              </div>
            </div>

            <div v-if="successMsg" class="success-msg">{{ successMsg }}</div>
            <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>

            <button type="submit" class="btn-neo" :disabled="saving">
              {{ saving ? langStore.t('loading') : langStore.t('save') }}
            </button>
          </form>
        </div>

        <!-- Default Profile Tabs -->
        <div v-else>
          <div class="tabs-header">
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'reports' }" 
              @click="activeTab = 'reports'"
            >{{ langStore.t('myReports') }}</button>
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'discussions' }" 
              @click="activeTab = 'discussions'"
            >{{ langStore.t('discussions') }}</button>
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'bookmarks' }" 
              @click="activeTab = 'bookmarks'"
            >{{ langStore.t('bookmarks') }}</button>
          </div>

          <div class="tab-content">
            <!-- TAB 1: Laporan Saya -->
            <div v-if="activeTab === 'reports'">
              <div v-if="loadingReports" class="loading-state">
                <SkeletonLoader height="80px" v-for="i in 3" :key="i" />
              </div>
              <div v-else-if="myReports.length === 0">
                <EmptyState title="Belum Ada Laporan" description="Anda belum membuat laporan hewan hilang atau ditemukan." />
              </div>
              <div v-else class="list-container">
                <div v-for="rep in myReports" :key="rep.id" class="list-item" @click="goToDetail(rep)">
                  <div class="item-info">
                    <h4 class="item-title">Pengajuan Adopsi</h4>
                    <p class="item-meta">{{ rep.date }}</p>
                  </div>
                  <div class="item-actions">
                    <span class="status-badge bg-orange">
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
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useLangStore } from '../stores/lang';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import SkeletonLoader from '../components/SkeletonLoader.vue';
import EmptyState from '../components/EmptyState.vue';

const router = useRouter();
const authStore = useAuthStore();
const langStore = useLangStore();

const profile = ref(authStore.profile);
const myReports = ref([]);
const loadingReports = ref(true);
const activeTab = ref('reports');

// Edit profile fields
const isEditing = ref(false);
const saving = ref(false);
const successMsg = ref('');
const errorMsg = ref('');
const selectedAvatarFile = ref(null);
const avatarPreview = ref(null);

const editData = reactive({
  fullname: '',
  bio: '',
  location: '',
  phone: ''
});

onMounted(async () => {
  if (authStore.user) {
    await fetchReports();
  }
});

const toggleEditForm = () => {
  isEditing.value = !isEditing.value;
  if (isEditing.value) {
    editData.fullname = profile.value?.fullname || '';
    editData.bio = profile.value?.bio || '';
    editData.location = profile.value?.location || '';
    editData.phone = profile.value?.phone || '';
    avatarPreview.value = null;
    selectedAvatarFile.value = null;
    successMsg.value = '';
    errorMsg.value = '';
  }
};

const handleAvatarChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedAvatarFile.value = file;
    avatarPreview.value = URL.createObjectURL(file);
  }
};

const saveProfile = async () => {
  saving.value = true;
  successMsg.value = '';
  errorMsg.value = '';

  try {
    let finalPhotoUrl = profile.value?.profilePhoto || '';

    // If a new avatar file was selected, upload it to Firebase Storage
    if (selectedAvatarFile.value) {
      const avatarRef = storageRef(storage, `users/${authStore.user.uid}/avatar`);
      await uploadBytes(avatarRef, selectedAvatarFile.value);
      finalPhotoUrl = await getDownloadURL(avatarRef);
    }

    const userDocRef = doc(db, 'adopt_users', authStore.user.uid);
    const updatedProfile = {
      ...profile.value,
      fullname: editData.fullname,
      bio: editData.bio,
      location: editData.location,
      phone: editData.phone,
      profilePhoto: finalPhotoUrl
    };

    await setDoc(userDocRef, updatedProfile);
    
    // Update local profile
    await authStore.fetchProfile(authStore.user.uid);
    profile.value = authStore.profile;
    
    successMsg.value = 'Profil berhasil disimpan!';
    setTimeout(() => {
      isEditing.value = false;
    }, 1000);
  } catch (err) {
    console.error("Gagal menyimpan profil:", err);
    errorMsg.value = 'Gagal menyimpan profil: ' + err.message;
  } finally {
    saving.value = false;
  }
};

const fetchReports = async () => {
  loadingReports.value = true;
  try {
    const qReq = query(collection(db, 'adopt_requests'), where('adopterId', '==', authStore.user.uid));
    const snap = await getDocs(qReq);
    
    myReports.value = snap.docs.map(d => {
      const data = d.data();
      return { id: d.id, ...data, date: data.createdAt ? data.createdAt.toDate().toLocaleDateString() : 'Baru' };
    }).sort((a, b) => {
      return (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0);
    });
  } catch (error) {
    console.error("Failed fetching reports", error);
  } finally {
    loadingReports.value = false;
  }
};

const goToDetail = (rep) => {
  // Can navigate to dashboard or request detail if we had one
  router.push({ name: 'AdoptionDashboard' });
};
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Nunito', sans-serif;
  min-height: 100vh;
  background-color: var(--color-bg);
}

.page-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  color: #FFFFFF;
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
  .sidebar { width: 35%; position: sticky; top: 80px; }
  .main-content { width: 65%; }
}

.profile-card {
  background-color: var(--color-card-bg);
  border: var(--border-width) solid var(--color-border);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: var(--shadow-neo);
  margin-bottom: 2rem;
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
  border: var(--border-width) solid var(--color-border);
  object-fit: cover;
  box-shadow: var(--shadow-neo);
  background-color: #1A1A1A;
}

.user-name {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.8rem;
  font-weight: 800;
  text-align: center;
  margin: 0 0 0.25rem 0;
  color: #FFFFFF;
}

.user-meta {
  text-align: center;
  color: #aaaaaa;
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
  border: var(--border-width) solid var(--color-border);
  white-space: nowrap;
}

.badge-hero { background-color: #FFD54F; color: #1A1A1A; }
.badge-radar { background-color: #4DD0E1; color: #1A1A1A; }

.bio-box {
  background-color: #1A1A1A;
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.bio-box p { margin: 0 0 0.5rem 0; font-weight: 600; color: #dddddd; }
.bio-box p:last-child { margin: 0; }

.btn-neo {
  font-family: 'Fredoka', sans-serif;
  font-weight: 800;
  padding: 0.75rem 1.5rem;
  background-color: #FF8A65;
  color: #1A1A1A;
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-neo);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.btn-neo:active {
  transform: translateY(1px);
  box-shadow: none;
}

.btn-full { width: 100%; }

/* TABS */
.tabs-header {
  display: flex;
  border-bottom: var(--border-width) solid var(--color-border);
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
  border-right: var(--border-width) solid var(--color-border);
  cursor: pointer;
  color: #aaaaaa;
  white-space: nowrap;
  transition: all 0.2s;
}

.tab-btn:last-child { border-right: none; }
.tab-btn:hover { background-color: #1A1A1A; }

.tab-btn.active {
  background-color: var(--color-primary);
  color: #1A1A1A;
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
  background-color: #1A1A1A;
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: 3px 3px 0px 0px #000000;
  cursor: pointer;
  transition: all 0.2s;
}

.list-item:hover {
  transform: translateY(-4px);
  box-shadow: 5px 5px 0px 0px #000000;
}

.item-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.2rem;
  font-weight: 800;
  margin: 0 0 0.25rem 0;
  color: #FFFFFF;
}

.item-meta {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: #aaaaaa;
}

.status-badge {
  font-size: 0.85rem;
  font-weight: 800;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-lg);
  border: var(--border-width) solid var(--color-border);
}

.bg-orange { background-color: #FF8A65; color: #1A1A1A; }
.bg-green { background-color: #4ADE80; color: #1A1A1A; }

/* EDIT FORM STYLES */
.edit-form-wrapper {
  color: #FFFFFF;
}

.section-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.8rem;
  font-weight: 800;
  color: #FFFFFF;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.avatar-preview-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: var(--border-width) solid var(--color-border);
  object-fit: cover;
  box-shadow: 3px 3px 0px 0px #000000;
}

.success-msg {
  background-color: #A7F3D0;
  color: #065F46;
  padding: 0.75rem;
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-lg);
  font-weight: bold;
}

.error-msg {
  background-color: #FECACA;
  color: #991B1B;
  padding: 0.75rem;
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-lg);
  font-weight: bold;
}
</style>
