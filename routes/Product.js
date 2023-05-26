const {
  getProducts,
  addProducts,
  editProduct,
  deleteProduct,
  getSingleProduct,
  addReview,
  getReview,
  deleteReveiw,
  searchProduct,
  searchProducts,
  filterProductCategory,
} = require("../controller/Products");
const { authenticationMiddleWare } = require("../middleware/authMiddleWare");

const router = require("express").Router();

router.route("/").get(getProducts);
router.route("/").post(authenticationMiddleWare, addProducts);
router
  .route("/:id")
  .patch(authenticationMiddleWare, editProduct)
  .delete(authenticationMiddleWare, deleteProduct)
  .get(getSingleProduct);

router
  .route("/review/:id")
  .post(authenticationMiddleWare, addReview)
  .get(getReview)
  .delete(authenticationMiddleWare, deleteReveiw);

router.get("/category/:name", filterProductCategory);
module.exports = router;
