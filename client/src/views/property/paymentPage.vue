<template>
  <v-app>
    <v-navigation>
      <Sidebar />
    </v-navigation>
    <v-main>
      <v-content>
        <v-container fluid fill-height style="height: 100dvh">
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12" style="width: 60%; margin: 0 auto">
              <v-toolbar dark color="primary">
                <v-toolbar-title class="text-center"
                  >Payment Page</v-toolbar-title
                >
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
                    <!-- <div>
                  Contractor name : {{ propertyData.user?.fname }}
                  {{ propertyData.user?.lname }}
                </div> -->
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
                  <!-- <v-spacer></v-spacer> -->
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
    </v-main>
  </v-app>
</template>

<script setup>
import { onBeforeMount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Sidebar from "../../components/property/sideBar.vue";
import { loadStripe } from "@stripe/stripe-js";
const route = useRoute();
const message = ref("");
const stripe = ref(null);
const paymentDetails = ref([]);
const loading = ref(false);

onBeforeMount(async () => {
  let res = await fetch(`${process.env.VUE_APP_BASE_URL}/get-payment-details`, {
    method: "post",
    mode: "cors",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ p_id: route.params.p_id }),
  });
  res = await res.json();
  paymentDetails.value = res.message;
  console.log("paymentDetails.value :>> ", paymentDetails.value);
});

onMounted(async () => {
  stripe.value = await loadStripe(
    `pk_test_51Pd3092M3wwlQ4nQU9oFBFimh5YPQq13d6EQP3tj04SmGwz1MLGSwzvde0pIBcqahW7ib2fxgu93H8UBOkrJFFI800fon3bbPJ`
  );
});

const payPayment = async () => {
  loading.value = true;
  let res = await fetch(
    `${process.env.VUE_APP_BASE_URL}/create-stripe-session`,
    {
      method: "post",
      mode: "cors",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        p_id: route.params.p_id,
        name: paymentDetails.value?.name,
        price: paymentDetails.value?.estimates[0]?.price,
      }),
    }
  );
  const session = await res.json();
  console.log("session ", session);
  console.log("session.id :>> ", session.id);
  console.log("stripe.value :>> ", stripe.value);
  const { error } = await stripe.value.redirectToCheckout({
    sessionId: session.id,
  });

  if (error) {
    loading.value = false;
    message.value = error.message;
  }

  // if (res.success) {
  //   console.log(router);
  //   router.push({ name: "login" });
  // } else {
  // console.log("failed");
  // }
  // } else {
  //   console.log("object");
  // }
};
</script>

<style scoped></style>
