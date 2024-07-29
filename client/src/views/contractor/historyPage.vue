<script setup>
import { computed, onBeforeMount, ref } from "vue";
import NoDataFoundComponent from "../../components/noDataFoundComponent.vue";
import socket from "../../socket";
// import socket from "@/socket";
import { useStore } from "vuex";

const store = useStore();

const userId = computed(() => store.getters.getUserId);

const userAllPropertyHistory = ref([]);

onBeforeMount(async () => {
  try {
    let res = await fetch(
      `${process.env.VUE_APP_BASE_URL}/get-estimate-history`,
      {
        credentials: "include",
        mode: "cors",
      }
    );
    res = await res.json();
    userAllPropertyHistory.value = await res.message;
    console.log(userAllPropertyHistory.value);
  } catch (error) {
    console.error(error);
  }
});

socket.on(`send-status-changed-${userId.value}`, (message) => {
  userAllPropertyHistory.value.forEach((element) => {
    if (element.p_id == message.property) {
      if (element.status == null && message.newStatus == 0) {
        element.status = message.newStatus;
      } else if (element.status == null && message.newStatus == 1) {
        element.status = message.newStatus;
        element.property.status = message.newStatus;
      } else {
        element.property.status = message.newStatus;
      }
    }
  });
});
</script>

<template>
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
                <th class="text-left">Bidded price</th>
                <th class="text-left">Status</th>
                <th class="text-left">Other</th>
              </tr>
            </thead>
            <tbody v-if="userAllPropertyHistory.length">
              <tr
                v-for="(item, index) in userAllPropertyHistory"
                :key="item.id"
              >
                <td>{{ ++index }}</td>
                <td>{{ item.property.name }}</td>
                <td>{{ item.property.city }}</td>
                <td>{{ item.price }}</td>
                <td v-if="item.status == null">Submited</td>
                <td v-else-if="item.status == 0">Rejected</td>
                <td v-else-if="item.status == 1 && item.property.status == 1">
                  Approve + In progress
                </td>
                <td v-else-if="item.status == 1 && item.property.status == 2">
                  Payment Pending
                </td>
                <td v-else-if="item.status == 1 && item.property.status == 3">
                  Work not accepted
                </td>
                <td v-else-if="item.status == 1 && item.property.status == 4">
                  Completed
                </td>
                <td v-else>Status not found</td>
                <td>
                  <router-link
                    v-if="
                      (item.status == 1 && item.property.status == 1) ||
                      (item.status == 1 && item.property.status == 3)
                    "
                    :to="{
                      name: 'ContractorUploadProof',
                      params: { p_id: item.p_id, estimate_id: item.id },
                    }"
                  >
                    <v-btn class="bg-primary" prepend-icon="mdi-upload"
                      >Upload work</v-btn
                    >
                  </router-link>

                  <router-link
                    v-if="item.status !== false"
                    :to="{
                      name: 'ContractorChat',
                      params: {
                        id: item.property.powner_id,
                        p_id: item.p_id,
                      },
                    }"
                  >
                    <v-btn class="bg-primary ml-2"
                      ><v-icon>mdi-message-text</v-icon></v-btn
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
</template>

<style scoped>
.disabled {
  pointer-events: none;
}
</style>
