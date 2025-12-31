<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <div class="container mx-auto px-4 py-6 max-w-7xl">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800">
          💬 Hội thoại
        </h1>
        <p class="text-gray-600 mt-2">Học tiếng Anh qua các cuộc trò chuyện mẫu</p>
      </div>

      <!-- Loading Topics -->
      <div v-if="loadingTopics" class="flex justify-center items-center py-12">
        <a-spin size="large" />
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Topics List - Left Side -->
        <div class="lg:col-span-5 space-y-3">
          <div
            v-for="topic in topics"
            :key="topic.id"
            class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition"
          >
            <!-- Topic Header -->
            <div
              class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition"
              @click="toggleTopic(topic.id)"
            >
              <h3 class="font-semibold text-gray-800">
                TOPIC {{ topic.id }}: {{ topic.name }}
              </h3>
              <a-icon
                :type="expandedTopics.includes(topic.id) ? 'up' : 'down'"
                class="text-gray-500"
              />
            </div>

            <!-- Conversations List (Expandable) -->
            <div
              v-if="expandedTopics.includes(topic.id)"
              class="border-t border-gray-200 bg-gray-50"
            >
              <div v-if="loadingConversations" class="p-4 text-center">
                <a-spin size="small" />
              </div>
              <div v-else-if="topic.conversations && topic.conversations.length > 0">
                <div
                  v-for="conv in topic.conversations"
                  :key="conv.id"
                  class="p-4 border-b border-gray-200 last:border-0 hover:bg-white cursor-pointer transition"
                  :class="{ 'bg-blue-50': selectedConversation && selectedConversation.id === conv.id }"
                  @click="selectConversation(conv)"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-gray-700">{{ conv.title || `Conversation ${conv.id}` }}</span>
                    <a-icon type="right" class="text-gray-400" />
                  </div>
                </div>
              </div>
              <div v-else class="p-4 text-center text-gray-500 text-sm">
                Chưa có hội thoại
              </div>
            </div>
          </div>
        </div>

        <!-- Conversation Detail - Right Side -->
        <div class="lg:col-span-7">
          <div v-if="selectedConversation" class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <!-- Conversation Header -->
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <h2 class="text-2xl font-bold mb-2">
                {{ selectedConversation.title || 'Conversation' }}
              </h2>
              <p class="text-blue-100 text-sm">
                {{ selectedConversation.description || 'Practice your English conversation skills' }}
              </p>
            </div>

            <!-- Conversation Content -->
            <div class="p-6">
              <div v-if="loadingDetail" class="text-center py-12">
                <a-spin size="large" />
              </div>
              <div v-else-if="conversationDetail" class="space-y-4">
                <!-- Conversation Messages -->
                <div
                  v-for="(message, index) in conversationDetail.messages"
                  :key="index"
                  class="flex"
                  :class="message.speaker === 'A' ? 'justify-start' : 'justify-end'"
                >
                  <div
                    class="max-w-[80%] rounded-lg p-4 shadow-sm"
                    :class="message.speaker === 'A' ? 'bg-gray-100' : 'bg-blue-500 text-white'"
                  >
                    <div class="font-semibold text-sm mb-1">
                      {{ message.speaker === 'A' ? 'Person A' : 'Person B' }}
                    </div>
                    <p class="text-sm">{{ message.text }}</p>
                    <div v-if="message.audio" class="mt-2">
                      <button
                        @click="playAudio(message.audio)"
                        class="flex items-center gap-2 text-xs"
                        :class="message.speaker === 'A' ? 'text-blue-600' : 'text-blue-100'"
                      >
                        <a-icon type="sound" />
                        <span>Nghe</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Vocabulary Section -->
                <div v-if="conversationDetail.vocabulary && conversationDetail.vocabulary.length > 0" class="mt-8 pt-6 border-t border-gray-200">
                  <h3 class="font-semibold text-gray-800 mb-4">📚 Từ vựng</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div
                      v-for="(vocab, index) in conversationDetail.vocabulary"
                      :key="index"
                      class="bg-blue-50 rounded-lg p-3"
                    >
                      <div class="font-semibold text-blue-700">{{ vocab.word }}</div>
                      <div class="text-sm text-gray-600">{{ vocab.meaning }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <div class="text-6xl mb-4">💬</div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              Chọn một hội thoại
            </h3>
            <p class="text-gray-600">
              Chọn một topic và hội thoại từ danh sách bên trái để bắt đầu học
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
        <!-- Chat Topics List -->
        <div class="lg:col-span-4">
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div class="bg-gradient-to-r from-purple-500 to-purple-600 p-4">
              <h3 class="text-white font-semibold text-lg">🎯 Chat Topics</h3>
            </div>
            
            <div class="p-4">
              <div v-if="loadingTopics" class="text-center py-8">
                <a-spin size="small" />
              </div>
              <div v-else class="space-y-2 max-h-96 overflow-y-auto">
                <div
                  v-for="topic in topics"
                  :key="`chat-${topic.id}`"
                  class="p-3 rounded-lg cursor-pointer transition border"
                  :class="chatTopicId === topic.id 
                    ? 'bg-purple-50 border-purple-300 shadow-sm' 
                    : 'border-gray-200 hover:bg-gray-50'"
                  @click="joinChatTopic(topic.id)"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-semibold text-gray-800">{{ topic.name }}</div>
                      <div class="text-xs text-gray-500">Topic {{ topic.id }}</div>
                    </div>
                    <a-badge
                      v-if="chatTopicId === topic.id"
                      status="processing"
                      text="Active"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Connection Status -->
          <div class="mt-4 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h4 class="font-semibold text-gray-800 mb-3">🔌 Kết nối</h4>
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Trạng thái:</span>
                <a-tag :color="isConnected ? 'green' : 'default'">
                  {{ isConnected ? '🟢 Online' : '⚫ Offline' }}
                </a-tag>
              </div>
              <div v-if="chatTopicId" class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Topic hiện tại:</span>
                <a-tag color="purple">{{ chatTopicId }}</a-tag>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Room -->
        <div class="lg:col-span-8">
          <div class="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden flex flex-col" style="height: 650px;">
            <!-- Chat Header -->
            <div class="bg-gradient-to-r from-purple-500 to-purple-600 p-4 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-xl font-bold">
                    {{ chatTopicId ? `Topic ${chatTopicId} - Chat Room` : 'Chat Room' }}
                  </h2>
                  <p class="text-purple-100 text-sm">
                    {{ isConnected ? 'Đang kết nối' : 'Chọn topic để bắt đầu chat' }}
                  </p>
                </div>
                <div class="flex gap-2">
                  <a-button
                    v-if="!isConnected"
                    type="primary"
                    ghost
                    size="small"
                    @click="connectWebSocket"
                    :loading="connecting"
                  >
                    <a-icon type="api" />
                    Kết nối
                  </a-button>
                  <a-button
                    v-else
                    danger
                    ghost
                    size="small"
                    @click="disconnectWebSocket"
                  >
                    <a-icon type="disconnect" />
                    Ngắt kết nối
                  </a-button>
                </div>
              </div>
            </div>

            <!-- Chat Messages -->
            <div ref="chatMessages" class="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
              <div v-if="chatMessages.length === 0" class="text-center py-12">
                <div class="text-6xl mb-3">💭</div>
                <p class="text-gray-500">Chưa có tin nhắn nào</p>
                <p class="text-gray-400 text-sm mt-1">
                  {{ chatTopicId ? 'Hãy gửi tin nhắn đầu tiên!' : 'Chọn topic để bắt đầu chat' }}
                </p>
              </div>

              <div
                v-for="(msg, index) in chatMessages"
                :key="index"
                class="flex animate-slideIn"
                :class="msg.isOwn ? 'justify-end' : 'justify-start'"
              >
                <div
                  class="max-w-[70%] rounded-lg px-4 py-2 shadow-sm"
                  :class="msg.isOwn 
                    ? 'bg-purple-500 text-white' 
                    : msg.type === 'system' 
                      ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' 
                      : 'bg-white border border-gray-200'"
                >
                  <div v-if="!msg.isOwn && msg.type !== 'system'" class="text-xs font-semibold mb-1 text-gray-600">
                    {{ msg.senderName || 'User' }}
                  </div>
                  <div class="text-sm break-words">{{ msg.content }}</div>
                  <div class="text-xs mt-1 opacity-70">
                    {{ formatTime(msg.timestamp) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Chat Input -->
            <div class="border-t border-gray-200 p-4 bg-white">
              <div class="flex gap-2">
                <a-input
                  v-model="messageInput"
                  placeholder="Nhập tin nhắn..."
                  size="large"
                  @pressEnter="sendChatMessage"
                  :disabled="!isConnected || !chatTopicId"
                />
                <a-button
                  type="primary"
                  size="large"
                  @click="sendChatMessage"
                  :disabled="!isConnected || !chatTopicId || !messageInput.trim()"
                  :loading="sending"
                >
                  <a-icon type="send" />
                  Gửi
                </a-button>
              </div>
              <div v-if="!isConnected || !chatTopicId" class="text-xs text-gray-500 mt-2">
                {{ !isConnected ? '⚠️ Hãy kết nối WebSocket trước' : '⚠️ Chọn topic để chat' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getConversationsByTopic, getConversationById } from '~/apis/conversation';
import { getListTopic } from '~/apis/vocabularies';

export default {
  name: 'ConversationPage',
  layout: 'pageLayout',
  middleware: 'auth',
  
  data() {
    return {
      topics: [],
      expandedTopics: [],
      selectedConversation: null,
      conversationDetail: null,
      loadingConversations: false,
      loadingDetail: false,
      loadingTopics: true,
    };
  },

  mounted() {
    this.loadTopics();
  },

  methods: {
    async loadTopics() {
      this.loadingTopics = true;
      try {
        const response = await getListTopic();
        if (response.status === 'success' && response.data) {
          this.topics = response.data.map(topic => ({
            ...topic,
            conversations: []
          }));
        }
      } catch (error) {
        console.error('Error loading topics:', error);
        this.$message.error('Không thể tải danh sách chủ đề');
      } finally {
        this.loadingTopics = false;
      }
    },

    async toggleTopic(topicId) {
      const index = this.expandedTopics.indexOf(topicId);
      if (index > -1) {
        this.expandedTopics.splice(index, 1);
      } else {
        this.expandedTopics.push(topicId);
        await this.loadConversations(topicId);
      }
    },

    async loadConversations(topicId) {
      const topic = this.topics.find(t => t.id === topicId);
      if (!topic || topic.conversations.length > 0) return;

      this.loadingConversations = true;
      try {
        const response = await getConversationsByTopic(topicId);
        if (response.status === 'success') {
          topic.conversations = response.data || [];
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
        this.$message.error('Không thể tải danh sách hội thoại');
      } finally {
        this.loadingConversations = false;
      }
    },

    async selectConversation(conversation) {
      this.selectedConversation = conversation;
      await this.loadConversationDetail(conversation.id);
    },

    async loadConversationDetail(conversationId) {
      this.loadingDetail = true;
      try {
        const response = await getConversationById(conversationId);
        if (response.status === 'success') {
          this.conversationDetail = response.data;
        }
      } catch (error) {
        console.error('Error loading conversation detail:', error);
        this.$message.error('Không thể tải chi tiết hội thoại');
      } finally {
        this.loadingDetail = false;
      }
    },

    playAudio(audioUrl) {
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play();
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1400px;
}
</style>
