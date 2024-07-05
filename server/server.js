const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const port = process.env.port || 3000;
const router = require("./routes/route");

const passport = require("passport");
const { passportConfig } = require("./middlewares/authMiddleware");
passportConfig(passport);

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

app.listen(port, (err) => {
  if (!err) {
    console.log(`server is running on http://localhost:${port}`);
  } else {
    console.log(`server connection failed`);
  }
});