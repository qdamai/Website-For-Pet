<template>
  <div class="radar-page h-[calc(100vh-100px)] flex flex-col">
    <div class="radar-header">
      <div class="flex items-center gap-4">
        <button class="btn-neo bg-white text-black" @click="router.back()">{{ langStore.t('back') }}</button>
        <h1 class="page-title">{{ langStore.t('radarMap') }}</h1>
      </div>
      <button class="btn-neo bg-blue" @click="locateUser(false)">Lokasi Saya</button>
    </div>

    <div class="map-container">
      <div v-if="loading" class="map-loading">
        <div class="spinner"></div>
        <p>Memindai Radar...</p>
      </div>

      <l-map 
        ref="mapRef" 
        v-model:zoom="zoom" 
        :center="center" 
        :useGlobalLeaflet="false"
        style="height: 100%; width: 100%; z-index: 1;"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        ></l-tile-layer>

        <!-- Lost Pets Markers -->
        <l-marker 
          v-for="pet in lostPets" 
          :key="'lost_'+pet.id" 
          :lat-lng="[pet.lat, pet.lng]"
          :icon="iconLost"
        >
          <l-popup>
            <div class="popup-card">
              <img :src="pet.photo" alt="Foto" class="popup-img">
              <h3 class="popup-title">{{ pet.name || 'Hewan Hilang' }}</h3>
              <p class="popup-meta">{{ pet.lastLocation }}</p>
              <span class="badge bg-red">Hilang</span>
              <button class="btn-neo popup-btn" @click="goToDetail('lost', pet.id)">Lihat Detail</button>
            </div>
          </l-popup>
        </l-marker>

        <!-- Found Pets Markers -->
        <l-marker 
          v-for="pet in foundPets" 
          :key="'found_'+pet.id" 
          :lat-lng="[pet.lat, pet.lng]"
          :icon="iconFound"
        >
          <l-popup>
            <div class="popup-card">
              <img :src="pet.photo" alt="Foto" class="popup-img">
              <h3 class="popup-title">Hewan Ditemukan</h3>
              <p class="popup-meta">{{ pet.foundLocation }}</p>
              <span class="badge bg-green">Ditemukan</span>
              <button class="btn-neo popup-btn" @click="goToDetail('found', pet.id)">Lihat Detail</button>
            </div>
          </l-popup>
        </l-marker>
        
        <!-- User Location Marker -->
        <l-marker v-if="userLocation" :lat-lng="userLocation" :icon="iconUser">
          <l-popup>Posisi Anda Saat Ini</l-popup>
        </l-marker>

      </l-map>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useLangStore } from '../stores/lang';

import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import L from 'leaflet';

const router = useRouter();
const langStore = useLangStore();

const zoom = ref(13);
const center = ref([-0.947083, 100.351111]); // Default to Padang
const mapRef = ref(null);

const lostPets = ref([]);
const foundPets = ref([]);
const loading = ref(true);
const userLocation = ref(null);

// Custom Icons using raw githubusercontent (stable and reliable)
const createIcon = (color) => {
  return L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const iconLost = createIcon('orange');
const iconFound = createIcon('green');
const iconUser = createIcon('blue');

onMounted(async () => {
  await fetchData();
  
  // Wait for map container to fully render then invalidate Leaflet size
  nextTick(() => {
    setTimeout(() => {
      if (mapRef.value && mapRef.value.leafletObject) {
        mapRef.value.leafletObject.invalidateSize();
      }
    }, 500);
  });

  locateUser(true);
});

const fetchData = async () => {
  try {
    const [lostSnap, foundSnap] = await Promise.all([
      getDocs(collection(db, 'lost_pets')),
      getDocs(collection(db, 'found_pets'))
    ]);
    
    // Filter pets that have valid coordinates
    lostPets.value = lostSnap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(p => p.lat && p.lng);
      
    foundPets.value = foundSnap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(p => p.lat && p.lng);
      
  } catch (err) {
    console.error("Gagal mengambil data peta:", err);
  } finally {
    loading.value = false;
  }
};

const locateUser = (silent = false) => {
  if (navigator.geolocation) {
    if (!silent) loading.value = true;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLocation.value = [pos.coords.latitude, pos.coords.longitude];
        center.value = userLocation.value;
        zoom.value = 15;
        if (!silent) loading.value = false;
        
        nextTick(() => {
          if (mapRef.value && mapRef.value.leafletObject) {
            mapRef.value.leafletObject.invalidateSize();
          }
        });
      },
      (err) => {
        if (!silent) alert('Gagal mendeteksi lokasi GPS Anda (Mungkin timeout atau ditolak).');
        if (!silent) loading.value = false;
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  } else {
    if (!silent) alert('Browser Anda tidak mendukung Geolocation.');
  }
};

const goToDetail = (type, id) => {
  router.push({ name: 'PetDetail', params: { type, id } });
};
</script>

<style scoped>
.radar-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  font-family: 'Nunito', sans-serif;
  background-color: var(--color-bg);
}

.radar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.page-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0;
}

.map-container {
  flex: 1;
  min-height: 500px;
  border: 3px solid #000000;
  border-radius: 24px;
  box-shadow: 4px 4px 0px 0px #000000;
  overflow: hidden;
  position: relative;
  z-index: 0;
}

.map-loading {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(18,18,18,0.9);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Fredoka', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: #FFFFFF;
}

.btn-neo {
  font-family: 'Fredoka', sans-serif;
  font-weight: 800;
  padding: 0.5rem 1rem;
  border: 3px solid #000000;
  border-radius: 12px;
  box-shadow: 3px 3px 0px 0px #000000;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.btn-neo:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.bg-blue { background-color: #64B5F6; color: #1A1A1A; }
.bg-red { background-color: #FF5252; color: white; }
.bg-green { background-color: #4ADE80; color: #1A1A1A; }

/* Popup Kartun Custom */
.popup-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 150px;
  color: #1A1A1A;
}

.popup-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border: 3px solid #000000;
  border-radius: 50%;
  margin-bottom: 0.5rem;
}

.popup-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.1rem;
  font-weight: 800;
  margin: 0;
}

.popup-meta {
  font-size: 0.8rem;
  font-weight: 700;
  margin: 0.25rem 0 0.5rem 0;
  color: #555555;
}

.badge {
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  border: 2px solid #000000;
  margin-bottom: 0.5rem;
}

.popup-btn {
  width: 100%;
  padding: 0.4rem;
  font-size: 0.85rem;
  background-color: #FF8A65;
  color: #1A1A1A;
  box-shadow: 2px 2px 0px #000000;
}

/* Fix Leaflet default popup override */
:deep(.leaflet-popup-content-wrapper) {
  border: 3px solid #000000;
  border-radius: 16px;
  box-shadow: 4px 4px 0px 0px #000000;
  background-color: #FFFFFF;
}
:deep(.leaflet-popup-tip) {
  border: 3px solid #000000;
  border-top: none;
  border-left: none;
  background-color: #FFFFFF;
}
</style>
