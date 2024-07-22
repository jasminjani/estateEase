export const getters = {
  getRoleId: (state) => {
    return state.currentUser?.role_id;
  },

  getUserId: (state) => {
    return state.currentUser?.id;
  },

  getCurrentUser: (state) => {
    return state.currentUser;
  },
};
