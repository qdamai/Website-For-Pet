<template>
  <div class="form-container">
    <div class="back-nav">
      <button @click="router.back()" class="btn-neo btn-back">
        &larr; Kembali
      </button>
    </div>

    <div v-if="loadingPet" class="loading-wrapper text-center font-bold">
      Memuat informasi anabul...
    </div>

    <div v-else-if="!pet" class="empty-wrapper">
      <EmptyState 
        title="Anabul Tidak Terdaftar" 
        description="Maaf, informasi anabul yang ingin Anda adopsi tidak ditemukan."
      />
    </div>

    <div v-else class="form-layout-grid">
      <!-- Left side: Summary Card -->
      <div class="summary-column">
        <div class="summary-card">
          <h2 class="title-section">Anda Mengajukan Adopsi:</h2>
          <div class="pet-summary">
            <img :src="pet.photo" alt="Foto" class="summary-img" />
            <div>
              <h3 class="summary-name">{{ pet.name }}</h3>
              <p class="summary-info">{{ pet.species }} &bull; {{ pet.breed }}</p>
              <p class="summary-loc">📍 {{ pet.location }}</p>
            </div>
          </div>
          <div class="requirements-box">
            <h4>PENTING SEBELUM SUBMIT:</h4>
            <ul>
              <li>Proses adopsi ini gratis, tidak dipungut biaya apa pun.</li>
              <li>Pastikan seluruh anggota keluarga setuju untuk mengadopsi.</li>
              <li>Data Anda aman dan hanya digunakan untuk keperluan verifikasi kelayakan adopsi oleh shelter.</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Right side: Form Details -->
      <div class="form-column">
        <div class="form-card">
          <h2 class="form-title">Formulir Pengajuan Adopsi</h2>
          <p class="form-subtitle">Lengkapi data diri Anda dengan sejujur-jujurnya untuk membantu shelter memverifikasi kesiapan Anda memelihara {{ pet.name }}.</p>
          
          <form @submit.prevent="submitApplication" class="adoption-form">
            <!-- Full Name & Age -->
            <div class="form-row">
              <div class="form-group flex-1">
                <label>Nama Lengkap</label>
                <input v-model="form.fullName" type="text" required class="neo-input" />
              </div>
              <div class="form-group w-24">
                <label>Umur (Tahun)</label>
                <input v-model.number="form.age" type="number" required class="neo-input" />
              </div>
            </div>

            <!-- Email & Phone -->
            <div class="form-row">
              <div class="form-group flex-1">
                <label>Email</label>
                <input v-model="form.email" type="email" required class="neo-input" />
              </div>
              <div class="form-group flex-1">
                <label>Nomor HP / WA</label>
                <input v-model="form.phone" type="tel" required class="neo-input" />
              </div>
            </div>

            <!-- Address & City -->
            <div class="form-row">
              <div class="form-group flex-2">
                <label>Alamat Lengkap Rumah</label>
                <input v-model="form.address" type="text" required class="neo-input" />
              </div>
              <div class="form-group flex-1">
                <label>Kota</label>
                <input v-model="form.city" type="text" required class="neo-input" />
              </div>
            </div>

            <!-- Job & Monthly Income -->
            <div class="form-row">
              <div class="form-group flex-1">
                <label>Pekerjaan Saat Ini</label>
                <input v-model="form.job" type="text" required class="neo-input" />
              </div>
              <div class="form-group flex-1">
                <label>Penghasilan Bulanan</label>
                <select v-model="form.income" required class="neo-input">
                  <option value="">Pilih Penghasilan</option>
                  <option value="Di bawah Rp 3 Juta">Di bawah Rp 3 Juta / Bulan</option>
                  <option value="Rp 3 - 7 Juta">Rp 3 - 7 Juta / Bulan</option>
                  <option value="Rp 7 - 15 Juta">Rp 7 - 15 Juta / Bulan</option>
                  <option value="Di atas Rp 15 Juta">Di atas Rp 15 Juta / Bulan</option>
                </select>
              </div>
            </div>

            <!-- Pet care Experience -->
            <div class="form-group">
              <label>Pengalaman Memelihara Hewan</label>
              <textarea v-model="form.experience" rows="3" required placeholder="Ceritakan riwayat hewan peliharaan Anda sebelumnya..." class="neo-input resize-none"></textarea>
            </div>

            <!-- Reason to Adopt -->
            <div class="form-group">
              <label>Alasan Mengadopsi</label>
              <textarea v-model="form.reason" rows="3" required placeholder="Mengapa Anda tertarik mengadopsi hewan ini?" class="neo-input resize-none"></textarea>
            </div>

            <!-- Uploads -->
            <div class="uploads-section">
              <h3 class="uploads-title">Lampiran Berkas (Upload Foto)</h3>
              
              <div class="upload-grid">
                <div class="upload-item">
                  <label>Foto KTP</label>
                  <div class="upload-box">
                    <span class="icon">🪪</span>
                    <span class="file-name">{{ ktpFileName || 'Belum ada file' }}</span>
                    <input type="file" @change="handleFileChange($event, 'ktp')" class="file-input" required />
                  </div>
                </div>

                <div class="upload-item">
                  <label>Foto Rumah</label>
                  <div class="upload-box">
                    <span class="icon">🏡</span>
                    <span class="file-name">{{ houseFileName || 'Belum ada file' }}</span>
                    <input type="file" @change="handleFileChange($event, 'house')" class="file-input" required />
                  </div>
                </div>

                <div class="upload-item">
                  <label>Foto Area Hewan</label>
                  <div class="upload-box">
                    <span class="icon">🐾</span>
                    <span class="file-name">{{ petAreaFileName || 'Belum ada file' }}</span>
                    <input type="file" @change="handleFileChange($event, 'petArea')" class="file-input" required />
                  </div>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <button type="submit" :disabled="submitting" class="btn-neo btn-submit">
              {{ submitting ? 'Mengirim Pengajuan...' : 'Kirim Pengajuan Adopsi' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuthStore } from '../stores/auth';
import EmptyState from '../components/EmptyState.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const pet = ref(null);
const loadingPet = ref(true);
const submitting = ref(false);

const id = route.params.id;

// File Upload file names
const ktpFileName = ref('');
const houseFileName = ref('');
const petAreaFileName = ref('');

const form = ref({
  fullName: '',
  age: 25,
  email: '',
  phone: '',
  address: '',
  city: '',
  job: '',
  income: '',
  experience: '',
  reason: ''
});

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    alert("Silakan login terlebih dahulu.");
    router.push({ name: 'Auth' });
    return;
  }
  
  // Pre-fill profile info
  form.value.fullName = authStore.profile?.fullname || '';
  form.value.email = authStore.profile?.email || '';
  form.value.phone = authStore.profile?.phone || '';
  form.value.address = authStore.profile?.location || '';
  form.value.city = authStore.profile?.location || '';
  
  await fetchPetDetail();
});

