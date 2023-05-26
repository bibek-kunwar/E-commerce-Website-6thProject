const {
  addOrder,
  getOrder,
  updateOrder,
  deleteOrder,
  getSingleOrder,
  getAllOrders,
} = require("../controller/Order");
const { authenticationMiddleWare } = require("../middleware/authMiddleWare");

const router = require("express").Router();
router.route("/customers").get(authenticationMiddleWare, getAllOrders);
router
  .route("/")
  .post(authenticationMiddleWare, addOrder)
  .get(authenticationMiddleWare, getOrder)
  .patch(authenticationMiddleWare, updateOrder)
  .delete(authenticationMiddleWare, deleteOrder);

router.route("/:id").get(authenticationMiddleWare, getSingleOrder);

module.exports = router;
