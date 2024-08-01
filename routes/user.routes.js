const userController = require("../controllers/user.controller");

const router=require("express").Router();

router.get("/get-profile-details",userController.getProfile);
router.get("/send-friend-request/:friendId",userController.sendFriendRequest);
router.get("/handle-friend-request/:requestId/:action",userController.handleFriendRequest);
router.get("/get-friend-list",userController.getFriendList);
router.get("/get-friend-request-list",userController.getFriendRequestList);

module.exports=router;