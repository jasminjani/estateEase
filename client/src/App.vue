<template>
  <v-app>
    <v-navigation>
      <PropertySidebar v-if="roleId == 1" />
      <ContractorSidebar v-else-if="roleId == 2" />
    </v-navigation>
    <v-main>
      <div>
        <router-view></router-view>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import PropertySidebar from "./components/property/sideBar.vue";
import ContractorSidebar from "./components/contractor/sideBar.vue";
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();

const roleId = computed(() => store.getters.getRoleId);
</script>
