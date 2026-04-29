<template>
  <div class="level-page">
    <div class="level-container">
      <!-- Mascot and Question -->
      <div class="header-row">
        <div class="mascot-circle">
          <svg xmlns="http://www.w3.org/2000/svg" class="mascot-icon" fill="none" viewBox="0 0 24 24" stroke="#378ADD" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div class="speech-bubble">
          <p>Trình độ tiếng Anh của bạn ở mức nào?</p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-wrapper">
        <div class="spinner"></div>
      </div>

      <!-- Level Options -->
      <div v-else class="levels-list">
        <div
          v-for="level in mappedLevels"
          :key="level.id"
          class="level-card"
          @click="selectLevel(level.code)"
        >
          <!-- Bar icon -->
          <div class="bar-icon">
            <span
              v-for="i in 5"
              :key="i"
              :class="i <= level.bars ? 'bar-filled' : 'bar-empty'"
              :style="{ height: (30 + i * 14) + '%' }"
            ></span>
          </div>

          <!-- Text -->
          <div class="level-text">
            <p class="level-name">{{ level.viName }}</p>
            <p class="level-desc">{{ level.desc }}</p>
          </div>

          <!-- Badge -->
          <span class="level-badge">{{ level.badge }}</span>

          <!-- Arrow -->
          <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </div>

      <!-- Hint -->
      <p class="hint">Bạn có thể thay đổi sau trong hồ sơ cá nhân</p>
    </div>
  </div>
</template>

<script>
import { getListLevel, chooseLevel } from "../../apis/level";
import Cookies from "js-cookie";

const LEVEL_MAP = {
  Beginner: {
    viName: "Mới bắt đầu",
    desc: "Chưa biết gì về tiếng Anh hoặc biết rất ít",
    badge: "Mới bắt đầu",
    bars: 1,
  },
  Elementary: {
    viName: "Sơ cấp",
    desc: "Biết một số từ và cụm từ cơ bản trong cuộc sống",
    badge: "A1",
    bars: 2,
  },
  "Pre-Intermediate": {
    viName: "Tiền trung cấp",
    desc: "Có thể giao tiếp đơn giản trong các tình huống quen thuộc",
    badge: "A2",
    bars: 3,
  },
  Intermediate: {
    viName: "Trung cấp",
    desc: "Tự tin giao tiếp hàng ngày, hiểu ý chính các chủ đề phổ biến",
    badge: "B1",
    bars: 3,
  },
  "Upper-Intermediate": {
    viName: "Trung cấp nâng cao",
    desc: "Giao tiếp lưu loát, hiểu các văn bản phức tạp",
    badge: "B2",
    bars: 4,
  },
  Advanced: {
    viName: "Cao cấp",
    desc: "Sử dụng tiếng Anh linh hoạt trong hầu hết các tình huống",
    badge: "C1",
    bars: 4,
  },
  Proficiency: {
    viName: "Thành thạo",
    desc: "Gần như đạt trình độ người bản ngữ",
    badge: "C2",
    bars: 5,
  },
};

