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