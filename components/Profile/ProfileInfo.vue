<template>
  <div class="info-card">
    <h3 class="card-title">Giới thiệu</h3>
    <div class="info-list">
      <div class="info-item">
        <Icon icon="mdi:calendar-clock" class="info-icon" />
        <div>
          <span class="info-label">Ngày tham gia:</span>
          <span class="info-value">{{ memberSince }}</span>
        </div>
      </div>
      <div class="info-item">
        <Icon icon="mdi:email" class="info-icon" />
        <div>
          <span class="info-label">Email:</span>
          <span class="info-value">{{ user.email }}</span>
        </div>
      </div>
      <div class="info-item">
        <Icon icon="mdi:chart-line" class="info-icon" />
        <div>
          <span class="info-label">Trình độ:</span>
          <span class="info-value">{{ user.Level || 'Chưa chọn cấp độ' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue2';

export default {
  name: 'ProfileInfo',
  components: {
    Icon,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
    memberSince: {
      type: String,
      default: 'Tháng 12, 2025',
    },
  },
};
</script>

<style scoped>
.info-card {
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

.info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.info-icon {
  font-size: 1.5rem;
  color: #3b82f6;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-label {
  display: block;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 2px;
}

.info-value {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

@media (max-width: 480px) {
  .info-card {
    padding: 16px;
  }
}
</style>
