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
            <tbody v-if="estimatePriceData?.estimates?.length">
              <tr
                v-for="(item, index) in estimatePriceData.estimates"
                :key="item.id"
              >
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
import { computed, onBeforeMount, ref, defineEmits } from "vue";
import { useRoute, useRouter } from "vue-router";
import socket from "../../socket";
import { useStore } from "vuex";
import { fetchGetAPI, fetchPostAPI } from "@/services/fetch.api";

const emit = defineEmits(["snackbar-emit"]);

const route = useRoute();
const router = useRouter();
const store = useStore();

const estimatePriceData = ref([]);

const userId = computed(() => store.getters.getUserId);

onBeforeMount(async () => {
  try {
    const res = await fetchGetAPI(
      `/property/get-estimate-price/${route.params.p_id}`
    );
    if (res?.success) {
      estimatePriceData.value = res.message;
    } else {
      console.error(res);
      emit("snackbar-emit", {
        display: true,
        innerText: `Can not able to load page`,
        bgColor: "error",
        icon: "close-circle",
      });
    }

    console.log(estimatePriceData.value);
  } catch (error) {
    console.error(error);
    emit("snackbar-emit", {
      display: true,
      innerText: `Can not able to load data`,
      bgColor: "error",
      icon: "close-circle",
    });
  }
});

// ===== real time display contracter bid =====
socket.on(`send-new-bid-data-${userId.value}`, (message) => {
  estimatePriceData.value.estimates.push(message);
});

// ===== real time display status change =====
socket.on(`send-status-changed-${userId.value}`, (message) => {
  estimatePriceData.value.status = message.newStatus;
});

const approveBid = async (estimate_id, receiver_id) => {
  try {
    const res = await fetchPostAPI(`/property/approve-bid`, {
      id: estimate_id,
      p_id: route.params.p_id,
    });

    if (res?.success) {
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
      emit("snackbar-emit", {
        display: true,
        innerText: `Bid approved successfully for ${estimatePriceData.value.name}`,
        bgColor: "success",
        icon: "check-circle",
      });
    } else {
      emit("snackbar-emit", {
        display: true,
        innerText: `Problem occured on approving bid for ${estimatePriceData.value.name}`,
        bgColor: "error",
        icon: "close-circle",
      });
    }
  } catch (error) {
    console.error(error);
    emit("snackbar-emit", {
      display: true,
      innerText: `Problem occured on approving bid for ${estimatePriceData.value.name}`,
      bgColor: "error",
      icon: "close-circle",
    });
  }
};

const rejectBid = async (estimate_id, receiver_id, index) => {
  try {
    const res = await fetchPostAPI(`/property/reject-bid`, { id: estimate_id });

    if (res?.success) {
      socket.emit("status-changed", {
        receiver: receiver_id,
        property: route.params.p_id,
        newStatus: 0,
      });
      estimatePriceData.value.estimates.splice(index - 1, 1);
      emit("snackbar-emit", {
        display: true,
        innerText: "Bid rejected successfully",
        bgColor: "success",
        icon: "check-circle",
      });
    } else {
      emit("snackbar-emit", {
        display: true,
        innerText: "Problem occured on rejecting bid",
        bgColor: "error",
        icon: "close-circle",
      });
    }
  } catch (error) {
    console.error(error);
    emit("snackbar-emit", {
      display: true,
      innerText: `Problem occured on rejecting bid`,
      bgColor: "error",
      icon: "close-circle",
    });
  }
};
</script>
