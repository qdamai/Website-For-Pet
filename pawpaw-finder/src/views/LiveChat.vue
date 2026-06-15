<template>
  <div class="chat-wrapper">
    
    <div class="chat-header-main">
      <h1 class="chat-title">{{ langStore.t('finder_chats') }}</h1>
      <button class="btn-neo" @click="router.back()">{{ langStore.t('back') }}</button>
    </div>

    <div class="chat-layout">
      <!-- Chat List Sidebar -->
      <div class="chat-sidebar">
        <h2 class="sidebar-title">{{ langStore.t('finder_chats') }}</h2>
        
        <div class="chat-tabs">
          <button 
            class="tab-btn" 
            :class="{ 'active': activeTab === 'support' }"
            @click="activeTab = 'support'"
          >
            {{ authStore.isAdmin ? 'Support Tickets' : 'Bantuan' }}
          </button>
          <button 
            class="tab-btn" 
            :class="{ 'active': activeTab === 'report' }"
            @click="activeTab = 'report'"
          >
            Info Laporan
          </button>
          <button 
            class="tab-btn" 
            :class="{ 'active': activeTab === 'peer' }"
            @click="activeTab = 'peer'"
          >
            Pesan Pribadi
          </button>
        </div>
        
        <div class="chat-list">
          <div v-if="filteredChats.length === 0" class="empty-list">
            {{ langStore.t('noConversations') }}
          </div>
          <div 
            v-for="chat in filteredChats" 
            :key="chat.chatId"
            class="chat-item"
            :class="{ 'active': currentRoom === chat.chatId }"
            @click="selectRoom(chat.chatId)"
          >
            <div class="chat-item-content">
              <!-- Thumbnail for pet photo if it's a report chat -->
              <img 
                v-if="(chat.type === 'report' || chat.petId) && chat.petPhoto" 
                :src="chat.petPhoto" 
                alt="Pet Thumbnail" 
                class="chat-pet-thumb"
              />
              <div v-else-if="chat.type === 'report' || chat.petId" class="chat-pet-thumb-fallback bg-orange">
                <PawPrint :size="18" class="inline" />
              </div>
              
              <div class="chat-item-text">
                <div class="chat-item-name">{{ getOtherParticipantName(chat) }}</div>
                <div class="chat-item-pet" v-if="chat.type === 'report' || chat.petId">
                  Hewan: {{ chat.petName || 'Laporan' }}
                </div>
                <div class="chat-item-last">{{ chat.lastMessage || '...' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Area -->
      <div class="chat-area">
        <template v-if="currentRoom">
          <div class="room-header">
            <div class="room-header-info">
              <h3 class="room-title">{{ langStore.t('roomChat') }}: {{ currentChatName }}</h3>
              <div v-if="currentRoomDetails?.type === 'report' || currentRoomDetails?.petId" class="room-subtitle-pet">
                Membahas Hewan: 
                <router-link 
                  :to="`/pet/${currentRoomDetails.petType || 'lost'}/${currentRoomDetails.petId}`" 
                  class="pet-link"
                >
                  {{ currentRoomDetails.petName || 'Detail Hewan' }}
                </router-link>
              </div>
            </div>
            <button class="btn-wa" @click="moveToWhatsApp">{{ langStore.t('moveToWA') }}</button>
          </div>
          
          <div class="messages-container" ref="messagesContainer">
            <div 
              v-for="msg in messages" 
              :key="msg.messageId"
              class="message-bubble"
              :class="msg.senderId === authStore.user?.uid ? 'my-message' : 'their-message'"
            >
              <div class="sender-name" v-if="msg.senderId !== authStore.user?.uid">
                {{ msg.senderName }}
              </div>
              <div class="message-text">{{ msg.text }}</div>
            </div>
          </div>

          <form @submit.prevent="sendMessage" class="message-form">
            <input 
              v-model="newMessage" 
              type="text" 
              class="neo-input" 
              :placeholder="langStore.t('typeMessage')" 
              required
            >
            <button type="submit" class="btn-neo btn-send">{{ langStore.t('send') }}</button>
          </form>
        </template>
        <div v-else class="empty-room">
          <EmptyState :title="langStore.t('selectConversation')" :description="langStore.t('selectConversationDesc')" type="chat" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FileText, MessageSquare, MapPin, Settings, Home, Camera, Calendar, PawPrint, Dog, Cat, AlertTriangle, XCircle, CheckCircle, Target, Heart, BarChart2, Dna, Cake, Scale, Sun, Moon } from 'lucide-vue-next';
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useLangStore } from '../stores/lang';
import { collection, query, where, or, onSnapshot, orderBy, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import EmptyState from '../components/EmptyState.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const langStore = useLangStore();

const chatList = ref([]);
const messages = ref([]);
const currentRoom = ref(route.query.room || null);
const newMessage = ref('');
const messagesContainer = ref(null);

const activeTab = ref('support'); // 'support', 'peer', 'report'

let unsubChatList = null;
let unsubMessages = null;

onMounted(() => {
  if (authStore.user) {
    loadChatList();
    if (currentRoom.value) {
      if (currentRoom.value.startsWith('support_')) {
        activeTab.value = 'support';
      } else if (currentRoom.value.startsWith('report_')) {
        activeTab.value = 'report';
      } else {
        activeTab.value = 'peer';
      }
      selectRoom(currentRoom.value);
    }
  }
});

onUnmounted(() => {
  if (unsubChatList) unsubChatList();
  if (unsubMessages) unsubMessages();
});

const loadChatList = () => {
  let q;
  if (authStore.isAdmin) {
    // Admin sees all support chats + any chats they are participants of
    q = query(
      collection(db, 'finder_chats'),
      or(
        where('isAdminChat', '==', true),
        where('participants', 'array-contains', authStore.user.uid)
      )
    );
  } else {
    // User sees chats they are participants of
    q = query(
      collection(db, 'finder_chats'),
      where('participants', 'array-contains', authStore.user.uid)
    );
  }

  unsubChatList = onSnapshot(q, (snapshot) => {
    chatList.value = snapshot.docs.map(d => ({ ...d.data() }));
    chatList.value.sort((a, b) => {
      const ta = a.updatedAt?.toMillis() || 0;
      const tb = b.updatedAt?.toMillis() || 0;
      return tb - ta;
    });
  });
};

const filteredChats = computed(() => {
  return chatList.value.filter(chat => {
    const isSupport = chat.type === 'support' || chat.isAdminChat === true;
    const isReport = chat.type === 'report' || (chat.petId !== undefined && chat.petId !== null);
    const isPeer = chat.type === 'peer' || (!isSupport && !isReport);
    
    if (activeTab.value === 'support') return isSupport;
    if (activeTab.value === 'peer') return isPeer;
    if (activeTab.value === 'report') return isReport;
    return false;
  });
});

const getOtherParticipantName = (chat) => {
  if (chat.isAdminChat || chat.type === 'support') {
    if (authStore.isAdmin) {
      return chat.userName || 'User';
    } else {
      return "Admin Support";
    }
  }
  if (chat.userNames) {
    const otherId = chat.participants.find(id => id !== authStore.user.uid);
    return chat.userNames[otherId] || `User (${otherId?.substring(0, 5)})`;
  }
  const otherId = chat.participants.find(id => id !== authStore.user.uid);
  return `User (${otherId ? otherId.substring(0, 5) : 'Unknown'})`;
};

const currentChatName = computed(() => {
  const chat = chatList.value.find(c => c.chatId === currentRoom.value);
  if (chat) return getOtherParticipantName(chat);
  return 'Loading...';
});

const currentRoomDetails = computed(() => {
  return chatList.value.find(c => c.chatId === currentRoom.value) || null;
});

const selectRoom = (chatId) => {
  currentRoom.value = chatId;
  if (unsubMessages) unsubMessages();
  
  const q = query(
    collection(db, `finder_chats/${chatId}/messages`),
    orderBy('timestamp', 'asc')
  );

  unsubMessages = onSnapshot(q, (snapshot) => {
    messages.value = snapshot.docs.map(d => ({ messageId: d.id, ...d.data() }));
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
      }
    });
  });
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || !currentRoom.value) return;

  const text = newMessage.value;
  newMessage.value = '';

  const msgData = {
    senderId: authStore.user.uid,
    senderName: authStore.profile?.fullname || 'User',
    text,
    timestamp: serverTimestamp()
  };

  await addDoc(collection(db, `finder_chats/${currentRoom.value}/messages`), msgData);
  await updateDoc(doc(db, 'finder_chats', currentRoom.value), {
    lastMessage: text,
    updatedAt: serverTimestamp()
  });
};

