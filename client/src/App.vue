<template>
  <v-app>
    <v-navigation>
      <PropertySidebar @snackbar-emit="receiveEmit" v-if="roleId == 1" />
      <ContractorSidebar @snackbar-emit="receiveEmit" v-else-if="roleId == 2" />
    </v-navigation>
    <v-main>
      <div>
        <router-view @snackbar-emit="receiveEmit"></router-view>
      </div>
      <v-snackbar
        v-model="snackbar.display"
        :timeout="2000"
        :color="snackbar.bgColor"
        elevation="12"
      >
        <v-icon class="mr-2">mdi-{{ snackbar.icon }}</v-icon>
        <span class="text-subtitle-1">
          {{ snackbar.innerText }}
        </span>

        <!-- <p>This is a longer paragraph explaining something</p> -->
        <template v-slot:actions>
          <v-btn color="red" variant="text" @click="snackbar.display = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script setup>
import PropertySidebar from "./components/property/sideBar.vue";
import ContractorSidebar from "./components/contractor/sideBar.vue";
import { useStore } from "vuex";
import { computed, reactive } from "vue";

const store = useStore();

// ===== snackbar references =====
const snackbar = reactive({
  display: false,
  innerText: "Hey",
  bgColor: "info",
  icon: "information",
});
function receiveEmit(payload) {
  if (
    !payload.display ||
    !payload.innerText ||
    !payload.bgColor ||
    !payload.icon
  ) {
    snackbar.icon = "alert-circle";
    snackbar.bgColor = "warning";
    snackbar.innerText = "Can not able to load payload";
    snackbar.display = true;
  } else {
    snackbar.icon = payload.icon;
    snackbar.bgColor = payload.bgColor;
    snackbar.innerText = payload.innerText;
    snackbar.display = payload.display;
  }
}

const roleId = computed(() => store.getters.getRoleId);
</script>
