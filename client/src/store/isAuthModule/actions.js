import { fetchPostAPI } from "@/services/fetch.api";

export const actions = {
  userLogin: async ({ commit }, values) => {
    try {
      const res = await fetchPostAPI(`/login`, values);

      console.log("res ", res);

      if (res?.success) {
        localStorage.setItem("userinfo", JSON.stringify(res.user));
        commit("setUser", res.user);
      } else {
        alert(res.message);
        commit("setUser", null);
      }
    } catch (error) {
      console.error(error);
    }
  },

  userLogout: async ({ commit }) => {
    try {
      const res = await fetchPostAPI(`/logout`, {});

      console.log("res ", res);

      if (res?.success) {
        localStorage.removeItem("userinfo");
        console.log("localstorage remove");
        commit("setUser", null);
      } else {
        alert(res.message);
      }
    } catch (error) {
      console.error(error);
    }
  },
};
