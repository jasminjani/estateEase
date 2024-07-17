<template>
  <v-app>
    <v-navigation>
      <Sidebar />
    </v-navigation>
    <v-main>
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
                <v-form>
                  <v-text-field
                    v-model="name.value.value"
                    :error-messages="name.errorMessage.value"
                    prepend-icon="mdi-city"
                    name="name"
                    label="Property Name"
                    type="text"
                    clearable
                  ></v-text-field>

                  <v-textarea
                    v-model="address.value.value"
                    :error-messages="address.errorMessage.value"
                    prepend-icon="mdi-home-city"
                    name="address"
                    label="Property address"
                    type="textarea"
                    clearable
                    counter
                  ></v-textarea>
                  <v-text-field
                    v-model="city.value.value"
                    :error-messages="city.errorMessage.value"
                    prepend-icon="mdi-map-marker"
                    name="city"
                    label="City"
                    type="text"
                    clearable
                  ></v-text-field>
                  <v-text-field
                    v-model="pincode.value.value"
                    :error-messages="pincode.errorMessage.value"
                    prepend-icon="mdi-fire-hydrant"
                    name="pincode"
                    label="Pincode"
                    type="text"
                    clearable
                  ></v-text-field>
                  <!-- <JobComponent /> -->
                  <div id="outerDiv">
                    {{ jobsCount.count }}
                    <div
                      id="innerDiv"
                      v-for="(count, index) in jobsCount"
                      :key="index"
                    >
                      <v-text-field
                        v-model="jobsCount[index].name"
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
    </v-main>
  </v-app>
</template>

<script setup>
import Sidebar from "../../components/property/sideBar.vue";
// import JobComponent from "../../components/property/JobComponent.vue";

import { useField, useForm } from "vee-validate";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import * as yup from "yup";

const router = useRouter();

const loading = ref(false);

// watch(loading, (val) => {
//   if (!val) return;

//   setTimeout(() => (loading.value = false), 2000);
// });

const myFileObject = ref(null);
console.log(myFileObject.value);

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    name: yup.string().required().trim(),
    address: yup.string().required(),
    city: yup.string().required().trim(),
    pincode: yup
      .string()
      .required()
      .trim()
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(6, "Must be exactly 6 digits")
      .max(6, "Must be exactly 6 digits"),
    //jobname_0: yup.string().required("job name is required").trim(),
    //photo_0: yup.mixed().required("Image is requireeed"),
    // jobdescription_0: yup.string(),
  }),
});

const name = useField("name");
const address = useField("address");
const city = useField("city");
const pincode = useField("pincode");
// const jobname1 = useField("jobname1");
// const job_description1 = useField("job_description1");
// const jobimage = useField("jobimage");

const jobsCount = reactive([{ name: null, description: null, photos: null }]);

const addMoreJobs = async () => {
  let element = {};
  element.name = null;
  element.description = null;
  element.photos = null;

  jobsCount.push(element);
};

const removeMoreJobs = async () => {
  if (jobsCount.length > 1) {
    jobsCount.pop();
  }
};

const addPropertyAndJobs = handleSubmit(async () => {
  try {
    // console.log(JSON.stringify(values, null, 2));
    // alert(JSON.stringify(values, null, 2));
    loading.value = true;
    const formData = new FormData();
    formData.append("name", name.value.value);
    formData.append("address", address.value.value);
    formData.append("city", city.value.value);
    formData.append("pincode", pincode.value.value);

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

    let res = await fetch(`${process.env.VUE_APP_BASE_URL}/add-property`, {
      method: "post",
      credentials: "include",
      mode: "cors",
      body: formData,
    });
    res = await res.json();
    console.log(res);

    if (res.success) {
      console.log("res is successfully arrived");
      router.push({ name: "PropertyHistory" });
    } else {
      loading.value = false;
      alert("something went wrong");
    }
  } catch (error) {
    console.error(error);
  }
});
</script>
