const mongoose = require("mongoose");
const conn = require("./mongodb");

const conversationSchema = new mongoose.Schema(
  {
    users:[{ type: mongoose.Types.ObjectId, ref: "users" }],
    messages: [
      {
        senderId: { type: mongoose.Types.ObjectId, ref: "users",required:true },
        receiverId: { type: mongoose.Types.ObjectId, ref: "users",required:true },
        time: { type: Date,required:true },
        message: { type: String,required:true},
      },
    ],
  },
  {
    timestamps: {
      currentTime: () => new Date().getTime() + 5.5 * 60 * 60 * 1000,
    }
  }
);

const conversationModel = conn.model("conversations", conversationSchema);
module.exports = conversationModel;
