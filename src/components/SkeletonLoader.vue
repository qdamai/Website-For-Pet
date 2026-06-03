<template>
  <div class="skeleton-loader" :style="{ width, height, borderRadius: isCircle ? '50%' : 'var(--radius-lg)' }">
    <div class="skeleton-shimmer"></div>
  </div>
</template>

<script setup>
defineProps({
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '200px'
  },
  isCircle: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.skeleton-loader {
  background-color: #e0e0e0;
  position: relative;
  overflow: hidden;
  border: var(--border-width) dashed var(--color-border);
}

.skeleton-shimmer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>
