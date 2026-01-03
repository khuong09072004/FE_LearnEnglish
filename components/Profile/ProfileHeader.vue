<template>
  <div class="profile-card">
    <!-- Cover Image -->
    <div class="cover-image">
      <div class="cover-overlay"></div>
    </div>

    <!-- Profile Info Section -->
    <div class="profile-info-section">
      <!-- Avatar -->
      <div class="avatar-container">
        <div class="avatar-wrapper" @click="viewAvatar">
          <img
            v-if="user.avatar"
            :src="user.avatar"
            :alt="user.name"
            class="avatar-image"
          />
          <div v-else class="avatar-placeholder">
            <Icon icon="mdi:account" class="avatar-icon" />
          </div>
          <div class="avatar-hover-overlay">
            <Icon icon="mdi:magnify-plus" class="overlay-icon" />
            <span class="overlay-text">Xem ảnh</span>
          </div>
        </div>
        <button @click="$emit('change-avatar')" class="avatar-edit-btn" title="Thay đổi ảnh đại diện">
          <Icon icon="mdi:camera" />
        </button>
      </div>

      <!-- Avatar Preview Modal -->
      <a-modal
        v-model="showAvatarModal"
        :footer="null"
        :width="600"
        centered
        @cancel="showAvatarModal = false"
      >
        <div class="avatar-preview-container">
          <img
            v-if="user.avatar"
            :src="user.avatar"
            :alt="user.name"
            class="avatar-preview-image"
          />
          <div v-else class="avatar-preview-placeholder">
            <Icon icon="mdi:account" class="preview-placeholder-icon" />
            <p>Chưa có ảnh đại diện</p>
          </div>
        </div>
        <div class="avatar-modal-actions">
          <button @click="$emit('change-avatar'); showAvatarModal = false" class="btn-change">
            <Icon icon="mdi:camera" />
            Thay đổi ảnh
          </button>
        </div>
      </a-modal>

      <!-- Name and Actions -->
      <div class="profile-header">
        <h1 class="profile-name">{{ user.name }}</h1>
        <button @click="$emit('toggle-edit')" class="settings-btn">
          Sửa thông tin
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue2';

export default {
  name: 'ProfileHeader',
  components: {
    Icon,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  emits: ['change-avatar', 'toggle-edit'],
  data() {
    return {
      showAvatarModal: false,
    };
  },
  methods: {
    viewAvatar() {
      if (this.user.avatar) {
        this.showAvatarModal = true;
      }
    },
  },
};
</script>

<style scoped>
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
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
}

.avatar-wrapper:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.avatar-hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  gap: 8px;
}

.avatar-wrapper:hover .avatar-hover-overlay {
  opacity: 1;
}

.overlay-icon {
  font-size: 2rem;
  color: white;
}

.overlay-text {
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
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

/* Avatar Preview Modal */
.avatar-preview-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: #f9fafb;
  border-radius: 12px;
  overflow: hidden;
}

.avatar-preview-image {
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: contain;
}

.avatar-preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #6b7280;
}

.preview-placeholder-icon {
  font-size: 6rem;
  color: #3b82f6;
  opacity: 0.5;
}

.avatar-modal-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 12px;
}

.btn-change {
  padding: 12px 24px;
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

.btn-change:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
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

@media (max-width: 768px) {
  .profile-info-section {
    padding: 0 20px 20px;
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
}

@media (max-width: 480px) {
  .cover-image {
    height: 150px;
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
}
</style>
