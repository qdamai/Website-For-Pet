<template>
  <div class="explore-container">
    
    <div class="explore-header">
      <h1 class="explore-title">{{ langStore.t('searchPet') }}</h1>
      <button class="btn-neo" @click="router.push({ name: 'Dashboard' })">{{ langStore.t('dashboard') }}</button>
    </div>

    <!-- Filters -->
    <div class="filter-card">
      <div class="filter-group">
        <input v-model="searchQuery" type="text" class="neo-input search-input" placeholder="Cari nama atau lokasi...">
        <select v-model="filterType" class="neo-input select-input">
          <option value="all">Semua Jenis</option>
          <option value="Kucing">Kucing</option>
          <option value="Anjing">Anjing</option>
          <option value="Burung">Burung</option>
          <option value="Kelinci">Kelinci</option>
        </select>
        <select v-model="tab" class="neo-input select-input">
          <option value="lost">Hewan Hilang</option>
          <option value="found">Hewan Ditemukan</option>
        </select>
      </div>
    </div>

    <!-- Content -->
    <div v-if="isLoading" class="grid-catalog">
      <SkeletonLoader v-for="i in 6" :key="i" height="350px" />
    </div>
    
    <div v-else-if="filteredPets.length === 0">
      <EmptyState title="Hewan Tidak Ditemukan" description="Coba ubah filter pencarian Anda." />
    </div>

    <div v-else class="grid-catalog">
      <div 
        v-for="pet in filteredPets" 
        :key="pet.id" 
        class="pet-card"
        @click="goToDetail(pet)"
      >
        <div class="img-wrapper">
          <img 
            :src="getPhotoSrc(pet)" 
            alt="Foto Hewan" 
            class="pet-img"
            @error="onImgError($event, pet)"
          >
        </div>
        <div class="pet-details">
          <div class="pet-header">
            <h3 class="pet-name">{{ pet.name || 'Hewan Ditemukan' }}</h3>
            <span class="badge" :class="pet.status === 'Missing' ? 'bg-orange' : 'bg-green'">
              {{ pet.status }}
            </span>
          </div>
          <p class="pet-info"><b>Jenis:</b> {{ pet.type }} {{ pet.color ? `(${pet.color})` : '' }}</p>
          <p class="pet-info"><b>Lokasi:</b> {{ pet.lastLocation || pet.foundLocation }}</p>
          
          <button class="btn-neo btn-full mt-auto">Lihat Detail</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePetStore } from '../stores/petStore';
import { useLangStore } from '../stores/lang';
import { getPetFallbackImage } from '../utils/helpers';
import SkeletonLoader from '../components/SkeletonLoader.vue';
import EmptyState from '../components/EmptyState.vue';

const router = useRouter();
const petStore = usePetStore();
const langStore = useLangStore();

const tab = ref('lost');
const searchQuery = ref('');
const filterType = ref('all');
const isLoading = ref(true);

// Returns the best available photo src for a pet
const getPhotoSrc = (pet) => {
  // If photo is a valid http/https URL or a data URL, use it; else use fallback
  const p = pet.photo;
  if (p && (p.startsWith('http') || p.startsWith('data:'))) {
    return p;
  }
  return getPetFallbackImage(pet.type);
};

// When img fails to load, swap to fallback immediately
const onImgError = (event, pet) => {
  event.target.src = getPetFallbackImage(pet.type);
  event.target.onerror = null; // prevent infinite loop
};

onMounted(async () => {
  isLoading.value = true;
  try {
    await Promise.all([
      petStore.fetchLostPets(),
      petStore.fetchFoundPets()
    ]);
  } finally {
    isLoading.value = false;
  }
});

const filteredPets = computed(() => {
  let list = tab.value === 'lost' ? petStore.lostPets : petStore.foundPets;
  
  if (filterType.value !== 'all') {
    list = list.filter(p => p.type === filterType.value);
  }
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(p => 
      (p.name && p.name.toLowerCase().includes(q)) || 
      (p.lastLocation && p.lastLocation.toLowerCase().includes(q)) ||
      (p.foundLocation && p.foundLocation.toLowerCase().includes(q))
    );
  }
  
  return list;
});

const goToDetail = (pet) => {
  const id = tab.value === 'lost' ? (pet.petId || pet.id) : (pet.reportId || pet.id);
  router.push({ name: 'PetDetail', params: { type: tab.value, id } });
};
</script>

<style scoped>
.explore-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Nunito', sans-serif;
  min-height: 100vh;
}

.explore-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.explore-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0;
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

.btn-full {
  width: 100%;
}

.mt-auto {
  margin-top: auto;
}

/* Filters */
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
  flex: 1;
  min-width: 250px;
}

.select-input {
  min-width: 180px;
}

/* Catalog Grid */
.grid-catalog {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

/* Pet Card */
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
  height: 100%;
}

.pet-card:hover {
  transform: translateY(-4px);
  box-shadow: 6px 6px 0px 0px #000000;
}

.img-wrapper {
  height: 250px;
  width: 100%;
  border-bottom: 3px solid #000000;
  background-color: #1A1A1A;
  overflow: hidden;
}

.pet-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pet-details {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.pet-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 0.5rem;
}

.pet-name {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0;
  word-break: break-word;
}

.badge {
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 800;
  border: 2px solid #000000;
  white-space: nowrap;
}

.bg-orange { background-color: #FF8A65; color: #1A1A1A; }
.bg-green { background-color: #4ADE80; color: #1A1A1A; }

.pet-info {
  font-size: 1rem;
  color: #aaaaaa;
  margin: 0 0 0.5rem 0;
}

@media (max-width: 768px) {
  .explore-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .filter-group {
    flex-direction: column;
  }
  .search-input, .select-input {
    width: 100%;
  }
}
</style>
