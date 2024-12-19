const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");

router.post("/verify", (req, res) => {
  console.log("sent by client", req.body);
  const { email } = req.body;

  if (!email) {
    return res.status(422).json({ error: "Please add all fields" });
  }
  User.findOne({ email: email }).then(async (savedUser) => {
    if (savedUser) {
      return res.status(422).json({ error: "Invalid Credentials" });
    }
    try {
      let verificationCode = Math.floor(100000 + Math.random() * 900000);
      await mailer(email, verificationCode);
      console.log("Verification Code", verificationCode);
      res.send({
        message: "Verification code sent to your Email",
        verificationCode,
        email,
      });
    } catch (err) {
      console.log(err);
    }
  });
});

router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(422).json({ error: "Please add all the fields" });
  } else {
    const user = new User({
      username,
      email,
      password,
    });

    try {
      await user.save();
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      return res
        .status(200)
        .json({ message: "User Registered Successfully", token });
    } catch (err) {
      console.log(err);
      return res.status(422).json({ error: "User Not Registered" });
    }
  }
});
