const express = require("express");
const {
  register,
  login,
  AllUser,
  singleUser,
  logout,
  getMe,
  UpdateUser,
  DeleteUser,
  verify,
  forgetpassword,
  resetPassword,
} = require("../controller/UserController");
const {isAuthenticated} =require("../middleware/Auth")

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/verify").post(isAuthenticated,verify);
router.route("/me").get(isAuthenticated,getMe);
router.route("/logout").get( logout);
router.route("/allUsers").get(AllUser);
router.route("/:id").get(singleUser).put(UpdateUser).delete(DeleteUser);
router.route("/forgetpassword").post(forgetpassword);
router.route("/resetpassword/reset").put(resetPassword);
module.exports = router;
