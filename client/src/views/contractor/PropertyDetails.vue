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
              <div>
                <!-- <v-card-container> -->
                <!-- <v-card class="elevation-10"> -->
                <v-card-item>
                  <v-card-title class="text-h5">{{
                    propertyData.name
                  }}</v-card-title>
                </v-card-item>
                <v-card-text>
                  <div>{{ propertyData.address }}</div>
                  <div>
                    {{ propertyData.city }} - {{ propertyData.pincode }}
                  </div>
                  <div>
                    Property owner : {{ propertyData.user?.fname }}
                    {{ propertyData.user?.lname }}
                  </div>
                </v-card-text>
                <!-- </v-card> -->
                <!-- </v-card-container> -->
              </div>
              <div class="text-h6 ma-2">Work details :</div>
              <div class="ma-2" v-for="job in propertyData.jobs" :key="job.id">
                <WorkLayoutComponent
                  :jobname="job.jobname"
                  :description="job.job_description"
                />
              </div>
              <v-card class="ma-2">
                <v-form ref="formRef" :rules="piceValidationRule">
                  <v-text-field
                    v-model="formData.price"
                    :rules="piceValidationRule.price"
                    class="ma-2"
                    prepend-inner-icon="mdi-currency-inr"
                    label="Repairing price"
                    name="price"
                    clearable
                    type="text"
                  >
                  </v-text-field>
                  <v-card-actions class="d-flex">
                    <v-btn class="bg-primary w-50" @click="applyTender"
                      >Apply tender</v-btn
                    >
                    <v-btn class="bg-purple w-50">Chat with owner</v-btn>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-card>
          </v-flex>
        </v-container>
      </v-content>
    </v-main>
  </v-app>
</template>

<script setup>
import Sidebar from "../../components/contractor/sideBar.vue";
import WorkLayoutComponent from "../../components/contractor/workLayoutComponent.vue";
import { onBeforeMount, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
// import * as yup from "yup";

const formRef = ref(null);
const formData = reactive({ price: "" });
const piceValidationRule = {
  price: [
    (value) => {
      if (value?.length > 0 && /[0-9-]+/.test(value)) return true;

      return "Price should be number.";
    },
  ],
};

const route = useRoute();
const router = useRouter();

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
  // console.log(propertyData.value);
  console.log(propertyData.value.jobs[0].job_photos[0].photo);
});

const applyTender = async () => {
  console.log("click on apply tender");

  const result = await formRef.value.validate();

  if (result.valid == true) {
    console.log(result);

    let res = await fetch(
      `${process.env.VUE_APP_BASE_URL}/add-estimate-price`,
      {
        method: "post",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          p_id: route.params.id,
          price: formData.price,
        }),
      }
    );
    res = await res.json();
    console.log(res);

    if (res.success) {
      router.push({ name: "contractorDashboard" });
    } else {
      alert("something went wrong : can not able to apply tender");
    }
  } else {
    console.log("something went wrong");
  }
};
</script>
