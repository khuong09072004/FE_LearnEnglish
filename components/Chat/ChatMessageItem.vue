<template>
  <div>
    <!-- System Message -->
    <div v-if="message.type === 'system'" class="w-full text-center">
      <span
        class="inline-block px-4 py-2 rounded-full bg-white/5 text-gray-400 text-sm border border-white/10"
      >
        {{ message.content }}
      </span>
    </div>

    <!-- Tin nhắn của người khác -->
    <div
      v-else-if="!message.isOwn"
      class="flex justify-start items-end gap-3"
    >
      <a-avatar
        v-if="message.senderAvatar"
        :src="message.senderAvatar"
        :size="40"
        class="flex-shrink-0"
      />
      <a-avatar
        v-else
        :size="40"
        class="flex-shrink-0"
        style="background-color: #6b7280"
      >
        {{ (message.senderName || "U")[0].toUpperCase() }}
      </a-avatar>

      <div class="max-w-[65%]">
        <div class="text-xs font-medium text-gray-400 mb-1.5 ml-1">
          {{ message.senderName || "User" }}
        </div>
        <div
          class="bg-gray-700 text-white rounded-2xl rounded-bl-md px-5 py-3 shadow-lg"
        >
          <div class="text-[15px] break-words leading-relaxed">
            {{ message.content }}
          </div>
        </div>
        <div class="text-xs text-gray-500 mt-1.5 ml-1">
          {{ formatTime(message.timestamp) }}
        </div>
      </div>
    </div>

    <!-- Tin nhắn của mình -->
    <div
      v-else
      class="flex justify-end items-end gap-3 message-wrapper"
    >
      <div class="max-w-[65%]">
        <div class="flex items-center gap-2 justify-end">
          <div class="message-actions" v-if="message.id">
            <a-dropdown :trigger="['click']" placement="bottomLeft">
              <button class="action-btn">
                <a-icon type="ellipsis" />
              </button>
              <a-menu slot="overlay" class="message-menu">
                <a-menu-item @click="$emit('edit', message)">
                  <a-icon type="edit" />
                  <span class="ml-2">Chỉnh sửa</span>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item
                  @click="$emit('delete', message)"
                  class="delete-item"
                >
                  <a-icon type="delete" />
                  <span class="ml-2">Gỡ</span>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>

          <div
            class="bg-blue-600 text-white rounded-2xl rounded-br-md px-5 py-3 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div class="text-[15px] break-words leading-relaxed">
              {{ message.content }}
            </div>
          </div>
        </div>
        <div class="text-xs text-gray-500 mt-1.5 mr-1 text-right">
          {{ formatTime(message.timestamp) }}
        </div>
      </div>

      <a-avatar
        v-if="currentUser?.avatar"
        :src="currentUser.avatar"
        :size="40"
        class="flex-shrink-0"
      />
      <a-avatar
        v-else
        :size="40"
        class="flex-shrink-0"
        style="background-color: #2563eb"
      >
        {{ (currentUser?.name || "Me")[0].toUpperCase() }}
      </a-avatar>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatMessageItem",
  props: {
    message: {
      type: Object,
      required: true,
    },
    currentUser: {
      type: Object,
      default: null,
    },
  },
  methods: {
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
  },
};
</script>

<style scoped>
.message-wrapper {
  position: relative;
}

.message-actions {
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
}

.message-wrapper:hover .message-actions {
  opacity: 1;
  visibility: visible;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #1a1a1a;
  padding: 0;
  outline: none;
}

.action-btn:hover {
  background: rgba(0, 0, 0, 0.15);
}

.action-btn:active {
  transform: scale(1.05);
}

.action-btn .anticon {
  font-size: 18px;
  font-weight: bold;
  transform: rotate(90deg);
}

.message-menu >>> .ant-dropdown-menu {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.message-menu >>> .ant-dropdown-menu-item {
  padding: 12px 16px;
  font-size: 15px;
  transition: all 0.2s;
}

.message-menu >>> .ant-dropdown-menu-item:hover {
  background: #f3f4f6;
}

.message-menu >>> .delete-item:hover {
  background: #fee2e2;
}

.message-menu >>> .delete-item:hover span,
.message-menu >>> .delete-item:hover .anticon {
  color: #dc2626 !important;
}
</style>
