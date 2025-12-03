<template>
  <div class="min-h-screen flex items-center justify-center bg-blue-100">
    <div class="relative bg-white rounded-2xl shadow-2xl w-2/5 border border-blue-200">
      <!-- Nút Quay lại -->
      <button
        @click="goBack"
        class="absolute ml-4 mt-6 flex items-center space-x-0 text-blue-600 hover:text-blue-800 transition border-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span class="font-medium">Quay lại</span>
      </button>

      <div class="p-10">
        <h2 class="text-3xl font-bold text-center text-blue-700 mb-8">
          Tạo tài khoản mới
        </h2>

        <form @submit.prevent="handleRegister" class="space-y-6">
          <div>
            <label class="block text-gray-700 mb-2 font-medium">Họ và tên</label>
            <input
              v-model="fullName"
              type="text"
              placeholder="Nhập họ và tên của bạn"
              required
              class="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-gray-700 mb-2 font-medium">Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="Nhập email của bạn"
              required
              class="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-gray-700 mb-2 font-medium">Mật khẩu</label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
              class="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-gray-700 mb-2 font-medium">Xác nhận mật khẩu</label>
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu"
              required
              class="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg transition disabled:opacity-60"
          >
            {{ loading ? 'Đang đăng ký...' : 'Đăng ký' }}
          </button>

          <div v-if="errorMessage" class="text-red-500 text-center mt-4">
            {{ errorMessage }}
          </div>
          
        </form>

        <p class="text-center text-gray-600 mt-8">
          Đã có tài khoản?
          <router-link to="/login" class="text-blue-600 font-semibold hover:underline">
            Đăng nhập
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { register } from "../../apis/auth";

export default {
  data() {
    return {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      loading: false,
      errorMessage: "",
    };
  },
  methods: {
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Mật khẩu xác nhận không khớp!";
        this.$message.warning("Mật khẩu xác nhận không khớp!");
        return;
      }

      this.loading = true;
      this.errorMessage = "";

      try {
        const data = await register({
          fullName: this.fullName,
          email: this.email,
          password: this.password,
        });
        this.$message.success("Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.");
        this.$router.push({ path: '/verifyotp', query: { email: this.email } });
      } catch (err) {
        console.error("Register error:", err);

        const msg =
          err?.response?.data?.message || "Không thể đăng ký. Vui lòng thử lại.";
        this.errorMessage = msg;
      } finally {
        this.loading = false;
      }
    },

    goBack() {
      window.history.back();
    },
  },
};
</script>