const fetchPetDetail = async () => {
  loadingPet.value = true;
  try {
    const docRef = doc(db, 'adoption_pets', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      pet.value = snap.data();
    }
  } catch (err) {
    console.error("Gagal mengambil info anabul:", err);
  } finally {
    loadingPet.value = false;
  }
};

const handleFileChange = (event, type) => {
  const file = event.target.files[0];
  if (!file) return;

  if (type === 'ktp') ktpFileName.value = file.name;
  if (type === 'house') houseFileName.value = file.name;
  if (type === 'petArea') petAreaFileName.value = file.name;
};

const submitApplication = async () => {
  submitting.value = true;
  try {
    const reqId = `REQ_${Date.now()}`;
    
    // Save to firestore collection adoption_requests
    const requestDoc = {
      id: reqId,
      petId: pet.value.id,
      petName: pet.value.name,
      petPhoto: pet.value.photo,
      adopterId: authStore.user.uid,
      fullName: form.value.fullName,
      age: form.value.age,
      email: form.value.email,
      phone: form.value.phone,
      address: form.value.address,
      city: form.value.city,
      job: form.value.job,
      income: form.value.income,
      experience: form.value.experience,
      reason: form.value.reason,
      // Seed mockup URLs for files
      ktpPhoto: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=500&fit=crop',
      housePhoto: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&fit=crop',
      petAreaPhoto: 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=500&fit=crop',
      status: 'Application Submitted',
      shelterId: pet.value.shelterId,
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'adoption_requests', reqId), requestDoc);

    // Save notification for Adopter
    const notifId = `notif_${Date.now()}`;
    await setDoc(doc(db, 'notifications', notifId), {
      id: notifId,
      userId: authStore.user.uid,
      title: 'Pengajuan Terkirim',
      body: `Pengajuan adopsi Anda untuk ${pet.value.name} telah berhasil dikirim ke shelter.`,
      read: false,
      type: 'request_status',
      createdAt: serverTimestamp()
    });

    alert("Pengajuan adopsi Anda berhasil dikirim! Silakan pantau status pengajuan Anda di dashboard Adopsi Saya.");
    router.push('/adoption/dashboard');
  } catch (err) {
    alert("Gagal mengirim pengajuan adopsi: " + err.message);
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.form-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Nunito', sans-serif;
  min-height: 100vh;
  background-color: var(--color-bg);
}

