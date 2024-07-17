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
              <div>
                <PropertyDetailComponent :propertyData="propertyData" />
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
                    <v-btn
                      class="bg-purple w-50"
                      @click="
                        router.push({
                          name: 'ContractorChat',
                          params: {
                            id: propertyData.user?.id,
                            p_id: route.params.id,
                          },
                        })
                      "
                      >Chat with owner
                    </v-btn>
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
import PropertyDetailComponent from "../../components/propertyDetailComponent.vue";
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
  try {
    let res = await fetch(
      `${process.env.VUE_APP_BASE_URL}/get-property-all-details-by-id/${route.params.id}`,
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

const applyTender = async () => {
  try {
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
        router.push({ name: "ContarctorHistory" });
      } else {
        alert("something went wrong : can not able to apply tender");
      }
    } else {
      console.log("something went wrong");
    }
  } catch (error) {
    console.error(error);
  }
};
</script>
