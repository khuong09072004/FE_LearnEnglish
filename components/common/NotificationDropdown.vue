<template>
  <div class="notification-wrapper">
    <a-popover 
      v-model="visible"
      trigger="click" 
      placement="bottomRight"
      overlayClassName="notification-popover"
    >
      <template #content>
        <div class="notification-dropdown">
        <!-- Header của dropdown -->
        <div class="notification-header">
          <h4>Thông báo</h4>
          <div class="notification-actions">
            <a-dropdown v-if="notifications.length > 0">
              <a-button type="link" size="small">
                <a-icon type="more" />
              </a-button>
              <a-menu slot="overlay">
                <a-menu-item @click="markAllRead">
                  <a-icon type="check-circle" /> Đánh dấu tất cả đã đọc
                </a-menu-item>
                <a-menu-item @click="confirmDeleteAll">
                  <a-icon type="delete" style="color: #ff4d4f;" /> 
                  <span style="color: #ff4d4f;">Xóa tất cả thông báo</span>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </div>

        <a-divider class="my-2" />

        <!-- Danh sách thông báo -->
        <div class="notification-list">
          <a-spin :spinning="loading">
            <template v-if="notifications.length > 0">
              <div 
                v-for="notification in notifications" 
                :key="notification.id"
                class="notification-item"
                :class="{ 'unread': !notification.read }"
              >
                <div class="notification-icon-wrapper" @click="handleNotificationClick(notification)">
                  <span class="notification-type-icon">{{ getNotificationIcon(notification.type) }}</span>
                </div>
                <div class="notification-content" @click="handleNotificationClick(notification)">
                  <div class="notification-title">
                    {{ notification.title }}
                  </div>
                  <div class="notification-message">
                    {{ notification.content }}
                  </div>
                  <div class="notification-time">
                    {{ formatTime(notification.createdAt) }}
                  </div>
                </div>
                <div class="notification-item-actions">
                  <a-icon 
                    type="close" 
                    class="delete-icon"
                    @click.stop="confirmDelete(notification)"
                  />
                  <div v-if="!notification.read" class="unread-dot"></div>
                </div>
              </div>
            </template>
            <a-empty 
              v-else 
              
              description="Chưa có thông báo nào"
            >
              <template #image>
                <a-icon type="bell" style="font-size: 48px; color: #d9d9d9;" />
              </template>
            </a-empty>
          </a-spin>
        </div>

        <!-- Phân trang -->
        <div v-if="totalPages > 1" class="notification-pagination">
          <a-pagination
            v-model="currentPage"
            :total="totalElements"
            :pageSize="pageSize"
            size="small"
            :showSizeChanger="false"
            @change="handlePageChange"
          />
        </div>
        </div>
      </template>

      <!-- Badge với số lượng thông báo chưa đọc -->
      <a-badge :count="unreadCount" :overflow-count="99">
        <a-icon 
          type="bell" 
          class="notification-icon"
          :class="{ 'has-notification': unreadCount > 0 }"
        />
      </a-badge>
    </a-popover>

    <a-modal
      :visible="showLevelUpModal"
      :footer="null"
      centered
      :width="460"
      :maskClosable="false"
      :closable="true"
      @cancel="closeLevelUpModal"
    >
      <div class="level-up-modal">
        <div class="level-up-badge">🎉</div>
        <h3 class="level-up-title">Bạn đã lên level</h3>
        <p class="level-up-message">
          {{ levelUpMessage }}
        </p>
        <div class="level-up-actions">
          <a-button @click="closeLevelUpModal">
            Để sau
          </a-button>
          <a-button type="primary" @click="goToChangeLevel">
            Chọn level tiếp theo
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { getNotifications, markAsRead, markAllAsRead, deleteNotification, deleteAllNotifications } from "@/apis/notifications";
import notificationService from "@/services/notificationService";

