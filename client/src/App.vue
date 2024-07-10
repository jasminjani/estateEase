<template>
  <v-app>
    <v-main>
      <!-- <div class="d-flex justify-space-around">
        <div>
          <router-link :to="{ name: 'login' }">Login</router-link>
        </div>
        <div>
          <router-link :to="{ name: 'registration' }">registration</router-link>
        </div>
        <div>
          <router-link :to="{ name: 'propertyHomepage' }"
            >property dashboard</router-link
          >
        </div>
        <div>
          <router-link :to="{ name: 'PropertyHistory' }"
            >property History</router-link
          >
        </div>
        <div>
          <router-link :to="{ name: 'contractorDashboard' }"
            >Contractor dashboard</router-link
          >
        </div>
      </div> -->
      <div>
        <router-view></router-view>
      </div>

      <!-- <LoginPage /> -->
      <!-- <RegistrationPage /> -->
    </v-main>
  </v-app>
</template>

<script setup>
// import LoginPage from "./views/loginPage.vue";
// import RegistrationPage from "./views/registrationPage.vue";
</script>
