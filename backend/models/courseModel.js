const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a course name"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Please add a course code"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      trim: true,
    },
    credits: {
      type: String,
      required: [true, "Please add a credits"],
      trim: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please add a faculty"],
      ref: "User",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
