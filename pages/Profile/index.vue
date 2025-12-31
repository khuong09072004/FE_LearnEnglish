<template>
  <div class="profile-page">
    <!-- Profile Header Card -->
    <div class="profile-card">
      <!-- Cover Image -->
      <div class="cover-image">
        <div class="cover-overlay">       
        </div>
       
      </div>

      <!-- Profile Info Section -->
      <div class="profile-info-section">
        <!-- Avatar -->
        <div class="avatar-container">
          <div class="avatar-wrapper">
            <img
              v-if="user.avatar"
              :src="user.avatar"
              :alt="user.name"
              class="avatar-image"
            />
            <div v-else class="avatar-placeholder">
              <Icon icon="mdi:account" class="avatar-icon" />
            </div>
          </div>
          <button @click="changeAvatar" class="avatar-edit-btn">
            <Icon icon="mdi:camera" />
          </button>
        </div>

        <!-- Name and Actions -->
        <div class="profile-header">
          <h1 class="profile-name">{{ user.name }}</h1>
          <button @click="editMode = !editMode" class="settings-btn">
            <Icon icon="mdi:cog" class="mr-1" />
            Cài đặt
          </button>
        </div>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="content-grid">
      <!-- Left Column: About -->
      <div class="left-column">
        <!-- Giới thiệu -->
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
                <span class="info-label">Trạng thái:</span>
                <span class="info-value">{{ user.has_selected_level ? 'Đã chọn cấp độ' : 'Chưa chọn cấp độ' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Motto/Quote -->
        <div class="quote-card">
          <Icon icon="mdi:format-quote-open" class="quote-icon" />
          <p class="quote-text">
            "Học tiếng Anh không chỉ là học một ngôn ngữ, mà là mở ra cánh cửa đến với thế giới rộng lớn."
          </p>
        </div>

        <!-- Edit Form Modal -->
        <div v-if="editMode" class="edit-card">
          <h3 class="card-title">Chỉnh sửa thông tin</h3>
          <form @submit.prevent="handleUpdateProfile" class="edit-form">
            <div class="form-group">
              <label class="form-label">Họ và tên</label>
              <input
                v-model="editForm.name"
                type="text"
                required
                class="form-input"
                placeholder="Nhập họ và tên"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input
                v-model="editForm.email"
                type="email"
                required
                class="form-input"
                placeholder="Nhập email"
              />
            </div>
            <div class="form-actions">
              <button type="button" @click="editMode = false" class="btn-cancel">
                Hủy
              </button>
              <button type="submit" :disabled="loading" class="btn-save">
                {{ loading ? 'Đang lưu...' : 'Lưu thay đổi' }}
              </button>
            </div>
            <div v-if="successMessage" class="alert-success">{{ successMessage }}</div>
            <div v-if="errorMessage" class="alert-error">{{ errorMessage }}</div>
          </form>
        </div>

        <!-- Quick Actions -->
        <div class="actions-card">
          <h3 class="card-title">Hành động nhanh</h3>
          <div class="action-buttons">
            <button @click="handleChangePassword" class="action-btn">
              <Icon icon="mdi:lock-reset" class="action-icon" />
              Đổi mật khẩu
            </button>
            <button @click="handleLogout" class="action-btn logout-btn">
              <Icon icon="mdi:logout" class="action-icon" />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      <!-- Right Column: Learning Progress -->
      <div class="right-column">
        <div class="learning-card">
          <h3 class="card-title">Tiến trình học tập</h3>
          
          <!-- Learning Stats -->
          <div v-if="loadingProgress" class="learning-stats-loading">
            <div class="loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
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
              v-if="!user.has_selected_level"
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
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue2';
import { trackLearningProgress } from '~/apis/level';

export default {
  name: 'ProfilePage',
  layout: 'pageLayout',
  components: {
    Icon,
  },
  middleware: 'auth',

  data() {
    return {
      editMode: false,
      loading: false,
      successMessage: '',
      errorMessage: '',
      editForm: {
        name: '',
        email: '',
      },
      progressData: null,
      loadingProgress: false,
    };
  },

  computed: {
    user() {
      return this.$store.getters['auth/user'] || {};
    },
    memberSince() {
      // Bạn có thể thêm thông tin này vào cookie nếu cần
      return 'Tháng 12, 2025';
    },
    totalVocabulary() {
      return this.progressData?.totalVocabulary || 0;
    },
    learnedVocabulary() {
      return this.progressData?.learnedVocabulary || 0;
    },
    totalExercises() {
      return this.progressData?.totalExercises || 0;
    },
    completedExercises() {
      return this.progressData?.completedExercises || 0;
    },
    hasStreak() {
      return this.progressData?.streak && this.progressData.streak > 0;
    },
    streakDays() {
      return this.progressData?.streak || 0;
    },
  },

  mounted() {
    // Khởi tạo form edit với dữ liệu hiện tại
    this.editForm.name = this.user.name || '';
    this.editForm.email = this.user.email || '';
    // Lấy dữ liệu tiến độ học tập
    this.fetchProgress();
  },

  methods: {
    async fetchProgress() {
      this.loadingProgress = true;
      try {
        const response = await trackLearningProgress();
        if (response.status === 'success') {
          this.progressData = response.data;
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        this.loadingProgress = false;
      }
    },

    changeCover() {
      // Tạo input file để chọn ảnh bìa
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
          this.errorMessage = 'Ảnh không được vượt quá 5MB';
          return;
        }

        // TODO: Implement upload cover image API
        console.log('Upload cover image:', file);
      };

      input.click();
    },

    async changeAvatar() {
      // Tạo input file để chọn ảnh
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Kiểm tra kích thước file (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          this.errorMessage = 'Ảnh không được vượt quá 5MB';
          return;
        }

        // Upload avatar
        try {
          this.loading = true;
          const formData = new FormData();
          formData.append('avatar', file);

          const { uploadAvatar } = await import('~/apis/auth');
          const response = await uploadAvatar(formData);

          // Cập nhật lại store với avatar mới
          await this.$store.dispatch('auth/login', {
            token: this.$store.getters['auth/token'],
            name: this.user.name,
            email: this.user.email,
            avatar: response.data.avatar,
            has_selected_level: this.user.has_selected_level,
          });

          this.successMessage = 'Cập nhật avatar thành công!';
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        } catch (error) {
          this.errorMessage = error.response?.data?.message || 'Có lỗi khi upload avatar';
        } finally {
          this.loading = false;
        }
      };

      input.click();
    },

    async handleUpdateProfile() {
      this.loading = true;
      this.successMessage = '';
      this.errorMessage = '';

      try {
        // Gọi API cập nhật profile
        const { updateProfile } = await import('~/apis/auth');
        const response = await updateProfile({
          name: this.editForm.name,
          email: this.editForm.email,
        });

        // Cập nhật lại cookie và store với dữ liệu mới từ BE
        await this.$store.dispatch('auth/login', {
          token: this.$store.getters['auth/token'],
          name: response.data.name,
          email: response.data.email,
          avatar: response.data.avatar || this.user.avatar,
          has_selected_level: response.data.has_selected_level,
        });

        this.successMessage = 'Cập nhật thông tin thành công!';
        this.editMode = false;
        
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin!';
      } finally {
        this.loading = false;
      }
    },

    handleChangePassword() {
      // Chuyển đến trang đổi mật khẩu
      this.$router.push('/forgotpassword');
    },

    handleLogout() {
      if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        this.$store.dispatch('auth/logout');
        this.$router.push('/login');
      }
    },
  },
};
</script>

