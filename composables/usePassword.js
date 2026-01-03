import { ref } from 'vue';
import { changePassword } from '~/apis/profile';

export const usePassword = () => {
  const changePasswordMode = ref(false);
  const loading = ref(false);
  const passwordForm = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChangePassword = async ({ $message }) => {
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      $message.error('❌ Mật khẩu xác nhận không khớp!');
      return;
    }

    if (passwordForm.value.newPassword.length < 6) {
      $message.error('❌ Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    loading.value = true;

    try {
      const response = await changePassword({
        oldPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword,
      });

      if (response.status === 'success') {
        $message.success('✅ Đổi mật khẩu thành công!', 3);
        resetPasswordForm();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu!';
      $message.error('❌ ' + errorMsg, 3);
    } finally {
      loading.value = false;
    }
  };

  const resetPasswordForm = () => {
    changePasswordMode.value = false;
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  };

  return {
    changePasswordMode,
    loading,
    passwordForm,
    handleChangePassword,
    resetPasswordForm,
  };
};
