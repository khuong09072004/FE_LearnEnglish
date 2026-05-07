<template>
  <div class="min-h-screen bg-white">
    <div class="container">
      <!-- Header -->
      <div class="mb-8">
        <h2 class="section-title">Tiến trình học của bạn</h2>
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
              <button
                @click="goToVocabulary"
                class="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition"
              >
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
                  :style="{ width: progressData.vocabularyPercentage + '%' }"
                ></div>
              </div>
              <div class="text-right text-xs text-blue-600 font-semibold mt-1">
                {{ Math.round(progressData.vocabularyPercentage) }}%
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
              <button
                @click="goToExercise"
                class="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition"
              >
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
                  :style="{ width: progressData.exercisePercentage + '%' }"
                ></div>
              </div>
              <div class="text-right text-xs text-blue-600 font-semibold mt-1">
                {{ Math.round(progressData.exercisePercentage) }}%
              </div>
            </div>
          </div>
        </div>

        <!-- Study Time Chart (7 ngày thực từ API) -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
              <span class="mr-2">⏰</span>
              <h3 class="text-gray-800 font-semibold">Thời gian học trong 7 ngày qua</h3>
            </div>
            <span class="text-xs text-gray-400">{{ chartDateRange }}</span>
          </div>

<!-- Chart Area -->
<div class="mt-6">
  <div class="flex items-end justify-between space-x-2" style="height: 180px;">
    <div
      v-for="day in chartDays"
      :key="day.date"
      class="flex-1 flex flex-col items-center group relative h-full"
    >
      <!-- Cột wrapper chiếm full height, bar mọc từ dưới lên -->
      <div class="w-full flex-1 relative flex items-end rounded-t-lg overflow-visible bg-gray-100">
        <div
          class="w-full rounded-t-lg transition-all duration-700"
          :class="day.isToday ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-200 hover:bg-blue-300'"
          :style="{ height: (day.height > 0 ? day.height : 2) + '%' }"
        ></div>
        <!-- Tooltip -->
        <div
          class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center bg-gray-800 text-white text-xs px-2 py-1.5 rounded whitespace-nowrap z-10 gap-0.5"
        >
          <span>⏱ {{ day.minutesSpent }} phút</span>
          <span>📖 {{ day.vocabsLearned }} từ</span>
          <span>✅ {{ day.exercisesPassed }} bài</span>
        </div>
      </div>

      <!-- Label -->
      <div
        class="text-xs mt-2 text-center font-medium"
        :class="day.isToday ? 'text-blue-600' : 'text-gray-500'"
      >
        {{ day.label }}
      </div>
      <div v-if="day.isToday" class="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1"></div>
    </div>
  </div>
