<template>
  <div class="page">
    <div class="game-container">
      <!-- HEADER -->
      <header class="header">
        <button class="back-btn" @click="goBack" v-if="index > 0">⬅</button>
        <div class="logo">ENG-LEARN</div>
        
      </header>

      <!-- PROGRESS BAR -->
      <div class="progress-wrapper">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </div>

      <!-- QUESTION -->
      <div class="question-box">
        <h2 class="title">{{ current.question }}</h2>

        <!-- AUDIO -->
        <audio v-if="current.audio" controls class="audio">
          <source :src="current.audio" type="audio/mp3" />
        </audio>

        <!-- IMAGE -->
        <img v-if="current.image" :src="current.image" class="img" />

        <!-- MULTIPLE CHOICE -->
        <div v-if="current.type === 'choice'" class="options">
          <div
            v-for="(o, i) in current.options"
            :key="i"
            class="option"
            :class="optionClass(i)"
            @click="choose(i)"
          >
            {{ o }}
          </div>
        </div>

        <!-- DRAG & DROP (C) -->
        <div v-if="current.type === 'drag'" class="drag-area">
          <div class="drop-zone">{{ dragAnswer }}</div>

          <div class="drag-options">
            <div
              v-for="(o, i) in shuffledWords"
              :key="i"
              class="drag-item"
              @click="dragSelect(o)"
            >
              {{ o }}
            </div>
          </div>
        </div>

        <!-- ORDER WORDS (C) -->
        <div v-if="current.type === 'order'" class="order-area">
          <div class="ordered">
            <span
              v-for="(w, i) in orderedWords"
              :key="i"
              class="word"
              @click="removeOrdered(i)"
            >
              {{ w }}
            </span>
          </div>

          <div class="order-options">
            <span
              v-for="(w, i) in availableWords"
              :key="i"
              class="word-option"
              @click="addOrdered(w)"
            >
              {{ w }}
            </span>
          </div>
        </div>
      </div>

      <!-- FOOT -->
      <div class="bottom">
        <button class="next-btn" @click="onMainBtn" :disabled="!canCheck">
          {{ buttonText }}
        </button>
      </div>

      <!-- RESULT POPUP -->
      <div
        v-if="checked"
        class="feedback"
        :class="isCorrect ? 'fb-correct' : 'fb-wrong'"
      >
        {{ isCorrect ? "Chính xác!" : "Sai rồi, thử lại nhé!" }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      index: 0,
      hearts: 5,
      xp: 0,

      selected: null,
      dragAnswer: "",
      orderedWords: [],
      availableWords: [],

      checked: false,
      isCorrect: null,

      questions: [
        {
          type: "choice",
          question: "Nghĩa của 'coffee'?",
          options: ["cà phê", "trà", "sữa"],
          answer: 0,
        },
        {
          type: "drag",
          question: "Kéo từ để ghép thành nghĩa: 'quả táo'",
          words: ["apple", "orange", "banana"],
          correct: "apple",
        },
        {
          type: "order",
          question: "Sắp xếp thành câu: I / like / cats",
          correct: ["I", "like", "cats"],
        },
        {
          type: "choice",
          question: "Chọn nghĩa của 'house'",
          options: ["ngôi nhà", "cái xe", "cửa"],
          answer: 0,
        },
      ],
    };
  },

  computed: {
    current() {
      return this.questions[this.index];
    },

    progress() {
      return ((this.index + 1) / this.questions.length) * 100;
    },

    shuffledWords() {
      return this.current.words ? [...this.current.words] : [];
    },

    canCheck() {
      if (this.current.type === "choice") return this.selected !== null;
      if (this.current.type === "drag") return this.dragAnswer !== "";
      if (this.current.type === "order")
        return this.orderedWords.length === this.current.correct.length;
      return false;
    },

    buttonText() {
      return this.checked ? "TIẾP TỤC" : "KIỂM TRA";
    },
  },

  methods: {
    /* ==== OPTION CLASS FIX LỖI ==== */
    optionClass(i) {
      if (this.current.type !== "choice") return "";

      if (!this.checked) {
        return this.selected === i ? "selected" : "";
      }

      if (i === this.current.answer) return "correct";
      if (i === this.selected && !this.isCorrect) return "wrong";
      return "";
    },
    goBack() {
  if (this.index === 0) return;

  this.index--;
  this.resetState();
},


    choose(i) {
      if (this.checked) return;
      this.selected = i;
    },

    dragSelect(word) {
      if (this.checked) return;
      this.dragAnswer = word;
    },

    addOrdered(word) {
      if (this.checked) return;
      this.availableWords = this.availableWords.filter((w) => w !== word);
      this.orderedWords.push(word);
    },

    removeOrdered(i) {
      if (this.checked) return;
      const w = this.orderedWords[i];
      this.orderedWords.splice(i, 1);
      this.availableWords.push(w);
    },

    checkAnswer() {
      let ok = false;

      if (this.current.type === "choice") {
        ok = this.selected === this.current.answer;
      } else if (this.current.type === "drag") {
        ok = this.dragAnswer === this.current.correct;
      } else if (this.current.type === "order") {
        ok =
          JSON.stringify(this.orderedWords) ===
          JSON.stringify(this.current.correct);
      }

      this.checked = true;
      this.isCorrect = ok;

      if (ok) this.xp += 5;
      else this.hearts--;
    },

    nextQuestion() {
      if (this.index < this.questions.length - 1) {
        this.index++;
        this.resetState();
      }
    },

    onMainBtn() {
      if (!this.checked) {
        this.checkAnswer();
      } else {
        // đúng → sang câu mới
        if (this.isCorrect) {
          this.nextQuestion();
        } else {
          // sai → reset feedback, cho làm tiếp
          this.checked = false;
          this.isCorrect = null;
        }
      }
    },

    resetState() {
      this.selected = null;
      this.dragAnswer = "";
      this.orderedWords = [];
      this.availableWords = [...(this.current.correct || [])];

      this.checked = false;
      this.isCorrect = null;
    },
  },

  mounted() {
    if (this.current.type === "order") {
      this.availableWords = [...this.current.correct];
    }
  },
};
</script>

