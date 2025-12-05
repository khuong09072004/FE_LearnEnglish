<template>
  <div class="bg-white rounded-lg shadow-md p-8">
    <h3 class="text-lg font-semibold text-gray-700 mb-6">
      Chọn nghĩa đúng của từ
    </h3>

    <!-- Word Display -->
    <div class="mb-8 text-center p-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
      <p class="text-4xl font-bold text-purple-800">
        {{ question.question.word }}
      </p>
    </div>

    <!-- Options -->
    <div class="space-y-3">
      <button
        v-for="(option, index) in question.question.options"
        :key="index"
        class="w-full p-5 text-left rounded-lg border-2 transition-all duration-200 font-medium"
        :class="[
          selectedAnswer === option
            ? 'bg-purple-500 text-white border-purple-600 shadow-lg scale-105'
            : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400 hover:bg-purple-50'
        ]"
        @click="selectAnswer(option)"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 font-bold"
            :class="[
              selectedAnswer === option
                ? 'border-white bg-white text-purple-500'
                : 'border-gray-400 text-gray-400'
            ]"
          >
            {{ String.fromCharCode(65 + index) }}
          </div>
          <span class="text-lg">{{ option }}</span>
        </div>
      </button>
    </div>

    <!-- Instruction -->
    <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <p class="text-sm text-blue-800">
        <strong>💡 Mẹo:</strong> Chọn phương án thể hiện đúng nghĩa tiếng Việt nhất của từ.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VocabMeaningChoice',
  
  props: {
    question: {
      type: Object,
      required: true
    },
    questionNumber: {
      type: Number,
      required: true
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    userAnswer: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      selectedAnswer: this.userAnswer
    };
  },

  watch: {
    userAnswer(newVal) {
      this.selectedAnswer = newVal;
    },
    
    question() {
      this.selectedAnswer = this.userAnswer;
    }
  },

  methods: {
    selectAnswer(answer) {
      this.selectedAnswer = answer;
      this.$emit('answer', answer);
    }
  }
};
</script>