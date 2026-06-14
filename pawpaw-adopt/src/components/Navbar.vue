<template>
  <nav class="neo-navbar">
    <div class="container navbar-container">
      
      <!-- FAR LEFT: Logo & Mode Toggle -->
      <div class="left-section">
        <router-link to="/" class="logo">
          <PawPrint :size="28" class="logo-icon" />
          Pawpaw.
        </router-link>

        <div class="mode-toggle">
          <a 
            href="http://localhost:5174" 
            class="mode-segment" 
            :class="{ 'is-active': !true }"
          >
            Finder
          </a>
          <a 
            href="http://localhost:5173" 
            class="mode-segment" 
            :class="{ 'is-active': true }"
          >
            Adopt
          </a>
        </div>
      </div>

      <!-- CENTER: Icon-based Navigation -->
      <div class="nav-menu" :class="{ 'is-active': isMobileMenuOpen }">
        
        <router-link to="/" class="nav-item-icon" @click="closeMobileMenu">
          <BookHeart :size="24" class="nav-icon" />
          <span class="nav-icon-text">{{ langStore.t('adoptionCatalog') }}</span>
        </router-link>
        <router-link to="/compare" class="nav-item-icon" @click="closeMobileMenu">
          <Scale :size="24" class="nav-icon" />
          <span class="nav-icon-text">{{ langStore.t('compare') || 'Bandingkan' }}</span>
        </router-link>
        <router-link to="/stories" class="nav-item-icon" @click="closeMobileMenu">
          <MessageCircleHeart :size="24" class="nav-icon" />
          <span class="nav-icon-text">{{ langStore.t('stories') || 'Cerita Adopsi' }}</span>
        </router-link>
        <router-link to="/quiz" class="nav-item-icon" @click="closeMobileMenu">
          <Lightbulb :size="24" class="nav-icon" />
          <span class="nav-icon-text">{{ langStore.t('quiz') || 'Kuis' }}</span>
        </router-link>
        <router-link v-if="authStore.isAuthenticated" to="/dashboard" class="nav-item-icon" @click="closeMobileMenu">
          <LayoutDashboard :size="24" class="nav-icon" />
          <span class="nav-icon-text">{{ langStore.t('dashboard') }}</span>
        </router-link>
  
      </div>

      <!-- RIGHT: Admin & Common Controls -->
      <div class="right-section">
        <div class="common-controls">
          <router-link 
            v-if="authStore.isAdmin" 
            to="/admin" 
            class="control-btn admin-panel-btn"
            @click="closeMobileMenu"
          >
            Admin Panel
          </router-link>
          
          <button class="control-btn icon-only" @click="toggleTheme" title="Toggle Theme">
            <Sun v-if="isDark" :size="20" />
            <Moon v-else :size="20" />
          </button>

          <button class="control-btn icon-only lang-toggle" @click="langStore.toggleLang">
            {{ langStore.lang === 'id' ? 'ID' : 'EN' }}
          </button>
        </div>

        <div class="user-actions">
          <div v-if="authStore.isAuthenticated" class="profile-group">
            <router-link to="/profile" class="profile-card" @click="closeMobileMenu">
              <img 
                :src="authStore.profile?.profilePhoto || `https://api.dicebear.com/7.x/notionists/svg?seed=${authStore.profile?.fullname || 'pawpaw'}`" 
                alt="Profile" 
                class="nav-avatar"
              />
              <div class="profile-info">
                <span class="nav-username">{{ authStore.profile?.fullname || 'User' }}</span>
                <span class="nav-role">{{ authStore.isAdmin ? 'Admin' : 'Member' }}</span>
              </div>
            </router-link>
            
            <button class="control-btn logout-btn" @click="handleLogout">
              Keluar
            </button>
          </div>
          
          <router-link v-else to="/auth" class="control-btn login-btn" @click="closeMobileMenu">
            Masuk
          </router-link>
        </div>

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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useLangStore } from '../stores/lang';
import { 
  Sun, Moon, PawPrint, LayoutDashboard, Radar, Search, FileText, MessageSquare, 
  BookHeart, Scale, MessageCircleHeart, Lightbulb
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const langStore = useLangStore();

const isMobileMenuOpen = ref(false);
const isDark = ref(false);

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    isDark.value = true;
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    isDark.value = false;
    document.documentElement.removeAttribute('data-theme');
  }
});

const toggleTheme = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  }
};

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
  background-color: var(--color-bg);
  border-bottom: 2px solid var(--color-border);
  padding: 1.5rem 0; /* Keeping it generous but fitting the single unified bar */
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

