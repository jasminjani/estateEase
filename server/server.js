const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const port = process.env.PORT || 3000;
const router = require("./routes/index.route");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
  },
});

const passport = require("passport");
const { passportConfig } = require("./middlewares/passport.middleware");
const { cloudinaryConnect } = require("./utils/cloudinary");
passportConfig(passport);

server.listen(port, (err) => {
  if (!err) {
    console.log(`server is running on http://localhost:${port}`);
  } else {
    console.error(`server connection failed`);
  }
});

io.on("connection", (socket) => {
  console.log(
    "socket connection has been established, new user connected.",
    socket.id
  );

  socket.on("sender-message", (message) => {
    io.emit(`receive-message-${message.property}-${message.receiver}`, message);
  });

  socket.on("message", (message) => {
    io.emit("server-message", "response from server");
  });

  // ===== STATUS CHANGED =====
  socket.on("status-changed", (message) => {
    io.emit(`send-status-changed-${message.receiver}`, message);
  });

  socket.on("new-bid-data", (message) => {
    io.emit(`send-new-bid-data-${message.receiver}`, message.data);
  });

  socket.on("new-property-added", (message) => {
    io.emit("send-new-property-added", message);
  });

  socket.on("manually-disconnecting", () => {
    socket.disconnect();
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: `http://localhost:8080`,
    credentials: true,
  })
);
app.use(router);

cloudinaryConnect();
