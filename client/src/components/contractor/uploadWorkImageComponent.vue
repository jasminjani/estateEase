<template>
  <div>
    <v-card-container>
      <v-card class="elevation-10 pa-2">
        <div class="font-weight-medium text-h6">work : {{ jobname }}</div>
        <div v-if="description != 'null'">description : {{ description }}</div>
        <div v-else>description : -</div>
        <div>photos :</div>
        <v-file-input
          name="workimage"
          label="upload work image"
          accept="image/*"
          clearable
          multiple
          counter
          show-size
          chips
        ></v-file-input>
      </v-card>
    </v-card-container>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

defineProps(["jobname", "description"]);
</script>