<style>
.page {
  background: #f3f7ff;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding-top: 40px;
  font-family: "Segoe UI", sans-serif;
}
.selected {
  background: #eaf3ff !important;
  border-color: #1e88e5 !important;
}

/* GAME CONTAINER */
.game-container {
  width: 680px;
  height: 600px;
  background: white;
  padding: 20px 22px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #1e88e5;
}

.stats {
  font-size: 16px;
}

/* PROGRESS BAR */
.progress-wrapper {
  background: #e1ecff;
  height: 8px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.progress {
  height: 8px;
  background: #1e88e5;
  border-radius: 5px;
  transition: 0.3s;
}

/* QUESTION BOX */
.question-box {
  background: #fff;
  border: 2px solid #e3edff;
  padding: 18px;
  border-radius: 15px;
}

.title {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
}

.img {
  width: 140px;
  display: block;
  margin: 10px auto;
}

.audio {
  margin: 10px auto;
  display: block;
}

/* MULTIPLE CHOICE */
.options {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option {
  padding: 12px;
  border-radius: 12px;
  border: 2px solid #9dc6ff;
  cursor: pointer;
  background: #fff;
  text-align: center;
  transition: 0.2s;
  font-size: 16px;
}

.option:hover {
  background: #eaf3ff;
}

.correct {
  background: #c8e6c9 !important;
  border-color: #4caf50 !important;
}

.wrong {
  background: #ffcdd2 !important;
  border-color: #d32f2f !important;
}

/* DRAG */
.drag-area {
  margin-top: 20px;
}

.drop-zone {
  min-height: 40px;
  background: #eaf3ff;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 12px;
  text-align: center;
  font-size: 16px;
}

.drag-item {
  background: #fff;
  padding: 8px 12px;
  border: 2px solid #9dc6ff;
  border-radius: 8px;
  cursor: pointer;
  display: inline-block;
  margin-right: 10px;
}

/* ORDER */
.order-area {
  margin-top: 20px;
}

.ordered .word,
.order-options .word-option {
  background: white;
  padding: 8px 12px;
  border-radius: 8px;
  border: 2px solid #64b5f6;
  margin: 4px;
  display: inline-block;
  cursor: pointer;
}

/* Bottom */
.bottom {
  margin-top: 20px;
  text-align: center;
}

.next-btn {
  width: 80%;
  padding: 12px;
  background: #1e88e5;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
}

.next-btn:hover {
  background: #1565c0;
}

/* RESULT POPUP */
.result {
  width: 300px;
  height: 300px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
}

.result .box {
  background: white;
  padding: 30px;
  border-radius: 18px;
  font-size: 22px;
}
.feedback {
  margin-top: 10px;
  padding: 10px;
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
}

.fb-correct {
  background: #c8e6c9;
  border: 2px solid #4caf50;
}

.fb-wrong {
  background: #ffcdd2;
  border: 2px solid #d32f2f;
}
</style>
