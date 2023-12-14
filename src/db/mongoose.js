const mongoose = require("mongoose");
const validator = require("validator");

mongoose.connect(process.env.MONOGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
});
