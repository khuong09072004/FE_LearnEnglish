<template>
  <div class="min-h-screen bg-gray-50 px-2 py-4 sm:px-4 sm:py-6">
    <!-- Mobile Tabs -->
    <div class="md:hidden mb-4 bg-white p-2 rounded-xl shadow-sm flex gap-2">
      <button
        @click="activeTab = 'list'"
        :class="[
          'flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition',
          activeTab === 'list'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-600'
        ]"
      >
        📘 Danh sách
      </button>
      <button
        @click="activeTab = 'detail'"
        :disabled="!selectedGrammar"
        :class="[
          'flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition',
          activeTab === 'detail'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-600',
          !selectedGrammar && 'opacity-50 cursor-not-allowed'
        ]"
      >
        📖 Chi tiết
      </button>
    </div>

    <div
      class="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 lg:gap-6"
      style="height: calc(100vh - 40px)"
    >
      <!-- LEFT SIDEBAR - Grammar List -->
      <div
        v-show="activeTab === 'list' || !isMobile"
        class="w-full md:w-1/3 bg-blue-200 p-3 sm:p-4 rounded-xl md:rounded-2xl border border-[#FFE5C7] overflow-y-auto"
      >
        <h2 class="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
          📘 Grammar List
        </h2>

        <div class="space-y-3 sm:space-y-4">
          <div
            v-for="item in grammars"
            :key="item.id"
            @click="selectGrammar(item.id)"
            :class="[
              'cursor-pointer p-3 sm:p-4 rounded-lg sm:rounded-xl border-4 transition',
              selectedId === item.id
                ? 'bg-white border-blue-400 shadow-md'
                : 'bg-white border-gray-200 hover:border-blue-300',
            ]"
          >
            <div class="flex items-center gap-2 text-blue-500 text-base sm:text-lg">
              📖
              <span class="font-semibold">{{ item.title }}</span>
            </div>
            <p class="text-gray-500 text-xs sm:text-sm mt-1">
              Ngày tạo: {{ convertDate(item.createdDate) || "25-05-2025" }}
            </p>
          </div>
        </div>
      </div>

      <!-- RIGHT CONTENT - Grammar Detail -->
      <div
        v-show="activeTab === 'detail' || !isMobile"
        class="w-full md:w-2/3 bg-white p-4 sm:p-6 rounded-xl md:rounded-2xl shadow-md border border-gray-200 overflow-y-auto"
      >
        <!-- Back button for mobile -->
        <button
          v-if="isMobile && activeTab === 'detail'"
          @click="activeTab = 'list'"
          class="mb-4 px-4 py-2 flex items-center gap-1   text-gray-600 rounded-lg font-semibold "
        >
        <a-icon type="left"  />
          Quay lại 
        </button>

        <div v-if="loading" class="text-center text-gray-500 py-8">
          Loading grammar...
        </div>

        <div v-else-if="selectedGrammar" class="animate-fadeIn">
          <h1 class="text-xl sm:text-2xl font-bold text-center mb-2 sm:mb-3">
            {{ selectedGrammar.title }}
          </h1>

          <p class="text-gray-600 text-center mb-4 sm:mb-6 text-sm sm:text-base">
            {{ selectedGrammar.description || "Ngữ pháp tiếng Anh" }}
          </p>

          <div class="leading-6 sm:leading-7 text-gray-700 space-y-4 sm:space-y-6">
            <div>
              <h3 class="font-semibold text-base sm:text-lg mb-2">1. Cấu trúc:</h3>
              <p class="pl-3 text-sm sm:text-base">{{ selectedGrammar.content }}</p>
            </div>

            <div>
              <h3 class="font-semibold text-base sm:text-lg mb-2">2. Ví dụ:</h3>
              <p class="pl-3 italic text-blue-600 text-sm sm:text-base">
                {{ selectedGrammar.example }}
              </p>
            </div>

            <div>
              <h3 class="font-semibold text-base sm:text-lg mb-2">3. Level:</h3>
              <p class="pl-3 text-sm sm:text-base">{{ selectedGrammar.level }}</p>
            </div>

            <div>
              <h3 class="font-semibold text-base sm:text-lg mb-2">4. Source:</h3>
              <p class="pl-3 text-sm sm:text-base">{{ selectedGrammar.source }}</p>
            </div>
          </div>
        </div>

        <div v-else class="text-gray-500 text-center py-8 text-sm sm:text-base">
          Chọn một mục ở bên trái để xem nội dung
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getListGrammar, getGrammarById } from "@/apis/grammar";

export default {
  layout: "pageLayout",
  middleware: "auth",
  data() {
    return {
      grammars: [],
      selectedGrammar: null,
      selectedId: null,
      loading: false,
      isMobile: false,
      activeTab: 'list', // 'list' hoặc 'detail'
    };
  },

  async mounted() {
    await this.fetchGrammarList();
    this.checkDevice();
    window.addEventListener('resize', this.handleResize);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },

  methods: {
    async fetchGrammarList() {
      try {
        const res = await getListGrammar();
        this.grammars = res.data;
        if (this.grammars.length > 0) {
          const firstId = this.grammars[0].id;
          this.selectGrammar(firstId);
        }
      } catch (err) {
        console.error("Lỗi load list grammar:", err);
      }
    },

    async selectGrammar(id) {
      this.selectedId = id;
      this.loading = true;

      try {
        const res = await getGrammarById(id);
        this.selectedGrammar = res.data;
        
        // Chuyển sang tab detail trên mobile khi chọn item
        if (this.isMobile) {
          this.activeTab = 'detail';
        }
      } catch (err) {
        console.error("Lỗi lấy grammar theo ID:", err);
      }

      this.loading = false;
    },

    convertDate(dateStr) {
      if (!dateStr) return null;
      const d = new Date(dateStr);
      return d.toLocaleDateString("vi-VN");
    },

    handleResize() {
      this.checkDevice();
    },

    checkDevice() {
      this.isMobile = window.innerWidth < 768;
      // Reset về tab list khi chuyển về desktop
      if (!this.isMobile) {
        this.activeTab = 'list';
      }
    },
  },
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>