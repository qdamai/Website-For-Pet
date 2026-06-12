<template>
  <div class="detail-container">
    <div class="back-nav">
      <button @click="router.back()" class="btn-neo btn-back">
        &larr; Kembali
      </button>
    </div>

    <div v-if="loading" class="loading-wrapper">
      <SkeletonLoader height="450px" />
    </div>

    <div v-else-if="!pet" class="empty-wrapper">
      <EmptyState 
        title="Anabul Tidak Ditemukan" 
        description="Maaf, data hewan adopsi ini tidak tersedia atau sudah diambil pemilik baru."
      />
    </div>

    <div v-else class="detail-grid">
      <!-- Left Column: Photo Gallery and Traits -->
      <div class="gallery-column">
        <!-- Main Large Image -->
        <div class="main-image-card">
          <img :src="activePhoto" :alt="pet.name" class="main-img" />
          <span class="badge species-badge">{{ pet.species }} &bull; {{ pet.breed }}</span>
        </div>

        <!-- Thumbnails Gallery -->
        <div class="thumbnails-grid">
          <div 
            v-for="(photo, index) in pet.photos" 
            :key="index" 
            @click="activePhoto = photo"
            class="thumb-item"
            :class="{ 'active-thumb': activePhoto === photo }"
          >
            <img :src="photo" class="thumb-img" />
          </div>
        </div>

        <!-- Traits Cards -->
        <div class="traits-card">
          <h3 class="card-title">Karakter &amp; Gaya Hidup</h3>
          <div class="traits-grid">
            <div class="trait-badge" :class="{ 'trait-yes': pet.traits?.active }">
              ⚡ Aktif &amp; Energik: {{ pet.traits?.active ? 'Ya' : 'Tidak' }}
            </div>
            <div class="trait-badge" :class="{ 'trait-yes': pet.traits?.childFriendly }">
              👶 Ramah Anak: {{ pet.traits?.childFriendly ? 'Ya' : 'Tidak' }}
            </div>
            <div class="trait-badge" :class="{ 'trait-yes': pet.traits?.petFriendly }">
              🐶 Ramah Hewan Lain: {{ pet.traits?.petFriendly ? 'Ya' : 'Tidak' }}
            </div>
            <div class="trait-badge" :class="{ 'trait-yes': pet.traits?.apartmentFriendly }">
              🏢 Cocok di Apartemen: {{ pet.traits?.apartmentFriendly ? 'Ya' : 'Tidak' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Details & Health Passport & Actions -->
      <div class="info-column">
        <!-- Header Info -->
        <div class="info-header-card">
          <div class="flex justify-between items-start">
            <div>
              <span class="status-tag" :class="pet.status.toLowerCase()">
                {{ pet.status === 'Available' ? 'Tersedia' : pet.status === 'Reserved' ? 'Dipesan' : 'Diadopsi' }}
              </span>
              <h1 class="pet-name">{{ pet.name }}</h1>
              <p class="pet-location">📍 {{ pet.location }}</p>
            </div>
            <span class="id-tag">ID: #{{ pet.id.substring(0,8).toUpperCase() }}</span>
          </div>

          <div class="quick-stats-row">
            <div class="stat-box">
              <span class="lbl">Umur</span>
              <span class="val">{{ pet.age }} Tahun</span>
            </div>
            <div class="stat-box">
              <span class="lbl">Berat</span>
              <span class="val">{{ pet.weight }} Kg</span>
            </div>
            <div class="stat-box">
              <span class="lbl">Kelamin</span>
              <span class="val">{{ pet.gender === 'Male' ? 'Jantan' : 'Betina' }}</span>
            </div>
          </div>

          <!-- Personality Tags -->
          <div class="personality-tags">
            <span v-for="tag in pet.personality" :key="tag" class="tag-item">
              #{{ tag }}
            </span>
          </div>
        </div>

        <!-- Digital Health Passport -->
        <div class="health-passport-card">
          <h3 class="card-title">🛡️ Pet Health Passport</h3>
          <div class="health-list">
            <div class="health-row">
              <span class="health-lbl">Status Vaksin</span>
              <span class="health-val badge" :class="pet.vaccinated ? 'bg-green' : 'bg-red'">
                {{ pet.vaccinated ? 'Sudah Vaksin' : 'Belum Vaksin' }}
              </span>
            </div>
            <div class="health-row">
              <span class="health-lbl">Sterilisasi</span>
              <span class="health-val badge" :class="pet.sterilized ? 'bg-green' : 'bg-red'">
                {{ pet.sterilized ? 'Sudah Steril' : 'Belum Steril' }}
              </span>
            </div>
            <div class="health-row">
              <span class="health-lbl">Alergi Makanan</span>
              <span class="health-val text-white font-bold">{{ pet.allergies || 'Tidak ada' }}</span>
            </div>
            <div class="health-row">
              <span class="health-lbl">Pemeriksaan Terakhir</span>
              <span class="health-val text-white font-bold">{{ pet.lastCheckupDate || '-' }}</span>
            </div>
          </div>
          <div class="medical-history">
            <span class="health-lbl">Catatan Riwayat Medis:</span>
            <p class="medical-text">{{ pet.medicalHistory || 'Tidak ada riwayat medis terdaftar.' }}</p>
          </div>
        </div>

        <!-- Description Box -->
        <div class="desc-card">
          <h3 class="card-title">Deskripsi</h3>
          <p class="desc-text">{{ pet.description }}</p>
        </div>

        <!-- Action Panel -->
        <div class="action-panel">
          <button 
            @click="goToAdoptForm" 
            :disabled="pet.status !== 'Available'"
            class="btn-neo btn-adopt-main"
          >
            {{ pet.status === 'Available' ? 'Ajukan Adopsi Sekarang' : pet.status === 'Reserved' ? 'Hewan Dipesan' : 'Sudah Diadopsi' }}
          </button>
          
          <div class="secondary-actions">
            <button @click="showVisitModal = true" class="btn-neo btn-secondary">
              📅 Kunjungan
            </button>
            <button @click="startChat" class="btn-neo btn-secondary">
              💬 Chat Shelter
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Visit Scheduling Modal -->
    <div v-if="showVisitModal" class="neo-modal-overlay" @click.self="showVisitModal = false">
      <div class="neo-modal-card">
        <button class="close-btn" @click="showVisitModal = false">&times;</button>
        <h2 class="modal-title">Jadwalkan Kunjungan Shelter</h2>
        <p class="modal-subtitle">Atur tanggal dan waktu kunjungan fisik Anda untuk menemui {{ pet.name }} di shelter.</p>
        
        <form @submit.prevent="submitAppointment" class="modal-form">
          <div class="form-group">
            <label>Pilih Tanggal</label>
            <input v-model="visitForm.date" type="date" required class="neo-input" />
          </div>

          <div class="form-group">
            <label>Pilih Jam</label>
            <input v-model="visitForm.time" type="time" required class="neo-input" />
          </div>

          <div class="form-group">
            <label>Catatan untuk Shelter</label>
            <textarea v-model="visitForm.notes" rows="2" placeholder="Sebutkan keperluan Anda berkunjung..." class="neo-input resize-none"></textarea>
          </div>

          <button type="submit" :disabled="submitting" class="btn-neo btn-submit">
            {{ submitting ? 'Memproses...' : 'Kirim Jadwal Kunjungan' }}
          </button>
        </form>
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
import SkeletonLoader from '../components/SkeletonLoader.vue';
import EmptyState from '../components/EmptyState.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const pet = ref(null);
const loading = ref(true);
const activePhoto = ref('');
const submitting = ref(false);
const showVisitModal = ref(false);

const id = route.params.id;

const visitForm = ref({
  date: '',
  time: '',
  notes: ''
});

onMounted(async () => {
  await fetchPetDetail();
});

const fetchPetDetail = async () => {
  loading.value = true;
  try {
    const docRef = doc(db, 'adoption_pets', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      pet.value = snap.data();
      if (pet.value.photos?.length > 0) {
        activePhoto.value = pet.value.photos[0];
      }
    }
  } catch (err) {
    console.error("Gagal mengambil detail anabul:", err);
  } finally {
    loading.value = false;
  }
};

const goToAdoptForm = () => {
  if (!authStore.isAuthenticated) {
    alert("Silakan masuk (login) terlebih dahulu untuk mengajukan adopsi!");
    router.push({ name: 'Auth' });
    return;
  }
  router.push(`/adoption/apply/${id}`);
};

const submitAppointment = async () => {
  if (!authStore.isAuthenticated) {
    alert("Silakan masuk (login) terlebih dahulu!");
    router.push({ name: 'Auth' });
    return;
  }
  submitting.value = true;
  try {
    const aptId = `APT_${Date.now()}`;
    const appointmentDoc = {
      id: aptId,
      type: 'Visit',
      petId: pet.value.id,
      petName: pet.value.name,
      petPhoto: pet.value.photo,
      adopterId: authStore.user.uid,
      shelterId: pet.value.shelterId,
      date: visitForm.value.date,
      time: visitForm.value.time,
      notes: visitForm.value.notes,
      status: 'Pending',
      createdAt: serverTimestamp()
    };

    await setDoc(doc(db, 'appointments', aptId), appointmentDoc);
    alert("Janji temu kunjungan berhasil dijadwalkan! Menunggu konfirmasi shelter di dashboard.");
    showVisitModal.value = false;
    visitForm.value = { date: '', time: '', notes: '' };
  } catch (err) {
    alert("Gagal membuat janji temu: " + err.message);
  } finally {
    submitting.value = false;
  }
};

const startChat = async () => {
  if (!authStore.isAuthenticated) {
    alert("Silakan masuk (login) terlebih dahulu untuk mengirim pesan.");
    router.push({ name: 'Auth' });
    return;
  }
  if (pet.value.shelterId === authStore.user.uid) {
    alert("Anda tidak bisa mengechat shelter Anda sendiri.");
    return;
  }

  // Generate deterministic chat room ID
  const convId = `adopt_conv_${[authStore.user.uid, pet.value.shelterId].sort().join('_')}`;
  
  try {
    const convRef = doc(db, 'conversations', convId);
    const snap = await getDoc(convRef);
    if (!snap.exists()) {
      await setDoc(convRef, {
        id: convId,
        participants: [authStore.user.uid, pet.value.shelterId],
        petId: pet.value.id,
        petName: pet.value.name,
        petPhoto: pet.value.photo,
        lastMessage: 'Memulai obrolan adopsi...',
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      });
    }

    router.push({ path: '/adoption/dashboard', query: { tab: 'chat', room: convId } });
  } catch (err) {
    alert("Gagal memulai chat: " + err.message);
  }
};
</script>

<style scoped>
.detail-container {
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

.detail-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: start;
}

@media (min-width: 992px) {
  .detail-grid {
    grid-template-columns: 7fr 5fr;
    gap: 3rem;
  }
}

/* Gallery Column */
.gallery-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.main-image-card {
  border: 3px solid #000000;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 4px 4px 0px #000000;
  background-color: #1a1a1a;
  aspect-ratio: 4/3;
  position: relative;
}

.main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.species-badge {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  background-color: #B39DDB;
  color: #1A1A1A;
  border: 2px solid #000000;
  border-radius: 8px;
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 800;
}

.thumbnails-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
}

.thumb-item {
  border: 3px solid #000000;
  border-radius: 12px;
  aspect-ratio: 1;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 2px 2px 0px #000000;
  transition: all 0.2s;
  background-color: #1a1a1a;
}

.thumb-item:hover {
  transform: translateY(-2px);
}

.thumb-item.active-thumb {
  border-color: #FF8A65;
  box-shadow: 3px 3px 0px #000000;
  transform: scale(0.95);
}

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Traits & Personality */
.traits-card {
  background-color: var(--color-card-bg);
  border: 3px solid #000000;
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: 4px 4px 0px #000000;
}

.card-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.25rem;
  font-weight: 800;
  color: #FFFFFF;
  margin-bottom: 1rem;
}

