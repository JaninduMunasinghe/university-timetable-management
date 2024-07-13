const express = require("express");

const router = express.Router();

const {
  createRoom,
  getRooms,
  getRoom,
  deleteRoom,
  updateRoom,
} = require("../controllers/roomController");

const { authorize } = require("../middleWare/authorize");
const { ROLES } = require("../config/roles");

router.post("/", authorize(ROLES.ADMIN), createRoom);
router.get("/", getRooms);
router.get("/:id", getRoom);
router.delete("/:id", authorize(ROLES.ADMIN), deleteRoom);
router.patch("/:id", authorize(ROLES.ADMIN), updateRoom);

module.exports = router;
