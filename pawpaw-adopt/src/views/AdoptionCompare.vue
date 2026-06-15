<template>
  <div class="compare-container">
    
    <div class="compare-header">
      <div>
        <h1 class="compare-title">Bandingkan Anabul <BarChart2 :size="18" class="inline" /></h1>
        <p class="compare-subtitle">Bandingkan karakteristik 2 sampai 3 anabul sekaligus untuk mempermudah keputusan adopsi Anda.</p>
      </div>
      <button @click="clearCompare" class="btn-neo btn-clear">
        Hapus Semua
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="comparedPets.length === 0" class="empty-compare-card">
      <span class="icon"><BarChart2 :size="18" class="inline" /></span>
      <h3 class="card-title mt-4">Belum Ada Hewan Terpilih</h3>
      <p class="text-gray mb-6">Pilih tombol "Bandingkan Anabul" pada kartu katalog hewan di portal adopsi untuk mulai membandingkan.</p>
      <router-link to="/" class="btn-neo btn-explore-link">Cari Hewan</router-link>
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
                  <span v-for="i in 3" :key="i" :class="{ 'filled-star': i <= (pet.traits?.energyLevel || 1) }"><Zap class="inline" /></span>
                </div>
              </td>
            </tr>

            <!-- Character Tags -->
            <tr>
              <td class="lbl-cell">Kesesuaian Sosial</td>
              <td v-for="pet in comparedPets" :key="pet.id" class="val-cell text-xs">
                <span v-if="pet.traits?.childFriendly" class="social-tag"><Baby class="inline" /> Ramah Anak</span>
                <span v-if="pet.traits?.petFriendly" class="social-tag"><PawPrint :size="18" class="inline" /> Ramah Hewan</span>
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
import { FileText, MessageSquare, MapPin, Settings, Home, Camera, Calendar, PawPrint, Dog, Cat, AlertTriangle, XCircle, CheckCircle, Target, Heart, BarChart2, Dna, Cake, Scale, Sun, Moon, Baby, Zap } from 'lucide-vue-next';
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
      const docRef = doc(db, 'adopt_pets', petId);
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
  router.push(`/pet/${id}`);
};
</script>

<style scoped>
.compare-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem 3rem 2rem; /* pt-16 equivalent */
  font-family: 'Nunito', sans-serif;
  min-height: 100vh;
  background-color: var(--color-bg);
}

.compare-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem; /* Increased spacing */
  flex-wrap: wrap;
  gap: 2rem;
}

.compare-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 2.5rem;
  font-weight: 900; /* Font-black */
  color: #111111;
  margin: 0;
}

.compare-subtitle {
  font-size: 1.1rem;
  font-weight: 700;
  color: #4A4A4A;
  margin-top: 1rem;
  max-width: 700px;
}

[data-theme='dark'] .compare-title { color: #FFFFFF; }
[data-theme='dark'] .compare-subtitle { color: #AAAAAA; }

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

.btn-clear {
  background-color: #FF6B6B;
  color: #111111;
}

/* Empty State */
.empty-compare-card {
  background-color: var(--color-card-bg);
  border: var(--border-width) solid var(--color-border);
  border-radius: 24px;
  padding: 4rem 2rem;
  box-shadow: var(--shadow-neo-hover);
  text-align: center;
}

.empty-compare-card .icon {
  font-size: 4rem;
  display: block;
  color: var(--color-text-dark);
}

.empty-compare-card .card-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.5rem;
  font-weight: 900;
  color: #111111;
}

.text-gray {
  color: #4A4A4A;
  font-weight: 700;
}

[data-theme='dark'] .empty-compare-card .card-title { color: #FFFFFF; }
[data-theme='dark'] .text-gray { color: #AAAAAA; }

.btn-explore-link {
  background-color: #B39DDB;
  color: #111111;
  text-decoration: none;
  display: inline-block;
}

/* Comparison Table */
.table-card {
  background-color: var(--color-card-bg);
  border: var(--border-width) solid var(--color-border);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: var(--shadow-neo-hover);
  overflow: hidden;
}

.table-scroll {
  overflow-x: auto;
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-lg);
}

.compare-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
}

.compare-table th {
  border-bottom: var(--border-width) solid var(--color-border);
  border-right: var(--border-width) solid var(--color-border);
  background-color: var(--color-card-bg);
  padding: 1.5rem;
  vertical-align: bottom;
}

.compare-table th:last-child {
  border-right: none;
}

.spec-label-col {
  width: 25%;
  font-family: 'Fredoka', sans-serif;
  font-weight: 900;
  font-size: 1.1rem;
  color: var(--color-primary);
  text-align: left;
  background-color: var(--color-bg) !important;
  text-shadow: 1px 1px 0px #000;
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
  color: #111111;
  border: var(--border-width) solid var(--color-border);
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
  border: var(--border-width) solid var(--color-border);
  box-shadow: var(--shadow-neo-active);
}

.pet-name {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--color-text-dark);
  margin: 0;
}

.breed-badge {
  background-color: #FFF176;
  color: #111111;
}

/* Table Body rows */
.compare-table td {
  padding: 1.25rem 1.5rem; /* Better row gap */
  border-bottom: var(--border-width) solid var(--color-border);
  border-right: var(--border-width) solid var(--color-border);
  background-color: var(--color-card-bg);
  color: var(--color-text-dark);
  font-weight: 700;
}

.compare-table td:last-child {
  border-right: none;
}

.compare-table tr:last-child td {
  border-bottom: none;
}

.lbl-cell {
  background-color: var(--color-bg) !important;
  color: var(--color-text-dark) !important;
  font-weight: 800;
}

.val-cell {
  text-align: center;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 0.75rem;
  font-weight: 800;
}

.bg-green { background-color: #4ADE80; color: #111111; }
.bg-red { background-color: #FF6B6B; color: #111111; }

/* Energy & Social styles */
.energy-stars {
  font-size: 1.25rem;
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  color: #CCCCCC;
}

.filled-star {
  color: #FFB300;
  text-shadow: 1px 1px 0px #000;
}

.social-tag {
  display: inline-block;
  background-color: #FFF176;
  color: #111111;
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.35rem 0.65rem;
  margin-right: 0.25rem;
  margin-bottom: 0.25rem;
  font-weight: 800;
}

/* Actions Row */
.actions-row td {
  background-color: var(--color-bg) !important;
  border-bottom: none;
}

.btn-adopt {
  background-color: #4ADE80;
  color: #111111;
  font-size: 0.9rem;
  padding: 0.75rem;
  width: 100%;
}
</style>
