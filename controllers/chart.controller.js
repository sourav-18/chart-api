const conversationModel = require("../model/conversation.model");
const userModel = require("../model/user.model");
const {
  getCurrentDateWithTimeString,
} = require("../module/dateFormater.module");
const { io } = require("../socket/socket.socket");
const log = require("../utils/log.utils");
const customResponse = require("../utils/response.utils");

exports.singleMessage = async (req, res) => {
  try {
    const { userId } = req.headers;
    const { receiverId, message } = req.body;

    if (userId == receiverId) {
      return customResponse(req, res, {
        status: "error",
        message: "you can't send message to own",
        responseCode: 500,
        data: null,
      });
    }

    const messageData = {
      senderId: userId,
      receiverId: receiverId,
      time: getCurrentDateWithTimeString(),
      message: message,
    };

    const isReceiverExist = await userModel.findById(receiverId);
    if (isReceiverExist === null) {
      return customResponse(req, res, {
        status: "error",
        message: "receiver not found",
        responseCode: 500,
        data: null,
      });
    }

    let conversationId = "";
    const isConversationExist = await conversationModel.findOneAndUpdate(
      { users: { $all: [userId, receiverId] } },
      {
        $push: {
          messages: messageData,
        },
      }
    );

    if (isConversationExist === null) {
      const newCommunication = new conversationModel({
        users: [userId, receiverId],
        messages: [messageData],
      });
      await newCommunication.save();
      conversationId = newCommunication._id;
    } else {
      conversationId = isConversationExist._id;
    }

    io.emit(conversationId, { data: messageData });

    return customResponse(req, res, {
      status: "success",
      message: "message send successfully",
      responseCode: 200,
      data: null,
    });
  } catch (err) {
    // log(err);
    return customResponse(req, res, {
      status: "error",
      message: err.message,
      responseCode: 500,
      data: null,
    });
  }
};

exports.getSocketConVersationIds = async(req, res) => {
  try {
    const {userId}=req.headers;
    const ids=await conversationModel.find({users:{$in:userId}}).select({_id:1});
    if(ids.length===0){
      return customResponse(req, res, {
        status: "error",
        message: "no conversation exist",
        responseCode: 500,
        data: null,
      });
    }

    let idsArray=ids.map((item)=>item._id)
    return customResponse(req, res, {
      status: "success",
      message: "conversation ids fetch successfully",
      responseCode: 200,
      data: idsArray,
    });

  } catch (err) {
    return customResponse(req, res, {
      status: "error",
      message: err.message,
      responseCode: 500,
      data: null,
    });
  }
};
