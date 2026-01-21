<template>
  <div class="chatbot-widget">
    <!-- Floating Chat Button -->
    <transition name="fade-scale">
      <div v-if="!isChatOpen" class="chat-bubble" @click="toggleChat">
        <span class="bubble-text">Tôi có thể giúp gì cho bạn?</span>
        <div class="robot-icon">🤖</div>
      </div>
    </transition>

    <!-- Chat Window -->
    <transition name="slide-up">
      <div v-if="isChatOpen" class="chat-window">
        <!-- Chat Header -->
        <div class="chat-header">
          <div class="header-content">
            <div class="robot-avatar">🤖</div>
            <div>
              <h3>Trợ lý AI</h3>
              <span class="status">Online</span>
            </div>
          </div>
          <button class="close-btn" @click="toggleChat" type="button">✕</button>
        </div>

        <!-- Chat Box -->
        <div ref="chatBox" class="chat-box">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="['message', msg.role]"
          >
            <div 
              v-for="(line, i) in msg.text.split('\n')" 
              :key="i"
              class="message-line"
              v-html="formatMessage(line)"
            ></div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isTyping" class="message bot typing-indicator">
            <div class="typing-bubble">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
        </div>

        <!-- Chat Input Form -->
        <form class="chat-input-form" @submit.prevent="sendMessage">
          <input
            v-model="input"
            type="text"
            placeholder="Nhập câu hỏi..."
            required
          />
          <button type="submit" :disabled="loading">
            {{ loading ? '⏳' : 'Gửi' }}
          </button>
        </form>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'ChatBot',
  data() {
    return {
      input: '',
      loading: false,
      messages: [],
      isChatOpen: false,
      isTyping: false
    }
  },
  computed: {
    sessionId() {
      // Lấy userId từ store, fallback về random nếu chưa login
      const userId = this.$store.getters['auth/userId']
      return userId ? `user_${userId}` : 'guest_' + Math.random().toString(36).substring(2)
    }
  },
  watch: {
    messages() {
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    }
  },
  methods: {
    toggleChat() {
      this.isChatOpen = !this.isChatOpen
    },
    scrollToBottom() {
      if (this.$refs.chatBox) {
        this.$refs.chatBox.scrollTop = this.$refs.chatBox.scrollHeight
      }
    },
    formatMessage(text) {
      if (!text) return ''
      
      // Xử lý markdown cơ bản
      let formatted = text
        // Bold: **text** -> <strong>text</strong>
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic: *text* -> <em>text</em>
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // List items: - text -> bullet point
        .replace(/^- (.+)$/gm, '• $1')
        // Code inline: `code` -> <code>code</code>
        .replace(/`(.*?)`/g, '<code>$1</code>')
      
      return formatted || '&nbsp;'
    },
    async sendMessage() {
      if (!this.input) return

      const userText = this.input
      this.messages.push({ role: 'user', text: userText })
      this.input = ''
      this.loading = true
      this.isTyping = true

      try {
        const res = await fetch(
          'https://khuongba.app.n8n.cloud/webhook/chatbot-english',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              message: userText,
              sessionId: this.sessionId
            })
          }
        )

        const data = await res.json()
        console.log('AI RESPONSE:', data)

        this.messages.push({
          role: 'bot',
          text: data.reply
        })
      } catch (err) {
        this.messages.push({
          role: 'bot',
          text: '❌ Lỗi kết nối tới AI'
        })
      } finally {
        this.loading = false
        this.isTyping = false
      }
    }
  }
}
</script>

<style scoped>
/* Chatbot Widget Container */
.chatbot-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Floating Chat Bubble */
.chat-bubble {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 22px;
  background: #6491f1;
  color: white;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.4);
  transition: all 0.3s ease;
}

.chat-bubble:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(37, 99, 235, 0.5);
}

