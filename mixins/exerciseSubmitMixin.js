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
    async submitExercise(isAutoSubmit = false) {
     

      // ✅ Bỏ qua check nếu auto-submit
      if (this.isSubmitting && !isAutoSubmit) {
        console.warn('⚠️ Already submitting');
        return;
      }

      // ✅ CHỈ confirm khi user bấm
      if (!isAutoSubmit && !this.allQuestionsAnswered) {
        const confirmed = confirm(
          "Bạn chưa trả lời hết câu hỏi. Vẫn nộp bài?"
        );
        if (!confirmed) return;
      }

      this.isSubmitting = true;
      this.clearTimer();
      
      if (this.playSound) {
        this.playSound("submit");
      }

      try {
        const answers = this.exerciseData.ExerciesItem.map((item) => ({
          id: item.id,
          answer: this.userAnswers[item.id] || "",
        }));

        

        const exerciseId = parseInt(this.$route.params.id);

        let response;

        if (this.isGrammarExercise) {
          response = await submitGrammarExercise(exerciseId, answers);
        } else if (this.isListeningExercise) {
          response = await submitListeningExercise(exerciseId, answers);
        } else if (this.isReadingExercise) {
          response = await submitReadingExercise(exerciseId, answers);
        } else if (this.isWritingExercise) {
          response = await submitWritingExercise(exerciseId, answers);
        } else {
          response = await submitVocabExercise(exerciseId, answers);
        }

        

        const resultData = response?.data?.data || response?.data || response;

        if (this.playSound) {
          this.playSound("complete");
        }

        // ✅ Chuyển trang
        this.$router.replace({
          path: `/exercise/result/${resultData.resultId}`,
          query: {
            data: JSON.stringify(resultData),
            auto: isAutoSubmit ? "1" : "0",
          },
        });

      } catch (error) {
        console.error('❌ Submit error:', error);
        
        this.isSubmitting = false;

        alert(
          isAutoSubmit 
            ? "Lỗi nộp bài tự động: " + (error.response?.data?.message || error.message)
            : "Lỗi nộp bài: " + (error.response?.data?.message || error.message)
        );

        // ✅ Restart timer nếu user submit tay
        if (!isAutoSubmit && this.timeLeft > 0) {
          this.startTimer(Math.ceil(this.timeLeft / 60));
        }
      }
    },
  },
};