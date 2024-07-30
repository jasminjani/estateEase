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
          <v-card class="ma-2">
            <v-form ref="applyTenderFormRef" :rules="priceValidationRule">
              <v-text-field
                v-model="applyTenderFormData.price"
                :rules="priceValidationRule.price"
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
</template>

<script setup>
import socket from "../../socket";
import PropertyDetailComponent from "../../components/propertyDetailComponent.vue";
import { onBeforeMount, reactive, ref, defineEmits } from "vue";
import { useRoute, useRouter } from "vue-router";

const emit = defineEmits(["snackbar-emit"]);

const applyTenderFormRef = ref(null);
const applyTenderFormData = reactive({ price: "" });
const priceValidationRule = {
  price: [
    (value) => {
      return value?.trim()?.length > 0
        ? value > 0
          ? !value.startsWith("+")
            ? true
            : "no need to write + in bid price"
          : "Price should be positive number"
        : "required";
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
  } catch (error) {
    console.error(error);
  }
});

const applyTender = async () => {
  try {
    const result = await applyTenderFormRef.value.validate();

    if (result.valid) {
      let res = await fetch(
        `${process.env.VUE_APP_BASE_URL}/add-estimate-price`,
        {
          method: "post",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            p_id: route.params.id,
            price: applyTenderFormData.price,
          }),
        }
      );
      res = await res.json();
      console.log(res);
      if (res && res?.success) {
        socket.emit("new-bid-data", {
          data: res.message,
          receiver: propertyData.value.user?.id,
        });
        router.push({ name: "ContarctorHistory" });
      } else if (res && !res?.success) {
        alert(res.message);
      } else {
        emit("snackbar-emit", {
          display: true,
          innerText: `something went wrong : can not able to apply tender`,
          bgColor: "error",
          icon: "close-circle",
        });
      }
    } else {
      console.error("something went wrong");
    }
  } catch (error) {
    console.error(error);
  }
};
</script>
