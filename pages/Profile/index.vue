<template>
  <div class="profile-page">
    <!-- Profile Header Card -->
    <ProfileHeader
      :user="user"
      @change-avatar="handleChangeAvatar"
      @toggle-edit="editMode = !editMode"
    />

    <!-- Content Grid -->
    <div class="content-grid">
      <!-- Left Column: About -->
      <div class="left-column">
        <!-- Giới thiệu -->
        <ProfileInfo :user="user" :member-since="memberSince" />

        <!-- Motto/Quote -->
        <div class="quote-card">
          <Icon icon="mdi:format-quote-open" class="quote-icon" />
          <p class="quote-text">
            "Học tiếng Anh không chỉ là học một ngôn ngữ, mà là mở ra cánh cửa đến với thế giới rộng lớn."
          </p>
        </div>

        <!-- Quick Actions -->
        <ProfileActions
          :is-google-account="isGoogleAccount"
          @change-password="changePasswordMode = true"
          @logout="handleLogout"
        />
      </div>

      <!-- Right Column: Learning Progress -->
      <div class="right-column">
        <ProfileStats
          :loading-progress="loadingProgress"
          :total-vocabulary="totalVocabulary"
          :learned-vocabulary="learnedVocabulary"
          :total-exercises="totalExercises"
          :completed-exercises="completedExercises"
          :has-streak="hasStreak"
          :streak-days="streakDays"
          :has-selected-level="user.has_selected_level"
        />
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <a-modal
      v-model="editMode"
      title="Chỉnh sửa thông tin"
      :footer="null"
      :width="500"
      @cancel="editMode = false"
    >
      <form @submit.prevent="submitUpdateProfile" class="edit-form-modal">
        <div class="form-group">
          <label class="form-label">Họ và tên</label>
          <input
            v-model="editForm.fullName"
            type="text"
            required
            class="form-input"
            placeholder="Nhập họ và tên"
          />
        </div>
        <div class="form-group">
          <label class="form-label">Ngày sinh</label>
          <input
            v-model="editForm.dateOfBirth"
            type="date"
            class="form-input"
            placeholder="Chọn ngày sinh"
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
      </form>
    </a-modal>

    <!-- Change Password Modal -->
    <a-modal
      v-model="changePasswordMode"
      title="Đổi mật khẩu"
      :footer="null"
      :width="500"
      @cancel="resetPasswordForm"
    >
      <form @submit.prevent="submitChangePassword" class="edit-form-modal">
        <div class="form-group">
          <label class="form-label">Mật khẩu hiện tại</label>
          <input
            v-model="passwordForm.currentPassword"
            type="password"
            required
            class="form-input"
            placeholder="Nhập mật khẩu hiện tại"
          />
        </div>
        <div class="form-group">
          <label class="form-label">Mật khẩu mới</label>
          <input
            v-model="passwordForm.newPassword"
            type="password"
            required
            class="form-input"
            placeholder="Nhập mật khẩu mới"
          />
        </div>
        <div class="form-group">
          <label class="form-label">Xác nhận mật khẩu mới</label>
          <input
            v-model="passwordForm.confirmPassword"
            type="password"
            required
            class="form-input"
            placeholder="Nhập lại mật khẩu mới"
          />
        </div>
        <div class="form-actions">
          <button type="button" @click="resetPasswordForm" class="btn-cancel">
            Hủy
          </button>
          <button type="submit" :disabled="loading" class="btn-save">
            {{ loading ? 'Đang lưu...' : 'Đổi mật khẩu' }}
          </button>
        </div>
      </form>
    </a-modal>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue2';
import ProfileHeader from '~/components/Profile/ProfileHeader.vue';
import ProfileInfo from '~/components/Profile/ProfileInfo.vue';
import ProfileActions from '~/components/Profile/ProfileActions.vue';
import ProfileStats from '~/components/Profile/ProfileStats.vue';
import { useProfile } from '~/composables/useProfile';
import { useAvatar } from '~/composables/useAvatar';
import { usePassword } from '~/composables/usePassword';
import { useLearningProgress } from '~/composables/useLearningProgress';

export default {
  name: 'ProfilePage',
  layout: 'pageLayout',
  components: {
    Icon,
    ProfileHeader,
    ProfileInfo,
    ProfileActions,
    ProfileStats,
  },
  middleware: 'auth',

  setup() {
    const {
      profileData,
      loading: profileLoading,
      editMode,
      editForm,
      user,
      isGoogleAccount,
      memberSince,
      fetchProfile,
      handleUpdateProfile,
    } = useProfile();

    const { loading: avatarLoading, changeAvatar } = useAvatar(profileData);

    const {
      changePasswordMode,
      loading: passwordLoading,
      passwordForm,
      handleChangePassword,
      resetPasswordForm,
    } = usePassword();

    const {
      loadingProgress,
      totalVocabulary,
      learnedVocabulary,
      totalExercises,
      completedExercises,
      hasStreak,
      streakDays,
      fetchProgress,
    } = useLearningProgress();

    return {
      profileData,
      profileLoading,
      avatarLoading,
      editMode,
      editForm,
      user,
      isGoogleAccount,
      memberSince,
      fetchProfile,
      handleUpdateProfile,
      changeAvatar,
      changePasswordMode,
      passwordLoading,
      passwordForm,
      handleChangePassword,
      resetPasswordForm,
      loadingProgress,
      totalVocabulary,
      learnedVocabulary,
      totalExercises,
      completedExercises,
      hasStreak,
      streakDays,
      fetchProgress,
    };
  },

  computed: {
    loading() {
      return this.profileLoading || this.avatarLoading || this.passwordLoading;
    },
  },

  mounted() {
    this.fetchProfile();
    this.fetchProgress();
  },

  methods: {
    handleChangeAvatar() {
      this.changeAvatar({
        $store: this.$store,
        $message: this.$message,
      });
    },

    async submitUpdateProfile() {
      await this.handleUpdateProfile({
        $store: this.$store,
        $message: this.$message,
      });
    },

    async submitChangePassword() {
      await this.handleChangePassword({
        $message: this.$message,
      });
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

/* Quote Card */
.quote-card {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-left: 4px solid #3b82f6;
  position: relative;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

/* Right Column */
.right-column {
  display: flex;
  flex-direction: column;
}

/* Modal Form Styles */
.edit-form-modal {
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

/* Responsive */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .quote-card {
    padding: 16px;
  }
}
</style>
