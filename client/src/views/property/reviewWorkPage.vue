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
          <v-form ref="reviewWorkFormData" :rules="commentValidationRule">
            <span v-if="propertyData.jobs?.length">
              <div
                class="ma-2"
                v-for="(job, index) in propertyData.jobs"
                :key="job.id"
              >
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
                      <v-row>
                        <v-col
                          v-for="(photo, item) in job.work_proofs[0].job_photos"
                          :key="photo.id"
                          class="d-flex child-flex"
                          cols="3"
                        >
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
                          :rules="commentValidationRule.comment"
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
                </div>
              </div>
            </span>

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
import socket from "../../socket";
import { onBeforeMount, reactive, ref, defineEmits } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const emit = defineEmits(["snackbar-emit"]);

const propertyData = ref([]);
const comments = reactive([]);

const reviewWorkFormData = ref(null);

const commentValidationRule = {
  comment: [
    () => {
      return commentValidation();
    },
  ],
};

function commentValidation() {
  let count = 0;
  comments.forEach((element) => {
    if (element.comment == null || element.comment?.trim() == "") {
      count++;
    }
  });

  return count !== comments?.length ? true : "Any one comment is required";
}

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

const addComments = async () => {
  try {
    const result = await reviewWorkFormData.value.validate();

    if (result.valid) {
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
            propertyData.value?.jobs[0]?.work_proofs[0]?.job_photos[0]?.user
              ?.id,
          property: route.params.id,
          newStatus: 3,
        });
        router.push({ name: "PropertyHistory" });
        // }
      } else {
        console.error("failed");
        emit("snackbar-emit", {
          display: true,
          innerText: `Something went wrong while add work review`,
          bgColor: "error",
          icon: "close-circle",
        });
      }
    } else {
      console.error("result validation failed");
    }
  } catch (error) {
    console.error(error);
    emit("snackbar-emit", {
      display: true,
      innerText: `Something went wrong while add work review`,
      bgColor: "error",
      icon: "close-circle",
    });
  }
};
</script>
