<template>
  <v-content>
    <v-container fluid fill-height>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12" style="width: 100%; margin: 0 auto">
          <v-card>
            <v-toolbar color="primary">
              <v-btn icon="mdi-account-circle"></v-btn>
              <v-toolbar-title
                >{{ receiverData.fname }}
                {{ receiverData.lname }}</v-toolbar-title
              >
              <v-btn icon="mdi-magnify"></v-btn>
              <v-btn icon="mdi-phone  "></v-btn>

              <v-btn icon="mdi-dots-vertical"></v-btn>
            </v-toolbar>
            <v-card-text style="height: 67dvh; overflow-y: scroll">
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
                  @keydown.enter="sendMsg"
                >
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
</template>

<script setup>
import {
  computed,
  onBeforeMount,
  onBeforeUnmount,
  reactive,
  ref,
  defineEmits,
} from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import socket from "../../socket";

const route = useRoute();
const store = useStore();

const emit = defineEmits(["snackbar-emit"]);

const receiverData = ref([]);
let previousChatMsg = reactive([]);
const messages = ref([]);
const userWrittenMsg = ref("");

const userId = computed(() => store.getters.getUserId);

onBeforeMount(async () => {
  try {
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

    previousChatMsg.forEach((chat) => {
      messages.value.push({ sender_id: chat.sender_id, message: chat.message });
    });
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

socket.on(`receive-message-${route.params.p_id}-${userId.value}`, (msg) => {
  messages.value.push({ sender_id: msg.sender, message: msg.message });
});

onBeforeUnmount(() => {
  socket.emit("manually-disconnecting");
});

const sendMsg = async () => {
  try {
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
        socket.emit("sender-message", {
          sender: userId.value,
          property: route.params.p_id,
          receiver: route.params.id,
          message: userWrittenMsg.value,
        });
        messages.value.push({
          sender_id: userId.value,
          message: userWrittenMsg.value,
        });

        userWrittenMsg.value = "";
      } else {
        console.error("failed");
        emit("snackbar-emit", {
          display: true,
          innerText: `Can not able to send message`,
          bgColor: "error",
          icon: "close-circle",
        });
      }
    }
  } catch (error) {
    console.error(error);
    emit("snackbar-emit", {
      display: true,
      innerText: `Can not able to send message`,
      bgColor: "error",
      icon: "close-circle",
    });
  }
};
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
