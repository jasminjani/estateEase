export const getters = {
  getRoleId: (state) => {
    return state?.currentUser?.length ? state.currentUser[0].role_id : null;
  },
};
