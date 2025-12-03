<template>
  <header class="app-header">
    <!-- Bên trái -->
    <div class="header-left">
      <!-- Nút thu/phóng menu -->
      <template v-if="isLoggedIn">
        <span class="trigger" @click="$emit('toggle')">
          <a-icon :type="collapsed ? 'menu-unfold' : 'menu-fold'" />
        </span>
      </template>

      <!-- Tiêu đề trang -->
      <div class="title-star">
        <a-icon type="star" theme="filled" style="font-size: 22px" />
        <div class="page-title">{{ pageTitleVi }}</div>
      </div>
    </div>

    <!-- Bên phải (sửa lại phần này) -->
    <div class="header-right">
      <template v-if="isLoggedIn">
        <a-popover trigger="click" placement="bottomRight">
          <template #content>
            <div class="p-3 w-56">
              <!-- Thông tin user -->
              <div class="flex flex-col items-center text-center">
                <a-avatar :src="userAvatar" size="large" />
                <div class="mt-2 font-semibold text-gray-800">{{ user?.name }}</div>
                <div class="text-gray-500 text-sm">{{ user?.email }}</div>
              </div>

              <a-divider class="my-2" />

              <!-- Các hành động -->
              <div class="flex flex-col space-y-1">
                <a-button type="link" block @click="goToProfile">
                  <a-icon type="user" /> Xem trang cá nhân
                </a-button>
                <a-button type="link" block @click="goToEditProfile">
                  <a-icon type="edit" /> Sửa thông tin
                </a-button>
                <a-divider class="my-2" />
                <a-button type="link" block danger @click="confirmLogout">
                  <a-icon type="logout" /> Đăng xuất
                </a-button>
              </div>
            </div>
          </template>

          <!-- Avatar nhỏ góc phải -->
          <a-avatar
            :src="userAvatar"
            size="large"
            class="cursor-pointer hover:opacity-80 transition"
          />
        </a-popover>
      </template>

      <template v-else>
        <nuxt-link to="/login" class="text-blue-600 font-medium hover:underline">
          Đăng nhập
        </nuxt-link>
      </template>
    </div>
  </header>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Header",
  props: {
    collapsed: { type: Boolean, default: false },
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
}

.trigger {
  display: flex;
  cursor: pointer;
  align-items: center;
  font-size: 20px;
}
.title-star {
  display: flex;
  align-items: center;
  gap: 8px;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-title {
  font-weight: 700;
  font-size: 16px;
}

a-button {
  text-align: left !important;
}
</style>
