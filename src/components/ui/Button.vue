<template>
  <button
    :class="[
      'font-bold rounded-full transition-all duration-300 ease-in-out active:scale-95',
      'shadow-sm hover:shadow-md hover:-translate-y-1',
      variantClasses,
      sizeClasses,
      block ? 'w-full block' : 'inline-block'
    ]"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary'
  },
  size: {
    type: String,
    default: 'md'
  },
  block: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary': return 'bg-[#fcd34d] text-[#78350f] hover:bg-[#fbbf24]'
    case 'secondary': return 'bg-[#93c5fd] text-[#1e3a8a] hover:bg-[#60a5fa]'
    case 'accent': return 'bg-[#f9a8d4] text-[#831843] hover:bg-[#f472b6]'
    case 'danger': return 'bg-[#fca5a5] text-[#7f1d1d] hover:bg-[#f87171]'
    case 'success': return 'bg-[#86efac] text-[#14532d] hover:bg-[#4ade80]'
    case 'white': return 'bg-white text-[#4b5563] hover:bg-gray-50 border border-[#e5e7eb]'
    default: return 'bg-[#fcd34d] text-[#78350f] hover:bg-[#fbbf24]'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'px-4 py-2 text-sm'
    case 'md': return 'px-6 py-3 text-base'
    case 'lg': return 'px-8 py-4 text-lg tracking-wide'
    default: return 'px-6 py-3 text-base'
  }
})
</script>
