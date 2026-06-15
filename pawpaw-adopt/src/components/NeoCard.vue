<template>
  <div class="neo-card" :class="{'is-hoverable': hoverable}" @click="handleClick">
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  hoverable: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['click']);

const handleClick = (e) => {
  if (props.hoverable) {
    emit('click', e);
  }
};
</script>

<style scoped>
.neo-card {
  background-color: var(--color-card-bg);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-neo);
  transition: all 0.2s ease;
  overflow: hidden;
}

.neo-card.is-hoverable {
  cursor: pointer;
}

.neo-card.is-hoverable:hover {
  box-shadow: var(--shadow-neo-hover);
  transform: translateY(-4px);
}
</style>
