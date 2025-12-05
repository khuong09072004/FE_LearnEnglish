<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <!-- Question Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
          Câu {{ questionNumber }} / {{ totalQuestions }}
        </span>
        <span class="text-sm text-gray-500">Reorder Sentence</span>
      </div>
      
      <h3 class="text-xl font-bold text-gray-800 mb-2">
        Sắp xếp các từ thành câu hoàn chỉnh
      </h3>
    </div>

    <!-- Instruction -->
    <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-6 border-l-4 border-purple-500">
      <p class="text-sm text-gray-700">
        <span class="font-semibold">💡 Gợi ý:</span> Click vào các từ theo đúng thứ tự để tạo thành câu đúng ngữ pháp
      </p>
    </div>

    <!-- Ordered Words Display (Your Answer) -->
    <div class="mb-6">
      <p class="text-sm font-semibold text-gray-600 mb-2">Câu của bạn:</p>
      <div class="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 min-h-[80px]">
        <div v-if="orderedWords.length > 0" class="flex flex-wrap gap-2">
          <div
            v-for="(word, index) in orderedWords"
            :key="'ordered-' + index"
            class="group relative"
          >
            <div class="bg-purple-500 text-white px-4 py-2 rounded-lg font-medium shadow-sm flex items-center gap-2">
              <span class="text-xs opacity-75">{{ index + 1 }}</span>
              <span>{{ word }}</span>
              <button
                class="ml-1 hover:bg-purple-600 rounded-full p-1 transition-colors"
                @click="removeWord(index)"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-400 text-center py-4">
          Click vào các từ bên dưới để bắt đầu sắp xếp...
        </p>
      </div>
    </div>

    <!-- Available Words (Scrambled) -->
    <div class="mb-6">
      <p class="text-sm font-semibold text-gray-600 mb-2">Các từ có sẵn:</p>
      <div class="bg-gray-50 rounded-lg p-4 min-h-[80px]">
        <div v-if="availableWords.length > 0" class="flex flex-wrap gap-2">
          <button
            v-for="(word, index) in availableWords"
            :key="'available-' + index"
            class="bg-white border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 hover:scale-105"
            @click="addWord(word, index)"
          >
            {{ word }}
          </button>
        </div>
        <p v-else class="text-gray-400 text-center py-4">
          ✅ Đã sử dụng hết tất cả các từ
        </p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-3">
      <button
        class="flex-1 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
        :disabled="orderedWords.length === 0"
        :class="orderedWords.length === 0 ? 'opacity-50 cursor-not-allowed' : ''"
        @click="resetOrder"
      >
        🔄 Làm lại
      </button>
    </div>

    <!-- Helper Text -->
    <div v-if="orderedWords.length === 0" class="mt-6 flex items-start gap-2 text-sm text-gray-500">
      <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>Click vào các từ theo thứ tự để tạo thành câu hoàn chỉnh</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GrammarReorder',
  
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
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      orderedWords: [],
      availableWords: [],
      usedIndices: [],
    };
  },

  watch: {
    question: {
      immediate: true,
      handler() {
        this.initializeWords();
      },
    },

    userAnswer: {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.orderedWords = [...newVal];
          this.updateAvailableWords();
        }
      },
    },
  },

  methods: {
    initializeWords() {
      const scrambled = this.question.question.scrambled || [];
      
      if (this.userAnswer && this.userAnswer.length > 0) {
        this.orderedWords = [...this.userAnswer];
      } else {
        this.orderedWords = [];
      }
      
      this.updateAvailableWords();
    },

    updateAvailableWords() {
      const scrambled = this.question.question.scrambled || [];
      const orderedSet = new Set(this.orderedWords);
      
      // Create available words by filtering out already used ones
      this.availableWords = scrambled.filter(word => {
        // Count how many times this word appears in scrambled
        const countInScrambled = scrambled.filter(w => w === word).length;
        // Count how many times this word appears in ordered
        const countInOrdered = this.orderedWords.filter(w => w === word).length;
        
        return countInOrdered < countInScrambled;
      });
    },

    addWord(word, index) {
      this.orderedWords.push(word);
      this.updateAvailableWords();
      this.emitAnswer();
    },

    removeWord(index) {
      this.orderedWords.splice(index, 1);
      this.updateAvailableWords();
      this.emitAnswer();
    },

    resetOrder() {
      this.orderedWords = [];
      this.updateAvailableWords();
      this.emitAnswer();
    },

    emitAnswer() {
      // Emit the ordered array
      this.$emit('answer', this.orderedWords.length > 0 ? [...this.orderedWords] : null);
    },
  },
};
</script>

<style scoped>
button:active {
  transform: scale(0.95);
}
</style>