import axios from "axios";

export function getProfile() {
  const url = "/users/Profile";
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function updateProfile(body) {
  const url = "/users/profile";
  return new Promise((resolve, reject) => {
    axios
      .put(url, body)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function updateAvatar(formData) {
  const url = "/users/avatar";
  return new Promise((resolve, reject) => {
    axios
      .post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function changePassword(body) {
  const url = "/users/password";
  return new Promise((resolve, reject) => {
    axios
      .put(url, body)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
