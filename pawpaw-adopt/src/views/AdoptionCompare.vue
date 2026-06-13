<template>
  <div class="compare-container">
    
    <div class="compare-header">
      <div>
        <h1 class="compare-title">Bandingkan Anabul 📊</h1>
        <p class="compare-subtitle">Bandingkan karakteristik 2 sampai 3 anabul sekaligus untuk mempermudah keputusan adopsi Anda.</p>
      </div>
      <button @click="clearCompare" class="btn-neo btn-clear">
        Hapus Semua
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="comparedPets.length === 0" class="empty-compare-card">
      <span class="icon">📊</span>
      <h3 class="card-title mt-4">Belum Ada Hewan Terpilih</h3>
      <p class="text-gray mb-6">Pilih tombol "Bandingkan Anabul" pada kartu katalog hewan di portal adopsi untuk mulai membandingkan.</p>
      <router-link to="/adoption" class="btn-neo btn-explore-link">Cari Hewan</router-link>
    </div>

    <!-- Comparison Table -->
    <div v-else class="table-card">
      <div class="table-scroll">
        <table class="compare-table">
          <thead>
            <tr>
              <th class="spec-label-col">Karakteristik</th>
              <th v-for="pet in comparedPets" :key="pet.id" class="pet-header-col">
                <div class="pet-summary">
                  <button @click="removeSingleCompare(pet.id)" class="remove-btn">&times;</button>
                  <img :src="pet.photo" :alt="pet.name" class="pet-img" />
                  <h3 class="pet-name">{{ pet.name }}</h3>
                  <span class="badge breed-badge">{{ pet.breed }}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- Species -->
            <tr>
              <td class="lbl-cell">Jenis Hewan</td>
              <td v-for="pet in comparedPets" :key="pet.id" class="val-cell">
                {{ pet.species === 'Cat' ? 'Kucing' : pet.species === 'Dog' ? 'Anjing' : pet.species }}
              </td>
            </tr>

            <!-- Age -->
            <tr>
              <td class="lbl-cell">Umur</td>
              <td v-for="pet in comparedPets" :key="pet.id" class="val-cell">
                {{ pet.age }} Tahun
              </td>
            </tr>

            <!-- Weight -->
            <tr>
              <td class="lbl-cell">Berat Badan</td>
              <td v-for="pet in comparedPets" :key="pet.id" class="val-cell">
                {{ pet.weight }} Kg
              </td>
            </tr>

            <!-- Gender -->
            <tr>
              <td class="lbl-cell">Jenis Kelamin</td>
              <td v-for="pet in comparedPets" :key="pet.id" class="val-cell">
                {{ pet.gender === 'Male' ? 'Jantan' : 'Betina' }}
              </td>
            </tr>

            <!-- Location -->
            <tr>
              <td class="lbl-cell">Lokasi</td>
              <td v-for="pet in comparedPets" :key="pet.id" class="val-cell">
                {{ pet.location }}
              </td>
            </tr>

            <!-- Vaccinated -->
            <tr>
              <td class="lbl-cell">Status Vaksin</td>
              <td v-for="pet in comparedPets" :key="pet.id" class="val-cell">
                <span class="badge" :class="pet.vaccinated ? 'bg-green' : 'bg-red'">
                  {{ pet.vaccinated ? 'Sudah Vaksin' : 'Belum Vaksin' }}
                </span>
              </td>
            </tr>

            <!-- Spayed / Sterilized -->
            <tr>
              <td class="lbl-cell">Sterilisasi</td>
              <td v-for="pet in comparedPets" :key="pet.id" class="val-cell">
                <span class="badge" :class="pet.sterilized ? 'bg-green' : 'bg-red'">
                  {{ pet.sterilized ? 'Sudah Steril' : 'Belum Steril' }}
                </span>
              </td>
            </tr>

            <!-- Energy Level -->
            <tr>
              <td class="lbl-cell">Tingkat Energi</td>
              <td v-for="pet in comparedPets" :key="pet.id" class="val-cell">
                <div class="energy-stars">
                  <span v-for="i in 3" :key="i" :class="{ 'filled-star': i <= (pet.traits?.energyLevel || 1) }">⚡</span>
                </div>
              </td>
            </tr>

            <!-- Character Tags -->
            <tr>
              <td class="lbl-cell">Kesesuaian Sosial</td>
              <td v-for="pet in comparedPets" :key="pet.id" class="val-cell text-xs">
                <span v-if="pet.traits?.childFriendly" class="social-tag">👶 Ramah Anak</span>
                <span v-if="pet.traits?.petFriendly" class="social-tag">🐾 Ramah Hewan</span>
                <span v-if="!pet.traits?.childFriendly && !pet.traits?.petFriendly">-</span>
              </td>
            </tr>

            <!-- Actions Row -->
            <tr class="actions-row">
              <td></td>
              <td v-for="pet in comparedPets" :key="pet.id" class="val-cell">
                <button @click="goToPet(pet.id)" class="btn-neo btn-adopt">
                  Adopsi {{ pet.name }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const router = useRouter();
const comparedPets = ref([]);
const compareIds = ref([]);

onMounted(async () => {
  compareIds.value = JSON.parse(localStorage.getItem('adopt_compare') || '[]');
  await fetchComparedPets();
});

const fetchComparedPets = async () => {
  const list = [];
  for (const petId of compareIds.value) {
    try {
      const docRef = doc(db, 'adoption_pets', petId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        list.push(snap.data());
      }
    } catch (err) {
      console.error("Gagal mengambil data pembanding:", err);
    }
  }
  comparedPets.value = list;
};

const removeSingleCompare = (id) => {
  compareIds.value = compareIds.value.filter(petId => petId !== id);
  localStorage.setItem('adopt_compare', JSON.stringify(compareIds.value));
  comparedPets.value = comparedPets.value.filter(p => p.id !== id);
};

const clearCompare = () => {
  localStorage.removeItem('adopt_compare');
  comparedPets.value = [];
  compareIds.value = [];
};

const goToPet = (id) => {
  router.push(`/adoption/pet/${id}`);
};
</script>

<style scoped>
.compare-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
  font-family: 'Nunito', sans-serif;
  min-height: 100vh;
  background-color: var(--color-bg);
}

