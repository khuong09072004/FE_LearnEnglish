<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-white text-gray-800">
    <!-- Header -->
    <header class="fixed top-0 left-0 w-full bg-white backdrop-blur-md shadow-sm z-50">
      <div class="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        <h1 class="text-2xl font-extrabold text-indigo-600 tracking-wide">EngLearn</h1>

        <nav class="hidden md:flex space-x-8 text-gray-600 font-medium">
          <a href="#features" class="hover:text-indigo-600 transition">Tính năng</a>
          <a href="#courses" class="hover:text-indigo-600 transition">Khóa học</a>
          <a href="#roadmap" class="hover:text-indigo-600 transition">Lộ trình khóa học</a>
          <a href="#about" class="hover:text-indigo-600 transition">Giới thiệu</a>
          <a href="#contact" class="hover:text-indigo-600 transition">Liên hệ</a>
        </nav>

        <button @click="goLogin" class="bg-indigo-600 text-white px-5 py-2 rounded-xl shadow hover:bg-indigo-700 transition">
          Đăng nhập
        </button>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-8 pt-32 pb-20">
      <div class="lg:w-1/2 space-y-6">
        <h2 class="text-5xl font-extrabold text-indigo-700 leading-tight">
          Học tiếng Anh hiệu quả <br />
          cùng <span class="text-indigo-500">EngLearn</span>
        </h2>
        <p class="text-gray-600 text-lg leading-relaxed">
          Nâng cao kỹ năng nghe, nói, đọc, viết với hàng trăm bài học tương tác,
          bài kiểm tra thông minh và lộ trình khóa học được cá nhân hóa.
        </p>
        <button @click="goHome" class="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow hover:opacity-90 transition">
          🚀 Bắt đầu học miễn phí
        </button>
      </div>

      <div class="lg:w-1/2 mt-12 lg:mt-0 flex justify-center">
        <img src="../assets/css/download.jpg" alt="Learning English" class="w-full max-w-lg rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-500" />
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="py-24 bg-gradient-to-b from-indigo-50 via-white to-blue-50">
      <h3 class="text-center text-3xl font-bold text-indigo-700 mb-12">🌟 Tính năng nổi bật</h3>
      <div class="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-8">
        <div class="bg-white p-8 rounded-3xl shadow hover:-translate-y-2 hover:shadow-xl transition duration-300">
          <div class="text-indigo-600 text-4xl mb-4">📘</div>
          <h4 class="text-xl font-bold text-indigo-700 mb-2">Từ vựng thông minh</h4>
          <p class="text-gray-600">Ghi nhớ lâu hơn với hình ảnh minh họa, ví dụ thực tế và bài tập kiểm tra tự động.</p>
        </div>

        <div class="bg-white p-8 rounded-3xl shadow hover:-translate-y-2 hover:shadow-xl transition duration-300">
          <div class="text-indigo-600 text-4xl mb-4">✏️</div>
          <h4 class="text-xl font-bold text-indigo-700 mb-2">Ngữ pháp dễ hiểu</h4>
          <p class="text-gray-600">Học qua ví dụ sinh động, bài luyện thực hành và hướng dẫn chi tiết từng bước.</p>
        </div>

        <div class="bg-white p-8 rounded-3xl shadow hover:-translate-y-2 hover:shadow-xl transition duration-300">
          <div class="text-indigo-600 text-4xl mb-4">📊</div>
          <h4 class="text-xl font-bold text-indigo-700 mb-2">Theo dõi tiến độ</h4>
          <p class="text-gray-600">Kiểm tra kết quả học tập theo thời gian thực và nhận đề xuất cải thiện tự động.</p>
        </div>
      </div>
    </section>

    <!-- Roadmap -->
    <section id="roadmap" class="py-24 text-center bg-gradient-to-b from-blue-50 via-white to-indigo-50">
      <h3 class="text-3xl font-bold text-indigo-700 mb-6">📈 Lộ trình khóa học</h3>
      <p class="text-gray-600 mb-12 max-w-2xl mx-auto">
        EngLearn giúp bạn đi từng bước vững chắc — từ người mới bắt đầu đến trình độ thành thạo.
        Mỗi giai đoạn đều có bài học, bài luyện và bài kiểm tra phù hợp.
      </p>

      <div class="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 px-6">
        <div class="bg-white rounded-3xl shadow p-8 hover:shadow-xl transition">
          <h4 class="text-xl font-bold text-indigo-700 mb-3">🔹 Cấp độ 1: Cơ bản</h4>
          <p class="text-gray-600">Làm quen phát âm, từ vựng thông dụng và ngữ pháp nền tảng. Phù hợp với người mới bắt đầu.</p>
        </div>

        <div class="bg-white rounded-3xl shadow p-8 hover:shadow-xl transition">
          <h4 class="text-xl font-bold text-indigo-700 mb-3">🔸 Cấp độ 2: Trung cấp</h4>
          <p class="text-gray-600">Mở rộng vốn từ, luyện nghe hội thoại thực tế và phát triển kỹ năng viết ngắn.</p>
        </div>

        <div class="bg-white rounded-3xl shadow p-8 hover:shadow-xl transition">
          <h4 class="text-xl font-bold text-indigo-700 mb-3">🔹 Cấp độ 3: Nâng cao</h4>
          <p class="text-gray-600">Luyện kỹ năng nói – viết chuyên sâu, cấu trúc phức tạp và phản xạ ngôn ngữ tự nhiên.</p>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section id="testimonials" class="py-24 bg-gradient-to-b from-indigo-50 via-blue-50 to-white text-center">
      <h3 class="text-3xl font-bold text-indigo-700 mb-6">💬 Đánh giá từ học viên</h3>
      <p class="text-gray-600 mb-12 max-w-2xl mx-auto">
        Hàng ngàn học viên đã cải thiện kỹ năng tiếng Anh nhờ EngLearn. Hãy xem họ nói gì về trải nghiệm học tập này!
      </p>

      <div class="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 px-6">
        <!-- Review 1 -->
        <div class="bg-white rounded-3xl shadow p-8 hover:shadow-xl transition duration-300">
          <div class="flex justify-center mb-4">
            <img src="https://i.pravatar.cc/100?img=5" alt="avatar" class="w-20 h-20 rounded-full shadow-md" />
          </div>
          <h4 class="text-lg font-semibold text-indigo-700 mb-1">Nguyễn Minh Anh</h4>
          <p class="text-sm text-gray-500 mb-3">Sinh viên Đại học Hà Nội</p>
          <p class="text-gray-600 italic">“Nhờ EngLearn, mình đã tự tin giao tiếp với người nước ngoài chỉ sau 3 tháng. Giao diện học cực kỳ dễ dùng và nội dung rất thực tế!”</p>
        </div>

        <!-- Review 2 -->
        <div class="bg-white rounded-3xl shadow p-8 hover:shadow-xl transition duration-300">
          <div class="flex justify-center mb-4">
            <img src="https://i.pravatar.cc/100?img=8" alt="avatar" class="w-20 h-20 rounded-full shadow-md" />
          </div>
          <h4 class="text-lg font-semibold text-indigo-700 mb-1">Trần Quốc Huy</h4>
          <p class="text-sm text-gray-500 mb-3">Nhân viên Marketing</p>
          <p class="text-gray-600 italic">“Mình thích nhất phần lộ trình rõ ràng, biết mình đang ở đâu và nên học gì tiếp. Rất hữu ích cho người đi làm như mình.”</p>
        </div>

        <!-- Review 3 -->
        <div class="bg-white rounded-3xl shadow p-8 hover:shadow-xl transition duration-300">
          <div class="flex justify-center mb-4">
            <img src="https://i.pravatar.cc/100?img=12" alt="avatar" class="w-20 h-20 rounded-full shadow-md" />
          </div>
          <h4 class="text-lg font-semibold text-indigo-700 mb-1">Phạm Thảo Vy</h4>
          <p class="text-sm text-gray-500 mb-3">Học sinh cấp 3</p>
          <p class="text-gray-600 italic">“Mỗi ngày học một chút qua app là mình đã nâng điểm tiếng Anh ở trường rõ rệt. Rất vui vì tìm thấy EngLearn ❤️”</p>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-24 bg-white text-center">
      <h3 class="text-3xl font-bold text-indigo-700 mb-6">🌟 Giới thiệu EngLearn</h3>
      <p class="text-gray-600 max-w-3xl mx-auto leading-relaxed text-lg">
        EngLearn là nền tảng học tiếng Anh toàn diện, tích hợp từ vựng, ngữ pháp, nghe, nói, đọc và viết.
        Chúng tôi sử dụng các phương pháp học hiện đại, AI hỗ trợ luyện nói, viết và lộ trình học cá nhân hóa
        giúp bạn cải thiện kỹ năng nhanh chóng, hiệu quả và thú vị.
      </p>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-24 bg-indigo-50 text-center">
      <h3 class="text-3xl font-bold text-indigo-700 mb-6">📬 Liên hệ với chúng tôi</h3>
      <p class="text-gray-600 mb-8 max-w-2xl mx-auto">
        Bạn có câu hỏi hoặc góp ý? Hãy gửi cho chúng tôi, chúng tôi sẽ phản hồi nhanh chóng.
      </p>
      <form class="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow space-y-4">
        <input type="text" placeholder="Tên của bạn" class="w-full p-3 border rounded-lg" />
        <input type="email" placeholder="Email" class="w-full p-3 border rounded-lg" />
        <textarea placeholder="Nội dung" class="w-full p-3 border rounded-lg"></textarea>
        <button type="submit" class="bg-indigo-600 text-white px-6 py-3 rounded-xl shadow hover:bg-indigo-700 transition">
          Gửi
        </button>
      </form>
    </section>

    <!-- Footer -->
    <footer class="bg-indigo-700 text-white text-center py-8 mt-10">
      <p class="text-lg font-medium">© 2025 EngLearn — Học tiếng Anh mọi lúc, mọi nơi</p>
    </footer>

    <div class="pointer-events-none fixed top-0 left-0 w-full h-full overflow-hidden z-0" id="snow"></div>
  </div>
</template>

<script>
export default {
  mounted() {
    const snowContainer = document.getElementById('snow')
    for (let i = 0; i < 40; i++) {
      const snowflake = document.createElement('div')
      snowflake.classList.add('snowflake')
      snowflake.style.left = Math.random() * 100 + 'vw'
      snowflake.style.animationDuration = 5 + Math.random() * 5 + 's'
      snowflake.style.opacity = Math.random()
      snowflake.style.fontSize = 10 + Math.random() * 14 + 'px'
      snowflake.textContent = '❄️'
      snowContainer.appendChild(snowflake)
    }
  },

  methods: {
    goLogin() {
      this.$router.push('/login')
    },
    goHome() {
      this.$router.push('/Demo')
    },
  },
}
</script>

<style>
@keyframes fall {
  0% { transform: translateY(-10vh) rotate(0deg); }
  100% { transform: translateY(110vh) rotate(360deg); }
}
.snowflake {
  position: absolute;
  top: -10vh;
  color: white;
  animation-name: fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
</style>
