<template>
  <div class="dashboard-container">
    
    <!-- Dashboard Header -->
    <div class="dashboard-header-card">
      <div>
        <span class="role-badge">Role: {{ isShelter ? 'SHELTER PARTNER' : 'ADOPTER' }}</span>
        <h1 class="welcome-title">Halo, {{ authStore.profile?.fullname || 'Pengguna' }}!</h1>
        <p class="welcome-subtitle">Kelola seluruh kebutuhan adopsi anabul Anda di sini secara transparan.</p>
      </div>
    </div>

    <!-- Analytics Dashboard for Shelter -->
    <div v-if="isShelter" class="stats-grid">
      <div class="stat-card bg-blue">
        <span class="num">{{ shelterStats.totalPets }}</span>
        <span class="lbl">Total Hewan</span>
      </div>
      <div class="stat-card bg-green">
        <span class="num">{{ shelterStats.availablePets }}</span>
        <span class="lbl">Tersedia</span>
      </div>
      <div class="stat-card bg-yellow">
        <span class="num">{{ shelterStats.adoptedPets }}</span>
        <span class="lbl">Diadopsi</span>
      </div>
      <div class="stat-card bg-orange">
        <span class="num">{{ shelterStats.newRequests }}</span>
        <span class="lbl">Pengajuan Baru</span>
      </div>
    </div>

    <!-- Main Dashboard Grid Layout -->
    <div class="dashboard-grid">
      
      <!-- Sidebar Navigation Menu -->
      <aside class="sidebar-menu">
        <button 
          v-for="tab in visibleTabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="menu-btn"
          :class="{ 'active-btn': activeTab === tab.id }"
        >
          <span class="icon">{{ tab.icon }}</span>
          <span class="text">{{ tab.name }}</span>
        </button>
      </aside>

      <!-- Content Column -->
      <main class="content-display">
        <div v-if="loadingData" class="loading-state text-center font-bold py-10">
          Memuat data dashboard...
        </div>

        <div v-else>
          <!-- ================= ADOPTER USER TABS ================= -->
          
          <!-- Tab: Pengajuan Saya (My Requests) -->
          <section v-if="activeTab === 'my_requests'" class="dashboard-section">
            <h2 class="section-title">Status Pengajuan Adopsi</h2>
            <div v-if="userRequests.length === 0" class="empty-dashboard-state">
              <span class="icon">📝</span>
              <p class="text">Anda belum pernah mengirim pengajuan adopsi anabul apa pun.</p>
              <router-link to="/adoption" class="btn-neo mt-4">Jelajahi Katalog</router-link>
            </div>
            
            <div v-else class="requests-list">
              <div v-for="req in userRequests" :key="req.id" class="request-item-card">
                <div class="req-header-row">
                  <div class="pet-info-header">
                    <img :src="req.petPhoto" alt="Anabul" class="req-pet-img" />
                    <div>
                      <h3 class="req-pet-name">{{ req.petName }}</h3>
                      <span class="req-date">Diajukan pada: {{ formatDate(req.createdAt) }}</span>
                    </div>
                  </div>
                  <span class="req-status-badge" :class="req.status.toLowerCase().replace(/ /g, '-')">
                    {{ req.status }}
                  </span>
                </div>

                <!-- Timeline / Stepper Progress -->
                <div class="stepper-timeline">
                  <div 
                    v-for="(step, idx) in timelineSteps" 
                    :key="step" 
                    class="step-item"
                    :class="{ 
                      'step-active': getStepIndex(req.status) >= idx,
                      'step-danger': req.status === 'Rejected' && idx === getStepIndex(req.status)
                    }"
                  >
                    <div class="step-circle">{{ idx + 1 }}</div>
                    <div class="step-label">{{ step }}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Tab: Jadwal Kunjungan (My Appointments) -->
          <section v-if="activeTab === 'my_appointments'" class="dashboard-section">
            <h2 class="section-title">Jadwal Kunjungan Shelter</h2>
            <div v-if="userAppointments.length === 0" class="empty-dashboard-state">
              <span class="icon">📅</span>
              <p class="text">Belum ada jadwal kunjungan terdaftar.</p>
            </div>
            
            <div v-else class="appointments-grid">
              <div v-for="apt in userAppointments" :key="apt.id" class="apt-item-card">
                <div class="apt-header">
                  <img :src="apt.petPhoto" alt="Pet" class="apt-pet-img" />
                  <div>
                    <h3 class="apt-pet-name">{{ apt.petName }}</h3>
                    <span class="apt-id">ID Kunjungan: #{{ apt.id.substring(0,8).toUpperCase() }}</span>
                  </div>
                </div>
                <div class="apt-details border-t-2 border-black my-4 pt-3">
                  <p>📅 Tanggal: <b>{{ apt.date }}</b></p>
                  <p>🕒 Jam: <b>{{ apt.time }} WIB</b></p>
                  <p>📝 Catatan: {{ apt.notes || '-' }}</p>
                </div>
                <span class="badge apt-status" :class="apt.status.toLowerCase()">
                  {{ apt.status }}
                </span>
              </div>
            </div>
          </section>

          <!-- Tab: Wishlist/Favorites -->
          <section v-if="activeTab === 'my_wishlist'" class="dashboard-section">
            <h2 class="section-title">Wishlist Saya</h2>
            <div v-if="wishlistPets.length === 0" class="empty-dashboard-state">
              <span class="icon">💖</span>
              <p class="text">Katalog favorit Anda kosong. Klik icon hati pada katalog adopsi.</p>
            </div>
            
            <div v-else class="grid-wishlist">
              <div v-for="pet in wishlistPets" :key="pet.id" class="wish-item-card" @click="router.push(`/adoption/pet/${pet.id}`)">
                <img :src="pet.photo" alt="Photo" class="wish-img" />
                <div class="wish-info">
                  <h4>{{ pet.name }}</h4>
                  <p>{{ pet.species }} &bull; {{ pet.breed }}</p>
                  <span class="badge">{{ pet.location }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Tab: Notification Center -->
          <section v-if="activeTab === 'notifications'" class="dashboard-section">
            <h2 class="section-title">Notifikasi Sistem</h2>
            <div v-if="userNotifications.length === 0" class="empty-dashboard-state">
              <span class="icon">🔔</span>
              <p class="text">Tidak ada notifikasi sistem masuk.</p>
            </div>
            
            <div v-else class="notifications-list">
              <div 
                v-for="notif in userNotifications" 
                :key="notif.id" 
                class="notif-item-card"
                :class="{ 'notif-unread': !notif.read }"
                @click="markNotifRead(notif.id)"
              >
                <div class="notif-bullet"></div>
                <div>
                  <h4 class="notif-title">{{ notif.title }}</h4>
                  <p class="notif-body">{{ notif.body }}</p>
                </div>
              </div>
            </div>
          </section>


          <!-- ================= SHELTER MITRA TABS ================= -->
          
          <!-- Tab: Kelola Hewan (Manage Pets) -->
          <section v-if="activeTab === 'shelter_pets'" class="dashboard-section">
            <div class="flex justify-between items-center mb-6">
              <h2 class="section-title">Kelola Hewan Adopsi</h2>
              <button @click="openAddPetModal" class="btn-neo btn-add">Tambah Hewan +</button>
            </div>

            <div v-if="shelterPets.length === 0" class="empty-dashboard-state">
              <span class="icon">🐶</span>
              <p class="text">Anda belum mendaftarkan anabul di shelter Anda.</p>
            </div>

            <div v-else class="requests-list">
              <div v-for="pet in shelterPets" :key="pet.id" class="request-item-card">
                <div class="flex justify-between items-center flex-wrap gap-4">
                  <div class="flex items-center gap-4">
                    <img :src="pet.photo" alt="Photo" class="req-pet-img" />
                    <div>
                      <h3 class="req-pet-name">{{ pet.name }}</h3>
                      <p class="text-xs text-gray">{{ pet.species }} &bull; {{ pet.breed }}</p>
                    </div>
                  </div>
                  
                  <div class="flex gap-2">
                    <button @click="openEditPassport(pet)" class="btn-neo btn-med">🏥 Passport</button>
                    <button @click="openEditPetModal(pet)" class="btn-neo btn-edit">📝 Edit</button>
                    <button @click="deletePet(pet.id)" class="btn-neo btn-delete">🗑️ Hapus</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Tab: Kelola Pengajuan (Manage Requests) -->
          <section v-if="activeTab === 'shelter_requests'" class="dashboard-section">
            <h2 class="section-title">Kelola Pengajuan Masuk</h2>
            <div v-if="shelterRequests.length === 0" class="empty-dashboard-state">
              <span class="icon">📩</span>
              <p class="text">Tidak ada berkas pengajuan masuk.</p>
            </div>

            <div v-else class="requests-list">
              <div v-for="req in shelterRequests" :key="req.id" class="request-item-card">
                <div class="req-header-row mb-4">
                  <div class="pet-info-header">
                    <img :src="req.petPhoto" alt="Anabul" class="req-pet-img" />
                    <div>
                      <h3 class="req-pet-name">{{ req.petName }}</h3>
                      <p class="text-xs text-gray">Pemohon: <b>{{ req.fullName }}</b> ({{ req.email }})</p>
                    </div>
                  </div>
                  <span class="req-status-badge" :class="req.status.toLowerCase().replace(/ /g, '-')">
                    {{ req.status }}
                  </span>
                </div>

                <div class="req-detail-box">
                  <p>📍 <b>Alamat:</b> {{ req.address }}, {{ req.city }}</p>
                  <p>📞 <b>Kontak:</b> {{ req.phone }}</p>
                  <p>💼 <b>Pekerjaan &amp; Pendapatan:</b> {{ req.job }} ({{ req.income }})</p>
                  <p>🏠 <b>Pengalaman Memelihara:</b> {{ req.experience }}</p>
                  <p>📝 <b>Alasan Mengadopsi:</b> {{ req.reason }}</p>
                </div>

                <div class="flex justify-end gap-2 mt-4 flex-wrap">
                  <button v-if="req.status === 'Application Submitted'" @click="updateRequestStatus(req, 'Under Review')" class="btn-neo btn-med">Review Berkas</button>
                  <button v-if="req.status === 'Under Review'" @click="openInterviewModal(req)" class="btn-neo btn-edit">Jadwalkan Interview</button>
                  <button v-if="req.status === 'Interview Scheduled' || req.status === 'Interview Completed'" @click="updateRequestStatus(req, 'Approved')" class="btn-neo btn-submit-apt">Approve Adopsi</button>
                  <button v-if="req.status === 'Approved'" @click="updateRequestStatus(req, 'Adopted')" class="btn-neo btn-share">Serah Terima Selesai 🤝</button>
                  <button v-if="req.status !== 'Approved' && req.status !== 'Adopted' && req.status !== 'Rejected'" @click="updateRequestStatus(req, 'Rejected')" class="btn-neo btn-delete">Tolak</button>
                </div>
              </div>
            </div>
          </section>


          <!-- ================= SHARED REALTIME CHAT TAB ================= -->
          <section v-if="activeTab === 'chat'" class="dashboard-section chat-section">
            <h2 class="section-title">Chat Realtime</h2>
            
            <div class="chat-wrapper-box">
              <!-- Sidebar Rooms -->
              <div class="chat-rooms-sidebar">
                <div v-if="chatRooms.length === 0" class="no-rooms text-center text-xs text-gray py-10">
                  Tidak ada percakapan aktif.
                </div>
                <div 
                  v-for="room in chatRooms" 
                  :key="room.id"
                  @click="selectRoom(room)"
                  class="room-item"
                  :class="{ 'active-room': activeRoom?.id === room.id }"
                >
                  <img :src="room.petPhoto || 'https://api.dicebear.com/7.x/notionists/svg?seed=' + room.id" class="room-img" />
                  <div class="room-info">
                    <h4>{{ isShelter ? 'Calon Adopter' : 'Shelter Partner' }}</h4>
                    <p class="room-last">{{ room.lastMessage }}</p>
                    <span class="room-pet-tag">Hewan: {{ room.petName }}</span>
                  </div>
                </div>
              </div>

              <!-- Stream Chat Area -->
              <div class="chat-stream-area">
                <template v-if="activeRoom">
                  <div class="chat-room-header">
                    <h4>Percakapan membahas {{ activeRoom.petName }}</h4>
                  </div>
                  
                  <div class="chat-messages-container" ref="messagesContainer">
                    <div 
                      v-for="msg in messages" 
                      :key="msg.id"
                      class="msg-bubble"
                      :class="msg.senderId === authStore.user.uid ? 'my-msg' : 'their-msg'"
                    >
                      <span class="msg-sender" v-if="msg.senderId !== authStore.user.uid">{{ msg.senderName }}</span>
                      <p class="msg-text">{{ msg.text }}</p>
                    </div>
                  </div>

                  <form @submit.prevent="sendChatMessage" class="chat-input-bar">
                    <input 
                      v-model="newMessageText"
                      type="text" 
                      placeholder="Ketik pesan Anda..." 
                      required 
                      class="neo-input flex-1"
                    />
                    <button type="submit" class="btn-neo btn-send">Kirim</button>
                  </form>
                </template>
                <div v-else class="empty-chat-stream flex flex-col items-center justify-center text-center py-20">
                  <span class="text-4xl">💬</span>
                  <p class="text-gray text-xs mt-2">Pilih salah satu percakapan di samping untuk mulai membalas chat.</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

    </div>

    <!-- VISIT/INTERVIEW MODAL (SHELTER ROLE) -->
    <div v-if="showInterviewModal" class="neo-modal-overlay" @click.self="showInterviewModal = false">
      <div class="neo-modal-card">
        <button class="close-btn" @click="showInterviewModal = false">&times;</button>
        <h2 class="modal-title">Jadwalkan Interview</h2>
        <p class="modal-subtitle">Tentukan tanggal dan waktu interview/kunjungan calon adopter.</p>
        
        <form @submit.prevent="submitInterviewSchedule" class="modal-form">
          <div class="form-group">
            <label>Tanggal Wawancara</label>
            <input v-model="interviewForm.date" type="date" required class="neo-input" />
          </div>
          <div class="form-group">
            <label>Jam</label>
            <input v-model="interviewForm.time" type="time" required class="neo-input" />
          </div>
          <div class="form-group">
            <label>Catatan/Lokasi Interview</label>
            <textarea v-model="interviewForm.notes" rows="2" placeholder="Interview via WA Video Call / Datang langsung ke shelter..." class="neo-input resize-none"></textarea>
          </div>
          <button type="submit" class="btn-neo btn-submit">Simpan Jadwal</button>
        </form>
      </div>
    </div>

    <!-- HEALTH PASSPORT EDIT MODAL (SHELTER ROLE) -->
    <div v-if="showPassportModal" class="neo-modal-overlay" @click.self="showPassportModal = false">
      <div class="neo-modal-card">
        <button class="close-btn" @click="showPassportModal = false">&times;</button>
        <h2 class="modal-title">Edit Pet Health Passport</h2>
        <p class="modal-subtitle">Perbarui riwayat pemeriksaan kesehatan anabul {{ activePet?.name }}</p>
        
        <form @submit.prevent="submitHealthPassport" class="modal-form">
          <div class="form-row">
            <div class="form-group flex-1">
              <label>Status Vaksin</label>
              <select v-model="healthForm.vaccinated" class="neo-input">
                <option :value="true">Sudah Vaksin</option>
                <option :value="false">Belum Vaksin</option>
              </select>
            </div>
            <div class="form-group flex-1">
              <label>Sterilisasi</label>
              <select v-model="healthForm.sterilized" class="neo-input">
                <option :value="true">Sudah Steril</option>
                <option :value="false">Belum Steril</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group flex-1">
              <label>Alergi Makanan</label>
              <input v-model="healthForm.allergies" type="text" placeholder="Gandum, dll" class="neo-input" />
            </div>
            <div class="form-group flex-1">
              <label>Pemeriksaan Terakhir</label>
              <input v-model="healthForm.lastCheckupDate" type="date" class="neo-input" />
            </div>
          </div>
          <div class="form-group">
            <label>Catatan Riwayat Medis / Penyakit</label>
            <textarea v-model="healthForm.medicalHistory" rows="3" class="neo-input resize-none"></textarea>
          </div>
          <button type="submit" class="btn-neo btn-submit">Simpan Passport</button>
        </form>
      </div>
    </div>

    <!-- ADD/EDIT PET MODAL (SHELTER ROLE) -->
    <div v-if="showPetModal" class="neo-modal-overlay" @click.self="showPetModal = false">
      <div class="neo-modal-card">
        <button class="close-btn" @click="showPetModal = false">&times;</button>
        <h2 class="modal-title">{{ isEditingPet ? 'Edit Informasi Anabul' : 'Tambah Hewan Adopsi Baru' }}</h2>
        <p class="modal-subtitle">Isi rincian informasi hewan adopsi dengan lengkap.</p>
        
        <form @submit.prevent="submitPetForm" class="modal-form">
          <div class="form-row">
            <div class="form-group flex-1">
              <label>Nama Anabul</label>
              <input v-model="petForm.name" type="text" required class="neo-input" />
            </div>
            <div class="form-group flex-1">
              <label>Spesies (Cat, Dog, Rabbit, dll)</label>
              <select v-model="petForm.species" required class="neo-input">
                <option value="Cat">Kucing (Cat)</option>
                <option value="Dog">Anjing (Dog)</option>
                <option value="Rabbit">Kelinci (Rabbit)</option>
                <option value="Bird">Burung (Bird)</option>
                <option value="Hamster">Hamster</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group flex-1">
              <label>Ras</label>
              <input v-model="petForm.breed" type="text" required class="neo-input" />
            </div>
            <div class="form-group flex-1">
              <label>Jenis Kelamin</label>
              <select v-model="petForm.gender" required class="neo-input">
                <option value="Male">Jantan</option>
                <option value="Female">Betina</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group flex-1">
              <label>Umur (Tahun)</label>
              <input v-model.number="petForm.age" type="number" required class="neo-input" />
            </div>
            <div class="form-group flex-1">
              <label>Berat (Kg)</label>
              <input v-model.number="petForm.weight" type="number" step="0.1" required class="neo-input" />
            </div>
          </div>
          <div class="form-group">
            <label>Link Foto Utama (Unsplash/Imgur)</label>
            <input v-model="petForm.photo" type="url" required class="neo-input" />
          </div>
          <div class="form-group">
            <label>Deskripsi Singkat</label>
            <textarea v-model="petForm.description" rows="3" required class="neo-input resize-none"></textarea>
          </div>
          <button type="submit" class="btn-neo btn-submit">Simpan Informasi</button>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useWishlistStore } from '../stores/wishlist';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  setDoc, 
  updateDoc, 
  doc, 
  deleteDoc, 
  onSnapshot, 
  orderBy, 
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import SkeletonLoader from '../components/SkeletonLoader.vue';
import EmptyState from '../components/EmptyState.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const wishlistStore = useWishlistStore();

