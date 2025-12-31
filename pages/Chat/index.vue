<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
    <!-- Animated Background -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
      <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
    </div>

    <div class="relative container mx-auto px-4 py-6 max-w-7xl">
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold  flex items-center gap-3">
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
          style="border-color: white; color: white;"
        >
          <a-icon type="reload" /> Kết nối lại
        </a-button>
        <a-spin v-if="connecting" />
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Topics List -->
        <div class="lg:col-span-4">
          <div class="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
            <div class="p-4 border-b border-white/10">
              <h3 class=" font-semibold text-lg flex items-center gap-2">
                <span class="text-xl">🎯</span> Chọn phòng chat
              </h3>
              <p class="text-gray-600 text-sm mt-1">{{ topics.length }} phòng đang hoạt động</p>
            </div>
            
            <div class="p-3">
              <div v-if="loadingTopics" class="text-center py-8">
                <a-spin />
                <p class="text-gray-400 mt-2 text-sm">Đang tải...</p>
              </div>
              <div v-else class="space-y-2 max-h-[550px] overflow-y-auto custom-scrollbar">
                <div
                  v-for="topic in topics"
                  :key="`chat-${topic.id}`"
                  class="group p-4 rounded-xl cursor-pointer transition-all duration-300 border"
                  :class="chatTopicId === topic.id 
                    ? 'bg-gradient-to-r from-blue-500/30 to-pink-500/30 border-blue-400/50 shadow-lg shadow-blue-500/20' 
                    : 'border-white/10 hover:bg-white/10 hover:border-white/20'"
                  @click="openJoinDialog(topic)"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div 
                        class="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                        :class="chatTopicId === topic.id ? 'bg-blue-500' : 'bg-white/10'"
                      >
                        {{ getTopicEmoji(topic.id) }}
                      </div>
                      <div>
                        <div class="font-semibold  group-hover:text-blue-300 transition">
                          {{ topic.name }}
                        </div>
                        <div class="text-xs text-gray-600 flex items-center gap-1">
                          <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                          Online
                        </div>
                      </div>
                    </div>
                    <a-icon 
                      v-if="chatTopicId === topic.id"
                      type="check-circle" 
                      theme="filled"
                      class="text-blue-400 text-lg"
                    />
                    <a-icon 
                      v-else
                      type="right" 
                      class="text-gray-500  transition opacity-0 group-hover:opacity-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Room -->
        <div class="lg:col-span-8">
          <div class="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl overflow-hidden flex flex-col" style="height: 650px;">
            <!-- Chat Header -->
            <div class="p-4 border-b border-white/10 bg-gradient-to-r from-blue-600/50 to-pink-600/50">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div 
                    v-if="chatTopicId"
                    class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl"
                  >
                    {{ getTopicEmoji(chatTopicId) }}
                  </div>
                  <div>
                    <h2 class="text-xl font-bold ">
                      {{ chatTopicId ? getTopicName(chatTopicId) : '👋 Chào mừng!' }}
                    </h2>
                    <p class="text-gray-600 text-sm">
                      {{ chatTopicId ? `${chatMessages.filter(m => m.type !== 'system').length} tin nhắn` : 'Chọn phòng chat để bắt đầu' }}
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
            <div ref="chatMessages" class="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              <!-- Loading Messages -->
              <div v-if="loadingMessages" class="text-center py-12">
                <a-spin size="large" />
                <p class="text-gray-400 mt-3">Đang tải tin nhắn...</p>
              </div>

              <!-- Welcome Screen -->
              <div v-else-if="!chatTopicId" class="text-center py-16">
                <div class="text-8xl mb-4 animate-bounce">💭</div>
                <h3 class="text-2xl font-bold  mb-2">Bắt đầu trò chuyện</h3>
                <p class="text-gray-600 max-w-md mx-auto">
                  Chọn một phòng chat từ danh sách bên trái để tham gia cuộc trò chuyện với mọi người
                </p>
              </div>

              <!-- Empty Messages -->
              <div v-else-if="chatMessages.length === 0" class="text-center py-16">
                <div class="text-6xl mb-4">🎉</div>
                <h3 class="text-xl font-bold  mb-2">Phòng chat trống</h3>
                <p class="text-gray-400">Hãy là người đầu tiên gửi tin nhắn!</p>
              </div>

              <!-- Messages -->
              <template v-else>
                <div
                  v-for="(msg, index) in chatMessages"
                  :key="index"
                  class="flex animate-fadeIn"
                  :class="msg.isOwn ? 'justify-end' : 'justify-start'"
                >
                  <!-- System Message -->
                  <div 
                    v-if="msg.type === 'system'"
                    class="w-full text-center"
                  >
                    <span class="inline-block px-4 py-1 rounded-full bg-white/5 text-gray-400 text-sm border border-white/10">
                      {{ msg.content }}
                    </span>
                  </div>

                  <!-- User Message -->
                  <template v-else>
                    <!-- Avatar - Left -->
                    <div v-if="!msg.isOwn" class="mr-3 flex-shrink-0">
                      <a-avatar
                        v-if="msg.senderAvatar"
                        :src="msg.senderAvatar"
                        :size="40"
                        class="ring-2 ring-white/20"
                      />
                      <a-avatar
                        v-else
                        :size="40"
                        class="ring-2 ring-blue-400/50"
                        style="backgroundColor: #7c3aed"
                      >
                        {{ (msg.senderName || 'U')[0].toUpperCase() }}
                      </a-avatar>
                    </div>

                    <div
                      class="max-w-[70%] rounded-2xl px-4 py-3 shadow-lg"
                      :class="msg.isOwn 
                        ? 'bg-gradient-to-r from-blue-500 to-pink-500  rounded-br-sm' 
                        : 'bg-white/10 backdrop-blur border border-white/10  rounded-bl-sm'"
                    >
                      <div v-if="!msg.isOwn" class="text-xs font-semibold mb-1 text-blue-500">
                        {{ msg.senderName || 'User' }}
                      </div>
                      <div class="text-sm break-words leading-relaxed">{{ msg.content }}</div>
                      <div class="text-xs mt-2 opacity-60 text-right">
                        {{ formatTime(msg.timestamp) }}
                      </div>
                    </div>

                    <!-- Avatar - Right -->
                    <div v-if="msg.isOwn" class="ml-3 flex-shrink-0">
                      <a-avatar
                        v-if="$store.getters['auth/user']?.avatar"
                        :src="$store.getters['auth/user'].avatar"
                        :size="40"
                        class="ring-2 ring-blue-400/50"
                      />
                      <a-avatar
                        v-else
                        :size="40"
                        class="ring-2 ring-pink-400/50"
                        style="backgroundColor: #ec4899"
                      >
                        {{ ($store.getters['auth/user']?.name || 'Me')[0].toUpperCase() }}
                      </a-avatar>
                    </div>
                  </template>
                </div>
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
                  :disabled="!isConnected || !chatTopicId || !messageInput.trim()"
                  :loading="sending"
                  style=" border: none; font-weight: bold;   border-radius: 4px;"
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
      <div class="bg-blue-400 p-6 text-center ">
        <div class="text-5xl mb-3">{{ selectedTopic ? getTopicEmoji(selectedTopic.id) : '💬' }}</div>
        <h3 class="text-xl font-bold text-white">{{ selectedTopic?.name }}</h3>
        <p class="text-white text-sm mt-1">Bạn muốn tham gia phòng chat này?</p>
      </div>
      <div class="p-6 bg-white">
        <div class="flex gap-3">
          <a-button 
            block 
            size="large"
            @click="joinModalVisible = false"
          >
            Hủy
          </a-button>
          <a-button 
            block 
            size="large"
            type="primary"
            :loading="loadingMessages"
            @click="confirmJoinRoom"
            style="background:  #4facfe; border: none; color: white; border-radius: 4px; font-weight: bold;"
          >
            Vào phòng
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { getListTopic } from '~/apis/vocabularies';
import { getMessages } from '~/apis/chat';
import chatService from '~/services/chatService';