export default {
  name: "NotificationDropdown",
  props: {
    isLoggedIn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      notifications: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      totalElements: 0,
      unreadCount: 0,
      wsConnected: false,
      notificationInterval: null,
      showLevelUpModal: false,
      levelUpNotification: null,
      levelUpMessage: 'Vui lòng chọn level tiếp theo để tiếp tục hành trình học tập của bạn.',
    };
  },
  watch: {
    visible(val) {
      if (val && this.notifications.length === 0) {
        this.fetchNotifications();
      }
    },
    isLoggedIn(val) {
      if (val) {
        this.fetchNotifications();
        this.setupWebSocket();
      } else {
        this.cleanup();
      }
    }
  },
  methods: {
    async fetchNotifications() {
      try {
        console.log('📥 Đang tải thông báo...');
        this.loading = true;
        const response = await getNotifications(this.currentPage - 1, this.pageSize);
        
        console.log('📦 Response:', response);
        
        if (response.code === 200) {
          const data = response.data;
          this.notifications = data.content || [];
          this.totalPages = data.totalPages || 0;
          this.totalElements = data.totalElements || 0;
          
          // Đếm số thông báo chưa đọc
          this.unreadCount = this.notifications.filter(n => !n.read).length;
          
        } else {
          console.error('❌ Response code không hợp lệ:', response.code);
        }
      } catch (error) {
        console.error("❌ Lỗi khi lấy thông báo:", error);
        this.$message.error("Không thể tải thông báo");
      } finally {
        this.loading = false;
      }
    },
    async handleNotificationClick(notification) {
      // Đánh dấu đã đọc nếu chưa đọc
      if (!notification.read) {
        try {
          await markAsRead(notification.id);
          notification.read = true;
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        } catch (error) {
          console.error("Lỗi khi đánh dấu đã đọc:", error);
        }
      }
      
      if (this.isLevelUpNotification(notification)) {
        this.openLevelUpModal(notification);
        this.visible = false;
        return;
      }

      // Xử lý action từ data field
      if (notification.data) {
        try {
          const data = JSON.parse(notification.data);
          const action = data.action;
          
          // Xử lý các action
          switch(action) {
            case 'OPEN_LEARNING_HOME':
              this.$router.push('/home');
              break;
            case 'OPEN_SYSTEM_NOTICE':
              // Giữ nguyên popup, không điều hướng
              break;
            case 'OPEN_LEVEL_RESULT':
              this.$router.push('/Change-Level');
              break;
            case 'OPEN_EXERCISE':
              if (data.exerciseId) {
                this.$router.push(`/exercise/${data.exerciseId}`);
              }
              break;
            default:
              // Không làm gì nếu không có action
              break;
          }
          
          if (action !== 'OPEN_SYSTEM_NOTICE') {
            this.visible = false;
          }
        } catch (error) {
          console.error("Lỗi khi parse notification data:", error);
        }
      }
    },
    async markAllRead() {
      try {
        await markAllAsRead();
        this.notifications.forEach(n => n.read = true);
        this.unreadCount = 0;
        this.$message.success("Đã đánh dấu tất cả thông báo là đã đọc");
        this.visible = false;
      } catch (error) {
        console.error("Lỗi khi đánh dấu tất cả đã đọc:", error);
        this.$message.error("Có lỗi xảy ra");
      }
    },
    confirmDelete(notification) {
      this.$confirm({
        title: 'Xác nhận xóa',
        content: 'Bạn có chắc chắn muốn xóa thông báo này?',
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        onOk: () => {
          this.deleteNotification(notification);
        },
      });
    },
    async deleteNotification(notification) {
      try {
        await deleteNotification(notification.id);
        
        // Xóa khỏi danh sách
        const index = this.notifications.findIndex(n => n.id === notification.id);
        if (index > -1) {
          this.notifications.splice(index, 1);
          
          // Giảm unreadCount nếu notification chưa đọc
          if (!notification.read) {
            this.unreadCount = Math.max(0, this.unreadCount - 1);
          }
          
          // Giảm tổng số
          this.totalElements = Math.max(0, this.totalElements - 1);
        }
        
        this.$message.success("Đã xóa thông báo");
      } catch (error) {
        console.error("Lỗi khi xóa thông báo:", error);
        this.$message.error("Không thể xóa thông báo");
      }
    },
    confirmDeleteAll() {
      this.$confirm({
        title: 'Xác nhận xóa tất cả',
        content: 'Bạn có chắc chắn muốn xóa TẤT CẢ thông báo? Hành động này không thể hoàn tác.',
        okText: 'Xóa tất cả',
        okType: 'danger',
        cancelText: 'Hủy',
        onOk: () => {
          this.deleteAllNotifications();
        },
      });
    },
    async deleteAllNotifications() {
      try {
        await deleteAllNotifications();
        
        // Xóa toàn bộ danh sách
        this.notifications = [];
        this.unreadCount = 0;
        this.totalElements = 0;
        this.totalPages = 0;
        
        this.$message.success("Đã xóa tất cả thông báo");
        this.visible = false;
      } catch (error) {
        console.error("Lỗi khi xóa tất cả thông báo:", error);
        this.$message.error("Không thể xóa thông báo");
      }
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchNotifications();
    },
    formatTime(time) {
      if (!time) return "";
      
      try {
        const date = new Date(time);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000); // seconds
        
        if (diff < 60) return 'Vừa xong';
        if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
        if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;
        
        return date.toLocaleDateString('vi-VN');
      } catch (error) {
        return time;
      }
    },
    getNotificationIcon(type) {
      const iconMap = {
        'STUDY_REMINDER': '📚',
        'SYSTEM': '📢',
        'LEVEL_COMPLETED': '🎉',
        'ACHIEVEMENT': '🏆',
        'EXERCISE_COMPLETED': '✅',
        'STREAK': '🔥',
        'FRIEND_REQUEST': '👥',
        'COMMENT': '💬',
        'LIKE': '❤️',
      };
      return iconMap[type] || '🔔';
    },
    // Setup WebSocket để nhận thông báo real-time
    async setupWebSocket() {
      try {
        // Đăng ký listener trước khi connect
        notificationService.on('onNotification', this.handleNewNotification);
        notificationService.on('onConnect', () => {
          this.wsConnected = true;
          console.log('🔔 Đã kết nối WebSocket thông báo');
        });
        notificationService.on('onDisconnect', () => {
          this.wsConnected = false;
          console.log('🔕 Ngắt kết nối WebSocket thông báo');
        });
        notificationService.on('onError', (error) => {
          console.error('❌ Lỗi WebSocket thông báo:', error);
          this.wsConnected = false;
        });

        // Kết nối WebSocket
        await notificationService.connect();
      } catch (error) {
        console.error('Không thể kết nối WebSocket thông báo:', error);
        this.wsConnected = false;
      }
    },
    // Xử lý thông báo mới từ WebSocket
    handleNewNotification(notification) {
      console.log('📬 Thông báo mới:', notification);
      
      // Thêm vào đầu danh sách
      this.notifications.unshift(notification);
      
      // Tăng số lượng chưa đọc
      if (!notification.read) {
        this.unreadCount++;
      }
      
      if (this.isLevelUpNotification(notification)) {
        this.openLevelUpModal(notification);
      } else {
        // Hiển thị notification toast với icon
        const icon = this.getNotificationIcon(notification.type);
        this.$notification.info({
          message: `${icon} ${notification.title || 'Thông báo mới'}`,
          description: notification.content,
          duration: 4,
          placement: 'topRight',
          onClick: () => {
            this.handleNotificationClick(notification);
            this.$notification.close(notification.id);
          }
        });
      }
      
      // Giới hạn số lượng notification trong danh sách
      if (this.notifications.length > this.pageSize) {
        this.notifications.pop();
      }
    },
    isLevelUpNotification(notification) {
      if (!notification) {
        return false;
      }

      if (notification.type === 'LEVEL_COMPLETED') {
        return true;
      }

      if (!notification.data) {
        return false;
      }

      try {
        const data = JSON.parse(notification.data);
        return ['OPEN_LEVEL_RESULT', 'OPEN_LEVEL_CHANGE'].includes(data.action);
      } catch (error) {
        return false;
      }
    },
    openLevelUpModal(notification) {
      if (!notification) {
        return;
      }

      if (notification.read) {
        return;
      }

      this.levelUpNotification = notification;
      this.levelUpMessage = notification?.content || 'Vui lòng chọn level tiếp theo để tiếp tục hành trình học tập của bạn.';
      this.showLevelUpModal = true;
    },
    closeLevelUpModal() {
      this.showLevelUpModal = false;
      this.levelUpNotification = null;
    },
    async goToChangeLevel() {
      const notification = this.levelUpNotification;

      if (notification && !notification.read) {
        try {
          await markAsRead(notification.id);
          notification.read = true;
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        } catch (error) {
          console.error('Lỗi khi đánh dấu thông báo level-up đã đọc:', error);
        }
      }

      this.closeLevelUpModal();
      this.visible = false;
      this.$router.push('/Change-Level');
    },
    cleanup() {
      if (this.notificationInterval) {
        clearInterval(this.notificationInterval);
      }
      
      if (this.wsConnected) {
        notificationService.disconnect();
      }
      
      this.notifications = [];
      this.unreadCount = 0;
    }
  },
  mounted() {
    console.log('🔔 NotificationDropdown mounted, isLoggedIn:', this.isLoggedIn);

    if (this.isLoggedIn) {
      this.fetchNotifications();
      this.setupWebSocket();
    } else {
      console.log('❌ User chưa đăng nhập');
    }

    // Tự động refresh thông báo mỗi 30 giây (fallback nếu socket không hoạt động)
    this.notificationInterval = setInterval(() => {
      if (this.isLoggedIn && !this.wsConnected) {
        this.fetchNotifications();
      }
    }, 30000);
  },
  beforeDestroy() {
    this.cleanup();
  },
};
</script>

