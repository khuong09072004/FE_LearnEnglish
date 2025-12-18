<template>
  <div class="min-h-screen bg-white px-4 py-6">
    <h1 class="text-2xl font-semibold mb-6 text-gray-800">
      Danh sách chủ đề 📚✨
      
    </h1>

    <div v-if="loading" class="text-center text-gray-600 text-lg">
      Đang tải danh sách chủ đề...
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="topic in topics"
        :key="topic.id"
        
        class="bg-cardBg border-2 border-cardBorder rounded-3xl p-6  shadow-sm hover:shadow-md transition-all"
      >
        <!-- Title -->
        <h2 class="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wide">
          {{ topic.name }}
        </h2>

        <!-- Vocabulary count -->
        <div class="flex items-center gap-1 text-sm text-gray-600 mb-4 p-1 bg-blue-200 rounded-full w-3/12 justify-center">
          <span >📘</span>
          <span class="text-gray-700 text-sm font-semibold">{{ topic.totalVocab }} Từ vựng</span>
        </div>

        <!-- Brand + Button -->
        <div class="flex items-center justify-between mt-2">
          <div class="flex items-center">
            <img src="../../assets/logoAdmin.jpg" alt="logo" class="w-8 h-8 rounded-full mr-2" />
            <span class="text-gray-700 text-sm font-semibold">Learn English</span>
          </div>

          <button class="bg-blue-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-400 transition" @click="goToTopic(topic.id)">
            HỌC NGAY
          </button>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import { getListTopic } from "../../apis/vocabularies";

export default {
  layout: "pageLayout",
  middleware: "auth",
  data() {
    return {
      topics: [],
      loading: false,
    };
  },
  async mounted() {
    this.loading = true;
  
    try {
      const res = await getListTopic();
     
      this.topics = res.data || [];
    } catch (err) {
      console.error("API fail:", err.response?.status, err.response?.data);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    goToTopic(id) {
      this.$router.push(`/vocabulary/vocabulary-detail/${id}`);
    },
  },
};
</script>

<style>
</style>