<script setup>
import Footer from './components/Footer.vue';
</script>

<template>
  <div class="app-layout">
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
}

.main-content {
  flex: 1;
}
</style>
