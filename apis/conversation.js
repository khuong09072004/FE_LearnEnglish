import axios from "axios";

export function getConversationsByTopic(topicId) {
  const url = `/conversations?TopicId=${topicId}`;
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function getConversationById(conversationId) {
  const url = `/conversations/${conversationId}`;
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}
