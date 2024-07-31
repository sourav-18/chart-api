const log = require("../utils/log.utils");
const customResponse = require("../utils/response.utils");
const jwt = require("jsonwebtoken");

const checkToken = (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    
    if (!token) {
      return customResponse(req, res, {
        status: "error",
        message: "Token not found",
        responseCode: 500,
        data: null,
      });
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, data) => {
      if (err) {
        return customResponse(req, res, {
          status: "error",
          message: "Invalid Token",
          responseCode: 500,
          data: null,
        });
      } else {
        req.headers.userId = data.userId;
        next();
      }
    });
  } catch (err) {
    log(token)
    return customResponse(req, res, {
      status: "error",
      message: err.message,
      responseCode: 500,
      data: null,
    });
  }
};

module.exports = checkToken;