.traits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.trait-badge {
  border: 2px solid #000000;
  border-radius: 12px;
  padding: 0.75rem;
  font-size: 0.85rem;
  font-weight: 700;
  background-color: #1A1A1A;
  color: #888888;
}

.trait-badge.trait-yes {
  background-color: #FFF176;
  color: #1A1A1A;
  box-shadow: 2px 2px 0px #000000;
}

/* Info Column */
.info-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-header-card {
  background-color: var(--color-card-bg);
  border: 3px solid #000000;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 4px 4px 0px #000000;
}

.status-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border: 2px solid #000000;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.status-tag.available { background-color: #4ADE80; color: #1A1A1A; }
.status-tag.reserved { background-color: #FFF176; color: #1A1A1A; }
.status-tag.adopted { background-color: #aaaaaa; color: #1A1A1A; }

.pet-name {
  font-family: 'Fredoka', sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0;
}

.pet-location {
  font-size: 1rem;
  font-weight: 700;
  color: #aaaaaa;
  margin: 0.25rem 0 0 0;
}

.id-tag {
  background-color: #1a1a1a;
  border: 2px solid #000000;
  border-radius: 8px;
  padding: 0.25rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 800;
}

.quick-stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  border-top: 2px dashed #000000;
  border-bottom: 2px dashed #000000;
  padding: 1.25rem 0;
  margin: 1.5rem 0;
}

.stat-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-box .lbl {
  font-size: 0.75rem;
  font-weight: 800;
  color: #888888;
  text-transform: uppercase;
}

.stat-box .val {
  font-size: 1.25rem;
  font-weight: 800;
  color: #FFFFFF;
  margin-top: 0.25rem;
}

.personality-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-item {
  background-color: #1a1a1a;
  border: 2px solid #000000;
  border-radius: 8px;
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 800;
  color: #B39DDB;
}

/* Digital Health Passport */
.health-passport-card {
  background-color: #2e1a47; /* purple variant */
  border: 3px solid #000000;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 4px 4px 0px #000000;
  border-color: #B39DDB;
}

.health-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.health-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid rgba(179, 157, 219, 0.2);
  padding-bottom: 0.75rem;
}

