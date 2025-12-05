<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <!-- Question Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">
          Câu {{ questionNumber }} / {{ totalQuestions }}
        </span>
        <span class="text-sm text-gray-500">Find Error</span>
      </div>
      
      <h3 class="text-xl font-bold text-gray-800 mb-2">
        Tìm từ sai trong câu
      </h3>
    </div>

    <!-- Instruction -->
    <div class="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 mb-6 border-l-4 border-red-500">
      <p class="text-sm text-gray-700">
        <span class="font-semibold">💡 Gợi ý:</span> Click vào từ hoặc cụm từ có lỗi ngữ pháp trong câu dưới đây
      </p>
    </div>

    <!-- Sentence with clickable words -->
    <div class="bg-gray-50 rounded-lg p-6 mb-6">
      <div class="flex flex-wrap gap-2 items-center justify-center text-lg leading-relaxed">
        <button
          v-for="(word, index) in words"
          :key="index"
          class="px-3 py-2 rounded-lg font-medium transition-all duration-200"
          :class="[
            selectedWord === word
              ? 'bg-red-500 text-white shadow-md scale-105'
              : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-red-300 hover:bg-red-50'
          ]"
          @click="selectWord(word)"
        >
          {{ word }}
        </button>
      </div>
    </div>

    <!-- Selected Answer Display -->
    <div v-if="selectedWord" class="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-600 font-medium">Từ bạn chọn:</p>
          <p class="text-lg font-bold text-red-700">{{ selectedWord }}</p>
        </div>
      </div>
    </div>

    <!-- Helper Text -->
    <div v-if="!selectedWord" class="mt-6 flex items-start gap-2 text-sm text-gray-500">
      <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>Click vào từ mà bạn cho là sai ngữ pháp</p>
    </div>

    <!-- Reset Button -->
    <button
      v-if="selectedWord"
      class="mt-4 w-full py-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
      @click="resetSelection"
    >
      🔄 Chọn lại
    </button>
  </div>
</template>

<script>
export default {
  name: 'GrammarFindError',
  
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
      selectedWord: this.userAnswer,
    };
  },

  computed: {
    words() {
      // Split sentence into words/tokens
      const sentence = this.question.question.sentence;
      // Split by space but keep punctuation with words
      return sentence.split(/\s+/).filter(word => word.length > 0);
    },
  },

  watch: {
    userAnswer(newVal) {
      this.selectedWord = newVal;
    },
    
    question() {
      this.selectedWord = this.userAnswer;
    },
  },

  methods: {
    selectWord(word) {
      this.selectedWord = word;
      this.$emit('answer', word);
    },

    resetSelection() {
      this.selectedWord = null;
      this.$emit('answer', null);
    },
  },
};
</script>

<style scoped>
button:active {
  transform: scale(0.95);
}
</style>