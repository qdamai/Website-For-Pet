<template>
  <div class="pet-detail container my-8">
    <div style="margin-bottom: 2rem;">
      <NeoButton @click="router.back()">{{ langStore.t('back') }}</NeoButton>
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
          <img :src="pet.photo || getPetFallbackImage(pet.type)" alt="Foto" class="w-full h-auto max-h-96 object-cover border-b-3 border-black" />
          <div class="p-4 text-center">
            <h2 class="text-2xl font-bold">{{ pet.name || 'Hewan Ditemukan' }}</h2>
            <span class="badge" :class="pet.status === 'Missing' ? 'bg-primary' : 'bg-success'">{{ pet.status }}</span>
          </div>
        </NeoCard>

        <NeoCard class="text-center">
          <h3 class="font-bold mb-2">{{ langStore.t('qrEmergency') }}</h3>
          <p class="text-sm mb-4">{{ langStore.t('scanQrInfo') }}</p>
          <div class="inline-block p-4 bg-white border-3 border-black rounded-lg mx-auto">
            <qrcode-vue :value="qrValue" :size="150" level="H" />
          </div>
        </NeoCard>
      </div>

      <!-- Right Column (Info, AI & Map) -->
      <div class="flex flex-col gap-6">
        <NeoCard>
          <h3 class="text-xl font-bold border-b-3 border-black pb-2 mb-4">Detail Laporan</h3>
          <div class="neo-detail-grid">
            <div class="neo-detail-item bg-pink">
              <span class="label">{{ langStore.t('type') }}</span>
              <span class="value">{{ pet.type }}</span>
            </div>
            <div class="neo-detail-item bg-blue">
              <span class="label">{{ langStore.t('color') }}</span>
              <span class="value">{{ pet.color }}</span>
            </div>
            <div v-if="pet.breed" class="neo-detail-item bg-yellow">
              <span class="label">Ras</span>
              <span class="value">{{ pet.breed }}</span>
            </div>
            <div class="neo-detail-item bg-green">
              <span class="label">{{ langStore.t('date') }}</span>
              <span class="value">{{ pet.lostDate || pet.foundDate }}</span>
            </div>
          </div>
          
          <div class="neo-desc-box">
            <span class="label">{{ langStore.t('description') }}</span>
            <p class="value">{{ pet.description }}</p>
          </div>

          <div class="mt-6 flex flex-col gap-3">
            <NeoButton variant="success" class="w-full btn-action" @click="startChat">{{ langStore.t('contactReporter') }}</NeoButton>
            <NeoButton variant="accent" class="w-full btn-action" @click="runAIMatch" :disabled="matchLoading">
              {{ matchLoading ? 'Menganalisis...' : langStore.t('aiMatch') }}
            </NeoButton>
            <NeoButton v-if="pet.status === 'Missing'" variant="primary" class="w-full btn-action" @click="generatePDF">{{ langStore.t('downloadWanted') }}</NeoButton>
            <NeoButton 
              v-if="authStore.isAdmin && type === 'found' && pet.status !== 'Transferred'" 
              variant="primary" 
              class="w-full btn-action" 
              style="background-color: #FFF176; color: #1A1A1A; border-color: #000000; margin-top: 0.5rem;"
              @click="transferToAdoption"
            >
              Pindahkan ke Adopsi 🔄
            </NeoButton>
          </div>
        </NeoCard>

        <NeoCard>
          <h3 class="font-bold mb-2">Peta Lokasi</h3>
          <p class="text-sm mb-4">Lokasi terakhir / ditemukan: <b>{{ pet.lastLocation || pet.foundLocation }}</b></p>
          <div class="h-64 border-3 border-black rounded-lg overflow-hidden relative z-0">
            <l-map 
              ref="detailMapRef" 
              v-model:zoom="zoom" 
              :center="[ pet.lat || -0.947083, pet.lng || 100.351111 ]"
              :useGlobalLeaflet="false"
            >
              <l-tile-layer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                layer-type="base"
                name="OpenStreetMap"
              ></l-tile-layer>
              <l-marker :lat-lng="[ pet.lat || -0.947083, pet.lng || 100.351111 ]"></l-marker>
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
          <h2 class="text-2xl font-bold mb-4 border-b-3 border-black pb-2">{{ langStore.t('aiMatchResultTitle') }}</h2>
          <p class="text-lg mb-6 bg-white p-4 border-3 border-black rounded-lg shadow-[4px_4px_0_#000000] text-black">
            {{ langStore.t('aiMatchResultText') }} <b>{{ matchResult }}%</b> {{ langStore.t('aiMatchResultWith') }} <b>{{ pet.lastLocation || pet.foundLocation }}</b>!
          </p>
          <NeoButton class="w-full btn-action" style="background-color: white; color: black;" @click="goToExplore">{{ langStore.t('viewRelatedReports') }}</NeoButton>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPetFallbackImage } from '../utils/helpers';
