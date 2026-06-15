<template>
  <div class="admin-wrapper">
    <div class="header">
      <h1 class="title">{{ langStore.t('adminControl') }}</h1>
      <button @click="router.push({ name: 'Dashboard' })" class="btn-kembali">
        {{ langStore.t('back') }}
      </button>
    </div>

    <!-- Grid Menu Utama Admin -->
    <div class="admin-grid">

      <!-- Card 2: Manajemen User -->
      <div @click="activeTab = 'users'" class="admin-card" :class="{ 'active-card': activeTab === 'users' }">
        <div class="icon-box bg-blue">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>
        <h3>{{ langStore.t('manageUsers') }}</h3>
        <p>Suspend / Hapus User</p>
      </div>

      <!-- Card 3: Verifikasi Shelter -->
      <div @click="activeTab = 'adopt_shelters'" class="admin-card" :class="{ 'active-card': activeTab === 'adopt_shelters' }">
        <div class="icon-box bg-green">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        </div>
        <h3>Verifikasi Shelter</h3>
        <p>Kelola status shelter</p>
      </div>

      <!-- Card 4: Moderasi Hewan -->
      <div @click="activeTab = 'pets'" class="admin-card" :class="{ 'active-card': activeTab === 'pets' }">
        <div class="icon-box bg-purple">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        </div>
        <h3>Moderasi Hewan</h3>
        <p>Approve / Reject postingan</p>
      </div>

      <!-- Card 5: System Tools -->
      <div @click="activeTab = 'seeder'" class="admin-card" :class="{ 'active-card': activeTab === 'seeder' }">
        <div class="icon-box bg-yellow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
        </div>
        <h3>System Tools</h3>
        <p>Database Seeder</p>
      </div>
    </div>

    <!-- Kontainer Manajemen User -->
    <div v-if="activeTab === 'users'" class="table-container">
      <h3 class="section-title">{{ langStore.t('manageUsers') }}</h3>
      <div v-if="loadingUsers" class="loading-state">
        <SkeletonLoader v-for="i in 3" :key="i" height="40px" class="mb-2" />
      </div>
      <div v-else class="table-scroll">
        <table class="neo-table">
          <thead>
            <tr>
              <th>{{ langStore.t('idUser') }}</th>
              <th>{{ langStore.t('name') }}</th>
              <th>Email</th>
              <th>{{ langStore.t('role') }}</th>
              <th class="text-center">{{ langStore.t('action') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in userList" :key="user.uid">
              <td class="font-bold">{{ user.uid.substring(0,8) }}</td>
              <td class="text-gray">{{ user.fullname }}</td>
              <td>{{ user.email }}</td>
              <td><span class="badge" :class="user.role === 'admin' ? 'bg-orange' : user.role === 'shelter' ? 'bg-green' : 'bg-blue'">{{ user.role }}</span></td>
              <td class="action-cell">
                <button class="btn-delete" @click="deleteUser(user.uid)">{{ langStore.t('delete') }}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Kontainer Verifikasi Shelter -->
    <div v-if="activeTab === 'adopt_shelters'" class="table-container">
      <h3 class="section-title">Kelola Verifikasi Shelter</h3>
      <div v-if="loadingadopt_shelters" class="loading-state">
        <SkeletonLoader v-for="i in 3" :key="i" height="40px" class="mb-2" />
      </div>
      <div v-else-if="shelterList.length === 0" class="empty-module">
        Tidak ada shelter terdaftar saat ini.
      </div>
      <div v-else class="table-scroll">
        <table class="neo-table">
          <thead>
            <tr>
              <th>ID Shelter</th>
              <th>Nama Shelter</th>
              <th>Kota</th>
              <th>Status</th>
              <th class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="shelter in shelterList" :key="shelter.id">
              <td class="font-bold">#{{ shelter.id.substring(0,8).toUpperCase() }}</td>
              <td class="text-gray">{{ shelter.name }}</td>
              <td>{{ shelter.city }}</td>
              <td>
                <span class="badge" :class="shelter.status === 'Verified' ? 'bg-success' : shelter.status === 'Rejected' ? 'bg-red' : 'bg-orange'">
                  {{ shelter.status }}
                </span>
              </td>
              <td class="action-cell">
                <button class="btn-approve" @click="verifyShelter(shelter.id, 'Verified')">Verify</button>
                <button class="btn-delete" @click="verifyShelter(shelter.id, 'Rejected')">Reject</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Kontainer Moderasi Hewan Adopsi -->
    <div v-if="activeTab === 'pets'" class="table-container">
      <h3 class="section-title">Moderasi Hewan Adopsi</h3>
      <div v-if="loadingPets" class="loading-state">
        <SkeletonLoader v-for="i in 3" :key="i" height="60px" class="mb-2" />
      </div>
      <div v-else-if="petList.length === 0" class="empty-module">
        Tidak ada hewan terdaftar di katalog adopsi.
      </div>
      <div v-else class="table-scroll">
        <table class="neo-table">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nama</th>
              <th>Spesies/Ras</th>
              <th>Status</th>
              <th>Moderasi</th>
              <th class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pet in petList" :key="pet.id">
              <td>
                <img :src="pet.photo || getPetFallbackImage(pet.species || pet.type)" alt="Photo" class="w-12 h-12 object-cover rounded border-2 border-black" />
              </td>
              <td class="font-bold">{{ pet.name }}</td>
              <td class="text-gray">{{ pet.species }} / {{ pet.breed }}</td>
              <td><span class="badge">{{ pet.status }}</span></td>
              <td>
                <span class="badge" :class="pet.approvedByAdmin ? 'bg-success' : 'bg-orange'">
                  {{ pet.approvedByAdmin ? 'Approved' : 'Pending Review' }}
                </span>
              </td>
              <td class="action-cell">
                <button class="btn-approve" @click="moderatePet(pet.id, 'approve')" v-if="!pet.approvedByAdmin">Approve</button>
                <button class="btn-delete" @click="moderatePet(pet.id, 'reject')" v-if="pet.approvedByAdmin">Reject</button>
                <button class="btn-delete" @click="moderatePet(pet.id, 'deactivate')" v-if="pet.status !== 'Deactivated'">Deactivate</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Kontainer System Tools: Database Seeder -->
    <div v-if="activeTab === 'seeder'" class="table-container">
      <h3 class="section-title">System Tools: Database Seeder</h3>
      <p class="text-gray mt-4 mb-6">Menu khusus administrator untuk melakukan populating data dummy dalam database secara instan untuk kebutuhan simulasi aplikasi.</p>
      
      <div class="seeder-grid">
        <div class="seeder-card">
          <h4>Seed Users</h4>
          <p>Tanam 50 Adopter, 10 Shelter, dan 3 Admin Demo.</p>
          <button class="btn-seeder" @click="runSeed('users')">Seed Users</button>
        </div>

        <div class="seeder-card">
          <h4>Seed Adoption Pets</h4>
          <p>Tanam 100 hewan adopsi (50 kucing, 30 anjing, 10 kelinci, 5 burung, 5 hamster).</p>
          <button class="btn-seeder" @click="runSeed('pets')">Seed Pets</button>
        </div>

        <div class="seeder-card">
          <h4>Seed Adoption Requests</h4>
          <p>Tanam 200 pengajuan adopsi acak dengan status bervariasi.</p>
          <button class="btn-seeder" @click="runSeed('requests')">Seed Requests</button>
        </div>

        <div class="seeder-card">
          <h4>Seed Adopt Stories</h4>
          <p>Tanam 20 kisah adopsi sukses terverifikasi.</p>
          <button class="btn-seeder" @click="runSeed('stories')">Seed Adopt Stories</button>
        </div>

        <div class="seeder-card">
          <h4>Seed Adopt Notifications</h4>
          <p>Tanam 100 notifikasi pemberitahuan sistem (Adopsi).</p>
          <button class="btn-seeder" @click="runSeed('notifications')">Seed Adopt Notifs</button>
        </div>

        <div class="seeder-card card-full">
          <h4>Seed All System Data</h4>
          <p>Tanam seluruh data di atas secara berurutan dalam satu kali klik.</p>
          <button class="btn-seeder btn-seeder-all" @click="runSeed('all')">Seed All Data</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { getPetFallbackImage } from '../utils/helpers';
import { useLangStore } from '../stores/lang';
import SkeletonLoader from '../components/SkeletonLoader.vue';
import { 
  seedUsers, 
  seedAdoptionPets, 
  seedAdoptionRequests, 
  seedSuccessStories, 
  seedNotifications, 
  forceSeedDatabase
} from '../utils/seeder';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import jsPDF from 'jspdf';

const router = useRouter();
const langStore = useLangStore();
const activeTab = ref('users');
const userList = ref([]);
const shelterList = ref([]);
const petList = ref([]);
const loading = ref(false);
const loadingUsers = ref(false);
const loadingadopt_shelters = ref(false);
const loadingPets = ref(false);

onMounted(() => {
  fetchUsers();
});

watch(activeTab, (newTab) => {
  if (newTab === 'users' && userList.value.length === 0) {
    fetchUsers();
  }
  if (newTab === 'adopt_shelters') {
    fetchadopt_shelters();
  }
  if (newTab === 'pets') {
    fetchPets();
  }
});

const fetchUsers = async () => {
  loadingUsers.value = true;
  try {
    const snap = await getDocs(collection(db, 'adopt_users'));
    userList.value = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
  } catch (err) {
    console.error(err);
  } finally {
    loadingUsers.value = false;
  }
};

const deleteUser = async (uid) => {
  if(confirm('Anda yakin ingin menghapus user ini selamanya?')) {
    try {
      await deleteDoc(doc(db, 'adopt_users', uid));
      userList.value = userList.value.filter(u => u.uid !== uid);
    } catch (err) {
      alert('Gagal menghapus: ' + err.message);
    }
  }
};

// Shelter operations
const fetchadopt_shelters = async () => {
  loadingadopt_shelters.value = true;
  try {
    const snap = await getDocs(collection(db, 'adopt_shelters'));
    shelterList.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error(err);
  } finally {
    loadingadopt_shelters.value = false;
  }
};

const verifyShelter = async (id, newStatus) => {
  if (confirm(`Ubah status verifikasi shelter menjadi ${newStatus}?`)) {
    try {
      await updateDoc(doc(db, 'adopt_shelters', id), { status: newStatus });
      const shelter = shelterList.value.find(s => s.id === id);
      if (shelter) {
        shelter.status = newStatus;
        if (shelter.userId && newStatus === 'Verified') {
          await updateDoc(doc(db, 'adopt_users', shelter.userId), { role: 'shelter' });
        }
      }
      alert(`Shelter berhasil di-update menjadi ${newStatus}!`);
    } catch (err) {
      alert("Gagal memperbarui shelter: " + err.message);
    }
  }
};

// Pet moderation operations
const fetchPets = async () => {
  loadingPets.value = true;
  try {
    const snap = await getDocs(collection(db, 'adopt_pets'));
    petList.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error(err);
  } finally {
    loadingPets.value = false;
  }
};

const moderatePet = async (id, action) => {
  if (confirm(`Lakukan moderasi [${action}] pada anabul ini?`)) {
    try {
      if (action === 'approve') {
        await updateDoc(doc(db, 'adopt_pets', id), { approvedByAdmin: true });
        const pet = petList.value.find(p => p.id === id);
        if (pet) pet.approvedByAdmin = true;
      } else if (action === 'reject') {
        await updateDoc(doc(db, 'adopt_pets', id), { approvedByAdmin: false });
        const pet = petList.value.find(p => p.id === id);
        if (pet) pet.approvedByAdmin = false;
      } else if (action === 'deactivate') {
        await updateDoc(doc(db, 'adopt_pets', id), { status: 'Deactivated' });
        const pet = petList.value.find(p => p.id === id);
        if (pet) pet.status = 'Deactivated';
      }
      alert("Moderasi berhasil disimpan!");
    } catch (err) {
      alert("Gagal melakukan moderasi: " + err.message);
    }
  }
};

// Seeder logic

const runClearData = async () => {
  if(confirm('PERINGATAN! Anda yakin ingin menghapus SELURUH data seeding di semua koleksi? Aksi ini tidak dapat dibatalkan!')) {
    try {
      const res = await clearAllData();
      alert(res.message);
      fetchUsers();
      fetchadopt_shelters();
      fetchPets();
    } catch (err) {
      alert('Gagal menghapus data: ' + err.message);
    }
  }
};

const runSeed = async (type) => {
  let confirmed = false;
  if (type === 'all') {
    confirmed = confirm("Anda yakin ingin menanam seluruh data dummy? Proses ini membutuhkan waktu beberapa detik.");
  } else {
    confirmed = confirm(`Jalankan seeder untuk kategori [${type}]?`);
  }

  if (confirmed) {
    try {
      let res;
      if (type === 'users') res = await seedUsers(true);
      else if (type === 'pets') res = await seedAdoptionPets(true);
      else if (type === 'requests') res = await seedAdoptionRequests(true);
      else if (type === 'stories') res = await seedSuccessStories(true);
      else if (type === 'notifications') res = await seedNotifications(true);
      else if (type === 'all') res = await forceSeedDatabase();

      if (res && res.success) {
        alert(res.message);
      } else {
        alert(res?.message || 'Gagal menanam data.');
      }
    } catch (err) {
      alert("Gagal menanam data: " + err.message);
    }
  }
};

// END of AdminPanel logic
</script>

<style scoped>
.admin-wrapper {
  min-height: 100vh;
  background-color: var(--color-bg);
  padding: 2rem;
  font-family: 'Nunito', sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.title {
  font-family: 'Fredoka', sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-text-dark);
}

.btn-kembali {
  padding: 0.5rem 1.5rem;
  background-color: #FF8A65;
  color: #1A1A1A;
  font-weight: 800;
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-neo);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-kembali:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-neo-hover);
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.admin-card {
  background-color: var(--color-card-bg);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-neo);
  cursor: pointer;
  transition: all 0.2s;
  color: var(--color-text-dark);
}

