<template>
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
                <th class="text-center">Status</th>
                <th colspan="3" class="text-center">Other</th>
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
                <td v-if="item.status == null" class="text-center">Pending</td>
                <td
                  v-else-if="item.status == 1 && estimatePriceData.status == 1"
                  class="text-center"
                >
                  In Progress
                </td>
                <td
                  v-else-if="item.status == 1 && estimatePriceData.status == 2"
                  class="text-center"
                >
                  Pending Payment
                </td>
                <td
                  v-else-if="item.status == 1 && estimatePriceData.status == 3"
                  class="text-center"
                >
                  Work Not accepted
                </td>
                <td
                  v-else-if="item.status == 1 && estimatePriceData.status == 4"
                  class="text-center"
                >
                  Completed
                </td>
                <td v-else>Status not found</td>
                <td class="text-center">
                  <v-btn
                    v-if="item.status == null"
                    class="bg-green ml-2"
                    @click="approveBid(item.id, item.user.id)"
                    ><v-icon>mdi-check</v-icon></v-btn
                  >
                  <v-btn
                    v-if="item.status == null"
                    class="bg-red ml-2"
                    @click="rejectBid(item.id, item.user.id, index)"
                    ><v-icon>mdi-cancel</v-icon></v-btn
                  >
                  <router-link
                    v-if="item.status == 1 && estimatePriceData.status == 2"
                    :to="{
                      name: 'PropertyReviewWork',
                      params: { id: route.params.p_id },
                    }"
                  >
                    <v-btn class="bg-green ml-2"
                      >review & pay</v-btn
                    ></router-link
                  >
                  <router-link
                    :to="{
                      name: 'PropertyChat',
                      params: { id: item.user.id, p_id: route.params.p_id },
                    }"
                  >
                    <v-btn class="bg-primary ml-2"
                      ><v-icon>mdi-message-text</v-icon></v-btn
                    ></router-link
                  >
                </td>
                <!-- <td v-if="item.is_approved == 0">Submited</td>
                    <td v-else-if="item.is_approved == 1">
                      Submited + in Progress
                    </td> -->
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="5" class="text-center">
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

<script setup>
import NoDataFoundComponent from "../../components/noDataFoundComponent.vue";
import { computed, onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import socket from "../../socket";
import { useStore } from "vuex";

const estimatePriceData = ref([]);

const route = useRoute();
const router = useRouter();
const store = useStore();

const userId = computed(() => store.getters.getUserId);

onBeforeMount(async () => {
  try {
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
  } catch (error) {
    console.error(error);
  }
});

socket.on(`send-new-bid-data-${userId.value}`, (message) => {
  estimatePriceData.value.estimates.push(message);
});

socket.on(`send-status-changed-${userId.value}`, (message) => {
  estimatePriceData.value.status = message.newStatus;
});

const approveBid = async (estimate_id, receiver_id) => {
  try {
    let res = await fetch(`${process.env.VUE_APP_BASE_URL}/approve-bid`, {
      method: "post",
      mode: "cors",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: estimate_id, p_id: route.params.p_id }),
    });
    res = await res.json();

    if (res.success) {
      socket.emit("status-changed", {
        receiver: receiver_id,
        property: route.params.p_id,
        newStatus: 1,
      });
      estimatePriceData.value.estimates.forEach((element) => {
        if (element.user.id !== receiver_id) {
          socket.emit("status-changed", {
            receiver: element.user.id,
            property: route.params.p_id,
            newStatus: 0,
          });
        }
      });
      router.push({ name: "PropertyHistory" });
      alert("Bid approved successfully");
    } else {
      alert("Problem occured on approving bid");
    }
  } catch (error) {
    console.error(error);
  }
};

const rejectBid = async (estimate_id, receiver_id, index) => {
  try {
    let res = await fetch(`${process.env.VUE_APP_BASE_URL}/reject-bid`, {
      method: "post",
      mode: "cors",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: estimate_id }),
    });
    res = await res.json();

    if (res.success) {
      socket.emit("status-changed", {
        receiver: receiver_id,
        property: route.params.p_id,
        newStatus: 0,
      });
      estimatePriceData.value.estimates.splice(index - 1, 1);
      alert("Bid rejected successfully");
    } else {
      alert("Problem occured on rejecting bid");
    }
  } catch (error) {
    console.error(error);
  }
};
</script>
