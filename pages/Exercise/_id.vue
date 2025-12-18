<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <button
      class="mb-4 flex items-center gap-1 px-4 py-2 text-gray-600 rounded-lg transition-colors"
      @click="showExitConfirm"
    >
      <a-icon type="left" />
      <span class="font-semibold"> Quay lại</span>
    </button>

    <div class="max-w-4xl mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20">
        <div
          class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"
        ></div>
        <p class="mt-4 text-gray-600">Đang tải bài tập...</p>
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
          Không tải được bài tập
        </h3>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button
          class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          @click="loadExercise"
        >
          Thử lại
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
          :user-answer="
            currentQuestion ? userAnswers[currentQuestion.id] : null
          "
          :audio-url="exerciseData.audioUrl"
          :passage="passage"
          @answer="handleAnswer"
        />

        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-6">
          <button
            v-if="currentQuestionIndex > 0"
            class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
            @click="previousQuestion"
          >
            Trước
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
            Tiếp Tục
          </button>
          <button
            v-else
            class="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
            @click="submitExercise"
          >
            Nộp Bài
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

    <!-- Confirm Modal -->
    <div
      v-if="showConfirmModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeConfirmModal"
    >
      <div
        class="bg-white rounded-lg shadow-2xl max-w-sm w-full transform transition-all"
      >
        <!-- Icon -->
        <div class="flex justify-center pt-6">
          <div
            class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4v2m0 5v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 text-center">
          <h3 class="text-xl font-bold text-gray-800 mb-2">
            Bạn có chắc muốn thoát?
          </h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            Tiến trình làm bài sẽ bị mất. Bạn vẫn muốn tiếp tục?
          </p>
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 px-6 pb-6">
          <button
            class="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            @click="closeConfirmModal"
          >
            Ở lại
          </button>
          <button
            class="flex-1 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
            @click="confirmExit"
          >
            Thoát
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getExercisesItems, getPassageById } from "../../apis/exercise";
import VocabMatch from "../../components/VocabularyExercise/VocabMatch.vue";
import VocabMeaningChoice from "../../components/VocabularyExercise/VocabMeaningChoice.vue";
import VocabPhonetic from "../../components/VocabularyExercise/VocabPhonetic.vue";
import VocabPatternFill from "../../components/VocabularyExercise/VocabPatternFill.vue";
import GrammarMCQ from "../../components/GrammarExercise/GrammarMCQ.vue";
import GrammarSentenceChoice from "../../components/GrammarExercise/GrammarSentenceChoice.vue";
import GrammarFindError from "../../components/GrammarExercise/GrammarFindError.vue";
import GrammarReorder from "../../components/GrammarExercise/GrammarReorder.vue";
import GrammarRewrite from "../../components/GrammarExercise/GrammarRewrite.vue";
import ListeningFill from "../../components/ListeningExercise/ListeningFill.vue";
import ListeningQA from "../../components/ListeningExercise/ListeningQA.vue";
import ListeningWrite from "../../components/ListeningExercise/ListeningWrite.vue";
import ReadFill from "../../components/ReadingExercise/ReadFill.vue";
import ReadQA from "../../components/ReadingExercise/ReadQA.vue";
import ReadMCQ from "../../components/ReadingExercise/ReadMCQ.vue";
import WriteReorder from "../../components/WritingExercise/WriteReorder.vue";
import WriteRewrite from "../../components/WritingExercise/WriteRewrite.vue";
import WriteFix from "../../components/WritingExercise/WriteFix.vue";
import WriteReorderGroup from "../../components/WritingExercise/WriteReorderGroup.vue";

import exerciseSoundMixin from "../../mixins/exerciseSoundMixin";
import exerciseTimerMixin from "../../mixins/exerciseTimerMixin";
import exerciseSubmitMixin from "../../mixins/exerciseSubmitMixin";

