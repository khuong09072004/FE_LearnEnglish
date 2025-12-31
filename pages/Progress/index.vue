<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-6 py-8 max-w-5xl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">
          Tiến trình học tập
        </h1>
        <div class="flex items-center text-gray-600 text-sm">
          <span class="mr-2">📊</span>
          <span>Kết quả học</span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>

      <!-- Content -->
      <div v-else-if="progressData" class="space-y-6">
        <!-- Progress Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Vocabulary Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-gray-800 font-semibold mb-4">Từ vựng</h3>
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-3">
                <div class="text-4xl">🐯</div>
                <div class="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium">
                  Học từ vựng mới
                </div>
              </div>
              <button @click="goToVocabulary" class="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition">
                <a-icon type="right" />
              </button>
            </div>
            <div class="mt-4">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm text-gray-600">Tiến độ</span>
                <span class="text-sm font-semibold text-gray-800">
                  {{ progressData.learnedVocabulary }}/{{ progressData.totalVocabulary }} 
                </span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-3 overflow-hidden border border-gray-300">
                <div
                  class="bg-gradient-to-r from-blue-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                  :style="{ width: vocabularyPercent + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Exercises Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-gray-800 font-semibold mb-4">Bài tập</h3>
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-3">
                <div class="text-4xl">🐯</div>
                <div class="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium">
                  Làm bài tập nhé!
                </div>
              </div>
              <button @click="goToExercise" class="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition">
                <a-icon type="right" />
              </button>
            </div>
            <div class="mt-4">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm text-gray-600">Tiến độ</span>
                <span class="text-sm font-semibold text-gray-800">
                  {{ progressData.completedExercises }}/{{ progressData.totalExercises }} 
                </span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-3 overflow-hidden border border-gray-300">
                <div
                  class="bg-gradient-to-r from-blue-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                  :style="{ width: exercisePercent + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Study Time Chart -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center mb-6">
            <span class="mr-2">⏰</span>
            <h3 class="text-gray-800 font-semibold">Thời gian học</h3>
          </div>
          
          <!-- Chart Area -->
          <div class="mt-6">
            <div class="flex items-end justify-between h-48 space-x-2">
              <div
                v-for="day in weekDays"
                :key="day.label"
                class="flex-1 flex flex-col items-center"
              >
                <div class="w-full bg-gray-100 rounded-t-lg relative flex-1 flex items-end">
                  <div
                    class="w-full bg-blue-400 rounded-t-lg transition-all duration-500 hover:bg-blue-500"
                    :style="{ height: day.height + '%' }"
                  ></div>
                </div>
                <div class="text-xs text-gray-500 mt-2 text-center">{{ day.label }}</div>
              </div>
            </div>
          </div>

          <!-- Total Study Time -->
          <div class="mt-8 pt-6 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Tổng thời gian học trong tuần</span>
              <span class="text-2xl font-bold text-blue-600">{{ formatStudyTime }} phút</span>
            </div>
          </div>
        </div>

        <!-- Summary Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
            <div class="text-sm text-blue-100 mb-1">Từ vựng đã học</div>
            <div class="text-3xl font-bold">
              {{ progressData.learnedVocabulary }}
            </div>
          </div>
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
            <div class="text-sm text-blue-100 mb-1">Bài tập hoàn thành</div>
            <div class="text-3xl font-bold">
              {{ progressData.completedExercises }}
            </div>
          </div>
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
            <div class="text-sm text-blue-100 mb-1">Tổng thời gian học</div>
            <div class="text-3xl font-bold">
              {{ formatStudyTime }}<span class="text-lg ml-1">phút</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
        <p class="text-red-600">{{ error }}</p>
        <button
          @click="fetchProgress"
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Thử lại
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { trackLearningProgress } from '~/apis/level';

export default {
  name: 'ProgressPage',
  layout: 'pageLayout',
  data() {
    return {
      progressData: null,
      loading: true,
      error: null,
      weekDays: [
        { label: 'T2', height: 0 },
        { label: 'T3', height: 0 },
        { label: 'T4', height: 0 },
        { label: 'T5', height: 0 },
        { label: 'T6', height: 0 },
        { label: 'T7', height: 0 },
        { label: 'CN', height: 0 },
      ],
    };
  },
  computed: {
    vocabularyPercent() {
      if (!this.progressData || this.progressData.totalVocabulary === 0) {
        return 0;
      }
      return Math.round(
        (this.progressData.learnedVocabulary / this.progressData.totalVocabulary) * 100
      );
    },
    exercisePercent() {
      if (!this.progressData || this.progressData.totalExercises === 0) {
        return 0;
      }
      return Math.round(
        (this.progressData.completedExercises / this.progressData.totalExercises) * 100
      );
    },
    formatStudyTime() {
      if (!this.progressData) return 0;
      return this.progressData.totalStudyMinutes || 0;
    },
  },
  mounted() {
    this.fetchProgress();
    this.generateChartData();
  },
  methods: {
    async fetchProgress() {
      this.loading = true;
      this.error = null;
      try {
        const response = await trackLearningProgress();
        if (response.status === 'success') {
          this.progressData = response.data;
        } else {
          this.error = response.message || 'Không thể tải dữ liệu';
        }
      } catch (err) {
        console.error('Error fetching progress:', err);
        this.error = 'Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.';
      } finally {
        this.loading = false;
      }
    },
    generateChartData() {
      // Generate random chart data for demonstration
      // In real app, this should come from API
      this.weekDays = this.weekDays.map((day) => ({
        ...day,
        height: Math.random() * 80 + 10, // Random height between 10-90%
      }));
    },
    goToVocabulary() {
      this.$router.push('/Vocabulary');
    },
    goToExercise() {
      this.$router.push('/Exercise');
    },
  },
};
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
