<template>
  <div class="min-h-screen flex items-center justify-center bg-blue-100 px-4">
    <div
      class="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl border border-blue-200 p-8 sm:p-10"
    >
      <!-- Nút Quay lại -->
      <button
        @click="goBack"
        class="absolute top-6 left-2 flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition"
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
        Mã OTP đã gửi đến email:
        <span class="font-semibold break-words">{{ email }}</span>
      </p>

      <!-- OTP 6 ô -->
      <form @submit.prevent="handleVerifyOtp">
        <div class="flex justify-center space-x-3 sm:space-x-4 mb-6">
          <input
            v-for="(value, index) in otpInputs"
            :key="index"
            type="text"
            maxlength="1"
            ref="otpBox"
            v-model="otpInputs[index]"
            @input="onInput(index)"
            @keyup="onKeyUp(index, $event)"
            @compositionstart="isComposing = true"
            @compositionend="onCompositionEnd(index)"
            @keydown.backspace="onBackspace(index, $event)"
            class="w-10 h-12 sm:w-12 sm:h-14 text-center border border-gray-300 rounded-lg text-xl font-semibold focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <!-- Nút xác nhận -->
        <button
          @click="handleVerifyOtp"
          :disabled="loading"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-lg transition disabled:opacity-60"
        >
          {{ loading ? "Đang xác thực..." : "Xác thực OTP" }}
        </button>
      </form>

      <!-- Gửi lại OTP -->
      <div class="mt-5 text-center text-sm sm:text-base">
        <button
          @click="handleResendOtp"
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
import { verifyOtp, resendOtp } from "../../apis/auth";

export default {
  data() {
    return {
      email: "",
      otpInputs: ["", "", "", "", "", ""], // 6 ô
      loading: false,
      resendCountdown: 60,
      isComposing: false,
      resendLoading: false,
      resendInterval: null,
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
    clearInterval(this.resendInterval);
  },
  methods: {
    onCompositionEnd(index) {
      this.isComposing = false;
      this.onInput(index); // gọi lại khi compose xong
    },

    onKeyUp(index, e) {
      if (!this.isComposing) this.onInput(index);
    },

    onInput(index) {
      let val = this.otpInputs[index].replace(/\D/g, "");
      this.$set(this.otpInputs, index, val);

      if (val && index < 5) {
        this.$refs.otpBox[index + 1].focus();
      }
    },
    onBackspace(index, evt) {
      if (evt.key === "Backspace" && !this.otpInputs[index] && index > 0) {
        this.$refs.otpBox[index - 1].focus();
      }
    },
    async handleVerifyOtp() {
      const otp = this.otpInputs.join("");
      if (otp.length !== 6) {
        this.$message.error("Vui lòng nhập đủ 6 số OTP.");
        return;
      }

      this.loading = true;
      try {
        await verifyOtp({ email: this.email, otp });
        this.$message.success("Xác thực OTP thành công! ");
        this.$router.push(`/login`);
      } catch (err) {
        const msg = err?.response?.data?.message || "Xác thực OTP thất bại.";
        this.$message.error(msg);
      } finally {
        this.loading = false;
      }
    },
    async handleResendOtp() {
      this.resendLoading = true;
      try {
        await resendOtp({ email: this.email });
        this.$message.success("OTP mới đã được gửi về email!");
        this.resendCountdown = 60;
        this.startCountdown();
      } catch (err) {
        const msg = err?.response?.data?.message || "Gửi lại OTP thất bại.";
        this.$message.error(msg);
      } finally {
        this.resendLoading = false;
      }
    },
    startCountdown() {
      clearInterval(this.resendInterval);
      this.resendInterval = setInterval(() => {
        if (this.resendCountdown > 0) this.resendCountdown--;
        else clearInterval(this.resendInterval);
      }, 1000);
    },
    goBack() {
      window.history.back();
    },
  },
};
</script>
