const {
  addCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/Category");
const { authenticationMiddleWare } = require("../middleware/authMiddleWare");

const router = require("express").Router();

router.route("/").post(authenticationMiddleWare, addCategory).get(getCategory);
router
  .route("/:id")
  .patch(authenticationMiddleWare, updateCategory)
  .delete(authenticationMiddleWare, deleteCategory);

module.exports = router;
