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
      
      <h3 class="text-lg font-semibold text-gray-700 mb-2">
        Chọn đáp án đúng để hoàn thành câu
      </h3>
    </div>

    <!-- Question Text -->
    <div class="bg-gray-50 rounded-lg p-2 mb-6">
      <p class="text-lg text-blue-800 leading-relaxed">
        {{ question.question.question }}
      </p>
    </div>

    <!-- Options -->
    <div class="space-y-3">
      <button
        v-for="(option, index) in question.question.options"
        :key="index"
        class="w-full text-left p-4 rounded-lg border-2 transition-all duration-200 font-medium"
        :class="[
          selectedAnswer === option
            ? 'bg-blue-500 text-white border-blue-600 shadow-lg scale-105'
              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        ]"
        @click="selectOption(option)"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
            :class="[
              selectedAnswer === option
                ? 'border-blue-500 bg-blue-500'
                : 'border-gray-300'
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
          <span class="text-lg">{{ option }}</span>
        </div>
      </button>
    </div>

    <!-- Helper Text -->
    <div v-if="!selectedAnswer" class="mt-6 flex items-start gap-2 text-sm text-gray-500">
      <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>Chọn một đáp án để điền vào chỗ trống trong câu</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GrammarMCQ',
  
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
      selectedAnswer: this.userAnswer,
    };
  },

  watch: {
    userAnswer(newVal) {
      this.selectedAnswer = newVal;
    },
    
    question() {
      // Reset when question changes
      this.selectedAnswer = this.userAnswer;
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
</style>