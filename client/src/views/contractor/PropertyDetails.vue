<template>property details</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const propertyData = ref([]);

onBeforeMount(async () => {
  let res = await fetch(
    `${process.env.VUE_APP_BASE_URL}/get-property-all-details-by-id/${route.params.id}`,
    {
      mode: "cors",
      credentials: "include",
    }
  );
  res = await res.json();
  propertyData.value = await res.message;
  console.log(propertyData.value);
});
</script>
