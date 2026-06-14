<template>
  <div class="adoption-container">
    
    <!-- Catalog Header -->
    <div class="catalog-header">
      <div>
        <h1 class="catalog-title">Portal Adopsi Pawpaw</h1>
        <p class="catalog-subtitle">Membantu mempertemukan anabul telantar dengan rumah barunya yang penuh kasih sayang.</p>
      </div>
      
      <!-- Quick Options Tray -->
      <div class="header-actions">
        <button @click="router.push('/quiz')" class="btn-neo btn-quiz">
          Cari Jodoh Anabul <Target class="inline" />
        </button>
        <button @click="router.push('/stories')" class="btn-neo btn-stories">
          Kisah Sukses <Heart class="inline" />
        </button>
        <button @click="router.push('/compare')" class="btn-neo btn-compare">
          Bandingkan ({{ compareIds.length }}/3) <BarChart2 class="inline" />
        </button>
        <button v-if="authStore.isAuthenticated" @click="router.push('/upload')" class="btn-neo bg-yellow">
          Posting Anabul <Upload class="inline" />
        </button>
      </div>
    </div>

    <!-- Filters & Search Panel -->
    <div class="filter-card">
      <div class="filter-group">
        <!-- Search bar -->
        <input 
          v-model="filters.search" 
          type="text" 
          class="neo-input search-input" 
          placeholder="Cari nama, ras, atau lokasi..."
        />
        
        <!-- Species Filter -->
        <select v-model="filters.species" class="neo-input select-input">
          <option value="all">Semua Jenis</option>
          <option value="Cat">Kucing</option>
          <option value="Dog">Anjing</option>
          <option value="Rabbit">Kelinci</option>
          <option value="Bird">Burung</option>
          <option value="Hamster">Hamster</option>
        </select>

        <!-- Location Filter -->
        <select v-model="filters.location" class="neo-input select-input">
          <option value="all">Semua Lokasi</option>
          <option v-for="loc in uniqueLocations" :key="loc" :value="loc">{{ loc }}</option>
        </select>

        <!-- Gender Filter -->
        <select v-model="filters.gender" class="neo-input select-input">
          <option value="all">Jenis Kelamin</option>
          <option value="Male">Jantan</option>
          <option value="Female">Betina</option>
        </select>

        <!-- Vaccine Filter -->
        <select v-model="filters.vaccinated" class="neo-input select-input">
          <option value="all">Status Vaksin</option>
          <option value="true">Sudah Vaksin</option>
          <option value="false">Belum Vaksin</option>
        </select>
      </div>
    </div>

    <!-- Main Content Area -->
    <div v-if="loading" class="grid-catalog">
      <SkeletonLoader v-for="i in 8" :key="i" height="420px" />
    </div>

    <div v-else-if="filteredPets.length === 0" class="empty-state-wrapper">
      <EmptyState 
        title="Anabul Tidak Ditemukan" 
        description="Coba ubah kriteria filter atau cari kata kunci lain di pencarian Anda." 
        type="search"
      />
    </div>

    <div v-else class="grid-catalog">
      <div 
        v-for="pet in filteredPets" 
        :key="pet.id" 
        class="pet-card"
        @click="goToDetail(pet.id)"
      >
        <!-- Photo and Wishlist Overlay -->
        <div class="img-wrapper">
          <img :src="pet.photo || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop'" alt="Foto Hewan" class="pet-img" />
          
          <button 
            @click.stop="handleToggleWishlist(pet.id)" 
            class="wishlist-btn"
            :class="{ 'wishlisted': isWishlisted(pet.id) }"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" :fill="isWishlisted(pet.id) ? '#FF6B6B' : 'none'" stroke="currentColor" stroke-width="2.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          
          <span class="species-badge">{{ pet.breed || pet.species }}</span>
          
          <span v-if="pet.status !== 'Available'" class="status-overlay">
            {{ pet.status }}
          </span>
        </div>

        <!-- Details Info -->
        <div class="pet-details">
          <div class="pet-info-top">
            <div class="pet-header">
            <h3 class="pet-name">{{ pet.name }}</h3>
            <span class="badge health-badge">{{ pet.healthStatus }}</span>
          </div>

          <p class="pet-desc">{{ pet.description }}</p>

          <div class="pet-stats">
            <div class="stat-item">
              <span class="icon"><MapPin class="inline" /></span>
              <span class="text">{{ pet.location }}</span>
            </div>
            <div class="stat-item">
              <span class="icon"><Dna class="inline" /></span>
              <span class="text">{{ pet.gender === 'Male' ? 'Jantan' : 'Betina' }}</span>
            </div>
            <div class="stat-item">
              <span class="icon"><Cake class="inline" /></span>
              <span class="text">{{ pet.age }} Tahun</span>
            </div>
            <div class="stat-item">
              <span class="icon"><Scale class="inline" />️</span>
              <span class="text">{{ pet.weight }} Kg</span>
            </div>
          </div>

            </div>

          <!-- Actions -->
          <div class="pet-actions mt-auto">
            <button @click.stop="goToDetail(pet.id)" class="btn-neo btn-details">
              Lihat Profil Lengkap
            </button>
            <button 
              v-if="pet.status === 'Available'"
              @click.stop="handleToggleCompare(pet.id)" 
              class="btn-neo btn-compare-action"
              :class="{ 'compared': compareIds.includes(pet.id) }"
            >
              {{ compareIds.includes(pet.id) ? 'Batal Bandingkan' : 'Bandingkan Anabul' }}
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { Target, Scale, BarChart2, MapPin, Heart, Cake, Dna, Upload } from 'lucide-vue-next';

