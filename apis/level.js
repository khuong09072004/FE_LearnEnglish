import axios from "axios";

export function chooseLevel(body) {
  const url = "/users/level";
  return new Promise((resolve, reject) => {
    axios
      .put(url, body)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}
export function getListLevel() {
  const url = "/levels";
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}
export function trackLearningProgress() {
  const url = "/users/Tracking/level";
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function getAvailableLevels() {
  const url = "/levels/available";
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function selectLevel(code) {
  const url = `/levels/select?code=${code}`;
  return new Promise((resolve, reject) => {
    axios
      .post(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function getTopicProgress(topicId) {
  const url = `/users/Tracking/topic/${topicId}`;
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function getLevelProgressHistory(startDate, endDate, granularity) {
  let url = "/users/Tracking/level/history";
  const params = [];
  
  if (startDate) params.push(`startDate=${startDate}`);
  if (endDate) params.push(`endDate=${endDate}`);
  if (granularity) params.push(`granularity=${granularity}`);
  
  if (params.length > 0) {
    url += "?" + params.join("&");
  }
  
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function getLevelProgressDetail() {
  const url = "/users/Tracking/level/detail";
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}
