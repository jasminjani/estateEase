<template>
  <v-card-container classs="w-100">
    <v-card class="ma-3 elevation-10">
      <v-card-item>
        <v-card-title class="text-h5"> {{ name }} </v-card-title>
      </v-card-item>
      <v-card-text>
        <div>{{ address }}</div>
        <div>{{ city }}</div>
        <div>{{ pincode }}</div>
        <div class="text-h6 mt-2 mb-2">work to do :</div>
        <div>
          <ul class="pl-4" v-for="job in jobs" :key="job.jobname">
            <li>{{ job.jobname }}</li>
          </ul>
        </div>
      </v-card-text>
      <v-card-actions>
        <router-link
          class="text-decoration-none w-100"
          style="color: white"
          :to="{ name: 'COntractorPropertyDetails', params: { id: id } }"
          ><v-btn block class="bg-purple" :id="id">Apply</v-btn></router-link
        >
      </v-card-actions>
    </v-card>
  </v-card-container>
</template>

<script setup>
import { defineProps } from "vue";

defineProps(["name", "address", "city", "pincode", "jobs", "id"]);
</script>
