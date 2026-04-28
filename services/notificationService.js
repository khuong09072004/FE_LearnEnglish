import Cookies from 'js-cookie';

// Biến global để lưu SockJS và Stomp
let SockJS, Stomp;

class NotificationWebSocketService {
  constructor() {
    this.stompClient = null;
    this.notificationSubscription = null;
    this.isConnected = false;
    this.listeners = {
      onNotification: null,
      onConnect: null,
      onDisconnect: null,
      onError: null,
    };
  }

  // Load thư viện WebSocket
  loadWebSocketLibraries() {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve(false);
        return;
      }

      // Load SockJS
      if (!window.SockJS) {
        const sockjsScript = document.createElement('script');
        sockjsScript.src = 'https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js';
        sockjsScript.onload = () => {
          SockJS = window.SockJS;
          this.loadStompLibrary().then(resolve);
        };
        document.head.appendChild(sockjsScript);
      } else {
        SockJS = window.SockJS;
        this.loadStompLibrary().then(resolve);
      }
    });
  }

  loadStompLibrary() {
    return new Promise((resolve) => {
      if (!window.Stomp) {
        const stompScript = document.createElement('script');
        stompScript.src = 'https://cdn.jsdelivr.net/npm/stompjs@2.3.3/lib/stomp.min.js';
        stompScript.onload = () => {
          Stomp = window.Stomp;
          resolve(true);
        };
        document.head.appendChild(stompScript);
      } else {
        Stomp = window.Stomp;
        resolve(true);
      }
    });
  }

  // Kết nối WebSocket
  async connect() {
    if (!SockJS || !Stomp) {
      const loaded = await this.loadWebSocketLibraries();
      if (!loaded) {
        throw new Error('Không thể load thư viện WebSocket');
      }
    }

    if (this.stompClient?.connected) {
      return true;
    }

    const token = Cookies.get('token');
    if (!token) {
      throw new Error('Không tìm thấy token');
    }

    return new Promise((resolve, reject) => {
      try {
        let baseUrl = process.env.NUXT_ENV_BASE_URL || 'http://localhost:8080';
        baseUrl = baseUrl.replace('/api', '');
        
        // Giống y hệt code test của BE
        const wsUrl = `${baseUrl}/ws?token=${encodeURIComponent(token)}`;
        const socket = new SockJS(wsUrl);
        this.stompClient = Stomp.over(socket);
        this.stompClient.debug = null; // Tắt log rác

        this.stompClient.connect(
          {}, // BE không cần header Authorization, đã dùng token trong URL
          (frame) => {
            this.isConnected = true;
            // Tự động subscribe vào kênh thông báo của user
            this.subscribeToNotifications();
            
            if (this.listeners.onConnect) {
              this.listeners.onConnect(frame);
            }
            resolve(true);
          },
          (error) => {
            this.isConnected = false;
            console.error('❌ Notification WebSocket Error:', error);
            if (this.listeners.onError) {
              this.listeners.onError(error);
            }
            reject(error);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  // Subscribe vào kênh thông báo cá nhân
  subscribeToNotifications() {
    if (!this.isConnected || !this.stompClient) {
      console.error('Chưa kết nối WebSocket');
      return;
    }

    try {
      // Subscribe vào topic thông báo - giống y hệt code test của BE
      this.notificationSubscription = this.stompClient.subscribe(
        '/user/queue/notifications',
        (message) => {
          try {
            const notification = JSON.parse(message.body);
            console.log('🔔 Notification received:', notification);
            
            if (this.listeners.onNotification) {
              this.listeners.onNotification(notification);
            }
          } catch (error) {
            console.error('Parse notification error:', error);
          }
        }
      );
      
      console.log('✅ Subscribed to /user/queue/notifications');
    } catch (error) {
      console.error('Subscribe notification error:', error);
    }
  }

  // Ngắt kết nối
  disconnect() {
    return new Promise((resolve) => {
      if (this.notificationSubscription) {
        try {
          this.notificationSubscription.unsubscribe();
        } catch (error) {
          console.error('Unsubscribe error:', error);
        }
        this.notificationSubscription = null;
      }

      if (this.stompClient) {
        try {
          this.stompClient.disconnect(() => {
            this.isConnected = false;
            if (this.listeners.onDisconnect) {
              this.listeners.onDisconnect();
            }
            resolve();
          });
        } catch (error) {
          console.error('Disconnect error:', error);
          resolve();
        }
        this.stompClient = null;
      } else {
        this.isConnected = false;
        resolve();
      }
    });
  }

  // Đăng ký listeners
  on(event, callback) {
    if (this.listeners.hasOwnProperty(event)) {
      this.listeners[event] = callback;
    }
  }

  // Kiểm tra trạng thái kết nối
  getConnectionStatus() {
    return this.isConnected;
  }
}

// Tạo và export singleton instance
const notificationServiceInstance = new NotificationWebSocketService();
export default notificationServiceInstance;
