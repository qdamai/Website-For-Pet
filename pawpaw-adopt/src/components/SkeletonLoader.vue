<template>
  <div class="skeleton-loader skeleton" :style="{ width, height, borderRadius: isCircle ? '50%' : 'var(--radius-lg)' }">
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
  border: var(--border-width) solid var(--color-border);
}
</style>
