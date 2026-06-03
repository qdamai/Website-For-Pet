<template>
  <div class="report-form container my-8">
    <div class="flex items-center gap-4 mb-8">
      <NeoButton @click="router.back()">Kembali</NeoButton>
      <h1 class="text-3xl">Form Pelaporan</h1>
    </div>

    <NeoCard>
      <form @submit.prevent="submitForm" class="flex flex-col gap-4">
        
        <div class="form-group">
          <label class="font-bold">Jenis Laporan</label>
          <select v-model="form.reportType" class="neo-input mt-1">
            <option value="lost">Hewan Saya Hilang</option>
            <option value="found">Saya Menemukan Hewan</option>
          </select>
        </div>

        <div v-if="form.reportType === 'lost'" class="form-group">
          <label class="font-bold">Nama Panggilan Hewan</label>
          <input v-model="form.name" type="text" class="neo-input mt-1" required placeholder="Misal: Milo">
        </div>

        <div class="grid-2 gap-4">
          <div class="form-group">
            <label class="font-bold">Jenis Hewan</label>
            <select v-model="form.type" class="neo-input mt-1" required>
              <option value="Kucing">Kucing</option>
              <option value="Anjing">Anjing</option>
              <option value="Burung">Burung</option>
              <option value="Kelinci">Kelinci</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <div class="form-group">
            <label class="font-bold">Warna Dominan</label>
            <input v-model="form.color" type="text" class="neo-input mt-1" required placeholder="Misal: Orange/Putih">
          </div>
        </div>

        <div class="form-group">
          <label class="font-bold">Lokasi Terakhir / Ditemukan</label>
          <input v-model="form.location" type="text" class="neo-input mt-1" required placeholder="Tulis nama jalan atau kota">
        </div>

        <div class="form-group">
          <label class="font-bold">Tanggal Kejadian</label>
          <input v-model="form.date" type="date" class="neo-input mt-1" required>
        </div>

        <div class="form-group">
          <label class="font-bold">Deskripsi Tambahan</label>
          <textarea v-model="form.description" class="neo-input mt-1" rows="4" required placeholder="Ciri-ciri khusus, kalung, dll..."></textarea>
        </div>

        <!-- NEW: Foto Hewan (Cloudinary) -->
        <div class="form-group">
          <label class="font-bold">Foto Hewan</label>
          <input type="file" @change="handleFileChange" accept="image/*" class="neo-input mt-1">
          <div v-if="previewUrl" class="mt-3">
            <img :src="previewUrl" alt="Preview Foto" class="image-preview">
          </div>
        </div>
        
        <div class="form-group">
          <label class="font-bold">Nomor Kontak yang bisa dihubungi</label>
          <input v-model="form.contact" type="text" class="neo-input mt-1" required placeholder="Nomor WA">
        </div>

        <!-- Feedback Messages -->
        <div v-if="errorMessage" class="error-msg">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="success-msg">
          {{ successMessage }}
        </div>

        <div class="mt-4">
          <NeoButton type="submit" variant="primary" size="lg" class="w-full" :disabled="loading">
            {{ loading ? 'Mengirim...' : 'Kirim Laporan' }}
          </NeoButton>
        </div>
      </form>
    </NeoCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import NeoCard from '../components/NeoCard.vue';
import NeoButton from '../components/NeoButton.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const selectedFile = ref(null);
const previewUrl = ref(null);
const userCoords = ref({ lat: null, lng: null });
const form = ref({
  reportType: 'lost',
  name: '',
  type: 'Kucing',
  color: '',
  location: '',
  date: new Date().toISOString().split('T')[0],
  description: '',
  contact: authStore.profile?.phone || ''
});

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
};

onMounted(() => {
  if (route.query.type === 'found') {
    form.value.reportType = 'found';
  }

  // Get geolocation automatically if permitted
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userCoords.value.lat = pos.coords.latitude;
        userCoords.value.lng = pos.coords.longitude;
      },
      (err) => {
        console.warn('Geolocation denied or failed:', err);
      }
    );
  }
});

const submitForm = async () => {
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    let finalImageUrl = 'https://images.unsplash.com/photo-1543852786-1cf6624b9987'; // Default fallback

    // Upload to Cloudinary if file is selected
    if (selectedFile.value) {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        errorMessage.value = 'ERROR: Konfigurasi Cloudinary (.env) belum dimuat. Mohon matikan terminal (Ctrl+C) lalu jalankan "npm run dev" kembali agar sistem membaca kunci rahasia Anda.';
        loading.value = false;
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile.value);
      formData.append('upload_preset', uploadPreset);

      const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });

      const cloudinaryData = await cloudinaryRes.json();
      if (cloudinaryData.secure_url) {
        finalImageUrl = cloudinaryData.secure_url;
      } else {
        throw new Error('Gagal mengunggah gambar ke Cloudinary');
      }
    }

    const isLost = form.value.reportType === 'lost';
    const collName = isLost ? 'lost_pets' : 'found_pets';
    const idPrefix = isLost ? 'pet_' : 'rep_';
    const newId = idPrefix + Date.now().toString();

    const dataPayload = {
      userId: authStore.user.uid,
      type: form.value.type,
      color: form.value.color,
      description: form.value.description,
      photo: finalImageUrl, 
      lat: userCoords.value.lat,
      lng: userCoords.value.lng,
      createdAt: serverTimestamp()
    };

    if (isLost) {
      Object.assign(dataPayload, {
        petId: newId,
        name: form.value.name,
        lastLocation: form.value.location,
        lostDate: form.value.date,
        contact: form.value.contact,
        status: 'Missing'
      });
    } else {
      Object.assign(dataPayload, {
        reportId: newId,
        foundLocation: form.value.location,
        foundDate: form.value.date,
        status: 'Pending Match'
      });
    }

    await setDoc(doc(db, collName, newId), dataPayload);
    successMessage.value = 'Laporan berhasil dikirim! Mengalihkan...';
    setTimeout(() => {
      router.push({ name: 'Explore' });
    }, 1500);
  } catch (error) {
    console.error(error);
    errorMessage.value = 'Gagal mengirim laporan: ' + error.message;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.image-preview {
  width: 100%;
  max-height: 250px;
  object-fit: cover;
  border: 4px solid #1A1A1A;
  border-radius: 16px;
  box-shadow: 4px 4px 0px 0px #1A1A1A;
}
.error-msg {
  background-color: #FECACA;
  color: #991B1B;
  padding: 1rem;
  border: 3px solid #1A1A1A;
  border-radius: 12px;
  font-weight: bold;
  box-shadow: 4px 4px 0px 0px #1A1A1A;
}
.success-msg {
  background-color: #A7F3D0;
  color: #065F46;
  padding: 1rem;
  border: 3px solid #1A1A1A;
  border-radius: 12px;
  font-weight: bold;
  box-shadow: 4px 4px 0px 0px #1A1A1A;
}
@media (max-width: 640px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>
