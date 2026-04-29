<template>
  <a-layout-sider
    :collapsed="collapsed"
    :trigger="null"
    collapsible
    :width="260"
    :collapsedWidth="72"
    :class="['custom-sider', { 'mobile-sider': isMobile, show: showMobile }]"
  >
    <!-- Nút đóng cho mobile -->
    <div v-if="isMobile" class="mobile-close" @click="$emit('close')">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M14 4L4 14M4 4l10 10"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    </div>

    
    <div class="logo-area" :class="{ collapsed }">
      <div class="logo-container">
        <div class="logo-icon">
          <img src="../../assets/logo.png" alt="Logo" class="logo-image" />
        </div>
        <transition name="fade">
          <div v-if="!collapsed" class="logo-text ">LEARN ENGLISH</div>
        </transition>
      </div>
    </div>

    <!-- Footer user -->
      <div v-if="!collapsed" class="section-label">Chức năng</div>

    <!-- Menu -->
    <nav class="nav-menu">
      <nuxt-link
        v-for="item in menuItems"
        :key="item.key"
        :to="item.path"
        class="nav-item"
        :class="{ active: localSelectedKeys.includes(item.key) }"
        @click.native="handleClick(item.key)"
      >
        <div class="nav-icon-wrap">
          <svg
            v-html="item.icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="nav-svg"
          ></svg>
        </div>
        <transition name="fade">
          <span v-if="!collapsed" class="nav-label">{{ item.label }}</span>
        </transition>
        <transition name="fade">
          <div
            v-if="!collapsed && localSelectedKeys.includes(item.key)"
            class="active-dot"
          ></div>
        </transition>
      </nuxt-link>
    </nav>


    <!-- Footer user -->
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
      menuItems: [
        {
          key: "1",
          path: "/home",
          label: "Trang Chủ",
          icon: `<path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 21V12h6v9" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>`,
        },
        {
          key: "2",
          path: "/vocabulary",
          label: "Từ Vựng",
          icon: `<path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 7h6M9 11h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`,
        },
        {
          key: "3",
          path: "/grammar",
          label: "Ngữ Pháp",
          icon: `<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M14 2v6h6M9 13h6M9 17h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`,
        },
        {
          key: "4",
          path: "/exercise",
          label: "Bài Tập",
          icon: `<path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
        },
        {
          key: "5",
          path: "/conversation",
          label: "Hội Thoại",
          icon: `<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>`,
        },
        {
          key: "6",
          path: "/chat",
          label: "Chat",
          icon: `<path d="M8 12h.01M12 12h.01M16 12h.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M20 12c0 4.418-3.582 8-8 8a8.96 8.96 0 01-4-.94L3 21l1.06-4.5A8 8 0 1120 12z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>`,
        },
      ],
    };
  },
  computed: {
    initials() {
      return this.accountName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    },
  },
  watch: {
    selectedKeys(newVal) {
      this.localSelectedKeys = newVal;
    },
  },
  methods: {
    handleClick(key) {
      this.localSelectedKeys = [key];
      this.$emit("update:selectedKeys", [key]);
      this.$emit("itemClick");
      if (this.isMobile) this.$emit("close");
    },
  },
};
</script>

<style scoped>
/* ===== Base ===== */
.custom-sider {
  background: #5fc9f3 !important;
  border-radius: 20px !important;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(10, 126, 164, 0.12);
}

