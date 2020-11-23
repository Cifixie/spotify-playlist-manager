const express = require("express");
const path = require("path");
const cors = require("cors");
const configs = require("./configs");
const basicRoutes = require("./routes/basic");
const apiRoutes = require("./routes/api");
const auth = require("./middleware/auth");
const session = require("./middleware/session");

const app = express();

session(app, configs);
auth(app, configs);

app.use(cors());

app.use("/", basicRoutes);
app.use("/api", apiRoutes);

app.listen(configs.port, () => {
  console.log(`Running...`);
});
