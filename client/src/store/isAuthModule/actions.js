export const actions = {
  userLogin: async ({ commit }, values) => {
    try {
      let res = await fetch(`${process.env.VUE_APP_BASE_URL}/login`, {
        method: "post",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values, null, 2),
      });
      res = await res.json();
      console.log("res ", res);

      if (res.success) {
        localStorage.setItem("userinfo", JSON.stringify(res.user));
        commit("userLogin", res);
      } else {
        alert(res.message);
      }
    } catch (error) {
      console.error(error);
    }
  },

  userLogout: async ({ commit }) => {
    try {
      let res = await fetch(`${process.env.VUE_APP_BASE_URL}/logout`, {
        method: "post",
        mode: "cors",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      res = await res.json();
      console.log("res ", res);

      if (res.success) {
        localStorage.removeItem("userinfo");
        console.log("localstorage remove");
        commit("userLogout", res);
      } else {
        alert(res.message);
      }
    } catch (error) {
      console.error(error);
    }
  },
};
