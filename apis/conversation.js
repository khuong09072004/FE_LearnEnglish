import axios from "axios";


export function getLessons() {
  const url = `/conversations/lessons`;
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}
export function startConversation(lessonId) {
  const userId = 5; // thay bằng userId thực từ store/auth của bạn
  return new Promise((resolve, reject) => {
    axios
      .post(`/conversations/start?lessonId=${lessonId}&userId=${userId}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function replyConversation(sessionId, content) {
  return new Promise((resolve, reject) => {
    axios
      .post(`/conversations/${sessionId}/reply`, content, {
        headers: {
          'Content-Type': 'text/plain'
        }
      })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}