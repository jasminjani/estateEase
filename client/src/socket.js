import { io } from "socket.io-client";

const socket = io(`${process.env.VUE_APP_BASE_URL}`);

export default socket;

// socket.emit("message", "hi");
// socket.on("server-message", (message) => {
//   console.log("server message", message);
// });
