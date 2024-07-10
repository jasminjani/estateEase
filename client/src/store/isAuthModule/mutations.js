export const mutations = {
  userLogin: (state, res) => {
    state.currentUser.push(res.user);
  },

  userLogout: (state) => {
    state.currentUser = [];
  },
};