.compare-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.compare-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0;
}

.compare-subtitle {
  font-size: 1.1rem;
  font-weight: 700;
  color: #aaaaaa;
  margin-top: 0.5rem;
  max-width: 700px;
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

.btn-clear {
  background-color: #FF6B6B;
  color: #FFFFFF;
}

/* Empty State */
.empty-compare-card {
  background-color: var(--color-card-bg);
  border: 3px solid #000000;
  border-radius: 24px;
  padding: 4rem 2rem;
  box-shadow: 6px 6px 0px #000000;
  text-align: center;
}

.empty-compare-card .icon {
  font-size: 4rem;
  display: block;
}

.empty-compare-card .card-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: #FFFFFF;
}

.text-gray {
  color: #aaaaaa;
  font-weight: 600;
}

.btn-explore-link {
  background-color: #B39DDB;
  color: #1A1A1A;
}

/* Comparison Table */
.table-card {
  background-color: var(--color-card-bg);
  border: 3px solid #000000;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 6px 6px 0px #000000;
  overflow: hidden;
}

.table-scroll {
  overflow-x: auto;
  border: 3px solid #000000;
  border-radius: 16px;
}

.compare-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
}

.compare-table th {
  border-bottom: 3px solid #000000;
  border-right: 3px solid #000000;
  background-color: #1a1a1a;
  padding: 1.5rem;
  vertical-align: bottom;
}

.compare-table th:last-child {
  border-right: none;
}

.spec-label-col {
  width: 25%;
  font-family: 'Fredoka', sans-serif;
  font-weight: 800;
  font-size: 1.1rem;
  color: #B39DDB;
  text-align: left;
  background-color: #1a1a1a !important;
}

.pet-header-col {
  width: 25%;
}

.pet-summary {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
}

.remove-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 24px;
  height: 24px;
  background-color: #FF6B6B;
  color: #FFFFFF;
  border: 2px solid #000000;
  border-radius: 50%;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 1px 1px 0px #000000;
}

.remove-btn:hover {
  transform: scale(1.1);
}

.pet-img {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #000000;
  box-shadow: 2px 2px 0px #000000;
}

.pet-name {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.25rem;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0;
}

.breed-badge {
  background-color: #FFF176;
  color: #1A1A1A;
}

/* Table Body rows */
.compare-table td {
  padding: 1rem 1.5rem;
  border-bottom: 3px solid #000000;
  border-right: 3px solid #000000;
  background-color: #1a1a1a;
  color: #FFFFFF;
  font-weight: 700;
}

.compare-table td:last-child {
  border-right: none;
}

.compare-table tr:last-child td {
  border-bottom: none;
}

.lbl-cell {
  background-color: #262626 !important;
  color: #aaaaaa !important;
}

.val-cell {
  text-align: center;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border: 2px solid #000000;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 800;
}

.bg-green { background-color: #4ADE80; color: #1A1A1A; }
.bg-red { background-color: #FF6B6B; color: #ffffff; }

/* Energy & Social styles */
.energy-stars {
  font-size: 1.25rem;
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  color: #555555;
}

.filled-star {
  color: #FFF176;
}

.social-tag {
  display: inline-block;
  background-color: #262626;
  border: 2px solid #000000;
  border-radius: 8px;
  padding: 0.25rem 0.5rem;
  margin-right: 0.25rem;
  margin-bottom: 0.25rem;
}

/* Actions Row */
.actions-row td {
  background-color: #262626 !important;
  border-bottom: none;
}

.btn-adopt {
  background-color: #4ADE80;
  color: #1A1A1A;
  font-size: 0.85rem;
  padding: 0.6rem;
  width: 100%;
}
</style>