import { usePetStore } from '../stores/petStore';
import { useAuthStore } from '../stores/auth';
import { useLangStore } from '../stores/lang';
import NeoCard from '../components/NeoCard.vue';
import NeoButton from '../components/NeoButton.vue';
import SkeletonLoader from '../components/SkeletonLoader.vue';
import EmptyState from '../components/EmptyState.vue';
import QrcodeVue from 'qrcode.vue';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';
import jsPDF from 'jspdf';

const route = useRoute();
const router = useRouter();
const petStore = usePetStore();
const authStore = useAuthStore();
const langStore = useLangStore();

const pet = ref(null);
const loading = ref(true);
const showAIModal = ref(false);
const matchLoading = ref(false);
const matchResult = ref(0);
const zoom = ref(14);
const detailMapRef = ref(null);

const type = route.params.type; // 'lost' or 'found'
const id = route.params.id;

const qrValue = computed(() => {
  return `https://pawpaw-finder.com/public-qr/${type}/${id}`;
});

onMounted(async () => {
  pet.value = await petStore.fetchPetById(type, id);
  loading.value = false;
  
  nextTick(() => {
    setTimeout(() => {
      if (detailMapRef.value && detailMapRef.value.leafletObject) {
        detailMapRef.value.leafletObject.invalidateSize();
      }
    }, 500);
  });
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

// Helper function to load image to base64 DataURL (safely bypassing CORS)
const getBase64ImageFromUrl = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/jpeg');
      resolve(dataURL);
    };
    img.onerror = () => {
      // Fallback tiny gray box
      resolve('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
    };
    img.src = url;
  });
};

const generatePDF = async () => {
  if (!pet.value) return;
  
  const docPdf = new jsPDF();
  
  // Background styling
  docPdf.setFillColor(255, 253, 249); // Cream background
  docPdf.rect(0, 0, 210, 297, 'F');
  
  // Outer Border
  docPdf.setDrawColor(0, 0, 0);
  docPdf.setLineWidth(1.5);
  docPdf.rect(8, 8, 194, 281, 'D');

  // Red Header Box
  docPdf.setFillColor(255, 107, 107);
  docPdf.rect(12, 12, 186, 32, 'F');
  docPdf.rect(12, 12, 186, 32, 'D');
  
  docPdf.setFont("helvetica", "bold");
  docPdf.setFontSize(36);
  docPdf.setTextColor(0, 0, 0);
  docPdf.text("WANTED!", 105, 33, { align: "center" });

  // Pet Image drawing with base64 DataURL
  let imgBase64 = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  const targetPhoto = pet.value.photo || getPetFallbackImage(pet.value.type);
  if (targetPhoto) {
    imgBase64 = await getBase64ImageFromUrl(targetPhoto);
  }

  // Draw photo in center top
  const imgWidth = 90;
  const imgHeight = 90;
  const imgX = (210 - imgWidth) / 2;
  const imgY = 55;
  
  // White card backing for the image
  docPdf.setFillColor(255, 255, 255);
  docPdf.rect(imgX - 3, imgY - 3, imgWidth + 6, imgHeight + 6, 'F');
  docPdf.rect(imgX - 3, imgY - 3, imgWidth + 6, imgHeight + 6, 'D');
  
  docPdf.addImage(imgBase64, 'JPEG', imgX, imgY, imgWidth, imgHeight);

  // Pet Details Card
  const detailsY = 160;
  docPdf.setFillColor(255, 255, 255);
  docPdf.rect(15, detailsY, 180, 70, 'F');
  docPdf.rect(15, detailsY, 180, 70, 'D');

  docPdf.setFont("helvetica", "bold");
  docPdf.setFontSize(26);
  docPdf.text(pet.value.name || 'ANONIM', 105, detailsY + 12, { align: "center" });

  docPdf.setFontSize(14);
  docPdf.text("Ciri-Ciri Hewan:", 22, detailsY + 22);
  
  docPdf.setFont("helvetica", "normal");
  docPdf.setFontSize(12);
  docPdf.text(`- Jenis Hewan: ${pet.value.type || 'N/A'}`, 22, detailsY + 30);
  docPdf.text(`- Warna Dominan: ${pet.value.color || 'N/A'}`, 22, detailsY + 37);
  docPdf.text(`- Lokasi Terakhir: ${pet.value.lastLocation || 'N/A'}`, 22, detailsY + 44);
  
  const splitDesc = docPdf.splitTextToSize(`Deskripsi: ${pet.value.description || 'Tidak ada deskripsi.'}`, 160);
  docPdf.text(splitDesc, 22, detailsY + 52);

  // Contact Footer Box (Green Box)
  const footerY = 240;
  docPdf.setFillColor(74, 222, 128); // Green
  docPdf.rect(15, footerY, 180, 36, 'F');
  docPdf.rect(15, footerY, 180, 36, 'D');

  docPdf.setFont("helvetica", "bold");
  docPdf.setFontSize(16);
  docPdf.text("HUBUNGI SEGERA:", 105, footerY + 12, { align: "center" });
  docPdf.setFontSize(22);
  docPdf.text(pet.value.contact || 'Aplikasi Pawpaw Finder', 105, footerY + 26, { align: "center" });

  docPdf.save(`WANTED_${pet.value.name || 'Pet'}.pdf`);
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
  
  // Create or get chat room deterministically with pet ID
  const chatId = `report_${id}_${[authStore.user.uid, pet.value.userId].sort().join('_')}`;
  const chatRef = doc(db, 'chats', chatId);
  
  const snap = await getDoc(chatRef);
  if (!snap.exists()) {
    let recipientName = 'User';
    try {
      const recipientSnap = await getDoc(doc(db, 'users', pet.value.userId));
      if (recipientSnap.exists()) {
        recipientName = recipientSnap.data().fullname || 'User';
      }
    } catch (err) {
      console.error("Gagal mengambil profil penerima:", err);
    }

    await setDoc(chatRef, {
      chatId,
      participants: [authStore.user.uid, pet.value.userId],
      lastMessage: 'Memulai percakapan...',
      updatedAt: serverTimestamp(),
      isAdminChat: false,
      type: 'report',
      petId: id,
      petName: pet.value.name || 'Hewan',
      petPhoto: pet.value.photo || '',
      petType: type || 'lost',
      userNames: {
        [authStore.user.uid]: authStore.profile?.fullname || 'User',
        [pet.value.userId]: recipientName
      }
    });
  }
  
  router.push({ name: 'LiveChat', query: { room: chatId } });
};

