<template>
  <a-layout-sider
    :collapsed="collapsed"
    :trigger="null"
    collapsible
    :width="250"
    class="custom-sider"
  >
    <div class="logo" :class="{ collapsed }">
      <div class="brand">
        <img src="../../assets/logo.png" alt="" class="w-10 h-10" />
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
        <nuxt-link to="/home">
          <a-icon type="home" />
          <span>Trang Chủ</span>
        </nuxt-link>
      </a-menu-item>
      <a-menu-item key="2">
        <nuxt-link to="/vocabulary">
          <a-icon type="home" />
          <span>Từ Vựng</span>
        </nuxt-link>
      </a-menu-item>

      <a-menu-item key="3">
        <nuxt-link to="/grammar">
          <a-icon type="file-search" />
          <span>Ngữ Pháp</span>
        </nuxt-link>
      </a-menu-item>

      <a-menu-item key="4">
        <nuxt-link to="/exercise">
          <a-icon type="book" />
          <span>Bài Tập</span>
        </nuxt-link>
      </a-menu-item>

      <a-menu-item key="5">
        <nuxt-link to="/files">
          <a-icon type="file" />
          <span>Tệp tin</span>
        </nuxt-link>
      </a-menu-item>

      <a-menu-item key="6">
        <nuxt-link to="/games">
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
.brand {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 2px;
  padding: 0 5px;
  font-weight: 700;
  font-size: 18px;
  color: #2553b9;
}
.brand-title {
  color: #2553b9;
}
</style>