</div>

          <!-- Footer stats -->
          <div class="mt-8 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-sm text-gray-500 mb-1">Tổng phút học</div>
              <div class="text-2xl font-bold text-blue-600">{{ totalMinutesWeek }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500 mb-1">Từ vựng học được</div>
              <div class="text-2xl font-bold text-blue-600">{{ totalVocabsWeek }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500 mb-1">Bài tập hoàn thành</div>
              <div class="text-2xl font-bold text-blue-600">{{ totalExercisesWeek }}</div>
            </div>
          </div>
        </div>

        <!-- Topic Breakdown -->
        <div
          v-if="progressData.topicBreakdown && progressData.topicBreakdown.length"
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div class="flex items-center mb-6">
            <span class="mr-2">🎯</span>
            <h3 class="text-gray-800 font-semibold">Tiến độ theo chủ đề</h3>
          </div>
          <div class="space-y-4">
            <div
              v-for="topic in progressData.topicBreakdown"
              :key="topic.topicId"
              class="border border-gray-100 rounded-lg p-4 hover:border-blue-200 hover:shadow-sm transition"
            >
              <div class="flex items-center justify-between mb-2">
                <div>
                  <h4 class="font-semibold text-gray-800">{{ topic.topicName }}</h4>
                  <div class="text-xs text-gray-500 mt-0.5">
                    {{ topic.learnedVocabulary }}/{{ topic.totalVocabulary }} từ vựng
                  </div>
                </div>
                <div class="text-2xl font-bold text-blue-600">
                  {{ Math.round(topic.learnedPercentage) }}%
                </div>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  class="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
                  :style="{ width: topic.learnedPercentage + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
            <div class="text-sm text-blue-100 mb-1">Từ vựng đã học</div>
            <div class="text-3xl font-bold">{{ progressData.learnedVocabulary }}</div>
            <div class="text-xs text-blue-200 mt-1">/ {{ progressData.totalVocabulary }} từ</div>
          </div>
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
            <div class="text-sm text-green-100 mb-1">Bài tập hoàn thành</div>
            <div class="text-3xl font-bold">{{ progressData.completedExercises }}</div>
            <div class="text-xs text-green-200 mt-1">/ {{ progressData.totalExercises }} bài</div>
          </div>
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
            <div class="text-sm text-purple-100 mb-1">Tổng thời gian học</div>
            <div class="text-3xl font-bold">
              {{ progressData.totalStudyMinutes || 0 }}
              <span class="text-lg ml-1">phút</span>
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
import { getLevelProgressDetail } from '~/apis/level';

export default {
  name: 'ProgressPage',
  layout: 'pageLayout',
  data() {
    return {
      progressData: null,
      chartDays: [],
      loading: true,
      error: null,
    };
  },
  computed: {
    totalMinutesWeek() {
      return this.chartDays.reduce((sum, d) => sum + (d.minutesSpent || 0), 0);
    },
    totalVocabsWeek() {
      return this.chartDays.reduce((sum, d) => sum + (d.vocabsLearned || 0), 0);
    },
    totalExercisesWeek() {
      return this.chartDays.reduce((sum, d) => sum + (d.exercisesPassed || 0), 0);
    },
    chartDateRange() {
      if (!this.chartDays.length) return '';
      return `${this.chartDays[0].date} → ${this.chartDays[this.chartDays.length - 1].date}`;
    },
  },
  mounted() {
    this.fetchProgress();
  },
  methods: {
    async fetchProgress() {
      this.loading = true;
      this.error = null;
      try {
        const response = await getLevelProgressDetail();
        if (response?.status === 'success') {
          this.progressData = response.data;
          this.buildChartDays(response.data.studyHistoryLast7Days || []);
        } else {
          this.error = response?.message || 'Không thể tải dữ liệu';
        }
      } catch (err) {
        console.error('Error fetching progress:', err);
        this.error = 'Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.';
      } finally {
        this.loading = false;
      }
    },

    buildChartDays(history) {
  const today = new Date().toISOString().slice(0, 10);
  const maxMinutes = Math.max(...history.map(d => d.minutesSpent || 0), 1);

  this.chartDays = history.map(item => {
    const dateObj = new Date(item.date);
    const jsDay = dateObj.getDay();
    const labelMap = { 0: 'CN', 1: 'T2', 2: 'T3', 3: 'T4', 4: 'T5', 5: 'T6', 6: 'T7' };

    // Nếu có data thì tối thiểu 20%, không có thì 0
    const rawHeight = Math.round((item.minutesSpent / maxMinutes) * 100);
    const height = item.minutesSpent > 0 ? Math.max(20, rawHeight) : 0;

    return {
      date: item.date,
      label: labelMap[jsDay],
      isToday: item.date === today,
      height,
      minutesSpent: item.minutesSpent || 0,
      vocabsLearned: item.vocabsLearned || 0,
      exercisesPassed: item.exercisesPassed || 0,
    };
  });
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

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a5fa8;
  margin: 0 0 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 23px;
  background: #4a90d9;
  border-radius: 4px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .section-title { font-size: 20px; }
}
</style>