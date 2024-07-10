<template>
  <!-- <v-navigation-drawer :width="250"> -->
  <v-navigation-drawer class="bg-primary">
    <v-list>
      <v-list-item
        title="estateEase"
        subtitle="real estate company"
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-home" title="Dashboard" link></v-list-item>
      <v-list-item
        prepend-icon="mdi-city"
        link
        title="Add Property"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-history"
        link
        title="History"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-account"
        link
        title="Profile"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-logout"
        link
        title="Logout"
        @click="logout"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-logout"
        link
        title="Logout from all"
        @click="logoutAll"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-logout"
        link
        title="Logout from other"
        @click="logoutAllOther"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();

async function logout() {
  await store.dispatch("userLogout");
  if (store.state.isAuthModule.currentUser.length < 1) {
    router.push({ name: "login" });
  } else {
    alert("logout failed");
  }
}

async function logoutAll() {
  alert("This is upcoming functionality");

  // localStorage.removeItem("userinfo");

  // let res = await fetch(`${process.env.VUE_APP_BASE_URL}/logout-all`, {
  //   method: "post",
  //   mode: "cors",
  //   credentials: "include",
  //   headers: { "Content-Type": "application/json" },
  // });
  // res = await res.json();
  // console.log(res);

  // if (res.success) {
  //   router.push({ name: "login" });
  // }
}

async function logoutAllOther() {
  alert("This is upcoming functionality");

  // let res = await fetch(`${process.env.VUE_APP_BASE_URL}/logout-all-other`, {
  //   method: "post",
  //   mode: "cors",
  //   credentials: "include",
  //   headers: { "Content-Type": "application/json" },
  // });
  // res = await res.json();
  // console.log(res);

  // if (res.success) {
  //   alert("successfuly logout from all other devices");
  // } else {
  //   alert("error occured while logout from all other devices");
  // }
}
</script>
