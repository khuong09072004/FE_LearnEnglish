<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <!-- Question Header -->
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-800 mb-2">
        Câu {{ questionNumber }}/{{ totalQuestions }}
      </h2>
      <p class="text-gray-600 mb-4">Sửa lỗi ngữ pháp trong câu sau:</p>
    </div>

    <!-- Sentence Display -->
    <div class="mb-6 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
      <p class="text-sm text-yellow-600 font-semibold mb-3">Câu có lỗi:</p>
      <p class="text-lg text-gray-800 leading-relaxed">
        {{ question.question.sentence }}
      </p>
    </div>

    <!-- Text Input -->
    <div class="mb-6">
      <label class="block text-sm font-semibold text-gray-700 mb-3">
        Viết lại câu đúng:
      </label>
      <textarea
        v-model="userInput"
        class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
        rows="3"
        placeholder="Nhập câu đã sửa lại đây..."
      ></textarea>
    </div>

    <!-- Character Count -->
    <div class="mb-6 text-right">
      <p class="text-sm text-gray-500">
        Ký tự: <span class="font-semibold">{{ userInput.length }}</span>
      </p>
    </div>

    <!-- Submit Buttons -->
    <div class="flex gap-3">
      <button
        type="button"
        class="flex-1 px-4 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
        @click="resetAnswer"
      >
        Làm lại
      </button>
      <button
        type="button"
        class="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold disabled:opacity-50"
        :disabled="!userInput.trim()"
        @click="submitAnswer"
      >
        Xác nhận
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "WriteFix",
  props: {
    question: {
      type: Object,
      required: true,
    },
    questionNumber: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    userAnswer: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      userInput: "",
    };
  },

  mounted() {
    if (this.userAnswer) {
      this.userInput = this.userAnswer;
    }
    
  },

  watch: {
    userAnswer(newVal) {
      if (newVal) {
        this.userInput = newVal;
      } else {
        this.userInput = "";
      }
    },
  },

  methods: {
    resetAnswer() {
      this.userInput = "";
    },

    submitAnswer() {
      this.$emit("answer", this.userInput.trim());
    },
  },
};
</script>