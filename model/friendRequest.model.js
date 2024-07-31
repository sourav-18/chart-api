const mongoose = require("mongoose");
const conn = require("./mongodb");

const friendRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    action: {
      type: Number,
      default: 2, //1 accept 2 pending 3 reject
    },
    sendTime: {
      type: Date,
      default: () => new Date().getTime() + 5.5 * 60 * 60 * 1000,
    },
  },
  {
    timestamps: {
      currentTime: () => new Date().getTime() + 5.5 * 60 * 60 * 1000,
    },
  }
);

const friendRequestModel = conn.model("friend-request", friendRequestSchema);
module.exports = friendRequestModel;
