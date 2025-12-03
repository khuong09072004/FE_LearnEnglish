<template>
  <div class="min-h-screen flex items-center justify-center bg-blue-100 px-4">
    <div
      class="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl border border-blue-200 p-8 sm:p-10"
    >
      <!-- Back -->
      <button
        @click="goBack"
        class="absolute top-6 left-4 flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition"
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
        <span class="font-medium text-sm sm:text-base">Quay lại</span>
      </button>

      <h2
        class="text-2xl sm:text-3xl font-bold text-center text-blue-700 mb-6 sm:mb-8"
      >
        Xác thực OTP
      </h2>

      <p class="text-center text-gray-600 mb-6 text-sm sm:text-base">
        Mã OTP đã gửi đến:
        <span class="font-semibold">{{ email }}</span>
      </p>

      <!-- OTP 6 ô -->
      <div class="flex justify-center space-x-3 sm:space-x-4 mb-6">
        <input
          v-for="(value, index) in otpInputs"
          :key="index"
          type="text"
          maxlength="1"
          ref="otpBox"
          v-model="otpInputs[index]"
          @input="onInput(index)"
          @keydown.backspace="onBackspace(index, $event)"
          class="w-10 h-12 sm:w-12 sm:h-14 text-center border border-gray-300 rounded-lg text-xl font-semibold focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      <!-- Nút xác nhận -->
      <button
        @click="handleVerify"
        :disabled="loading"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-lg transition disabled:opacity-60"
      >
        {{ loading ? "Đang xác thực..." : "Xác thực OTP" }}
      </button>

      <div
        v-if="errorMessage"
        class="text-red-500 text-center mt-4 text-sm sm:text-base"
      >
        {{ errorMessage }}
      </div>

      <!-- Gửi lại OTP -->
      <div class="mt-5 text-center text-sm sm:text-base">
        <button
          @click="handleResend"
          :disabled="resendCountdown > 0 || resendLoading"
          class="text-blue-600 hover:underline disabled:text-gray-400"
        >
          {{
            resendCountdown > 0
              ? `Gửi lại OTP sau ${resendCountdown}s`
              : "Gửi lại OTP"
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  forgotPasswordVerifyOtp,
  forgotPasswordResendOtp,
} from "../../apis/auth";

export default {
  data() {
    return {
      email: "",
      otpInputs: ["", "", "", "", "", ""], // 6 ô
      loading: false,
      errorMessage: "",
      resendCountdown: 60,
      resendLoading: false,
      timer: null,
    };
  },

  mounted() {
    this.email = this.$route.query.email || "";
    this.startCountdown();

    // focus ô đầu tiên
    this.$nextTick(() => {
      this.$refs.otpBox[0].focus();
    });
  },

  beforeDestroy() {
    clearInterval(this.timer);
  },

  methods: {
    /** Khi nhập 1 số → tự nhảy sang ô tiếp theo */
    onInput(index) {
      let val = this.otpInputs[index].replace(/\D/g, ""); // chỉ số

      this.$set(this.otpInputs, index, val);

      if (val && index < 5) {
        this.$refs.otpBox[index + 1].focus();
      }
    },

    /** Khi backspace → nếu ô trống thì lùi lại */
    onBackspace(index, evt) {
      if (evt.key === "Backspace" && !this.otpInputs[index] && index > 0) {
        this.$refs.otpBox[index - 1].focus();
      }
    },

    /** Gọi API xác thực OTP */
    async handleVerify() {
      const otp = this.otpInputs.join("");

      if (otp.length !== 6) {
        this.$message.error("Vui lòng nhập đủ 6 số OTP.");
        return;
      }

      this.loading = true;
      this.errorMessage = "";

      try {
        await forgotPasswordVerifyOtp({
          email: this.email,
          otp: otp,
        });

        this.$message.success("OTP chính xác! Vui lòng đặt lại mật khẩu.");

        this.$router.push(
          `/forgotPassword/resetPassword?email=${this.email}&otp=${otp}`
        );
      } catch (err) {
        const msg = err?.response?.data?.message || "OTP không hợp lệ.";
        this.$message.error(msg);
      } finally {
        this.loading = false;
      }
    },

    /** Gửi lại OTP */
    async handleResend() {
      this.resendLoading = true;

      try {
        await forgotPasswordResendOtp({ email: this.email });

        this.$message.success("OTP mới đã được gửi!");

        this.resendCountdown = 60;
        this.startCountdown();
      } catch (err) {
        const msg = err?.response?.data?.message || "Không thể gửi lại OTP.";
        this.$message.error(msg);
      } finally {
        this.resendLoading = false;
      }
    },

    /** Countdown gửi lại OTP */
    startCountdown() {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        if (this.resendCountdown > 0) this.resendCountdown--;
        else clearInterval(this.timer);
      }, 1000);
    },

    goBack() {
      this.$router.push("/forgotPassword");
    },
  },
};
</script>