const activeTab = ref('');
const loadingData = ref(true);

const timelineSteps = [
  'Application Submitted',
  'Under Review',
  'Interview Scheduled',
  'Interview Completed',
  'Approved',
  'Adopted'
];

// Data variables
const userRequests = ref([]);
const userAppointments = ref([]);
const wishlistPets = ref([]);
const userNotifications = ref([]);
const shelterPets = ref([]);
const shelterRequests = ref([]);

// Realtime Chat variables
const chatRooms = ref([]);
const activeRoom = ref(null);
const messages = ref([]);
const newMessageText = ref('');
const messagesContainer = ref(null);

// Modal states
const showInterviewModal = ref(false);
const showPassportModal = ref(false);
const showPetModal = ref(false);
const isEditingPet = ref(false);

const activeRequest = ref(null);
const activePet = ref(null);

const interviewForm = ref({ date: '', time: '', notes: '' });
const healthForm = ref({ vaccinated: false, sterilized: false, allergies: '', lastCheckupDate: '', medicalHistory: '' });
const petForm = ref({ name: '', species: 'Cat', breed: '', gender: 'Male', age: 1, weight: 3.5, photo: '', description: '' });

// Observers listeners
let unsubConversations = null;
let unsubMessages = null;
let unsubNotifications = null;

