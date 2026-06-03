<template>
  <div :class="[
    'bg-white rounded-[2rem] p-6',
    noShadow ? '' : 'shadow-lg shadow-[#cbd5e1]/30 border border-[#f1f5f9]'
  ]">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  noShadow: {
    type: Boolean,
    default: false
  }
})
</script>
