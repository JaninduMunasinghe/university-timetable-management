const express = require("express");

const router = express.Router();
const { authenticate } = require("../middleWare/authenticate");
const {
  createTimeTable,
  getTimeTables,
  getTimeTable,
  deleteTimeTable,
  updateTimeTable,
} = require("../controllers/timeTableController");

const { authorize } = require("../middleWare/authorize");
const { ROLES } = require("../config/roles");

router.post("/", authorize([ROLES.ADMIN, ROLES.FACULTY]), createTimeTable);
router.get("/", getTimeTables);
router.get("/:id", getTimeTable);
router.delete(
  "/:id",
  authorize([ROLES.ADMIN, ROLES.FACULTY]),

  deleteTimeTable
);
router.patch("/:id", authorize([ROLES.ADMIN, ROLES.FACULTY]), updateTimeTable);

module.exports = router;
