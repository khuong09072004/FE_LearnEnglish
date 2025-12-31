<template>
  <div class="bg-white rounded-lg shadow-md p-8">
    <h3 class="text-lg font-semibold text-gray-700 mb-6">
      Điền vào chỗ trống dựa theo mẫu
    </h3>

    <!-- Pattern Hint -->
    <div class="mb-6 text-center p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border-2 border-blue-200">
      <p class="text-sm text-blue-600 mb-2 font-semibold">Mẫu từ:</p>
      <p class="text-4xl font-mono font-bold text-blue-800 tracking-widest">
        {{ question.question.pattern }}
      </p>
    </div>

    <!-- Sentence Context -->
    <div class="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <p class="text-sm text-gray-500 mb-2 font-semibold">Câu:</p>
      <p class="text-lg text-gray-800 leading-relaxed">
        "{{ question.question.sentence }}"
      </p>
    </div>

    <!-- Input Field -->
    <div class="mb-6">
      <label class="block text-sm font-semibold text-gray-700 mb-3">
        Câu trả lời của bạn:
      </label>
      <input
        v-model="inputAnswer"
        type="text"
        placeholder="Type the complete word..."
        class="w-full px-6 py-4 text-2xl text-center border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
        :class="[
          inputAnswer
            ? matchesPattern
              ? 'border-green-400 bg-green-50'
              : 'border-red-400 bg-red-50'
            : 'border-gray-300 bg-white'
        ]"
        @input="handleInput"
      />
      
      <!-- Pattern Match Feedback -->
      <div v-if="inputAnswer" class="mt-3 text-center">
        <p v-if="matchesPattern" class="text-sm text-green-600 font-semibold">
          ✓ Phù hợp với mẫu!
        </p>
        <p v-else class="text-sm text-red-600 font-semibold">
          ✗ Không khớp với mẫu "{{ question.question.pattern }}"
        </p>
      </div>
    </div>

    <!-- Character Counter -->
    <div class="text-center mb-6">
      <p class="text-sm text-gray-500">
        Characters: <span class="font-semibold text-gray-700">{{ inputAnswer.length }}</span>
        / Expected: <span class="font-semibold text-orange-600">{{ expectedLength }}</span>
      </p>
    </div>

    <!-- Instructions -->
    <div class="space-y-3">
      <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p class="text-sm text-blue-800">
          <strong>💡 Mẹo:</strong> Mẫu này hiển thị chữ cái đầu tiên và số lượng dấu gạch dưới biểu thị các chữ cái còn lại.
        </p>
      </div>
      
      <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p class="text-sm text-yellow-800">
          <strong>📝 Ví dụ:</strong> Mẫu "c____" với 5 chữ cái có thể là "close", "chair", "clean", v.v.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VocabPatternFill',
  
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
      inputAnswer: this.userAnswer || ''
    };
  },

  computed: {
    expectedLength() {
      return this.question.question.pattern.length;
    },

    matchesPattern() {
      if (!this.inputAnswer) return false;
      
      const pattern = this.question.question.pattern.toLowerCase();
      const answer = this.inputAnswer.toLowerCase();
      
      // Check length
      if (answer.length !== pattern.length) return false;
      
      // Check first character and underscores
      for (let i = 0; i < pattern.length; i++) {
        if (pattern[i] !== '_' && pattern[i] !== answer[i]) {
          return false;
        }
      }
      
      return true;
    }
  },

  watch: {
    userAnswer(newVal) {
      this.inputAnswer = newVal || '';
    },
    
    question() {
      this.inputAnswer = this.userAnswer || '';
    }
  },

  methods: {
    handleInput() {
      const trimmedAnswer = this.inputAnswer.trim();
      this.$emit('answer', trimmedAnswer);
    }
  }
};
</script>