const moveToWhatsApp = () => {
  const phone = prompt("Masukkan nomor WhatsApp tujuan (misal: 628123456789):");
  if (phone) {
    const message = encodeURIComponent("Halo, saya menghubungi Anda dari aplikasi Pawpaw Finder terkait laporan hewan.");
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  }
};
</script>

<style scoped>
.chat-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Nunito', sans-serif;
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
}

.chat-header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.chat-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0;
}

.chat-layout {
  display: flex;
  gap: 1.5rem;
  flex: 1;
  min-height: 0;
}

/* Sidebar */
.chat-sidebar {
  width: 30%;
  background-color: var(--color-card-bg);
  border: var(--border-width) solid var(--color-border);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-neo);
  overflow: hidden;
}

.sidebar-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
  padding: 1.5rem;
  border-bottom: var(--border-width) solid var(--color-border);
  background-color: #B39DDB;
  color: #1A1A1A;
}

.chat-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.empty-list {
  text-align: center;
  font-weight: 700;
  color: #888888;
  padding: 2rem 0;
}

.chat-item {
  border: var(--border-width) solid var(--color-border);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  background-color: #1A1A1A;
  color: #FFFFFF;
  transition: all 0.2s;
  box-shadow: var(--shadow-neo);
}

.chat-item:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow-neo);
}