.bubble-text {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.robot-icon {
  font-size: 24px;
  animation: bounce-icon 2s ease-in-out infinite;
}

@keyframes bounce-icon {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

/* Chat Window */
.chat-window {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 400px;
  height: 600px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

/* Chat Header */
.chat-header {
  background: #1890ff;
  color: white;
  padding: 18px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.robot-avatar {
  font-size: 36px;
  line-height: 1;
}

.chat-header h3 {
  margin: 0;
  color:white;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.3;
}

.status {
  font-size: 12px;
  opacity: 0.95;
  font-weight: 400;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 26px;
  cursor: pointer;
  padding: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
  line-height: 1;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.close-btn:active {
  background: rgba(255, 255, 255, 0.25);
}

/* Chat Box */
.chat-box {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chat-box::-webkit-scrollbar {
  width: 6px;
}

.chat-box::-webkit-scrollbar-track {
  background: transparent;
}

.chat-box::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 10px;
}

.chat-box::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

.message {
  margin-bottom: 16px;
  animation: fade-in-up 0.4s ease-out;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user {
  align-items: flex-end;
}

.user p,
.user .message-line {
  background: #2563eb;
  color: white;
  padding: 11px 16px;
  border-radius: 18px 18px 4px 18px;
  max-width: 75%;
  word-wrap: break-word;
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.2);
}

.bot {
  align-items: flex-start;
}

.bot p,
.bot .message-line {
  background: white;
  color: #1e293b;
  padding: 11px 16px;
  border-radius: 18px 18px 18px 4px;
  max-width: 75%;
  word-wrap: break-word;
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

/* Message Line Formatting */
.message-line {
  display: block;
}

.message-line:empty {
  display: none;
}

.message-line strong {
  font-weight: 600;
  color: #0f172a;
}

.message-line em {
  font-style: italic;
  color: #475569;
}

.message-line code {
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #e11d48;
}

/* Typing Indicator */
.typing-indicator {
  animation: fade-in-up 0.3s ease-out;
}

.typing-bubble {
  background: white;
  padding: 14px 18px;
  border-radius: 18px 18px 18px 4px;
  display: inline-flex;
  gap: 6px;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.typing-bubble .dot {
  width: 8px;
  height: 8px;
  background: #94a3b8;
  border-radius: 50%;
  animation: typing-bounce 1.4s infinite ease-in-out;
}

.typing-bubble .dot:nth-child(1) {
  animation-delay: 0s;
}

.typing-bubble .dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-bubble .dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing-bounce {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-8px);
  }
}

/* Chat Input Form */
.chat-input-form {
  display: flex;
  padding: 16px 20px;
  background: white;
  border-top: 1px solid #e5e7eb;
  gap: 10px;
  align-items: center;
}

.chat-input-form input {
  flex: 1;
  padding: 12px 18px;
  border: 1.5px solid #d1d5db;
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
  background: #f9fafb;
}

.chat-input-form input:focus {
  border-color: #1890ff;
  background: white;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.chat-input-form input::placeholder {
  color: #9ca3af;
}

.chat-input-form button {
  background: #1890ff;
  color: white;
  border: none;
  padding: 6px 18px;
  border-radius: 24px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 48px;
}

.chat-input-form button:hover:not(:disabled) {
  background: #3063f0;
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.35);
}

.chat-input-form button:active:not(:disabled) {
  transform: scale(0.98);
}

.chat-input-form button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #93c5fd;
}

/* Vue Transitions */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

/* Responsive */
@media (max-width: 480px) {
  .chat-window {
    width: calc(100vw - 24px);
    height: calc(100vh - 100px);
    bottom: 12px;
    right: 12px;
  }

  .chat-bubble {
    padding: 12px 18px;
  }

  .bubble-text {
    font-size: 13px;
  }

  .robot-icon {
    font-size: 22px;
  }

  .chat-box {
    padding: 16px;
  }

  .chat-input-form {
    padding: 12px 16px;
  }
}
</style>
