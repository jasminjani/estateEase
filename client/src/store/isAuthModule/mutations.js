export const mutations = {
  userLogin: (state, res) => {
    if (res.success) {
      localStorage.setItem("userinfo", JSON.stringify(res.user));
      state.currentUser.push(res.user);
    } else {
      alert(res.message);
      // let p = document.createElement("p");
      // document.getElementById("form").insertAdjacentElement("afterend", p);
      // p.style.color = "red";
      // p.style.textAlign = "center";
      // p.innerHTML = `${res.message}`;
    }
  },

  userLogout: (state, res) => {
    if (res.success) {
      localStorage.removeItem("userinfo");
      state.currentUser = [];
      console.log("localstorage remove");
    } else {
      alert(res.message);
    }
  },
};
