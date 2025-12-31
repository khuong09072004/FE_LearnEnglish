<template>
  <div v-if="isLoggedIn" class="app-container">
    <a-layout class="main-layout">
      <!-- Sidebar với responsive -->
      <Sider 
        :collapsed="collapsed" 
        :selectedKeys="selectedKeys"
        :class="{'mobile-sidebar': isMobile, 'show': showMobileSidebar}"
        @close="showMobileSidebar = false"
      />
      
      <!-- Overlay cho mobile sidebar -->
      <div 
        v-if="isMobile && showMobileSidebar" 
        class="sidebar-overlay"
        @click="showMobileSidebar = false"
      ></div>

      <!-- Main Content -->
      <a-layout class="content-layout">
        <div class="header-wrapper">
          <Header 
            :collapsed="collapsed" 
            :isMobile="isMobile"
            @toggle="handleToggle"
            @menuToggle="showMobileSidebar = !showMobileSidebar" 
          />
        </div>
        <div class="content-wrapper">
          <a-layout-content class="main-content">
            <nuxt />
          </a-layout-content>
        </div>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import Header from "../components/common/Header.vue";
import Sider from "../components/common/Slider.vue";

export default {
  components: { Header, Sider },
  data() {
    return {
      collapsed: false,
      selectedKeys: ["1"],
      isMobile: false,
      showMobileSidebar: false,
      windowWidth: 0,
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.auth.token !== null;
    }
  },
  mounted() {
    this.checkDevice();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
      this.checkDevice();
    },
    checkDevice() {
      this.windowWidth = window.innerWidth;
      this.isMobile = this.windowWidth < 768;
      
      // Tự động collapse sidebar trên tablet
      if (this.windowWidth < 1024 && this.windowWidth >= 768) {
        this.collapsed = true;
      }
      
      // Đóng mobile sidebar khi resize về desktop
      if (!this.isMobile) {
        this.showMobileSidebar = false;
      }
    },
    handleToggle() {
      if (!this.isMobile) {
        this.collapsed = !this.collapsed;
      }
    }
  }
};
</script>

<style scoped>
.app-container {
  padding: 20px;
  background: #F0F5F9;
  min-height: 100vh;
}

.main-layout {
  min-height: 100vh;
  position: relative;
}

.content-layout {
  transition: margin-left 0.2s;
}

.header-wrapper {
  padding-left: 20px;
}

.content-wrapper {
  padding-left: 20px;
}

.main-content {
  margin: 14px 0px 0 0px;
  padding: 24px;
  background: #fff;
  min-height: 680px;
  border-radius: 18px;
}

/* Sidebar Overlay cho mobile */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Mobile Sidebar */
.mobile-sidebar {
  position: fixed !important;
  left: -280px;
  top: 0;
  bottom: 0;
  z-index: 999;
  transition: left 0.3s ease;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
}

.mobile-sidebar.show {
  left: 0;
}

/* Tablet: 768px - 1023px */
@media (max-width: 1023px) and (min-width: 768px) {
  .app-container {
    padding: 15px;
  }
  
  .header-wrapper,
  .content-wrapper {
    padding-left: 15px;
  }
  
  .main-content {
    padding: 20px;
    border-radius: 16px;
  }
}

/* Mobile: < 768px */
@media (max-width: 767px) {
  .app-container {
    padding: 10px;
  }
  
  .header-wrapper {
    padding-left: 0;
  }
  
  .content-wrapper {
    padding-left: 0;
    padding-right: 0;
  }
  
  .main-content {
    margin: 10px 0 0 0;
    padding: 16px;
    border-radius: 12px;
    min-height: calc(100vh - 140px);
  }
}

/* Small Mobile: < 480px */
@media (max-width: 479px) {
  .app-container {
    padding: 8px;
  }
  
  .main-content {
    padding: 12px;
    border-radius: 10px;
  }
}
</style>