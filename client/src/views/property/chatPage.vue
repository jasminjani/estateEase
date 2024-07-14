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
              <!-- <v-toolbar dark color="primary">
                <v-toolbar-title class="text-center"
                  >Chat Application Page
                </v-toolbar-title>
              </v-toolbar> -->
              <v-card>
                <v-toolbar color="primary">
                  <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
                  <v-btn icon="mdi-account-circle"></v-btn>

                  <v-toolbar-title>Jash Jani</v-toolbar-title>

                  <v-btn icon="mdi-magnify"></v-btn>
                  <v-btn icon="mdi-phone  "></v-btn>

                  <v-btn icon="mdi-dots-vertical"></v-btn>
                </v-toolbar>
                <v-card-text style="height: 68dvh">
                  <!-- <div id="app">
                    <h1>Private Chat Application</h1>
                    <input
                      v-model="room"
                      @keyup.enter="joinRoom"
                      placeholder="Enter room name"
                    />
                    <div v-for="message in messages" :key="message">
                      {{ message }}
                    </div>
                    <input
                      v-model="newMessage"
                      @keyup.enter="sendMessage"
                      placeholder="Type a message"
                    />
                  </div> -->
                  {{ userWrittenMsg }}
                </v-card-text>
                <v-card-text>
                  <v-form class="d-flex">
                    <v-text-field
                      v-model="userWrittenMsg"
                      prepend-inner-icon="mdi-emoticon-outline"
                      append-inner-icon="mdi-camera-outline"
                      placeholder="Enter text here"
                      name="msg"
                      clearable
                    >
                      <!-- <v-btn icon="mdi-emoticon-outline"></v-btn> -->
                      <!-- <v-btn icon="mdi-camera-outline"></v-btn> -->
                    </v-text-field>
                    <v-btn
                      @click="sendMsg"
                      class="mt-1 ml-2"
                      color="primary"
                      icon="mdi-send"
                    ></v-btn>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-card>
          </v-flex>
        </v-container>
      </v-content>
    </v-main>
  </v-app>
</template>

<!-- <script src="/socket.io/socket.io.js"></script> -->

<script setup>
import { io } from "socket.io-client";
import { ref } from "vue";
// import { onMounted, ref } from "vue";
import Sidebar from "../../components/property/sideBar.vue";

const socket = io(`${process.env.VUE_APP_BASE_URL}`);
// const room = ref("");
// const messages = ref([]);
// const newMessage = ref('');

// const joinRoom = () => {
//   socket.emit("joinRoom", room.value);
// };

// const sendMessage = () => {
//   if (newMessage.value.trim() !== "") {
//     socket.emit("sendMessage", { room: room.value, message: newMessage.value });
//     newMessage.value = "";
//   }
// };

// onMounted(() => {
//   socket.on("receiveMessage", (message) => {
//     messages.value.push(message);
//   });
// });

socket.emit("message", "hi");
socket.on("server-message", (message) => {
  console.log("server message", message);
});

const userWrittenMsg = ref("");

const sendMsg = () => {
  try {
    console.log("userWrittenMsg", userWrittenMsg.value);
  } catch (error) {
    console.error(error);
  }
};
</script>
