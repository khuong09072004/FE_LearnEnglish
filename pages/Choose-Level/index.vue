<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6"
  >
    <div
      class="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-2xl border border-blue-100"
    >
      <h1
        class="text-3xl font-bold text-center mb-8 text-blue-700 flex items-center justify-center gap-2"
      >
        Chọn trình độ tiếng Anh của bạn
      </h1>

      <!-- Loading -->
      <div
        v-if="loading"
        class="text-center py-6 text-blue-600 font-medium animate-pulse"
      >
        Đang tải danh sách...
      </div>

      <!-- List -->
      <div v-else class="grid grid-cols-1 gap-5">
        <div
          v-for="level in levels"
          :key="level.id"
          @click="selectLevel(level.code)"
          class="p-6 border border-gray-200 rounded-2xl shadow-md bg-white cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-400 hover:bg-blue-50"
        >
          <p class="font-semibold text-xl text-gray-700">{{ level.name }}</p>
          <p class="text-gray-500 mt-1">{{ level.code }}</p>
        </div>
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
