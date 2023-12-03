const express = require("express");
const userRouter = require("./routers/user.router");
const taskRouter = require("./routers/task.router");
const Task = require("./models/task");
const User = require("./models/user");
require("./db/mongoose");
// require("./playground/promise-chaining");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("server is running at port=>", port);
});

const main = async () => {
  // we can get task with all the detail of userData instead of just ID
  const task = await Task.findById("656b7d855a2c46f08ce3bdcc");
  await task.populate("owner").execPopulate();
  console.log("==========>task", task);

  //we can get tasks associated with user
  // NOTE: these tasks associated data is not store in DB
  // we are getting because of virtual method used in user.model.js
  // const user = await User.findById("6569c636f7fae85aba64640f");
  // await user.populate("tasks").execPopulate();
  // console.log("==========>", user.tasks);
};

// main();
