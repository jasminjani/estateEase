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
              <v-toolbar dark color="primary">
                <v-toolbar-title class="text-center"
                  >Property Details</v-toolbar-title
                >
              </v-toolbar>
              <div class="v-row" v-if="propertyAndJobData.length > 0">
                <div
                  class="v-col-4"
                  v-for="property in propertyAndJobData"
                  :key="property.id"
                >
                  <PropertyLayoutComponent
                    :name="property.name"
                    :address="property.address"
                    :city="property.city"
                    :pincode="property.pincode"
                    :jobs="property.jobs"
                    :id="property.id"
                  />
                </div>
              </div>
              <div v-else>
                <!-- <div class="v-col-4"> -->
                  <NoDataFoundComponent />
                <!-- </div> -->
              </div>
            </v-card>
          </v-flex>
        </v-container>
      </v-content>
    </v-main>
  </v-app>
</template>

<script setup>
import Sidebar from "../../components/contractor/sideBar.vue";
import PropertyLayoutComponent from "../../components/contractor/propertyLayoutComponent.vue";
import NoDataFoundComponent from "../../components/noDataFoundComponent.vue";
import { onBeforeMount, ref } from "vue";

const propertyAndJobData = ref([]);

onBeforeMount(async () => {
  let res = await fetch(
    `${process.env.VUE_APP_BASE_URL}/get-submitted-notApproved-property`,
    {
      mode: "cors",
      credentials: "include",
    }
  );
  res = await res.json();
  propertyAndJobData.value = await res.message;
  console.log(propertyAndJobData.value);

  if (res.success) {
    console.log("successfully fetched property data on contractor dashboard");
  } else {
    console.log("contractor dashboard data not");
  }
});
</script>
