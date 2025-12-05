<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading results...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border-2 border-red-200 rounded-lg p-8 text-center">
        <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-xl font-semibold text-red-800 mb-2">Failed to load results</h3>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button
          class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          @click="loadResult"
        >
          Retry
        </button>
      </div>

      <!-- Results Content -->
      <div v-else-if="resultData">
        <!-- Score Card -->
        <div class="bg-white rounded-2xl shadow-2xl p-8 mb-6 text-center">
          <div class="mb-6">
            <div class="inline-flex items-center justify-center w-32 h-32 rounded-full mb-4"
                 :class="scoreColor + '-gradient'">
              <span class="text-5xl font-bold text-white">{{ resultData.score }}</span>
            </div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">
              {{ scoreMessage }}
            </h1>
            <p class="text-lg text-gray-600">{{ resultData.exerciseTitle }}</p>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-4 mt-8">
            <div class="p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <p class="text-3xl font-bold text-green-600">{{ resultData.correctCount }}</p>
              <p class="text-sm text-gray-600 mt-1">Chính xác</p>
            </div>
            <div class="p-4 bg-red-50 rounded-lg border-2 border-red-200">
              <p class="text-3xl font-bold text-red-600">{{ incorrectCount }}</p>
              <p class="text-sm text-gray-600 mt-1">Sai</p>
            </div>
            <div class="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <p class="text-3xl font-bold text-blue-600">{{ totalQuestions }}</p>
              <p class="text-sm text-gray-600 mt-1">Tổng</p>
            </div>
          </div>

          <!-- Completion Time -->
          <div class="mt-6 p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600">
              Completed at: <span class="font-semibold">{{ formattedCompletionTime }}</span>
            </p>
          </div>
        </div>

        <!-- Answers Review -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Đáp Án
          </h2>

          <div class="space-y-4">
            <div
              v-for="(answer, index) in resultData.answers"
              :key="answer.id"
              class="p-6 rounded-lg border-2 transition-all"
              :class="answer.isCorrect 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'"
            >
              <div class="flex items-start gap-4">
                <!-- Question Number -->
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                    :class="answer.isCorrect ? 'bg-green-500' : 'bg-red-500'"
                  >
                    {{ index + 1 }}
                  </div>
                </div>

                <!-- Answer Details -->
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-3">
                    <svg
                      v-if="answer.isCorrect"
                      class="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg
                      v-else
                      class="w-6 h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span
                      class="font-semibold"
                      :class="answer.isCorrect ? 'text-green-700' : 'text-red-700'"
                    >
                      {{ answer.isCorrect ? 'Correct' : 'Incorrect' }}
                    </span>
                  </div>

                  <!-- Your Answer -->
                  <div class="mb-2">
                    <p class="text-sm text-gray-600 mb-1">Câu trả lời của bạn::</p>
                    <p
                      class="font-medium text-lg"
                      :class="answer.isCorrect ? 'text-green-700' : 'text-red-700'"
                    >
                      {{ answer['answer-you'] || '(No answer)' }}
                    </p>
                  </div>

                  <!-- Correct Answer (nếu sai) -->
                  <div v-if="!answer.isCorrect" class="mt-3 p-3 bg-white rounded border-2 border-green-300">
                    <p class="text-sm text-gray-600 mb-1">Câu trả lời đúng:</p>
                    <p class="font-medium text-lg text-green-700">
                      {{ answer['answer-correct'] }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4 mt-6">
          <button
            class="flex-1 px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
            @click="goToExerciseList"
          >
            Quay lại bài tập
          </button>
          <button
            class="flex-1 px-6 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
            @click="retryExercise"
          >
            Thử Lại 
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'pageLayout',
  middleware: 'auth',
  name: 'ExerciseResult',

  data() {
    return {
      resultData: null,
      loading: false,
      error: null
    };
  },

  computed: {
    totalQuestions() {
      return this.resultData?.answers?.length || 0;
    },

    incorrectCount() {
      return this.totalQuestions - (this.resultData?.correctCount || 0);
    },

    scoreColor() {
      const score = this.resultData?.score || 0;
      if (score >= 80) return 'bg-green-500';
      if (score >= 60) return 'bg-blue-500';
      if (score >= 40) return 'bg-yellow-500';
      return 'bg-red-500';
    },

    scoreMessage() {
      const score = this.resultData?.score || 0;
      if (score >= 90) return '🎉 Xuất sắc!';
      if (score >= 80) return '👏 Làm tốt lắm!';
      if (score >= 70) return '👍 Làm tốt!';
      if (score >= 60) return '🙂 Không tệ!';
      if (score >= 50) return '😐 Tiếp tục cố gắng!';
      return '💪 Luyện tập thêm!';
    },

    formattedCompletionTime() {
      if (!this.resultData?.completedAt) return '';
      const date = new Date(this.resultData.completedAt);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  },

  mounted() {
    this.loadResultFromQuery();
  },

  methods: {
    loadResultFromQuery() {
      try {
        // Lấy data từ query params
        const dataString = this.$route.query.data;
        
        if (dataString) {
          this.resultData = JSON.parse(dataString);
          console.log('✅ Result data loaded:', this.resultData);
        } else {
          this.error = 'No result data found';
          this.$toast.error('Result data not found');
        }
      } catch (error) {
        console.error('❌ Error parsing result data:', error);
        this.error = 'Failed to load result data';
        this.$toast.error('Failed to load results');
      }
    },

    loadResult() {
      // Retry by reloading from query
      this.error = null;
      this.loadResultFromQuery();
    },

    goToExerciseList() {
      this.$router.push('/exercise');
    },

    retryExercise() {
      this.$router.push(`/exercise/${this.resultData.exerciseId}`);
    }
  }
};
</script>

<style scoped>
.bg-green-500-gradient {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.bg-blue-500-gradient {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.bg-yellow-500-gradient {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.bg-red-500-gradient {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}
</style>