const chartController = require("../controllers/chart.controller");
const checkToken = require("../middleware/checkToken.middleware");

const router = require("express").Router();

router.post("/one-to-one-chart",chartController.singleMessage);
router.get("/get-conversation-ids",chartController.getSocketConVersationIds);

module.exports = router;
