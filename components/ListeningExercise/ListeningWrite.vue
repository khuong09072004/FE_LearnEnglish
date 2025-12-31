<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <!-- Audio Player -->
    <div class="mb-6 bg-blue-50 rounded-lg p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-800">
          🎧 Nghe và viết câu trả lời
        </h3>
        <span class="text-sm text-gray-600">
          Câu {{ questionNumber }} / {{ totalQuestions }}
        </span>
      </div>

      <audio
        ref="audioPlayer"
        :src="audioUrl"
        controls
        class="w-full"
        @play="handlePlay"
        @pause="handlePause"
        @ended="handleEnded"
      ></audio>

      <div class="mt-3 flex items-center gap-4 text-sm text-gray-600">
        <button
          class="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          @click="replayAudio"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Nghe lại
        </button>
        <span v-if="playCount > 0">
          Đã nghe: {{ playCount }} lần
        </span>
      </div>
    </div>

    <!-- Question -->
    <div class="mb-6">
      <div class="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 class="text-gray-800 font-semibold text-lg mb-2">
          Câu hỏi:
        </h4>
        <p class="text-gray-700 text-lg">
          {{ question.question.question }}
        </p>
      </div>

      <!-- Long Answer Textarea -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Viết câu trả lời chi tiết:
        </label>
        <textarea
          v-model="answer"
          rows="6"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-lg resize-none"
          placeholder="Viết câu trả lời đầy đủ, chi tiết..."
          @input="handleInput"
        ></textarea>
        
        <div class="flex justify-between items-center mt-2">
          <p class="text-sm text-gray-500">
            Viết câu trả lời hoàn chỉnh (tối thiểu 2-3 câu)
          </p>
          <span class="text-sm" :class="wordCount >= 10 ? 'text-green-600' : 'text-gray-400'">
            {{ wordCount }} từ
          </span>
        </div>
      </div>
    </div>

    <!-- Hint -->
    <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
      <p class="text-sm text-yellow-800">
        <strong>💡 Gợi ý:</strong> Nghe kỹ toàn bộ audio, ghi chú các ý chính và viết câu trả lời đầy đủ, có cấu trúc rõ ràng.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListeningWrite',

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
      default: ''
    },
    audioUrl: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      answer: this.userAnswer || '',
      playCount: 0,
      isPlaying: false
    }
  },

  computed: {
    wordCount() {
      if (!this.answer || !this.answer.trim()) return 0
      return this.answer.trim().split(/\s+/).length
    }
  },

  watch: {
    userAnswer(newVal) {
      this.answer = newVal || ''
    },
    question() {
      this.answer = this.userAnswer || ''
    }
  },

  methods: {
    handleInput() {
      this.$emit('answer', this.answer.trim())
    },

    replayAudio() {
      const audio = this.$refs.audioPlayer
      if (audio) {
        audio.currentTime = 0
        audio.play()
      }
    },

    handlePlay() {
      this.isPlaying = true
      this.playCount++
    },

    handlePause() {
      this.isPlaying = false
    },

    handleEnded() {
      this.isPlaying = false
    }
  }
}
</script>