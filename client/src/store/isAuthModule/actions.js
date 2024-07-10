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
    console.log(res);
    commit("userLogin", res);
  },
};