.chat-item.active {
  background-color: #FFF176;
  color: #1A1A1A;
}

.chat-item-name {
  font-weight: 800;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.chat-item-last {
  font-size: 0.9rem;
  font-weight: 600;
  color: #aaaaaa;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-item.active .chat-item-last {
  color: #333333;
}

/* Chat Area */
.chat-area {
  width: 70%;
  background-color: var(--color-card-bg);
  border: var(--border-width) solid var(--color-border);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-neo);
  overflow: hidden;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: var(--border-width) solid var(--color-border);
  background-color: #1A1A1A;
}

.room-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0;
}

.btn-wa {
  background-color: #25D366;
  color: white;
  font-weight: 800;
  padding: 0.5rem 1rem;
  border: var(--border-width) solid var(--color-border);
  border-radius: 12px;
  cursor: pointer;
  box-shadow: var(--shadow-neo);
  transition: all 0.2s;
}

.btn-wa:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.messages-container {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #121212;
}

.message-bubble {
  max-width: 75%;
  padding: 1rem;
  border: var(--border-width) solid var(--color-border);
  box-shadow: var(--shadow-neo);
  font-weight: 700;
  font-size: 1rem;
  color: #1A1A1A;
}

.my-message {
  align-self: flex-end;
  background-color: #4ADE80;
  border-radius: 16px 16px 0 16px;
}

.their-message {
  align-self: flex-start;
  background-color: #FFFFFF;
  border-radius: 16px 16px 16px 0;
}

.sender-name {
  font-size: 0.8rem;
  font-weight: 800;
  color: #555;
  margin-bottom: 0.25rem;
}

.message-form {
  display: flex;
  padding: 1.5rem;
  gap: 1rem;
  border-top: var(--border-width) solid var(--color-border);
  background-color: #1A1A1A;
}

.btn-neo {
  font-family: 'Fredoka', sans-serif;
  font-weight: 800;
  padding: 0.75rem 1.5rem;
  background-color: #FF8A65;
  color: #1A1A1A;
  border: var(--border-width) solid var(--color-border);
  border-radius: 12px;
  box-shadow: var(--shadow-neo);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.btn-neo:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.empty-room {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #121212;
}

.chat-tabs {
  display: flex;
  border-bottom: var(--border-width) solid var(--color-border);
  background-color: #1A1A1A;
}

.chat-tabs .tab-btn {
  flex: 1;
  font-family: 'Fredoka', sans-serif;
  font-weight: 800;
  font-size: 0.9rem;
  padding: 0.75rem 0.25rem;
  border: none;
  background: transparent;
  color: #FFFFFF;
  cursor: pointer;
  transition: all 0.2s;
  border-right: var(--border-width) solid var(--color-border);
}

.chat-tabs .tab-btn:last-child {
  border-right: none;
}

.chat-tabs .tab-btn:hover {
  background-color: #333333;
}

.chat-tabs .tab-btn.active {
  background-color: #FFF176;
  color: #1A1A1A;
}

.chat-item-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.chat-pet-thumb {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  border: var(--border-width) solid var(--color-border);
  object-fit: cover;
  flex-shrink: 0;
}

.chat-pet-thumb-fallback {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  border: var(--border-width) solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.chat-item-text {
  flex: 1;
  min-width: 0;
}

.chat-item-pet {
  font-size: 0.8rem;
  font-weight: 800;
  color: #B39DDB;
  margin-bottom: 0.25rem;
}

.chat-item.active .chat-item-pet {
  color: #5E35B1;
}

.room-header-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.room-subtitle-pet {
  font-size: 0.9rem;
  font-weight: 700;
  color: #aaaaaa;
}

.pet-link {
  color: #FFF176;
  text-decoration: underline;
  font-weight: 800;
}

.pet-link:hover {
  color: #4ADE80;
}

@media (max-width: 768px) {
  .chat-layout { flex-direction: column; }
  .chat-sidebar { width: 100%; height: 350px; flex: none; }
  .chat-area { width: 100%; flex: 1; min-height: 400px; }
}
</style>
