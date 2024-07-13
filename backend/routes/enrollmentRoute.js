// enrollmentRoute.js
const express = require("express");
const router = express.Router();
const {
  enrollCourse,
  unenrollCourse,
} = require("../controllers/enrollmentController");

// Endpoint for enrolling in a course
router.post("/", enrollCourse);

// Endpoint for unenrolling from a course
router.delete("/:id", unenrollCourse);

module.exports = router;
