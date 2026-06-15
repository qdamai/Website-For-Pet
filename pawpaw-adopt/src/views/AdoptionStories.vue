<template>
  <div class="stories-container">
    
    <div class="stories-header">
      <div>
        <h1 class="stories-title">Kisah Sukses Adopsi <Heart :size="18" class="inline" /></h1>
        <p class="stories-subtitle">Kumpulan cerita hangat dan menginspirasi dari keluarga baru yang dipertemukan lewat Pawpaw Finder.</p>
      </div>
      <button 
        v-if="authStore.isAuthenticated" 
        @click="showUploadModal = true" 
        class="btn-neo btn-share"
      >
        Bagikan Kisah Anda +
      </button>
    </div>

    <!-- Stories List -->
    <div v-if="loading" class="text-center font-bold py-10">
      Memuat kisah sukses...
    </div>

    <div v-else-if="stories.length === 0" class="empty-stories-card">
      <span class="icon"><Heart :size="18" class="inline" /></span>
      <h3 class="card-title mt-4">Belum Ada Kisah Sukses</h3>
      <p class="text-gray mb-4">Jadilah yang pertama untuk menceritakan momen bahagia adopsi anabul Anda di sini!</p>
    </div>

    <div v-else class="grid-stories">
      <div 
        v-for="story in stories" 
        :key="story.id" 
        class="story-card"
      >
        <div class="story-img-wrapper">
          <img :src="story.photo || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=400&fit=crop'" alt="Foto Hewan" class="story-img" />
          <span class="story-badge">Adopsi Sukses</span>
        </div>

        <div class="story-content">
          <h2 class="story-title-item">{{ story.title }}</h2>
          <p class="story-author">Ditulis oleh: <b>{{ story.adopterName || 'Anonim' }}</b> &bull; {{ formatDate(story.createdAt) }}</p>
          
          <div class="story-pet-bar">
            <span><PawPrint :size="18" class="inline" /> Nama Anabul: <b>{{ story.petName || 'Anabul' }}</b></span>
          </div>

          <p class="story-text">{{ story.story }}</p>
        </div>
      </div>
    </div>

    <!-- Upload Story Modal -->
    <div v-if="showUploadModal" class="neo-modal-overlay" @click.self="showUploadModal = false">
      <div class="neo-modal-card">
        <button class="close-btn" @click="showUploadModal = false">&times;</button>
        <h2 class="modal-title">Bagikan Kisah Sukses</h2>
        <p class="modal-subtitle">Tulis cerita bahagia Anda bersama anabul baru untuk menginspirasi calon adopter lainnya.</p>
        
        <form @submit.prevent="submitStory" class="modal-form">
          <div class="form-row">
            <div class="form-group flex-1">
              <label>Nama Anabul</label>
              <input v-model="form.petName" type="text" required class="neo-input" />
            </div>
            <div class="form-group flex-1">
              <label>Nama Pengadopsi (Anda)</label>
              <input v-model="form.adopterName" type="text" required class="neo-input" />
            </div>
          </div>

          <div class="form-group">
            <label>Judul Kisah</label>
            <input v-model="form.title" type="text" placeholder="Misal: Cerita Bahagia Milo Bersama Keluarga Baru..." required class="neo-input" />
          </div>

          <div class="form-group">
            <label>Link Foto Kebersamaan (Unsplash/Imgur)</label>
            <input v-model="form.photo" type="url" placeholder="https://images.unsplash.com/..." required class="neo-input" />
          </div>

          <div class="form-group">
            <label>Tulis Cerita Selengkapnya</label>
            <textarea v-model="form.story" rows="4" placeholder="Ceritakan bagaimana Anda bertemu anabul ini, prosesnya, dan bagaimana dia merubah suasana rumah Anda..." required class="neo-input resize-none"></textarea>
          </div>

          <button type="submit" :disabled="submitting" class="btn-neo btn-submit">
            {{ submitting ? 'Mengirim...' : 'Kirim Cerita Bahagia' }}
          </button>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { FileText, MessageSquare, MapPin, Settings, Home, Camera, Calendar, PawPrint, Dog, Cat, AlertTriangle, XCircle, CheckCircle, Target, Heart, BarChart2, Dna, Cake, Scale, Sun, Moon } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';
