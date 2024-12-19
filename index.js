const express = require("express");
const port = 3000;
const port1 = 3001;
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

require("./db");
require("./models/User");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log("Server is running on post " + port);
});
