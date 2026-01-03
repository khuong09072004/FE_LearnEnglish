<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
  >
    <!-- Animated Background -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
      ></div>
      <div
        class="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 1s"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 2s"
      ></div>
    </div>

    <div class="relative container mx-auto px-4 py-6 max-w-7xl">
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold flex items-center gap-3">
            <span class="text-4xl">💬</span>
            Chat Room
            <span
              class="w-3 h-3 rounded-full animate-pulse"
              :class="isConnected ? 'bg-green-400' : 'bg-gray-500'"
            ></span>
          </h1>
          <p class="text-gray-600 mt-1">Kết nối và trò chuyện với mọi người</p>
        </div>

        <!-- Reconnect Button (show only when disconnected) -->
        <a-button
          v-if="!isConnected && !connecting"
          type="primary"
          ghost
          @click="connectWebSocket"
          style="border-color: white; color: white"
        >
          <a-icon type="reload" /> Kết nối lại
        </a-button>
        <a-spin v-if="connecting" />
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Topics List -->
        <div class="lg:col-span-4">
          <div
            class="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
          >
            <div class="p-4 border-b border-white/10">
              <h3 class="font-semibold text-lg flex items-center gap-2">
                <span class="text-xl">🎯</span> Chọn phòng chat
              </h3>
              <p class="text-gray-600 text-sm mt-1">
                {{ topics.length }} phòng đang hoạt động
              </p>
            </div>

            <div class="p-3">
              <div v-if="loadingTopics" class="text-center py-8">
                <a-spin />
                <p class="text-gray-400 mt-2 text-sm">Đang tải...</p>
              </div>
              <div
                v-else
                class="space-y-2 max-h-[550px] overflow-y-auto custom-scrollbar"
              >
                <TopicCard
                  v-for="topic in topics"
                  :key="`chat-${topic.id}`"
                  :topic="topic"
                  :isActive="chatTopicId === topic.id"
                  @click="openJoinDialog"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Room -->
        <div class="lg:col-span-8">
          <div
            class="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl overflow-hidden flex flex-col"
            style="height: 650px"
          >
            <!-- Chat Header -->
            <div
              class="p-4 border-b border-white/10 bg-gradient-to-r from-blue-600/50 to-pink-600/50"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div
                    v-if="chatTopicId"
                    class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl"
                  >
                    {{ getTopicEmoji(chatTopicId) }}
                  </div>
                  <div>
                    <h2 class="text-xl font-bold">
                      {{
                        chatTopicId
                          ? getTopicName(chatTopicId)
                          : "👋 Chào mừng!"
                      }}
                    </h2>
                    <p class="text-gray-600 text-sm">
                      {{
                        chatTopicId
                          ? `${
                              chatMessages.filter((m) => m.type !== "system")
                                .length
                            } tin nhắn`
                          : "Chọn phòng chat để bắt đầu"
                      }}
                    </p>
                  </div>
                </div>

                <!-- Leave Room Button -->
                <a-button
                  v-if="chatTopicId"
                  type="danger"
                  ghost
                  @click="showLeaveConfirm"
                  class="border-red-400/50 text-red-300 hover:bg-red-500/20"
                >
                  <a-icon type="logout" /> Rời phòng
                </a-button>
              </div>
            </div>

            <!-- Chat Messages -->
            <div
              ref="chatMessages"
              class="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
            >
              <!-- Loading Messages -->
              <div v-if="loadingMessages" class="text-center py-12">
                <a-spin size="large" />
                <p class="text-gray-400 mt-3">Đang tải tin nhắn...</p>
              </div>

              <!-- Welcome Screen -->
              <div v-else-if="!chatTopicId" class="text-center py-16">
                <div class="text-8xl mb-4 animate-bounce">💭</div>
                <h3 class="text-2xl font-bold mb-2">Bắt đầu trò chuyện</h3>
                <p class="text-gray-600 max-w-md mx-auto">
                  Chọn một phòng chat từ danh sách bên trái để tham gia cuộc trò
                  chuyện với mọi người
                </p>
              </div>

              <!-- Empty Messages -->
              <div
                v-else-if="chatMessages.length === 0"
                class="text-center py-16"
              >
                <div class="text-6xl mb-4">🎉</div>
                <h3 class="text-xl font-bold mb-2">Phòng chat trống</h3>
                <p class="text-gray-400">Hãy là người đầu tiên gửi tin nhắn!</p>
              </div>

              <!-- Messages -->
              <template v-else>
                <ChatMessageItem
                  v-for="(msg, index) in chatMessages"
                  :key="index"
                  :message="msg"
                  :currentUser="$store.getters['auth/user']"
                  class="animate-fadeIn mb-4"
                  @edit="showEditModal"
                  @delete="confirmDeleteMessage"
                />
              </template>
            </div>

            <!-- Chat Input -->
            <div class="p-4 border-t border-white/10 bg-white/5">
              <div class="flex gap-3">
                <a-input
                  v-model="messageInput"
                  placeholder="Nhập tin nhắn..."
                  size="large"
                  @pressEnter="sendChatMessage"
                  :disabled="!isConnected || !chatTopicId"
                  class="chat-input flex-1"
                />
                <a-button
                  type="primary"
                  size="large"
                  @click="sendChatMessage"
                  :disabled="
                    !isConnected || !chatTopicId || !messageInput.trim()
                  "
                  :loading="sending"
                  style="border: none; font-weight: bold; border-radius: 4px"
                  class="px-6"
                >
                  Gửi
                </a-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Join Room Modal -->
    <a-modal
      v-model="joinModalVisible"
      :footer="null"
      :closable="false"
      centered
      :bodyStyle="{ padding: 0 }"
      :width="400"
      class="join-modal"
    >
      <div class="bg-blue-400 p-6 text-center">
        <div class="text-5xl mb-3">
          {{ selectedTopic ? getTopicEmoji(selectedTopic.id) : "💬" }}
        </div>
        <h3 class="text-xl font-bold text-white">{{ selectedTopic?.name }}</h3>
        <p class="text-white text-sm mt-1">Bạn muốn tham gia phòng chat này?</p>
      </div>
      <div class="p-6 bg-white">
        <div class="flex gap-3">
          <a-button block size="large" @click="joinModalVisible = false">
            Hủy
          </a-button>
          <a-button
            block
            size="large"
            type="primary"
            :loading="loadingMessages"
            @click="confirmJoinRoom"
            style="
              background: #4facfe;
              border: none;
              color: white;
              border-radius: 4px;
              font-weight: bold;
            "
          >
            Vào phòng
          </a-button>
        </div>
      </div>
    </a-modal>

    <!-- Edit Message Modal -->
    <a-modal
      v-model="editModalVisible"
      :footer="null"
      centered
      :width="480"
      class="edit-message-modal"
    >
      <div class="modal-header">
        <h3 class="text-lg font-semibold text-black">Chỉnh sửa tin nhắn</h3>
      </div>
      <div class="modal-content">
        <a-textarea
          v-model="editingContent"
          placeholder="Nhập nội dung tin nhắn..."
          :rows="4"
          :maxLength="500"
          class="message-textarea"
        />
        <div class="text-xs text-gray-400 mt-1 text-right">
          {{ editingContent.length }}/500
        </div>
      </div>
      <div class="modal-footer">
        <a-button @click="editModalVisible = false" size="large" class="cancel-btn">
          Hủy
        </a-button>
        <a-button
          type="primary"
          @click="handleEditMessage"
          size="large"
          class="save-btn"
        >
          Lưu thay đổi
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { getListTopic } from "~/apis/vocabularies";
import chatService from "~/services/chatService";
import chatConnectionMixin from "~/mixins/chatConnectionMixin";
import chatMessagesMixin from "~/mixins/chatMessagesMixin";
import TopicCard from "~/components/Chat/TopicCard.vue";
import ChatMessageItem from "~/components/Chat/ChatMessageItem.vue";

