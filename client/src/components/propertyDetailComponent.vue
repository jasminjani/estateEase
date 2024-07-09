<template>
  <v-toolbar dark color="primary">
    <v-toolbar-title class="text-center">Property Details</v-toolbar-title>
  </v-toolbar>
  <div>
    <!-- <v-card-container> -->
    <!-- <v-card class="elevation-10"> -->
    <v-card-item>
      <v-card-title class="text-h5">{{ propertyData.name }}</v-card-title>
    </v-card-item>
    <v-card-text>
      <div>{{ propertyData.address }}</div>
      <div>{{ propertyData.city }} - {{ propertyData.pincode }}</div>
      <div>
        Property owner : {{ propertyData.user?.fname }}
        {{ propertyData.user?.lname }}
      </div>
    </v-card-text>
    <!-- </v-card> -->
    <!-- </v-card-container> -->
  </div>
  <div class="text-h6 ma-2">Work details :</div>
  <div class="ma-2" v-for="job in propertyData.jobs" :key="job.id">
    <WorkLayoutComponent
      :jobname="job.jobname"
      :description="job.job_description"
    />
  </div>
</template>

<script setup>
import WorkLayoutComponent from "../components/contractor/workLayoutComponent.vue";
import { defineProps } from "vue";

defineProps(["propertyData"]);
</script>
