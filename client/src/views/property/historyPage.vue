<script setup>
import Sidebar from "../../components/property/sideBar.vue";
import NoDataFoundComponent from "../../components/noDataFoundComponent.vue";
import { computed, onBeforeMount, ref } from "vue";
import socket from "../../socket";
import { useStore } from "vuex";

const store = useStore();
const userId = computed(() => store.getters.getUserId);
const userAllProperty = ref([]);

onBeforeMount(async () => {
  try {
    let userAllPropertys = await fetch(
      `${process.env.VUE_APP_BASE_URL}/get-property`,
      {
        credentials: "include",
        mode: "cors",
      }
    );
    userAllPropertys = await userAllPropertys.json();
    userAllProperty.value = await userAllPropertys.message;
    console.log(userAllProperty.value);
  } catch (error) {
    console.error(error);
  }
});

socket.on(`send-status-changed-${userId.value}`, (message) => {
  userAllProperty.value.forEach((element) => {
    if (element.id == message.property) {
      element.status = message.newStatus;
    }
  });
});
</script>

<template>
  <v-app>
    <v-navigation>
      <Sidebar />
    </v-navigation>
    <v-main>
      <v-content>
        <v-container fluid fill-height>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12" style="width: 100%; margin: 0 auto">
              <v-table>
                <thead>
                  <tr class="bg-primary">
                    <th class="text-left">Sr no.</th>
                    <th class="text-left">Property Name</th>
                    <th class="text-left">city</th>
                    <th class="text-left">Status</th>
                    <th class="text-left">view property</th>
                    <th class="text-left">view tender</th>
                  </tr>
                </thead>
                <tbody v-if="userAllProperty.length">
                  <tr v-for="(item, index) in userAllProperty" :key="item.id">
                    <td>{{ ++index }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.city }}</td>
                    <td v-if="item.is_approved == 0 && item.status == 0">
                      Submited
                    </td>
                    <td v-else-if="item.is_approved == 1 && item.status == 1">
                      Submited + in Progress
                    </td>
                    <td v-else-if="item.is_approved == 1 && item.status == 2">
                      Pending Payment
                    </td>
                    <td v-else-if="item.is_approved == 1 && item.status == 3">
                      Work Not accepted
                    </td>
                    <td v-else-if="item.is_approved == 1 && item.status == 4">
                      Completed
                    </td>
                    <td v-else>Status not found</td>
                    <td>
                      <router-link
                        :to="{
                          name: 'PropertyDetails',
                          params: { id: item.id },
                        }"
                      >
                        <v-btn class="bg-primary"
                          ><v-icon>mdi-eye</v-icon></v-btn
                        ></router-link
                      >
                    </td>
                    <td>
                      <router-link
                        :to="{
                          name: 'PropertyBidPrice',
                          params: { p_id: item.id },
                        }"
                      >
                        <v-btn class="bg-purple"
                          ><v-icon>mdi-eye</v-icon></v-btn
                        ></router-link
                      >
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="6" class="text-center">
                      <NoDataFoundComponent />
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-flex>
        </v-container>
      </v-content>
    </v-main>
  </v-app>
</template>

<style scoped>
/* .disabled {
  pointer-events: none;
} */
</style>
