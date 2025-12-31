export default {
  data() {
    return {
      timeLeft: 0,
      timerInterval: null,
      isTimeUp: false,
      startTime: null, // Thời điểm bắt đầu làm bài
      totalTimeLimit: 0, // Tổng thời gian được phép (giây)
    };
  },

  computed: {
    formattedTime() {
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = this.timeLeft % 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    },
    // Tính thời gian đã làm bài (giây)
    timeSpentInSeconds() {
      if (!this.startTime) return 0;
      
      // Nếu hết giờ thì return totalTimeLimit
      if (this.isTimeUp && this.totalTimeLimit > 0) {
        return this.totalTimeLimit;
      }
      
      // Nếu còn thời gian thì tính từ lúc bắt đầu
      const now = Date.now();
      const elapsed = Math.floor((now - this.startTime) / 1000);
      return elapsed;
    },
  },

  methods: {
    startTimer(duration) {
      this.clearTimer();
      this.timeLeft = duration * 60;
      this.totalTimeLimit = duration * 60; // Lưu tổng thời gian
      this.startTime = Date.now(); // Lưu thời điểm bắt đầu
      this.isTimeUp = false;

      this.timerInterval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;

          if (this.timeLeft === 10 && !this.isTimeUp) {
            this.playSound && this.playSound("timeWarning");
          }
        } else {
          this.timeExpired();
        }
      }, 1000);
    },

    clearTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },

    timeExpired() {
      
      
      if (this.isTimeUp) return;
      this.isTimeUp = true;

      this.clearTimer();
      
      if (this.playSound) {
        this.playSound("timeWarning");
      }

      // Auto fill empty answers
      if (this.exerciseData && this.exerciseData.ExerciesItem) {
        this.exerciseData.ExerciesItem.forEach((item) => {
          if (!this.userAnswers[item.id]) {
            this.$set(this.userAnswers, item.id, "");
          }
        });
      }

      
      
      // ✅ Gọi submitExercise
      this.$nextTick(() => {
        if (typeof this.submitExercise === 'function') {
          this.submitExercise(true);
        } else {
          console.error('❌ submitExercise not found!');
        }
      });
    },
  },
};