const isShelter = computed(() => authStore.profile?.role === 'shelter');

const tabs = {
  adopter: [
    { id: 'my_requests', name: 'Pengajuan Adopsi', icon: '📝' },
    { id: 'my_appointments', name: 'Jadwal Kunjungan', icon: '📅' },
    { id: 'my_wishlist', name: 'Wishlist Saya', icon: '💖' },
    { id: 'notifications', name: 'Notifikasi', icon: '🔔' },
    { id: 'chat', name: 'Chat Realtime', icon: '💬' }
  ],
  shelter: [
    { id: 'shelter_pets', name: 'Kelola Hewan', icon: '🐱' },
    { id: 'shelter_requests', name: 'Pengajuan Masuk', icon: '📩' },
    { id: 'chat', name: 'Chat Realtime', icon: '💬' }
  ]
};

const visibleTabs = computed(() => {
  return isShelter.value ? tabs.shelter : tabs.adopter;
});

const shelterStats = computed(() => {
  const total = shelterPets.value.length;
  const available = shelterPets.value.filter(p => p.status === 'Available').length;
  const adopted = shelterPets.value.filter(p => p.status === 'Adopted').length;
  const news = shelterRequests.value.filter(r => r.status === 'Application Submitted').length;
  return { totalPets: total, availablePets: available, adoptedPets: adopted, newRequests: news };
});

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'Auth' });
    return;
  }
  
  // Set default active tab
  activeTab.value = visibleTabs.value[0]?.id;
  if (route.query.tab) {
    activeTab.value = route.query.tab;
  }

  await loadData();
  setupRealtimeListeners();
});

