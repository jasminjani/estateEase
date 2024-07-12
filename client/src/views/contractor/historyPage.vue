<script setup>
import Sidebar from "../../components/contractor/sideBar.vue";
import NoDataFoundComponent from "../../components/noDataFoundComponent.vue";
import { onBeforeMount, ref } from "vue";

const userAllPropertyHistory = ref([]);

onBeforeMount(async () => {
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
                    <th class="text-left">Bidded price</th>
                    <th class="text-left">Status</th>
                    <th class="text-left">view property</th>
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
                    <td
                      v-else-if="item.status == 1 && item.property.status == 1"
                    >
                      Approve + In progress
                    </td>
                    <td
                      v-else-if="item.status == 1 && item.property.status == 2"
                    >
                      Payment Pending
                    </td>
                    <td
                      v-else-if="item.status == 1 && item.property.status == 3"
                    >
                      Work not accepted
                    </td>
                    <td
                      v-else-if="item.status == 1 && item.property.status == 4"
                    >
                      Completed
                    </td>
                    <td v-else>Status not found</td>
                    <td
                      v-if="
                        (item.status == 1 && item.property.status == 1) ||
                        (item.status == 1 && item.property.status == 3)
                      "
                    >
                      <router-link
                        :to="{
                          name: 'ContractorUploadProof',
                          params: { p_id: item.p_id, estimate_id: item.id },
                        }"
                      >
                        <v-btn class="bg-primary" prepend-icon="mdi-upload"
                          >Upload work</v-btn
                        >
                      </router-link>
                    </td>
                    <td v-else></td>
                    <!-- <td>
                      <router-link
                        :class="{ disabled: item.is_approved == 1 }"
                        :to="{
                          name: 'PropertyBidPrice',
                          params: { p_id: item.id },
                        }"
                      >
                        <v-btn
                          class="bg-primary"
                          :disabled="item.is_approved == 1"
                          ><v-icon>mdi-eye</v-icon></v-btn
                        ></router-link
                      >
                    </td> -->
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
.disabled {
  pointer-events: none;
}
</style>
