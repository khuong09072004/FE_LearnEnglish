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
export function getPassageById(passageId) {
  const url = `/passages/${passageId}`;
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
export function submitGrammarExercise(exerciseId, answers) {
  const url = `/results/grammar`;
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
export function submitListeningExercise(exerciseId, answers) {
  const url = `/results/listening`;
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
export function submitReadingExercise(exerciseId, answers) {
  const url = `/results/reading`;
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
export function submitWritingExercise(exerciseId, answers) {
  const url = `/results/writing`;
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