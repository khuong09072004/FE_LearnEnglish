<template>
  <div class="min-h-screen flex items-center justify-center bg-blue-100">
    <div class="relative bg-white rounded-2xl shadow-2xl w-2/5 border border-blue-200">

      <!-- Nút Quay lại -->
      <button
        @click="goBack"
        class="absolute ml-4 mt-6 flex items-center text-blue-600 hover:text-blue-800 transition border-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15 19l-7-7 7-7" />
        </svg>
        <span class="font-medium">Quay lại</span>
      </button>

      <div class="p-10">
        <h2 class="text-3xl font-bold text-center text-blue-700 mb-8">
          Quên mật khẩu
        </h2>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-gray-700 mb-2 font-medium">Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="Nhập email để nhận mã OTP"
              required
              class="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg transition disabled:opacity-60"
          >
            {{ loading ? "Đang gửi OTP..." : "Gửi mã OTP" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { forgotPassword } from "../../apis/auth";

export default {
  data() {
    return {
      email: "",
      loading: false,
    };
  },
  methods: {
    async handleSubmit() {
      this.loading = true;

      try {
        await forgotPassword({ email: this.email });

        this.$message.success("Mã OTP đã được gửi đến email của bạn.");

        setTimeout(() => {
          this.$router.push(`/forgotpassword/verifyotp?email=${this.email}`);
        }, 800);
      } catch (err) {
        const msg = err?.response?.data?.message || "Không thể gửi OTP.";
        this.$message.error(msg);
      } finally {
        this.loading = false;
      }
    },

    goBack() {
      if (window.history.length > 1) this.$router.back();
      else this.$router.push("/login");
    },
  },
};
</script>
