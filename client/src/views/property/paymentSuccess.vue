<template>
  <v-main class="d-flex align-center" style="height: 100dvh">
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
import socket from "../../socket";
import { onMounted, defineEmits } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const emit = defineEmits(["snackbar-emit"]);

onMounted(async () => {
  try {
    let res = await fetch(`${process.env.VUE_APP_BASE_URL}/mark-payment-done`, {
      method: "post",
      mode: "cors",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        p_id: route.params.p_id,
        session_id: route.query.session_id,
      }),
    });
    res = await res.json();
    console.log("res : ", res);

    if (res.success) {
      socket.emit("status-changed", {
        receiver: route.params.contracter_id,
        property: route.params.p_id,
        newStatus: 4,
      });
    }
  } catch (error) {
    console.error(error);
    emit("snackbar-emit", {
      display: true,
      innerText: `Something went wrong`,
      bgColor: "error",
      icon: "close-circle",
    });
  }
});
</script>
