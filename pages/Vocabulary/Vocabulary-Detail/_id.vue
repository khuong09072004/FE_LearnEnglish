<template>
  <div class="min-h-screen bg-gray-50 px-4 py-6">
    <!-- Header thống kê -->
    <div class="bg-blue-200 p-6 rounded-xl items-center mb-6 shadow">
      <div class="flex justify-between space-x-4 items-end mb-12">
        <div class="flex gap-4 items-center w-15">
          <div class="bg-white p-2 rounded-lg shadow text-yellow-500 text-center">
            <img src="../../../static/book.png" alt="Icon" class="w-8 h-8 mx-auto" />
          </div>
          <div>
            <p class="text-lg font-semibold">Kết quả học tập hiện tại</p>
            <p class="text-base">{{ stats.total || 0 }} từ vựng</p>
          </div>
        </div>
        <div>
          <p class="text-base">Số thẻ chưa học: {{ stats.unlearned || 0 }}</p>
        </div>
        <div>
          <p class="text-base">Số từ đã học: {{ stats.learned || 0 }}</p>
        </div>
      </div>
      <div class="flex justify-center">
        <button
          class="bg-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-600 transition flex justify-center border-none"
          @click="$router.push(`/Vocabulary/${topicId}/learn`)"
        >
          HỌC NGAY
        </button>
      </div>
    </div>

    <!-- Search bar -->
    <div class="mb-4">
      <input
        type="text"
        v-model="search"
        placeholder="Tìm kiếm từ hoặc nghĩa của từ"
        class="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
    </div>

    <!-- Danh sách từ -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div
        v-for="word in filteredWords"
        :key="word.id"
        class="bg-white rounded-xl p-4 border-2 border-blue-200 shadow-[0_10px_0_0_#60a5fa] hover:shadow-[0_16px_0_0_#3b82f6] hover:border-blue-400 transition-all duration-300"
      >
        <div>
          <div class="flex items-center justify-between space-x-4 pb-5">
            <p class="text-sm text-gray-400">
              {{ word.islearned ? "Đã học" : "Chưa học" }}
            </p>
            <button
              @click.stop="speak(word.word, word.id)"
              class="w-8 h-8 bg-blue-300 rounded-full transform hover:scale-110 border-none outline-none ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              :class="{ 'animate-pulse': speakingId === word.id }"
            >
              <a-icon type="sound" class="text-white text-xl" />
            </button>
          </div>
          <div class="flex items-center justify-between space-x-4">
            <p class="font-semibold text-gray-800">
              {{ word.word }} - {{ word.meaning }}
            </p>
            <img
              :src="validImageUrl(word.image_url)"
              @error="$event.target.src = '/no-image.jpg'"
              alt="Ảnh minh họa"
              class="w-20 h-20 object-cover rounded-lg border border-gray-200"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getListStatisticsVocabularyInTopic,
  getListVocabularyInTopic,
} from "@/apis/vocabularies";

export default {
  layout: "pageLayout",
  middleware: "auth",

  data() {
    return {
      stats: {},
      words: [],
      search: "",
      speakingId: null,
    };
  },

  computed: {
    filteredWords() {
      if (!this.search) return this.words;
      return this.words.filter(
        (w) =>
          w.word.toLowerCase().includes(this.search.toLowerCase()) ||
          w.meaning.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },

  methods: {
    validImageUrl(url) {
      // Nếu url null, undefined, chuỗi rỗng, hoặc không bắt đầu bằng http → dùng ảnh mặc định
      if (!url || url.trim() === "" || url === "null" || url.includes("null")) {
        return "/no-image.jpg";
      }
      return url;
    },
    // Hàm phát âm chính – siêu mượt
    speak(word, id) {
      // Dừng phát âm cũ nếu đang nói
      window.speechSynthesis.cancel();
      // Tạo giọng nói mới
      const utter = new SpeechSynthesisUtterance(word);
      // Cấu hình giọng (rất quan trọng để nghe tự nhiên)
      utter.lang = "en-US"; // Anh Mỹ (tự nhiên nhất)
      // utter.lang = 'en-GB';        // Anh Anh (nếu muốn)
      utter.rate = 1; // tốc độ nói (0.5 - 2, mặc định 1)
      utter.pitch = 1; // độ cao giọng (0 - 2)
      utter.volume = 1; // âm lượng (0 - 1)

      // Highlight từ đang nói
      this.speakingId = id;

      // Khi kết thúc nói → bỏ highlight
      utter.onend = () => {
        this.speakingId = null;
      };

      // Bắt lỗi (một số trình duyệt chặn nếu không có tương tác người dùng)
      utter.onerror = (event) => {
        console.warn("Lỗi phát âm:", event.error);
        this.speakingId = null;
      };

      // Nói thôi nào!
      window.speechSynthesis.speak(utter);
    },

    // Bonus: phát âm lại từ đang highlight khi nhấn nút loa ở header (tuỳ chọn)
    stopSpeaking() {
      window.speechSynthesis.cancel();
      this.speakingId = null;
    },
  },

  // Dừng phát âm khi rời trang (rất quan trọng, tránh bug)
  beforeDestroy() {
    window.speechSynthesis.cancel();
  },

  async mounted() {
    this.topicId = this.$route.params.id;

    try {
      const [statsRes, wordsRes] = await Promise.all([
        getListStatisticsVocabularyInTopic(this.topicId),
        getListVocabularyInTopic(this.topicId),
      ]);
      this.stats = statsRes.data;
      this.words = wordsRes.data;
    } catch (err) {
      console.error(err);
    }
  },
};
</script>
