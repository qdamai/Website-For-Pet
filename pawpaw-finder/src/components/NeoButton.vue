<template>
  <button 
    :class="['neo-button', variantClass, sizeClass, { 'is-disabled': disabled }]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary', // primary, secondary, success, danger
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg
  },
  disabled: {
    type: Boolean,
    default: false,
  }
});

defineEmits(['click']);

const variantClass = computed(() => `neo-button-${props.variant}`);
const sizeClass = computed(() => `neo-button-${props.size}`);
</script>

<style scoped>
.neo-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-weight: 700;
  cursor: pointer;
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  box-shadow: var(--shadow-neo);
}

.neo-button:hover:not(.is-disabled) {
  box-shadow: var(--shadow-neo-hover);
  transform: translate(-2px, -2px);
}

.neo-button:active:not(.is-disabled) {
  box-shadow: var(--shadow-neo-active);
  transform: translate(2px, 2px);
}

.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

/* Variants */
.neo-button-primary { background-color: var(--color-primary); color: #1A1A1A; }
.neo-button-secondary { background-color: var(--color-accent-2); color: #1A1A1A; }
.neo-button-success { background-color: var(--color-success); color: #1A1A1A; }
.neo-button-danger { background-color: #FF5252; color: #fff; }

/* Sizes */
.neo-button-sm { padding: 0.5rem 1rem; font-size: 0.875rem; border-radius: var(--radius-sm); }
.neo-button-md { padding: 0.75rem 1.5rem; font-size: 1rem; }
.neo-button-lg { padding: 1rem 2rem; font-size: 1.125rem; border-radius: var(--radius-lg); }
</style>