onUnmounted(() => {
  if (unsubConversations) unsubConversations();
  if (unsubMessages) unsubMessages();
  if (unsubNotifications) unsubNotifications();
});

watch(activeTab, async () => {
  await loadData();
});

const loadData = async () => {
  loadingData.value = true;
  const uid = authStore.user.uid;
  try {
    if (isShelter.value) {
      if (activeTab.value === 'shelter_pets') {
        const snap = await getDocs(query(collection(db, 'adoption_pets'), where('shelterId', '==', uid)));
        shelterPets.value = snap.docs.map(doc => doc.data());
      } else if (activeTab.value === 'shelter_requests') {
        const snap = await getDocs(query(collection(db, 'adoption_requests'), where('shelterId', '==', uid)));
        shelterRequests.value = snap.docs.map(doc => doc.data());
      }
    } else {
      if (activeTab.value === 'my_requests') {
        const snap = await getDocs(query(collection(db, 'adoption_requests'), where('adopterId', '==', uid)));
        userRequests.value = snap.docs.map(doc => doc.data());
      } else if (activeTab.value === 'my_appointments') {
        const snap = await getDocs(query(collection(db, 'appointments'), where('adopterId', '==', uid)));
        userAppointments.value = snap.docs.map(doc => doc.data());
      } else if (activeTab.value === 'my_wishlist') {
        await wishlistStore.fetchWishlist(uid);
        const list = [];
        for (const petId of wishlistStore.wishlistedIds) {
          const snap = await getDoc(doc(db, 'adoption_pets', petId));
          if (snap.exists()) list.push(snap.data());
        }
        wishlistPets.value = list;
      }
    }
  } catch (err) {
    console.error("Gagal memuat data dashboard:", err);
  } finally {
    loadingData.value = false;
  }
};

