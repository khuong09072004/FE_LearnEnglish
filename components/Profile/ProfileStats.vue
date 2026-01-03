<template>
  <div class="learning-card">
    <h3 class="card-title">Tiến trình học tập</h3>
    
    <!-- Loading State -->
    <div v-if="loadingProgress" class="learning-stats-loading">
      <div class="loading-spinner"></div>
      <p>Đang tải dữ liệu...</p>
    </div>

    <!-- Learning Stats -->
    <div v-else class="learning-stats" :class="{ 'two-cols': !hasStreak }">
      <div class="stat-item">
        <div class="stat-icon-wrapper blue">
          <Icon icon="mdi:book-alphabet" class="stat-icon" />
        </div>
        <div class="stat-info">
          <p class="stat-label">Từ vựng</p>
          <p class="stat-value">{{ learnedVocabulary }}/{{ totalVocabulary }}</p>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon-wrapper green">
          <Icon icon="mdi:pencil" class="stat-icon" />
        </div>
        <div class="stat-info">
          <p class="stat-label">Bài tập</p>
          <p class="stat-value">{{ completedExercises }}/{{ totalExercises }}</p>
        </div>
      </div>
      <div v-if="hasStreak" class="stat-item">
        <div class="stat-icon-wrapper orange">
          <Icon icon="mdi:fire" class="stat-icon" />
        </div>
        <div class="stat-info">
          <p class="stat-label">Streak</p>
          <p class="stat-value">{{ streakDays }} ngày</p>
        </div>
      </div>
    </div>

    <!-- Level Selection -->
    <div class="level-section">
      <nuxt-link
        v-if="!hasSelectedLevel"
        to="/choose-level"
        class="level-btn primary"
      >
        <Icon icon="mdi:star" class="btn-icon" />
        Chọn cấp độ học tập
      </nuxt-link>
      <nuxt-link
        v-else
        to="/Change-Level"
        class="level-btn secondary"
      >
        Chọn lại cấp độ
      </nuxt-link>
    </div>

    <!-- Progress Link -->
    <nuxt-link to="/progress" class="progress-link">
      <Icon icon="mdi:chart-box" class="link-icon" />
      <span>Xem báo cáo chi tiết</span>
      <Icon icon="mdi:chevron-right" class="chevron-icon" />
    </nuxt-link>

    <!-- Learning Sections -->
    <div class="learning-sections">
      <h4 class="sections-title">Các phần học tập</h4>
      <div class="section-list">
        <nuxt-link to="/vocabulary" class="section-item">
          <div class="section-icon-wrapper">
            <Icon icon="mdi:book-alphabet" class="section-icon" />
          </div>
          <div class="section-info">
            <h5 class="section-name">Vocabulary</h5>
            <p class="section-desc">Học từ vựng và cụm từ</p>
          </div>
        </nuxt-link>
        
        <nuxt-link to="/grammar" class="section-item">
          <div class="section-icon-wrapper">
            <Icon icon="mdi:text-box-check" class="section-icon" />
          </div>
          <div class="section-info">
            <h5 class="section-name">Grammar</h5>
            <p class="section-desc">Luyện tập ngữ pháp</p>
          </div>
        </nuxt-link>
        
        <nuxt-link to="/exercise" class="section-item">
          <div class="section-icon-wrapper">
            <Icon icon="mdi:pencil" class="section-icon" />
          </div>
          <div class="section-info">
            <h5 class="section-name">Exercise</h5>
            <p class="section-desc">Bài tập thực hành</p>
          </div>
        </nuxt-link>
        
        <nuxt-link to="/conversation" class="section-item">
          <div class="section-icon-wrapper">
            <Icon icon="mdi:chat" class="section-icon" />
          </div>
          <div class="section-info">
            <h5 class="section-name">Conversation</h5>
            <p class="section-desc">Luyện hội thoại</p>
          </div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue2';

export default {
  name: 'ProfileStats',
  components: {
    Icon,
  },
  props: {
    loadingProgress: {
      type: Boolean,
      default: false,
    },
    totalVocabulary: {
      type: Number,
      default: 0,
    },
    learnedVocabulary: {
      type: Number,
      default: 0,
    },
    totalExercises: {
      type: Number,
      default: 0,
    },
    completedExercises: {
      type: Number,
      default: 0,
    },
    hasStreak: {
      type: Boolean,
      default: false,
    },
    streakDays: {
      type: Number,
      default: 0,
    },
    hasSelectedLevel: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.learning-card {
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

.learning-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.learning-stats.two-cols {
  grid-template-columns: repeat(2, 1fr);
}

.learning-stats-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 12px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-wrapper.blue {
  background: #dbeafe;
  color: #3b82f6;
}

.stat-icon-wrapper.green {
  background: #d1fae5;
  color: #10b981;
}

.stat-icon-wrapper.orange {
  background: #fed7aa;
  color: #f59e0b;
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0 0 4px 0;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.level-section {
  margin-bottom: 24px;
}

.level-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
}

.level-btn.primary {
  background: #3b82f6;
  color: white;
}

.level-btn.primary:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.level-btn.secondary {
  background: #f3f4f6;
  color: #3b82f6;
}

.level-btn.secondary:hover {
  background: #3b82f6;
  color: white;
}

.btn-icon {
  font-size: 1.25rem;
}

.progress-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 10px;
  text-decoration: none;
  color: #3b82f6;
  font-weight: 600;
  margin-bottom: 24px;
  transition: all 0.3s;
}

.progress-link:hover {
  background: #dbeafe;
  transform: translateX(4px);
}

.link-icon {
  font-size: 1.25rem;
}

.chevron-icon {
  font-size: 1.5rem;
}

.learning-sections {
  border-top: 2px solid #e5e7eb;
  padding-top: 24px;
}

.sections-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.section-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.section-item:hover {
  background: #dbeafe;
  border-color: #3b82f6;
  transform: translateX(4px);
}

.section-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-icon {
  font-size: 1.5rem;
  color: #3b82f6;
}

.section-info {
  flex: 1;
}

.section-name {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.section-desc {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

@media (max-width: 1024px) {
  .learning-stats {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .learning-stats {
    grid-template-columns: 1fr;
  }
  
  .learning-stats.two-cols {
    grid-template-columns: 1fr;
  }
  
  .stat-item {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .learning-card {
    padding: 16px;
  }
}
</style>
