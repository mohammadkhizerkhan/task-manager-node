const User = require("../models/user");

User.findByIdAndDelete("6543b0d95ee052cdfe00444e")
  .then((res) => {
    console.log("------> deleted");
    return User.countDocuments({ age: 44 });
  })
  .then((res) => {
    console.log("---------->counted", res);
  })
  .catch((error) => {
    console.log("--------_>error", error);
  });
