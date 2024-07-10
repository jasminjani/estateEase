<template>
  <v-app>
    <v-navigation>
      <Sidebar />
    </v-navigation>
    <v-main>
      <v-content>
        <v-container fluid fill-height>
          <v-flex xs12 sm8 md4>
            <v-card
              class="elevation-12 bg-indigo-lighten-5"
              style="width: 100%; margin: 0 auto"
            >
              <div>
                <PropertyDetailComponent :propertyData="propertyData" />
              </div>
            </v-card>
          </v-flex>
        </v-container>
      </v-content>
    </v-main>
  </v-app>
</template>

<script setup>
import Sidebar from "../../components/property/sideBar.vue";
import PropertyDetailComponent from "../../components/propertyDetailComponent.vue";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
// import * as yup from "yup";

const route = useRoute();

const propertyData = ref([]);

onBeforeMount(async () => {
  let res = await fetch(
    `${process.env.VUE_APP_BASE_URL}/get-property-all-details-by-id/${route.params.id}`,
    {
      mode: "cors",
      credentials: "include",
    }
  );
  res = await res.json();
  propertyData.value = await res.message;
  console.log(propertyData.value);
  // console.log(propertyData.value.jobs[0].job_photos[0].photo);
});
</script>
