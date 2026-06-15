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
      
      <!-- Card 1: Verifikasi Laporan -->
      <div @click="activeTab = 'reports'" class="admin-card" :class="{ 'active-card': activeTab === 'reports' }">
        <div class="icon-box bg-orange">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
        </div>
        <h3>{{ langStore.t('verifyReports') }}</h3>
        <p>Kelola laporan masuk</p>
      </div>

      <!-- Card 2: Manajemen User -->
      <div @click="activeTab = 'users'" class="admin-card" :class="{ 'active-card': activeTab === 'users' }">
        <div class="icon-box bg-blue">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>
        <h3>{{ langStore.t('manageUsers') }}</h3>
        <p>Suspend / Hapus User</p>
      </div>

      <!-- Card 3: Verifikasi Shelter -->
      <div @click="activeTab = 'shelters'" class="admin-card" :class="{ 'active-card': activeTab === 'shelters' }">
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

      <!-- Card 6: Export Rekapitulasi -->
      <div @click="exportData" class="admin-card">
        <div class="icon-box bg-red">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        </div>
        <h3>{{ langStore.t('exportSummary') }}</h3>
        <p>Download data PDF</p>
      </div>

    </div>

    <!-- Kontainer Tabel Laporan Tertunda -->
    <div v-if="activeTab === 'reports'" class="table-container">
      <h3 class="section-title">{{ langStore.t('pendingReports') }}</h3>
      
      <div v-if="loading" class="text-center font-bold">{{ langStore.t('loadingReports') }}</div>
      <div v-else-if="pendingReports.length === 0" class="empty-module">
        {{ langStore.t('noPendingReports') }}
      </div>
      
      <div v-else class="table-scroll">
        <table class="neo-table">
          <thead>
            <tr>
              <th>{{ langStore.t('idReport') }}</th>
              <th>{{ langStore.t('type') }}</th>
              <th>{{ langStore.t('color') }}</th>
              <th>{{ langStore.t('status') }}</th>
              <th class="text-center">{{ langStore.t('action') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rep in pendingReports" :key="rep.id">
              <td class="font-bold">#{{ rep.id.substring(0,8).toUpperCase() }}</td>
              <td class="text-gray">{{ rep.type }} Ditemukan</td>
              <td>{{ rep.color }}</td>
              <td><span class="badge">{{ rep.status }}</span></td>
              <td class="action-cell">
                <button class="btn-approve" @click="approveReport(rep.id)">{{ langStore.t('approve') }}</button>
                <button class="btn-delete" @click="deleteReport(rep.id)">{{ langStore.t('delete') }}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Kontainer Manajemen User -->
    <div v-if="activeTab === 'users'" class="table-container">
      <h3 class="section-title">{{ langStore.t('manageUsers') }}</h3>
      <div v-if="loadingUsers" class="text-center font-bold">{{ langStore.t('loadingUsers') }}</div>
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
    <div v-if="activeTab === 'shelters'" class="table-container">
      <h3 class="section-title">Kelola Verifikasi Shelter</h3>
      <div v-if="loadingShelters" class="text-center font-bold">Memproses data shelter...</div>
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
      <div v-if="loadingPets" class="text-center font-bold">Memuat data hewan...</div>
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
      <p class="text-gray mb-6">Menu khusus administrator untuk mengatur data simulasi sistem Pawpaw Finder secara instan.</p>
      
      <div class="seeder-single-container">
        <div class="seeder-card card-full">
          <h4>Reset &amp; Seed Database</h4>
          <p class="mb-4">Membersihkan seluruh data lama (hewan adopsi, request, notifikasi, janji temu, dll) dan menanam ulang 20 data anabul baru secara otomatis dengan deskripsi dinamis dan unik.</p>
          <button class="btn-seeder btn-seeder-all" @click="runResetAndSeed" :disabled="loadingSeed">
            {{ loadingSeed ? '⏳ Memproses...' : '🔄 Hapus &amp; Seed Data Baru' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getPetFallbackImage } from '../utils/helpers';
import { useLangStore } from '../stores/lang';
import { 
  resetAndSeedAllData 
} from '../utils/seeder';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import jsPDF from 'jspdf';

const router = useRouter();
const langStore = useLangStore();
const activeTab = ref('reports');
const pendingReports = ref([]);
const userList = ref([]);
const shelterList = ref([]);
const petList = ref([]);
const loading = ref(false);
const loadingUsers = ref(false);
const loadingShelters = ref(false);
const loadingPets = ref(false);
const loadingSeed = ref(false);

onMounted(() => {
  fetchPendingReports();
});

watch(activeTab, (newTab) => {
  if (newTab === 'users' && userList.value.length === 0) {
    fetchUsers();
  }
  if (newTab === 'shelters') {
    fetchShelters();
  }
  if (newTab === 'pets') {
    fetchPets();
  }
});

const fetchPendingReports = async () => {
  loading.value = true;
  try {
    const q = query(collection(db, 'found_pets'), where('status', '==', 'Pending Match'));
    const snap = await getDocs(q);
    pendingReports.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const approveReport = async (id) => {
  if(confirm('Setujui laporan ini agar tampil publik secara resmi?')) {
    try {
      await updateDoc(doc(db, 'found_pets', id), { status: 'Verified' });
      pendingReports.value = pendingReports.value.filter(r => r.id !== id);
    } catch (err) {
      alert('Gagal menyetujui: ' + err.message);
    }
  }
};

const deleteReport = async (id) => {
  if(confirm('Anda yakin ingin menghapus laporan spam/palsu ini?')) {
    try {
      await deleteDoc(doc(db, 'found_pets', id));
      pendingReports.value = pendingReports.value.filter(r => r.id !== id);
    } catch (err) {
      alert('Gagal menghapus: ' + err.message);
    }
  }
};

const fetchUsers = async () => {
  loadingUsers.value = true;
  try {
    const snap = await getDocs(collection(db, 'users'));
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
      await deleteDoc(doc(db, 'users', uid));
      userList.value = userList.value.filter(u => u.uid !== uid);
    } catch (err) {
      alert('Gagal menghapus: ' + err.message);
    }
  }
};

// Shelter operations
const fetchShelters = async () => {
  loadingShelters.value = true;
  try {
    const snap = await getDocs(collection(db, 'shelters'));
    shelterList.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error(err);
  } finally {
    loadingShelters.value = false;
  }
};

const verifyShelter = async (id, newStatus) => {
  if (confirm(`Ubah status verifikasi shelter menjadi ${newStatus}?`)) {
    try {
      await updateDoc(doc(db, 'shelters', id), { status: newStatus });
      const shelter = shelterList.value.find(s => s.id === id);
      if (shelter) {
        shelter.status = newStatus;
        if (shelter.userId && newStatus === 'Verified') {
          await updateDoc(doc(db, 'users', shelter.userId), { role: 'shelter' });
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
    const snap = await getDocs(collection(db, 'adoption_pets'));
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
        await updateDoc(doc(db, 'adoption_pets', id), { approvedByAdmin: true });
        const pet = petList.value.find(p => p.id === id);
        if (pet) pet.approvedByAdmin = true;
      } else if (action === 'reject') {
        await updateDoc(doc(db, 'adoption_pets', id), { approvedByAdmin: false });
        const pet = petList.value.find(p => p.id === id);
        if (pet) pet.approvedByAdmin = false;
      } else if (action === 'deactivate') {
        await updateDoc(doc(db, 'adoption_pets', id), { status: 'Deactivated' });
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
const runResetAndSeed = async () => {
  const confirmed = confirm("Anda yakin ingin menghapus seluruh data lama dan menanam ulang data dummy baru? Proses ini membutuhkan waktu beberapa detik.");
  if (confirmed) {
    loadingSeed.value = true;
    try {
      const res = await resetAndSeedAllData();
      if (res.success) {
        alert("Berhasil membersihkan database dan menanam ulang 20 data dummy baru!");
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert("Gagal melakukan reset dan seed: " + err.message);
    } finally {
      loadingSeed.value = false;
    }
  }
};

const exportData = async () => {
  try {
    const lostSnap = await getDocs(collection(db, 'lost_pets'));
    const foundSnap = await getDocs(collection(db, 'found_pets'));
    
    const docPdf = new jsPDF();
    
    docPdf.setFillColor(18, 18, 18);
    docPdf.rect(0, 0, 210, 297, 'F');
    
    docPdf.setTextColor(255, 255, 255);
    docPdf.setFont("helvetica", "bold");
    docPdf.setFontSize(18);
    docPdf.text("LAPORAN REKAPITULASI DATA PAWPAW FINDER", 15, 20);
    
    docPdf.setTextColor(170, 170, 170);
    docPdf.setFont("helvetica", "normal");
    docPdf.setFontSize(10);
    docPdf.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 15, 27);
    
    docPdf.setDrawColor(0, 0, 0);
    docPdf.setFillColor(38, 38, 38);
    docPdf.rect(15, 32, 180, 25, 'F');
    docPdf.rect(15, 32, 180, 25, 'D');
    
    docPdf.setTextColor(255, 255, 255);
    docPdf.setFont("helvetica", "bold");
    docPdf.text("Ringkasan Laporan:", 20, 39);
    docPdf.setFont("helvetica", "normal");
    docPdf.text(`- Total Hewan Hilang (Lost Pets): ${lostSnap.size}`, 20, 46);
    docPdf.text(`- Total Hewan Ditemukan (Found Pets): ${foundSnap.size}`, 20, 52);
    
    let yOffset = 70;
    
    docPdf.setFont("helvetica", "bold");
    docPdf.setFontSize(12);
    docPdf.text("Daftar Hewan Hilang (Lost Pets)", 15, yOffset);
    yOffset += 7;
    
    docPdf.setFillColor(179, 157, 219);
    docPdf.rect(15, yOffset, 180, 8, 'F');
    docPdf.rect(15, yOffset, 180, 8, 'D');
    docPdf.setTextColor(26, 26, 26);
    docPdf.setFontSize(9);
    docPdf.text("Nama", 20, yOffset + 5.5);
    docPdf.text("Jenis/Warna", 60, yOffset + 5.5);
    docPdf.text("Lokasi Terakhir", 110, yOffset + 5.5);
    docPdf.text("Status", 165, yOffset + 5.5);
    yOffset += 8;

    docPdf.setFont("helvetica", "normal");
    docPdf.setTextColor(255, 255, 255);
    lostSnap.forEach(d => {
      const p = d.data();
      if (yOffset > 270) { 
        docPdf.addPage(); 
        docPdf.setFillColor(18, 18, 18);
        docPdf.rect(0, 0, 210, 297, 'F');
        yOffset = 20; 
      }
      docPdf.setFillColor(38, 38, 38);
      docPdf.rect(15, yOffset, 180, 8, 'F');
      docPdf.rect(15, yOffset, 180, 8, 'D');
      docPdf.text(p.name || 'N/A', 20, yOffset + 5.5);
      docPdf.text(`${p.type || ''} / ${p.color || ''}`, 60, yOffset + 5.5);
      const loc = (p.lastLocation || '').substring(0, 30);
      docPdf.text(loc, 110, yOffset + 5.5);
      docPdf.text(p.status || 'N/A', 165, yOffset + 5.5);
      yOffset += 8;
    });

    yOffset += 10;
    if (yOffset > 250) { 
      docPdf.addPage(); 
      docPdf.setFillColor(18, 18, 18);
      docPdf.rect(0, 0, 210, 297, 'F');
      yOffset = 20; 
    }

    docPdf.setTextColor(255, 255, 255);
    docPdf.setFont("helvetica", "bold");
    docPdf.setFontSize(12);
    docPdf.text("Daftar Hewan Ditemukan (Found Pets)", 15, yOffset);
    yOffset += 7;

    docPdf.setFillColor(74, 222, 128);
    docPdf.rect(15, yOffset, 180, 8, 'F');
    docPdf.rect(15, yOffset, 180, 8, 'D');
    docPdf.setTextColor(26, 26, 26);
    docPdf.setFontSize(9);
    docPdf.text("Jenis", 20, yOffset + 5.5);
    docPdf.text("Warna", 60, yOffset + 5.5);
    docPdf.text("Lokasi Temuan", 100, yOffset + 5.5);
    docPdf.text("Status", 165, yOffset + 5.5);
    yOffset += 8;

    docPdf.setFont("helvetica", "normal");
    docPdf.setTextColor(255, 255, 255);
    foundSnap.forEach(d => {
      const p = d.data();
      if (yOffset > 270) { 
        docPdf.addPage(); 
        docPdf.setFillColor(18, 18, 18);
        docPdf.rect(0, 0, 210, 297, 'F');
        yOffset = 20; 
      }
      docPdf.setFillColor(38, 38, 38);
      docPdf.rect(15, yOffset, 180, 8, 'F');
      docPdf.rect(15, yOffset, 180, 8, 'D');
      docPdf.text(p.type || 'N/A', 20, yOffset + 5.5);
      docPdf.text(p.color || 'N/A', 60, yOffset + 5.5);
      const loc = (p.foundLocation || '').substring(0, 35);
      docPdf.text(loc, 100, yOffset + 5.5);
      docPdf.text(p.status || 'N/A', 165, yOffset + 5.5);
      yOffset += 8;
    });

    docPdf.save("Rekapitulasi_Pawpaw_Finder.pdf");
  } catch (err) {
    alert("Gagal export data: " + err.message);
  }
};
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
  color: #FFFFFF;
}

.btn-kembali {
  padding: 0.5rem 1.5rem;
  background-color: #FF8A65;
  color: #1A1A1A;
  font-weight: 800;
  border: 3px solid #000000;
  border-radius: 12px;
  box-shadow: 4px 4px 0px #000000;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-kembali:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px #000000;
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.admin-card {
  background-color: var(--color-card-bg);
  border: 3px solid #000000;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 4px 4px 0px #000000;
  cursor: pointer;
  transition: all 0.2s;
  color: #FFFFFF;
}

.admin-card:hover {
  transform: translateY(-4px);
  box-shadow: 6px 6px 0px #000000;
}

.admin-card.active-card {
  background-color: #000000;
  border-color: #FF8A65;
}

.icon-box {
  width: 48px;
  height: 48px;
  border: 3px solid #000000;
  border-radius: 12px;
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
  color: #aaaaaa;
}

.table-container {
  background-color: var(--color-card-bg);
  border: 3px solid #000000;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 4px 4px 0px #000000;
}

.section-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: #FFFFFF;
  margin-bottom: 1.5rem;
}

.table-scroll {
  overflow-x: auto;
  border: 3px solid #000000;
  border-radius: 12px;
}

.neo-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

.neo-table th {
  background-color: #B39DDB;
  border-bottom: 3px solid #000000;
  border-right: 3px solid #000000;
  padding: 1rem;
  font-weight: 800;
  color: #1A1A1A;
  text-align: left;
}

.neo-table th.text-center { text-align: center; }
.neo-table th:last-child { border-right: none; }

.neo-table td {
  padding: 1rem;
  border-bottom: 3px solid #000000;
  border-right: 3px solid #000000;
  background-color: #1A1A1A;
  color: #FFFFFF;
  vertical-align: middle;
}

.neo-table td:last-child { border-right: none; }
.neo-table tr:last-child td { border-bottom: none; }
.neo-table tr:hover td { background-color: #262626; }

.font-bold { font-weight: 800; color: #FFFFFF; }
.text-gray { font-weight: 700; color: #aaaaaa; }

.badge {
  background-color: #FFF176;
  border: 2px solid #000000;
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
  border: 2px solid #000000;
  border-radius: 8px;
  font-weight: 800;
  font-size: 0.75rem;
  cursor: pointer;
  box-shadow: 2px 2px 0px #000000;
  transition: all 0.2s;
}

.btn-approve { background-color: #4ADE80; color: #1A1A1A; }
.btn-delete { background-color: #FF6B6B; color: white; }

.btn-approve:active, .btn-delete:active, .btn-seeder:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.empty-module {
  text-align: center;
  padding: 3rem;
  border: 3px dashed #000000;
  border-radius: 16px;
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
  border: 3px solid #000000;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 4px 0px #000000;
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
