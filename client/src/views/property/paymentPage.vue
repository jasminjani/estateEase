<template>
  <v-content>
    <v-container fluid fill-height style="height: 100dvh">
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12" style="width: 60%; margin: 0 auto">
          <v-toolbar dark color="primary">
            <v-toolbar-title class="text-center">Payment Page</v-toolbar-title>
          </v-toolbar>
          <v-card-text class="text-center">
            <div>
              <v-card-item>
                <v-card-title class="text-h5">{{
                  paymentDetails.name
                }}</v-card-title>
              </v-card-item>
              <v-card-text>
                <div class="mb-2">
                  {{ paymentDetails.city }} - {{ paymentDetails.pincode }}
                </div>
                <div v-if="paymentDetails?.estimates?.length > 0">
                  <div class="mb-6">
                    Contractor :
                    {{ paymentDetails?.estimates[0]?.user?.fname }}
                    {{ paymentDetails?.estimates[0]?.user?.lname }}
                  </div>
                </div>
                <div v-if="paymentDetails?.estimates?.length > 0">
                  <div
                    class="text-h5 bg-indigo-lighten-5 rounded-lg d-inline pa-3 mb-2"
                  >
                    Price : ₹ {{ paymentDetails?.estimates[0]?.price }}
                  </div>
                </div>
                <div v-else>
                  <div>Price : -</div>
                </div>
              </v-card-text>
            </div>
            <v-card-actions>
              <v-btn
                :disabled="loading"
                :loading="loading"
                class="d-flex bg-purple"
                style="margin: 0 auto"
                @click.prevent="payPayment"
                block
                >Pay</v-btn
              >
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-container>
  </v-content>
</template>

<script setup>
import { onBeforeMount, onMounted, ref, defineEmits } from "vue";
import { useRoute } from "vue-router";
import { loadStripe } from "@stripe/stripe-js";
import { fetchPostAPI } from "@/services/fetch.api";

const route = useRoute();

const message = ref("");
const stripe = ref(null);
const paymentDetails = ref([]);
const loading = ref(false);

const emit = defineEmits(["snackbar-emit"]);

onBeforeMount(async () => {
  try {
    const res = await fetchPostAPI(
      `/property/get-payment-details`,
      { p_id: route.params.p_id }
    );
    if (res?.success) {
      paymentDetails.value = await res.message;
    } else {
      console.error(res);
      emit("snackbar-emit", {
        display: true,
        innerText: `Can not able to load page`,
        bgColor: "error",
        icon: "close-circle",
      });
    }
    console.log("paymentDetails.value :>> ", paymentDetails.value);
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

onMounted(async () => {
  try {
    stripe.value = await loadStripe(
      `pk_test_51Pd3092M3wwlQ4nQU9oFBFimh5YPQq13d6EQP3tj04SmGwz1MLGSwzvde0pIBcqahW7ib2fxgu93H8UBOkrJFFI800fon3bbPJ`
    );
  } catch (error) {
    console.error(error);
  }
});

const payPayment = async () => {
  try {
    loading.value = true;

    const res = await fetchPostAPI(
      `/property/create-stripe-session`,
      {
        p_id: route.params.p_id,
        name: paymentDetails.value?.name,
        price: paymentDetails.value?.estimates[0]?.price,
        contracter_id: paymentDetails.value?.estimates[0]?.user?.id,
      }
    );

    const session = await res;

    const { error } = await stripe.value.redirectToCheckout({
      sessionId: session.id,
    });

    if (error) {
      loading.value = false;
      message.value = error.message;
    }
  } catch (error) {
    loading.value = false;
    console.error(error);
    emit("snackbar-emit", {
      display: true,
      innerText: `SOmething went wrong while doing Payment`,
      bgColor: "error",
      icon: "close-circle",
    });
  }
};
</script>

<style scoped></style>
