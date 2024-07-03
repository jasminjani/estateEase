const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser =  require('body-parser');
const path = require('path');
const port = process.env.port || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, "public")));

app.listen(port, (err) => {
  if (!err) {
    console.log(`server is running on http://localhost:${port}`);
  } else {
    console.log(`server connection failed`);
  }
})