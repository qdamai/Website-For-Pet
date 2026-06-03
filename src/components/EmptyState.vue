<template>
  <div class="empty-state flex flex-col items-center justify-center text-center p-8">
    <div class="empty-icon" v-html="svgIcon"></div>
    <h3 class="text-xl mt-4">{{ title }}</h3>
    <p class="text-sm mt-2 mb-4">{{ description }}</p>
    <slot name="action"></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Tidak Ada Data'
  },
  description: {
    type: String,
    default: 'Mungkin belum ada laporan di area ini.'
  },
  type: {
    type: String,
    default: 'pet' // pet, chat, etc
  }
});

// Using inline minimal SVG geometric animal
const svgIcon = computed(() => {
  if (props.type === 'pet') {
    return `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="50" fill="#FF8A65" stroke="#1A1A1A" stroke-width="4"/>
      <path d="M25 45L40 10L55 45" fill="#FFFDF9" stroke="#1A1A1A" stroke-width="4"/>
      <path d="M95 45L80 10L65 45" fill="#FFFDF9" stroke="#1A1A1A" stroke-width="4"/>
      <circle cx="45" cy="55" r="5" fill="#1A1A1A"/>
      <circle cx="75" cy="55" r="5" fill="#1A1A1A"/>
      <path d="M55 70C55 70 60 75 65 70" stroke="#1A1A1A" stroke-width="4" stroke-linecap="round"/>
    </svg>`;
  }
  return '';
});
</script>

<style scoped>
.empty-state {
  width: 100%;
  min-height: 300px;
}
.empty-icon {
  margin-bottom: 1rem;
  filter: drop-shadow(4px 4px 0px #1A1A1A);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}
</style>
