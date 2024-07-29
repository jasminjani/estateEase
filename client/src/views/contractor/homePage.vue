<template>
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
            <NoDataFoundComponent />
          </div>
        </v-card>
      </v-flex>
    </v-container>
  </v-content>
</template>

<script setup>
import PropertyLayoutComponent from "../../components/contractor/propertyLayoutComponent.vue";
import NoDataFoundComponent from "../../components/noDataFoundComponent.vue";
import { onBeforeMount, ref } from "vue";
import socket from "../../socket";

const propertyAndJobData = ref([]);

onBeforeMount(async () => {
  try {
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
  } catch (error) {
    console.error(error);
  }
});

socket.on("send-new-property-added", (message) => {
  propertyAndJobData.value.push(message);
});
</script>
