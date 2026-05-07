<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
  >
    <div class="container mx-auto px-4 py-6 max-w-7xl">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-blue-700"> Hội thoại</h1>
        <p class="text-gray-600 mt-2">
          Học tiếng Anh qua các cuộc trò chuyện mẫu cùng với AI
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loadingLessons" class="flex justify-center items-center py-12">
        <a-spin size="large" />
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Lessons List - Left -->
        <div class="lg:col-span-4 space-y-3">
          <div
            v-for="lesson in lessons"
            :key="lesson.id"
            class="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-col hover:shadow-md hover:bg-gray-50 transition cursor-pointer"
            :class="{
              'border-blue-400 bg-blue-50':
                selectedLesson && selectedLesson.id === lesson.id,
              'border-green-300 bg-green-50': lesson.is_learn,
            }"
            @click="startLesson(lesson)"
          >
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-gray-800 flex-1">{{ lesson.title }}</h3>
              <a-icon type="right" class="text-gray-400" />
            </div>
            <div class="flex items-center gap-2">
              <span
                v-if="lesson.is_learn"
                class="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full"
              >
                <a-icon type="check-circle" theme="filled" />
                Đã học
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full"
              >
                <a-icon type="book" theme="filled" />
                Chưa học
              </span>
            </div>
          </div>

          <div
            v-if="lessons.length === 0"
            class="text-center text-gray-500 py-12"
          >
            Chưa có bài hội thoại nào
          </div>
        </div>

        <!-- Chat Area - Right -->
        <div class="lg:col-span-8">
          <!-- Empty state -->
          <div
            v-if="!selectedLesson"
            class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center h-full flex flex-col items-center justify-center"
          >
            <div class="text-6xl mb-4">💬</div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              Chọn một bài hội thoại
            </h3>
            <p class="text-gray-600">
              Chọn bài từ danh sách bên trái để bắt đầu trò chuyện với AI
            </p>
          </div>

          <!-- Chat Box -->
          <div
            v-else
            class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col"
            style="height: 650px"
          >
            <!-- Chat Header -->
            <div
              class="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h2 class="text-lg font-bold">{{ selectedLesson.title }}</h2>
                  <p class="text-blue-100 text-sm">
                    {{ selectedLesson.description }}
                  </p>
                </div>
                <div
                  v-if="selectedLesson.is_learn"
                  class="inline-flex items-center gap-1.5 text-sm font-medium bg-green-500 bg-opacity-80 px-3 py-1.5 rounded-lg ml-3 whitespace-nowrap"
                >
                  <a-icon type="check-circle" theme="filled" />
                  Đã học
                </div>
              </div>
            </div>

            <!-- Messages -->
            <div
              ref="chatMessages"
              class="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3"
            >
              <div v-if="starting" class="text-center py-8">
                <a-spin size="small" />
                <p class="text-gray-400 text-sm mt-2">Đang khởi động...</p>
              </div>

              <div
                v-for="(msg, index) in messages"
                :key="index"
                class="flex"
                :class="msg.role === 'AI' ? 'justify-start' : 'justify-end'"
              >
                <div class="max-w-[75%] space-y-1">
                  <div
                    class="rounded-lg px-4 py-2 shadow-sm text-sm"
                    :class="
                      msg.role === 'AI'
                        ? 'bg-white border border-gray-200 text-gray-800'
                        : 'bg-blue-500 text-white'
                    "
                  >
                    {{ msg.content }}
                  </div>
                  <div
                    v-if="msg.score"
                    class="text-xs text-right text-green-600 font-semibold"
                  >
                    ⭐ Điểm: {{ msg.score }}
                  </div>
                  <div
                    v-if="msg.analysis"
                    class="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-xs text-yellow-800"
                  >
                    📝 {{ msg.analysis }}
                  </div>
                  <div
                    v-if="msg.correction"
                    class="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-800 space-y-1"
                  >
                    <div>
                      ✅ <strong>Sửa:</strong>
                      {{ msg.correction.fixed_sentence }}
                    </div>
                    <div>💡 {{ msg.correction.explanation }}</div>
                  </div>
                </div>
              </div>

              <!-- Typing indicator -->
              <div v-if="replying" class="flex justify-start">
                <div
                  class="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm"
                >
                  <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Input -->
            <div class="border-t border-gray-200 p-4 bg-white">
              <div class="flex gap-2">
                <a-input
                  v-model="userInput"
                  placeholder="Nhập câu trả lời..."
                  size="large"
                  :disabled="replying"
                  @pressEnter="sendReply"
                />
                <a-button
                  type="primary"
                  size="large"
                  :loading="replying"
                  :disabled="!userInput.trim()"
                  @click="sendReply"
                >
                  <a-icon type="send" />
                  Gửi
                </a-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getLessons,
  startConversation,
  replyConversation,
  getLearnedHistory,
} from "~/apis/conversation";

