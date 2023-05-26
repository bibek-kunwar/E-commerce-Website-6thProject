const {
  getCart,
  postCart,
  deleteCart,
  updateCart,
  findProductInCart,
  inCartPost,
} = require("../controller/Cart");
const { authenticationMiddleWare } = require("../middleware/authMiddleWare");

const router = require("express").Router();

router
  .route("/")
  .get(authenticationMiddleWare, getCart)
  .post(authenticationMiddleWare, postCart)
  .delete(authenticationMiddleWare, deleteCart)
  .patch(authenticationMiddleWare, updateCart);

router
  .get("/:id", authenticationMiddleWare, findProductInCart)
  .patch("/:id", authenticationMiddleWare, inCartPost);

module.exports = router;
