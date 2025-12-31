<template>
  <div class="min-h-screen bg-white py-12 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- Mascot and Question -->
      <div class="flex items-start gap-6 mb-12">
        <!-- Mascot -->
        <div class="flex-shrink-0">
          <div class="w-24 h-24 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>

        <!-- Speech Bubble -->
        <div class="relative bg-white border-2 border-gray-300 rounded-2xl px-6 py-4 shadow-md">
          <p class="text-lg font-semibold text-gray-700">
            Trình độ tiếng Anh của bạn ở mức nào?
          </p>
          <!-- Triangle pointer -->
          <div class="absolute left-0 top-8 -ml-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-gray-300"></div>
          <div class="absolute left-0 top-8 -ml-1 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white"></div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-500"></div>
      </div>

      <!-- Level Options -->
      <div v-else class="space-y-4">
        <div
          v-for="(level, index) in levels"
          :key="level.id"
          @click="selectLevel(level.code)"
          class="group border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-2xl px-6 py-5 cursor-pointer transition-all duration-200 flex items-center gap-4"
        >
          <!-- Progress Bars Icon -->
          <div class="flex items-end gap-1 h-10 w-12">
            <template v-for="bar in Math.min(index + 1, 4)">
              <div 
                :key="'filled-' + bar"
                class="flex-1 bg-blue-400 group-hover:bg-blue-500 rounded-t transition-colors"
                :style="{ height: (bar * 25) + '%' }"
              ></div>
            </template>
            <template v-for="emptyBar in Math.max(0, 4 - (index + 1))">
              <div 
                :key="'empty-' + emptyBar"
                class="flex-1 bg-gray-200 rounded-t"
                style="height: 100%"
              ></div>
            </template>
          </div>

          <!-- Level Text -->
          <div class="flex-1">
            <p class="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
              {{ level.name }}
            </p>
          </div>
        </div>
      </div>

      <!-- Continue Button (optional, can remove if not needed) -->
      <div class="mt-8 text-center">
        <p class="text-sm text-gray-500">
          💡 Bạn có thể thay đổi level sau trong Hồ sơ cá nhân
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { getListLevel, chooseLevel } from "../../apis/level";
import Cookies from "js-cookie";

export default {
  data() {
    return {
      levels: [],
      loading: false,
    };
  },

  async mounted() {
    this.loading = true;
    try {
      const res = await getListLevel();
      this.levels = res.data;
    } catch (err) {
      console.error(err);
      this.$toast.error(
        err?.response?.message || "Không tải được danh sách trình độ"
      );
    } finally {
      this.loading = false;
    }
  },

  methods: {
    async selectLevel(code) {
      try {
        await chooseLevel({ level: code });
        const currentUser = this.$store.getters["auth/user"];
        if (currentUser) {
          const updatedUser = { ...currentUser, has_selected_level: true };
          this.$store.commit("auth/setUser", updatedUser);

  
          Cookies.set("user", JSON.stringify(updatedUser), {
            expires: 8,
            secure: true,
            sameSite: "Strict",
          });
        }
        this.$message.success("Chọn trình độ thành công!");
        this.$router.push("/home");
      } catch (err) {
        console.error(err);
        this.$message.error("Có lỗi khi chọn trình độ");
      }
    },
  },
};
</script>
