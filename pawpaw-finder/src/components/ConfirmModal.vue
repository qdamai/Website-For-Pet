<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="visible" class="confirm-overlay" @click.self="onCancel">
        <div class="confirm-card">
          <div class="confirm-icon">{{ iconMap[type] }}</div>
          <h3 class="confirm-title">{{ title }}</h3>
          <p class="confirm-message">{{ message }}</p>
          <div class="confirm-actions">
            <button class="btn-cancel" @click="onCancel">{{ cancelText }}</button>
            <button class="btn-confirm" :class="`btn-${type}`" @click="onConfirm">{{ confirmText }}</button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref } from 'vue';

const visible = ref(false);
const title = ref('');
const message = ref('');
const type = ref('info'); // info | danger | warning
const confirmText = ref('Ya, Lanjutkan');
const cancelText = ref('Batal');

const iconMap = { info: '💡', danger: '🗑️', warning: '⚠️', success: '✅' };

let resolveFn = null;

const open = (options = {}) => {
  title.value = options.title || 'Konfirmasi';
  message.value = options.message || 'Apakah Anda yakin?';
  type.value = options.type || 'info';
  confirmText.value = options.confirmText || 'Ya, Lanjutkan';
  cancelText.value = options.cancelText || 'Batal';
  visible.value = true;

  return new Promise((resolve) => {
    resolveFn = resolve;
  });
};

const onConfirm = () => {
  visible.value = false;
  resolveFn?.(true);
};

const onCancel = () => {
  visible.value = false;
  resolveFn?.(false);
};

defineExpose({ open });
</script>

<style scoped>
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
}

.confirm-card {
  background: #1a1a1a;
  border: 4px solid #000;
  border-radius: 24px;
  padding: 2.5rem 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 8px 8px 0px #000;
  font-family: 'Nunito', sans-serif;
}

.confirm-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.confirm-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 0.5rem;
}

.confirm-message {
  font-size: 0.95rem;
  font-weight: 600;
  color: #aaaaaa;
  margin: 0 0 2rem;
  line-height: 1.5;
}

.confirm-actions {
  display: flex;
  gap: 1rem;
}

.btn-cancel, .btn-confirm {
  flex: 1;
  padding: 0.85rem 1rem;
  border: 3px solid #000;
  border-radius: 12px;
  font-family: 'Fredoka', 'Nunito', sans-serif;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 3px 3px 0px #000;
  transition: all 0.15s;
}

.btn-cancel:hover, .btn-confirm:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0px #000;
}

.btn-cancel:active, .btn-confirm:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.btn-cancel { background: #262626; color: #aaaaaa; }
.btn-info    { background: #B39DDB; color: #1A1A1A; }
.btn-danger  { background: #FF6B6B; color: #fff; }
.btn-warning { background: #FFF176; color: #1A1A1A; }
.btn-success { background: #4ADE80; color: #1A1A1A; }

/* Modal animation */
.modal-fade-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-fade-leave-active { transition: all 0.2s ease-in; }
.modal-fade-enter-from  { opacity: 0; transform: scale(0.85); }
.modal-fade-leave-to    { opacity: 0; transform: scale(0.85); }
</style>