/* LEFT SECTION: Logo & Mode Toggle */
.left-section {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  font-family: 'Fredoka', sans-serif;
  font-weight: 900;
  font-size: 1.75rem;
  color: var(--color-text-dark);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-icon {
  color: var(--color-primary);
}

.mode-toggle {
  display: flex;
  background-color: var(--color-card-bg);
  border: 2px solid var(--color-border);
  border-radius: 99px; /* Pill shape for segmented control */
  padding: 0.25rem;
  box-shadow: 2px 2px 0px 0px rgba(0,0,0,1);
}

.mode-segment {
  padding: 0.4rem 1.25rem;
  border-radius: 99px;
  font-family: 'Fredoka', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  color: var(--color-text);
  transition: all 0.2s ease;
}

.mode-segment.is-active {
  background-color: var(--color-primary);
  color: #1A1A1A;
  font-weight: 800;
  box-shadow: 0px 2px 5px rgba(0,0,0,0.1);
}

[data-theme='dark'] .mode-toggle {
  box-shadow: 2px 2px 0px 0px rgba(255,255,255,0.8);
}

/* CENTER: Navigation Menu */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 2.5rem; /* Wide spacing */
}

.nav-item-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  text-decoration: none;
  color: var(--color-text);
  transition: all 0.2s ease;
}

.nav-icon {
  color: var(--color-text);
  transition: all 0.2s ease;
}

.nav-icon-text {
  font-family: 'Fredoka', sans-serif;
  font-weight: 600;
  font-size: 0.75rem;
  text-align: center;
}

.nav-item-icon:hover .nav-icon {
  color: var(--color-primary);
  transform: translateY(-2px);
}

.nav-item-icon:hover .nav-icon-text {
  color: var(--color-text-dark);
}

.router-link-active:not(.logo) .nav-icon {
  color: var(--color-primary);
}

.router-link-active:not(.logo) .nav-icon-text {
  color: var(--color-text-dark);
  font-weight: 800;
}

/* RIGHT SECTION: Controls & Profile */
.right-section {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.common-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.control-btn {
  font-family: 'Fredoka', sans-serif;
  font-weight: 800;
  padding: 0.5rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: 12px;
  background-color: var(--color-card-bg);
  color: var(--color-text-dark);
  cursor: pointer;
  box-shadow: 3px 3px 0px 0px rgba(0,0,0,1);
  transition: all 0.2s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn.icon-only {
  padding: 0.5rem;
  border-radius: 12px;
}

.control-btn:hover {
  transform: translate(-1px, -1px);
  box-shadow: 5px 5px 0px 0px rgba(0,0,0,1);
}

[data-theme='dark'] .control-btn {
  box-shadow: 3px 3px 0px 0px rgba(255,255,255,0.8);
}
[data-theme='dark'] .control-btn:hover {
  box-shadow: 5px 5px 0px 0px rgba(255,255,255,0.8);
}

.admin-panel-btn {
  background-color: var(--color-bg);
}

.user-actions {
  display: flex;
  align-items: center;
}

.profile-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Dark Pill Profile Card */
.profile-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  padding: 0.25rem 1rem 0.25rem 0.25rem; /* Pill padding */
  border-radius: 99px; /* Pill shape */
  background-color: #1A1A1A; /* Dark pill */
  color: #FFFFFF;
  border: 2px solid var(--color-border);
  box-shadow: 3px 3px 0px 0px rgba(0,0,0,1);
  transition: all 0.2s ease;
}

.profile-card:hover {
  transform: translate(-1px, -1px);
  box-shadow: 5px 5px 0px 0px rgba(0,0,0,1);
}

[data-theme='dark'] .profile-card {
  box-shadow: 3px 3px 0px 0px rgba(255,255,255,0.8);
  border-color: #FFFFFF;
}

.nav-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid var(--color-primary); /* Pop of color */
  background-color: #333;
}

.profile-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.nav-username {
  font-family: 'Fredoka', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  line-height: 1.1;
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-role {
  font-size: 0.65rem;
  color: #AAAAAA;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.logout-btn {
  /* Inherits from control-btn */
  border-radius: 12px;
}

.hamburger {
  display: none;
  /* ... omitting mobile toggle for brevity if unchanged, but keeping it functional ... */
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
  width: 100%;
  height: 2px;
  background-color: var(--color-text-dark);
  border-radius: 10px;
  transition: all 0.3s;
}

@media (max-width: 1200px) {
  .left-section, .right-section {
    gap: 1rem;
  }
  .nav-menu {
    gap: 1.5rem;
  }
  .logo span {
    display: none; /* Hide text, keep icon */
  }
}

@media (max-width: 1024px) {
  .mode-toggle { display: none; }
}

@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }

  .nav-menu {
    position: fixed;
    top: 80px;
    left: -100%;
    width: 100%;
    height: calc(100vh - 80px);
    background-color: var(--color-bg);
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-top: 2rem;
    transition: left 0.3s ease;
    border-top: 2px solid var(--color-border);
  }

  .nav-menu.is-active {
    left: 0;
  }

  .nav-item-icon {
    flex-direction: row;
    padding: 1rem;
    width: 100%;
    justify-content: center;
  }
  
  .right-section {
    gap: 0.75rem;
  }
  
  .user-actions {
    display: none; /* Can be moved inside mobile menu if needed */
  }
}
</style>
