export const state = {
  currentUser: JSON.parse(localStorage.getItem("userinfo")) || null,
};
