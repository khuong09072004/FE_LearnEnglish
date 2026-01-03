<template>
  <header class="app-header">
    <!-- Bên trái -->
    <div class="header-left">
      <!-- Nút back hoặc menu -->
      <template v-if="isLoggedIn">
        <!-- Nút quay lại khi ở trang profile -->
        <span 
          v-if="showBackButton"
          class="back-button" 
          @click="$emit('goBack')"
        >
        <a-icon type="left" />
          <span class="back-text">Quay lại</span>
        </span>
        
        <!-- Nút menu thông thường -->
        <span 
          v-else
          class="trigger" 
          @click="isMobile ? $emit('menuToggle') : $emit('toggle')"
        >
          <a-icon :type="isMobile ? 'menu' : (collapsed ? 'menu-unfold' : 'menu-fold')" />
        </span>
      </template>

      <!-- Tiêu đề trang -->
      <div class="title-star">
        <a-icon type="star" theme="filled" class="star-icon" />
        <div class="page-title">{{ pageTitleVi }}</div>
      </div>
    </div>

    <!-- Bên phải -->
    <div class="header-right">
      <template v-if="isLoggedIn">
        <!-- Icon Thông báo -->
        <NotificationDropdown :isLoggedIn="isLoggedIn" />

        <!-- Avatar -->
        <a-popover trigger="click" placement="bottomRight">
          <template #content>
            <div class="user-popover">
              <!-- Thông tin user -->
              <div class="user-info">
                <a-avatar :src="userAvatar" size="large" />
                <div class="user-name">{{ user?.name }}</div>
                <div class="user-email">{{ user?.email }}</div>
              </div>

              <a-divider class="my-2" />

              <!-- Các hành động -->
              <div class="action-buttons">
                <a-button type="link" block @click="goToProfile">
                  <a-icon type="user" /> Xem trang cá nhân
                </a-button>
                <a-button type="link" block @click="goToTrackProgress">
                  <a-icon type="bar-chart" /> Theo dõi tiến độ
                </a-button>
                <a-divider class="my-2" />
                <a-button type="link" block danger @click="confirmLogout">
                  <a-icon type="logout" /> Đăng xuất
                </a-button>
              </div>
            </div>
          </template>

          <!-- Avatar -->
          <a-avatar
            :src="userAvatar"
            :size="isMobile ? 'default' : 'large'"
            class="user-avatar"
          />
        </a-popover>
      </template>

      <template v-else>
        <nuxt-link to="/login" class="login-link">
          Đăng nhập
        </nuxt-link>
      </template>
    </div>
  </header>
</template>

<script>
import { mapGetters } from "vuex";
import NotificationDropdown from "./NotificationDropdown.vue";

export default {
  name: "Header",
  components: {
    NotificationDropdown,
  },
  props: {
    collapsed: { type: Boolean, default: false },
    isMobile: { type: Boolean, default: false },
    showBackButton: { type: Boolean, default: false },
  },
  data() {
    return {
      currentLang: "vi",
    };
  },
  computed: {
    ...mapGetters("auth", ["isLoggedIn", "user"]),
    pageTitleVi() {
      if (!this.$route.name) return "Không có tiêu đề";

      const routeName = this.$route.name.toLowerCase();
      const mapping = {
        home: "Trang chủ",
        dashboard: "Bảng điều khiển",
        profile: "Hồ sơ cá nhân",
        users: "Người dùng",
        settings: "Cài đặt",
        login: "Đăng nhập",
        register: "Đăng ký",
        vocabulary: "Từ Vựng",
        grammar: "Ngữ Pháp",
        exercise: "Bài Tập",
        files: "Tệp tin",
        games: "Trò chơi",
      };
      return mapping[routeName] || "Trang";
    },
    userAvatar() {
      return (
        this.user?.avatar ||
        "https://cdn-icons-png.flaticon.com/512/847/847969.png"
      );
    },
  },
  watch: {
    notificationVisible(val) {
      if (val && this.notifications.length === 0) {
        this.fetchNotifications();
      }
    },
  },
  methods: {
    confirmLogout() {
      this.$confirm({
        title: "Xác nhận đăng xuất",
        content: "Bạn có chắc chắn muốn đăng xuất không?",
        okText: "Đăng xuất",
        cancelText: "Hủy",
        onOk: () => {
          this.$store.dispatch("auth/logout");
          this.$message.success("Đã đăng xuất");
          this.$router.push("/login");
        },
      });
    },
    goToProfile() {
      this.$router.push("/profile");
    },
    goToEditProfile() {
      this.$router.push("/profile/edit");
    },
    goToTrackProgress() {
      this.$router.push("/progress");
    },
  },
  mounted() {
    const savedLang = localStorage.getItem("selectedLanguage");
    if (savedLang) {
      this.currentLang = savedLang;
    }
  },
};
</script>

<style scoped>
.app-header {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  gap: 20px;
  border-radius: 18px;
  box-shadow: 0 2px 6px #2553b91a;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
  min-width: 0;
}

.trigger {
  display: flex;
  cursor: pointer;
  align-items: center;
  font-size: 20px;
  transition: color 0.3s;
  flex-shrink: 0;
}

.trigger:hover {
  color: #1890ff;
}

.back-button {
  display: flex;
  cursor: pointer;
  align-items: center;
  gap: 3px;
  flex-shrink: 0;
  opacity: 0.8;
  font-weight: 700;
}

.back-button .anticon {
  font-size: 14px;
}

.back-text {
  font-size: 14px;
}

.title-star {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.star-icon {
  font-size: 22px;
  flex-shrink: 0;
}

.page-title {
  font-weight: 700;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.user-avatar {
  cursor: pointer;
  transition: opacity 0.3s;
}

.user-avatar:hover {
  opacity: 0.8;
}

.login-link {
  color: #1890ff;
  font-weight: 500;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
}

.user-popover {
  padding: 12px;
  width: 224px;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.user-name {
  margin-top: 8px;
  font-weight: 600;
  color: #1f2937;
}

.user-email {
  color: #6b7280;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.action-buttons .ant-btn {
  text-align: left !important;
}

/* Tablet: 768px - 1023px */
@media (max-width: 1023px) and (min-width: 768px) {
  .app-header {
    padding: 0 24px;
    gap: 16px;
  }

  .header-left {
    gap: 16px;
  }

  .page-title {
    font-size: 15px;
  }
}

/* Mobile: < 768px */
@media (max-width: 767px) {
  .app-header {
    height: 56px;
    padding: 0 16px;
    gap: 12px;
    border-radius: 12px;
  }

  .header-left {
    gap: 12px;
  }

  .trigger {
    font-size: 18px;
  }

  .star-icon {
    font-size: 20px;
  }

  .page-title {
    font-size: 15px;
  }

  .header-right {
    gap: 12px;
  }
}

/* Small Mobile: < 480px */
@media (max-width: 479px) {
  .app-header {
    height: 52px;
    padding: 0 12px;
    gap: 8px;
    border-radius: 10px;
  }

  .header-left {
    gap: 8px;
  }

  .star-icon {
    display: none;
  }

  .page-title {
    font-size: 14px;
  }
}
</style>