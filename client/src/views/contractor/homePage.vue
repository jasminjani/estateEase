<template>
  <v-content>
    <v-container fluid fill-height>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12" style="width: 100%; margin: 0 auto">
          <v-toolbar dark color="primary">
            <v-toolbar-title class="text-center"
              >Property Details</v-toolbar-title
            >
          </v-toolbar>
          <div class="v-row" v-if="propertyAndJobData?.length > 0">
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
import { onBeforeMount, ref, defineEmits } from "vue";
import socket from "../../socket";
import { fetchGetAPI } from "@/services/fetch.api";

const emit = defineEmits(["snackbar-emit"]);

const propertyAndJobData = ref([]);

onBeforeMount(async () => {
  try {
    const res = await fetchGetAPI(
      `/contractor/get-submitted-notApproved-property`
    );
    if (res?.success) {
      propertyAndJobData.value = await res.message;
    } else {
      console.error(res);
      emit("snackbar-emit", {
        display: true,
        innerText: `Can not able to load page`,
        bgColor: "error",
        icon: "close-circle",
      });
    }
    console.log(propertyAndJobData.value);
  } catch (error) {
    console.error(error);
    emit("snackbar-emit", {
      display: true,
      innerText: `Can not able to load page`,
      bgColor: "error",
      icon: "close-circle",
    });
  }
});

// for real time display new added property  by property owner
socket.on("send-new-property-added", (message) => {
  propertyAndJobData.value.push(message);
});
</script>
