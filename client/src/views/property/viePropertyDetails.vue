<template>
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
</template>

<script setup>
import PropertyDetailComponent from "../../components/propertyDetailComponent.vue";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
// import * as yup from "yup";

const route = useRoute();

const propertyData = ref([]);

onBeforeMount(async () => {
  try {
    let res = await fetch(
      `${process.env.VUE_APP_BASE_URL}/get-property-all-details/${route.params.id}`,
      {
        mode: "cors",
        credentials: "include",
      }
    );
    res = await res.json();
    propertyData.value = await res.message;
    console.log(propertyData.value);
    // console.log(propertyData.value.jobs[0].job_photos[0].photo);
  } catch (error) {
    console.error(error);
  }
});
</script>
