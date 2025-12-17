<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <!-- Question Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
          Câu {{ questionNumber }} / {{ totalQuestions }}
        </span>
        <span class="text-sm text-gray-500">Short Answer</span>
      </div>
      
      <h3 class="text-xl font-bold text-gray-800 mb-2">
        Đọc đoạn văn và trả lời câu hỏi
      </h3>
    </div>

    <!-- Reading Passage -->
    <div v-if="passage" class="mb-6">
      <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
        <div class="flex items-center gap-2 mb-3">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h4 class="text-lg font-bold text-blue-900">
            {{ passage.title }}
          </h4>
        </div>
        <div class="prose prose-sm max-w-none">
          <p class="text-gray-800 leading-relaxed whitespace-pre-line">
            {{ passage.content }}
          </p>
        </div>
      </div>
    </div>

    <!-- Loading Passage -->
    <div v-else class="mb-6 p-6 bg-gray-50 rounded-lg">
      <div class="flex items-center gap-3">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        <p class="text-gray-600">Đang tải bài đọc...</p>
      </div>
    </div>

    <!-- Question -->
    <div class="mb-6 p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-2 border-purple-200">
      <div class="flex items-start gap-3">
        <svg class="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="flex-1">
          <p class="text-sm font-semibold text-purple-700 mb-1">Câu hỏi:</p>
          <p class="text-lg font-medium text-gray-800">
            {{ questionText }}
          </p>
        </div>
      </div>
    </div>

    <!-- Answer Input -->
    <div class="mb-6">
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        Câu trả lời của bạn:
      </label>
      <textarea
        v-model="answer"
        rows="4"
        placeholder="Nhập câu trả lời ngắn gọn..."
        class="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all resize-none text-lg"
        :class="[
          answer.trim()
            ? 'border-purple-300 bg-purple-50'
            : 'border-gray-300 bg-white'
        ]"
        @input="handleInput"
      ></textarea>
      <div class="flex justify-between items-center mt-2">
        <p class="text-xs text-gray-500">
          💡 Tip: Trả lời ngắn gọn, súc tích dựa trên thông tin trong đoạn văn
        </p>
        <p class="text-xs text-gray-400">
          {{ answer.length }} ký tự
        </p>
      </div>
    </div>

    <!-- Preview Answer -->
    <div v-if="answer.trim()" class="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-4">
      <div class="flex items-start gap-3">
        <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-sm text-gray-600 font-medium mb-2">Câu trả lời của bạn:</p>
          <p class="text-base text-purple-900 leading-relaxed bg-white p-3 rounded border border-purple-200">
            {{ answer }}
          </p>
        </div>
      </div>
    </div>

    <!-- Action Button -->
    <button
      v-if="answer.trim()"
      class="w-full py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold flex items-center justify-center gap-2"
      @click="clearText"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      Xóa câu trả lời
    </button>

    <!-- Helper Text -->
    <div v-if="!answer.trim()" class="mt-6 flex items-start gap-2 text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
      <svg class="w-5 h-5 mt-0.5 flex-shrink-0 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <p class="font-medium mb-1">Hướng dẫn trả lời:</p>
        <ul class="list-disc list-inside space-y-1 text-gray-600">
          <li>Đọc kỹ đoạn văn và tìm thông tin liên quan</li>
          <li>Trả lời ngắn gọn, đúng trọng tâm</li>
          <li>Sử dụng từ ngữ từ đoạn văn nếu phù hợp</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReadQA',
  
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
    passage: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      answer: this.userAnswer || '',
    };
  },

  computed: {
    questionText() {
      return this.question?.question?.question || '';
    },
  },

  watch: {
    userAnswer(newVal) {
      this.answer = newVal || '';
    },
    
    question() {
      this.answer = this.userAnswer || '';
    },
  },

  methods: {
    handleInput() {
      const trimmed = this.answer.trim();
      this.$emit('answer', trimmed || null);
    },

    clearText() {
      this.answer = '';
      this.$emit('answer', null);
    },
  },
};
</script>

<style scoped>
textarea:focus {
  box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
}

button:active {
  transform: scale(0.98);
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.prose {
  line-height: 1.75;
}
</style>