export default {
  name: "ConversationPage",
  layout: "pageLayout",
  middleware: "auth",

  data() {
    return {
      lessons: [],
      loadingLessons: true,
      selectedLesson: null,
      sessionId: null,
      messages: [],
      userInput: "",
      starting: false,
      replying: false,
    };
  },

  mounted() {
    this.loadLessons();
  },

  methods: {
    async loadLessons() {
      this.loadingLessons = true;
      try {
        const response = await getLessons();
        if (response.status === "success" && response.data) {
          this.lessons = response.data;
        }
      } catch (error) {
        this.$message.error("Không thể tải danh sách bài hội thoại");
      } finally {
        this.loadingLessons = false;
      }
    },

    async startLesson(lesson) {
      this.selectedLesson = lesson;
      this.messages = [];
      this.sessionId = null;
      this.userInput = "";
      this.starting = true;

      try {
        if (lesson.is_learn) {
          // Nếu đã học, hiển thị lịch sử học
          const response = await getLearnedHistory(lesson.id);
          if (response.status === "success" && response.data) {
            // response.data chứa turns array
            const turns = response.data.turns || [];
            if (Array.isArray(turns) && turns.length > 0) {
              this.messages = turns.map((msg) => ({
                role: msg.role,
                content: msg.content,
                analysis: msg.analysis,
                correction: msg.correction,
                score: msg.score,
              }));
            } else {
              this.messages = [{
                role: "AI",
                content: "Chưa có lịch sử học tập cho bài này",
              }];
            }
            this.scrollToBottom();
          }
        } else {
          // Nếu chưa học, bắt đầu cuộc hội thoại mới
          const response = await startConversation(lesson.id);
          if (response.status === "success" && response.data) {
            this.sessionId = response.data.sessionId;
            this.messages.push({
              role: "AI",
              content: response.data.content,
            });
            this.scrollToBottom();
          }
        }
      } catch (error) {
        this.$message.error("Không thể tải bài hội thoại");
      } finally {
        this.starting = false;
      }
    },

    async sendReply() {
      if (!this.userInput.trim() || !this.sessionId) return;

      const userMessage = this.userInput.trim();
      this.userInput = "";

      // Thêm tin nhắn người dùng
      this.messages.push({ role: "USER", content: userMessage });
      this.scrollToBottom();

      this.replying = true;
      try {
        const response = await replyConversation(this.sessionId, userMessage);
        if (response.status === "success" && response.data) {
          const data = response.data;
          this.messages.push({
            role: "AI",
            content: data.content,
            analysis: data.analysis,
            correction: data.correction,
            score: data.score,
          });
          this.scrollToBottom();
        }
      } catch (error) {
        this.$message.error("Không thể gửi tin nhắn");
      } finally {
        this.replying = false;
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const el = this.$refs.chatMessages;
        if (el) el.scrollTop = el.scrollHeight;
      });
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1400px;
}

.typing-dots {
  display: flex;
  align-items: center;
  gap: 4px;
}

.typing-dots span {
  width: 8px;
  height: 8px;
  background-color: #93c5fd;
  border-radius: 50%;
  display: inline-block;
  animation: typing-bounce 1.2s infinite ease-in-out;
}

.typing-dots span:nth-child(1) { animation-delay: 0s; }
.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing-bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
}
</style>
