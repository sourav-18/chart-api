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
      receiverId: friendId,
      senderId: userId,
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
      { _id: requestId, receiverId: userId, action: 2 },
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
      await userModel.updateOne(
        { _id: isRequestEexist.senderId },
        { $push: { friends: userId } }
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

exports.getFriendList = async (req, res) => {
  try {
    const { userId } = req.headers;

    const data = await userModel
      .findById(userId)
      .populate({
        path: "friends",
        select: { _id: 1, name: 1, mobileNo: 1, profilePic: 1 },
      })
      .select({ friends: 1 });

    if (!data || data.friends.length === 0) {
      return customResponse(req, res, {
        status: "error",
        message: "no friend list found",
        responseCode: 500,
        data: null,
      });
    }

    return customResponse(req, res, {
      status: "success",
      message: "friend list fetch successfully",
      responseCode: 200,
      data: data.friends,
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

exports.getFriendRequestList = async (req, res) => {
  try {
    const { userId } = req.headers;

    let data = await friendRequestModel
      .find({ receiverId: userId, action: 2 })
      .populate({
        path: "senderId",
        select: { _id: 1, name: 1, mobileNo: 1, profilePic: 1 },
      })
      .select({ senderId: 1 });

    data = data.map((item) => {
      return item.senderId;
    });

    return customResponse(req, res, {
      status: "success",
      message: "friend request list fetch successfully",
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
