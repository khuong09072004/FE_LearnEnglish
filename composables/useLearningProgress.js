import { ref, computed } from 'vue';
import { trackLearningProgress } from '~/apis/level';

export const useLearningProgress = () => {
  const progressData = ref(null);
  const loadingProgress = ref(false);

  const totalVocabulary = computed(() => progressData.value?.totalVocabulary || 0);
  const learnedVocabulary = computed(() => progressData.value?.learnedVocabulary || 0);
  const totalExercises = computed(() => progressData.value?.totalExercises || 0);
  const completedExercises = computed(() => progressData.value?.completedExercises || 0);
  const hasStreak = computed(() => progressData.value?.streak && progressData.value.streak > 0);
  const streakDays = computed(() => progressData.value?.streak || 0);

  const fetchProgress = async () => {
    loadingProgress.value = true;
    try {
      const response = await trackLearningProgress();
      if (response.status === 'success') {
        progressData.value = response.data;
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      loadingProgress.value = false;
    }
  };

  return {
    progressData,
    loadingProgress,
    totalVocabulary,
    learnedVocabulary,
    totalExercises,
    completedExercises,
    hasStreak,
    streakDays,
    fetchProgress,
  };
};
