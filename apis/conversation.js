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

/**
 * Get all lessons for a user
 * GET /api/conversations/lessons?userId={userId}
 */
export function getLessons() {
  const userId = getUserIdFromCookie();
  
  if (!userId) {
    return Promise.reject(new Error("Không tìm thấy userId trong cookie 'user'"));
  }

  const url = `/conversations/lessons?userId=${userId}`;
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

/**
 * Get specific lesson details
 * GET /api/conversations/lessons/{lessonId}
 */
export function getLesson(lessonId, userId = null) {
  const uid = userId || getUserIdFromCookie();
  
  let url = `/conversations/lessons/${lessonId}`;
  if (uid) {
    url += `?userId=${uid}`;
  }

  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

/**
 * Get user conversation sessions
 * GET /api/conversations/users/{userId}/sessions
 */
export function getUserSessions(userId = null) {
  const uid = userId || getUserIdFromCookie();

  if (!uid) {
    return Promise.reject(new Error("Không tìm thấy userId trong cookie 'user'"));
  }

  const url = `/conversations/users/${uid}/sessions`;
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

/**
 * Get session detail
 * GET /api/conversations/sessions/{sessionId}
 */
export function getSessionDetail(sessionId) {
  const url = `/conversations/sessions/${sessionId}`;
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

/**
 * Get session conversation turns
 * GET /api/conversations/sessions/{sessionId}/turns
 */
export function getSessionTurns(sessionId) {
  const url = `/conversations/sessions/${sessionId}/turns`;
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

/**
 * Get learned history for a lesson
 * GET /api/conversations/lessons/{lessonId}/history
 */
export function getLearnedHistory(lessonId, userId = null) {
  const uid = userId || getUserIdFromCookie();

  if (!uid) {
    return Promise.reject(new Error("Không tìm thấy userId trong cookie 'user'"));
  }

  const url = `/conversations/lessons/${lessonId}/history?userId=${uid}`;
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

/**
 * Start conversation (POST endpoint - path updated)
 * POST /api/conversations/start
 */
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

/**
 * Reply in conversation (POST endpoint - path updated)
 * POST /api/conversations/{sessionId}/reply
 */
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