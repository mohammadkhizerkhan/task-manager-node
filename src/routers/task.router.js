const express = require("express");
const auth = require("../middleware/auth.middleware");
const router = new express.Router();
const Task = require("../models/task");

router.get("/tasks", auth, async (req, res) => {
  try {
    // const tasks = await Task.find({ owner: req.user._id });
    // res.send({ status: 200, message: "fetched successfully", result: tasks });

    await req.user.populate("tasks").execPopulate();
    res.send({
      status: 200,
      message: "fetched successfully",
      result: req.user.tasks,
    });
  } catch (error) {
    res.status(404).send(error);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    res.send({ status: 200, message: "fetched successfully", result: task });
  } catch (error) {
    res.status(404).send(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id });
    res.send({ status: 200, message: "Deleted successfully", result: task });
  } catch (error) {
    res.status(404).send(error);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  const updateValidFields = ["description", "completed"];
  const updateFields = Object.keys(req.body);
  const isValidFieldToUpdate = updateFields.every((field) =>
    updateValidFields.includes(field)
  );

  if (!isValidFieldToUpdate) {
    res.status(400).send({ error: "please update valid fields" });
  }

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }

    updateValidFields.forEach((field) => (task[field] = req.body[field]));
    await task.save();
    res.send({ status: 200, message: "updated successfully", result: task });
  } catch (error) {
    res.status(404).send(error);
  }
});

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    const response = await task.save();
    console.log("==========>", response);
    res.send({ status: 201, message: "task created", result: response });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
