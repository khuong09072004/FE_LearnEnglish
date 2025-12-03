<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center py-10 px-4"
  >
    <h1 class="text-3xl font-bold text-indigo-700 mb-6">
      {{ currentLesson.skill }} - Bài {{ currentLesson.id }}
    </h1>

    <div v-if="currentQuestion < questions.length" class="w-full max-w-xl">
      <!-- Timer -->
      <div v-if="timeLeft > 0" class="mb-4 text-gray-700 font-medium text-right">
        ⏱ Thời gian còn lại: {{ timeLeft }} giây
      </div>

      <!-- Câu hỏi -->
      <div class="bg-white shadow-xl rounded-2xl p-8 text-center">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">
          {{ questions[currentQuestion].word }}
        </h2>

        <img
          v-if="questions[currentQuestion].image"
          :src="questions[currentQuestion].image"
          alt=""
          class="w-40 h-40 mx-auto mb-6 rounded-lg shadow"
        />

        <!-- Nút lựa chọn -->
        <div class="grid grid-cols-2 gap-4">
          <button
            v-for="(opt, idx) in questions[currentQuestion].options"
            :key="idx"
            @click="chooseAnswer(opt)"
            :class="[
              'font-medium py-3 rounded-lg transition',
              chosenAnswer
                ? opt === questions[currentQuestion].correct
                  ? 'bg-green-300 text-white'
                  : opt === chosenAnswer
                  ? 'bg-red-300 text-white'
                  : 'bg-gray-100 text-gray-600'
                : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700',
            ]"
            :disabled="!!chosenAnswer"
          >
            {{ opt }}
          </button>
        </div>
      </div>
    </div>

    <!-- Kết quả -->
    <div v-else class="text-center bg-white shadow-lg rounded-2xl p-8 max-w-lg">
      <h2 class="text-2xl font-bold text-indigo-700 mb-4">Hoàn thành! 🎉</h2>
      <p class="text-gray-700 mb-6">
        Bạn trả lời đúng <b>{{ score }}</b> / {{ questions.length }} câu
      </p>
      <button
        @click="goHome"
        class="bg-indigo-600 text-white px-6 py-3 rounded-xl shadow hover:bg-indigo-700 transition"
      >
        ← Quay lại trang chủ
      </button>
    </div>
  </div>
</template>

<script>
import questionBank from "../../data/questions";

export default {
  data() {
    return {
      currentLesson: {},
      questions: [],
      currentQuestion: 0,
      score: 0,
      chosenAnswer: null,
      timer: null,
      timeLeft: 60,
    };
  },
  mounted() {
    const lessonId = Number(this.$route.query.lessonId);
    this.currentLesson =
      questionBank.find((q) => q.id === lessonId) || {};
    this.questions = [...(this.currentLesson.questions || [])].sort(
      () => Math.random() - 0.5
    );
    this.startTimer();
  },
  methods: {
    startTimer() {
      if (this.timer) clearInterval(this.timer);
      this.timeLeft = 60;
      this.timer = setInterval(() => {
        this.timeLeft--;
        if (this.timeLeft <= 0) {
          this.chooseAnswer(null); // Không chọn -> chuyển câu
        }
      }, 1000);
    },
    chooseAnswer(opt) {
      this.chosenAnswer = opt;
      if (opt && opt === this.questions[this.currentQuestion].correct) {
        this.score++;
      }

      // Dừng timer khi đã chọn
      clearInterval(this.timer);

      // Chuyển câu tiếp theo sau 0.7s
      setTimeout(() => {
        this.currentQuestion++;
        this.chosenAnswer = null;
        if (this.currentQuestion < this.questions.length) {
          this.startTimer();
        }
      }, 700);
    },
    goHome() {
      clearInterval(this.timer);
      this.$router.push("/demo");
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>
