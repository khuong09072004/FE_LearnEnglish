import Cookies from "js-cookie";

const expiredTimeToken = 8; // 8 ngày

export default {
  namespaced: true,

  state: () => ({
    isLoggedIn: !!Cookies.get("token"),
    token: Cookies.get("token") || null,
    user: (() => {
      try {
        const userCookie = Cookies.get("user");
        return userCookie ? JSON.parse(userCookie) : null;
      } catch (error) {
        console.warn("⚠️ Cookie 'user' bị lỗi JSON:", error);
        Cookies.remove("user");
        return null;
      }
    })(),
  }),

  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
    token: (state) => state.token,
    user: (state) => state.user,
    userId: (state) => state.user?.id || null, // ✅ Thêm getter userId
    displayName: (state) => state.user?.name || "",
    avatar: (state) => state.user?.avatar || null,
    email: (state) => state.user?.email || "",
  },

  mutations: {
    setIsLoggedIn(state, value) {
      state.isLoggedIn = value;
    },
    setToken(state, token) {
      state.token = token;
    },
    setUser(state, user) {
      state.user = user;
    },
  },

  actions: {
    login({ commit }, payload) {
      const { token, name, email, avatar, has_selected_level, id,typeAccount } = payload;

      const user = { 
        id, // ✅ Lưu id từ BE
        name, 
        email, 
        avatar, 
        has_selected_level ,
        typeAccount
      }; 

      commit("setIsLoggedIn", true);
      commit("setToken", token);
      commit("setUser", user);

      Cookies.set("token", token, {
        expires: expiredTimeToken,
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("user", JSON.stringify(user), {
        expires: expiredTimeToken,
        secure: true,
        sameSite: "Strict",
      });

      return { token, user };
    },

    logout({ commit }) {
      commit("setIsLoggedIn", false);
      commit("setToken", null);
      commit("setUser", null);

      Cookies.remove("token");
      Cookies.remove("user");
    },

    initAuth({ commit }) {
      const token = Cookies.get("token");
      let user = null;

      try {
        const userCookie = Cookies.get("user");
        user = userCookie ? JSON.parse(userCookie) : null;
      } catch (error) {
        console.warn("⚠️ Cookie 'user' bị lỗi JSON:", error);
        Cookies.remove("user");
      }

      if (token && user) {
        // Lưu nguyên dữ liệu BE từ cookie
        commit("setIsLoggedIn", true);
        commit("setToken", token);
        commit("setUser", user);
      }
    },
  },
};
