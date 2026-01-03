import { ref } from 'vue';
import { updateAvatar } from '~/apis/profile';

export const useAvatar = (profileData) => {
  const loading = ref(false);

  const changeAvatar = async ({ $store, $message }) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        $message.error('Ảnh không được vượt quá 5MB');
        return;
      }

      const oldAvatar = profileData.value ? profileData.value.avatar : '';
      $message.loading('Đang tải ảnh lên...', 0);

      // Preview ngay lập tức
      const reader = new FileReader();
      reader.onload = (event) => {
        if (profileData.value) {
          profileData.value = {
            ...profileData.value,
            avatar: event.target.result
          };
        }
      };
      reader.readAsDataURL(file);

      try {
        loading.value = true;
        const formData = new FormData();
        formData.append('avatar', file);

        const response = await updateAvatar(formData);
        $message.destroy();

        if (response && response.data) {
          const serverAvatar = response.data.avatar || response.data;
          
          if (profileData.value) {
            profileData.value = {
              ...profileData.value,
              avatar: serverAvatar
            };
          }
          
          await $store.dispatch('auth/login', {
            token: $store.getters['auth/token'],
            id: $store.getters['auth/userId'],
            name: profileData.value ? profileData.value.name : '',
            email: profileData.value ? profileData.value.email : '',
            avatar: serverAvatar,
            has_selected_level: profileData.value ? !!profileData.value.Level : false,
          });

          $message.success('✅ Cập nhật avatar thành công!', 3);
        } else {
          $message.error('❌ Không nhận được dữ liệu từ server');
        }
      } catch (error) {
        $message.destroy();
        
        if (profileData.value) {
          profileData.value = {
            ...profileData.value,
            avatar: oldAvatar
          };
        }
        const errorMsg = error.response?.data?.message || 'Có lỗi khi upload avatar';
        $message.error('❌ ' + errorMsg, 3);
      } finally {
        loading.value = false;
      }
    };

    input.click();
  };

  return {
    loading,
    changeAvatar,
  };
};
