const { addPayment } = require("../controller/Payment");

const router = require("express").Router();

router.post("/", addPayment);

module.exports = router;
