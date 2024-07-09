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
                  <div>
                    {{ propertyData.city }} - {{ propertyData.pincode }}
                  </div>
                  <div>
                    Property owner : {{ propertyData.user?.fname }}
                    {{ propertyData.user?.lname }}
                  </div>
                </v-card-text>
              </div>
              <div class="text-h6 ma-2">Work details :</div>
              <v-form ref="formRef" :rules="piceValidationRule">
                <div
                  class="ma-2"
                  v-for="(job, index) in propertyData.jobs"
                  :key="job.id"
                >
                  <!-- <UploadWorkImageComponent
                  :jobname="job.jobname"
                  :description="job.job_description"
                /> -->

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
                      <v-file-input
                        v-model="image[index].photos"
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
                <v-card class="ma-2">
                  <v-card-actions class="d-flex">
                    <v-btn class="bg-primary w-50" @click="addWorkAndimage"
                      >Mark task as complete</v-btn
                    >
                    <v-btn class="bg-purple w-50">Chat with owner</v-btn>
                  </v-card-actions>
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
import Sidebar from "../../components/contractor/sideBar.vue";
// import UploadWorkImageComponent from "../../components/contractor/uploadWorkImageComponent.vue";
import { onBeforeMount, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const propertyData = ref([]);
const image = reactive([]);

onBeforeMount(async () => {
  let res = await fetch(
    `${process.env.VUE_APP_BASE_URL}/get-property-all-details-by-id/${route.params.p_id}`,
    {
      mode: "cors",
      credentials: "include",
    }
  );
  res = await res.json();
  propertyData.value = await res.message;
  console.log("on before mount", propertyData.value.jobs);

  propertyData.value.jobs.map((element) => {
    image.push({ job_id: element.id, photos: null });
  });
});

const addWorkAndimage = async () => {
  console.log("click on add work image");

  let formData = new FormData();
  console.log("image ", image);

  formData.append("estimate_id", route.params.estimate_id);
  formData.append("p_id", route.params.p_id);

  image.map((element, index) => {
    console.log("image map", element);
    formData.append(`job_id_${index}`, element.job_id);
    element.photos.map((photo) => {
      formData.append(`photos_${index}`, photo);
    });
  });

  console.log("formData ", formData);
  let res = await fetch(
    `${process.env.VUE_APP_BASE_URL}/add-work-proof-and-image`,
    {
      method: "post",
      mode: "cors",
      // headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: formData,
    }
  );
  res = await res.json();
  console.log("res", res);

  if (res.success) {
    router.push({ name: "ContarctorHistory" });
  } else {
    alert("something went wrong : can not able to add work proof");
  }
};
</script>
