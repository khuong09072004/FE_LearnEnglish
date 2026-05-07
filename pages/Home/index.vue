<template>
  <div class="home-page">
    <!-- Banner -->
    <section class="banner">
      <div class="banner-content">
          <img src="../../assets/banner1.png" alt="banner" />
      </div>
    </section>

    <!-- Cùng học ngay -->
    <section class="section">
      <h2 class="section-title">Cùng học ngay</h2>
      <div class="card-grid">
        <nuxt-link
          v-for="item in learningItems"
          :key="item.id"
          :to="item.to"
          class="learning-card"
        >
          <div class="card-icon">{{ item.icon }}</div>
          <h3 class="card-title">{{ item.title }}</h3>
          <p class="card-desc">{{ item.description }}</p>
          <span class="card-btn">Tiến lên »</span>
        </nuxt-link>
      </div>
    </section>

    <!-- Tiến trình học tập -->
    <section class="section">
      
      <Progress/>
    </section>
  </div>
</template>

<script>
import Progress from "../Progress/index.vue";
export default {
  layout: 'pageLayout',
  name: 'HomePage',
  middleware: 'auth',
  components: {
    Progress
  },
  data() {
    return {
      learningItems: [
        {
          id: 1,
          icon: '🐻',
          title: 'Từ vựng',
          description: 'Ghi nhớ từ mới nhanh hơn qua hình ảnh trực quan.',
          to: '/vocabulary',
        },
        {
          id: 2,
          icon: '📝',
          title: 'Ngữ pháp',
          description: 'Hiểu nhanh, nắm chắc các điểm ngữ pháp quan trọng.',
          to: '/grammar',
        },
        {
          id: 3,
          icon: '✏️',
          title: 'Làm bài tập',
          description: 'Luyện tập kiến thức với các bài tập đa dạng.',
          to: '/exercise',
        },
        {
          id: 4,
          icon: '✍️',
          title: 'Luyện viết với AI',
          description: 'Cải thiện ngữ pháp với các bài luyện viết cùng AI.',
          to: '/conversation',
        },
        {
          id: 5,
          icon: '📊',
          title: 'Tiến trình học tập',
          description: 'Xem lại quá trình học và đánh giá sự tiến bộ.',
          to: '/progress',
        },
      ],
      progressList: [
        { label: 'Từ vựng tuần này', value: 72 },
        { label: 'Ngữ pháp', value: 45 },
      ],
      stats: [
        { num: 12, label: 'Bài đã học' },
        { num: 5, label: 'Ngày liên tiếp' },
        { num: 340, label: 'Điểm tích luỹ' },
      ],
    }
  },
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  padding-bottom: 40px;
}

/* ---- Banner ---- */
.banner {
  border-radius: 16px;
  padding: 0px 40px;
  position: relative;
  overflow: hidden;
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.banner-text h1 {
  font-size: 22px;
  font-weight: 800;
  color: #1a5fa8;
  line-height: 1.45;
  margin: 0 0 8px;
  max-width: 380px;
}

.banner-text p {
  font-size: 14px;
  color: #4a90d9;
  font-weight: 600;
  margin: 0;
}

.banner-image {
  flex-shrink: 0;
  width: 150px;
  height: 150px;
}

.banner-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* ---- Section ---- */
.section {
  margin: 24px 16px 0;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a5fa8;
  margin: 0 0 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 23px;
  background: #4a90d9;
  border-radius: 4px;
}

/* ---- Card Grid ---- */
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.learning-card {
  background: #fff;
  border-radius: 14px;
  padding: 18px 16px 14px;
  border: 1.5px solid #d0e8fb;
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-decoration: none;
  transition: border-color 0.2s, transform 0.15s;
}

.learning-card:hover {
  border-color: #4a90d9;
  transform: translateY(-2px);
}

.card-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #eaf4ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-bottom: 4px;
}

.card-title {
  font-size: 14px;
  font-weight: 700;
  color: #1a5fa8;
  margin: 0;
}

.card-desc {
  font-size: 12px;
  color: #6ba5d4;
  margin: 0;
  line-height: 1.5;
  flex: 1;
}

.card-btn {
  margin-top: 8px;
  display: inline-block;
  background: #4a90d9;
  color: #fff;
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 12px;
  font-weight: 700;
  align-self: flex-start;
  transition: background 0.15s;
}

.learning-card:hover .card-btn {
  background: #2a72c0;
}

/* ---- Progress Card ---- */
.progress-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px;
  border: 1.5px solid #d0e8fb;
}

.progress-item {
  margin-bottom: 16px;
  
}

.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  color: #4a90d9;
  font-weight: 600;
  margin-bottom: 6px;
}

.progress-bar-bg {
  background: #eaf4ff;
  border-radius: 8px;
  height: 10px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: #4a90d9;
  border-radius: 8px;
  transition: width 0.6s ease;
}

.stats-row {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.stat-box {
  flex: 1;
  background: #eaf4ff;
  border-radius: 10px;
  padding: 12px;
  text-align: center;
}

.stat-num {
  font-size: 22px;
  font-weight: 800;
  color: #1a5fa8;
}

.stat-label {
  font-size: 11px;
  color: #6ba5d4;
  font-weight: 600;
  margin-top: 2px;
}

/* ---- Responsive ---- */
@media (max-width: 640px) {
  .banner {
    padding: 24px 20px;
  }
  .banner-text h1 {
    font-size: 17px;
  }
  .banner-image {
    width: 100px;
    height: 100px;
  }
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>