const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: [true, "Please provide a course ID"],
  },
  dayOfWeek: {
    type: String,
    required: [true, "Please provide a day of the week"],
  },
  startTime: {
    type: String,
    required: [true, "Please provide a start time"],
  },
  endTime: {
    type: String,
    required: [true, "Please provide an end time"],
  },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide a faculty ID"],
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: [true, "Please provide a location ID"],
  },
});

const Timetable = mongoose.model("Timetable", timetableSchema);

module.exports = Timetable;
