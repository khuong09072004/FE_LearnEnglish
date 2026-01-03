import chatService from "~/services/chatService";

export default {
  data() {
    return {
      isConnected: false,
      connecting: false,
    };
  },

  methods: {
    initChatService() {
      chatService.on("onConnect", () => {
        this.isConnected = true;
        this.connecting = false;
      });

      chatService.on("onDisconnect", () => {
        this.isConnected = false;
      });

      chatService.on("onError", (error) => {
        this.isConnected = false;
        this.connecting = false;
        this.$message.error("Không thể kết nối");
      });
    },

    async connectToChat() {
      this.connecting = true;
      try {
        await chatService.connect();
      } catch (error) {
        console.error("Connect error:", error);
        if (error.message === "Không tìm thấy token") {
          this.$message.error("Vui lòng đăng nhập để sử dụng chat");
          this.$router.push("/Login");
        }
      }
    },

    async disconnectChat() {
      try {
        await chatService.disconnect();
      } catch (error) {
        console.error("Disconnect error:", error);
      }
    },

    connectWebSocket() {
      this.connectToChat();
    },
  },
};
