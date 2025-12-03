import axios from "axios";
export function getListGrammar() {
  const url = "/grammar";
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function getGrammarById(id) {
  const url = `/grammar/${id}`;
  return new Promise((resolve, reject) => {
    axios
      .get(url,{ id })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}