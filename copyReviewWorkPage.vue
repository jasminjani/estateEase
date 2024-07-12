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
              <v-form>
                <!-- <div>
                  <PropertyDetailComponent :propertyData="propertyData" />
                </div> -->
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
                <div
                  class="ma-2"
                  v-for="(job, index) in propertyData.jobs"
                  :key="job.id"
                >
                  <!-- {{ job.job_photos[0].photo }} -->
                  <WorkLayoutComponent
                    v-if="job.work_proofs?.length > 0"
                    :jobname="job.jobname"
                    :description="job.job_description"
                    :photos="job.work_proofs[0].job_photos"
                    :work_proof_id="job.work_proofs[0].id"
                    :index="index"
                  />
                  <!-- <WorkLayoutComponent
                    v-else-if="job.job_photos"
                    :jobname="job.jobname"
                    :description="job.job_description"
                    :photos="job.job_photos"
                  /> -->
                  <WorkLayoutComponent
                    v-else
                    :jobname="job.jobname"
                    :description="job.job_description"
                  />
                </div>
                <v-card class="ma-2">
                  <v-form ref="formRef" :rules="piceValidationRule">
                    <v-card-actions class="d-flex">
                      <v-btn class="bg-primary w-50">Make Payment</v-btn>
                      <v-btn class="bg-purple w-50" @click="addComments"
                        >Add Comments For Work</v-btn
                      >
                    </v-card-actions>
                  </v-form>
                </v-card>
              </v-form>
            </v-card>
          </v-flex>
        </v-container>
      </v-content>
    </v-main>
  </v-app>
</template>

<script setup>
import { useStore } from "vuex";
import Sidebar from "../../components/property/sideBar.vue";
// import PropertyDetailComponent from "../../components/propertyDetailComponent.vue";
import WorkLayoutComponent from "../../components/contractor/workLayoutComponent.vue";
import { computed, onBeforeMount, reactive, ref } from "vue";
import { useRoute } from "vue-router";
// import * as yup from "yup";

const route = useRoute();
const store = useStore();

const propertyData = ref([]);
const comments = reactive([]);

onBeforeMount(async () => {
  let res = await fetch(
    `${process.env.VUE_APP_BASE_URL}/review-work-proof/${route.params.id}`,
    {
      mode: "cors",
      credentials: "include",
    }
  );
  res = await res.json();
  propertyData.value = await res.message;
  console.log(propertyData.value.jobs);

  await propertyData.value.jobs.map((element) => {
    comments.push({ work_proof_id: null, job_id: element.id, comment: null });
  });

  // console.log("comments :>> ", comments);

  // console.log(propertyData.value.jobs[0].job_photos[0].photo);
});

console.log("comments :>> ", comments);

if (comments.length > 0) {
  console.log("hey jash");
  await store.dispatch("addCommentOnJobLength", comments);
}
console.log("comments :>> ", comments.length);


const addComments = async () => {
  try {
    const getAllReviewCommentData = computed(
      () => store.getters.getAllReviewCommentData
    );
    console.log("add comments :>> ", getAllReviewCommentData);
    console.log("add comments :>> ", comments);

    // let res = await fetch(
    //   `${process.env.VUE_APP_BASE_URL}/add-review-comment`,
    //   {
    //     method: "post",
    //     mode: "cors",
    //     credentials: "include",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({p_id : route.params.id ,reviewComments : getAllReviewCommentData}),
    //   }
    // );
    // res = res.json();

    // if (res.success) {
    //   console.log("success");
    // } else {
    //   console.log("failed");
    // }
  } catch (error) {
    console.error(error);
  }
};
</script>
