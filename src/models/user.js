const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
      default: 0,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("please enter valid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 7,
      validate(value) {
        if (value.includes("password")) {
          throw new Error("password should not contain password keyword");
        }
      },
    },

    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// instead storing in DB, we are directly giving reference to mongoose
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.toJSON = function () {
  const user = this;
  const cloneUser = user.toObject();

  delete cloneUser.tokens;
  delete cloneUser.password;

  return cloneUser;
};

userSchema.methods.generateJWT = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "this is secret key");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("email not found");
  }
  const passwordMatch = await bcrypt.compareSync(password, user.password);

  if (!passwordMatch) {
    throw new Error("password is wrong");
  }
  return user;
};

// mongoose middleware to hash password while save(update/create) user document
userSchema.pre("save", async function (next) {
  const userDocument = this;
  try {
    if (userDocument.isModified("password")) {
      const hashedPassword = await bcrypt.hash(userDocument.password, 8);
      userDocument.password = hashedPassword;
    }
    next();
  } catch (error) {
    console.error("Error hashing password:", error);
    next(error); // Pass the error to the next middleware
  }
});

userSchema.pre("remove", async function (next) {
  const user = this;
  try {
    await Task.deleteMany({ owner: user._id });
    next();
  } catch (error) {
    console.error("Error hashing password:", error);
    next(error); // Pass the error to the next middleware
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
