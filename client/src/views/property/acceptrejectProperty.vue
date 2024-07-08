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
              <v-toolbar dark color="primary">
                <v-toolbar-title class="text-center"
                  >{{ estimatePriceData.name }}, {{ estimatePriceData.city }} -
                  {{ estimatePriceData.pincode }}
                </v-toolbar-title>
              </v-toolbar>
              <!-- <v-card-subtitle>ahmedabad, 380015</v-card-subtitle>
              <v-card-title>Silver Radiance 2 </v-card-title> -->
              <!-- <v-card-text> -->
              <!-- <div>ahmedabad, 380015</div> -->
              <!-- </v-card-text> -->
              <v-table>
                <thead>
                  <tr class="bg-light-blue">
                    <th class="text-center">Sr no.</th>
                    <th class="text-center">Bider Name</th>
                    <th class="text-center">Price</th>
                    <th colspan="3" class="text-center">Status</th>
                  </tr>
                </thead>
                <tbody v-if="estimatePriceData.estimates?.length">
                  <tr
                    v-for="(item, index) in estimatePriceData.estimates"
                    :key="item.id"
                  >
                    <!-- {{ item.user.fname }} -->
                    <td class="text-center">{{ ++index }}</td>
                    <td class="text-center">
                      {{ item.user.fname }} {{ item.user.lname }}
                    </td>
                    <td class="text-center">{{ item.price }}</td>
                    <td class="text-center">
                      <v-btn class="bg-green ml-2" @click="approveBid"
                        ><v-icon>mdi-check</v-icon></v-btn
                      >
                      <v-btn
                        class="bg-red ml-2" @click="rejectBid"
                      ><v-icon>mdi-cancel</v-icon></v-btn>
                      <v-btn
                        class="bg-primary ml-2"
                      ><v-icon>mdi-message-text</v-icon></v-btn>
                    </td>
                    <!-- <td v-if="item.is_approved == 0">Submited</td>
                    <td v-else-if="item.is_approved == 1">
                      Submited + in Progress
                    </td> -->
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="4" class="text-center">No Data Found !!</td>
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

<script setup>
import Sidebar from "../../components/property/sideBar.vue";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

const estimatePriceData = ref([]);

const route = useRoute();

onBeforeMount(async () => {
  let res = await fetch(
    `${process.env.VUE_APP_BASE_URL}/get-estimate-price/${route.params.p_id}`,
    {
      mode: "cors",
      credentials: "include",
    }
  );
  res = await res.json();
  estimatePriceData.value = res.message;
  console.log(estimatePriceData.value);
});
</script>
