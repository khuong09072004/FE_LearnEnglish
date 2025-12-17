<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <!-- Question Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <span
          class="text-sm font-semibold text-blue-600 bg-green-50 px-3 py-1 rounded-full"
        >
          Câu {{ questionNumber }} / {{ totalQuestions }}
        </span>
        <span class="text-sm text-gray-500">Choose Correct Sentence</span>
      </div>

      <h3 class="text-xl font-semibold text-gray-700 mb-2">
        Chọn câu đúng ngữ pháp
      </h3>
    </div>

    <!-- Instruction -->
    <div
      class="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6 border-l-4 border-blue-500"
    >
      <p class="text-sm text-gray-700">
        <span class="font-semibold">💡 Gợi ý:</span> Đọc kỹ từng câu và chọn câu
        có ngữ pháp chính xác nhất
      </p>
    </div>

    <!-- Sentences Options -->
    <div class="space-y-4">
      <button
        v-for="(sentence, index) in question.question.sentences"
        :key="index"
        class="w-full text-left p-5 rounded-lg border-2 transition-all duration-200 group"
        :class="[
          selectedAnswerIndex === index
            ? 'bg-blue-500 text-white border-blue-600 shadow-lg scale-105'
            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50',
        ]"
        @click="selectSentence(index)"
      >
        <div class="flex items-start gap-4">
          <!-- Sentence Content -->
          <div class="flex gap-2">
            <div class="flex items-center gap-2">
              <span
                class="text-xs font-semibold px-2 py-0.5 rounded"
                :class="[
                  selectedAnswerIndex === index
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600',
                ]"
              >
                {{ String.fromCharCode(65 + index) }}
              </span>
            </div>
            <p
              class="text-lg leading-relaxed"
              :class="[
                selectedAnswerIndex === index
                  ? 'text-white font-medium'
                  : 'ext-white',
              ]"
            >
              {{ sentence }}
            </p>
          </div>
        </div>
      </button>
    </div>

    <!-- Helper Text -->
    <div
      v-if="selectedAnswerIndex === null"
      class="mt-6 flex items-start gap-2 text-sm text-gray-500"
    >
      <svg
        class="w-5 h-5 mt-0.5 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p>Chọn câu có ngữ pháp chính xác</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "GrammarSentenceChoice",

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
      selectedAnswerIndex: this.findAnswerIndex(this.userAnswer),
    };
  },

  watch: {
    userAnswer(newVal) {
      this.selectedAnswerIndex = this.findAnswerIndex(newVal);
    },

    question() {
      this.selectedAnswerIndex = this.findAnswerIndex(this.userAnswer);
    },
  },

  methods: {
    findAnswerIndex(answerText) {
      if (!answerText) return null;
      const index = this.question.question.sentences.indexOf(answerText);
      return index !== -1 ? index : null;
    },

    selectSentence(index) {
      this.selectedAnswerIndex = index;
      const selectedSentence = this.question.question.sentences[index];
      // Emit text câu trả lời lên parent
      this.$emit("answer", selectedSentence);
    },
  },
};
</script>

<style scoped>
button:active {
  transform: scale(0.99);
}
</style>