const setupRealtimeListeners = () => {
  const uid = authStore.user.uid;
  
  // 1. Chat rooms listener
  const qConv = query(collection(db, 'conversations'), where('participants', 'array-contains', uid));
  unsubConversations = onSnapshot(qConv, (snapshot) => {
    chatRooms.value = snapshot.docs.map(d => d.data());
    
    // Auto-select room from query if present
    if (route.query.room && chatRooms.value.length > 0) {
      const targetRoom = chatRooms.value.find(r => r.id === route.query.room);
      if (targetRoom) selectRoom(targetRoom);
    }
  });

  // 2. Notifications listener (only for adopter roles)
  if (!isShelter.value) {
    const qNotif = query(collection(db, 'notifications'), where('userId', '==', uid), orderBy('createdAt', 'desc'));
    unsubNotifications = onSnapshot(qNotif, (snapshot) => {
      userNotifications.value = snapshot.docs.map(d => d.data());
    });
  }
};

const selectRoom = (room) => {
  activeRoom.value = room;
  if (unsubMessages) unsubMessages();
  
  const qMsg = query(collection(db, `conversations/${room.id}/messages`), orderBy('timestamp', 'asc'));
  unsubMessages = onSnapshot(qMsg, (snapshot) => {
    messages.value = snapshot.docs.map(d => d.data());
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
      }
    });
  });
};

