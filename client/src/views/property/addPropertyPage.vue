<template>
  <v-content>
    <v-container fluid fill-height>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12" style="width: 100%; margin: 0 auto">
          <v-toolbar dark color="primary">
            <v-toolbar-title class="text-center"
              >Add Property Details</v-toolbar-title
            >
          </v-toolbar>
          <v-card-text>
            <v-form
              ref="addNewPropertyFormRef"
              :rules="addNewPropertyFormValidation"
            >
              <v-text-field
                v-model="propertyData.name"
                :rules="addNewPropertyFormValidation.name"
                prepend-icon="mdi-city"
                name="name"
                label="Property Name"
                type="text"
                clearable
              ></v-text-field>

              <v-textarea
                v-model="propertyData.address"
                :rules="addNewPropertyFormValidation.address"
                prepend-icon="mdi-home-city"
                name="address"
                label="Property address"
                type="textarea"
                clearable
                counter
              ></v-textarea>
              <v-text-field
                v-model="propertyData.city"
                :rules="addNewPropertyFormValidation.city"
                prepend-icon="mdi-map-marker"
                name="city"
                label="City"
                type="text"
                clearable
              ></v-text-field>
              <v-text-field
                v-model="propertyData.pincode"
                :rules="addNewPropertyFormValidation.pincode"
                prepend-icon="mdi-fire-hydrant"
                name="pincode"
                label="Pincode"
                type="text"
                clearable
              ></v-text-field>
              <div id="outerDiv" v-if="jobsCount?.length > 0">
                <div
                  id="innerDiv"
                  v-for="(count, index) in jobsCount"
                  :key="index"
                >
                  <v-text-field
                    v-model="jobsCount[index].name"
                    :rules="addNewPropertyFormValidation.jobname"
                    prepend-icon="mdi-text"
                    name="jobname"
                    label="Job name"
                    type="text"
                    clearable
                  ></v-text-field>
                  <v-textarea
                    v-model="jobsCount[index].description"
                    prepend-icon="mdi-comment"
                    name="job_description"
                    label="Job description"
                    type="textarea"
                    clearable
                    counter
                  ></v-textarea>

                  <v-file-input
                    v-model="jobsCount[index].photos"
                    :rules="addNewPropertyFormValidation.jobimage"
                    name="jobimage"
                    label="Upload image"
                    accept="image/*"
                    chips
                    multiple
                    clearable
                    counter
                    show-size
                  ></v-file-input>
                </div>
              </div>
              <v-card-action class="d-flex justify-space-around">
                <v-btn
                  class="bg-purple"
                  prepend-icon="mdi-plus"
                  @click="addMoreJobs"
                  >Add more jobs</v-btn
                >
                <v-btn
                  :disabled="jobsCount.length === 1"
                  class="bg-purple"
                  prepend-icon="mdi-minus"
                  @click="removeMoreJobs"
                  >Remove jobs</v-btn
                >
              </v-card-action>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              :disabled="loading"
              :loading="loading"
              class="d-flex bg-primary"
              style="margin: 0 auto"
              @click.prevent="addPropertyAndJobs"
              >Add property</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-container>
  </v-content>
</template>

<script setup>
import { fetchPostWithFormDataAPI } from "@/services/fetch.api";
import socket from "../../socket";
import { reactive, ref, defineEmits } from "vue";
import { useRouter } from "vue-router";

const emit = defineEmits(["snackbar-emit"]);

const router = useRouter();

// ===== add property button loading =====
const loading = ref(false);

const addNewPropertyFormRef = ref(null);

const jobsCount = reactive([{ name: null, description: null, photos: null }]);

const propertyData = reactive({
  name: "",
  address: "",
  city: "",
  pincode: "",
});

const addNewPropertyFormValidation = {
  name: [
    (value) => {
      return notNullValidation(value);
    },
  ],
  address: [
    (value) => {
      return notNullValidation(value);
    },
  ],
  city: [
    (value) => {
      return notNullValidation(value);
    },
  ],
  pincode: [
    (value) => {
      return value?.trim()?.length == 6 && /[0-9-]+/.test(value)
        ? true
        : "property pincode must be 6 digit integer";
    },
  ],
  jobname: [
    (value) => {
      return notNullValidation(value);
    },
  ],
  jobimage: [
    (value) => {
      return value?.length > 0 ? true : "Atleast one image is required";
    },
  ],
};

function notNullValidation(value) {
  return value?.trim()?.length > 0 ? true : "required";
}

const addMoreJobs = async () => {
  jobsCount.push({ name: null, description: null, photos: null });
};

const removeMoreJobs = async () => {
  // atleast one job data is required, user can not delete all jobs
  if (jobsCount.length > 1) {
    jobsCount.pop();
  }
};

const addPropertyAndJobs = async () => {
  try {
    // console.log(JSON.stringify(values, null, 2));
    const result = await addNewPropertyFormRef.value.validate();

    if (result.valid) {
      loading.value = true;
      const formData = new FormData();
      formData.append("name", propertyData.name);
      formData.append("address", propertyData.address);
      formData.append("city", propertyData.city);
      formData.append("pincode", propertyData.pincode);

      jobsCount.map((element, index) => {
        formData.append(`jobname_${index}`, element.name);
        formData.append(`jobdescription_${index}`, element.description);
        element.photos.map((photo) => {
          formData.append(`photo_${index}`, photo);
        });
      });

      // for (const [key, value] of formData.entries()) {
      //   console.log(key, value);
      // }

      const res = await fetchPostWithFormDataAPI(
        `/property/add-property`,
        formData
      );

      console.log("res ", res);

      if (res?.success) {
        socket.emit("new-property-added", res.message);
        router.push({ name: "PropertyHistory" });
      } else {
        loading.value = false;
        emit("snackbar-emit", {
          display: true,
          innerText: `Something went wrong while adding property`,
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
      innerText: `Something went wrong while adding property`,
      bgColor: "error",
      icon: "close-circle",
    });
  }
};
</script>
