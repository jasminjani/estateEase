<template>
  <v-toolbar dark color="primary">
    <v-toolbar-title class="text-center">Property Details</v-toolbar-title>
  </v-toolbar>
  <div>
    <v-card-item>
      <v-card-title class="text-h5">{{ propertyData?.name }}</v-card-title>
    </v-card-item>
    <v-card-text>
      <div>{{ propertyData?.address }}</div>
      <div>{{ propertyData?.city }} - {{ propertyData?.pincode }}</div>
      <div>
        Property owner : {{ propertyData?.user?.fname }}
        {{ propertyData?.user?.lname }}
      </div>
    </v-card-text>
  </div>
  <div class="text-h6 ma-2">Work details :</div>
  <span v-if="propertyData?.jobs?.length > 0">
    <div class="ma-2" v-for="(job, index) in propertyData.jobs" :key="job.id">
      <!-- If data contains work proof data -->
      <WorkLayoutComponent
        v-if="job.work_proofs?.length > 0"
        :jobname="job.jobname"
        :description="job.job_description"
        :photos="job.work_proofs[0]?.job_photos"
        :work_proof_id="job.work_proofs[0]?.id"
        :index="index"
      />
      <!-- If data does not contains work proof data -->
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
  </span>
</template>

<script setup>
import WorkLayoutComponent from "../components/contractor/workLayoutComponent.vue";
import { defineProps } from "vue";

defineProps(["propertyData"]);
</script>
