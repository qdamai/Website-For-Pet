<template>
  <!-- Toast Stack Container -->
  <teleport to="body">
    <div class="toast-stack">
      <transition-group name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast-item"
          :class="`toast-${toast.type}`"
          @click="remove(toast.id)"
        >
          <span class="toast-icon">{{ icons[toast.type] }}</span>
          <div class="toast-content">
            <p class="toast-title">{{ toast.title }}</p>
            <p v-if="toast.message" class="toast-message">{{ toast.message }}</p>
          </div>
          <button class="toast-close">✕</button>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { ref } from 'vue';

const toasts = ref([]);

const icons = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️'
};

let nextId = 0;

const add = (title, message = '', type = 'success', duration = 4000) => {
  const id = ++nextId;
  toasts.value.push({ id, title, message, type });
  setTimeout(() => remove(id), duration);
  return id;
};

const remove = (id) => {
  const idx = toasts.value.findIndex(t => t.id === id);
  if (idx !== -1) toasts.value.splice(idx, 1);
};

// Expose shortcut methods
defineExpose({ add, remove, success: (t, m) => add(t, m, 'success'), error: (t, m) => add(t, m, 'error'), warning: (t, m) => add(t, m, 'warning'), info: (t, m) => add(t, m, 'info') });
</script>

<style scoped>
.toast-stack {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 9999;
  display: flex;
  flex-direction: column-reverse;
  gap: 0.75rem;
  pointer-events: none;
  max-width: 380px;
  width: 90vw;
}

.toast-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 16px;
  border: 3px solid #000;
  box-shadow: 4px 4px 0px #000;
  cursor: pointer;
  pointer-events: all;
  font-family: 'Nunito', sans-serif;
  transition: all 0.2s;
  position: relative;
}

.toast-item:hover {
  transform: translateX(-4px);
}

.toast-success { background-color: #4ADE80; color: #1A1A1A; }
.toast-error   { background-color: #FF6B6B; color: #fff; }
.toast-warning { background-color: #FFF176; color: #1A1A1A; }
.toast-info    { background-color: #B39DDB; color: #1A1A1A; }

.toast-icon { font-size: 1.25rem; flex-shrink: 0; }

.toast-content { flex: 1; min-width: 0; }

.toast-title {
  font-weight: 800;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.3;
}

.toast-message {
  font-size: 0.8rem;
  font-weight: 600;
  margin: 0.25rem 0 0;
  opacity: 0.85;
  line-height: 1.4;
  word-break: break-word;
}

.toast-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 800;
  opacity: 0.6;
  padding: 0;
  flex-shrink: 0;
  color: inherit;
}

.toast-close:hover { opacity: 1; }

/* Transition animations */
.toast-enter-active { transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-leave-active { transition: all 0.25s ease-in; }
.toast-enter-from  { opacity: 0; transform: translateX(60px) scale(0.85); }
.toast-leave-to    { opacity: 0; transform: translateX(60px) scale(0.85); }
</style>