.health-row:last-child {
  border-bottom: none;
}

.health-lbl {
  font-size: 0.85rem;
  font-weight: 800;
  color: #B39DDB;
  text-transform: uppercase;
}

.health-val {
  font-size: 0.9rem;
}

.medical-history {
  margin-top: 1rem;
  background-color: rgba(0,0,0,0.3);
  padding: 1rem;
  border-radius: 12px;
  border: 2px dashed #B39DDB;
}

.medical-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: #dddddd;
  line-height: 1.6;
  margin-top: 0.25rem;
}

/* Description Card */
.desc-card {
  background-color: var(--color-card-bg);
  border: 3px solid #000000;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 4px 4px 0px #000000;
}

.desc-text {
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.6;
  color: #dddddd;
}

/* Actions Panel */
.action-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-adopt-main {
  width: 100%;
  background-color: #4ADE80;
  color: #1A1A1A;
  padding: 1.25rem;
  font-size: 1.25rem;
}

.btn-adopt-main:disabled {
  background-color: #262626;
  color: #555555;
  border-color: #000000;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.secondary-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.btn-secondary {
  background-color: #1a1a1a;
  color: #FFFFFF;
  border-color: #000000;
  padding: 0.75rem;
}

/* Modal Styling */
.neo-modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.neo-modal-card {
  width: 100%;
  max-width: 500px;
  background-color: #FF8A65;
  border: 4px solid #000000;
  border-radius: 24px;
  padding: 2.5rem 2rem;
  box-shadow: 8px 8px 0px #000000;
  position: relative;
  color: #1A1A1A;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  font-size: 2rem;
  font-weight: 800;
  background: none;
  border: none;
  cursor: pointer;
  color: #000000;
}

.modal-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
}

.modal-subtitle {
  font-size: 0.9rem;
  font-weight: 700;
  color: #333333;
  margin-bottom: 2rem;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
}

.form-group .neo-input {
  background-color: #FFFFFF;
  color: #1A1A1A;
}

.btn-submit {
  background-color: #FFF176;
  color: #1A1A1A;
  padding: 1rem;
  font-size: 1.1rem;
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

.bg-green { background-color: #4ADE80; color: #1a1a1a; }
.bg-red { background-color: #FF6B6B; color: #ffffff; }
</style>
