<template>
  <v-content>
    <v-container fluid fill-height>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12" style="width: 100%; margin: 0 auto">
          <v-toolbar dark color="primary">
            <v-toolbar-title class="text-center"
              >Add work proof</v-toolbar-title
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
              <div>
                Property owner : {{ propertyData.user?.fname }}
                {{ propertyData.user?.lname }}
              </div>
            </v-card-text>
          </div>
          <div class="text-h6 ma-2">Work details :</div>
          <v-form ref="uploadWorkProofFormData" :rules="imageValidationRule">
            <span v-if="propertyData?.jobs?.length > 0">
              <div
                class="ma-2"
                v-for="(job, index) in propertyData.jobs"
                :key="job.id"
              >
                <v-card-container>
                  <v-card class="elevation-10 pa-2">
                    <div class="font-weight-medium text-h6">
                      work : {{ job.jobname }}
                    </div>
                    <div v-if="job.job_description != 'null'">
                      description : {{ job.job_description }}
                    </div>
                    <div v-else>description : -</div>
                    <div v-if="job.work_proofs?.length > 0">
                      Comments :
                      {{
                        job.work_proofs[0].comments == null
                          ? "This Work is Approved"
                          : job.work_proofs[0].comments
                      }}
                    </div>
                    <div>photos :</div>
                    <v-file-input
                      v-model="image[index].photos"
                      :rules="imageValidationRule.image"
                      name="workimage"
                      label="upload work image"
                      accept="image/*"
                      clearable
                      multiple
                      counter
                      show-size
                      chips
                    ></v-file-input>
                  </v-card>
                </v-card-container>
              </div>
            </span>
            <v-card class="ma-2">
              <v-card-actions class="d-flex">
                <v-btn
                  class="bg-primary w-50"
                  :disabled="loading"
                  :loading="loading"
                  @click="addWorkAndimage"
                  >Mark task as complete</v-btn
                >
                <v-btn
                  class="bg-purple w-50"
                  @click="
                    router.push({
                      name: 'ContractorChat',
                      params: {
                        id: propertyData.user?.id,
                        p_id: route.params.p_id,
                      },
                    })
                  "
                  >Chat with owner</v-btn
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
import { fetchGetAPI, fetchPostWithFormDataAPI } from "@/services/fetch.api";
import socket from "../../socket";
import { onBeforeMount, reactive, ref, defineEmits } from "vue";
import { useRoute, useRouter } from "vue-router";

const emit = defineEmits(["snackbar-emit"]);
const route = useRoute();
const router = useRouter();

const propertyData = ref([]);
const image = reactive([]);
const loading = ref(false);

const uploadWorkProofFormData = ref(null);

const imageValidationRule = {
  image: [
    (value) => {
      return value?.length > 0 ? true : "Atleast one image is required";
    },
  ],
};

onBeforeMount(async () => {
  try {
    const res = await fetchGetAPI(
      `/contractor/get-property-all-details-by-id/${route.params.p_id}`
    );
    if (res?.success) {
      propertyData.value = await res.message;
      propertyData.value.jobs.map((element) => {
        image.push({ job_id: element.id, photos: null });
      });
    } else {
      console.error(res);
      emit("snackbar-emit", {
        display: true,
        innerText: `Can not able to load page`,
        bgColor: "error",
        icon: "close-circle",
      });
    }

    console.log("on before mount", propertyData.value);
  } catch (error) {
    console.error(error);
    emit("snackbar-emit", {
      display: true,
      innerText: `can not able to load data reload page`,
      bgColor: "error",
      icon: "close-circle",
    });
  }
});

const addWorkAndimage = async () => {
  try {
    const result = await uploadWorkProofFormData.value.validate();
    if (result.valid) {
      loading.value = true;
      let formData = new FormData();

      formData.append("estimate_id", route.params.estimate_id);
      formData.append("p_id", route.params.p_id);

      image.map((element, index) => {
        formData.append(`job_id_${index}`, element.job_id);
        element.photos.map((photo) => {
          formData.append(`photos_${index}`, photo);
        });
      });

      const res = await fetchPostWithFormDataAPI(
        `/contractor/add-work-proof-and-image`,
        formData
      );

      console.log("res", res);

      if (res?.success) {
        socket.emit("status-changed", {
          receiver: propertyData.value.user?.id,
          property: route.params.p_id,
          newStatus: 2,
        });
        router.push({ name: "ContarctorHistory" });
      } else {
        emit("snackbar-emit", {
          display: true,
          innerText: `something went wrong : can not able to add work proof`,
          bgColor: "error",
          icon: "close-circle",
        });
        loading.value = false;
      }
    } else {
      console.error("result validation failed");
    }
  } catch (error) {
    console.error(error);
    emit("snackbar-emit", {
      display: true,
      innerText: `something went wrong while upload work`,
      bgColor: "error",
      icon: "close-circle",
    });
  }
};
</script>
