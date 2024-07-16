<template>
  <v-app>
    <v-navigation>
      <PropertySidebar v-if="roleId == 1" />
      <ContractorSidebar v-else-if="roleId == 2" />
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

                  <v-toolbar-title
                    >{{ receiverData.fname }}
                    {{ receiverData.lname }}</v-toolbar-title
                  >

                  <v-btn icon="mdi-magnify"></v-btn>
                  <v-btn icon="mdi-phone  "></v-btn>

                  <v-btn icon="mdi-dots-vertical"></v-btn>
                </v-toolbar>
                <v-card-text style="height: 68dvh; overflow-y: scroll">
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
                  <!-- {{ userWrittenMsg }} -->
                  <div v-for="message in messages" :key="message">
                    <div :class="{ right: userId === message.sender_id }">
                      {{ message.message }}
                    </div>
                  </div>
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
import { computed, onBeforeMount, onBeforeUnmount, reactive, ref } from "vue";
// import { onMounted, ref } from "vue";
import PropertySidebar from "../../components/property/sideBar.vue";
import ContractorSidebar from "../../components/contractor/sideBar.vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
const socket = io(`${process.env.VUE_APP_BASE_URL}`);

const route = useRoute();
const store = useStore();
const receiverData = ref([]);
let previousChatMsg = reactive([]);
const messages = ref([]);
// const receviedMessages = ref([]);
const roleId = computed(() => store.getters.getRoleId);
const userId = computed(() => store.getters.getUserId);

onBeforeMount(async () => {
  let res = await fetch(
    `${process.env.VUE_APP_BASE_URL}/get-chat-msg-and-receiver-data`,
    {
      method: "post",
      mode: "cors",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        receiver_id: route.params.id,
        p_id: route.params.p_id,
      }),
    }
  );
  res = await res.json();
  console.log("res :>> ", res);
  receiverData.value = await res.message.receiverData;
  previousChatMsg = await res.message.previousChatMsg;
  console.log("receiverData.value.user_chats[0].message :>> ", previousChatMsg);

  previousChatMsg.forEach((chat) => {
    messages.value.push({ sender_id: chat.sender_id, message: chat.message });
  });
});

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

// socket.emit("message", "hi");
// socket.on("server-message", (message) => {
//   console.log("server message", message);
// });

socket.on("receiver-message", (message) => {
  console.log("received receiver message", message);
  // receviedMessages.value.push(message);
});

const userWrittenMsg = ref("");

const sendMsg = async () => {
  try {
    console.log("userWrittenMsg", userWrittenMsg.value);
    if (userWrittenMsg.value.trim() !== "") {
      let res = await fetch(`${process.env.VUE_APP_BASE_URL}/add-chat-msg`, {
        method: "post",
        mode: "cors",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiver_id: route.params.id,
          message: userWrittenMsg.value,  
          p_id: route.params.p_id,
        }),
      });
      res = await res.json();
      console.log("res :>> ", res);

      if (res.success) {
        console.log("success");
        socket.emit("sender-message", {
          sender: userId.value,
          property: route.params.p_id,
          receiver: route.params.id,
          message: userWrittenMsg.value,
        });
        // messages.value.push(userWrittenMsg.value);
        messages.value.push({
          sender_id: userId.value,
          message: userWrittenMsg.value,
        });

        userWrittenMsg.value = "";
      } else {
        console.log("failed");
      }
    }
  } catch (error) {
    console.error(error);
  }
};

socket.on(`receive-message-${route.params.p_id}-${userId.value}`, (msg) => {
  console.log("message receied at client 2");
  messages.value.push({ sender_id: msg.sender, message: msg.message });
  console.log("print after message received", msg);
  // socket.emit("leave-room", msg.receiver);
});

onBeforeUnmount(() => {
  socket.emit("manually-disconnecting");
});
</script>

<style scoped>
.right {
  /* border: 2px solid black; */
  /* background-color: #98c1d8;
  display: inline;
  padding: 7px;
  border-radius: 5px; */
  text-align: end;
}
</style>