import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuthStore } from '../stores/auth';
import { useWishlistStore } from '../stores/wishlist';
import SkeletonLoader from '../components/SkeletonLoader.vue';
import EmptyState from '../components/EmptyState.vue';

const router = useRouter();
const authStore = useAuthStore();
const wishlistStore = useWishlistStore();

const pets = ref([]);
const loading = ref(true);
const compareIds = ref([]);

const filters = ref({
  search: '',
  species: 'all',
  location: 'all',
  gender: 'all',
  vaccinated: 'all'
});

onMounted(async () => {
  await fetchPets();
  loadCompareList();
  if (authStore.isAuthenticated) {
    await wishlistStore.fetchWishlist(authStore.user.uid);
  }
});

const fetchPets = async () => {
  loading.value = true;
  try {
    // Read only approved or default pets (for admin moderation sync we also include approved check)
    const q = query(collection(db, 'adopt_pets'));
    const snap = await getDocs(q);
    pets.value = snap.docs.map(doc => doc.data());
  } catch (err) {
    console.error("Gagal memuat catalog adopsi:", err);
  } finally {
    loading.value = false;
  }
};

const uniqueLocations = computed(() => {
  const locs = pets.value.map(p => p.location).filter(Boolean);
  return [...new Set(locs)].sort();
});

const filteredPets = computed(() => {
  return pets.value.filter(p => {
    // Do not show deactivated pets to public guests/adopters
    if (p.status === 'Deactivated' || p.status === 'Rejected') return false;

    // Search query matches name, breed, or location
    if (filters.value.search) {
      const q = filters.value.search.toLowerCase();
      const nameMatch = p.name?.toLowerCase().includes(q);
      const breedMatch = p.breed?.toLowerCase().includes(q);
      const locMatch = p.location?.toLowerCase().includes(q);
      if (!nameMatch && !breedMatch && !locMatch) return false;
    }

    // Filters
    if (filters.value.species !== 'all' && p.species !== filters.value.species) return false;
    if (filters.value.location !== 'all' && p.location !== filters.value.location) return false;
    if (filters.value.gender !== 'all' && p.gender !== filters.value.gender) return false;
    
    if (filters.value.vaccinated !== 'all') {
      const isVac = filters.value.vaccinated === 'true';
      if (p.vaccinated !== isVac) return false;
    }

    return true;
  });
});

const isWishlisted = (petId) => {
  return wishlistStore.wishlistedIds.includes(petId);
};

const handleToggleWishlist = async (petId) => {
  if (!authStore.isAuthenticated) {
    alert("Silakan masuk (login) terlebih dahulu untuk mengelola wishlist!");
    router.push({ name: 'Auth' });
    return;
  }
  await wishlistStore.toggleWishlist(authStore.user.uid, petId);
};

const loadCompareList = () => {
  compareIds.value = JSON.parse(localStorage.getItem('adopt_compare') || '[]');
};

const handleToggleCompare = (petId) => {
  const list = [...compareIds.value];
  if (list.includes(petId)) {
    compareIds.value = list.filter(id => id !== petId);
  } else {
    if (list.length >= 3) {
      alert("Anda hanya bisa membandingkan maksimal 3 hewan sekaligus!");
      return;
    }
    compareIds.value.push(petId);
  }
  localStorage.setItem('adopt_compare', JSON.stringify(compareIds.value));
};

const goToDetail = (id) => {
  router.push(`/pet/${id}`);
};
</script>

<style scoped>
.adoption-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem 3rem;
  font-family: 'Nunito', sans-serif;
  min-height: 100vh;
  background-color: var(--color-bg);
}

/* Header */
.catalog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.catalog-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 2.75rem;
  font-weight: 800;
  color: #111111;
  margin: 0;
}

