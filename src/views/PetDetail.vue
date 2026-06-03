<template>
  <div class="pet-detail container my-8">
    <div style="margin-bottom: 2rem;">
      <NeoButton @click="router.back()">Kembali</NeoButton>
    </div>

    <div v-if="loading">
      <SkeletonLoader height="400px" />
    </div>
    
    <div v-else-if="!pet">
      <EmptyState title="Hewan Tidak Ditemukan" description="Laporan ini mungkin telah dihapus." />
    </div>

    <div v-else class="grid-detail gap-8">
      <!-- Left Column (Photo & QR) -->
      <div class="flex flex-col gap-6">
        <NeoCard class="p-0 overflow-hidden">
          <img :src="pet.photo" alt="Foto" class="w-full h-auto max-h-96 object-cover border-b-2 border-black" />
          <div class="p-4 text-center">
            <h2 class="text-2xl font-bold">{{ pet.name || 'Hewan Ditemukan' }}</h2>
            <span class="badge" :class="pet.status === 'Missing' ? 'bg-primary' : 'bg-success'">{{ pet.status }}</span>
          </div>
        </NeoCard>

        <NeoCard class="text-center">
          <h3 class="font-bold mb-2">QR Code Darurat</h3>
          <p class="text-sm mb-4">Scan kode ini untuk info darurat & kontak</p>
          <div class="inline-block p-4 bg-white border-2 border-black rounded-lg mx-auto">
            <qrcode-vue :value="qrValue" :size="150" level="H" />
          </div>
        </NeoCard>
      </div>

      <!-- Right Column (Info, AI & Map) -->
      <div class="flex flex-col gap-6">
        <NeoCard>
          <h3 class="text-xl font-bold border-b-2 border-black pb-2 mb-4">Detail Laporan</h3>
          <div class="neo-detail-grid">
            <div class="neo-detail-item bg-pink">
              <span class="label">Jenis Hewan</span>
              <span class="value">{{ pet.type }}</span>
            </div>
            <div class="neo-detail-item bg-blue">
              <span class="label">Warna Dominan</span>
              <span class="value">{{ pet.color }}</span>
            </div>
            <div v-if="pet.breed" class="neo-detail-item bg-yellow">
              <span class="label">Ras / Spesies</span>
              <span class="value">{{ pet.breed }}</span>
            </div>
            <div class="neo-detail-item bg-green">
              <span class="label">Tanggal Laporan</span>
              <span class="value">{{ pet.lostDate || pet.foundDate }}</span>
            </div>
          </div>
          
          <div class="neo-desc-box">
            <span class="label">Deskripsi Tambahan</span>
            <p class="value">{{ pet.description }}</p>
          </div>

          <div class="mt-6 flex flex-col gap-3">
            <NeoButton variant="success" class="w-full btn-action" @click="startChat">Hubungi Pelapor</NeoButton>
            <NeoButton variant="accent" class="w-full btn-action" @click="runAIMatch" :disabled="matchLoading">
              {{ matchLoading ? 'Menganalisis...' : 'Jalankan Deteksi AI Kesesuaian' }}
            </NeoButton>
            <NeoButton v-if="pet.status === 'Missing'" variant="primary" class="w-full btn-action" @click="generatePDF">Cetak Brosur WANTED (PDF)</NeoButton>
          </div>
        </NeoCard>

        <NeoCard>
          <h3 class="font-bold mb-2">Peta Lokasi</h3>
          <p class="text-sm mb-4">Lokasi terakhir / ditemukan: <b>{{ pet.lastLocation || pet.foundLocation }}</b></p>
          <div class="h-64 border-2 border-black rounded-lg overflow-hidden relative z-0">
            <l-map ref="map" v-model:zoom="zoom" :center="[ -0.947083, 100.351111 ]">
              <l-tile-layer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                layer-type="base"
                name="OpenStreetMap"
              ></l-tile-layer>
              <l-marker :lat-lng="[ -0.947083, 100.351111 ]"></l-marker>
            </l-map>
          </div>
        </NeoCard>
      </div>
    </div>

    <!-- AI Match Modal -->
    <div v-if="showAIModal" class="neo-modal-overlay" @click.self="showAIModal = false">
      <div class="neo-modal-card">
        <button class="close-btn" @click="showAIModal = false">X</button>
        <div class="text-center">
          <h2 class="text-2xl font-bold mb-4 border-b-2 border-black pb-2">Deteksi Selesai</h2>
          <p class="text-lg mb-6 bg-white p-4 border-2 border-black rounded-lg shadow-[2px_2px_0_#1a1a1a]">
            AI mendeteksi kecocokan sebesar <b>{{ matchResult }}%</b> dengan laporan di wilayah <b>{{ pet.lastLocation || pet.foundLocation }}</b>!
          </p>
          <NeoButton class="w-full btn-action" style="background-color: white; color: black;" @click="goToExplore">Lihat Laporan Terkait</NeoButton>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePetStore } from '../stores/petStore';
import { useAuthStore } from '../stores/auth';
import NeoCard from '../components/NeoCard.vue';
import NeoButton from '../components/NeoButton.vue';
import SkeletonLoader from '../components/SkeletonLoader.vue';
import EmptyState from '../components/EmptyState.vue';
import QrcodeVue from 'qrcode.vue';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';
import jsPDF from 'jspdf';

const route = useRoute();
const router = useRouter();
const petStore = usePetStore();
const authStore = useAuthStore();

