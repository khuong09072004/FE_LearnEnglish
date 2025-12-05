<template>
  <div class="bg-white rounded-lg shadow-md p-8">
    <h3 class="text-lg font-semibold text-gray-700 mb-6">
      Ghép phiên âm với từ đúng
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Left Side - Phonetic -->
      <div class="flex items-center justify-center p-8 bg-blue-50 rounded-lg border-2 border-blue-200">
        <p class="text-3xl font-mono text-blue-800">
          {{ question.question.left }}
        </p>
      </div>

      <!-- Right Side - Options -->
      <div class="space-y-3">
        <button
          v-for="(option, index) in question.question.right_options"
          :key="index"
          class="w-full p-4 text-left rounded-lg border-2 transition-all duration-200 font-medium"
          :class="[
            selectedAnswer === option
              ? 'bg-blue-500 text-white border-blue-600 shadow-lg scale-105'
              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          ]"
          @click="selectAnswer(option)"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0"
              :class="[
                selectedAnswer === option
                  ? 'border-white bg-white'
                  : 'border-gray-400'
              ]"
            >
              <div
                v-if="selectedAnswer === option"
                class="w-3 h-3 rounded-full bg-blue-500"
              ></div>
            </div>
            <span>{{ option }}</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Instruction -->
    <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p class="text-sm text-yellow-800">
        <strong>💡 Mẹo:</strong>  Chọn từ phù hợp với phiên âm.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VocabMatch',
  
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
      // Reset when question changes
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