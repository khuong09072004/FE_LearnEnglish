import { ref, computed } from 'vue';
import { getProfile, updateProfile } from '~/apis/profile';

export const useProfile = () => {
  const profileData = ref(null);
  const loading = ref(false);
  const editMode = ref(false);
  const editForm = ref({
    fullName: '',
    dateOfBirth: '',
  });

  const user = computed(() => {
    if (profileData.value) {
      return {
        name: profileData.value.name,
        email: profileData.value.email,
        avatar: profileData.value.avatar,
        dob: profileData.value.dob,
        Level: profileData.value.Level,
        TypeAccount: profileData.value.TypeAccount,
        has_selected_level: !!profileData.value.Level,
      };
    }
    return {};
  });

  const isGoogleAccount = computed(() => {
    return profileData.value?.TypeAccount === 'Google';
  });

  const memberSince = computed(() => {
    return 'Tháng 12, 2025';
  });

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      if (response.status === 'success') {
        profileData.value = response.data;
        editForm.value.fullName = response.data.name || '';
        editForm.value.dateOfBirth = response.data.dob || '';
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleUpdateProfile = async ({ $store, $message }) => {
    loading.value = true;

    try {
      const response = await updateProfile({
        fullName: editForm.value.fullName,
        dateOfBirth: editForm.value.dateOfBirth,
      });

      if (response.status === 'success') {
        profileData.value = response.data;
        await fetchProfile();
        
        await $store.dispatch('auth/login', {
          token: $store.getters['auth/token'],
          id: $store.getters['auth/userId'],
          name: response.data.name || user.value.name,
          email: response.data.email || user.value.email,
          avatar: response.data.avatar || user.value.avatar,
          has_selected_level: user.value.has_selected_level,
        });

        $message.success('✅ Cập nhật thông tin thành công!', 3);
        editMode.value = false;
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin!';
      $message.error('❌ ' + errorMsg, 3);
    } finally {
      loading.value = false;
    }
  };

  return {
    profileData,
    loading,
    editMode,
    editForm,
    user,
    isGoogleAccount,
    memberSince,
    fetchProfile,
    handleUpdateProfile,
  };
};
