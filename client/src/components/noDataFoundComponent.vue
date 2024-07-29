<template>
  <v-card-item>
    <v-img
      style="width: 50px; height: 50px; margin: 0 auto"
      :lazy-src="`https://picsum.photos/10/6?image=${1 * 5 + 10}`"
      src="../assets/happyFace.png"
      aspect-ratio="16/9"
      class="bg-grey-lighten-2"
      cover
    ></v-img>
    <v-card-title class="text-h5 d-flex justify-center">
      No Data Found !!
    </v-card-title>
  </v-card-item>
</template>