.back-nav {
  margin-bottom: 2rem;
}

.btn-back {
  background-color: #B39DDB;
  color: #1A1A1A;
}

.form-layout-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: start;
}

@media (min-width: 992px) {
  .form-layout-grid {
    grid-template-columns: 4fr 8fr;
    gap: 3rem;
  }
}

/* Summary Column */
.summary-column {
  position: sticky;
  top: 100px;
}

.summary-card {
  background-color: var(--color-card-bg);
  border: 3px solid #000000;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 4px 4px 0px #000000;
}

.title-section {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.25rem;
  font-weight: 800;
  color: #FFFFFF;
  margin-bottom: 1.5rem;
}

.pet-summary {
  display: flex;
  gap: 1.25rem;
  align-items: center;
  border: 3px solid #000000;
  background-color: #1a1a1a;
  padding: 1rem;
  border-radius: 16px;
  box-shadow: 3px 3px 0px #000000;
  margin-bottom: 2rem;
}

.summary-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid #000000;
}

.summary-name {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.25rem;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0;
}

.summary-info {
  font-size: 0.85rem;
  font-weight: 700;
  color: #aaaaaa;
  margin: 0.15rem 0;
}

.summary-loc {
  font-size: 0.8rem;
  font-weight: 800;
  color: #FF8A65;
  margin: 0;
}

.requirements-box {
  background-color: rgba(255, 138, 101, 0.15);
  border: 2px dashed #FF8A65;
  border-radius: 16px;
  padding: 1.25rem;
  color: #FFFDF9;
}

.requirements-box h4 {
  font-weight: 800;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #FF8A65;
}

.requirements-box ul {
  list-style-type: disc;
  padding-left: 1.25rem;
  margin: 0;
}

.requirements-box li {
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.5;
  margin-bottom: 0.5rem;
}

/* Form Column */
.form-card {
  background-color: var(--color-card-bg);
  border: 3px solid #000000;
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 4px 4px 0px #000000;
}

.form-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0;
}

.form-subtitle {
  font-size: 0.95rem;
  font-weight: 600;
  color: #aaaaaa;
  margin: 0.5rem 0 2rem 0;
  line-height: 1.6;
}

.adoption-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.flex-1 { flex: 1; min-width: 200px; }
.flex-2 { flex: 2; min-width: 250px; }
.w-24 { width: 120px; }

.form-group label {
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #aaaaaa;
}

/* Upload Box elements */
.uploads-section {
  border-top: 2px dashed #000000;
  padding-top: 1.5rem;
  margin-top: 1rem;
}

.uploads-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.25rem;
  font-weight: 800;
  color: #FFFFFF;
  margin-bottom: 1.25rem;
}

.upload-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
}

.upload-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.upload-item label {
  font-size: 0.8rem;
  font-weight: 800;
  color: #aaaaaa;
}

.upload-box {
  border: 3px dashed #000000;
  border-radius: 12px;
  background-color: #1a1a1a;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  cursor: pointer;
  box-shadow: 2px 2px 0px #000000;
  transition: all 0.2s;
}

.upload-box:hover {
  border-color: #FF8A65;
  background-color: #262626;
  transform: translateY(-2px);
}

.upload-box .icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.upload-box .file-name {
  font-size: 0.75rem;
  font-weight: 800;
  color: #aaaaaa;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.btn-submit {
  background-color: #4ADE80;
  color: #1A1A1A;
  padding: 1.15rem;
  font-size: 1.15rem;
  width: 100%;
  margin-top: 1rem;
}

.loading-wrapper, .empty-wrapper {
  background-color: var(--color-card-bg);
  border: 3px solid #000000;
  border-radius: 24px;
  padding: 5rem 2rem;
  box-shadow: 4px 4px 0px #000000;
}
</style>
