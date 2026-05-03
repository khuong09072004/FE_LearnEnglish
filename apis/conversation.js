import axios from "axios";
import Cookies from "js-cookie";

function getUserIdFromCookie() {
  const userCookie = Cookies.get("user");

  if (!userCookie) {
    return null;
  }

  const tryParse = (value) => {
    try {
      return JSON.parse(value);
    } catch (error) {
      return null;
    }
  };

  const decodedCookie = (() => {
    try {
      return decodeURIComponent(userCookie);
    } catch (error) {
      return userCookie;
    }
  })();

  const user = tryParse(userCookie) || tryParse(decodedCookie);

  return user?.id ?? null;
}


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
  const userId = getUserIdFromCookie();

  if (!userId) {
    return Promise.reject(new Error("Không tìm thấy userId trong cookie 'user'"));
  }

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