const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function auth(req, res, next) {
  try {
    const token = req.header("Authorization").split(" ")[1];
    const decodedData = jwt.verify(token, "this is secret key");
    const user = await User.findOne({
      _id: decodedData._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: `please authenticate ${error.message}` });
  }
}

module.exports = auth;
