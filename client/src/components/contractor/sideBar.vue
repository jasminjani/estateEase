<template>
  <v-navigation-drawer class="bg-primary">
    <v-list>
      <v-list-item
        title="estateEase"
        subtitle="real estate company"
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-home"
        title="Dashboard"
        link
        @click="router.push({ name: 'contractorDashboard' })"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-history"
        link
        title="History"
        @click="router.push({ name: 'ContarctorHistory' })"
      ></v-list-item>
      <!-- <v-list-item
        prepend-icon="mdi-account"
        link
        title="Profile"
      ></v-list-item> -->
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
import { defineEmits } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const emit = defineEmits(["snackbar-emit"]);

const store = useStore();
const router = useRouter();

async function logout() {
  try {
    await store.dispatch("userLogout");
    if (!store.state.isAuthModule.currentUser) {
      router.push({ name: "login" });
      emit("snackbar-emit", {
        display: true,
        innerText: `Logout successfully`,
        bgColor: "success",
        icon: "check-circle",
      });
    } else {
      emit("snackbar-emit", {
        display: true,
        innerText: `Logout failed`,
        bgColor: "error",
        icon: "close-circle",
      });
    }
  } catch (error) {
    console.error(error);
  }
}

async function logoutAll() {
  try {
    emit("snackbar-emit", {
      display: true,
      innerText: "Logout from all is upcoming functionality",
      bgColor: "info",
      icon: "information",
    });
    //   localStorage.removeItem("userinfo");

    //   let res = await fetch(`${process.env.VUE_APP_BASE_URL}/logout-all`, {
    //     method: "post",
    //     mode: "cors",
    //     credentials: "include",
    //     headers: { "Content-Type": "application/json" },
    //   });
    //   res = await res.json();
    //   console.log(res);

    //   if (res.success) {
    //     router.push({ name: "login" });
    // emit("snackbar-emit", {
    //   display: true,
    //   innerText: `Logout successfully from all devices`,
    //   bgColor: "success",
    //   icon: "check-circle",
    // });
    //   } else{
    // emit("snackbar-emit", {
    //   display: true,
    //   innerText: `Logout failed from all devices`,
    //   bgColor: "error",
    //   icon: "close-circle",
    // });
    // }
  } catch (error) {
    console.error(error);
  }
}

async function logoutAllOther() {
  try {
    emit("snackbar-emit", {
      display: true,
      innerText: `Logout from all other is upcoming functionality`,
      bgColor: "info",
      icon: "information",
    });
    //   let res = await fetch(`${process.env.VUE_APP_BASE_URL}/logout-all-other`, {
    //     method: "post",
    //     mode: "cors",
    //     credentials: "include",
    //     headers: { "Content-Type": "application/json" },
    //   });
    //   res = await res.json();
    //   console.log(res);

    //   if (res.success) {
    // emit("snackbar-emit", {
    //   display: true,
    //   innerText: `Logout successfully from all other devices`,
    //   bgColor: "success",
    //   icon: "check-circle",
    // });
    //   } else {
    // emit("snackbar-emit", {
    //   display: true,
    //   innerText: `error occured while logout from all other devices`,
    //   bgColor: "error",
    //   icon: "close-circle",
    // });
    //   }
  } catch (error) {
    console.error(error);
  }
}
</script>
