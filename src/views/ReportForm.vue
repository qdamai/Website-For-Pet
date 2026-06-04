<template>
  <div class="report-form container my-8">
    <div class="flex items-center gap-4 mb-8">
      <NeoButton @click="router.back()">{{ langStore.t('back') }}</NeoButton>
      <h1 class="text-3xl font-bold">{{ langStore.t('report') }}</h1>
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

        <!-- Interactive Map Coordinates Input -->
        <div class="form-group">
          <label class="font-bold">Pilih Lokasi Kejadian di Peta</label>
          <p class="text-sm text-gray-400 mb-2">Klik pada peta di bawah untuk mengambil titik koordinat dan nama area secara otomatis.</p>
          <div class="h-64 border-3 border-black rounded-lg overflow-hidden relative z-0 mb-3" style="height: 300px;">
            <l-map 
              ref="reportMapRef"
              v-model:zoom="zoom"
              :center="center"
              @click="onMapClick"
              :useGlobalLeaflet="false"
              style="height: 100%; width: 100%; z-index: 1;"
            >
              <l-tile-layer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                layer-type="base"
                name="OpenStreetMap"
              ></l-tile-layer>
              <l-marker v-if="form.lat && form.lng" :lat-lng="[form.lat, form.lng]"></l-marker>
            </l-map>
          </div>
          <div class="grid-2 gap-4">
            <div>
              <label class="text-sm font-bold">Latitude</label>
              <input v-model.number="form.lat" type="number" step="any" class="neo-input mt-1" readonly required>
            </div>
            <div>
              <label class="text-sm font-bold">Longitude</label>
              <input v-model.number="form.lng" type="number" step="any" class="neo-input mt-1" readonly required>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="font-bold">Nama Area / Lokasi</label>
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

        <!-- Foto Hewan -->
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
import { ref, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useLangStore } from '../stores/lang';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import NeoCard from '../components/NeoCard.vue';
import NeoButton from '../components/NeoButton.vue';

import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';
import L from 'leaflet';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const langStore = useLangStore();

const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const selectedFile = ref(null);
const previewUrl = ref(null);
const reportMapRef = ref(null);

const zoom = ref(13);
const center = ref([-0.947083, 100.351111]); // Default to Padang

const form = ref({
  reportType: 'lost',
  name: '',
  type: 'Kucing',
  color: '',
  location: '',
  date: new Date().toISOString().split('T')[0],
  description: '',
  contact: authStore.profile?.phone || '',
  lat: -0.947083,
  lng: 100.351111
});

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
};

const onMapClick = async (e) => {
  const { lat, lng } = e.latlng;
  form.value.lat = lat;
  form.value.lng = lng;
  
  // Geocoding request
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
      headers: {
        'Accept-Language': 'id, en'
      }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const road = addr.road || '';
        const suburb = addr.suburb || addr.village || addr.town || '';
        const city = addr.city || addr.regency || addr.state || '';
        form.value.location = [road, suburb, city].filter(Boolean).join(', ');
      }
    }
  } catch (err) {
    console.error("Gagal reverse geocoding:", err);
  }
};

onMounted(() => {
  if (route.query.type === 'found') {
    form.value.reportType = 'found';
  }

  // Get current user position to center map
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        center.value = [pos.coords.latitude, pos.coords.longitude];
        form.value.lat = pos.coords.latitude;
        form.value.lng = pos.coords.longitude;
        zoom.value = 14;
        
        nextTick(() => {
          setTimeout(() => {
            if (reportMapRef.value && reportMapRef.value.leafletObject) {
              reportMapRef.value.leafletObject.invalidateSize();
            }
          }, 500);
        });
      },
      (err) => {
        console.warn('Geolocation denied or failed:', err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }

  nextTick(() => {
    setTimeout(() => {
      if (reportMapRef.value && reportMapRef.value.leafletObject) {
        reportMapRef.value.leafletObject.invalidateSize();
      }
    }, 500);
  });
});

// Fallback high quality images based on selected pet type
const getPetFallbackImage = (type) => {
  const fallbacks = {
    'Kucing': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop',
    'Anjing': 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=600&fit=crop',
    'Burung': 'https://images.unsplash.com/photo-1522856339183-5a70f56a5996?w=600&h=600&fit=crop',
    'Kelinci': 'https://images.unsplash.com/photo-1585110396000-c9fd4e4e5030?w=600&h=600&fit=crop',
    'Lainnya': 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=600&h=600&fit=crop'
  };
  return fallbacks[type] || fallbacks['Lainnya'];
};

const submitForm = async () => {
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    let finalImageUrl = getPetFallbackImage(form.value.type);

    // If Cloudinary keys are present, attempt upload. Otherwise, fallback to beautiful Unsplash images
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (selectedFile.value && cloudName && uploadPreset) {
      const formData = new FormData();
      formData.append('file', selectedFile.value);
      formData.append('upload_preset', uploadPreset);

      try {
        const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData
        });
        const cloudinaryData = await cloudinaryRes.json();
        if (cloudinaryData.secure_url) {
          finalImageUrl = cloudinaryData.secure_url;
        }
      } catch (err) {
        console.warn('Gagal upload ke Cloudinary, menggunakan gambar fallback.', err);
      }
    } else if (selectedFile.value) {
      console.log('Konfigurasi Cloudinary tidak lengkap, menggunakan base64 data URL untuk preview/menyimpan lokal');
      // Convert to base64 if no Cloudinary keys so it's fully functional
      const reader = new FileReader();
      const base64Promise = new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
      });
      reader.readAsDataURL(selectedFile.value);
      finalImageUrl = await base64Promise;
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
      lat: form.value.lat,
      lng: form.value.lng,
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
  gap: 1rem;
}
.image-preview {
  width: 100%;
  max-height: 250px;
  object-fit: cover;
  border: 3px solid #000000;
  border-radius: 16px;
  box-shadow: 4px 4px 0px 0px #000000;
}
.error-msg {
  background-color: #FECACA;
  color: #991B1B;
  padding: 1rem;
  border: 3px solid #000000;
  border-radius: 12px;
  font-weight: bold;
  box-shadow: 4px 4px 0px 0px #000000;
}
.success-msg {
  background-color: #A7F3D0;
  color: #065F46;
  padding: 1rem;
  border: 3px solid #000000;
  border-radius: 12px;
  font-weight: bold;
  box-shadow: 4px 4px 0px 0px #000000;
}
@media (max-width: 640px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>
