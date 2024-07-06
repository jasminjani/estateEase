<script setup>
import Sidebar from "../../components/property/sideBar.vue";
import { onBeforeMount, ref } from "vue";

const userAllProperty = ref([]);

onBeforeMount(async () => {
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
                  </tr>
                </thead>
                <tbody v-if="userAllProperty.length">
                  <tr v-for="(item, index) in userAllProperty" :key="item.id">
                    <td>{{ ++index }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.city }}</td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="3" class="text-center">No Data Found !!</td>
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
