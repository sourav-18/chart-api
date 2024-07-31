const mongoose = require("mongoose");
const constData = require("../utils/constData.utils");
const conn = require("./mongodb");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    profilePic: {
      type: String,
      default: constData.profilePic,
    },
    friends: [{ type: mongoose.Types.ObjectId, ref: "users" }],
  },
  {
    timestamps: {
      currentTime: () => new Date().getTime() + 5.5 * 60 * 60 * 1000,
    },
  }
);

const userModel = conn.model("users", userSchema);
module.exports = userModel;
