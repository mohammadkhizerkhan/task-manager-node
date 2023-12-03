const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth.middleware");

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateJWT();

    res.status(201).send({ message: "user added", user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateJWT();

    res.send({
      message: "Login Successfull",
      result: { user, token },
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.status(200).send({ message: "successfully logged out" });
  } catch (error) {
    res.status(500).send("something went wrong");
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/users/self", auth, async (req, res) => {
  res.send({ status: 200, message: "fetched successfully", result: req.user });
});

router.delete("/users/self", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send({
      status: 200,
      message: "Deleted successfully",
      result: req.user,
    });
  } catch (error) {
    res.status(404).send(error);
  }
});

router.patch("/users/self", auth, async (req, res) => {
  const body = req.body;

  const updateValidFields = ["name", "age", "password", "email"];
  const updateFields = Object.keys(body);
  const isValidFieldToUpdate = updateFields.every((field) =>
    updateValidFields.includes(field)
  );

  if (!isValidFieldToUpdate) {
    res.status(400).send({ error: "please update valid fields" });
  }

  try {
    const user = req.user;
    updateFields.forEach((field) => (user[field] = body[field]));
    
    await user.save();
    res.send({ status: 200, message: "updated successfully", result: user });
  } catch (error) {
    res.status(404).send(error);
  }
});

module.exports = router;
