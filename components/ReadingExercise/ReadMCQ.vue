<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <!-- Question Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Câu {{ questionNumber }} / {{ totalQuestions }}
        </span>
        <span class="text-sm text-gray-500">Multiple Choice</span>
      </div>
      
      <h3 class="text-xl font-semibold text-gray-700 mb-2">
        Đọc đoạn văn và chọn đáp án đúng
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
    <div class="mb-6 p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200">
      <p class="text-sm font-semibold text-gray-500 mb-2">Câu hỏi:</p>
      <p class="text-lg font-medium text-gray-800">
        {{ questionText }}
      </p>
    </div>

    <!-- Options -->
    <div class="space-y-3 mb-6">
      <button
        v-for="(option, index) in options"
        :key="index"
        class="w-full text-left p-4 rounded-lg border-2 transition-all duration-200 group"
        :class="[
          selectedAnswer === option
            ? 'border-blue-500 bg-blue-50 shadow-md'
            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 hover:shadow-sm'
        ]"
        @click="selectOption(option)"
      >
        <div class="flex items-start gap-4">
          <!-- Radio Button -->
          <div
            class="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
            :class="[
              selectedAnswer === option
                ? 'border-blue-500 bg-blue-500'
                : 'border-gray-300 group-hover:border-blue-400'
            ]"
          >
            <svg
              v-if="selectedAnswer === option"
              class="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </div>

          <!-- Option Text with Letter -->
          <div class="flex-1">
            <div class="flex items-start gap-3">
              <span class="text-sm font-bold text-gray-500 min-w-[24px]">
                {{ String.fromCharCode(65 + index) }}.
              </span>
              <p
                class="text-lg leading-relaxed flex-1"
                :class="[
                  selectedAnswer === option
                    ? 'text-blue-900 font-medium'
                    : 'text-gray-700'
                ]"
              >
                {{ option }}
              </p>
            </div>
          </div>
        </div>
      </button>
    </div>

    <!-- Selected Answer Display -->
    <div v-if="selectedAnswer" class="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
      <div class="flex items-start gap-3">
        <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-sm text-gray-600 mb-1">Đáp án của bạn:</p>
          <p class="text-lg font-bold text-blue-700">{{ selectedAnswer }}</p>
        </div>
      </div>
    </div>

    <!-- Helper Text -->
    <div v-if="!selectedAnswer" class="mt-6 flex items-start gap-2 text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
      <svg class="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>Đọc kỹ đoạn văn phía trên và chọn một đáp án từ các tùy chọn</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReadMCQ',
  
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
    passage: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      selectedAnswer: this.userAnswer || null,
    };
  },

  computed: {
    questionText() {
      return this.question?.question?.question || '';
    },

    options() {
      return this.question?.question?.options || [];
    },
  },

  watch: {
    userAnswer(newVal) {
      this.selectedAnswer = newVal || null;
    },
    
    question() {
      this.selectedAnswer = this.userAnswer || null;
    },
  },

  methods: {
    selectOption(option) {
      this.selectedAnswer = option;
      this.$emit('answer', option);
    },
  },
};
</script>

<style scoped>
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