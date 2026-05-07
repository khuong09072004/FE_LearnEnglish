<template>
  <div class="about-page">
    <section class="hero-card">
      <div class="hero-copy">
        <p class="eyebrow">Giới thiệu</p>
        <h1 class="text-blue-700">Bright English - nền tảng học tiếng Anh cho người Việt</h1>
        <p class="lead">
          Bright English được xây dựng để giúp việc học tiếng Anh trở nên dễ tiếp cận, rõ ràng và
          bền vững hơn. Từ từ vựng, ngữ pháp đến luyện tập thực hành, mọi nội dung đều được sắp
          xếp theo cách dễ hiểu để bạn học đều mỗi ngày và nhìn thấy tiến bộ thật sự.
        </p>
        <div class="hero-actions">
          <nuxt-link to="/home" class="primary-btn">Bắt đầu học ngay</nuxt-link>
          <nuxt-link to="/contact" class="secondary-btn">Liên hệ hỗ trợ</nuxt-link>
        </div>
      </div>
    </section>

    <section class="stats-grid">
      <article v-for="item in stats" :key="item.label" class="stat-card">
        <div class="stat-value">{{ item.value }}</div>
        <div class="stat-label">{{ item.label }}</div>
      </article>
    </section>

    <section class="content-grid">
      <article class="content-card">
        <h2 class="text-blue-700">Chúng tôi hướng đến điều gì?</h2>
        <p>
          Mục tiêu của Bright English là tạo ra một môi trường học tập thân thiện, nơi người học
          có thể bắt đầu từ mức cơ bản rồi nâng dần lên theo nhịp độ của riêng mình. Chúng tôi ưu
          tiên nội dung ngắn gọn, trực quan và có tính ứng dụng cao.
        </p>
        <p>
          Hệ thống được thiết kế để giảm cảm giác quá tải: mỗi bài học đi kèm ví dụ, bài tập và gợi
          ý ôn tập, giúp bạn học hiểu sâu thay vì chỉ ghi nhớ tạm thời.
        </p>
      </article>

      <article class="content-card accent-card">
        <h2 class="text-blue-700">Điểm nổi bật</h2>
        <ul class="feature-list">
          <li>Học đủ 6 kỹ năng trong một hệ thống thống nhất.</li>
          <li>Bài học ngắn, dễ hiểu, phù hợp với thói quen học mỗi ngày.</li>
          <li>Bài tập tương tác giúp củng cố kiến thức ngay sau khi học.</li>
          <li>Giao diện rõ ràng, dễ dùng trên máy tính và điện thoại.</li>
        </ul>
      </article>
    </section>

    <section class="content-card intro-card">
      <h2 class="text-blue-700">Câu chuyện phía sau Bright English</h2>
      <p>
        Bright English được định hướng như một không gian học tập thực tế, nơi người học không chỉ
        xem lý thuyết mà còn được luyện tập qua ví dụ, bài test và các hoạt động rèn kỹ năng. Chúng
        tôi muốn tạo ra một nền tảng mà người dùng có thể quay lại mỗi ngày mà không thấy nặng nề.
      </p>
      <p>
        Thay vì dồn quá nhiều thông tin trong một lần học, nội dung được chia thành các phần nhỏ,
        dễ nắm bắt. Cách tiếp cận này giúp việc học trở nên tự nhiên hơn, đồng thời hỗ trợ người
        học duy trì sự tập trung lâu hơn.
      </p>
    </section>

    <section class="timeline-card">
      <div class="timeline-head">
        <h2 class="text-blue-700">Hướng phát triển</h2>
        <p>
          Bright English vẫn đang tiếp tục được cải tiến để nội dung ngày càng rõ ràng hơn, thao tác
          học dễ hơn và trải nghiệm phù hợp hơn với nhiều người học khác nhau.
        </p>
      </div>

      <div class="timeline-list">
        <div v-for="step in roadmap" :key="step.title" class="timeline-item">
          <div class="timeline-dot"></div>
          <div>
            <h3 class="text-blue-700">{{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "AboutPage",
  layout: "pageLayout",
  middleware: "auth",
  data() {
    return {
      stats: [
        { value: "6", label: "kỹ năng học tập" },
        { value: "100+", label: "nội dung và bài tập" },
        { value: "24/7", label: "truy cập mọi lúc" },
        { value: "1", label: "lộ trình rõ ràng" },
      ],
      roadmap: [
        {
          title: "Mở rộng nội dung học",
          description: "Bổ sung thêm chủ đề, ví dụ và bài tập để người học có nhiều lựa chọn hơn.",
        },
        {
          title: "Tối ưu trải nghiệm học",
          description: "Cải thiện giao diện, tốc độ và khả năng học trên cả máy tính lẫn di động.",
        },
        {
          title: "Cá nhân hóa lộ trình",
          description: "Gợi ý nội dung phù hợp theo cấp độ, thói quen và mục tiêu học tập.",
        },
      ],
    };
  },
};
</script>

<style scoped>
.about-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 4px;
  color: #123a6f;
}