.catalog-subtitle {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2D3748;
  margin: 0.25rem 0 0 0;
  max-width: 600px;
}

.header-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.btn-neo {
  font-family: 'Fredoka', 'Nunito', sans-serif;
  font-weight: 800;
  padding: 0.75rem 1.5rem;
  background-color: #FF8A65;
  color: #1A1A1A;
  border: 3px solid #000000;
  border-radius: 12px;
  box-shadow: 4px 4px 0px 0px #000000;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.btn-neo:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px 0px #000000;
}

.btn-neo:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.btn-quiz { background-color: #FFF176; }
.btn-stories { background-color: #4ADE80; }
.btn-compare { background-color: #B39DDB; }

/* Filter Card */
.filter-card {
  background-color: var(--color-card-bg);
  border: 3px solid #000000;
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: 4px 4px 0px 0px #000000;
  margin-bottom: 3rem;
}

.filter-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.neo-input {
  padding: 0.75rem 1rem;
  background-color: #1A1A1A;
  border: 3px solid #000000;
  border-radius: 12px;
  font-weight: 700;
  font-family: 'Nunito', sans-serif;
  font-size: 1rem;
  color: #FFFFFF;
  outline: none;
  transition: all 0.2s;
}

.neo-input:focus {
  border-color: #FF8A65;
  box-shadow: 4px 4px 0px 0px #000000;
}

.search-input {
  flex: 2;
  min-width: 250px;
}

.select-input {
  flex: 1;
  min-width: 160px;
}

/* Grid Catalog */
.grid-catalog {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

/* Pet Card layout */
.pet-card {
  background-color: var(--color-card-bg);
  border: 3px solid #000000;
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 4px 0px 0px #000000;
  cursor: pointer;
  transition: all 0.2s;
}

.pet-card:hover {
  transform: translateY(-4px);
  box-shadow: 6px 6px 0px 0px #000000;
}

.img-wrapper {
  height: 230px;
  width: 100%;
  border-bottom: 3px solid #000000;
  background-color: #1A1A1A;
  overflow: hidden;
  position: relative;
}

.pet-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.pet-card:hover .pet-img {
  transform: scale(1.04);
}

.wishlist-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border: 3px solid #000000;
  background-color: rgba(26, 26, 26, 0.85);
  color: #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 2px 2px 0px #000000;
  transition: all 0.2s;
  z-index: 10;
}

.wishlist-btn:hover {
  transform: translateY(-2px);
  box-shadow: 3px 3px 0px #000000;
  color: #FF6B6B;
}

.wishlist-btn.wishlisted {
  color: #FF6B6B;
  background-color: #FFFFFF;
}

.species-badge {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  background-color: #B39DDB;
  color: #1A1A1A;
  border: 2px solid #000000;
  border-radius: 8px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 800;
  box-shadow: 2px 2px 0px #000000;
}

.status-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.6);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: #FFFFFF;
  font-family: 'Fredoka', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 0.1rem;
  text-transform: uppercase;
}

.pet-details {
  padding: 1.5rem 1.5rem 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
}

.pet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  gap: 0.5rem;
}

.pet-name {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: #111111;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 800;
  border: 2px solid #000000;
}

.health-badge {
  background-color: #4ADE80;
  color: #1A1A1A;
}

.pet-desc {
  font-size: 0.9rem;
  color: #2D3748;
  margin: 0 0 1.25rem 0;
  line-clamp: 2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
  height: 2.7rem;
}

.pet-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #FFFFFF;
  border: 2px solid #000000;
  padding: 0.5rem;
  border-radius: 10px;
}

.stat-item .icon {
  font-size: 1.1rem;
  color: #111111;
}

.stat-item .text {
  font-size: 0.8rem;
  font-weight: 700;
  color: #111111;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pet-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: auto;
}

.btn-details {
  width: 100%;
  background-color: #FF8A65;
  color: #1A1A1A;
  padding: 0.65rem;
  font-size: 0.9rem;
}

.btn-compare-toggle {
  width: 100%;
  background-color: #1A1A1A;
  color: #aaaaaa;
  border-color: #000000;
  font-size: 0.8rem;
  padding: 0.5rem;
}

.btn-compare-toggle.compared {
  background-color: #B39DDB;
  color: #1A1A1A;
}

.empty-state-wrapper {
  background-color: var(--color-card-bg);
  border: 3px solid #000000;
  border-radius: 24px;
  padding: 4rem 2rem;
  box-shadow: 4px 4px 0px #000000;
  text-align: center;
}

@media (max-width: 992px) {
  .catalog-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 768px) {
  .adoption-container { padding: 1rem; }
  .filter-group { flex-direction: column; }
  .search-input, .select-input { width: 100%; }
}
</style>
