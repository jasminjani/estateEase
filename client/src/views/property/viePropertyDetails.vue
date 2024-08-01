<template>
  <v-content>
    <v-container fluid fill-height>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12" style="width: 100%; margin: 0 auto">
          <div>
            <PropertyDetailComponent :propertyData="propertyData" />
          </div>
        </v-card>
      </v-flex>
    </v-container>
  </v-content>
</template>

<script setup>
import { fetchGetAPI } from "@/services/fetch.api";
import PropertyDetailComponent from "../../components/propertyDetailComponent.vue";
import { onBeforeMount, ref, defineEmits } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const propertyData = ref([]);

const emit = defineEmits(["snackbar-emit"]);

onBeforeMount(async () => {
  try {
    const res = await fetchGetAPI(
      `/property/get-property-all-details/${route.params.id}`
    );
    if (res?.success) {
      propertyData.value = await res.message;
    } else {
      console.error(res);
      emit("snackbar-emit", {
        display: true,
        innerText: `Can not able to load page`,
        bgColor: "error",
        icon: "close-circle",
      });
    }

    console.log(propertyData.value);
  } catch (error) {
    console.error(error);
    emit("snackbar-emit", {
      display: true,
      innerText: `Can not able to load data`,
      bgColor: "error",
      icon: "close-circle",
    });
  }
});
</script>
