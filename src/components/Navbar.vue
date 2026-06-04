<template>
  <nav class="neo-navbar">
    <div class="container navbar-container">
      <!-- Logo -->
      <router-link to="/" class="logo">
        Pawpaw Finder
      </router-link>

      <!-- Nav Links -->
      <div class="nav-menu" :class="{ 'is-active': isMobileMenuOpen }">
        <router-link to="/dashboard" class="nav-item" @click="closeMobileMenu">
          {{ langStore.t('dashboard') }}
        </router-link>
        <router-link to="/radar" class="nav-item" @click="closeMobileMenu">
          {{ langStore.t('radar') }}
        </router-link>
        <router-link to="/explore" class="nav-item" @click="closeMobileMenu">
          {{ langStore.t('explore') }}
        </router-link>
        <router-link to="/report" class="nav-item" @click="closeMobileMenu">
          {{ langStore.t('report') }}
        </router-link>
        <router-link to="/chat" class="nav-item" @click="closeMobileMenu">
          {{ langStore.t('chat') }}
        </router-link>
        <a :href="adoptionUrl" target="_blank" rel="noopener noreferrer" class="nav-item" @click="closeMobileMenu">
          {{ langStore.t('adoption') }}
        </a>
        <router-link 
          v-if="authStore.isAdmin" 
          to="/admin" 
          class="nav-item admin-link"
          @click="closeMobileMenu"
        >
          {{ langStore.t('admin') }}
        </router-link>
      </div>

      <!-- Action Area -->
      <div class="nav-actions">
        <!-- Language Switcher -->
        <button class="btn-lang" @click="langStore.toggleLang">
          {{ langStore.lang === 'id' ? 'ID' : 'EN' }}
        </button>

        <!-- User Section -->
        <div v-if="authStore.isAuthenticated" class="user-profile">
          <router-link to="/profile" class="profile-link" @click="closeMobileMenu">
            <img 
              :src="authStore.profile?.profilePhoto || 'https://api.dicebear.com/7.x/notionists/svg?seed=pawpaw'" 
              alt="Profile" 
              class="nav-avatar"
            />
            <span class="nav-username">{{ authStore.profile?.fullname || 'User' }}</span>
          </router-link>
          <button class="btn-logout" @click="handleLogout">
            {{ langStore.t('logout') }}
          </button>
        </div>
        <router-link v-else to="/auth" class="btn-login" @click="closeMobileMenu">
          Masuk
        </router-link>

        <!-- Hamburger Icon for Mobile -->
        <button class="hamburger" @click="toggleMobileMenu">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useLangStore } from '../stores/lang';

const router = useRouter();
const authStore = useAuthStore();
const langStore = useLangStore();

const adoptionUrl = ref(import.meta.env.VITE_ADOPTION_URL || 'https://pawpaw-adopt.netlify.app');

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const handleLogout = async () => {
  closeMobileMenu();
  await authStore.logout();
  router.push({ name: 'Splash' });
};
</script>

<style scoped>
.neo-navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(12px);
  background-color: rgba(18, 18, 18, 0.85);
  border-bottom: 3px solid #000000;
  padding: 0.75rem 0;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-family: 'Fredoka', sans-serif;
  font-weight: 800;
  font-size: 1.5rem;
  color: #FFFFFF;
  text-decoration: none;
  border: 3px solid #000000;
  padding: 0.25rem 0.75rem;
  background-color: #FF8A65;
  border-radius: 8px;
  box-shadow: 2px 2px 0px #000000;
}

.logo:hover {
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0px #000000;
}

.nav-menu {
  display: flex;
  gap: 1rem;
}

.nav-item {
  font-family: 'Fredoka', sans-serif;
  font-weight: 800;
  color: #FFFFFF;
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background-color: #B39DDB;
  color: #1A1A1A;
  border-color: #000000;
  transform: translateY(-2px);
  box-shadow: 2px 2px 0px #000000;
}

.router-link-active:not(.logo) {
  background-color: #FFF176;
  color: #1A1A1A;
  border-color: #000000;
  box-shadow: 2px 2px 0px #000000;
}

.admin-link {
  border-color: #FF5252;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-lang {
  font-family: 'Fredoka', sans-serif;
  font-weight: 800;
  padding: 0.35rem 0.75rem;
  border: 3px solid #000000;
  border-radius: 8px;
  background-color: #FFF176;
  color: #1A1A1A;
  cursor: pointer;
  box-shadow: 2px 2px 0px #000000;
  transition: all 0.2s ease;
}

.btn-lang:hover {
  transform: translateY(-1px);
  box-shadow: 3px 3px 0px #000000;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.profile-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #FFFFFF;
  font-weight: 700;
  border: 2px solid transparent;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
}

.profile-link:hover {
  background-color: #262626;
}

.nav-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #000000;
}

.nav-username {
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-logout {
  font-family: 'Fredoka', sans-serif;
  font-weight: 800;
  padding: 0.35rem 0.75rem;
  border: 3px solid #000000;
  border-radius: 8px;
  background-color: #FF6B6B;
  color: #FFFFFF;
  cursor: pointer;
  box-shadow: 2px 2px 0px #000000;
  transition: all 0.2s ease;
}

.btn-logout:hover {
  transform: translateY(-1px);
  box-shadow: 3px 3px 0px #000000;
}

.btn-login {
  font-family: 'Fredoka', sans-serif;
  font-weight: 800;
  padding: 0.5rem 1rem;
  border: 3px solid #000000;
  border-radius: 8px;
  background-color: #4ADE80;
  color: #1A1A1A;
  text-decoration: none;
  box-shadow: 2px 2px 0px #000000;
  transition: all 0.2s ease;
}

.btn-login:hover {
  transform: translateY(-1px);
  box-shadow: 3px 3px 0px #000000;
}

/* Hamburger menu styles */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}

.hamburger .bar {
  width: 24px;
  height: 3px;
  background-color: #FFFFFF;
  border-radius: 2px;
}

@media (max-width: 992px) {
  .nav-username {
    display: none;
  }
}

@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }

  .nav-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #121212;
    flex-direction: column;
    padding: 1.5rem;
    gap: 1rem;
    border-bottom: 3px solid #000000;
    display: none;
  }

  .nav-menu.is-active {
    display: flex;
  }
}
</style>
