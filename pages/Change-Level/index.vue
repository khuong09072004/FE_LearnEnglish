<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">
          Chọn Lại Level Học Tập
        </h1>
        <p class="text-gray-600 text-lg">
          Hãy chọn level phù hợp với trình độ hiện tại của bạn
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20">
        <a-spin size="large" />
        <p class="mt-4 text-gray-600">Đang tải danh sách level...</p>
      </div>

      <!-- Level Cards -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="level in levels"
          :key="level.id"
          @click="handleSelectLevel(level)"
          class="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 p-6 border-2 border-transparent hover:border-indigo-500"
          :class="{ 'ring-4 ring-indigo-300': selectedLevel?.id === level.id }"
        >
          <div class="text-center">
            <!-- Icon -->
            <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <span class="text-3xl text-white font-bold">
                {{ level.code.charAt(0) }}
              </span>
            </div>

            <!-- Level Name -->
            <h3 class="text-2xl font-bold text-gray-800 mb-2">
              {{ level.name }}
            </h3>

            <!-- Level Code -->
            <p class="text-indigo-600 font-semibold text-sm mb-4">
              {{ level.code }}
            </p>

            <!-- Button -->
            <a-button
              type="primary"
              size="large"
              :loading="submitting && selectedLevel?.id === level.id"
              class="w-full"
              @click.stop="confirmSelectLevel(level)"
            >
              Chọn Level Này
            </a-button>
          </div>
        </div>
      </div>

      <!-- Back Button -->
      <div class="text-center mt-12">
        <a-button size="large" @click="goBack">
           Quay Lại
        </a-button>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <a-modal
      :visible="showConfirmModal"
      title="Xác Nhận Thay Đổi Level"
      @ok="submitSelectLevel"
      @cancel="showConfirmModal = false"
      :confirm-loading="submitting"
    >
      <p class="text-lg">
        Bạn có chắc chắn muốn chuyển sang level
        <strong class="text-indigo-600">{{ selectedLevel?.name }}</strong>?
      </p>
      <p class="text-gray-600 mt-2">
        Tiến trình học tập của bạn sẽ được cập nhật theo level mới.
      </p>
    </a-modal>
  </div>
</template>

<script>
import { getAvailableLevels, selectLevel } from "~/apis/level";

export default {
  name: "ChangeLevelPage",
  layout: "pageLayout",
  middleware: "auth",

  data() {
    return {
      levels: [],
      loading: false,
      submitting: false,
      selectedLevel: null,
      showConfirmModal: false,
    };
  },

  mounted() {
    this.fetchLevels();
  },

  methods: {
    async fetchLevels() {
      this.loading = true;
      try {
        const response = await getAvailableLevels();
        if (response.status === "success") {
          this.levels = response.data;
        }
      } catch (error) {
        console.error("Error fetching levels:", error);
        this.$message.error("Không thể tải danh sách level. Vui lòng thử lại!");
      } finally {
        this.loading = false;
      }
    },

    handleSelectLevel(level) {
      this.selectedLevel = level;
    },

    confirmSelectLevel(level) {
      this.selectedLevel = level;
      this.showConfirmModal = true;
    },

    async submitSelectLevel() {
      if (!this.selectedLevel) return;

      this.submitting = true;
      try {
        const response = await selectLevel(this.selectedLevel.code);
        
        if (response.status === "success") {
          this.$message.success(`Đã chuyển sang level ${this.selectedLevel.name} thành công!`);
          this.showConfirmModal = false;
          
          // Redirect to home or profile after 1.5 seconds
          setTimeout(() => {
            this.$router.push("/Home");
          }, 1000);
        }
      } catch (error) {
        console.error("Error selecting level:", error);
        this.$message.error("Không thể thay đổi level. Vui lòng thử lại!");
      } finally {
        this.submitting = false;
      }
    },

    goBack() {
      this.$router.back();
    },
  },
};
</script>

<style scoped>
/* Custom styles nếu cần */
</style>
