<template>
  <div class="splash-wrapper">
    <!-- Background Pattern -->
    <div class="pattern-bg"></div>

    <!-- Floating Ornaments -->
    <!-- Cloud -->
    <div class="cloud-ornament float-anim-1">
      <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 50C30 38.9543 38.9543 30 50 30C52.7936 30 55.4517 30.5746 57.8732 31.6033C61.4259 19.3408 72.8252 10 86 10C102.569 10 116 23.4315 116 40C116 56.5685 102.569 70 86 70H40C23.4315 70 10 56.5685 10 40C10 37.9406 10.2075 35.9295 10.6015 34C15.7533 43.4682 25.8677 50 37.5 50H30Z" fill="#FFFDF9" stroke="#1A1A1A" stroke-width="4"/>
        <circle cx="65" cy="45" r="4" fill="#1A1A1A"/>
        <circle cx="95" cy="45" r="4" fill="#1A1A1A"/>
        <path d="M75 55 Q 80 60 85 55" fill="none" stroke="#1A1A1A" stroke-width="4" stroke-linecap="round"/>
        <ellipse cx="55" cy="50" rx="6" ry="3" fill="#FF8A65" opacity="0.6"/>
        <ellipse cx="105" cy="50" rx="6" ry="3" fill="#FF8A65" opacity="0.6"/>
      </svg>
    </div>

    <!-- Flower -->
    <div class="flower-ornament float-anim-2">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="20" r="15" fill="#B39DDB" stroke="#1A1A1A" stroke-width="4"/>
        <circle cx="40" cy="60" r="15" fill="#B39DDB" stroke="#1A1A1A" stroke-width="4"/>
        <circle cx="20" cy="40" r="15" fill="#B39DDB" stroke="#1A1A1A" stroke-width="4"/>
        <circle cx="60" cy="40" r="15" fill="#B39DDB" stroke="#1A1A1A" stroke-width="4"/>
        <circle cx="40" cy="40" r="15" fill="#FFFDF9" stroke="#1A1A1A" stroke-width="4"/>
        <circle cx="35" cy="38" r="2" fill="#1A1A1A"/>
        <circle cx="45" cy="38" r="2" fill="#1A1A1A"/>
        <path d="M38 43 Q 40 46 42 43" fill="none" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>

    <!-- Main Center Card -->
    <div class="onboarding-card">
      
      <!-- Fixed Animal Logo -->
      <div class="logo-container animate-bounce-neo">
        <svg width="120" height="120" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 30 50 Q 20 10 60 30" fill="#FFFDF9" stroke="#1A1A1A" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M 120 50 Q 130 10 90 30" fill="#FFFDF9" stroke="#1A1A1A" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="75" cy="80" r="60" fill="#FFFDF9" stroke="#1A1A1A" stroke-width="6"/>
          <circle cx="55" cy="70" r="7" fill="#1A1A1A"/>
          <circle cx="95" cy="70" r="7" fill="#1A1A1A"/>
          <ellipse cx="40" cy="80" rx="8" ry="5" fill="#FF8A65" opacity="0.6"/>
          <ellipse cx="110" cy="80" rx="8" ry="5" fill="#FF8A65" opacity="0.6"/>
          <path d="M 70 85 Q 75 90 80 85" fill="none" stroke="#1A1A1A" stroke-width="4" stroke-linecap="round"/>
          <path d="M 60 95 Q 75 110 90 95" fill="none" stroke="#1A1A1A" stroke-width="5" stroke-linecap="round"/>
        </svg>
      </div>
      
      <!-- Titles Group -->
      <div class="title-group">
        <h1 class="splash-title">Pawpaw Finder</h1>
        <p class="splash-subtitle">Temukan & Selamatkan Teman Berbulu Kita</p>
      </div>
      
      <!-- CTA Button -->
      <button class="cta-button" @click="goToAuth">
        Mulai Sekarang!
      </button>

      <!-- Adoption CTA Button -->
      <a href="http://localhost:5173/" class="adoption-cta-button">
        Adopsi Hewan <PawPrint :size="18" class="inline" />
      </a>

    </div>
  </div>
</template>

