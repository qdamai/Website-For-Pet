<template>
  <div class="upload-container">
    <div class="upload-card neo-card">
      <div class="header-section">
        <h1 class="upload-title">Upload Anabul Baru</h1>
        <p class="upload-subtitle">Berikan kesempatan kedua bagi anabul dengan menemukan rumah baru yang penuh kasih sayang.</p>
      </div>

      <form @submit.prevent="submitPet" class="upload-form">
        <!-- Photo Section -->
        <div class="form-group">
          <label class="form-label">Foto Anabul <span class="text-red">*</span></label>
          <div class="photo-upload-area" :class="{ 'has-photo': form.photoUrl }">
            <img v-if="form.photoUrl" :src="form.photoUrl" alt="Pet Preview" class="photo-preview" />
            <div v-else class="photo-placeholder">
              <Camera :size="48" class="placeholder-icon" />
              <p>Pilih foto yang jelas dan menarik</p>
            </div>
            
            <div class="photo-actions mt-4">
              <input 
                v-model="form.photoUrl" 
                type="text" 
                class="neo-input w-full" 
                placeholder="Masukkan URL Foto (contoh: https://images.unsplash.com/...)" 
                required
              />
              <p class="text-xs text-gray mt-1">*Fitur upload file dinonaktifkan sementara, silakan gunakan URL gambar.</p>
            </div>
          </div>
        </div>

        <div class="form-grid">
          <!-- Nama -->
          <div class="form-group">
            <label class="form-label">Nama Anabul <span class="text-red">*</span></label>
            <input v-model="form.name" type="text" class="neo-input" placeholder="Contoh: Milo" required />
          </div>

          <!-- Spesies -->
          <div class="form-group">
            <label class="form-label">Jenis Hewan <span class="text-red">*</span></label>
            <select v-model="form.species" class="neo-input" required>
              <option value="" disabled>Pilih Jenis</option>
              <option value="Cat">Kucing</option>
              <option value="Dog">Anjing</option>
              <option value="Rabbit">Kelinci</option>
              <option value="Bird">Burung</option>
              <option value="Other">Lainnya</option>
            </select>
          </div>

          <!-- Ras -->
          <div class="form-group">
            <label class="form-label">Ras / Jenis Spesifik</label>
            <input v-model="form.breed" type="text" class="neo-input" placeholder="Contoh: Domestik, Persia, dll." />
          </div>

          <!-- Umur -->
          <div class="form-group">
            <label class="form-label">Perkiraan Umur <span class="text-red">*</span></label>
            <input v-model="form.age" type="text" class="neo-input" placeholder="Contoh: 1 Tahun 2 Bulan" required />
          </div>

          <!-- Gender -->
          <div class="form-group">
            <label class="form-label">Jenis Kelamin <span class="text-red">*</span></label>
            <select v-model="form.gender" class="neo-input" required>
              <option value="" disabled>Pilih Gender</option>
              <option value="Male">Jantan</option>
              <option value="Female">Betina</option>
            </select>
          </div>

          <!-- Berat -->
          <div class="form-group">
            <label class="form-label">Berat Badan</label>
            <input v-model="form.weight" type="text" class="neo-input" placeholder="Contoh: 4.5 Kg" />
          </div>
        </div>

        <!-- Lokasi -->
        <div class="form-group">
          <label class="form-label">Lokasi Saat Ini <span class="text-red">*</span></label>
          <input v-model="form.location" type="text" class="neo-input" placeholder="Kota / Kabupaten" required />
        </div>

        <!-- Deskripsi -->
        <div class="form-group">
          <label class="form-label">Deskripsi Kepribadian / Kesehatan <span class="text-red">*</span></label>
          <textarea 
            v-model="form.description" 
            class="neo-input" 
            rows="5" 
            placeholder="Ceritakan tentang sifatnya, riwayat kesehatannya, vaksinasi, dan alasan mengapa dia mencari rumah baru..."
            required
          ></textarea>
        </div>

        <div v-if="errorMsg" class="error-msg">
          <AlertCircle :size="16" class="inline" /> {{ errorMsg }}
        </div>

        <div class="form-actions">
          <button type="button" class="btn-neo bg-white" @click="router.push('/')">Batal</button>
          <button type="submit" class="btn-neo btn-submit" :disabled="isSubmitting">
            <span v-if="isSubmitting">Mengunggah...</span>
            <span v-else>Posting Anabul <Upload class="inline" /></span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { Camera, Upload, AlertCircle } from 'lucide-vue-next';
import { collection, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const router = useRouter();
const authStore = useAuthStore();

const isSubmitting = ref(false);
const errorMsg = ref('');

const form = reactive({
  name: '',
  species: '',
  breed: '',
  age: '',
  gender: '',
  weight: '',
  location: '',
  description: '',
  photoUrl: ''
});

const submitPet = async () => {
  errorMsg.value = '';
  isSubmitting.value = true;
  
  try {
    if (!authStore.isAuthenticated) {
      throw new Error('Anda harus login untuk mengunggah anabul.');
    }

    const newPetId = `pet_user_${Date.now()}`;
    
    const petData = {
      id: newPetId,
      name: form.name,
      species: form.species,
      breed: form.breed || 'Tidak diketahui',
      age: form.age,
      gender: form.gender,
      weight: form.weight || '-',
      location: form.location,
      description: form.description,
      photo: form.photoUrl,
      status: 'Available',
      uploaderId: authStore.user.uid,
      uploaderName: authStore.profile?.fullname || 'Anonim',
      createdAt: serverTimestamp()
    };

    await setDoc(doc(db, 'adopt_pets', newPetId), petData);
    
    // Redirect to home/catalog after successful upload
    router.push('/');
  } catch (err) {
    errorMsg.value = err.message;
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.upload-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.upload-card {
  background-color: var(--color-card-bg);
  padding: 2.5rem;
}

.header-section {
  text-align: center;
  margin-bottom: 2.5rem;
}

.upload-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-text-dark);
  margin-bottom: 0.5rem;
}

.upload-subtitle {
  color: var(--color-text);
  font-size: 1.1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }
}

.form-label {
  display: block;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--color-text-dark);
}

.photo-upload-area {
  border: 3px dashed var(--color-border);
  border-radius: var(--radius-lg);
  padding: 2rem;
  text-align: center;
  background-color: #fff;
  transition: all 0.2s ease;
}

.photo-placeholder {
  color: #aaaaaa;
}

.placeholder-icon {
  margin: 0 auto 1rem;
}

.photo-preview {
  max-width: 100%;
  max-height: 400px;
  border-radius: var(--radius-md);
  border: 3px solid var(--color-border);
  margin: 0 auto;
  object-fit: cover;
}

.text-red {
  color: #FF5252;
}

.text-gray {
  color: #888;
}

.error-msg {
  background-color: #FFCDD2;
  color: #B71C1C;
  padding: 1rem;
  border: 2px solid #B71C1C;
  border-radius: var(--radius-md);
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid var(--color-border);
}

.btn-submit {
  background-color: #A5D6A7;
}

.btn-submit:hover {
  background-color: #81C784;
}

textarea.neo-input {
  resize: vertical;
}
</style>