export default {
  name: "ChatPage",
  layout: "pageLayout",
  
  mixins: [chatConnectionMixin, chatMessagesMixin],

  components: {
    TopicCard,
    ChatMessageItem,
  },

  data() {
    return {
      topics: [],
      loadingTopics: true,

      chatTopicId: null,
      messageInput: "",

      // Modal
      joinModalVisible: false,
      selectedTopic: null,
    };
  },

  mounted() {
    this.loadTopics();
    this.initChatService();
    this.connectToChat();
  },

  beforeDestroy() {
    this.disconnectChat();
  },

  methods: {
    async loadTopics() {
      this.loadingTopics = true;
      try {
        const response = await getListTopic();
        if (response.status === "success" && response.data) {
          this.topics = response.data;
        }
      } catch (error) {
        console.error("Error loading topics:", error);
        this.$message.error("Không thể tải danh sách chủ đề");
      } finally {
        this.loadingTopics = false;
      }
    },

    getTopicName(topicId) {
      const topic = this.topics.find((t) => t.id === topicId);
      return topic ? topic.name : `Topic ${topicId}`;
    },

    getTopicEmoji(topicId) {
      const emojis = [
        "💬",
        "🎯",
        "📚",
        "🌟",
        "🎨",
        "🎵",
        "🏆",
        "💡",
        "🔥",
        "✨",
      ];
      return emojis[topicId % emojis.length];
    },

    // ========== Join/Leave Room ==========
    openJoinDialog(topic) {
      if (this.chatTopicId === topic.id) return; // Already in this room
      if (!this.isConnected) {
        this.$message.warning("Đang kết nối, vui lòng đợi...");
        return;
      }
      this.selectedTopic = topic;
      this.joinModalVisible = true;
    },

    async confirmJoinRoom() {
      if (!this.selectedTopic) return;
      await this.joinChatTopic(this.selectedTopic.id);
      this.joinModalVisible = false;
      this.selectedTopic = null;
    },

    showLeaveConfirm() {
      this.$confirm({
        title: "Rời phòng chat?",
        content: `Bạn có chắc muốn rời khỏi phòng "${this.getTopicName(
          this.chatTopicId
        )}"?`,
        okText: "Rời phòng",
        okType: "danger",
        cancelText: "Ở lại",
        centered: true,
        onOk: () => {
          this.leaveRoom();
        },
      });
    },

    leaveRoom() {
      this.addSystemMessage(
        `👋 Đã rời khỏi ${this.getTopicName(this.chatTopicId)}`
      );
      this.chatTopicId = null;
      this.chatMessages = [];
      this.$message.info("Đã rời phòng chat");
    },

    // ========== Chat Service Methods ==========
    // Đã chuyển sang chatConnectionMixin

    disconnectWebSocket() {
      this.addSystemMessage("🔻 Đang ngắt kết nối...");
      this.disconnectChat();
      this.chatTopicId = null;
    },

    async joinChatTopic(topicId) {
      if (!this.isConnected) {
        this.$message.warning("Vui lòng đợi kết nối");
        return;
      }

      if (this.chatTopicId) {
        this.addSystemMessage(
          `🚪 Rời khỏi ${this.getTopicName(this.chatTopicId)}`
        );
      }

      this.chatTopicId = topicId;
      this.chatMessages = [];
      this.addSystemMessage(`📡 Tham gia ${this.getTopicName(topicId)}...`);

      try {
        // Load lịch sử tin nhắn
        await this.loadChatHistory(topicId);

        // Subscribe để nhận tin nhắn mới
        await chatService.subscribeToTopic(topicId, (message) => {
          this.handleIncomingMessage(message);
        });

        this.addSystemMessage(`✅ Đã tham gia ${this.getTopicName(topicId)}`);
      } catch (error) {
        this.addSystemMessage(`❌ Lỗi: ${error.message}`);
        console.error("Subscribe error:", error);
      }
    },

    // Các methods xử lý messages đã chuyển sang chatMessagesMixin
    // - sendChatMessage()
    // - handleIncomingMessage()
    // - loadChatHistory()
    // - addSystemMessage()
    // - scrollToBottom()
    // - formatTime()
    // - showEditModal()
    // - handleEditMessage()
    // - confirmDeleteMessage()
    // - handleDeleteMessage()
  },
};
</script>

