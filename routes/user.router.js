const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logout,
} = require("../controllers/user.controllers");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

module.exports = router;
