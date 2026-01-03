<template>
  <a-layout-sider
    :collapsed="collapsed"
    :trigger="null"
    collapsible
    :width="250"
    :class="['custom-sider', { 'mobile-sider': isMobile, 'show': showMobile }]"
  >
    <!-- Nút đóng cho mobile -->
    <div v-if="isMobile" class="mobile-close" @click="$emit('close')">
      <a-icon type="close" />
    </div>

    <div class="logo" :class="{ collapsed }">
      <div class="brand">
        <img src="../../assets/logo.png" alt="Logo" class="logo-image" />
        <span v-if="!collapsed" class="brand-title">LEARN ENGLISH</span>
      </div>
    </div>

    <a-menu
      theme="light"
      mode="inline"
      :selectedKeys="localSelectedKeys"
      @select="onSelect"
    >
      <a-menu-item key="1">
        <nuxt-link to="/home" @click.native="handleMobileClick">
          <a-icon type="home" />
          <span>Trang Chủ</span>
        </nuxt-link>
      </a-menu-item>
      
      <a-menu-item key="2">
        <nuxt-link to="/vocabulary" @click.native="handleMobileClick">
          <a-icon type="book" />
          <span>Từ Vựng</span>
        </nuxt-link>
      </a-menu-item>

      <a-menu-item key="3">
        <nuxt-link to="/grammar" @click.native="handleMobileClick">
          <a-icon type="file-search" />
          <span>Ngữ Pháp</span>
        </nuxt-link>
      </a-menu-item>

      <a-menu-item key="4">
        <nuxt-link to="/exercise" @click.native="handleMobileClick">
          <a-icon type="edit" />
          <span>Bài Tập</span>
        </nuxt-link>
      </a-menu-item>

      <a-menu-item key="5">
        <nuxt-link to="/conversation" @click.native="handleMobileClick">
          <a-icon type="message" />
          <span>Hội thoại</span>
        </nuxt-link>
      </a-menu-item>

      <a-menu-item key="6">
        <nuxt-link to="/chat" @click.native="handleMobileClick">
          <a-icon type="wechat" />
          <span>Chat</span>
        </nuxt-link>
      </a-menu-item>

      <a-menu-item key="7">
        <nuxt-link to="/games" @click.native="handleMobileClick">
          <a-icon type="robot" />
          <span>Trò chơi</span>
        </nuxt-link>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script>
export default {
  name: "Sider",
  props: {
    collapsed: { type: Boolean, required: true },
    selectedKeys: { type: Array, default: () => ["1"] },
    isMobile: { type: Boolean, default: false },
    showMobile: { type: Boolean, default: false },
  },
  data() {
    return {
      localSelectedKeys: this.selectedKeys,
      accountName: "Tài khoản",
      balance: 0,
      isReloading: false,
    };
  },
  watch: {
    selectedKeys(newVal) {
      this.localSelectedKeys = newVal;
    },
  },
  methods: {
    reloadBalance() {
      if (this.isReloading) return;
      this.isReloading = true;
      // TODO: Thêm logic tải lại số dư nếu cần
    },
    onSelect({ key }) {
      this.localSelectedKeys = [key];
      this.$emit("update:selectedKeys", [key]);
      // Emit itemClick để parent biết đã click vào menu
      this.$emit("itemClick");
    },
    handleMobileClick() {
      // Đóng sidebar khi click vào menu item trên mobile
      if (this.isMobile) {
        this.$emit('close');
      }
    },
  },
  computed: {
    formattedBalance() {
      return this.balance.toLocaleString();
    },
  },
};
</script>

<style scoped>
.custom-sider {
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 2px 6px #2553b91a;
  position: relative;
  transition: all 0.3s;
}

.logo {
  height: 64px;
  margin: 16px 16px 0px 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  transition: all 0.3s ease;
}

.logo.collapsed {
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  padding: 0 5px;
  font-weight: 700;
  font-size: 18px;
  color: #2553b9;
}

.logo-image {
  width: 40px;
  height: 40px;
  object-fit: contain;
  flex-shrink: 0;
}

.brand-title {
  color: #2553b9;
  white-space: nowrap;
}

.balance {
  padding: 0px 20px 0px 20px;
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.balance.collapsed {
  display: none;
}

.reload-icon {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.spinning {
  animation: spin 1s linear;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(600deg);
  }
}

/* Nút đóng cho mobile */
.mobile-close {
  display: none;
}

/* Mobile Styles */
.mobile-sider {
  position: fixed !important;
  left: -280px;
  top: 0;
  bottom: 0;
  z-index: 999;
  height: 100vh !important;
  border-radius: 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  transition: left 0.3s ease;
}

.mobile-sider.show {
  left: 0;
}

.mobile-sider .mobile-close {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 20px;
  font-size: 20px;
  cursor: pointer;
  color: #2553b9;
  transition: color 0.3s;
}

.mobile-sider .mobile-close:hover {
  color: #1890ff;
}

/* Tablet: 768px - 1023px */
@media (max-width: 1023px) and (min-width: 768px) {
  .custom-sider {
    border-radius: 16px;
  }

  .brand {
    font-size: 16px;
  }
}

/* Mobile: < 768px */
@media (max-width: 767px) {
  .logo {
    height: 56px;
    margin: 8px 12px 0 12px;
  }

  .brand {
    font-size: 16px;
    gap: 6px;
  }

  .logo-image {
    width: 36px;
    height: 36px;
  }
}

/* Custom ant-design menu styles for mobile */
.mobile-sider .ant-menu {
  border-right: none;
}

.mobile-sider .ant-menu-item {
  margin: 4px 8px;
  border-radius: 8px;
}

.mobile-sider .ant-menu-item a {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>