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
  <div class="ma-2" v-for="(job, index) in propertyData.jobs" :key="job.id">
    <!-- {{ job.job_photos[0].photo }} -->
    <WorkLayoutComponent
      v-if="job.work_proofs?.length > 0"
      :jobname="job.jobname"
      :description="job.job_description"
      :photos="job.work_proofs[0]?.job_photos"
      :work_proof_id="job.work_proofs[0]?.id"
      :index="index"
    />
    <WorkLayoutComponent
      v-else-if="job.job_photos"
      :jobname="job.jobname"
      :description="job.job_description"
      :photos="job.job_photos"
    />
    <!-- <WorkLayoutComponent
      v-else
      :jobname="job.jobname"
      :description="job.job_description"
    /> -->
  </div>
</template>

<script setup>
import WorkLayoutComponent from "../components/contractor/workLayoutComponent.vue";
import { defineProps } from "vue";

defineProps(["propertyData"]);
</script>
