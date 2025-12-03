export default function ({ store, redirect }) {
  // Chưa đăng nhập thì về login
  if (!store.getters["auth/isLoggedIn"]) {
    return redirect("/login");
  }

  // Kiểm tra nếu user chưa chọn level
  if (!store.getters["auth/user"]?.has_selected_level) {
    return redirect("/choose-level");
  }
}
