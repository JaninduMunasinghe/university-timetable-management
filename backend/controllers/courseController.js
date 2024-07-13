const asyncHandler = require("express-async-handler");
const Course = require("../models/courseModel");
const logger = require("../logs/logger");

const createCourse = asyncHandler(async (req, res) => {
  const { name, code, description, credits, faculty } = req.body;

  //Validation
  if (!name || !code || !description || !credits || !faculty) {
    res.status(400);
    logger.error("Please fill all the fields");
    throw new Error("Please fill all the fields");
  }

  // Check if a course with the same code already exists
  const existingCourse = await Course.findOne({ code });
  if (existingCourse) {
    res.status(400);
    logger.error("A course with the same code already exists");
    throw new Error("A course with the same code already exists");
  }

  //Create Course
  const course = await Course.create({
    name,
    code,
    description,
    credits,
    faculty,
  });

  res.status(201).json(course);
});

//Get all courses
const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find().sort("-createdAt");
  res.status(200).json(courses);
});

//Get single product
const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  res.status(200).json(course);
});

//Delete course
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);

    throw new Error("Course not found");
  }
  /*if (course.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }
  */
  await course.deleteOne();
  res.status(200).json({ message: "Course Deleted Successfully" });
});

//Update course
const updateCourse = asyncHandler(async (req, res) => {
  const { name, code, description, credits, faculty } = req.body;

  //Validation
  if (!name || !code || !description || !credits || !faculty) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  //Find course
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  //Update course
  course.name = name;
  course.code = code;
  course.description = description;
  course.credits = credits;
  course.faculty = faculty;

  await course.save();
  res.status(200).json(course);
});

module.exports = {
  createCourse,
  getCourses,
  getCourse,
  deleteCourse,
  updateCourse,
};
