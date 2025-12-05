<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <!-- Question Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
          Câu {{ questionNumber }} / {{ totalQuestions }}
        </span>
        <span class="text-sm text-gray-500">Choose Correct Sentence</span>
      </div>
      
      <h3 class="text-xl font-bold text-gray-800 mb-2">
        Chọn câu đúng ngữ pháp
      </h3>
    </div>

    <!-- Instruction -->
    <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6 border-l-4 border-green-500">
      <p class="text-sm text-gray-700">
        <span class="font-semibold">💡 Gợi ý:</span> Đọc kỹ từng câu và chọn câu có ngữ pháp chính xác nhất
      </p>
    </div>

    <!-- Sentences Options -->
    <div class="space-y-4">
      <button
        v-for="(sentence, index) in question.question.sentences"
        :key="index"
        class="w-full text-left p-5 rounded-lg border-2 transition-all duration-200 group"
        :class="[
          selectedAnswer === index
            ? 'border-green-500 bg-green-50 shadow-md'
            : 'border-gray-200 hover:border-green-300 hover:bg-gray-50 hover:shadow-sm'
        ]"
        @click="selectSentence(index)"
      >
        <div class="flex items-start gap-4">
          <!-- Radio Button -->
          <div
            class="w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
            :class="[
              selectedAnswer === index
                ? 'border-green-500 bg-green-500'
                : 'border-gray-300 group-hover:border-green-400'
            ]"
          >
            <svg
              v-if="selectedAnswer === index"
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

          <!-- Sentence Content -->
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span
                class="text-xs font-semibold px-2 py-0.5 rounded"
                :class="[
                  selectedAnswer === index
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                ]"
              >
                {{ String.fromCharCode(65 + index) }}
              </span>
            </div>
            <p
              class="text-lg leading-relaxed"
              :class="[
                selectedAnswer === index
                  ? 'text-green-900 font-medium'
                  : 'text-gray-700'
              ]"
            >
              {{ sentence }}
            </p>
          </div>
        </div>
      </button>
    </div>

    <!-- Helper Text -->
    <div v-if="selectedAnswer === null" class="mt-6 flex items-start gap-2 text-sm text-gray-500">
      <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>Chọn câu có ngữ pháp chính xác</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GrammarSentenceChoice',
  
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
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      selectedAnswer: this.userAnswer,
    };
  },

  watch: {
    userAnswer(newVal) {
      this.selectedAnswer = newVal;
    },
    
    question() {
      this.selectedAnswer = this.userAnswer;
    },
  },

  methods: {
    selectSentence(index) {
      this.selectedAnswer = index;
      this.$emit('answer', index);
    },
  },
};
</script>

<style scoped>
button:active {
  transform: scale(0.99);
}
</style>