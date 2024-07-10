export const getters = {
  getRoleId: (state) => {
    return state.currentUser?.role_id;
  },
};
