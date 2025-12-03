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
                              class="p-3 bg-white border border-gray-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-400 hover:shadow-sm transition-all duration-300 cursor-pointer group"
                              @click="selectExercise(exercise)"
                            >
                              <div class="flex justify-between items-center">
                                <div class="flex items-center gap-2 flex-1">
                                  <span>📝</span>
                                  <p class="font-medium text-gray-800 group-hover:text-yellow-700">
                                    {{ exercise.title }}
                                  </p>
                                </div>
                                <div class="flex items-center gap-2 text-sm text-gray-600">
                                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>{{ exercise.duration }} minutes</span>
                                </div>
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
      currentRequestId: null
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

    // Xử lý khi click vào exercise
    selectExercise(exercise) {
      console.log("📝 Selected exercise:", exercise);
      // Navigate đến trang làm bài
      this.$router.push(`/exercise/${exercise.id}`);
    }
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

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>