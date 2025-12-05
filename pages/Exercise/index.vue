<template>
  <div class="min-h-screen">
    <div class="flex flex-col lg:flex-row h-screen">
      <!-- Left Side - Image -->
      <div class="lg:w-5/12 py-8 pl-3 overflow-hidden flex items-center justify-center">
        <img
          src="../../assets/background-exercise.png"
          alt="Exam Background"
          class="inset-0 w-full h-full rounded-lg object-cover"
        />
      </div>

      <!-- Right Side - Topics List -->
      <div class="flex-1 bg-white overflow-y-auto p-6 lg:p-8">
        <div class="max-w-2xl mx-auto">
          <!-- Breadcrumb -->
          <div v-if="activeTopic || activeCategory" class="mb-4 text-sm text-gray-600">
            <span class="hover:text-blue-500 cursor-pointer" @click="resetAll">Home</span>
            <span v-if="activeTopic"> / {{ getTopicName(activeTopic) }}</span>
            <span v-if="activeCategory"> / {{ activeCategory }}</span>
          </div>

          <!-- Loading Topics -->
          <div v-if="loadingStates.topics" class="space-y-3">
            <div v-for="i in 3" :key="i" class="animate-pulse">
              <div class="h-16 bg-gray-200 rounded-lg"></div>
            </div>
          </div>

          <!-- Topics List -->
          <div v-else-if="topics.length" class="space-y-3">
            <div v-for="topic in topics" :key="topic.id" class="mb-3">
              <!-- Topic Header -->
              <div
                class="p-3 border-2 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md"
                :class="
                  activeTopic === topic.id
                    ? 'bg-blue-50 border-blue-500 shadow-md'
                    : 'bg-white border-gray-300 hover:border-blue-400'
                "
                @click="toggleTopic(topic.id)"
              >
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-3">
                    <span class="text-2xl">📚</span>
                    <span class="text-lg font-semibold text-gray-800">
                      {{ topic.name }}
                    </span>
                  </div>

                  <svg
                    class="w-6 h-6 text-gray-400 transition-all duration-300"
                    :class="activeTopic === topic.id ? 'rotate-180 text-blue-500' : ''"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <!-- Categories Section -->
              <transition name="slide-fade">
                <div v-if="activeTopic === topic.id" class="ml-6 mt-3">
                  <!-- Loading Categories -->
                  <div v-if="loadingStates.categories" class="space-y-2">
                    <div v-for="i in 2" :key="i" class="animate-pulse">
                      <div class="h-12 bg-gray-100 rounded-lg"></div>
                    </div>
                  </div>

                  <!-- Categories List -->
                  <div v-else-if="categories.length" class="space-y-2">
                    <div v-for="category in categories" :key="category" class="mb-2">
                      <!-- Category Header -->
                      <div
                        class="p-3 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-sm"
                        :class="
                          activeCategory === category
                            ? 'bg-green-50 border-green-500 shadow-sm'
                            : 'bg-white border-gray-200 hover:border-green-400'
                        "
                        @click="toggleCategory(category)"
                      >
                        <div class="flex justify-between items-center">
                          <div class="flex items-center gap-2">
                            <span>📂</span>
                            <span class="text-sm font-medium text-gray-700">
                              {{ category }}
                            </span>
                          </div>

                          <svg
                            class="w-5 h-5 text-gray-400 transition-all duration-300"
                            :class="activeCategory === category ? 'rotate-180 text-green-500' : ''"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>

                      <!-- Exercises Section -->
                      <transition name="slide-fade">
                        <div v-if="activeCategory === category" class="ml-6 mt-2">
                          <!-- Loading Exercises -->
                          <div v-if="loadingStates.exercises" class="space-y-2">
                            <div v-for="i in 3" :key="i" class="animate-pulse">
                              <div class="h-14 bg-gray-50 rounded-lg"></div>
                            </div>
                          </div>

                          <!-- Exercises List -->
                          <div v-else-if="exercises.length" class="space-y-2">
                            <div
                              v-for="exercise in exercises"
                              :key="exercise.id"
                              class="p-3 bg-white border rounded-lg transition-all duration-300 cursor-pointer group relative"
                              :class="[
                                exercise.isDone 
                                  ? 'border-green-300 bg-green-50 hover:bg-green-100 hover:border-green-400' 
                                  : 'border-gray-200 hover:bg-yellow-50 hover:border-yellow-400',
                                'hover:shadow-sm'
                              ]"
                              @click.stop="showConfirmDialog(exercise)"
                            >
                              
                              <div class="flex justify-between items-center gap-3">
                                <!-- Title và icon -->
                                <div class="flex items-center gap-2 flex-1 min-w-0">
                                  <span class="text-lg flex-shrink-0">
                                    {{ exercise.isDone ? '✅' : '📝' }}
                                  </span>
                                  <p 
                                    class="font-medium truncate"
                                    :class="exercise.isDone ? 'text-green-800' : 'text-gray-800 group-hover:text-yellow-700'"
                                  >
                                    {{ exercise.title }}
                                  </p>
                                </div>

                                <!-- Info: Duration và Score -->
                                <div class="flex items-center gap-3 text-sm flex-shrink-0">
                                  <!-- Duration -->
                                  <div class="flex items-center gap-1 text-gray-600">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{{ exercise.duration }}m</span>
                                  </div>

                                  <!-- Score -->
                                  <div 
                                    class="flex items-center gap-1 font-semibold px-2 py-1 rounded"
                                    :class="getScoreClass(exercise.score, exercise.isDone)"
                                  >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                    <span>{{ exercise.isDone ? exercise.score : '--' }}/100</span>
                                  </div>
                                </div>
                              </div>

                              <!-- Progress bar (nếu đã hoàn thành) -->
                              <div v-if="exercise.isDone" class="mt-2 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  class="h-full rounded-full transition-all duration-500"
                                  :class="getScoreBarClass(exercise.score)"
                                  :style="{ width: exercise.score + '%' }"
                                ></div>
                              </div>
                            </div>
                          </div>

                          <!-- Empty State - No Exercises -->
                          <div v-else class="p-6 text-center">
                            <div class="text-4xl mb-2">📭</div>
                            <p class="text-gray-500 text-sm">No exercises found in this category</p>
                          </div>
                        </div>
                      </transition>
                    </div>
                  </div>

                  <!-- Empty State - No Categories -->
                  <div v-else class="p-6 text-center">
                    <div class="text-4xl mb-2">📂</div>
                    <p class="text-gray-500">No categories found for this topic</p>
                  </div>
                </div>
              </transition>
            </div>
          </div>

          <!-- Empty State - No Topics -->
          <div v-else class="p-12 text-center">
            <div class="text-6xl mb-4">📚</div>
            <p class="text-gray-500 text-lg mb-4">No topics available</p>
            <button
              class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              @click="loadTopics"
            >
              Retry
            </button>
          </div>

          <!-- Error State -->
          <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-start gap-3">
              <svg class="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="flex-1">
                <p class="text-red-800 font-medium">{{ errorMessage }}</p>
                <button
                  class="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                  @click="retryLastAction"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <transition name="dialog-fade">
      <div 
        v-if="showDialog" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        @click="closeDialog"
      >
        <div 
          class="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all"
          :class="showDialog ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
          @click.stop
        >
          <!-- Dialog Header -->
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-bold text-gray-900">Xác nhận học bài</h3>
                <p class="text-sm text-gray-500 mt-0.5">Bạn sẵn sàng bắt đầu chưa?</p>
              </div>
            </div>
          </div>

          <!-- Dialog Body -->
          <div v-if="selectedExercise" class="p-6 space-y-4">
            <!-- Exercise Title -->
            <div>
              <p class="text-sm text-gray-500 mb-1">Tên bài học:</p>
              <p class="text-lg font-semibold text-gray-900">{{ selectedExercise.title }}</p>
            </div>

            <!-- Exercise Info -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Duration -->
              <div class="bg-blue-50 rounded-lg p-3">
                <div class="flex items-center gap-2 text-blue-600 mb-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-xs font-medium">Thời gian</span>
                </div>
                <p class="text-lg font-bold text-blue-700">{{ selectedExercise.duration }} phút</p>
              </div>

              <!-- Score Status -->
              <div 
                class="rounded-lg p-3"
                :class="selectedExercise.isDone ? 'bg-green-50' : 'bg-gray-50'"
              >
                <div class="flex items-center gap-2 mb-1" :class="selectedExercise.isDone ? 'text-green-600' : 'text-gray-600'">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-xs font-medium">Trạng thái</span>
                </div>
                <p class="text-lg font-bold" :class="selectedExercise.isDone ? 'text-green-700' : 'text-gray-700'">
                  {{ selectedExercise.isDone ? `${selectedExercise.score} điểm` : 'Chưa làm' }}
                </p>
              </div>
            </div>

            <!-- Note for completed exercises -->
            <div v-if="selectedExercise.isDone" class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                <div class="flex-1">
                  <p class="text-sm font-medium text-yellow-800">Bài này đã hoàn thành</p>
                  <p class="text-xs text-yellow-700 mt-0.5">Bạn có thể làm lại để cải thiện điểm số</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Dialog Footer -->
          <div class="p-6 bg-gray-50 rounded-b-2xl flex gap-3">
            <button
              class="flex-1 px-4 py-2.5 p-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              @click.stop="closeDialog"
            >
              Hủy
            </button>
            <button
              class="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
              @click.stop="confirmExercise"
            >
              {{ selectedExercise && selectedExercise.isDone ? 'Làm lại' : 'Bắt đầu' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { getListTopic } from "../../apis/vocabularies";
import { getListCategory, getExercisesByCategory } from "../../apis/exercise";

export default {
  layout: "pageLayout",
  middleware: "auth",
  name: "BackToExam",

  data() {
    return {
      activeTopic: null,
      activeCategory: null,
      topics: [],
      categories: [],
      exercises: [],
      
      // Cache để tránh gọi API nhiều lần
      categoriesCache: {},
      exercisesCache: {},
      
      // Loading states
      loadingStates: {
        topics: false,
        categories: false,
        exercises: false
      },
      
      // Error handling
      errorMessage: "",
      lastFailedAction: null,
      
      // Race condition prevention
      currentRequestId: null,

      // Dialog state
      showDialog: false,
      selectedExercise: null
    };
  },

  mounted() {
    this.loadTopics();
  },

  methods: {
    // Load danh sách topics
    async loadTopics() {
      this.loadingStates.topics = true;
      this.errorMessage = "";
      
      try {
        const response = await getListTopic();
        this.topics = response.data || [];
        console.log("✅ Loaded Topics:", this.topics);
      } catch (error) {
        console.error("❌ Error loading topics:", error);
        this.errorMessage = "Failed to load topics. Please try again.";
        this.lastFailedAction = "loadTopics";
        this.$toast.error("Failed to load topics");
      } finally {
        this.loadingStates.topics = false;
      }
    },

    // Toggle topic và load categories
    async toggleTopic(id) {
      // Nếu click vào topic đang active → đóng lại
      if (this.activeTopic === id) {
        this.activeTopic = null;
        this.resetCategoryAndExercises();
        return;
      }

      // Chuyển sang topic mới
      this.activeTopic = id;
      this.resetCategoryAndExercises();
      await this.loadCategories(id);
    },

    // Load categories với cache
    async loadCategories(topicId) {
      // Kiểm tra cache trước
      if (this.categoriesCache[topicId]) {
        this.categories = this.categoriesCache[topicId];
        console.log("📦 Categories loaded from cache");
        return;
      }

      const requestId = Date.now();
      this.currentRequestId = requestId;
      
      this.loadingStates.categories = true;
      this.errorMessage = "";
      
      try {
        const response = await getListCategory(topicId);
        
        // Chỉ update nếu vẫn là request mới nhất
        if (this.currentRequestId !== requestId) {
          console.log("⚠️ Request outdated, ignoring");
          return;
        }
        
        this.categories = response.data || [];
        this.categoriesCache[topicId] = this.categories; // Cache lại
        console.log("✅ Loaded Categories:", this.categories);
      } catch (error) {
        if (this.currentRequestId !== requestId) return;
        
        console.error("❌ Error loading categories:", error);
        this.errorMessage = "Failed to load categories. Please try again.";
        this.lastFailedAction = () => this.loadCategories(topicId);
        this.$toast.error("Failed to load categories");
      } finally {
        if (this.currentRequestId === requestId) {
          this.loadingStates.categories = false;
        }
      }
    },

    async toggleCategory(category) {
      // Nếu click vào category đang active → đóng lại
      if (this.activeCategory === category) {
        this.activeCategory = null;
        this.exercises = [];
        return;
      }

      // Chuyển sang category mới
      this.activeCategory = category;
      await this.loadExercises(category);
    },

    // Load exercises với cache
    async loadExercises(category) {
      const cacheKey = `${this.activeTopic}-${category}`;
      
      // Kiểm tra cache
      if (this.exercisesCache[cacheKey]) {
        this.exercises = this.exercisesCache[cacheKey];
        console.log("📦 Exercises loaded from cache");
        return;
      }

      const requestId = Date.now();
      this.currentRequestId = requestId;
      
      this.loadingStates.exercises = true;
      this.errorMessage = "";
      this.exercises = [];
      
      try {
        const response = await getExercisesByCategory(this.activeTopic, category);
        
        if (this.currentRequestId !== requestId) {
          console.log("⚠️ Request outdated, ignoring");
          return;
        }
        
        this.exercises = response.data || [];
        this.exercisesCache[cacheKey] = this.exercises; // Cache lại
        console.log("✅ Loaded Exercises:", this.exercises);
      } catch (error) {
        if (this.currentRequestId !== requestId) return;
        
        console.error("❌ Error loading exercises:", error);
        this.errorMessage = "Failed to load exercises. Please try again.";
        this.lastFailedAction = () => this.loadExercises(category);
        this.$toast.error("Failed to load exercises");
      } finally {
        if (this.currentRequestId === requestId) {
          this.loadingStates.exercises = false;
        }
      }
    },

    // Reset category và exercises data
    resetCategoryAndExercises() {
      this.activeCategory = null;
      this.categories = [];
      this.exercises = [];
    },

    // Reset tất cả
    resetAll() {
      this.activeTopic = null;
      this.resetCategoryAndExercises();
    },

    // Retry action cuối cùng bị fail
    retryLastAction() {
      this.errorMessage = "";
      if (typeof this.lastFailedAction === "function") {
        this.lastFailedAction();
      } else if (this.lastFailedAction === "loadTopics") {
        this.loadTopics();
      }
    },

    // Get topic name by ID
    getTopicName(topicId) {
      const topic = this.topics.find(t => t.id === topicId);
      return topic ? topic.name : "";
    },

    // Xác định class màu cho điểm số
    getScoreClass(score, isDone) {
      if (!isDone) {
        return 'text-gray-400 bg-gray-100';
      }
      
      if (score >= 80) {
        return 'text-green-700 bg-green-100';
      } else if (score >= 60) {
        return 'text-blue-700 bg-blue-100';
      } else if (score >= 40) {
        return 'text-orange-700 bg-orange-100';
      } else {
        return 'text-red-700 bg-red-100';
      }
    },

    // Xác định class màu cho progress bar
    getScoreBarClass(score) {
      if (score >= 80) {
        return 'bg-green-500';
      } else if (score >= 60) {
        return 'bg-blue-500';
      } else if (score >= 40) {
        return 'bg-orange-500';
      } else {
        return 'bg-red-500';
      }
    },

    // Show confirmation dialog
    showConfirmDialog(exercise) {
      console.log("🔍 Opening dialog for exercise:", exercise);
      this.selectedExercise = exercise;
      
      // Use nextTick to ensure DOM is ready
      this.$nextTick(() => {
        this.showDialog = true;
        // Prevent body scroll when dialog is open
        document.body.style.overflow = 'hidden';
        console.log("✅ Dialog opened, showDialog:", this.showDialog);
      });
    },

    // Close dialog
    closeDialog() {
      console.log("❌ Closing dialog");
      this.showDialog = false;
      
      // Use nextTick to reset after transition
      this.$nextTick(() => {
        this.selectedExercise = null;
        // Restore body scroll
        document.body.style.overflow = '';
      });
    },

    // Confirm and navigate to exercise
    confirmExercise() {
      if (!this.selectedExercise) {
        console.error("❌ No exercise selected!");
        return;
      }

      console.log("📝 Starting exercise:", this.selectedExercise);
      console.log("Score:", this.selectedExercise.score, "| Done:", this.selectedExercise.isDone);
      
      // Store exercise info before navigation
      const exerciseId = this.selectedExercise.id;
      
      // Close dialog first
      this.closeDialog();
      
      // Navigate after dialog closes
      this.$nextTick(() => {
        this.$router.push(`/exercise/${exerciseId}`);
      });
    }
  },

  // Cleanup when component is destroyed
  beforeDestroy() {
    document.body.style.overflow = '';
  }
};
</script>

<style scoped>
/* Slide fade animation */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Dialog fade animation */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: all 0.3s ease;
}

.dialog-fade-enter,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-fade-enter .bg-white,
.dialog-fade-leave-to .bg-white {
  transform: scale(0.95);
}

/* Rotate animation */
.rotate-180 {
  transform: rotate(180deg);
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}