<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <!-- Question Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm font-semibold text-blue-600 bg-red-50 px-3 py-1 rounded-full">
          Câu {{ questionNumber }} / {{ totalQuestions }}
        </span>
        <span class="text-sm text-gray-500">Find Error</span>
      </div>
      
      <h3 class="text-xl font-semibold text-gray-700 mb-2">
        Tìm phần sai và sửa lại
      </h3>
    </div>

    <!-- Instruction -->
    <div class="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 mb-6 border-l-4 border-blue-500">
      <p class="text-sm text-gray-700">
        <span class="font-semibold">💡 Gợi ý:</span> Nhập dạng: A-have, B-text để sửa phần sai
      </p>
    </div>

    <!-- Sentence Display -->
    <div class="bg-gray-50 rounded-lg p-6 mb-6">
      <p class="text-lg leading-relaxed text-gray-800">
        <span v-for="(part, index) in displaySentence" :key="index">
          <span v-if="part.type === 'label'" class="font-bold text-red-700">{{ part.text }}</span>
          <span v-else-if="part.type === 'error'" class="underline decoration-red-500 decoration-wavy text-red-600 font-medium">{{ part.text }}</span>
          <span v-else class="text-gray-700">{{ part.text }}</span>
        </span>
      </p>
    </div>

    <!-- Input Field -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Nhập câu trả lời (ví dụ: A-have):
      </label>
      <input
        v-model="answer"
        type="text"
        placeholder="A-have"
        class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all"
        @input="submitAnswer"
      />
    </div>

    <!-- Display Answer -->
    <div v-if="answer" class="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
      <p class="text-sm text-gray-600 mb-1">Đáp án của bạn:</p>
      <p class="text-lg font-bold text-red-700">{{ answer }}</p>
    </div>

    <!-- Helper Text -->
    <div v-if="!answer" class="mt-4 flex items-start gap-2 text-sm text-gray-500">
      <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>Nhập phần (A, B, C, D) và từ sửa</p>
    </div>

    <!-- Reset Button -->
    <button
      v-if="answer"
      class="mt-4 w-full py-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
      @click="resetAnswer"
    >
      🔄 Xóa
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
      answer: this.userAnswer || '',
    };
  },

  computed: {
    displaySentence() {
      const sentence = this.question.question.sentence;
      const parts = this.question.question.parts;
      const result = [];
      
      let currentPos = 0;
      const labels = Object.keys(parts).sort();
      
      // Find all parts positions in sentence
      const positions = [];
      labels.forEach(label => {
        const text = parts[label];
        const index = sentence.indexOf(text, currentPos);
        if (index !== -1) {
          positions.push({
            start: index,
            end: index + text.length,
            label: label,
            text: text,
          });
        }
      });

      // Sort by position
      positions.sort((a, b) => a.start - b.start);

      // Build display
      currentPos = 0;
      positions.forEach(pos => {
        // Add text before
        if (pos.start > currentPos) {
          result.push({
            type: 'text',
            text: sentence.substring(currentPos, pos.start),
          });
        }

        // Add label
        result.push({
          type: 'label',
          text: `(${pos.label}) `,
        });

        // Add underlined error text
        result.push({
          type: 'error',
          text: pos.text,
        });

        currentPos = pos.end;
      });

      // Add remaining text
      if (currentPos < sentence.length) {
        result.push({
          type: 'text',
          text: sentence.substring(currentPos),
        });
      }

      return result;
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
    submitAnswer() {
      this.$emit('answer', this.answer);
    },

    resetAnswer() {
      this.answer = '';
      this.$emit('answer', '');
    },
  },
};
</script>

<style scoped>
button:active {
  transform: scale(0.95);
}
</style>