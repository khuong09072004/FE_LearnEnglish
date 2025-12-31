import Cookies from 'js-cookie';

// Biến global để lưu SockJS và Stomp
let SockJS, Stomp;

class ChatWebSocketService {
  constructor() {
    this.stompClient = null;
    this.currentSubscription = null;
    this.isConnected = false;
    this.listeners = {
      onMessage: null,
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
        
        const wsUrl = `${baseUrl}/ws?token=${token}`;
        const socket = new SockJS(wsUrl);
        this.stompClient = Stomp.over(socket);
        this.stompClient.debug = null;

        this.stompClient.connect(
          { Authorization: `Bearer ${token}` },
          (frame) => {
            this.isConnected = true;
            if (this.listeners.onConnect) {
              this.listeners.onConnect(frame);
            }
            resolve(true);
          },
          (error) => {
            this.isConnected = false;
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

  // Ngắt kết nối
  disconnect() {
    return new Promise((resolve) => {
      if (this.currentSubscription) {
        try {
          this.currentSubscription.unsubscribe();
        } catch (error) {
          console.error('Unsubscribe error:', error);
        }
        this.currentSubscription = null;
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

  // Subscribe vào topic
  subscribeToTopic(topicId, onMessage) {
    if (!this.isConnected || !this.stompClient) {
      throw new Error('Chưa kết nối WebSocket');
    }

    // Unsubscribe topic cũ nếu có
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
    }

    return new Promise((resolve, reject) => {
      try {
        this.currentSubscription = this.stompClient.subscribe(
          `/topic/chat/${topicId}`,
          (message) => {
            try {
              const body = JSON.parse(message.body);
              if (onMessage) {
                onMessage(body);
              }
            } catch (error) {
              console.error('Parse message error:', error);
            }
          }
        );
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Gửi tin nhắn
  sendMessage(topicId, content) {
    if (!this.isConnected || !this.stompClient) {
      throw new Error('Chưa kết nối WebSocket');
    }

    return new Promise((resolve, reject) => {
      try {
        this.stompClient.send(
          '/app/chat.sendMessage',
          {},
          JSON.stringify({
            topicId: topicId,
            content: content
          })
        );
        resolve(true);
      } catch (error) {
        reject(error);
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
const chatServiceInstance = new ChatWebSocketService();
export default chatServiceInstance;
