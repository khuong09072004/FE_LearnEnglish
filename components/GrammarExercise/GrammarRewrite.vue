<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <!-- Question Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Câu {{ questionNumber }} / {{ totalQuestions }}
        </span>
        <span class="text-sm text-gray-500">Rewrite Sentence</span>
      </div>
      
      <h3 class="text-xl font-semibold text-gray-700 mb-2">
        Viết lại câu cho đúng ngữ pháp
      </h3>
    </div>

    <!-- Instruction -->
    <div class="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 mb-6 border-l-4 border-blue-500">
      <p class="text-sm text-gray-700">
        <span class="font-semibold">💡 {{ question.question.instruction }}</span>
      </p>
    </div>

    <!-- Original Sentence Display -->
    <div class="mb-6">
      <p class="text-sm font-semibold text-gray-600 mb-2">Câu gốc (có lỗi):</p>
      <div class="bg-red-50 border-2 border-red-200 rounded-lg p-4">
        <div class="flex items-center gap-3">
          <div class="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p class="text-lg  text-red-800 font-medium leading-relaxed">
            {{ question.question.original }}
          </p>
        </div>
      </div>
    </div>

    <!-- Rewrite Input -->
    <div class="mb-6">
      <p class="text-sm font-semibold text-gray-600 mb-2">Câu của bạn (đã sửa):</p>
      <div class="relative">
        <textarea
          v-model="rewrittenSentence"
          class="w-full p-4 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all resize-none"
          :class="[
            rewrittenSentence.trim()
              ? 'border-orange-300 bg-orange-50'
              : 'border-gray-300 bg-white'
          ]"
          rows="3"
          placeholder="Nhập câu đã sửa lỗi ngữ pháp..."
          @input="handleInput"
        ></textarea>
        
        <!-- Character Counter -->
        <div class="absolute bottom-2 right-2 text-xs text-gray-400">
          {{ rewrittenSentence.length }} ký tự
        </div>
      </div>
    </div>

    <!-- Preview Answer -->
    <div v-if="rewrittenSentence.trim()" class="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4">
      <div class="flex items-center gap-3">
        <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-sm text-gray-600 font-medium mb-1">Câu bạn đã viết:</p>
          <p class="text-lg text-green-900 font-medium leading-relaxed">
            {{ rewrittenSentence }}
          </p>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-3">
      <button
        class="flex-1 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
        :disabled="!rewrittenSentence.trim()"
        :class="!rewrittenSentence.trim() ? 'opacity-50 cursor-not-allowed' : ''"
        @click="clearText"
      >
        🗑️ Xóa
      </button>
    </div>

    <!-- Helper Text -->
    <div v-if="!rewrittenSentence.trim()" class="mt-6 flex items-start gap-2 text-sm text-gray-500">
      <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>Viết lại câu với ngữ pháp chính xác vào ô phía trên</p>
    </div>

    <!-- Tips -->
    <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p class="text-sm text-blue-800">
        <span class="font-semibold">📝 Lưu ý:</span> Hãy viết câu hoàn chỉnh với đúng ngữ pháp, dấu câu và viết hoa chữ cái đầu câu nếu cần.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GrammarRewrite',
  
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
      default: '',
    },
  },

  data() {
    return {
      rewrittenSentence: this.userAnswer || '',
    };
  },

  watch: {
    userAnswer(newVal) {
      this.rewrittenSentence = newVal || '';
    },
    
    question() {
      this.rewrittenSentence = this.userAnswer || '';
    },
  },

  methods: {
    handleInput() {
      const trimmed = this.rewrittenSentence.trim();
      this.$emit('answer', trimmed || null);
    },

    clearText() {
      this.rewrittenSentence = '';
      this.$emit('answer', null);
    },
  },
};
</script>

<style scoped>
textarea:focus {
  box-shadow: 0 0 0 3px rgba(251, 146, 60, 0.1);
}

button:active {
  transform: scale(0.98);
}
</style>