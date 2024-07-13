const express = require("express");

const router = express.Router();
const protect = require("../middleWare/authMiddleware");
const {
  createCourse,
  getCourses,
  getCourse,
  deleteCourse,
  updateCourse,
} = require("../controllers/courseController");
const { authenticate } = require("../middleWare/authenticate");
const { authorize } = require("../middleWare/authorize");
const validateFacultyAssignment = require("../middleWare/validateFacultyAssignment");
const { ROLES } = require("../config/roles");

/* router.post("/", protect, createCourse);
router.get("/", protect, getCourses);
router.get("/:id", protect, getCourse);
router.delete("/:id", protect, deleteCourse);
router.patch("/:id", protect, updateCourse); */

router.post(
  "/",
  authorize(ROLES.ADMIN),
  validateFacultyAssignment,
  createCourse
);
router.get("/", getCourses);
router.get("/:id", getCourse);
router.delete("/:id", authorize(ROLES.ADMIN), deleteCourse);
router.patch(
  "/:id",
  authorize(ROLES.ADMIN),
  validateFacultyAssignment,
  updateCourse
);

module.exports = router;
