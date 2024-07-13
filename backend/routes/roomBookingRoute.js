// facultyBookingRoutes.js
const express = require("express");
const router = express.Router();
const { authorize } = require("../middleWare/authorize");
const { ROLES } = require("../config/roles");
const {
  getAvailableRooms,
  bookRoom,
} = require("../controllers/roomBookingController");

router.get("/", getAvailableRooms);
router.post("/", authorize(ROLES.ADMIN), bookRoom);

module.exports = router;
