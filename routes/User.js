const {
  register,
  login,
  forgotPassword,
  resetPassword,
  userResetPassword,
  deleteUser,
  editUser,
} = require("../controller/User");
const { authenticationMiddleWare } = require("../middleware/authMiddleWare");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:id/:token", resetPassword);
router.post("/reset-password/:id/:token", userResetPassword);
router.delete("/:id", authenticationMiddleWare, deleteUser);
router.patch("/:id", authenticationMiddleWare, editUser);
module.exports = router;
