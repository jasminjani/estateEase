<template>
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
              <v-card-item>
                <v-card-title class="text-h5">{{
                  propertyData.name
                }}</v-card-title>
              </v-card-item>
              <v-card-text>
                <div>{{ propertyData.address }}</div>
                <div>{{ propertyData.city }} - {{ propertyData.pincode }}</div>
                <div v-if="propertyData?.jobs?.length > 0">
                  Contracter name :
                  {{
                    propertyData?.jobs[0]?.work_proofs[0]?.job_photos[0]?.user
                      ?.fname
                  }}
                  {{
                    propertyData?.jobs[0]?.work_proofs[0]?.job_photos[0]?.user
                      ?.lname
                  }}
                </div>
              </v-card-text>
            </div>
            <div class="text-h6 ma-2">Work details :</div>
            <div
              class="ma-2"
              v-for="(job, index) in propertyData.jobs"
              :key="job.id"
            >
              <!-- {{ job.job_photos[0].photo }}
                  <WorkLayoutComponent
                    v-if="job.work_proofs?.length > 0"
                    :jobname="job.jobname"
                    :description="job.job_description"
                    :photos="job.work_proofs[0].job_photos"
                    :work_proof_id="job.work_proofs[0].id"
                    :index="index"
                  /> -->
              <!-- <WorkLayoutComponent
                    v-else
                    :jobname="job.jobname"
                    :description="job.job_description"
                  /> -->

              <div>
                <v-card-container>
                  <v-card class="elevation-10 pa-2">
                    <div class="font-weight-medium text-h6">
                      work : {{ job.jobname }}
                    </div>
                    <div v-if="job.job_description != 'null'">
                      description : {{ job.job_description }}
                    </div>
                    <div v-else>description : -</div>
                    <div>photos :</div>
                    <!-- <div> -->
                    <v-row>
                      <v-col
                        v-for="(photo, item) in job.work_proofs[0].job_photos"
                        :key="photo.id"
                        class="d-flex child-flex"
                        cols="3"
                      >
                        <!-- <v-col v-for="n in 5" :key="n" class="d-flex child-flex" cols="3"> -->
                        <!-- {{ photo.photo }} -->
                        <v-img
                          v-if="photo.photo"
                          :lazy-src="`https://picsum.photos/10/6?image=${
                            item * 5 + 10
                          }`"
                          :src="photo.photo"
                          aspect-ratio="16/9"
                          class="bg-grey-lighten-2"
                          cover
                        >
                          <template v-slot:placeholder>
                            <v-row
                              align="center"
                              class="fill-height ma-0"
                              justify="center"
                            >
                              <v-progress-circular
                                color="grey-lighten-5"
                                indeterminate
                              ></v-progress-circular>
                            </v-row>
                          </template>
                        </v-img>
                      </v-col>
                    </v-row>
                    <v-card-text>
                      <v-textarea
                        v-model="comments[index].comment"
                        prepend-inner-icon="mdi-comment"
                        name="comment"
                        label="Add Comments"
                        type="textarea"
                        clearable
                        counter
                      ></v-textarea>
                    </v-card-text>
                  </v-card>
                </v-card-container>

                <!-- </div> -->
              </div>
            </div>

            <v-card class="ma-2">
              <v-card-actions class="d-flex">
                <v-btn
                  class="bg-primary w-50"
                  @click="
                    router.push({
                      name: 'PropertyPayment',
                      params: { p_id: route.params.id },
                    })
                  "
                  >Make Payment</v-btn
                >
                <v-btn class="bg-purple w-50" @click="addComments"
                  >Add Comments For Work</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-form>
        </v-card>
      </v-flex>
    </v-container>
  </v-content>
</template>

<script setup>
// import { useStore } from "vuex";
import socket from "../../socket";
// import PropertyDetailComponent from "../../components/propertyDetailComponent.vue";
// import WorkLayoutComponent from "../../components/contractor/workLayoutComponent.vue";
import { onBeforeMount, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
// import * as yup from "yup";

const route = useRoute();
const router = useRouter();
// const store = useStore();

const propertyData = ref([]);
const comments = reactive([]);

onBeforeMount(async () => {
  try {
    let res = await fetch(
      `${process.env.VUE_APP_BASE_URL}/review-work-proof/${route.params.id}`,
      {
        mode: "cors",
        credentials: "include",
      }
    );
    res = await res.json();
    propertyData.value = await res.message;
    console.log(propertyData.value);

    await propertyData.value.jobs.map((element) => {
      comments.push({
        work_proof_id: element.work_proofs[0].id,
        job_id: element.id,
        comment: null,
      });
    });

    // console.log("comments :>> ", comments);

    // console.log(propertyData.value.jobs[0].job_photos[0].photo);
  } catch (error) {
    console.error(error);
  }
});

// function emitFunction(commentValue, index) {
//   console.log(index, "emitted", commentValue);
//   comments[0].comment = commentValue;
//   // alert("emitted", commentValue);
// }

console.log("comments :>> ", comments);

// if (comments) {
//   console.log("hey jash");
//   await store.dispatch("addCommentOnJobLength", comments);
// }
console.log("comments :>> ", comments.length);

const addComments = async () => {
  try {
    // const getAllReviewCommentData = computed(
    //   () => store.getters.getAllReviewCommentData
    // );

    // console.log("add comments :>> ", getAllReviewCommentData);
    // console.log(
    //   "add comments :>> ",
    //   store.state.reviewWorkModule.reviewComments
    // );
    console.log("add comments :>> ", comments);

    let res = await fetch(
      `${process.env.VUE_APP_BASE_URL}/add-review-comment`,
      {
        method: "post",
        mode: "cors",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          p_id: route.params.id,
          reviewComments: comments,
        }),
      }
    );
    res = await res.json();
    console.log("res: ", res);
    if (res) {
      // if (res.success) {

      socket.emit("status-changed", {
        receiver:
          propertyData.value?.jobs[0]?.work_proofs[0]?.job_photos[0]?.user?.id,
        property: route.params.id,
        newStatus: 3,
      });
      router.push({ name: "PropertyHistory" });
      // }
    } else {
      console.log("failed");
    }
  } catch (error) {
    console.error(error);
  }
};
</script>
