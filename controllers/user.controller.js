const friendRequestModel = require("../model/friendRequest.model");
const userModel = require("../model/user.model");
const log = require("../utils/log.utils");
const customResponse = require("../utils/response.utils");

exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.headers;

    const data = await userModel
      .findById(userId)
      .select({ password: 0, __v: 0 });

    if (data === null) {
      return customResponse(req, res, {
        status: "error",
        message: "profile data not found",
        responseCode: 500,
        data: null,
      });
    }

    return customResponse(req, res, {
      status: "success",
      message: "profile data fetch successfully",
      responseCode: 200,
      data: data,
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

exports.sendFriendRequest = async (req, res) => {
  try {
    const { userId } = req.headers;
    const { friendId } = req.params;

    const isFriendExist = await userModel.findById(friendId);
    if (isFriendExist === null) {
      return customResponse(req, res, {
        status: "error",
        message: "friend not found",
        responseCode: 500,
        data: null,
      });
    }

    // const isFriendRequestAlreadyExist=friendRequestModel.findOne({userId:})

    const addFriend = new friendRequestModel({
      userId: userId,
      senderId: friendId,
    });
    await addFriend.save();

    return customResponse(req, res, {
      status: "success",
      message: "friend request sent successfully",
      responseCode: 200,
      data: null,
    });
  } catch (error) {
    return customResponse(req, res, {
      status: "error",
      message: err.message,
      responseCode: 500,
      data: null,
    });
  }
};

exports.handleFriendRequest = async (req, res) => {
  try {
    const { userId } = req.headers;
    const { requestId, action } = req.params;

    const isRequestEexist = await friendRequestModel.findOneAndUpdate(
      { _id: requestId, userId: userId },
      { $set: { action: action } }
    );

    if (isRequestEexist === null) {
      return customResponse(req, res, {
        status: "error",
        message: "friend request is not found",
        responseCode: 500,
        data: null,
      });
    }
    if (action == 1) {
      await userModel.updateOne(
        { _id: userId },
        { $push: { friends: isRequestEexist.senderId } }
      );
    }

    return customResponse(req, res, {
      status: "success",
      message: "friend request accept successfully",
      responseCode: 200,
      data: null,
    });

  } catch (error) {
    return customResponse(req, res, {
      status: "error",
      message: err.message,
      responseCode: 500,
      data: null,
    });
  }
};
