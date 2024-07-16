<template>
  <v-main
    class="bg-indigo-lighten-5 d-flex align-center"
    style="height: 100dvh"
  >
    <v-sheet
      class="pa-4 text-center mx-auto"
      elevation="12"
      max-width="600"
      rounded="lg"
      width="100%"
    >
      <v-icon
        class="mb-5"
        color="success"
        icon="mdi-check-circle"
        size="112"
      ></v-icon>

      <h2 class="text-h5 mb-6">Successfully paid Amount</h2>

      <p class="mb-4 text-medium-emphasis text-body-2">
        for going to history page, click on done button

        <br />

        Otherwise, you're done!
      </p>

      <v-divider class="mb-4"></v-divider>

      <div class="text-end">
        <v-btn
          class="text-none"
          color="success"
          variant="flat"
          width="90"
          rounded
          @click="router.push({ name: 'PropertyHistory' })"
        >
          Done
        </v-btn>
      </div>
    </v-sheet>
  </v-main>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

onMounted(async () => {
  try {
    await fetch(`${process.env.VUE_APP_BASE_URL}/mark-payment-done`, {
      method: "post",
      mode: "cors",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: { p_id: route.params.p_id, payment_id: route.params.payment_id },
    });
  } catch (error) {
    console.error(error);
  }
});
</script>
