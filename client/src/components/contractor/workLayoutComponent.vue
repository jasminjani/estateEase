<template>
  <div>
    <v-card-container>
      <v-card class="elevation-10 pa-2">
        <div class="font-weight-medium text-h6">work : {{ jobname }}</div>
        <div v-if="description != 'null'">description : {{ description }}</div>
        <div v-else>description : -</div>
        <div>photos :</div>
        <v-row>
          <v-col
            v-for="(photo, item) in photos"
            :key="photo.id"
            class="d-flex child-flex"
            cols="3"
          >
            <v-img
              v-if="photo.photo"
              :lazy-src="`https://picsum.photos/10/6?image=${item * 5 + 10}`"
              :src="photo.photo"
              aspect-ratio="16/9"
              class="bg-grey-lighten-2"
              cover
            >
              <template v-slot:placeholder>
                <v-row align="center" class="fill-height ma-0" justify="center">
                  <v-progress-circular
                    color="grey-lighten-5"
                    indeterminate
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-col>
        </v-row>
        <v-card-text v-if="isReviewWorkPath == 'review-work'">
          <v-textarea
            v-model="reviewComments.comment"
            prepend-inner-icon="mdi-comment"
            name="comment"
            label="Add Comments"
            type="textarea"
            clearable
            counter
          ></v-textarea>
        </v-card-text>
      </v-card>
    </v-card-container>
  </div>
</template>

<script setup>
import { defineProps, ref } from "vue";
import { useRoute } from "vue-router";

defineProps(["jobname", "description", "photos", "index", "work_proof_id"]);

const route = useRoute();

const routhFullPath = ref(route.fullPath.split("/"));
routhFullPath.value.pop();
const isReviewWorkPath = routhFullPath.value.pop().toLowerCase();
</script>
