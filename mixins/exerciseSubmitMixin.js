import {
  submitVocabExercise,
  submitGrammarExercise,
  submitListeningExercise,
  submitReadingExercise,
  submitWritingExercise,
} from "../apis/exercise";

export default {
  data() {
    return {
      isSubmitting: false,
    };
  },

  computed: {
    isGrammarExercise() {
      return this.exerciseData?.type?.includes("GRAMMAR");
    },

    isListeningExercise() {
      return this.exerciseData?.type?.includes("LISTEN");
    },

    isVocabExercise() {
      return this.exerciseData?.type?.includes("VOCAB");
    },
    isReadingExercise() {
      return this.exerciseData?.type?.includes("READ");
    },
    isWritingExercise() {
      return this.exerciseData?.type?.includes("WRITE");
    },
  },

  methods: {
    async submitExercise() {
      if (this.isSubmitting) {
        console.log("⏳ Already submitting...");
        return;
      }

      if (!this.allQuestionsAnswered) {
        const confirmed = confirm("Bạn chưa trả lời hết câu hỏi. Vẫn nộp bài?");
        if (!confirmed) return;
      }

      this.isSubmitting = true;
      this.clearTimer();
      this.playSound("submit");

      try {
        const answers = this.exerciseData.ExerciesItem.map((item) => ({
          id: item.id,
          answer: this.userAnswers[item.id] || "",
        }));

        const exerciseId = parseInt(this.$route.params.id);

        console.log("📤 Submitting exercise:", { exerciseId, answers });

        let response;

        if (this.isGrammarExercise) {
          console.log("📚 Submitting Grammar Exercise...");
          response = await submitGrammarExercise(exerciseId, answers);
        } else if (this.isListeningExercise) {
          console.log("🎧 Submitting Listening Exercise...");
          response = await submitListeningExercise(exerciseId, answers);
        } else if (this.isReadingExercise) {
          console.log("📖 Submitting Reading Exercise...");
          response = await submitReadingExercise(exerciseId, answers);
        } else if (this.isWritingExercise) {
          console.log("📝 Submitting Writing Exercise...");
          response = await submitWritingExercise(exerciseId, answers);
        } else {
          console.log("📖 Submitting Vocabulary Exercise...");
          response = await submitVocabExercise(exerciseId, answers);
        }

        console.log("✅ Submit response:", response);

        const resultData = response?.data?.data || response?.data || response;

        console.log("📊 Result data:", resultData);

        this.playSound("complete");

        this.$router.push({
          path: `/exercise/result/${resultData.resultId}`,
          query: {
            data: JSON.stringify(resultData),
          },
        });

        this.$toast.success("Nộp bài thành công!");
      } catch (error) {
        console.error("❌ Error submitting exercise:", error);

        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Có lỗi xảy ra khi nộp bài";

        this.$toast.error(errorMessage);

        this.isSubmitting = false;

        if (this.timeLeft > 0) {
          this.startTimer(Math.ceil(this.timeLeft / 60));
        }
      }
    },
  },
};
