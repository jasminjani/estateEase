export const actions = {
  userLogin: async ({ commit }, values) => {
    let res = await fetch(`${process.env.VUE_APP_BASE_URL}/login`, {
      method: "post",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(values, null, 2),
    });
    res = await res.json();
    console.log("res ", res);

    commit("userLogin", res);
  },

  userLogout: async ({ commit }) => {
    let res = await fetch(`${process.env.VUE_APP_BASE_URL}/logout`, {
      method: "post",
      mode: "cors",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    res = await res.json();
    console.log("res ", res);

    commit("userLogout", res);
  },
};
