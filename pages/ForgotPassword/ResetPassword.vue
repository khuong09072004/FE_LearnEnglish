<template>
  <div class="min-h-screen flex items-center justify-center bg-blue-100">
    <div
      class="relative bg-white rounded-2xl shadow-2xl w-2/5 border border-blue-200"
    >
      <button
        @click="goBack"
        class="absolute ml-4 mt-6 flex items-center text-blue-600 hover:text-blue-800"
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
          Đặt lại mật khẩu
        </h2>

        <form @submit.prevent="handleReset" class="space-y-6">
          <div>
            <label class="block text-gray-700 mb-2 font-medium"
              >Mật khẩu mới</label
            >
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
              class="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-gray-700 mb-2 font-medium"
              >Xác nhận mật khẩu</label
            >
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              class="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg transition disabled:opacity-60"
          >
            {{ loading ? "Đang đặt lại..." : "Đặt lại mật khẩu" }}
          </button>

         
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { forgotPasswordReset } from "../../apis/auth";

export default {
  data() {
    return {
      email: "",
      otp: "",
      password: "",
      confirmPassword: "",
      loading: false,
    };
  },

  mounted() {
    this.email = this.$route.query.email || "";
    this.otp = this.$route.query.otp || "";
  },

  methods: {
    async handleReset() {
      // Kiểm tra confirm password ở FE
      if (this.password !== this.confirmPassword) {
        this.$message.error("Mật khẩu xác nhận không khớp.");
        return;
      }

      this.loading = true;

      try {
        // Gửi lên BE chỉ có 3 field: email, otp, newPassword
        await forgotPasswordReset({
          email: this.email,
          otp: this.otp,
          newPassword: this.password,
        });
        this.$message.success("Đổi mật khẩu thành công!")

        setTimeout(() => {
          this.$router.push("/login");
        }, 900);
      } catch (err) {
        this.errorMessage =
          err?.response?.data?.message || "Không thể đặt lại mật khẩu.";
      } finally {
        this.loading = false;
      }
    },

    goBack() {
      this.$router.push(`/forgotPassword/verifyOtp?email=${this.email}`);
    },
  },
};
</script>