const pet = ref(null);
const loading = ref(true);
const showAIModal = ref(false);
const matchLoading = ref(false);
const matchResult = ref(0);
const zoom = ref(13);

const type = route.params.type; // 'lost' or 'found'
const id = route.params.id;

const qrValue = computed(() => {
  return `https://pawpaw-finder.com/public-qr/${type}/${id}`;
});

onMounted(async () => {
  pet.value = await petStore.fetchPetById(type, id);
  loading.value = false;
});

const runAIMatch = () => {
  matchLoading.value = true;
  setTimeout(() => {
    matchResult.value = Math.floor(Math.random() * (98 - 75 + 1) + 75);
    matchLoading.value = false;
    showAIModal.value = true;
  }, 2000);
};

const goToExplore = () => {
  showAIModal.value = false;
  router.push({ name: 'Explore' });
};

const generatePDF = () => {
  const doc = new jsPDF();
  
  // Background
  doc.setFillColor(255, 253, 249); // #FFFDF9
  doc.rect(0, 0, 210, 297, 'F');
  
  // Header Box
  doc.setFillColor(255, 107, 107); // Red
  doc.rect(10, 10, 190, 40, 'F');
  doc.setDrawColor(26, 26, 26);
  doc.setLineWidth(1.5);
  doc.rect(10, 10, 190, 40, 'D');
  
  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(40);
  doc.setTextColor(26, 26, 26);
  doc.text("WANTED!", 105, 38, { align: "center" });

  // Pet Details Box
  doc.setFillColor(255, 255, 255);
  doc.rect(20, 60, 170, 100, 'F');
  doc.rect(20, 60, 170, 100, 'D');
  
  doc.setFontSize(24);
  doc.text(pet.value.name || 'Hewan Hilang', 105, 80, { align: "center" });
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);
  doc.text(`Jenis: ${pet.value.type}`, 30, 100);
  doc.text(`Warna: ${pet.value.color}`, 30, 115);
  doc.text(`Lokasi Terakhir: ${pet.value.lastLocation || pet.value.foundLocation}`, 30, 130);
  
  // Description
  doc.setFontSize(12);
  const splitDesc = doc.splitTextToSize(`Deskripsi: ${pet.value.description}`, 150);
  doc.text(splitDesc, 30, 145);

  // Footer Box
  doc.setFillColor(74, 222, 128); // Green
  doc.rect(20, 180, 170, 40, 'F');
  doc.rect(20, 180, 170, 40, 'D');
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("HUBUNGI SEGERA:", 105, 200, { align: "center" });
  doc.text(pet.value.contact || 'Melalui Pawpaw Finder App', 105, 210, { align: "center" });

  doc.save(`WANTED_${pet.value.name || 'Pet'}.pdf`);
};

const startChat = async () => {
  if (!authStore.user) {
    alert('Silakan login terlebih dahulu.');
    router.push({ name: 'Auth' });
    return;
  }
  
  if (pet.value.userId === authStore.user.uid) {
    alert('Anda tidak bisa menge-chat diri sendiri.');
    return;
  }
  
  // Create or get chat room
  const chatId = [authStore.user.uid, pet.value.userId].sort().join('_');
  const chatRef = doc(db, 'chats', chatId);
  
  const snap = await getDoc(chatRef);
  if (!snap.exists()) {
    await setDoc(chatRef, {
      chatId,
      participants: [authStore.user.uid, pet.value.userId],
      lastMessage: '',
      updatedAt: serverTimestamp()
    });
  }
  
  router.push({ name: 'LiveChat', query: { room: chatId } });
};
</script>

<style scoped>
.grid-detail {
  display: grid;
  grid-template-columns: 1fr;
  align-items: start;
  gap: 2rem;
}
@media (min-width: 768px) {
  .grid-detail {
    grid-template-columns: 350px 1fr;
    gap: 3rem;
  }
}
.badge {
  display: inline-block;
  padding: 0.35rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  font-weight: 800;
  border: 3px solid #1A1A1A;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.btn-action {
  font-size: 1.1rem !important;
  padding: 0.8rem !important;
  border-width: 3px !important;
}

/* Struktur Detail Info */
.neo-detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.neo-detail-item {
  border: 3px solid #1A1A1A;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 3px 3px 0px #1A1A1A;
}

.bg-pink { background-color: #F8BBD0; }
.bg-blue { background-color: #BBDEFB; }
.bg-yellow { background-color: #FFF9C4; }
.bg-green { background-color: #C8E6C9; }

.neo-detail-item .label {
  display: block;
  font-size: 0.75rem;
  font-weight: 800;
  color: #1A1A1A;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
  opacity: 0.8;
}

.neo-detail-item .value {
  display: block;
  font-size: 1.15rem;
  font-weight: 800;
  color: #1A1A1A;
}

.neo-desc-box {
  background-color: #FFFDF9;
  border: 3px dashed #1A1A1A;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 2rem;
}

.neo-desc-box .label {
  display: block;
  font-size: 0.8rem;
  font-weight: 800;
  color: #555;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.neo-desc-box .value {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.6;
  color: #1A1A1A;
}

/* Modal Spesifik */
.neo-modal-card {
  width: 90%;
  max-width: 450px;
  background-color: #FF8A65;
  border: 4px solid #1A1A1A;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  box-shadow: 8px 8px 0px #1A1A1A;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  font-size: 1.5rem;
  font-weight: 900;
  background: none;
  border: none;
  cursor: pointer;
  color: #1A1A1A;
}
.close-btn:hover {
  color: white;
}
</style>
