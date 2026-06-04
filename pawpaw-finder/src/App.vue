<script setup>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <div class="app-layout">
    <Navbar />
    <div class="main-content">
      <router-view />
    </div>
    <Footer />
  </div>
</template>

<style>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-bg);
}

.main-content {
  flex: 1;
}
</style>