export default {
  name: 'ChatPage',
  layout: 'pageLayout',
  
  data() {
    return {
      topics: [],
      loadingTopics: true,
      
      chatTopicId: null,
      isConnected: false,
      connecting: false,
      chatMessages: [],
      messageInput: '',
      sending: false,
      loadingMessages: false,
      
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
        if (response.status === 'success' && response.data) {
          this.topics = response.data;
        }
      } catch (error) {
        console.error('Error loading topics:', error);
        this.$message.error('Không thể tải danh sách chủ đề');
      } finally {
        this.loadingTopics = false;
      }
    },

    getTopicName(topicId) {
      const topic = this.topics.find(t => t.id === topicId);
      return topic ? topic.name : `Topic ${topicId}`;
    },

    getTopicEmoji(topicId) {
      const emojis = ['💬', '🎯', '📚', '🌟', '🎨', '🎵', '🏆', '💡', '🔥', '✨'];
      return emojis[topicId % emojis.length];
    },

    // ========== Join/Leave Room ==========
    openJoinDialog(topic) {
      if (this.chatTopicId === topic.id) return; // Already in this room
      if (!this.isConnected) {
        this.$message.warning('Đang kết nối, vui lòng đợi...');
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
        title: 'Rời phòng chat?',
        content: `Bạn có chắc muốn rời khỏi phòng "${this.getTopicName(this.chatTopicId)}"?`,
        okText: 'Rời phòng',
        okType: 'danger',
        cancelText: 'Ở lại',
        centered: true,
        onOk: () => {
          this.leaveRoom();
        }
      });
    },

    leaveRoom() {
      this.addSystemMessage(`👋 Đã rời khỏi ${this.getTopicName(this.chatTopicId)}`);
      this.chatTopicId = null;
      this.chatMessages = [];
      this.$message.info('Đã rời phòng chat');
    },

    // ========== Chat Service Methods ==========
    initChatService() {
      // Đăng ký các event listeners
      chatService.on('onConnect', () => {
        this.isConnected = true;
        this.connecting = false;
      });

      chatService.on('onDisconnect', () => {
        this.isConnected = false;
      });

      chatService.on('onError', (error) => {
        this.isConnected = false;
        this.connecting = false;
        this.$message.error('Không thể kết nối');
      });
    },

    async connectToChat() {
      this.connecting = true;

      try {
        await chatService.connect();
      } catch (error) {
        console.error('Connect error:', error);
        if (error.message === 'Không tìm thấy token') {
          this.$message.error('Vui lòng đăng nhập để sử dụng chat');
          this.$router.push('/Login');
        }
      }
    },

    async disconnectChat() {
      try {
        await chatService.disconnect();
      } catch (error) {
        console.error('Disconnect error:', error);
      }
    },

    connectWebSocket() {
      this.connectToChat();
    },

    disconnectWebSocket() {
      this.addSystemMessage('🔻 Đang ngắt kết nối...');
      this.disconnectChat();
      this.chatTopicId = null;
    },

    async joinChatTopic(topicId) {
      if (!this.isConnected) {
        this.$message.warning('Vui lòng đợi kết nối');
        return;
      }

      if (this.chatTopicId) {
        this.addSystemMessage(`🚪 Rời khỏi ${this.getTopicName(this.chatTopicId)}`);
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
        console.error('Subscribe error:', error);
      }
    },

    async sendChatMessage() {
      if (!this.isConnected || !this.chatTopicId) return;

      const content = this.messageInput.trim();
      if (!content) return;

      this.sending = true;

      try {
        await chatService.sendMessage(this.chatTopicId, content);
        this.messageInput = '';
      } catch (error) {
        this.$message.error('Gửi thất bại');
        console.error('Send error:', error);
      } finally {
        this.sending = false;
      }
    },

    handleIncomingMessage(message) {
      const user = this.$store.getters['auth/user'];
      const currentUserId = user?.id || user?.userId;

      this.chatMessages.push({
        content: message.content,
        senderName: message.senderName || message.senderId,
        senderId: message.senderId,
        senderAvatar: message.senderAvatar,
        timestamp: message.timestamp || new Date(),
        isOwn: message.senderId === currentUserId,
        type: 'message'
      });

      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },

    async loadChatHistory(topicId) {
      this.loadingMessages = true;
      try {
        const response = await getMessages(topicId, 0, 50);
        
        if (response.status === 'success' && response.data) {
          const user = this.$store.getters['auth/user'];
          const currentUserId = user?.id || user?.userId;
          
          // Đảo ngược mảng để hiển thị tin nhắn cũ nhất trước
          const messages = response.data.reverse().map(msg => ({
            content: msg.content,
            senderName: msg.senderName,
            senderId: msg.senderId,
            senderAvatar: msg.senderAvatar,
            timestamp: msg.sentAt,
            isOwn: msg.senderId === currentUserId,
            type: 'message'
          }));
          
          // Thêm tin nhắn lịch sử vào đầu
          this.chatMessages = [...messages, ...this.chatMessages];
          
          this.$nextTick(() => {
            this.scrollToBottom();
          });
        }
      } catch (error) {
        console.error('Load chat history error:', error);
        this.$message.warning('Không thể tải lịch sử chat');
      } finally {
        this.loadingMessages = false;
      }
    },

    addSystemMessage(content) {
      this.chatMessages.push({
        content,
        type: 'system',
        timestamp: new Date(),
        isOwn: false
      });

      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },

    scrollToBottom() {
      if (this.$refs.chatMessages) {
        this.$refs.chatMessages.scrollTop = this.$refs.chatMessages.scrollHeight;
      }
    },

    formatTime(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      return date.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1400px;
}

/* Custom Scrollbar */
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

/* Chat Input Styling */
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

/* Animations */
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

/* Modal Styling */
.join-modal >>> .ant-modal-content {
  border-radius: 16px !important;
  overflow: hidden;
}

.join-modal >>> .ant-modal-body {
  padding: 0 !important;
}
</style>
