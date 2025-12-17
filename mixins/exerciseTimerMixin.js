export default {
  data() {
    return {
      timeLeft: 0,
      timerInterval: null,
    };
  },

  computed: {
    formattedTime() {
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = this.timeLeft % 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    },
  },

  methods: {
    startTimer(duration) {
      this.timeLeft = duration * 60;
      this.clearTimer();

      this.timerInterval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;

          if (this.timeLeft === 10) {
            this.playSound("timeWarning");
          }

          if (this.timeLeft <= 10 && this.timeLeft > 0) {
            this.playSound("click");
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
      this.clearTimer();
      this.playSound("timeWarning");
      this.$toast.warning("Hết giờ làm bài!");
      this.submitExercise();
    },
  },
};