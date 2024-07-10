<template>
  <v-app>
    <v-navigation>
      <Sidebar />
    </v-navigation>
    <v-main>
      <v-content>
        <v-container fluid fill-height>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12" style="width: 100%; margin: 0 auto">
              <v-toolbar dark color="primary">
                <v-toolbar-title class="text-center"
                  >Property Dashboard</v-toolbar-title
                >
              </v-toolbar>
              <v-card-text class="text-center text-h5">
                Welcome, {{ userinfo.fname }} {{ userinfo.lname }} on Property
                side Dashboard.
              </v-card-text>
            </v-card>
          </v-flex>
        </v-container>
      </v-content>
    </v-main>
  </v-app>
</template>

<script setup>
import Sidebar from "../../components/property/sideBar.vue";

const userinfo = JSON.parse(localStorage.getItem("userinfo"));
</script>
