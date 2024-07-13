// enrollmentController.js
const asyncHandler = require("express-async-handler");
const Enrollment = require("../models/enrollmentModel");
const Course = require("../models/courseModel");
const Student = require("../models/userModel");

// Endpoint to enroll a student in a course
const enrollCourse = asyncHandler(async (req, res) => {
  const { studentId, courseId, enrollmentKey, email } = req.body;

  //vadiation
  if (!studentId || !courseId || !enrollmentKey || !email) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  // Validate enrollment key
  if (enrollmentKey !== process.env.ENROLLMENT_KEY) {
    res.status(400).json({ message: "Invalid enrollment key" });
    return;
  }

  // Check if the courseId corresponds to an existing course
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  // Check if the studentId corresponds to an existing student
  const student = await Student.findById(studentId);
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  // Check if the student is already enrolled in the course
  const existingEnrollment = await Enrollment.findOne({ studentId, courseId });
  if (existingEnrollment) {
    return res
      .status(400)
      .json({ message: "Student is already enrolled in this course" });
  }

  // Create a new enrollment record
  const enrollment = await Enrollment.create({
    studentId,
    courseId,
    enrollmentKey,
    email,
  });
  res.status(201).json(enrollment);
});

// Endpoint to unenroll a student from a course
const unenrollCourse = asyncHandler(async (req, res) => {
  const { studentId, courseId } = req.body;

  // Validation
  if (!studentId || !courseId) {
    res.status(400);
    throw new Error("Please provide studentId and courseId");
  }

  // Find the enrollment record to delete
  const enrollment = await Enrollment.findOneAndDelete({ studentId, courseId });

  if (!enrollment) {
    res.status(404);
    throw new Error("Enrollment record not found");
  }

  res
    .status(200)
    .json({ message: "Student unenrolled from the course successfully" });
});

module.exports = { enrollCourse, unenrollCourse };
