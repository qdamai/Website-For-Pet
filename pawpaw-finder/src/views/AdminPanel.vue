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

      <!-- Card 3: Export Rekapitulasi -->
      <div @click="exportData" class="admin-card">
        <div class="icon-box bg-purple">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        </div>
        <h3>{{ langStore.t('exportSummary') }}</h3>
        <p>Download data PDF</p>
      </div>

      <!-- Card 4: Reset Database -->
      <div @click="triggerForceSeed" class="admin-card card-yellow">
        <div class="icon-box bg-red">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </div>
        <h3>{{ langStore.t('resetDb') }}</h3>
        <p>Timpa dengan Data Seeder</p>
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
              <td><span class="badge" :class="user.role === 'admin' ? 'bg-orange' : 'bg-blue'">{{ user.role }}</span></td>
              <td class="action-cell">
                <button class="btn-delete" @click="deleteUser(user.uid)">{{ langStore.t('delete') }}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>



  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useLangStore } from '../stores/lang';
import { forceSeedDatabase } from '../utils/seeder';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import jsPDF from 'jspdf';

const router = useRouter();
const langStore = useLangStore();
const activeTab = ref('reports');
const pendingReports = ref([]);
const userList = ref([]);
const loading = ref(false);
const loadingUsers = ref(false);

onMounted(() => {
  fetchPendingReports();
});

watch(activeTab, (newTab) => {
  if (newTab === 'users' && userList.value.length === 0) {
    fetchUsers();
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

const exportData = async () => {
  try {
    const lostSnap = await getDocs(collection(db, 'lost_pets'));
    const foundSnap = await getDocs(collection(db, 'found_pets'));
    
    const docPdf = new jsPDF();
    
    // PDF Styling & Margins
    docPdf.setFillColor(18, 18, 18); // Dark background matching website theme
    docPdf.rect(0, 0, 210, 297, 'F');
    
    docPdf.setTextColor(255, 255, 255);
    docPdf.setFont("helvetica", "bold");
    docPdf.setFontSize(18);
    docPdf.text("LAPORAN REKAPITULASI DATA PAWPAW FINDER", 15, 20);
    
    docPdf.setTextColor(170, 170, 170);
    docPdf.setFont("helvetica", "normal");
    docPdf.setFontSize(10);
    docPdf.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 15, 27);
    
    // Stats Summary Box
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
    
    // Lost Pets Header
    docPdf.setFont("helvetica", "bold");
    docPdf.setFontSize(12);
    docPdf.text("Daftar Hewan Hilang (Lost Pets)", 15, yOffset);
    yOffset += 7;
    
    // Table Header
    docPdf.setFillColor(179, 157, 219); // Purple
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

    // Found Pets Header
    docPdf.setTextColor(255, 255, 255);
    docPdf.setFont("helvetica", "bold");
    docPdf.setFontSize(12);
    docPdf.text("Daftar Hewan Ditemukan (Found Pets)", 15, yOffset);
    yOffset += 7;

    // Table Header
    docPdf.setFillColor(74, 222, 128); // Green
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

const triggerForceSeed = async () => {
  if (confirm('Apakah Anda yakin ingin mengganti/mereset isi database dengan data seeder?')) {
    try {
      await forceSeedDatabase();
      alert('Berhasil! Database telah di-seed dengan data awal.');
    } catch (err) {
      alert('Gagal menanam data: ' + err.message);
    }
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

.card-yellow { background-color: #FFF176; color: #1A1A1A; }

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

.card-yellow p {
  color: #333333;
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

.action-cell {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn-approve, .btn-delete {
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

.btn-approve:active, .btn-delete:active {
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

@media (max-width: 768px) {
  .admin-wrapper { padding: 1rem; }
  .title { font-size: 2rem; }
  .table-container { padding: 1rem; }
}
</style>
