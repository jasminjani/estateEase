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
          <v-col
            v-for="(photo, item) in photos"
            :key="photo.id"
            class="d-flex child-flex"
            cols="3"
          >
            <!-- <v-col v-for="n in 5" :key="n" class="d-flex child-flex" cols="3"> -->
            <!-- {{ photo.photo }} -->
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

    <!-- </div> -->
  </div>
</template>

<script setup>
import { computed, defineProps, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const props = defineProps([
  "jobname",
  "description",
  "photos",
  "index",
  "work_proof_id",
]);
console.log("props", props.index);

const route = useRoute();
const store = useStore();

const reviewComments = computed(() =>
  store.getters.getReviewCommentState(props?.index)
);

console.log(
  "props.work_proof_id && props.index :>> ",
  props.work_proof_id,
  props.index
);

if (props.work_proof_id && props.index) {
  await store.commit("addWorkProofIdInComment", {
    work_proof_id: props.work_proof_id,
    index: props.index,
  });
}

// console.log("reviewComments :>> ", reviewComments);

const routhFullPath = ref(route.fullPath.split("/"));
routhFullPath.value.pop();
const isReviewWorkPath = routhFullPath.value.pop().toLowerCase();
// console.log("route.fullPath.split('/') :>> ", isReviewWorkPath);
</script>