<style scoped>
.profile-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* Profile Card */
.profile-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.cover-image {
  height: 320px;
  background-image: url('~/assets/bg-prl.jpeg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}



.cover-overlay {
  text-align: center;
  z-index: 1;
}

.cover-text {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 8px;
  letter-spacing: 2px;
}

.cover-subtext {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.95);
  font-style: italic;
}

.change-cover-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.9);
  color: #3b82f6;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
}

.change-cover-btn:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.profile-info-section {
  padding: 0 32px 24px;
  position: relative;
}

.avatar-container {
  position: relative;
  width: 140px;
  height: 140px;
  margin: -70px auto 20px;
}

.avatar-wrapper {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 5px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  background: #e5e7eb;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.avatar-icon {
  font-size: 5rem;
  color: #3b82f6;
}

.avatar-edit-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1.25rem;
}

.avatar-edit-btn:hover {
  background: #2563eb;
  transform: scale(1.1);
}

.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.profile-name {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.settings-btn {
  padding: 10px 20px;
  background: white;
  border: 2px solid #3b82f6;
  color: #3b82f6;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.settings-btn:hover {
  background: #3b82f6;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
}

/* Left Column */
.left-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card,
.quote-card,
.edit-card,
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

.quote-card {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-left: 4px solid #3b82f6;
  position: relative;
}

.quote-icon {
  font-size: 2rem;
  color: #3b82f6;
  opacity: 0.3;
  position: absolute;
  top: 16px;
  left: 16px;
}

.quote-text {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #1f2937;
  font-style: italic;
  margin: 0;
  padding-left: 40px;
}

/* Edit Form */
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.form-input {
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
}

.btn-cancel,
.btn-save {
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-cancel {
  background: #e5e7eb;
  color: #374151;
}

.btn-cancel:hover {
  background: #d1d5db;
}

.btn-save {
  background: #3b82f6;
  color: white;
}

.btn-save:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.alert-success {
  padding: 12px;
  background: #d1fae5;
  color: #065f46;
  border-radius: 8px;
  font-size: 0.875rem;
}

.alert-error {
  padding: 12px;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 8px;
  font-size: 0.875rem;
}

/* Actions Card */
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

/* Right Column */
.right-column {
  display: flex;
  flex-direction: column;
}

.learning-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

/* Responsive */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .learning-stats {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .profile-info-section {
    padding: 0 20px 20px;
  }
  
  .cover-text {
    font-size: 1.75rem;
  }
  
  .cover-subtext {
    font-size: 0.875rem;
  }
  
  .avatar-container {
    width: 120px;
    height: 120px;
    margin: -60px auto 16px;
  }
  
  .avatar-wrapper {
    width: 120px;
    height: 120px;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-name {
    font-size: 1.5rem;
  }
  
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
  .cover-image {
    height: 150px;
  }
  
  .change-cover-btn {
    font-size: 0.75rem;
    padding: 6px 12px;
  }
  
  .avatar-container {
    width: 100px;
    height: 100px;
    margin: -50px auto 12px;
  }
  
  .avatar-wrapper {
    width: 100px;
    height: 100px;
  }
  
  .info-card,
  .quote-card,
  .edit-card,
  .actions-card,
  .learning-card {
    padding: 16px;
  }
}
</style>