.admin-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-neo-hover);
}

.admin-card.active-card {
  background-color: #000000;
  border-color: #FF8A65;
  color: #FFFFFF;
}
.admin-card.active-card p {
  color: #aaaaaa;
}

.icon-box {
  width: 48px;
  height: 48px;
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.bg-orange { background-color: #FF8A65; }
.bg-blue { background-color: #64B5F6; }
.bg-purple { background-color: #B39DDB; }
.bg-red { background-color: #FF5252; }
.bg-green { background-color: #4ADE80; }
.bg-yellow { background-color: #FFF176; }

.admin-card h3 {
  font-weight: 800;
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
}

.admin-card p {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-text);
}

.table-container {
  background-color: var(--color-card-bg);
  border: var(--border-width) solid var(--color-border);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: var(--shadow-neo);
}

.section-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-text-dark);
  margin-bottom: 1.5rem;
}

.table-scroll {
  overflow-x: auto;
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-lg);
}

.neo-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

.neo-table th {
  background-color: #B39DDB;
  border-bottom: var(--border-width) solid var(--color-border);
  border-right: var(--border-width) solid var(--color-border);
  padding: 1rem;
  font-weight: 800;
  color: #1A1A1A;
  text-align: left;
}

.neo-table th.text-center { text-align: center; }
.neo-table th:last-child { border-right: none; }

.neo-table td {
  padding: 1rem;
  border-bottom: var(--border-width) solid var(--color-border);
  border-right: var(--border-width) solid var(--color-border);
  background-color: var(--color-bg);
  color: var(--color-text-dark);
  vertical-align: middle;
}

.neo-table td:last-child { border-right: none; }
.neo-table tr:last-child td { border-bottom: none; }
.neo-table tr:hover td { background-color: var(--color-card-bg); }

.font-bold { font-weight: 800; color: var(--color-text-dark); }
.text-gray { font-weight: 700; color: var(--color-text); }

.badge {
  background-color: #FFF176;
  border: var(--border-width) solid var(--color-border);
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 800;
  color: #1A1A1A;
}

.bg-success { background-color: #4ADE80; }
.bg-red { background-color: #FF6B6B; color: white; }

.action-cell {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn-approve, .btn-delete, .btn-seeder {
  padding: 0.5rem 0.75rem;
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-md);
  font-weight: 800;
  font-size: 0.75rem;
  cursor: pointer;
  box-shadow: var(--shadow-neo-active);
  transition: all 0.2s;
}

.btn-approve { background-color: #4ADE80; color: #1A1A1A; }
.btn-delete { background-color: #FF6B6B; color: white; }

.btn-approve:active, .btn-delete:active, .btn-seeder:active {
  transform: translateY(1px);
  box-shadow: none;
}

.empty-module {
  text-align: center;
  padding: 3rem;
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  background-color: #1a1a1a;
  font-weight: 700;
  color: #aaaaaa;
}

/* Seeder Styles */
.seeder-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.seeder-card {
  background-color: #1a1a1a;
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-neo);
  color: #ffffff;
}

.seeder-card h4 {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: #FFF176;
}

.seeder-card p {
  font-size: 0.875rem;
  font-weight: 600;
  color: #aaaaaa;
  margin-bottom: 1.5rem;
  flex: 1;
}

.btn-seeder {
  background-color: #B39DDB;
  color: #1A1A1A;
  width: 100%;
  text-align: center;
  padding: 0.75rem;
  font-size: 0.9rem;
}

.card-full {
  grid-column: 1 / -1;
  background-color: #2e1a47;
  border-color: #B39DDB;
}

.btn-seeder-all {
  background-color: #4ADE80;
  font-size: 1rem;
  padding: 1rem;
}

@media (max-width: 768px) {
  .admin-wrapper { padding: 1rem; }
  .title { font-size: 2rem; }
  .table-container { padding: 1rem; }
  .seeder-grid { grid-template-columns: 1fr; }
}
</style>
