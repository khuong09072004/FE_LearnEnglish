import { getMessages, updateMessage, deleteMessage } from "~/apis/chat";
import chatService from "~/services/chatService";

export default {
  data() {
    return {
      chatMessages: [],
      sending: false,
      loadingMessages: false,
      editingMessageId: null,
      editingContent: "",
      editModalVisible: false,
    };
  },

  computed: {
    editingMessage() {
      return this.chatMessages.find((m) => m.id === this.editingMessageId) || null;
    },
  },

  methods: {
    async sendChatMessage() {
      if (!this.isConnected || !this.chatTopicId) return;

      const content = this.messageInput.trim();
      if (!content) return;

      this.sending = true;

      try {
        await chatService.sendMessage(this.chatTopicId, content);
        this.messageInput = "";
      } catch (error) {
        this.$message.error("Gửi thất bại");
        console.error("Send error:", error);
      } finally {
        this.sending = false;
      }
    },

    handleIncomingMessage(message) {
      const currentUserId = this.$store.getters["auth/userId"];

      this.chatMessages.push({
        id: message.id || message.messageId,
        content: message.content,
        senderName: message.senderName || message.senderId,
        senderId: message.senderId,
        senderAvatar: message.senderAvatar,
        timestamp: message.timestamp || new Date(),
        isOwn: message.senderId === currentUserId,
        type: "message",
      });

      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },

    async loadChatHistory(topicId) {
      this.loadingMessages = true;
      try {
        const response = await getMessages(topicId, 0, 50);

        if (response.status === "success" && response.data) {
          const currentUserId = this.$store.getters["auth/userId"];

          const messages = response.data.reverse().map((msg) => ({
            id: msg.id || msg.messageId,
            content: msg.content,
            senderName: msg.senderName,
            senderId: msg.senderId,
            senderAvatar: msg.senderAvatar,
            timestamp: msg.sentAt,
            isOwn: msg.senderId === currentUserId,
            type: "message",
          }));

          this.chatMessages = [...messages, ...this.chatMessages];

          this.$nextTick(() => {
            this.scrollToBottom();
          });
        }
      } catch (error) {
        console.error("Load chat history error:", error);
        this.$message.warning("Không thể tải lịch sử chat");
      } finally {
        this.loadingMessages = false;
      }
    },

    addSystemMessage(content) {
      this.chatMessages.push({
        content,
        type: "system",
        timestamp: new Date(),
        isOwn: false,
      });

      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },

    scrollToBottom() {
      if (this.$refs.chatMessages) {
        this.$refs.chatMessages.scrollTop =
          this.$refs.chatMessages.scrollHeight;
      }
    },

    formatTime(timestamp) {
      if (!timestamp) return "";

      const msgDate = new Date(timestamp);
      const now = new Date();

      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const msgDay = new Date(
        msgDate.getFullYear(),
        msgDate.getMonth(),
        msgDate.getDate()
      );

      const timeStr = msgDate.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });

      if (msgDay.getTime() === today.getTime()) {
        return timeStr;
      }

      if (msgDay.getTime() === yesterday.getTime()) {
        return `Hôm qua ${timeStr}`;
      }

      const daysAgo = Math.floor(
        (today.getTime() - msgDay.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysAgo < 7) {
        const weekdays = [
          "Chủ nhật",
          "Thứ hai",
          "Thứ ba",
          "Thứ tư",
          "Thứ năm",
          "Thứ sáu",
          "Thứ bảy",
        ];
        return `${weekdays[msgDate.getDay()]} ${timeStr}`;
      }

      const dateStr = msgDate.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return `${dateStr} ${timeStr}`;
    },

    showEditModal(message) {
      this.editingMessageId = message.id;
      this.editingContent = message.content;
      this.editModalVisible = true;
    },

    async handleEditMessage() {
      if (!this.editingContent.trim()) {
        this.$message.warning("Nội dung tin nhắn không được để trống");
        return;
      }

      try {
        await updateMessage(this.editingMessageId, this.editingContent.trim());

        const msgIndex = this.chatMessages.findIndex(
          (m) => m.id === this.editingMessageId
        );
        if (msgIndex !== -1) {
          this.chatMessages[msgIndex].content = this.editingContent.trim();
        }

        this.$message.success("Đã cập nhật tin nhắn");
        this.editModalVisible = false;
        this.editingMessageId = null;
        this.editingContent = "";
      } catch (error) {
        console.error("Edit message error:", error);
        this.$message.error("Không thể sửa tin nhắn");
      }
    },

    confirmDeleteMessage(message) {
      this.$confirm({
        title: "Gỡ tin nhắn?",
        content: "Tin nhắn này sẽ bị gỡ với mọi người trong cuộc trò chuyện.",
        okText: "Gỡ",
        okType: "danger",
        cancelText: "Hủy",
        centered: true,
        icon: () => null,
        class: "messenger-confirm-modal",
        onOk: () => {
          this.handleDeleteMessage(message.id);
        },
      });
    },

    async handleDeleteMessage(messageId) {
      try {
        await deleteMessage(messageId);

        const msgIndex = this.chatMessages.findIndex((m) => m.id === messageId);
        if (msgIndex !== -1) {
          this.chatMessages.splice(msgIndex, 1);
        }

        this.$message.success("Đã gỡ tin nhắn");
      } catch (error) {
        console.error("Delete message error:", error);
        this.$message.error("Không thể gỡ tin nhắn");
      }
    },
  },
};
