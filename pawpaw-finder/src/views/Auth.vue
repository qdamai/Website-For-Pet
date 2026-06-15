<template>
  <div class="auth-container">
    <!-- Pattern Background -->
    <div class="pattern-bg"></div>
    
    <div class="auth-box">
      
      <h2 class="auth-title">
        {{ isLogin ? 'Masuk ke Pawpaw' : 'Daftar Akun Baru' }}
      </h2>

      <!-- Error Message -->
      <div v-if="authStore.error" class="error-msg">
        {{ authStore.error }}
      </div>

      <!-- Form Container -->
      <form @submit.prevent="handleSubmit">
        
        <div v-if="!isLogin" class="form-group">
          <label>Nama Lengkap</label>
          <input 
            type="text" 
            v-model="fullname" 
            placeholder="Misal: Budi Santoso" 
            required
            class="neo-input"
          />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input 
            type="email" 
            v-model="email" 
            placeholder="abe@gmail.com" 
            required
            class="neo-input"
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input 
            type="password" 
            v-model="password" 
            placeholder="••••••" 
            required
            class="neo-input"
          />
        </div>

        <!-- CTA Button -->
        <button type="submit" :disabled="isSubmitting" class="auth-btn">
          {{ isSubmitting ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar') }}
        </button>

      </form>

      <!-- Toggle Text -->
      <div class="toggle-text">
        <span @click="toggleMode">
          {{ isLogin ? 'Belum punya akun?' : 'Sudah punya akun?' }} 
          <span class="toggle-link">{{ isLogin ? 'Daftar' : 'Masuk' }}</span>
        </span>
      </div>

      <!-- Demo Accounts (Hidden for Production) -->
      <div v-if="isLogin" class="demo-accounts" style="display: none;">
        <p class="demo-title"><Wrench class="inline" /> Login Cepat Admin (Demo)</p>
        <div class="demo-list">
          <div class="demo-item" @click="fillAdmin('nazira')">
            <span class="demo-role">Admin 1</span>
            <span class="demo-email">nazira@pawpaw.com</span>
          </div>
          <div class="demo-item" @click="fillAdmin('damai')">
            <span class="demo-role">Admin 2</span>
            <span class="demo-email">damai@pawpaw.com</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { Wrench } from 'lucide-vue-next';

import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const isLogin = ref(true);
const email = ref('');
const password = ref('');
const fullname = ref('');
const isSubmitting = ref(false);

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  authStore.error = null;
};

const fillAdmin = (type) => {
  if (type === 'nazira') {
    email.value = 'nazira@pawpaw.com';
    password.value = 'pawpaw2026';
  } else if (type === 'damai') {
    email.value = 'damai@pawpaw.com';
    password.value = 'pawpaw2026';
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    if (isLogin.value) {
      await authStore.login(email.value, password.value);
    } else {
      await authStore.register(email.value, password.value, fullname.value);
    }
    
    // Hardcoded logic for routing
    if (authStore.user?.uid === 'admin1' || authStore.user?.uid === 'admin2') {
      router.push({ name: 'AdminPanel' });
    } else {
      router.push({ name: 'Dashboard' });
    }
  } catch (error) {
    console.error(error);
    // Error is handled in the store and displayed via authStore.error
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
  overflow: hidden;
  background-color: var(--color-bg);
  font-family: 'Nunito', sans-serif;
}

.pattern-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(#64B5F6 2px, transparent 2px);
  background-size: 30px 30px;
  opacity: 0.1;
  pointer-events: none;
}

.auth-box {
  width: 100%;
  max-width: 480px;
  padding: 2.5rem;
  background-color: var(--color-card-bg);
  border: var(--border-width) solid var(--color-border);
  border-radius: 32px;
  box-shadow: var(--shadow-neo);
  position: relative;
  z-index: 10;
}

.auth-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 2.25rem;
  font-weight: 800;
  text-align: center;
  color: var(--color-text);
  margin-bottom: 2rem;
}

.error-msg {
  background-color: #ef4444;
  color: white;
  padding: 0.75rem;
  border-radius: 12px;
  border: var(--border-width) solid var(--color-border);
  margin-bottom: 1.5rem;
  font-weight: 800;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.neo-input {
  width: 100%;
  padding: 0.875rem 1rem;
  background-color: var(--color-bg);
  border: var(--border-width) solid var(--color-border);
  border-radius: 12px;
  color: var(--color-text);
  font-weight: 700;
  font-family: 'Nunito', sans-serif;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
}

.neo-input:focus {
  border-color: #FF8A65;
  box-shadow: var(--shadow-neo);
  transform: translate(-2px, -2px);
}

.auth-btn {
  width: 100%;
  font-family: 'Fredoka', 'Nunito', sans-serif;
  font-weight: 800;
  font-size: 1.25rem;
  padding: 1rem 1.5rem;
  background-color: #FF8A65;
  border: var(--border-width) solid var(--color-border);
  border-radius: 16px;
  color: #1A1A1A;
  box-shadow: var(--shadow-neo);
  transition: all 0.15s ease-in-out;
  cursor: pointer;
  outline: none;
  margin-top: 1rem;
}

.auth-btn:hover:not(:disabled) {
  background-color: #FF7A50;
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow-neo);
}

.auth-btn:active:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.auth-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.toggle-text {
  text-align: center;
  margin-top: 1.5rem;
  font-weight: 800;
  color: var(--color-text);
}

.toggle-link {
  color: #FF8A65;
  cursor: pointer;
}

.toggle-link:hover {
  text-decoration: underline;
}

.demo-accounts {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 3px dashed #000000;
}

.demo-title {
  text-align: center;
  font-weight: 800;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.demo-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.demo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: var(--color-bg);
  border: var(--border-width) solid var(--color-border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-neo);
}

.demo-item:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow-neo);
  background-color: #B39DDB;
}

.demo-role {
  font-weight: 800;
  color: var(--color-text);
}

.demo-email {
  font-size: 0.85rem;
  font-weight: 700;
  opacity: 0.8;
  color: var(--color-text);
}

@media (max-width: 480px) {
  .auth-box {
    padding: 1.5rem;
  }
  .auth-title {
    font-size: 1.75rem;
  }
}
</style>
