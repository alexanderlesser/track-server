require("./models/User");
require("./models/Track");
const express = require("express");
const keys = require("./config/keys");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const trackRoutes = require("./routes/trackRoutes");
const requireAuth = require("./middlewares/requireAuth");

const app = express();

app.use(bodyParser.json()); // json info parsed
app.use(authRoutes);
app.use(trackRoutes);

mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

// mongoose connection success
mongoose.connection.on("connected", () => {
  console.log("connected to mongo instance");
});

// mongoose connection error
mongoose.connection.on("error", (err) => {
  console.error("Error connecting to mongo", err);
});

app.get("/", requireAuth, (req, res) => {
  res.send(`Your user email is ${req.user.email}`);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("LISTENING ON PORT 3000");
});
