<template>
  <div class="chat-wrapper">
    
    <div class="chat-header-main">
      <h1 class="chat-title">Live Chat Pawpaw 💬</h1>
      <button class="btn-neo" @click="router.back()">Kembali</button>
    </div>

    <div class="chat-layout">
      <!-- Chat List Sidebar -->
      <div class="chat-sidebar">
        <h2 class="sidebar-title">Pesan Masuk</h2>
        
        <div class="chat-list">
          <div v-if="chatList.length === 0" class="empty-list">
            Belum ada percakapan.
          </div>
          <div 
            v-for="chat in chatList" 
            :key="chat.chatId"
            class="chat-item"
            :class="{ 'active': currentRoom === chat.chatId }"
            @click="selectRoom(chat.chatId)"
          >
            <div class="chat-item-name">{{ getOtherParticipantName(chat) }}</div>
            <div class="chat-item-last">{{ chat.lastMessage || '...' }}</div>
          </div>
        </div>
      </div>

      <!-- Chat Area -->
      <div class="chat-area">
        <template v-if="currentRoom">
          <div class="room-header">
            <h3 class="room-title">Ruang Obrolan: {{ currentChatName }}</h3>
            <button class="btn-wa" @click="moveToWhatsApp">📱 Pindah ke WA</button>
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
              placeholder="Ketik pesan..." 
              required
            >
            <button type="submit" class="btn-neo btn-send">Kirim</button>
          </form>
        </template>
        <div v-else class="empty-room">
          <EmptyState title="Pilih Percakapan" description="Klik pada salah satu obrolan di samping untuk mulai membalas." />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import EmptyState from '../components/EmptyState.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const chatList = ref([]);
const messages = ref([]);
const currentRoom = ref(route.query.room || null);
const newMessage = ref('');
const messagesContainer = ref(null);

let unsubChatList = null;
let unsubMessages = null;

onMounted(() => {
  if (authStore.user) {
    loadChatList();
    if (currentRoom.value) {
      selectRoom(currentRoom.value);
    }
  }
});

onUnmounted(() => {
  if (unsubChatList) unsubChatList();
  if (unsubMessages) unsubMessages();
});

const loadChatList = () => {
  const q = query(
    collection(db, 'chats'),
    where('participants', 'array-contains', authStore.user.uid)
  );

  unsubChatList = onSnapshot(q, (snapshot) => {
    chatList.value = snapshot.docs.map(d => ({ ...d.data() }));
    chatList.value.sort((a, b) => {
      const ta = a.updatedAt?.toMillis() || 0;
      const tb = b.updatedAt?.toMillis() || 0;
      return tb - ta;
    });
  });
};

const getOtherParticipantName = (chat) => {
  if (chat.isAdminChat) return "Admin Support";
  const otherId = chat.participants.find(id => id !== authStore.user.uid);
  return `User (${otherId.substring(0, 5)})`;
};

const currentChatName = computed(() => {
  const chat = chatList.value.find(c => c.chatId === currentRoom.value);
  if (chat) return getOtherParticipantName(chat);
  return 'Loading...';
});

const selectRoom = (chatId) => {
  currentRoom.value = chatId;
  if (unsubMessages) unsubMessages();
  
  const q = query(
    collection(db, `chats/${chatId}/messages`),
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

  await addDoc(collection(db, `chats/${currentRoom.value}/messages`), msgData);
  await updateDoc(doc(db, 'chats', currentRoom.value), {
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
  height: calc(100vh - 80px);
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
  color: #1A1A1A;
  margin: 0;
}

.chat-layout {
  display: flex;
  gap: 1.5rem;
  flex: 1;
  min-height: 0; /* Important for scroll */
}

/* Sidebar */
.chat-sidebar {
  width: 30%;
  background-color: #FFFDF9;
  border: 4px solid #1A1A1A;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  box-shadow: 6px 6px 0px 0px #1A1A1A;
  overflow: hidden;
}

.sidebar-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
  padding: 1.5rem;
  border-bottom: 4px solid #1A1A1A;
  background-color: #F3E5F5;
}

.chat-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.empty-list {
  text-align: center;
  font-weight: 700;
  color: #666;
  padding: 2rem 0;
}

.chat-item {
  border: 3px solid #1A1A1A;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  background-color: white;
  transition: all 0.2s;
  box-shadow: 3px 3px 0px 0px #1A1A1A;
}

.chat-item:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0px 0px #1A1A1A;
}

.chat-item.active {
  background-color: #1A1A1A;
  color: #FFFDF9;
}

.chat-item.active .chat-item-last {
  color: #bbb;
}

.chat-item-name {
  font-weight: 800;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.chat-item-last {
  font-size: 0.9rem;
  font-weight: 600;
  color: #555;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Chat Area */
.chat-area {
  width: 70%;
  background-color: #FFFDF9;
  border: 4px solid #1A1A1A;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  box-shadow: 6px 6px 0px 0px #1A1A1A;
  overflow: hidden;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 4px solid #1A1A1A;
  background-color: white;
}

.room-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
}

.btn-wa {
  background-color: #25D366;
  color: white;
  font-weight: 800;
  padding: 0.5rem 1rem;
  border: 3px solid #1A1A1A;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 3px 3px 0px 0px #1A1A1A;
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
  background-color: #f9f9f9;
}

.message-bubble {
  max-width: 75%;
  padding: 1rem;
  border: 3px solid #1A1A1A;
  box-shadow: 3px 3px 0px 0px #1A1A1A;
  font-weight: 700;
  font-size: 1rem;
}

.my-message {
  align-self: flex-end;
  background-color: #4ADE80;
  border-radius: 16px 16px 0 16px;
}

.their-message {
  align-self: flex-start;
  background-color: white;
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
  border-top: 4px solid #1A1A1A;
  background-color: white;
}

.neo-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 3px solid #1A1A1A;
  border-radius: 12px;
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  outline: none;
}

.neo-input:focus {
  border-color: #FF8A65;
}

.btn-neo {
  font-family: 'Fredoka', sans-serif;
  font-weight: 800;
  padding: 0.75rem 1.5rem;
  background-color: #FF8A65;
  color: #FFFDF9;
  border: 3px solid #1A1A1A;
  border-radius: 12px;
  box-shadow: 4px 4px 0px 0px #1A1A1A;
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
  background-color: #f9f9f9;
}

@media (max-width: 768px) {
  .chat-layout { flex-direction: column; }
  .chat-sidebar { width: 100%; height: 250px; flex: none; }
  .chat-area { width: 100%; flex: 1; min-height: 400px; }
}
</style>
