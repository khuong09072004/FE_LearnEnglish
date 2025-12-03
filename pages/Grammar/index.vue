<template>
  <div class="min-h-screen bg-gray-50 px-4 py-6">
    <div
      class="max-w-6xl mx-auto flex gap-6"
      style="height: calc(100vh - 40px)"
    >
      <!-- LEFT SIDEBAR -->
      <div
        class="w-1/3 bg-blue-200 p-4 rounded-2xl border border-[#FFE5C7] overflow-y-auto"
      >
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          📘 Grammar List
        </h2>

        <div
          v-for="item in grammars"
          :key="item.id"
          @click="selectGrammar(item.id)"
          :class="[
            'cursor-pointer  mb-4 p-4 rounded-xl border-4 transition',
            selectedId === item.id
              ? 'bg-white border-4 border-blue-400 shadow-md'
              : 'bg-white border-gray-200 hover:border-blue-300',
          ]"
        >
          <div class="flex items-center gap-2 text-blue-500 text-lg">
            📖
            <span class="font-semibold">{{ item.title }}</span>
          </div>
          <p class="text-gray-500 text-sm mt-1">
            Ngày tạo: {{ convertDate(item.createdDate) || "25-05-2025" }}
          </p>
        </div>
      </div>

      <!-- LEFT SIDEBAR -->
      <div
        class="w-2/3 bg-white p-6 rounded-2xl shadow-md border border-gray-200 overflow-y-auto"
      >
        <div v-if="loading" class="text-center text-gray-500">
          Loading grammar...
        </div>

        <div v-else-if="selectedGrammar">
          <h1 class="text-2xl font-bold text-center mb-3">
            {{ selectedGrammar.title }}
          </h1>

          <p class="text-gray-600 text-center mb-6">
            {{ selectedGrammar.description || "Ngữ pháp tiếng Anh" }}
          </p>

          <div class="leading-7 text-gray-700">
            <h3 class="font-semibold">1. Cấu trúc:</h3>
            <p class="pl-3">{{ selectedGrammar.content }}</p>

            <h3 class="font-semibold mt-4">2. Ví dụ:</h3>
            <p class="pl-3 italic text-blue-600">
              {{ selectedGrammar.example }}
            </p>

            <h3 class="font-semibold mt-4">3. Level:</h3>
            <p class="pl-3">{{ selectedGrammar.level }}</p>

            <h3 class="font-semibold mt-4">4. Source:</h3>
            <p class="pl-3">{{ selectedGrammar.source }}</p>
          </div>
        </div>

        <div v-else class="text-gray-500 text-center">
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
    };
  },

  async mounted() {
    await this.fetchGrammarList();
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
  },
};
</script>
