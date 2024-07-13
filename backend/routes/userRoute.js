const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const {
  registerUser,
  loginUser,
  logout,
  getUser,
  getUsers,
  loginStatus,
  updateUser,
  changepassword,
} = require("../controllers/userController");
//const protect = require("../middleWare/authMiddleware");
const { authorize } = require("../middleWare/authorize");
const { ROLES } = require("../config/roles");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/getuser", authorize(ROLES.ADMIN), getUser);
router.get("/getusers", authorize(ROLES.ADMIN), getUsers);
router.get("/loggedin", loginStatus);
router.patch("/updateuser", authorize(ROLES.ADMIN), updateUser);
router.patch("/changepassword", changepassword);

module.exports = router;
