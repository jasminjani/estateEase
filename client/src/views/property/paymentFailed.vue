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
        color="red"
        icon="mdi-alert-circle"
        size="112"
      ></v-icon>

      <h2 class="text-h5 mb-6">Oh no, Your payment failed.</h2>

      <p class="mb-4 text-medium-emphasis text-body-2">
        for going to history page, click on done button

        <br />

        Do, payment again.
      </p>

      <v-divider class="mb-4"></v-divider>

      <div class="text-center">
        <v-btn
          class="text-none"
          color="success"
          variant="flat"
          rounded
          @click="router.push({ name: 'PropertyHistory' })"
        >
          Go to History page
        </v-btn>
      </div>
    </v-sheet>
  </v-main>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
</script>