<style scoped>
.notification-icon {
  font-size: 20px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.3s;
  padding: 8px;
  border-radius: 50%;
}

.notification-icon:hover {
  color: #1890ff;
  background: #f0f7ff;
}

.notification-icon.has-notification {
  color: #1890ff;
  animation: ring 2s ease-in-out infinite;
}

@keyframes ring {
  0%, 100% { transform: rotate(0deg); }
  10%, 30% { transform: rotate(-10deg); }
  20%, 40% { transform: rotate(10deg); }
}

.notification-dropdown {
  width: 380px;
  max-height: 500px;
  display: flex;
  flex-direction: column;
}

.level-up-modal {
  text-align: center;
  padding: 8px 4px 4px;
}

.level-up-badge {
  width: 72px;
  height: 72px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.level-up-title {
  margin: 0 0 8px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.level-up-message {
  margin: 0 0 20px;
  color: #4b5563;
  line-height: 1.6;
}

.level-up-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
}

.notification-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.notification-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.notification-list {
  max-height: 400px;
  overflow-y: auto;
  padding: 0 4px;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: background 0.2s;
  position: relative;
  margin-bottom: 8px;
}

.notification-icon-wrapper {
  flex-shrink: 0;
  cursor: pointer;
}

.notification-content {
  flex: 1;
  cursor: pointer;
}

.notification-item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

.delete-icon {
  opacity: 0;
  transition: opacity 0.2s, color 0.2s;
  color: #9ca3af;
  font-size: 14px;
  cursor: pointer;
  padding: 4px;
}

.notification-item:hover .delete-icon {
  opacity: 1;
}

.delete-icon:hover {
  color: #ff4d4f;
}

.notification-type-icon {
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #f3f4f6;
  border-radius: 8px;
}

.notification-item.unread .notification-type-icon {
  background: #e6f2ff;
}

.notification-item:hover {
  background: #f9fafb;
}

.notification-item.unread {
  background: #f0f7ff;
}

.notification-item.unread:hover {
  background: #e6f2ff;
}

.notification-title {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
  margin-bottom: 4px;
}

.notification-message {
  color: #6b7280;
  font-size: 13px;
  line-height: 1.4;
  margin-bottom: 4px;
}

.notification-time {
  color: #9ca3af;
  font-size: 12px;
}

.unread-dot {
  width: 8px;
  height: 8px;
  background: #1890ff;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 6px;
}

.notification-pagination {
  padding: 12px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: center;
}

/* Mobile */
@media (max-width: 767px) {
  .notification-icon {
    font-size: 18px;
    padding: 6px;
  }

  .notification-dropdown {
    width: 320px;
  }
}

@media (max-width: 479px) {
  .notification-dropdown {
    width: 280px;
    max-height: 400px;
  }

  .notification-list {
    max-height: 300px;
  }
}
</style>
