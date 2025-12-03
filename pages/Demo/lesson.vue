<template>
  <div class="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-indigo-600 via-blue-500 to-blue-400 p-8 relative">
    <!-- Page Title -->
    <h1 class="text-5xl md:text-6xl font-extrabold text-white mb-12 text-center drop-shadow-lg animate-slideIn">
      🎯 Chọn bài học
    </h1>

    <!-- Lessons Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">
      <div
        v-for="lesson in lessons"
        :key="lesson.id"
        class="bg-gradient-to-br from-blue-400 to-indigo-500 text-white shadow-lg rounded-3xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:from-indigo-500 hover:to-blue-600"
        @click="selectLesson(lesson)"
      >
        <h2 class="text-2xl md:text-3xl font-bold mb-2">{{ lesson.skill }}</h2>
        <p class="font-semibold mb-1">Bài {{ lesson.id }}</p>
        <p class="text-sm md:text-base opacity-90">{{ lesson.title }}</p>
      </div>
    </div>

    <!-- Decorative Icons -->
    <img 
      src="https://cdn-icons-png.flaticon.com/512/4149/4149256.png" 
      alt="learning illustration" 
      class="w-28 md:w-36 absolute bottom-10 left-10 opacity-70 animate-float"
    />
    <img 
      src="https://cdn-icons-png.flaticon.com/512/4149/4149256.png" 
      alt="learning illustration" 
      class="w-28 md:w-36 absolute bottom-20 right-10 opacity-60 animate-float-reverse"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      lessons: [
        // Vocabulary
        { id: 1, skill: "Vocabulary", title: "Động vật" },
        { id: 2, skill: "Vocabulary", title: "Thức ăn" },
        { id: 3, skill: "Vocabulary", title: "Đồ vật" },
        { id: 4, skill: "Vocabulary", title: "Màu sắc" },
        { id: 5, skill: "Vocabulary", title: "Cơ thể" },
        // Grammar
        { id: 6, skill: "Grammar", title: "Thì hiện tại đơn" },
        { id: 7, skill: "Grammar", title: "Thì hiện tại tiếp diễn" },
        { id: 8, skill: "Grammar", title: "Câu điều kiện loại 1" },
        { id: 9, skill: "Grammar", title: "Câu bị động" },
        { id: 10, skill: "Grammar", title: "Câu hỏi đuôi" },
    
        // Reading
        { id: 16, skill: "Reading", title: "Đọc email" },
        { id: 17, skill: "Reading", title: "Đọc thông báo" },
        { id: 18, skill: "Reading", title: "Đọc truyện ngắn" },
        { id: 19, skill: "Reading", title: "Đọc bảng hướng dẫn" },
        { id: 20, skill: "Reading", title: "Đọc đoạn văn ngắn" },
      ],
    };
  },
  methods: {
    selectLesson(lesson) {
      this.$router.push({ path: "/demo/quiz", query: { lessonId: lesson.id } });
    },
  },
};
</script>

<style scoped>
/* Animations */
@keyframes slideIn {
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

@keyframes floatReverse {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(12px); }
}

.animate-slideIn { animation: slideIn 0.8s ease forwards; }
.animate-float { animation: float 4s infinite ease-in-out; }
.animate-float-reverse { animation: floatReverse 4s infinite ease-in-out; }
</style>
