<template>
  <div class="quiz-container">
    
    <div class="quiz-header">
      <h1 class="quiz-title">Cari Jodoh Anabul <Target :size="18" class="inline" /></h1>
      <p class="quiz-subtitle">Jawab beberapa pertanyaan berikut untuk mencocokkan gaya hidup Anda dengan anabul yang paling sesuai!</p>
    </div>

    <!-- Quiz Panel -->
    <div v-if="!showResults" class="quiz-card">
      <!-- Progress Bar -->
      <div class="progress-container">
        <div class="progress-bar" :style="{ width: `${((currentStep + 1) / questions.length) * 100}%` }"></div>
      </div>

      <div class="step-lbl">
        <span>Langkah {{ currentStep + 1 }} dari {{ questions.length }}</span>
        <span>Pertanyaan {{ currentStep + 1 }}</span>
      </div>

      <!-- Question Text -->
      <div class="question-box">
        <h2 class="question-text">{{ questions[currentStep].text }}</h2>
        
        <div class="options-list">
          <button 
            v-for="opt in questions[currentStep].options" 
            :key="opt.value"
            @click="selectOption(opt.value)"
            class="btn-neo btn-option"
          >
            {{ opt.text }}
            <PawPrint v-if="opt.hasPawPrint" :size="18" class="inline ml-1" />
          </button>
        </div>
      </div>
    </div>

    <!-- Results Panel -->
    <div v-else class="results-layout">
      <div class="results-header-card">
        <span class="confetti"><PartyPopper class="inline" /></span>
        <h2 class="results-title">Anabul yang Paling Cocok untuk Anda</h2>
        <p class="results-subtitle">Berdasarkan profil tempat tinggal, tingkat aktivitas harian, anggaran, dan pengalaman Anda.</p>
        <button @click="resetQuiz" class="btn-neo btn-reset">Ulangi Kuis</button>
      </div>

      <!-- Loading Results -->
      <div v-if="loadingResults" class="text-center font-bold py-10">
        Menghitung kecocokan...
      </div>

      <!-- Empty Matches fallback -->
      <div v-else-if="recommendedPets.length === 0" class="empty-matches-card">
        <p class="text-gray mb-4">Tidak ditemukan kecocokan spesifik saat ini. Silakan telusuri katalog utama untuk melihat semua pilihan.</p>
        <router-link to="/" class="btn-neo btn-catalog-link">Lihat Semua Katalog</router-link>
      </div>

      <!-- Match Cards Grid -->
      <div v-else class="grid-matches">
        <div 
          v-for="pet in recommendedPets" 
          :key="pet.id" 
          class="match-card"
          @click="goToDetail(pet.id)"
        >
          <div class="match-img-wrapper">
            <img :src="pet.photo" :alt="pet.name" class="match-img" />
            <span class="match-badge">99% Cocok <Heart :size="18" class="inline" /></span>
          </div>

          <div class="match-details">
            <div>
              <h3 class="match-name">{{ pet.name }} ({{ pet.species }})</h3>
              <p class="match-breed">{{ pet.breed }}</p>
              <p class="match-desc">{{ pet.description }}</p>
            </div>
            
            <div class="match-specs">
              <span><MapPin :size="18" class="inline" /> {{ pet.location }}</span>
              <span><Cake :size="18" class="inline" /> {{ pet.age }} Tahun</span>
            </div>

            <button @click.stop="goToDetail(pet.id)" class="btn-neo btn-match-detail">
              Lihat Profil
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { FileText, MessageSquare, MapPin, Settings, Home, Camera, Calendar, PawPrint, Dog, Cat, AlertTriangle, XCircle, CheckCircle, Target, Heart, BarChart2, Dna, Cake, Scale, Sun, Moon, Building, Activity, User, TreePine, Banknote, Coins, PartyPopper, Wallet, Armchair, Footprints } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../firebase/config';

const router = useRouter();

const currentStep = ref(0);
const showResults = ref(false);
const loadingResults = ref(false);
const answers = ref({});
const allPets = ref([]);
const recommendedPets = ref([]);

const questions = [
  {
    key: 'dwelling',
    text: 'Di mana tempat tinggal Anda saat ini?',
    options: [
      { text: 'Apartemen / Kost', value: 'apartment' },
      { text: 'Rumah dengan Halaman Kecil', value: 'house_small' },
      { text: 'Rumah dengan Halaman Luas', value: 'house_large' }
    ]
  },
  {
    key: 'activity',
    text: 'Bagaimana tingkat aktivitas fisik harian Anda?',
    options: [
      { text: 'Sangat Aktif (Suka Olahraga / Berlari)', value: 'high' },
      { text: 'Sedang (Jalan Santai sore hari)', value: 'medium' },
      { text: 'Kurang Aktif (Bekerja didepan laptop / Rebahan)', value: 'low' }
    ]
  },
  {
    key: 'experience',
    text: 'Apakah Anda memiliki pengalaman memelihara hewan peliharaan sebelumnya?',
    options: [
      { text: 'Belum Pernah (Pemula)', value: 'beginner' },
      { text: 'Pernah Memelihara Sebelumnya (Berpengalaman)', value: 'experienced', hasPawPrint: true }
    ]
  },
  {
    key: 'budget',
    text: 'Berapa anggaran bulanan maksimal yang Anda siapkan untuk anabul?',
    options: [
      { text: 'Di bawah Rp 300 Ribu / Bulan', value: 'low' },
      { text: 'Rp 300 Ribu - Rp 1 Juta / Bulan', value: 'medium' },
      { text: 'Di atas Rp 1 Juta / Bulan', value: 'high' }
    ]
  }
];