<script setup>
import { FileText, MessageSquare, MapPin, Settings, Home, Camera, Calendar, PawPrint, Dog, Cat, AlertTriangle, XCircle, CheckCircle, Target, Heart, BarChart2, Dna, Cake, Scale, Sun, Moon } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToAuth = () => {
  router.push({ name: 'Auth' });
};
</script>

<style scoped>
/* Main Wrapper */
.splash-wrapper {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FF8A65; /* Coral / Salmon */
  position: relative;
  overflow: hidden;
  padding: 1rem;
  box-sizing: border-box;
}

/* Background Pattern */
.pattern-bg {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: radial-gradient(#1A1A1A 2px, transparent 2px);
  background-size: 32px 32px;
  opacity: 0.1;
  pointer-events: none;
}

/* Onboarding Card (Center Container) */
.onboarding-card {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 480px; 
  background-color: #FFFDF9; /* Soft Cream */
  border: 4px solid #1A1A1A;
  border-radius: 32px;
  box-shadow: 8px 8px 0px 0px #1A1A1A;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-sizing: border-box;
}

/* Logo Animation */
.logo-container {
  background-color: white;
  border: 4px solid #1A1A1A;
  border-radius: 50%;
  padding: 0.5rem;
  box-shadow: 4px 4px 0px 0px #1A1A1A;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.animate-bounce-neo {
  animation: bounceNeo 3s ease-in-out infinite;
}

@keyframes bounceNeo {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Titles */
.title-group {
  margin-bottom: 2.5rem;
}

.splash-title {
  font-family: 'Fredoka', sans-serif;
  font-weight: 800;
  font-size: 2.5rem;
  color: #1A1A1A;
  margin: 0 0 0.5rem 0;
}

.splash-subtitle {
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  font-size: 1.125rem;
  color: #555555;
  margin: 0;
}

/* High Contrast CTA Button */
.cta-button {
  width: 100%;
  font-family: 'Fredoka', 'Nunito', sans-serif;
  font-weight: 800;
  font-size: 1.25rem;
  padding: 1rem 1.5rem;
  background-color: #FFF176; /* Kuning Cerah / Lemon */
  border: 4px solid #1A1A1A;
  border-radius: 16px;
  color: #1A1A1A;
  box-shadow: 4px 4px 0px 0px #1A1A1A;
  transition: all 0.15s ease-in-out;
  cursor: pointer;
  outline: none;
  box-sizing: border-box;
}

.cta-button:hover {
  background-color: #FFE082;
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px 0px #1A1A1A;
}

.cta-button:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

/* Floating Ornaments */
.cloud-ornament {
  position: absolute;
  top: 15%;
  left: 10%;
  z-index: 0;
}

.flower-ornament {
  position: absolute;
  bottom: 15%;
  right: 10%;
  z-index: 0;
}

.float-anim-1 { animation: float1 6s ease-in-out infinite; }
.float-anim-2 { animation: float2 5s ease-in-out infinite reverse; }

@keyframes float1 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(0, -15px) rotate(5deg); }
}
@keyframes float2 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(10px, -10px) rotate(-10deg); }
}

@media (max-width: 768px) {
  .cloud-ornament, .flower-ornament {
    display: none;
  }
  .onboarding-card {
    padding: 2.5rem 1.5rem;
  }
  .splash-title {
    font-size: 2rem;
  }
}

.adoption-cta-button {
  display: block;
  width: 100%;
  text-align: center;
  text-decoration: none;
  font-family: 'Fredoka', 'Nunito', sans-serif;
  font-weight: 800;
  font-size: 1.25rem;
  padding: 1rem 1.5rem;
  background-color: #B39DDB; /* Purple */
  border: 4px solid #1A1A1A;
  border-radius: 16px;
  color: #1A1A1A;
  box-shadow: 4px 4px 0px 0px #1A1A1A;
  transition: all 0.15s ease-in-out;
  cursor: pointer;
  outline: none;
  box-sizing: border-box;
  margin-top: 1rem;
}

.adoption-cta-button:hover {
  background-color: #D1C4E9;
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px 0px #1A1A1A;
}

.adoption-cta-button:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}
</style>