/* Ghi đè ant-design layout sider */
:deep(.ant-layout-sider-children) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* ===== Logo ===== */
.logo-area {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 22px 10px 16px;
  overflow: hidden;
  flex-shrink: 0;
}
.logo-container{
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 12px;
  background: #fff;
  border-radius: 12px;
}
.logo-area.collapsed {
  justify-content: center;
  padding: 22px 0 16px;
}
.logo-icon {
  width: 50px;
  height: 50px;
  min-width: 50px;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
}
.logo-text {
  display: flex;
  font-weight: 700;
  font-size: 20px;
  color: #0a7ea4;
}
.brand-main {
  font-size: 15px;
  font-weight: 700;
  color: #0a3d52;
  letter-spacing: -0.3px;
}
.brand-accent {
  font-size: 11px;
  font-weight: 500;
  color: #0a7ea4;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}

/* ===== Section label ===== */
.section-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.4px;
  color: rgba(10, 61, 82, 0.45);
  padding: 0 20px 6px;
  flex-shrink: 0;
}

/* ===== Nav ===== */
.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 10px;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}
.nav-menu::-webkit-scrollbar {
  display: none;
}
.nav-menu {
  scrollbar-width: none;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 8px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.18s ease;
  text-decoration: none !important;
  position: relative;
  overflow: hidden;
  color: #0a3d52;
}
.nav-item:hover {
  background: rgba(255, 255, 255, 0.4);
  color: #0a3d52;
}
.nav-item.active {
  background: #fff;
  box-shadow: 0 2px 12px rgba(10, 61, 82, 0.1);
  color: #0a7ea4;
}

.nav-icon-wrap {
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.38);
  transition: background 0.18s;
}
.nav-item.active .nav-icon-wrap {
  background: #e0f7fc;
}
.nav-svg {
  stroke: #fa0000;
  transition: stroke 0.18s;
}
.nav-item.active .nav-svg {
  stroke: #f8fdff;
}

.nav-label {
  font-size: 16px;
  font-weight: 600;
  color: #F8FAFC;
  white-space: nowrap;
  flex: 1;
  transition: color 0.18s;
}
.nav-item.active .nav-label {
  font-weight: 500;
  color: #0a7ea4;
}

.active-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #0a7ea4;
  margin-left: auto;
  flex-shrink: 0;
}

/* ===== Footer ===== */
.sider-footer {
  padding: 12px 10px 16px;
  flex-shrink: 0;
}
.sider-footer.collapsed {
  padding: 12px 0 16px;
  display: flex;
  justify-content: center;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.38);
  border-radius: 14px;
  padding: 10px 12px;
  cursor: pointer;
  transition: background 0.18s;
  overflow: hidden;
}
.user-card:hover {
  background: rgba(255, 255, 255, 0.55);
}
.user-card.collapsed {
  padding: 0;
  background: transparent;
}
.user-card.collapsed:hover {
  background: transparent;
}

.user-avatar {
  width: 34px;
  height: 34px;
  min-width: 34px;
  border-radius: 50%;
  background: #0a7ea4;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(10, 126, 164, 0.25);
}
.user-info {
  overflow: hidden;
}
.user-name {
  font-size: 13px;
  font-weight: 500;
  color: #0a3d52;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-role {
  font-size: 11px;
  color: #4a7f93;
  white-space: nowrap;
}

/* ===== Transitions ===== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-6px);
}

/* ===== Nút đóng mobile ===== */
.mobile-close {
  display: none;
}

/* ===== Mobile Sider ===== */
.mobile-sider {
  position: fixed !important;
  left: -280px;
  top: 0;
  bottom: 0;
  z-index: 999;
  height: 100vh !important;
  border-radius: 0 20px 20px 0 !important;
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.mobile-sider.show {
  left: 0;
}
.mobile-sider .mobile-close {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 14px 18px 4px;
  color: #0a3d52;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}
.mobile-sider .mobile-close:hover {
  opacity: 1;
}

/* ===== Tablet ===== */
@media (max-width: 1023px) and (min-width: 768px) {
  .custom-sider {
    border-radius: 16px !important;
  }
}

/* ===== Mobile ===== */
@media (max-width: 767px) {
  .logo-area {
    margin: 0;
    padding: 16px 16px 12px;
  }
  .logo-icon {
    width: 36px;
    height: 36px;
    min-width: 36px;
  }
}
</style>