export default {
  layout: "pageLayout",
  middleware: "auth",

  components: {
    VocabMatch,
    VocabMeaningChoice,
    VocabPhonetic,
    VocabPatternFill,
    GrammarMCQ,
    GrammarSentenceChoice,
    GrammarFindError,
    GrammarReorder,
    GrammarRewrite,
    ListeningFill,
    ListeningQA,
    ListeningWrite,
    ReadFill,
    ReadQA,
    ReadMCQ,
    WriteReorder,
    WriteRewrite,
    WriteFix,
    WriteReorderGroup,
  },

  mixins: [exerciseSoundMixin, exerciseTimerMixin, exerciseSubmitMixin],

  data() {
    return {
      exerciseData: null,
      passage: null,
      loading: true,
      error: null,
      currentQuestionIndex: 0,
      userAnswers: {},
      showConfirmModal: false,
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
        GRAMMAR_MCQ: "GrammarMCQ",
        GRAMMAR_SENTENCE_CHOICE: "GrammarSentenceChoice",
        GRAMMAR_FIND_ERROR: "GrammarFindError",
        GRAMMAR_REORDER: "GrammarReorder",
        GRAMMAR_REWRITE: "GrammarRewrite",
        LISTEN_FILL: "ListeningFill",
        LISTEN_QA: "ListeningQA",
        LISTEN_WRITE: "ListeningWrite",
        READ_FILL: "ReadFill",
        READ_QA: "ReadQA",
        READ_MCQ: "ReadMCQ",
        WRITE_REORDER: "WriteReorder",
        WRITE_REWRITE: "WriteRewrite",
        WRITE_FIX: "WriteFix",
        WRITE_REORDER_GROUP: "WriteReorderGroup",
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
      if (!this.exerciseData) return 0;
      const answered = this.exerciseData.ExerciesItem.filter(
        (q) =>
          this.userAnswers[q.id] !== undefined && this.userAnswers[q.id] !== ""
      ).length;
      return Math.round((answered / this.totalQuestions) * 100);
    },

    allQuestionsAnswered() {
      if (!this.exerciseData) return false;
      return this.exerciseData.ExerciesItem.every(
        (q) =>
          this.userAnswers[q.id] !== undefined && this.userAnswers[q.id] !== ""
      );
    },
  },

  mounted() {
    this.initSounds();
    this.loadExercise();
  },

  beforeDestroy() {
    this.clearTimer();
    this.destroySounds();
  },

  methods: {
    async loadExercise() {
      this.loading = true;
      this.error = null;

      try {
        const exerciseId = this.$route.params.id;
        const response = await getExercisesItems(exerciseId);

        this.exerciseData = response.data;

        if (this.exerciseData.passageId) {
          await this.loadPassage(this.exerciseData.passageId);
        }

        this.startTimer(0.2);

        
      } catch (error) {
        console.error("❌ Error loading exercise:", error);
        this.error = error.response?.data?.message || "Something went wrong";
        this.$toast.error("Failed to load exercise");
      } finally {
        this.loading = false;
      }
    },

    async loadPassage(passageId) {
      try {
      
        const response = await getPassageById(passageId);
        this.passage = response.data || response;

        
      } catch (error) {
        console.error("❌ Error loading passage:", error);
      }
    },

    handleAnswer(answer) {
      this.$set(this.userAnswers, this.currentQuestion.id, answer);
      this.playSound("answer");

     
    },

    nextQuestion() {
      if (this.currentQuestionIndex < this.totalQuestions - 1) {
        this.playSound("click");
        this.currentQuestionIndex++;
        
      }
    },

    previousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.playSound("click");
        this.currentQuestionIndex--;
      }
    },

    goToQuestion(index) {
      this.playSound("click");
      this.currentQuestionIndex = index;
    },

    showExitConfirm() {
      const hasAnswers = Object.keys(this.userAnswers).length > 0;

      if (hasAnswers) {
        this.showConfirmModal = true;
      } else {
        this.goBackNow();
      }
    },

    closeConfirmModal() {
      this.showConfirmModal = false;
    },

    confirmExit() {
      this.closeConfirmModal();
      this.goBackNow();
    },

    goBackNow() {
      this.playSound("click");
      this.clearTimer();
      this.$router.back();
    },
  },
};
</script>

<style scoped>
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