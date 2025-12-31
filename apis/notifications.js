import axios from "axios";

// Lấy danh sách thông báo với phân trang
export function getNotifications(page = 0, size = 10) {
  const url = `/notifications?page=${page}&size=${size}`;
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

// Đánh dấu đã đọc thông báo
export function markAsRead(notificationId) {
  const url = `/notifications/${notificationId}/read`;
  return new Promise((resolve, reject) => {
    axios
      .post(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

// Đánh dấu tất cả thông báo đã đọc
export function markAllAsRead() {
  const url = `/notifications/read-all`;
  return new Promise((resolve, reject) => {
    axios
      .post(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

// Xóa thông báo
export function deleteNotification(notificationId) {
  const url = `/notifications/${notificationId}`;
  return new Promise((resolve, reject) => {
    axios
      .delete(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

// Xóa tất cả thông báo
export function deleteAllNotifications() {
  const url = `/notifications`;
  return new Promise((resolve, reject) => {
    axios
      .delete(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}