const sendChatMessage = async () => {
  if (!newMessageText.value.trim() || !activeRoom.value) return;
  const txt = newMessageText.value;
  newMessageText.value = '';

  const msgData = {
    senderId: authStore.user.uid,
    senderName: authStore.profile?.fullname || 'User',
    text: txt,
    timestamp: serverTimestamp()
  };

  try {
    await addDoc(collection(db, `conversations/${activeRoom.value.id}/messages`), msgData);
    await updateDoc(doc(db, 'conversations', activeRoom.value.id), {
      lastMessage: txt,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.error("Gagal mengirim pesan chat:", err);
  }
};

const markNotifRead = async (id) => {
  try {
    await updateDoc(doc(db, 'notifications', id), { read: true });
  } catch (err) {
    console.error(err);
  }
};

// Stepper index mapper
const getStepIndex = (status) => {
  if (status === 'Rejected') return 1; // display as danger under review
  return timelineSteps.indexOf(status);
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return dateStr.split('T')[0];
};

// Requests moderation (Shelter role)
const updateRequestStatus = async (req, newStatus) => {
  if (confirm(`Ubah status pengajuan adopsi menjadi ${newStatus}?`)) {
    try {
      await updateDoc(doc(db, 'adoption_requests', req.id), { status: newStatus });
      
      // Sync pet status accordingly
      if (newStatus === 'Approved') {
        await updateDoc(doc(db, 'adoption_pets', req.petId), { status: 'Reserved' });
      } else if (newStatus === 'Adopted') {
        await updateDoc(doc(db, 'adoption_pets', req.petId), { status: 'Adopted' });
        // Write a success stories placeholder trigger
        const storyId = `story_${Date.now()}`;
        await setDoc(doc(db, 'success_stories', storyId), {
          id: storyId,
          petId: req.petId,
          petName: req.petName,
          petPhoto: req.petPhoto,
          adopterName: req.fullName,
          title: `Adopsi Sukses ${req.petName}!`,
          story: `Keluarga baru ${req.fullName} telah berhasil mengadopsi ${req.petName}. Semoga anabul bertumbuh sehat bersama keluarga barunya.`,
          photo: req.petPhoto,
          createdAt: new Date().toISOString()
        });
      } else if (newStatus === 'Rejected') {
        await updateDoc(doc(db, 'adoption_pets', req.petId), { status: 'Available' });
      }

      // Add Notification for adopter
      const notifId = `notif_${Date.now()}`;
      await setDoc(doc(db, 'notifications', notifId), {
        id: notifId,
        userId: req.adopterId,
        title: 'Status Pengajuan Diperbarui',
        body: `Pengajuan adopsi Anda untuk ${req.petName} telah berstatus [${newStatus}].`,
        read: false,
        type: 'request_status',
        createdAt: serverTimestamp()
      });

      alert(`Berhasil memperbarui status menjadi ${newStatus}!`);
      await loadData();
    } catch (err) {
      alert("Gagal memperbarui status: " + err.message);
    }
  }
};

const openInterviewModal = (req) => {
  activeRequest.value = req;
  interviewForm.value = { date: '', time: '', notes: '' };
  showInterviewModal.value = true;
};

const submitInterviewSchedule = async () => {
  try {
    const req = activeRequest.value;
    const aptId = `APT_${Date.now()}`;
    
    // Save to appointments
    await setDoc(doc(db, 'appointments', aptId), {
      id: aptId,
      type: 'Interview',
      petId: req.petId,
      petName: req.petName,
      petPhoto: req.petPhoto,
      requestId: req.id,
      adopterId: req.adopterId,
      shelterId: authStore.user.uid,
      date: interviewForm.value.date,
      time: interviewForm.value.time,
      notes: interviewForm.value.notes,
      status: 'Confirmed',
      createdAt: serverTimestamp()
    });

    // Update Request status to 'Interview Scheduled'
    await updateDoc(doc(db, 'adoption_requests', req.id), {
      status: 'Interview Scheduled'
    });

    // Notify adopter
    const notifId = `notif_${Date.now()}`;
    await setDoc(doc(db, 'notifications', notifId), {
      id: notifId,
      userId: req.adopterId,
      title: 'Jadwal Wawancara',
      body: `Shelter menjadwalkan interview untuk Anda pada ${interviewForm.value.date} jam ${interviewForm.value.time}.`,
      read: false,
      type: 'appointment_reminder',
      createdAt: serverTimestamp()
    });

    alert("Jadwal interview berhasil dikirim!");
    showInterviewModal.value = false;
    await loadData();
  } catch (err) {
    alert("Gagal menjadwalkan interview: " + err.message);
  }
};

// Health Passport passport operations (Shelter)
const openEditPassport = (pet) => {
  activePet.value = pet;
  healthForm.value = {
    vaccinated: pet.vaccinated || false,
    sterilized: pet.sterilized || false,
    allergies: pet.allergies || '',
    lastCheckupDate: pet.lastCheckupDate || '',
    medicalHistory: pet.medicalHistory || ''
  };
  showPassportModal.value = true;
};

const submitHealthPassport = async () => {
  try {
    await updateDoc(doc(db, 'adoption_pets', activePet.value.id), {
      vaccinated: healthForm.value.vaccinated,
      sterilized: healthForm.value.sterilized,
      allergies: healthForm.value.allergies,
      lastCheckupDate: healthForm.value.lastCheckupDate,
      medicalHistory: healthForm.value.medicalHistory
    });

    // Write record inside health_records
    const hrId = `hr_${activePet.value.id}_${Date.now()}`;
    await setDoc(doc(db, 'health_records', hrId), {
      id: hrId,
      petId: activePet.value.id,
      type: 'Checkup',
      title: 'Update Passport Berkala',
      description: healthForm.value.medicalHistory || 'Pemeriksaan rutin kesehatan.',
      date: healthForm.value.lastCheckupDate || new Date().toISOString().split('T')[0],
      vetName: 'Veterinary Shelter Partner'
    });

    alert("Pet Health Passport berhasil disimpan!");
    showPassportModal.value = false;
    await loadData();
  } catch (err) {
    alert("Gagal menyimpan passport: " + err.message);
  }
};

// Pet CRUD details (Shelter)
const openAddPetModal = () => {
  isEditingPet.value = false;
  petForm.value = {
    name: '',
    species: 'Cat',
    breed: '',
    gender: 'Male',
    age: 1,
    weight: 3.5,
    photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop',
    description: ''
  };
  showPetModal.value = true;
};

const openEditPetModal = (pet) => {
  activePet.value = pet;
  isEditingPet.value = true;
  petForm.value = {
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    gender: pet.gender,
    age: pet.age,
    weight: pet.weight,
    photo: pet.photo,
    description: pet.description
  };
  showPetModal.value = true;
};

const submitPetForm = async () => {
  try {
    const photos = [
      petForm.value.photo,
      petForm.value.photo,
      petForm.value.photo,
      petForm.value.photo,
      petForm.value.photo
    ];

    if (isEditingPet.value) {
      await updateDoc(doc(db, 'adoption_pets', activePet.value.id), {
        name: petForm.value.name,
        species: petForm.value.species,
        breed: petForm.value.breed,
        gender: petForm.value.gender,
        age: petForm.value.age,
        weight: petForm.value.weight,
        photo: petForm.value.photo,
        photos,
        description: petForm.value.description
      });
      alert("Informasi anabul berhasil diperbarui!");
    } else {
      const petId = `pet_adopt_${Date.now()}`;
      await setDoc(doc(db, 'adoption_pets', petId), {
        id: petId,
        name: petForm.value.name,
        species: petForm.value.species,
        breed: petForm.value.breed,
        gender: petForm.value.gender,
        age: petForm.value.age,
        weight: petForm.value.weight,
        photo: petForm.value.photo,
        photos,
        description: petForm.value.description,
        vaccinated: false,
        sterilized: false,
        healthStatus: 'Sehat',
        location: authStore.profile?.location || 'Padang',
        status: 'Available',
        personality: ["Friendly", "Aktif"],
        traits: { active: true, childFriendly: true, petFriendly: true, apartmentFriendly: true, energyLevel: 2 },
        shelterId: authStore.user.uid,
        createdAt: serverTimestamp(),
        approvedByAdmin: true
      });
      alert("Berhasil mendaftarkan anabul baru!");
    }
    showPetModal.value = false;
    await loadData();
  } catch (err) {
    alert("Gagal memproses data hewan: " + err.message);
  }
};

const deletePet = async (petId) => {
  if (confirm("Anda yakin ingin menghapus anabul ini dari daftar adopsi?")) {
    try {
      await deleteDoc(doc(db, 'adoption_pets', petId));
      alert("Anabul berhasil dihapus.");
      await loadData();
    } catch (err) {
      alert("Gagal menghapus: " + err.message);
    }
  }
};
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Nunito', sans-serif;
  min-height: 100vh;
  background-color: var(--color-bg);
}

.dashboard-header-card {
  background-color: var(--color-card-bg);
  border: 3px solid #000000;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 4px 4px 0px #000000;
  margin-bottom: 2rem;
}

.role-badge {
  background-color: #B39DDB;
  color: #1A1A1A;
  border: 2px solid #000000;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 800;
  display: inline-block;
  margin-bottom: 0.75rem;
}

.welcome-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 2.25rem;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0;
}

