const userModel = require("../model/user.model");
const generateToken = require("../module/token.module");
const log = require("../utils/log.utils");
const customResponse = require("../utils/response.utils");

exports.signup = async (req, res) => {
  try {
    const { name, mobileNo, password, bio } = req.body;

    const isUserExist = await userModel.findOne({ mobileNo: mobileNo });
    if (isUserExist) {
      return customResponse(req, res, {
        status: "error",
        message: "user already exist",
        responseCode: 500,
        data: null,
      });
    }

    const newUser = new userModel({
      name: name,
      mobileNo: mobileNo,
      password: password,
      bio: bio,
    });
    await newUser.save();

    return customResponse(req, res, {
      status: "success",
      message: "user signup successfully",
      responseCode: 200,
      data: null,
    });
  } catch (err) {
    log(err);
    return customResponse(req, res, {
      status: "error",
      message: err.message,
      responseCode: 500,
      data: null,
    });
  }
};

exports.signIn = async (req, res) => {
  try {
    // log("enter")
    const { mobileNo, password } = req.body;

    const isUserExist = await userModel.findOne({
      mobileNo: mobileNo,
      password: password,
    });
    
    if (isUserExist === null) {
      return customResponse(req, res, {
        status: "error",
        message: "user not found",
        responseCode: 500,
        data: null,
      });
    }

    const token = generateToken({ userId: isUserExist._id });
    if(!token){
      return customResponse(req, res, {
        status: "error",
        message: "something wrong..",
        responseCode: 500,
        data: null,
      });
    }
    res.setHeader("Authorization", token);
    return customResponse(req, res, {
      status: "success",
      message: "login successfully",
      responseCode: 200,
      data: null,
    });
  } catch (error) {
    log(err);
    return customResponse(req, res, {
      status: "error",
      message: err.message,
      responseCode: 500,
      data: null,
    });
  }
};
