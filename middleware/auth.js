import Cookies from 'js-cookie';

export default function ({ store, redirect }) {
  // Khôi phục state từ cookie nếu state bị reset
  if (!store.getters["auth/isLoggedIn"]) {
    const token = Cookies.get("token");
    const userCookie = Cookies.get("user");
    
    if (token && userCookie) {
      try {
        const user = JSON.parse(userCookie);
        store.commit("auth/setIsLoggedIn", true);
        store.commit("auth/setToken", token);
        store.commit("auth/setUser", user);
      } catch (error) {
        console.error("Error restoring auth:", error);
        return redirect("/login");
      }
    } else {
      return redirect("/login");
    }
  }

  // Kiểm tra nếu user chưa chọn level
  if (!store.getters["auth/user"]?.has_selected_level) {
    return redirect("/choose-level");
  }
}
