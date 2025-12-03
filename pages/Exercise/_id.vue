<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20">
        <div
          class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"
        ></div>
        <p class="mt-4 text-gray-600">Loading exercise...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-red-50 border-2 border-red-200 rounded-lg p-8 text-center"
      >
        <svg
          class="w-16 h-16 text-red-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 class="text-xl font-semibold text-red-800 mb-2">
          Failed to load exercise
        </h3>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button
          class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          @click="loadExercise"
        >
          Retry
        </button>
      </div>

      <!-- Exercise Content -->
      <div v-else-if="exerciseData">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h1 class="text-2xl font-bold text-gray-800 mb-2">
                {{ exerciseData.title }}
              </h1>
              <p class="text-gray-600">
                {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}
              </p>
            </div>

            <!-- Timer -->
            <div class="text-right">
              <div
                class="flex items-center gap-2 text-lg font-semibold"
                :class="timeLeft < 60 ? 'text-red-500' : 'text-gray-700'"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{{ formattedTime }}</span>
              </div>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div
              class="bg-blue-500 h-3 rounded-full transition-all duration-300"
              :style="{ width: progressPercent + '%' }"
            ></div>
          </div>
        </div>

        <!-- Dynamic Exercise Component -->
        <component
          :is="exerciseComponent"
          :question="currentQuestion"
          :question-number="currentQuestionIndex + 1"
          :total-questions="totalQuestions"
          :user-answer="userAnswers[currentQuestion.id]"
          @answer="handleAnswer"
        />

        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-6">
          <button
            v-if="currentQuestionIndex > 0"
            class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
            @click="previousQuestion"
          >
            ← Previous
          </button>
          <div v-else></div>

          <button
            v-if="currentQuestionIndex < totalQuestions - 1"
            class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            :disabled="!userAnswers[currentQuestion.id]"
            :class="
              !userAnswers[currentQuestion.id]
                ? 'opacity-50 cursor-not-allowed'
                : ''
            "
            @click="nextQuestion"
          >
            Next →
          </button>
          <button
            v-else
            class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
            :disabled="!allQuestionsAnswered"
            :class="
              !allQuestionsAnswered ? 'opacity-50 cursor-not-allowed' : ''
            "
            @click="submitExercise"
          >
            Submit
          </button>
        </div>

        <!-- Question Navigation Dots -->
        <div class="flex justify-center gap-2 mt-6 flex-wrap">
          <button
            v-for="(item, index) in exerciseData.ExerciesItem"
            :key="item.id"
            class="w-10 h-10 rounded-full font-semibold transition-all"
            :class="[
              currentQuestionIndex === index
                ? 'bg-blue-500 text-white scale-110'
                : userAnswers[item.id]
                ? 'bg-green-200 text-green-800'
                : 'bg-gray-200 text-gray-600',
              'hover:scale-110',
            ]"
            @click="goToQuestion(index)"
          >
            {{ index + 1 }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getExercisesItems, submitVocabExercise } from "../../apis/exercise";
import VocabMatch from "../../components/VocabularyExercise/VocabMatch.vue";
import VocabMeaningChoice from "../../components/VocabularyExercise/VocabMeaningChoice.vue";
import VocabPhonetic from "../../components/VocabularyExercise/VocabPhonetic.vue";
import VocabPatternFill from "../../components/VocabularyExercise/VocabPatternFill.vue";

export default {
  layout: "pageLayout",
  middleware: "auth",

  components: {
    VocabMatch,
    VocabMeaningChoice,
    VocabPhonetic,
    VocabPatternFill,
  },

  data() {
    return {
      exerciseData: null,
      loading: true,
      error: null,
      currentQuestionIndex: 0,
      userAnswers: {}, // { questionId: answer }
      timeLeft: 0, // seconds
      timerInterval: null,
    };
  },

  computed: {
    exerciseComponent() {
      if (!this.exerciseData) return null;

      const typeMap = {
        VOCAB_MATCH: "VocabMatch",
        VOCAB_MEANING_CHOICE: "VocabMeaningChoice",
        VOCAB_PHONETIC: "VocabPhonetic",
        VOCAB_PATTERN_FILL: "VocabPatternFill",
      };

      return typeMap[this.exerciseData.type] || null;
    },

    currentQuestion() {
      return this.exerciseData?.ExerciesItem[this.currentQuestionIndex] || null;
    },

    totalQuestions() {
      return this.exerciseData?.ExerciesItem?.length || 0;
    },

    progressPercent() {
      const answered = Object.keys(this.userAnswers).length;
      return (answered / this.totalQuestions) * 100;
    },

    formattedTime() {
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = this.timeLeft % 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    },

    allQuestionsAnswered() {
      return Object.keys(this.userAnswers).length === this.totalQuestions;
    },
  },

  mounted() {
    this.loadExercise();
  },

  beforeDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  },

  methods: {
    async loadExercise() {
      this.loading = true;
      this.error = null;

      try {
        const exerciseId = this.$route.params.id;
        const response = await getExercisesItems(exerciseId);

        this.exerciseData = response.data;
        this.timeLeft = this.exerciseData.duration * 60; // Convert minutes to seconds

        this.startTimer();

        console.log("✅ Exercise loaded:", this.exerciseData);
      } catch (error) {
        console.error("❌ Error loading exercise:", error);
        this.error = error.response?.data?.message || "Something went wrong";
        this.$toast.error("Failed to load exercise");
      } finally {
        this.loading = false;
      }
    },

    startTimer() {
      this.timerInterval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.timeExpired();
        }
      }, 1000);
    },

    timeExpired() {
      clearInterval(this.timerInterval);
      this.$toast.warning("Time is up!");
      this.submitExercise();
    },

    handleAnswer(answer) {
      this.$set(this.userAnswers, this.currentQuestion.id, answer);
      console.log("📝 Answer recorded:", {
        questionId: this.currentQuestion.id,
        answer,
      });
    },

    nextQuestion() {
      if (this.currentQuestionIndex < this.totalQuestions - 1) {
        this.currentQuestionIndex++;
      }
    },

    previousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
      }
    },

    goToQuestion(index) {
      this.currentQuestionIndex = index;
    },

    async submitExercise() {
      if (!this.allQuestionsAnswered) {
        const confirmed = confirm(
          "You have not answered all questions. Submit anyway?"
        );
        if (!confirmed) return;
      }

      clearInterval(this.timerInterval);

      try {
        const answers = this.exerciseData.ExerciesItem.map((item) => ({
          id: item.id,
          answer: this.userAnswers[item.id] || "",
        }));

        const exerciseId = parseInt(this.$route.params.id);

        console.log("📤 Submitting exercise:", { exerciseId, answers });

        // Call API submit
        const response = await submitVocabExercise(exerciseId, answers);

        console.log("✅ Submit response:", response);

        // ✅ Lấy data từ response
        const resultData = response.data;

        this.$toast.success("Exercise submitted successfully!");
        
        // ✅ Navigate với đúng cấu trúc
        this.$router.push({
          path: `/exercise/resul/${resultData.resultId}`,
          query: {
            data: JSON.stringify(resultData),
          },
        });
      } catch (error) {
        console.error("❌ Error submitting exercise:", error);
        this.$toast.error(
          error.response?.data?.message || "Failed to submit exercise"
        );
      }
    },
  },
};
</script>

<style scoped>
/* Custom animations */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>