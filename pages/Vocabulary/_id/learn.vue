<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-6"
  >
    <!-- Loading -->
    <div v-if="loading" class="text-3xl text-gray-600">Đang tải từ vựng...</div>

    <!-- Flashcard -->
    <div v-else-if="currentWord" class="max-w-3xl w-full">
      <!-- Progress -->
      <div class="mb-10 text-center">
        <div class="text-lg text-gray-600 mb-2">
          {{ currentIndex + 1 }} / {{ total }} • Còn lại: {{ remaining }}
        </div>
        <div class="bg-gray-300 rounded-full h-4 overflow-hidden shadow-inner">
          <div
            class="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-500 rounded-full"
            :style="{ width: progress + '%' }"
          />
        </div>
      </div>

      <!-- CARD 3D - CHỈ THÊM "perspective-1000" VÀO ĐÂY LÀ XONG -->
      <div
        class="relative bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer select-none perspective-1000"
        @click="flipped = true"
      >
        <div
          class="relative w-full h-96 preserve-3d transition-all duration-700"
          :class="{ 'rotate-y-180': flipped }"
        >
          <!-- Mặt trước -->
          <div
            class="absolute inset-0 flex flex-col items-center justify-center p-12 backface-hidden bg-white rounded-3xl"
          >
            <h1 class="text-4xl font-bold text-gray-800 mb-6">
              {{ currentWord.word }}
            </h1>
            <p class="text-2xl text-gray-500 mb-8">
              {{ currentWord.phonetic }}
            </p>
            <button
              @click.stop="speak(currentWord.word)"
              class="flex items-center gap-3 text-blue-600 hover:text-blue-800 border-none outline-none ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <a-icon type="sound" class="text-3xl" />
              <span class="text-xl">Nghe phát âm</span>
            </button>
            <p class="mt-10 text-gray-400 text-lg">Bấm để lật thẻ</p>
          </div>

          <!-- Mặt sau -->
          <div
            class="absolute inset-0 flex flex-col items-center justify-center p-12 backface-hidden bg-gradient-to-b from-indigo-50 to-blue-50 rounded-3xl rotate-y-180"
          >
            <p class="text-3xl font-bold text-indigo-800 mb-6">
              {{ currentWord.meaning }}
            </p>
            <p class="text-2xl text-gray-700 mb-8 italic">
              {{ currentWord.description || "— Không có mô tả —" }}
            </p>
            <div
              class="bg-gray-200 border-2 border-dashed rounded-xl w-80 h-80 flex items-center justify-center"
            >
              <div
                class="w-40 h-40 rounded-xl overflow-hidden shadow-lg bg-gray-100"
              >
                <img
                  :src="currentWord?.image_url || '/no-image.jpg'"
                  alt="Ảnh minh họa"
                  class="object-cover rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Nút đánh giá -->
      <div v-if="flipped" class="flex justify-center gap-10 mt-12">
        <button
          @click="markAndNext(false)"
          class="bg-red-500 hover:bg-red-600 text-white px-12 py-6 rounded-2xl text-2xl font-bold shadow-lg border-none outline-none ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          Chưa nhớ
        </button>
        <button
          @click="markAndNext(true)"
          class="bg-green-500 hover:bg-green-600 text-white px-16 py-6 rounded-2xl text-2xl font-bold shadow-lg border-none outline-none ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          Đã nhớ
        </button>
      </div>
    </div>

    <!-- Hoàn thành -->
    <!-- THÊM VÀO CUỐI TEMPLATE, TRƯỚC </div> cuối cùng -->
    <div v-if="showFireworks" class="fixed inset-0 pointer-events-none z-50">
      <fireworks />
      <fireworks style="animation-delay: 0.3s" />
      <fireworks style="animation-delay: 0.6s" />
      <fireworks style="animation-delay: 0.9s" />
    </div>

    <!-- Màn hình hoàn thành đẹp hơn -->
    <div v-if="finished" class="text-center py-20 relative z-10">
      <h1
        class="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6 animate-bounce"
      >
        Hoàn thành!
      </h1>
      <p class="text-3xl text-gray-700 mb-8">
        Bạn đã học xong
        <span class="font-bold text-indigo-600">{{ total }}</span> từ vựng!
      </p>
      <button
        @click="$router.push(`/vocabulary/vocabulary-detail/${topicId}`)"
        class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-5 rounded-full text-xl font-bold shadow-2xl transform hover:scale-110 transition"
      >
        Quay lại danh sách
      </button>
    </div>
  </div>
</template>

<script>
import {
  getListVocabularyInTopic,
  markVocabularyAsLearned,
} from "../../../apis/vocabularies";

export default {
  layout: "pageLayout",
  middleware: "auth",

  data() {
    return {
      sortedWords: [],
      currentIndex: 0,
      flipped: false,
      finished: false,
      loading: true,
      showFireworks: false
    };
  },

  computed: {
    topicId() {
      return this.$route.params.id;
    },
    currentWord() {
      return this.sortedWords[this.currentIndex] || null;
    },
    total() {
      return this.sortedWords.length;
    },
    remaining() {
      return Math.max(this.total - this.currentIndex - 1, 0);
    },
    progress() {
      if (this.total === 0) return 100;
      return ((this.currentIndex + (this.flipped ? 1 : 0)) / this.total) * 100;
    },
  },

  async mounted() {
    this.loading = true;
    try {
      const res = await getListVocabularyInTopic(this.topicId);
      const data = res?.data || res || [];

      this.sortedWords = data
        .filter((w) => w && w.word)
        .sort((a, b) => {
          if ((a.islearned || false) !== (b.islearned || false))
            return a.islearned ? 1 : -1;
          return (a.id || 0) - (b.id || 0);
        });

      if (this.sortedWords.length === 0) this.finished = true;
    } catch (err) {
      console.error("Lỗi:", err);
      this.$message?.error("Không tải được từ vựng");
    } finally {
      this.loading = false;
    }
  },

  methods: {
    speak(word) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(word);
      utter.lang = "en-US";
      utter.rate = 1;
      window.speechSynthesis.speak(utter);
    },

    async markAndNext(isLearned) {
      if (isLearned && this.currentWord && !this.currentWord.islearned) {
        try {
          await markVocabularyAsLearned(this.currentWord.id);
          this.currentWord.islearned = true;
          this.$message?.success("Đã đánh dấu là nhớ!");
        } catch (err) {
          this.$message?.error("Lỗi khi lưu");
        }
      }

      this.flipped = false;
      this.currentIndex++;

      // Nếu đã học hết → chuyển sang hoàn thành
      if (this.currentIndex >= this.sortedWords.length) {
        this.finished = true;
        this.$nextTick(() => {
          this.showFireworks = true; // bật pháo hoa
        });
      }
    },
  },

  beforeDestroy() {
    window.speechSynthesis.cancel();
  },
};
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}
.preserve-3d {
  transform-style: preserve-3d;
}
.backface-hidden {
  backface-visibility: hidden;
}
.rotate-y-180 {
  transform: rotateY(180deg);
}
.h-96 {
  height: 24rem;
}
fireworks {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  background: #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 30px 10px #fff;
  animation: boom 2s ease-out forwards;
}
@keyframes boom {
  0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(40); opacity: 0; }
}
</style>