onMounted(async () => {
  await fetchPetsForMatching();
});

const fetchPetsForMatching = async () => {
  try {
    const q = query(collection(db, 'adopt_pets'));
    const snap = await getDocs(q);
    allPets.value = snap.docs.map(doc => doc.data());
  } catch (err) {
    console.error("Gagal mengambil data hewan untuk kuis:", err);
  }
};

const selectOption = (value) => {
  const currentKey = questions[currentStep.value].key;
  answers.value[currentKey] = value;

  if (currentStep.value < questions.length - 1) {
    currentStep.value++;
  } else {
    calculateMatches();
  }
};

const calculateMatches = () => {
  showResults.value = true;
  loadingResults.value = true;
  
  setTimeout(() => {
    // Simple matching algorithm
    const matches = allPets.value.filter(pet => {
      // 1. Apartment restrictions: exclude dogs heavier than 10kg
      if (answers.value.dwelling === 'apartment') {
        if (pet.species === 'Dog' && pet.weight > 10) return false;
      }

      // 2. Activity Match
      if (answers.value.activity === 'low') {
        // Exclude highly active pets
        if (pet.traits?.energyLevel > 2) return false;
      } else if (answers.value.activity === 'high') {
        // Exclude low-energy pets
        if (pet.traits?.energyLevel < 2) return false;
      }

      return true;
    });

    // Pick top 4 matches
    recommendedPets.value = matches.slice(0, 4);
    loadingResults.value = false;
  }, 1200);
};

const resetQuiz = () => {
  currentStep.value = 0;
  showResults.value = false;
  answers.value = {};
  recommendedPets.value = [];
};

const goToDetail = (id) => {
  router.push(`/pet/${id}`);
};
</script>

<style scoped>
.quiz-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 2rem;
  font-family: 'Nunito', sans-serif;
  min-height: 100vh;
  background-color: var(--color-bg);
}

.quiz-header {
  text-align: center;
  margin-bottom: 3rem;
}

.quiz-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-text-dark);
  margin: 0;
}

.quiz-subtitle {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text);
  margin-top: 0.5rem;
}

/* Quiz Card */
.quiz-card {
  background-color: var(--color-card-bg);
  border: var(--border-width) solid var(--color-border);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: var(--shadow-neo-hover);
}

.progress-container {
  width: 100%;
  height: 10px;
  background-color: #121212;
  border: var(--border-width) solid var(--color-border);
  border-radius: 99px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-bar {
  height: 100%;
  background-color: #B39DDB;
  border-radius: 99px;
  transition: width 0.3s ease-in-out;
}

.step-lbl {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #888888;
  margin-bottom: 2rem;
}

.question-box {
  margin-top: 1rem;
}

.question-text {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-text-dark);
  margin-bottom: 2rem;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-option {
  background-color: #1a1a1a;
  color: #FFFFFF;
  border-color: var(--color-border);
  text-align: left;
  padding: 1.15rem 1.5rem;
  font-size: 1rem;
  width: 100%;
}

.btn-option:hover {
  background-color: #FFF176;
  color: #1A1A1A;
}

/* Results Layout */
.results-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.results-header-card {
  background-color: var(--color-card-bg);
  border: var(--border-width) solid var(--color-border);
  border-radius: 24px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: var(--shadow-neo-hover);
}

.confetti {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

.results-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-text-dark);
  margin: 0;
}

.results-subtitle {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0.5rem 0 2rem 0;
}

.btn-reset {
  background-color: #B39DDB;
  color: #1A1A1A;
}

.empty-matches-card {
  background-color: var(--color-card-bg);
  border: var(--border-width) solid var(--color-border);
  border-radius: 24px;
  padding: 3rem;
  text-align: center;
  box-shadow: var(--shadow-neo);
}

.btn-catalog-link {
  background-color: #FF8A65;
  color: #1A1A1A;
}

/* Match Cards */
.grid-matches {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.match-card {
  background-color: var(--color-card-bg);
  border: var(--border-width) solid var(--color-border);
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-neo);
  cursor: pointer;
  transition: all 0.2s;
}

.match-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-neo-hover);
}

.match-img-wrapper {
  height: 200px;
  border-bottom: var(--border-width) solid var(--color-border);
  position: relative;
  background-color: #1A1A1A;
}

.match-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.match-badge {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  background-color: #4ADE80;
  color: #1A1A1A;
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 800;
  box-shadow: var(--shadow-neo-active);
}

.match-details {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.match-name {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-text-dark);
  margin: 0;
}

.match-breed {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0.15rem 0 0.75rem 0;
}

.match-desc {
  font-size: 0.85rem;
  color: #888888;
  line-clamp: 2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 1rem;
}

.match-specs {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  font-weight: 700;
  color: #dddddd;
  margin-bottom: 1.25rem;
  border-top: 1px dashed #333333;
  padding-top: 0.75rem;
}

.btn-match-detail {
  width: 100%;
  background-color: #FF8A65;
  color: #1A1A1A;
  padding: 0.6rem;
  font-size: 0.9rem;
  margin-top: auto;
}

@media (max-width: 768px) {
  .quiz-container { padding: 2rem 1rem; }
  .quiz-card { padding: 1.5rem; }
  .question-text { font-size: 1.5rem; }
}
</style>