import { collection, getDocs, setDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const stories = ref([]);
const loading = ref(true);
const submitting = ref(false);
const showUploadModal = ref(false);

const form = ref({
  petName: '',
  adopterName: '',
  title: '',
  photo: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=400&fit=crop',
  story: ''
});

onMounted(async () => {
  form.value.adopterName = authStore.profile?.fullname || '';
  await fetchStories();
});

const fetchStories = async () => {
  loading.value = true;
  try {
    const q = query(collection(db, 'adopt_stories'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    stories.value = snap.docs.map(doc => doc.data());
  } catch (err) {
    console.error("Gagal mengambil success stories:", err);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return dateStr.split('T')[0];
};

const submitStory = async () => {
  submitting.value = true;
  try {
    const storyId = `story_${Date.now()}`;
    const newStory = {
      id: storyId,
      petId: `pet_adopt_story_${Date.now()}`,
      petName: form.value.petName,
      petPhoto: form.value.photo,
      adopterName: form.value.adopterName,
      title: form.value.title,
      story: form.value.story,
      photo: form.value.photo,
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'adopt_stories', storyId), newStory);
    alert("Kisah bahagia Anda berhasil dibagikan! Terima kasih telah menginspirasi!");
    
    // Reset form and modal
    form.value = {
      petName: '',
      adopterName: authStore.profile?.fullname || '',
      title: '',
      photo: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=400&fit=crop',
      story: ''
    };
    showUploadModal.value = false;
    
    await fetchStories();
  } catch (err) {
    alert("Gagal membagikan cerita: " + err.message);
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.stories-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 3rem 2rem;
  font-family: 'Nunito', sans-serif;
  min-height: 100vh;
  background-color: var(--color-bg);
}

.stories-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.stories-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-text-dark, #1A1A1A);
  margin: 0;
}

[data-theme='dark'] .stories-title {
  color: var(--color-text-dark);
}

.stories-subtitle {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text);
  margin-top: 0.5rem;
  max-width: 700px;
}

.btn-neo {
  font-family: 'Fredoka', 'Nunito', sans-serif;
  font-weight: 800;
  padding: 0.75rem 1.5rem;
  background-color: #FF8A65;
  color: #1A1A1A;
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-neo);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.btn-neo:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-neo-hover);
}

.btn-neo:active {
  transform: translateY(1px);
  box-shadow: none;
}

.btn-share {
  background-color: #4ADE80;
}

/* Empty State */
.empty-stories-card {
  background-color: var(--color-card-bg);
  border: var(--border-width) solid var(--color-border);
  border-radius: 24px;
  padding: 4rem 2rem;
  box-shadow: var(--shadow-neo-hover);
  text-align: center;
}

.empty-stories-card .icon {
  font-size: 4rem;
  display: block;
}

.empty-stories-card .card-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-text-dark, #1A1A1A);
}

[data-theme='dark'] .empty-stories-card .card-title {
  color: var(--color-text-dark);
}

.text-gray {
  color: var(--color-text);
  font-weight: 600;
}

/* Stories Grid */
.grid-stories {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.story-card {
  display: grid;
  grid-template-columns: 1fr;
  background-color: var(--color-card-bg);
  border: var(--border-width) solid var(--color-border);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: var(--shadow-neo-hover);
}

@media (min-width: 768px) {
  .story-card {
    grid-template-columns: 4fr 8fr;
  }
}

.story-img-wrapper {
  height: 250px;
  position: relative;
  background-color: #1A1A1A;
  border-bottom: var(--border-width) solid var(--color-border);
}

@media (min-width: 768px) {
  .story-img-wrapper {
    height: 100%;
    border-bottom: none;
    border-right: var(--border-width) solid var(--color-border);
  }
}

.story-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.story-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: #FFF176;
  color: #1A1A1A;
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 800;
  box-shadow: var(--shadow-neo-active);
}

.story-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.story-title-item {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-text-dark, #1A1A1A);
  margin-bottom: 0.5rem;
}

[data-theme='dark'] .story-title-item {
  color: var(--color-text-dark);
}

.story-author {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.story-pet-bar {
  display: inline-flex;
  align-items: center;
  background-color: #1a1a1a;
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: #B39DDB;
  margin-bottom: 1.25rem;
  align-self: flex-start;
}

.story-text {
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.6;
  color: var(--color-text, #333333);
}

[data-theme='dark'] .story-text {
  color: #dddddd;
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
  max-width: 550px;
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

.form-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.flex-1 { flex: 1; min-width: 200px; }

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
</style>
