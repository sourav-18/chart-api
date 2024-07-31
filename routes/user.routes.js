const userController = require("../controllers/user.controller");

const router=require("express").Router();

router.get("/get-profile-details",userController.getProfile);
router.get("/send-friend-request/:friendId",userController.sendFriendRequest);
router.get("/handle-friend-request/:requestId/:action",userController.handleFriendRequest);

module.exports=router;