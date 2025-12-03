import axios from "axios";
export function getListTopic() {
  const url = "/users/Topics";
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function getListStatisticsVocabularyInTopic(topicId) {
  const url = `/vocabularies/statistics/${topicId}`;
  return new Promise((resolve, reject) => {
    axios
      .get(url,{ topicId })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}
export function getListVocabularyInTopic(topicId) {
  const url = `/vocabularies/topic/${topicId}`;
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}
export function markVocabularyAsLearned(id) {
  const url = `/vocabularies/${id}/learn`;
  return new Promise((resolve, reject) => {
    axios
      .post(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}