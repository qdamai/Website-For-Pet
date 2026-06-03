<template>
  <div class="admin-wrapper">
    <div class="header">
      <h1 class="title">Ruang Kendali Admin</h1>
      <button @click="router.push({ name: 'Dashboard' })" class="btn-kembali">
        Kembali
      </button>
    </div>

    <!-- Grid Menu Utama Admin -->
    <div class="admin-grid">
      
      <!-- Card 1: Verifikasi Laporan -->
      <div @click="activeTab = 'reports'" class="admin-card">
        <div class="icon-box bg-orange">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
        </div>
        <h3>Verifikasi Laporan</h3>
        <p>Kelola laporan masuk</p>
      </div>

      <!-- Card 2: Manajemen User -->
      <div @click="activeTab = 'users'" class="admin-card">
        <div class="icon-box bg-blue">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>
        <h3>Manajemen User</h3>
        <p>Suspend / Hapus User</p>
      </div>

      <!-- Card 3: Export Rekapitulasi -->
      <div @click="exportData" class="admin-card">
        <div class="icon-box bg-purple">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        </div>
        <h3>Export Rekapitulasi</h3>
        <p>Download data PDF/Excel</p>
      </div>

      <!-- Card 4: Reset Database -->
      <div @click="triggerForceSeed" class="admin-card card-yellow">
        <div class="icon-box bg-red">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </div>
        <h3>Reset Database (Seed)</h3>
        <p>Timpa dengan Data Seeder</p>
      </div>

    </div>

    <!-- Kontainer Tabel Laporan Tertunda -->
    <div v-if="activeTab === 'reports'" class="table-container">
      <h3 class="section-title">Laporan Tertunda</h3>
      
      <div v-if="loading" class="text-center font-bold">Memuat data laporan...</div>
      <div v-else-if="pendingReports.length === 0" class="empty-module">
        Tidak ada laporan yang perlu diverifikasi saat ini.
      </div>
      
      <div v-else class="table-scroll">
        <table class="neo-table">
          <thead>
            <tr>
              <th>ID Laporan</th>
              <th>Jenis</th>
              <th>Warna</th>
              <th>Status</th>
              <th class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            
            <tr v-for="rep in pendingReports" :key="rep.id">
              <td class="font-bold">#{{ rep.id.substring(0,8).toUpperCase() }}</td>
              <td class="text-gray">{{ rep.type }} Ditemukan</td>
              <td>{{ rep.color }}</td>
              <td><span class="badge">{{ rep.status }}</span></td>
              <td class="action-cell">
                <button class="btn-approve" @click="approveReport(rep.id)">Approve</button>
                <button class="btn-delete" @click="deleteReport(rep.id)">Hapus</button>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>

    <!-- Kontainer Manajemen User -->
    <div v-if="activeTab === 'users'" class="table-container">
      <h3 class="section-title">Manajemen Pengguna</h3>
      <div v-if="loadingUsers" class="text-center font-bold">Memuat data pengguna...</div>
      <div v-else class="table-scroll">
        <table class="neo-table">
          <thead>
            <tr>
              <th>ID User</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Role</th>
              <th class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in userList" :key="user.uid">
              <td class="font-bold">{{ user.uid.substring(0,8) }}</td>
              <td class="text-gray">{{ user.fullname }}</td>
              <td>{{ user.email }}</td>
              <td><span class="badge" :class="user.role === 'admin' ? 'bg-orange' : 'bg-blue'">{{ user.role }}</span></td>
              <td class="action-cell">
                <button class="btn-delete" @click="deleteUser(user.uid)">Hapus</button>
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
import { forceSeedDatabase } from '../utils/seeder';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import jsPDF from 'jspdf';

const router = useRouter();
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
    docPdf.setFillColor(255, 253, 249);
    docPdf.rect(0, 0, 210, 297, 'F');
    
    docPdf.setFont("helvetica", "bold");
    docPdf.setFontSize(24);
    docPdf.text("REKAPITULASI PAWPAW FINDER", 105, 30, { align: "center" });
    
    docPdf.setFontSize(16);
    docPdf.text(`Total Laporan Kehilangan: ${lostSnap.size}`, 20, 60);
    docPdf.text(`Total Laporan Penemuan: ${foundSnap.size}`, 20, 80);
    
    docPdf.save("Rekapitulasi_Pawpaw.pdf");
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
  color: #1A1A1A;
}

.btn-kembali {
  padding: 0.5rem 1.5rem;
  background-color: #FF8A65;
  color: white;
  font-weight: 800;
  border: 3px solid #1A1A1A;
  border-radius: 12px;
  box-shadow: 4px 4px 0px #1A1A1A;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-kembali:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px #1A1A1A;
}

.admin-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

@media (max-width: 768px) {
  .admin-grid {
    grid-template-columns: 1fr;
  }
}

.admin-card {
  background-color: #FFFDF9;
  border: 4px solid #1A1A1A;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 6px 6px 0px #1A1A1A;
  cursor: pointer;
  transition: all 0.2s;
}

.admin-card:hover {
  transform: translateY(-4px);
  box-shadow: 6px 10px 0px #1A1A1A;
}

.card-yellow { background-color: #FFF176; }

.icon-box {
  width: 48px;
  height: 48px;
  border: 3px solid #1A1A1A;
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
  color: #1A1A1A;
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
}

.admin-card p {
  font-size: 0.875rem;
  font-weight: 700;
  color: #555;
}

.table-container {
  background-color: #FFFDF9;
  border: 4px solid #1A1A1A;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 8px 8px 0px #1A1A1A;
}

.section-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: #1A1A1A;
  margin-bottom: 1.5rem;
}

.table-scroll {
  overflow-x: auto;
  border: 4px solid #1A1A1A;
  border-radius: 12px;
}

.neo-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

.neo-table th {
  background-color: #B39DDB;
  border-bottom: 4px solid #1A1A1A;
  border-right: 4px solid #1A1A1A;
  padding: 1rem;
  font-weight: 800;
  color: #1A1A1A;
  text-align: left;
}

.neo-table th.text-center { text-align: center; }
.neo-table th:last-child { border-right: none; }

.neo-table td {
  padding: 1rem;
  border-bottom: 4px solid #1A1A1A;
  border-right: 4px solid #1A1A1A;
  background-color: white;
}

.neo-table td:last-child { border-right: none; }
.neo-table tr:last-child td { border-bottom: none; }
.neo-table tr:hover td { background-color: #F3E5F5; }

.font-bold { font-weight: 800; color: #1A1A1A; }
.text-gray { font-weight: 700; color: #555; }

.badge {
  background-color: #FFF176;
  border: 2px solid #1A1A1A;
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
  border: 2px solid #1A1A1A;
  border-radius: 8px;
  font-weight: 800;
  font-size: 0.75rem;
  cursor: pointer;
  box-shadow: 2px 2px 0px #1A1A1A;
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
  border: 4px dashed #1A1A1A;
  border-radius: 16px;
  background-color: white;
  font-weight: 700;
  color: #555;
}

@media (max-width: 768px) {
  .admin-wrapper { padding: 1rem; }
  .title { font-size: 2rem; }
  .table-container { padding: 1rem; }
}
</style>