.hero-card,
.content-card,
.timeline-card {
  background: linear-gradient(180deg, #ffffff 0%, #f6fbff 100%);
  border: 1px solid #dce9f7;
  border-radius: 22px;
  box-shadow: 0 12px 30px rgba(40, 100, 180, 0.08);
}

.hero-card {
  display: block;
  padding: 28px;
  background: radial-gradient(circle at top right, rgba(55, 132, 255, 0.12), transparent 32%),
    linear-gradient(180deg, #ffffff 0%, #f2f8ff 100%);
}

.eyebrow {
  display: inline-flex;
  margin: 0 0 12px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(45, 114, 220, 0.1);
  color: #2d72dc;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
}

.hero-copy h1 {
  margin: 0;
  font-size: 36px;
  line-height: 1.15;

  font-weight: 800;
}

.lead {
  margin: 16px 0 0;
  color: #4f6c93;
  font-size: 16px;
  line-height: 1.8;
  max-width: 62ch;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 22px;
}

.primary-btn,
.secondary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 18px;
  border-radius: 14px;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}

.primary-btn {
  background: linear-gradient(90deg, #1c67d8 0%, #3e8cff 100%);
  color: #fff;
  box-shadow: 0 10px 20px rgba(34, 109, 220, 0.22);
}

.secondary-btn {
  background: #eaf3ff;
  color: #1e5eb8;
}

.primary-btn:hover,
.secondary-btn:hover {
  transform: translateY(-1px);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.stat-card {
  padding: 18px;
  text-align: center;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f4f9ff 100%);
  border: 1px solid #deebfa;
  box-shadow: 0 10px 22px rgba(40, 100, 180, 0.06);
}

.stat-value {
  font-size: 28px;
  font-weight: 800;
  color: #1c67d8;
}

.stat-label {
  margin-top: 6px;
  color: #5d7597;
  font-size: 13px;
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  gap: 16px;
}

.content-card {
  padding: 22px;
}

.content-card h2,
.timeline-head h2 {
  margin: 0 0 12px;
  color: #1560c0;
  font-size: 24px;
  font-weight: 800;
}

.content-card p,
.timeline-head p {
  margin: 0 0 12px;
  color: #506a8f;
  line-height: 1.8;
}

.accent-card {
  background: linear-gradient(180deg, #f8fbff 0%, #eef6ff 100%);
}

.feature-list {
  margin: 0;
  padding-left: 18px;
  color: #4b6690;
  line-height: 1.8;
}

.intro-card {
  padding: 22px;
}

.timeline-card {
  padding: 22px;
}

.timeline-list {
  display: grid;
  gap: 14px;
}

.timeline-item {
  display: grid;
  grid-template-columns: 14px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
  padding: 14px 0;
  border-top: 1px solid #e3eefb;
}

.timeline-item:first-child {
  border-top: none;
  padding-top: 0;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  margin-top: 6px;
  border-radius: 50%;
  background: linear-gradient(180deg, #1d67d9 0%, #5aa3ff 100%);
  box-shadow: 0 0 0 6px rgba(29, 103, 217, 0.1);
}

.timeline-item h3 {
  margin: 0 0 6px;
  color: #123a6f;
  font-size: 16px;
  font-weight: 800;
}

.timeline-item p {
  margin: 0;
  color: #567295;
  line-height: 1.75;
}

@media (max-width: 1100px) {
  .content-grid,
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .hero-card {
    padding: 22px;
  }

  .hero-copy h1 {
    font-size: 30px;
  }
}

@media (max-width: 768px) {
  .about-page {
    gap: 14px;
  }

  .hero-card,
  .content-card,
  .timeline-card {
    border-radius: 18px;
    padding: 18px;
  }

  .hero-actions {
    flex-direction: column;
  }

  .primary-btn,
  .secondary-btn {
    width: 100%;
  }

  .hero-copy h1 {
    font-size: 26px;
  }

  .lead {
    font-size: 15px;
  }

  .content-card h2,
  .timeline-head h2 {
    font-size: 21px;
  }
}
</style>