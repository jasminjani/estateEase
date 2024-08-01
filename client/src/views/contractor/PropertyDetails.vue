<template>
  <v-content>
    <v-container fluid fill-height>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12" style="width: 100%; margin: 0 auto">
          <div>
            <PropertyDetailComponent
              v-if="propertyData"
              :propertyData="propertyData"
            />
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
import { fetchGetAPI, fetchPostAPI } from "@/services/fetch.api";

const route = useRoute();
const router = useRouter();

const emit = defineEmits(["snackbar-emit"]);

const propertyData = ref([]);

// ===== FOR VALIDATION AND FORM DATA =====
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

onBeforeMount(async () => {
  try {
    const res = await fetchGetAPI(
      `/contractor/get-property-all-details-by-id/${route.params.id}`
    );
    if (res?.success) {
      propertyData.value = await res.message;
    } else {
      console.error(res);
      emit("snackbar-emit", {
        display: true,
        innerText: `Can not able to load page`,
        bgColor: "error",
        icon: "close-circle",
      });
    }
    console.log(propertyData.value);
  } catch (error) {
    console.error(error);
    emit("snackbar-emit", {
      display: true,
      innerText: `Can not able to load page`,
      bgColor: "error",
      icon: "close-circle",
    });
  }
});

const applyTender = async () => {
  try {
    const result = await applyTenderFormRef.value.validate();

    if (result.valid) {
      let res = await fetchPostAPI(
        `/contractor/add-estimate-price`,
        {
          p_id: route.params.id,
          price: applyTenderFormData.price,
        }
      );
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
      console.error("Result validation failed");
    }
  } catch (error) {
    console.error(error);
    emit("snackbar-emit", {
      display: true,
      innerText: `Something went wrong while apply tender`,
      bgColor: "error",
      icon: "close-circle",
    });
  }
};
</script>
