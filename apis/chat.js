import axios from "axios";

// API endpoints cho chat (nếu có REST API)

// Lấy lịch sử chat của một topic
export function getChatHistory(topicId, params = {}) {
  const url = `/chat/history/${topicId}`;
  return new Promise((resolve, reject) => {
    axios
      .get(url, { params })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

// Lấy danh sách tin nhắn của một topic
export function getMessages(topicId, page = 0, size = 20) {
  const url = `/chat/topics/${topicId}/messages`;
  return new Promise((resolve, reject) => {
    axios
      .get(url, { 
        params: { page, size } 
      })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

// Xóa tin nhắn
export function deleteMessage(messageId) {
  const url = `/chat/messages/${messageId}`;
  return new Promise((resolve, reject) => {
    axios
      .delete(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

// Báo cáo tin nhắn
export function reportMessage(messageId, reason) {
  const url = `/chat/messages/${messageId}/report`;
  return new Promise((resolve, reject) => {
    axios
      .post(url, { reason })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

