const customResponse = (req, res,payload) => {
  return res.json({
    status: payload.status,
    message: payload.message,
    responseCode: payload.responseCode,
    data: payload.data
  });
};
module.exports=customResponse;