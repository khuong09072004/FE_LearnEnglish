import axios from "axios";
export function getListCategory() {
  const url = "/exercies/category";
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function getExercisesByCategory(topicId, category) {
  const url = `/exercies/${topicId}/category?category=${category}`;
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}
export function getExercisesItems(exerciseId ) {
  const url = `/exercise-items/exercise/${exerciseId}`;
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}
export function submitVocabExercise(exerciseId, answers) {
  const url = `/results/vocab`;
  return new Promise((resolve, reject) => {
    axios
      .post(url, {
        exerciseId,
        answers: {
          answers: answers
        }
      })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}