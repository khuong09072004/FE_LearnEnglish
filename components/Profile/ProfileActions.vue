<template>
  <div class="actions-card">
    <h3 class="card-title">Hành động nhanh</h3>
    <div class="action-buttons">
      <button
        v-if="!isGoogleAccount"
        @click="$emit('change-password')"
        class="action-btn"
      >
        <Icon icon="mdi:lock-reset" class="action-icon" />
        Đổi mật khẩu
      </button>
      <button @click="$emit('logout')" class="action-btn logout-btn">
        <Icon icon="mdi:logout" class="action-icon" />
        Đăng xuất
      </button>
    </div>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue2';

export default {
  name: 'ProfileActions',
  components: {
    Icon,
  },
  props: {
    isGoogleAccount: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['change-password', 'logout'],
};
</script>

<style scoped>
.actions-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e5e7eb;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  padding: 14px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.action-btn:hover {
  background: #2563eb;
  transform: translateX(4px);
}

.action-btn.logout-btn {
  background: #ef4444;
}

.action-btn.logout-btn:hover {
  background: #dc2626;
}

.action-icon {
  font-size: 1.25rem;
}

@media (max-width: 480px) {
  .actions-card {
    padding: 16px;
  }
}
</style>