.welcome-subtitle {
  font-size: 1.05rem;
  font-weight: 700;
  color: #aaaaaa;
  margin-top: 0.25rem;
}

/* Stats for Shelter */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  border: 3px solid #000000;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 4px 4px 0px #000000;
}

.stat-card .num {
  font-family: 'Fredoka', sans-serif;
  font-size: 2.75rem;
  font-weight: 800;
  color: #1A1A1A;
  line-height: 1;
}

.stat-card .lbl {
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #1A1A1A;
  margin-top: 0.5rem;
}

.bg-blue { background-color: #BBDEFB; }
.bg-green { background-color: #C8E6C9; }
.bg-yellow { background-color: #FFF9C4; }
.bg-orange { background-color: #F8BBD0; }

/* Dashboard layout grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: start;
}

@media (min-width: 992px) {
  .dashboard-grid {
    grid-template-columns: 3fr 9fr;
    gap: 2.5rem;
  }
}

/* Sidebar Menu navigation */
.sidebar-menu {
  background-color: var(--color-card-bg);
  border: 3px solid #000000;
  border-radius: 24px;
  padding: 1.25rem;
  box-shadow: 4px 4px 0px #000000;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.menu-btn {
  width: 100%;
  text-align: left;
  border: 2px solid transparent;
  padding: 0.85rem 1.25rem;
  border-radius: 12px;
  font-family: 'Fredoka', sans-serif;
  font-weight: 800;
  font-size: 0.95rem;
  color: #aaaaaa;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s;
}

.menu-btn:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: #FFFFFF;
}

.menu-btn.active-btn {
  background-color: #FFF176;
  color: #1A1A1A;
  border-color: #000000;
  box-shadow: 3px 3px 0px #000000;
  transform: translate(-1px, -1px);
}

/* Content display */
.content-display {
  min-height: 400px;
}

.dashboard-section {
  background-color: var(--color-card-bg);
  border: 3px solid #000000;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 4px 4px 0px #000000;
}

.section-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: #FFFFFF;
  margin-bottom: 2rem;
}

.empty-dashboard-state {
  text-align: center;
  padding: 4rem 2rem;
  border: 3px dashed #000000;
  background-color: #1a1a1a;
  border-radius: 16px;
}

.empty-dashboard-state .icon {
  font-size: 3.5rem;
  display: block;
  margin-bottom: 1rem;
}

.empty-dashboard-state .text {
  font-size: 0.95rem;
  font-weight: 600;
  color: #aaaaaa;
}

.btn-neo {
  font-family: 'Fredoka', 'Nunito', sans-serif;
  font-weight: 800;
  padding: 0.65rem 1.25rem;
  background-color: #FF8A65;
  color: #1A1A1A;
  border: 3px solid #000000;
  border-radius: 10px;
  box-shadow: 3px 3px 0px 0px #000000;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.btn-neo:hover {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0px 0px #000000;
}

.btn-neo:active {
  transform: translate(1px, 1px);
  box-shadow: none;
}

/* Requests lists & stepper */
.requests-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.request-item-card {
  border: 3px solid #000000;
  background-color: #1A1A1A;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 4px 4px 0px #000000;
}

.req-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.pet-info-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.req-pet-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid #000000;
}

.req-pet-name {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.2rem;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0;
}

.req-date {
  font-size: 0.75rem;
  font-weight: 700;
  color: #888888;
}

.req-status-badge {
  padding: 0.25rem 0.75rem;
  border: 2px solid #000000;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
}

.req-status-badge.application-submitted { background-color: #BBDEFB; color: #1A1A1A; }
.req-status-badge.under-review { background-color: #FFF9C4; color: #1A1A1A; }
.req-status-badge.interview-scheduled { background-color: #F8BBD0; color: #1A1A1A; }
.req-status-badge.interview-completed { background-color: #B39DDB; color: #1A1A1A; }
.req-status-badge.approved { background-color: #C8E6C9; color: #1A1A1A; }
.req-status-badge.adopted { background-color: #4ADE80; color: #1A1A1A; }
.req-status-badge.rejected { background-color: #FF6B6B; color: #ffffff; }

.req-detail-box {
  background-color: #262626;
  border: 2px dashed #000000;
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
  font-size: 0.85rem;
  line-height: 1.6;
}

.req-detail-box p {
  margin: 0.25rem 0;
}

.stepper-timeline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  position: relative;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.stepper-timeline::before {
  content: '';
  position: absolute;
  top: 15px;
  left: 20px;
  right: 20px;
  height: 3px;
  background-color: #333333;
  z-index: 1;
}

.step-item {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  text-align: center;
  min-width: 80px;
}

.step-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #000000;
  background-color: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
  color: #aaaaaa;
}

.step-label {
  font-size: 0.65rem;
  font-weight: 800;
  color: #888888;
  margin-top: 0.5rem;
  text-transform: uppercase;
}

.step-active .step-circle {
  background-color: #FFF176;
  color: #1A1A1A;
  box-shadow: 2px 2px 0px #000000;
}

.step-active .step-label {
  color: #FFFFFF;
}

.step-danger .step-circle {
  background-color: #FF6B6B;
  color: #ffffff;
}

/* Appointments & Wishlist grids */
.appointments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.apt-item-card {
  background-color: #1A1A1A;
  border: 3px solid #000000;
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 4px 4px 0px #000000;
}

.apt-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.apt-pet-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 10px;
  border: 2px solid #000000;
}

.apt-pet-name {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.1rem;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0;
}

.apt-id {
  font-size: 0.65rem;
  font-weight: 800;
  color: #888888;
}

.apt-details {
  font-size: 0.85rem;
  line-height: 1.6;
}

.apt-status {
  text-transform: uppercase;
  font-size: 0.7rem;
}

.apt-status.pending { background-color: #FFF9C4; color: #1A1A1A; }
.apt-status.confirmed { background-color: #BBDEFB; color: #1A1A1A; }
.apt-status.completed { background-color: #C8E6C9; color: #1A1A1A; }

.grid-wishlist {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
}

.wish-item-card {
  background-color: #1A1A1A;
  border: 3px solid #000000;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 3px 3px 0px #000000;
  cursor: pointer;
  transition: all 0.2s;
}

.wish-item-card:hover {
  transform: translateY(-2px);
  box-shadow: 5px 5px 0px #000000;
}

.wish-img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-bottom: 2px solid #000000;
}

.wish-info {
  padding: 0.75rem;
}

.wish-info h4 {
  font-size: 0.95rem;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0;
}

.wish-info p {
  font-size: 0.75rem;
  color: #aaaaaa;
  margin: 0.15rem 0 0.5rem 0;
}

/* Notifications styles */
.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notif-item-card {
  border: 3px solid #000000;
  background-color: #1A1A1A;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  box-shadow: 3px 3px 0px #000000;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.notif-bullet {
  width: 8px;
  height: 8px;
  background-color: transparent;
  border-radius: 50%;
  flex-shrink: 0;
}

.notif-unread {
  background-color: #2b223d; /* subtle highlights */
}

.notif-unread .notif-bullet {
  background-color: #B39DDB;
}

.notif-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0;
}

.notif-body {
  font-size: 0.8rem;
  color: #aaaaaa;
  margin: 0.15rem 0 0 0;
}

/* Realtime Chat Integration styles */
.chat-wrapper-box {
  display: grid;
  grid-template-columns: 1fr;
  border: 3px solid #000000;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 4px 4px 0px #000000;
  height: 500px;
}

@media (min-width: 768px) {
  .chat-wrapper-box {
    grid-template-columns: 4fr 8fr;
  }
}

.chat-rooms-sidebar {
  border-bottom: 3px solid #000000;
  background-color: #1A1A1A;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .chat-rooms-sidebar {
    border-bottom: none;
    border-right: 3px solid #000000;
  }
}

.room-item {
  padding: 1rem;
  border-bottom: 2px solid #000000;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.room-item:hover {
  background-color: #262626;
}

.room-item.active-room {
  background-color: #FFF176;
}

.room-img {
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #000000;
}

.room-info {
  flex: 1;
  min-width: 0;
}

.room-info h4 {
  font-size: 0.85rem;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0;
}

.active-room .room-info h4 {
  color: #1A1A1A;
}

.room-last {
  font-size: 0.75rem;
  color: #aaaaaa;
  margin: 0.15rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.active-room .room-last {
  color: #444444;
}

.room-pet-tag {
  font-size: 0.65rem;
  font-weight: 800;
  color: #B39DDB;
}

.active-room .room-pet-tag {
  color: #5E35B1;
}

.chat-stream-area {
  display: flex;
  flex-direction: column;
  background-color: #121212;
  height: 100%;
}

.chat-room-header {
  padding: 1rem;
  background-color: #1a1a1a;
  border-bottom: 2px solid #000000;
}

.chat-room-header h4 {
  font-size: 0.85rem;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0;
}

.chat-messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.msg-bubble {
  max-width: 70%;
  padding: 0.75rem 1rem;
  border: 2px solid #000000;
  border-radius: 12px;
  box-shadow: 2px 2px 0px #000000;
  font-size: 0.85rem;
  font-weight: 700;
  color: #1A1A1A;
}

.my-msg {
  align-self: flex-end;
  background-color: #4ADE80;
}

.their-msg {
  align-self: flex-start;
  background-color: #FFFFFF;
}

.msg-sender {
  display: block;
  font-size: 0.65rem;
  font-weight: 800;
  color: #888888;
  margin-bottom: 0.25rem;
}

.chat-input-bar {
  display: flex;
  padding: 1rem;
  gap: 0.75rem;
  border-top: 3px solid #000000;
  background-color: #1A1A1A;
}

.chat-input-bar .neo-input {
  background-color: #121212;
}

.btn-send {
  background-color: #FFF176;
}

/* Modals layout elements */
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
  max-width: 500px;
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

.btn-submit-apt {
  background-color: #FFF176;
  color: #1a1a1a;
}

.btn-add { background-color: #4ADE80; }
.btn-med { background-color: #B39DDB; }
.btn-edit { background-color: #FFF176; }
.btn-delete { background-color: #FF6B6B; color: #ffffff; }

.badge.vaccinated.true, .badge.sterilized.true { background-color: #4ADE80; color: #1a1a1a; }
.badge.vaccinated.false, .badge.sterilized.false { background-color: #FF6B6B; color: #ffffff; }

@media (max-width: 992px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
