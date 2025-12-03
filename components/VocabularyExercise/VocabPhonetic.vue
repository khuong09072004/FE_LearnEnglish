<template>
  <div class="bg-white rounded-lg shadow-md p-8">
    <h3 class="text-lg font-semibold text-gray-700 mb-6">
      Write the word based on its phonetic transcription
    </h3>

    <!-- Phonetic Display -->
    <div class="mb-8 text-center p-10 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border-2 border-green-200">
      <p class="text-sm text-green-600 mb-2 font-semibold">Phonetic Transcription:</p>
      <p class="text-5xl font-mono text-green-800">
        {{ question.question.phonetic }}
      </p>
    </div>

    <!-- Input Field -->
    <div class="mb-6">
      <label class="block text-sm font-semibold text-gray-700 mb-3">
        Your Answer:
      </label>
      <input
        v-model="inputAnswer"
        type="text"
        placeholder="Type the word here..."
        class="w-full px-6 py-4 text-2xl text-center border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
        :class="[
          inputAnswer
            ? 'border-green-400 bg-green-50'
            : 'border-gray-300 bg-white'
        ]"
        @input="handleInput"
      />
    </div>

    <!-- Character Counter -->
    <div class="text-center mb-6">
      <p class="text-sm text-gray-500">
        Characters: <span class="font-semibold text-gray-700">{{ inputAnswer.length }}</span>
      </p>
    </div>

    <!-- Instruction -->
    <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p class="text-sm text-yellow-800">
        <strong>💡 Tip:</strong> Listen carefully to the phonetic symbols and type the English word.
      </p>
    </div>

    <!-- Example Help -->
    <div class="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <p class="text-xs text-gray-600">
        <strong>Example:</strong> /ˈkæt/ → "cat" | /dɔg/ → "dog"
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VocabPhonetic',
  
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