export default {
  data() {
    return {
      levels: [],
      loading: false,
    };
  },

  computed: {
    mappedLevels() {
      return this.levels.map((level) => {
        const map = LEVEL_MAP[level.name] || {};
        return {
          ...level,
          viName: map.viName || level.name,
          desc: map.desc || "",
          badge: map.badge || "",
          bars: map.bars || 1,
        };
      });
    },
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

<style scoped>
/* ===== BASE — mobile first (< 600px) ===== */

.level-page {
  min-height: 100vh;
  background: #f0f6fd;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 32px 16px 40px;
  box-sizing: border-box;
}

.level-container {
  width: 100%;
  max-width: 640px;
}

/* Header */
.header-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 24px;
}

.mascot-circle {
  width: 48px;
  height: 48px;
  min-width: 48px;
  border-radius: 50%;
  background: #ffffff;
  border: 1.5px solid #b5d4f4;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mascot-icon {
  width: 24px;
  height: 24px;
}

.speech-bubble {
  background: #ffffff;
  border: 1.5px solid #b5d4f4;
  border-radius: 14px;
  padding: 12px 16px;
  position: relative;
  flex: 1;
}

.speech-bubble::before {
  content: '';
  position: absolute;
  left: -10px;
  top: 16px;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-right: 10px solid #b5d4f4;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  left: -8px;
  top: 17px;
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-right: 9px solid #ffffff;
}

.speech-bubble p {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #1a2d4a;
  line-height: 1.4;
}

/* Loading */
.loading-wrapper {
  display: flex;
  justify-content: center;
  padding: 64px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #b5d4f4;
  border-top-color: #378add;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Level cards */
.levels-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.level-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  background: #ffffff;
  border: 1.5px solid #b5d4f4;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.18s ease;
  -webkit-tap-highlight-color: transparent;
}

.level-card:hover,
.level-card:active {
  border-color: #378add;
  background: #e6f1fb;
  transform: translateX(4px);
}

.level-card:hover .level-name,
.level-card:active .level-name {
  color: #185fa5;
}

.level-card:hover .bar-filled,
.level-card:active .bar-filled {
  background: #378add;
}

.level-card:hover .bar-empty,
.level-card:active .bar-empty {
  background: #b5d4f4;
}

.level-card:hover .level-badge,
.level-card:active .level-badge {
  background: #378add;
  color: #ffffff;
}

.level-card:hover .arrow-icon,
.level-card:active .arrow-icon {
  color: #378add;
  transform: translateX(2px);
}

/* Bar icon */
.bar-icon {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 28px;
  width: 38px;
  flex-shrink: 0;
}

.bar-icon span {
  flex: 1;
  border-radius: 3px 3px 0 0;
  transition: background 0.18s;
}

.bar-filled { background: #85b7eb; }
.bar-empty  { background: #e6f1fb; }

/* Text */
.level-text {
  flex: 1;
  min-width: 0;
}

.level-name {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #1a2d4a;
  transition: color 0.18s;
}

.level-desc {
  margin: 3px 0 0;
  font-size: 12px;
  color: #7a9bbf;
  line-height: 1.4;
}

/* Badge */
.level-badge {
  font-size: 11px;
  font-weight: 600;
  background: #e6f1fb;
  color: #185fa5;
  border-radius: 20px;
  padding: 4px 10px;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.18s;
}

/* Arrow */
.arrow-icon {
  width: 16px;
  height: 16px;
  color: #b5d4f4;
  flex-shrink: 0;
  transition: all 0.18s;
}

/* Hint */
.hint {
  margin-top: 20px;
  text-align: center;
  font-size: 12px;
  color: #7a9bbf;
}

/* ===== TABLET (≥ 600px) ===== */
@media (min-width: 600px) {
  .level-page {
    padding: 48px 32px;
    align-items: center;
  }

  .header-row {
    gap: 16px;
    margin-bottom: 32px;
  }

  .mascot-circle {
    width: 64px;
    height: 64px;
    min-width: 64px;
  }

  .mascot-icon {
    width: 32px;
    height: 32px;
  }

  .speech-bubble {
    padding: 16px 20px;
  }

  .speech-bubble::before { top: 22px; }
  .speech-bubble::after  { top: 23px; }

  .speech-bubble p { font-size: 17px; }

  .levels-list { gap: 12px; }

  .level-card {
    padding: 16px 24px;
    gap: 18px;
    border-radius: 16px;
  }

  .bar-icon {
    height: 32px;
    width: 44px;
    gap: 4px;
  }

  .level-name { font-size: 16px; }
  .level-desc { font-size: 13px; }

  .level-badge {
    font-size: 12px;
    padding: 5px 14px;
  }

  .hint {
    font-size: 13px;
    margin-top: 24px;
  }
}

/* ===== DESKTOP (≥ 1024px) ===== */
@media (min-width: 1024px) {
  .level-page {
    padding: 64px 48px;
    align-items: center;
  }

  .level-container {
    max-width: 680px;
  }

  .header-row {
    margin-bottom: 40px;
  }

  .mascot-circle {
    width: 72px;
    height: 72px;
    min-width: 72px;
  }

  .mascot-icon {
    width: 36px;
    height: 36px;
  }

  .speech-bubble p { font-size: 18px; }

  .level-card {
    padding: 18px 28px;
    border-radius: 18px;
  }

  .level-card:hover {
    transform: translateX(6px);
    box-shadow: 0 4px 20px rgba(55, 138, 221, 0.1);
  }

  .bar-icon {
    height: 36px;
    width: 48px;
  }

  .level-name { font-size: 17px; }
  .level-desc { font-size: 14px; margin-top: 4px; }

  .level-badge {
    font-size: 13px;
    padding: 6px 16px;
  }

  .arrow-icon {
    width: 18px;
    height: 18px;
  }
}

/* ===== LARGE SCREEN (≥ 1440px) ===== */
@media (min-width: 1440px) {
  .level-container {
    max-width: 760px;
  }

  .level-card {
    padding: 20px 32px;
  }

  .speech-bubble p { font-size: 19px; }
  .level-name      { font-size: 18px; }
  .level-desc      { font-size: 15px; }
}
</style>