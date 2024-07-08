<template>
  <div>
    <v-card-container>
      <v-card class="elevation-10 pa-2">
        <!-- <v-card-item>
          <v-card-title class="text-h5"> {{ name }} </v-card-title>
        </v-card-item> -->
        <div class="font-weight-medium text-h6">work : {{ jobname }}</div>
        <div v-if="description != 'null'">description : {{ description }}</div>
        <div v-else>description : -</div>
        <div>photos :</div>
        <!-- <div> -->
        <v-row>
          <v-col v-for="n in 5" :key="n" class="d-flex child-flex" cols="3">
            <v-img
              :lazy-src="`https://picsum.photos/10/6?image=${n * 5 + 10}`"
              :src="`https://picsum.photos/500/300?image=${n * 5 + 10}`"
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
      </v-card>
    </v-card-container>

    <!-- </div> -->
  </div>
</template>

<script setup>
import { defineProps } from "vue";

defineProps(["jobname", "description"]);
</script>