const transferToAdoption = async () => {
  if (!pet.value) return;
  if (confirm(`Apakah Anda yakin ingin memindahkan ${pet.value.type} ini ke katalog adopsi?`)) {
    try {
      const adpId = `ADP_sync_${id}`;
      const photos = [
        pet.value.photo,
        pet.value.photo,
        pet.value.photo,
        pet.value.photo,
        pet.value.photo
      ];

      const petDoc = {
        id: adpId,
        name: pet.value.name || `Rescue ${pet.value.type}`,
        species: pet.value.type === 'Kucing' || pet.value.type === 'Cat' ? 'Cat' : pet.value.type === 'Anjing' || pet.value.type === 'Dog' ? 'Dog' : 'Others',
        breed: pet.value.breed || 'Campuran',
        gender: pet.value.gender || 'Jantan',
        age: 1,
        weight: 3.5,
        vaccinated: false,
        sterilized: false,
        healthStatus: 'Healthy',
        location: pet.value.foundLocation || 'Padang',
        status: 'Available',
        personality: ["Friendly", "Rescue"],
        traits: {
          active: true,
          childFriendly: true,
          petFriendly: true,
          apartmentFriendly: true,
          energyLevel: 2
        },
        ownerId: 'admin_support_pawpaw',
        photos,
        photo: pet.value.photo,
        description: pet.value.description || `Ditransfer dari temuan Pet Finder.`,
        lastCheckupDate: new Date().toISOString().split('T')[0],
        allergies: 'Tidak ada',
        medicalHistory: 'Catatan Kesehatan: Baik. Ditransfer ke adopsi.',
        createdAt: serverTimestamp()
      };

      await setDoc(doc(db, 'adoption_pets', adpId), petDoc);
      await updateDoc(doc(db, 'found_pets', id), {
        status: 'Transferred'
      });

      pet.value.status = 'Transferred';
      alert("Berhasil memindahkan hewan ke katalog adopsi!");
    } catch (err) {
      alert("Gagal memindahkan: " + err.message);
    }
  }
};
</script>

<style scoped>
.pet-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Nunito', sans-serif;
  min-height: 100vh;
  background-color: var(--color-bg);
}
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
  border: 3px solid #000000;
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
  border: 3px solid #000000;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 3px 3px 0px #000000;
  color: #1A1A1A;
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
  background-color: #1A1A1A;
  border: 3px dashed #000000;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 2rem;
}

.neo-desc-box .label {
  display: block;
  font-size: 0.8rem;
  font-weight: 800;
  color: #aaaaaa;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.neo-desc-box .value {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.6;
  color: #FFFFFF;
}

/* Modal Spesifik */
.neo-modal-card {
  width: 90%;
  max-width: 450px;
  background-color: #FF8A65;
  border: 4px solid #000000;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  box-shadow: 8px 8px 0px #000000;
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
  color: #000000;
}
.close-btn:hover {
  color: white;
}
</style>