<style scoped>
.container {
  max-width: 1400px;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.chat-input >>> .ant-input {
  background: rgba(255, 255, 255, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  color: #1f2937 !important;
  border-radius: 12px !important;
}

.chat-input >>> .ant-input::placeholder {
  color: rgba(107, 114, 128, 0.8) !important;
}

.chat-input >>> .ant-input:focus {
  border-color: rgba(168, 85, 247, 0.8) !important;
  box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.3) !important;
  background: white !important;
}

.chat-input >>> .ant-input:disabled {
  background: rgba(255, 255, 255, 0.5) !important;
  color: rgba(107, 114, 128, 0.6) !important;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

.edit-message-modal >>> .ant-modal-content {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.edit-message-modal >>> .ant-modal-body {
  padding: 0;
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-content {
  padding: 20px 24px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: #f9fafb;
}

.message-textarea >>> .ant-input {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  padding: 10px 12px;
  transition: all 0.2s;
  color: #1f2937;
  line-height: 1.5;
}

.message-textarea >>> .ant-input:hover {
  border-color: #2563eb;
}

.message-textarea >>> .ant-input:focus {
  background: white;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  outline: none;
}

.cancel-btn {
  border: 1px solid #d1d5db;
  color: #6b7280;
  border-radius: 6px;
}

.cancel-btn:hover {
  border-color: #9ca3af;
  color: #374151;
}

.save-btn {
  background: #2563eb;
  border: none;
  border-radius: 6px;
  font-weight: 500;
}

.save-btn:hover {
  background: #1d4ed8;
}

.join-modal >>> .ant-modal-content {
  border-radius: 16px !important;
  overflow: hidden;
}

.join-modal >>> .ant-modal-body {
  padding: 0 !important;
}
</style>
