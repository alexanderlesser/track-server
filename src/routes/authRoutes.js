const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const User = mongoose.model("User");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = new User({ email, password });
    await user.save();
    const token = jwt.sign({ userId: user._id }, keys.jwtSecretKey);
    res.send({ token });
  } catch (err) {
    return res.status(422).send(err.message);
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  // if no email or password have been entered
  if (!email || !password) {
    return res.status(422).send({ error: "Must provide email and password." });
  }

  // find user with email
  const user = await User.findOne({ email });

  // if no user exist with that email exist
  if (!user) {
    return res.status(422).send({ error: "Invalid password or email" });
  }

  // compare password
  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, keys.jwtSecretKey);
    res.send({ token: token });
  } catch (err) {
    return res.status(422).send({ error: "Invalid password or email" });
  }
});

module.exports = router;
