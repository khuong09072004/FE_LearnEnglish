<template>
  <div class="min-h-screen flex items-center justify-center bg-blue-100">
    <div
      class="relative bg-white rounded-2xl shadow-2xl w-2/5 border border-blue-200"
    >
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
          Đăng nhập tài khoản
        </h2>

        <form @submit.prevent="handleLogin" class="space-y-6">
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

          <div class="flex justify-between items-center text-sm text-gray-600">
            <label class="flex items-center space-x-2">
              <input type="checkbox" class="w-4 h-4 text-blue-500" />
              <span>Ghi nhớ</span>
            </label>
            <nuxt-link
              to="/forgotpassword"
              class="text-blue-600 hover:underline"
            >
              Quên mật khẩu?
            </nuxt-link>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg transition disabled:opacity-60"
          >
            {{ loading ? "Đang đăng nhập..." : "Đăng nhập" }}
          </button>

          <div v-if="errorMessage" class="text-red-500 text-center mt-4">
            {{ errorMessage }}
          </div>

          <!-- Divider -->
          <div class="flex items-center my-6">
            <hr class="flex-grow border-gray-300" />
            <span class="px-3 text-gray-500 text-sm">hoặc</span>
            <hr class="flex-grow border-gray-300" />
          </div>

          <!-- Nút Đăng nhập Google -->
          <div id="google-btn" class="w-full flex justify-center mt-4"></div>
        </form>

        <p class="text-center text-gray-600 mt-8">
          Chưa có tài khoản?
          <nuxt-link
            to="/register"
            class="text-blue-600 font-semibold hover:underline"
            >Đăng ký</nuxt-link
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { login, loginWithGoogle } from "../../apis/auth";

export default {
  data() {
    return {
      email: "",
      password: "",
      loading: false,
      errorMessage: "",
    };
  },
  mounted() {
    this.$googleAuth.initialize(this.handleGoogleResponse);
    this.$googleAuth.renderButton("google-btn");
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.errorMessage = "";
      try {
        const data = await login({
          email: this.email,
          password: this.password,
        });

        await this.$store.dispatch("auth/login", {
          token: data.data.token,
          name: data.data.name,
          email: data.data.email,
          avatar: data.data.avatar,
          has_selected_level: data.data.has_selected_level,
        });

        this.$message.success(
          `Đăng nhập thành công! Xin chào ${data.data?.name || ""}`
        );

        this.$router.push("/home");
      } catch (err) {
        console.error("Login error:", err);

        const msg =
          err?.response?.data?.message ||
          "Sai email hoặc mật khẩu. Vui lòng thử lại.";

        this.errorMessage = msg;

        this.$message.error(msg);
      } finally {
        this.loading = false;
      }
    },

    goBack() {
      if (window.history.length > 1) {
        this.$router.back();
      } else {
        this.$router.push("/");
      }
    },

    async handleGoogleResponse(response) {
      const id_token = response.credential;
      console.log("Google ID Token:", id_token);

      try {
        const data = await loginWithGoogle({ id_token });
        await this.$store.dispatch("auth/login", {
          token: data.token,
          name: data.name,
          email: data.email,
          avatar: data.avatar,
          has_selected_level: data.has_selected_level,
        });

        this.$message.success(
          `Đăng nhập Google thành công! Xin chào ${data.user?.name || ""}`
        );

        this.$router.push("/home");
      } catch (err) {
        console.error("Google login failed:", err);
        this.errorMessage = "Đăng nhập Google thất bại. Vui lòng thử lại.";

        this.$message.error(this.errorMessage);
      }
    },
  },
};
</script>



