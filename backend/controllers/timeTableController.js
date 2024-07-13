const asyncHandler = require("express-async-handler");
const TimeTable = require("../models/timeTableModel");
const User = require("../models/userModel");
const Enrollment = require("../models/enrollmentModel");
const nodeMailer = require("nodemailer");

const createTimeTable = asyncHandler(async (req, res) => {
  const { courseId, dayOfWeek, startTime, endTime, facultyId, locationId } =
    req.body;

  //Validation
  if (
    !courseId ||
    !dayOfWeek ||
    !startTime ||
    !endTime ||
    !facultyId ||
    !locationId
  ) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  // Check if the provided facultyId corresponds to a faculty member
  const facultyUser = await User.findById(facultyId);
  if (!facultyUser || facultyUser.role !== "faculty") {
    res.status(400);
    throw new Error(
      "Invalid faculty ID. Please provide a valid faculty member ID"
    );
  }

  // Check for overlapping timetables
  const existingTimetables = await TimeTable.find({
    dayOfWeek,
    locationId,
    facultyId,
    $or: [
      { startTime: { $lt: endTime }, endTime: { $gt: startTime } }, // Check for overlap
      { startTime: { $gte: startTime, $lt: endTime } }, // Check if existing timetable starts during new timetable
      { endTime: { $gt: startTime, $lte: endTime } }, // Check if existing timetable ends during new timetable
    ],
  });

  if (existingTimetables.length > 0) {
    res.status(400);
    throw new Error(
      "A timetable already exists for this time slot and location"
    );
  }

  //Create Time Table
  const timeTable = await TimeTable.create({
    courseId,
    dayOfWeek,
    startTime,
    endTime,
    facultyId,
    locationId,
  });

  res.status(201).json(timeTable);
});

//Get all timeTables
const getTimeTables = asyncHandler(async (req, res) => {
  try {
    const timeTables = await TimeTable.find({}).populate(
      "courseId  locationId"
    );
    res.status(200).json(timeTables);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" }); // Handle errors
  }
});

//Get single timeTable
const getTimeTable = asyncHandler(async (req, res) => {
  const timeTable = await TimeTable.findById(req.params.id);

  if (!timeTable) {
    res.status(404);
    throw new Error("TimeTable not found");
  }

  res.status(200).json(timeTable);
});

//Delete timeTable
const deleteTimeTable = asyncHandler(async (req, res) => {
  const timeTable = await TimeTable.findById(req.params.id);

  /*   if (!timeTable) {
    res.status(404);
    throw new Error("TimeTable not found");
  } */

  if (!timeTable) {
    res.status(404).json({ message: "TimeTable not found " }); // Set status and send response
    return; // Exit the function early
  }

  await timeTable.deleteOne();
  res.status(200).json({ message: "TimeTable Deleted Successfully" });
});

//Update timeTable controller
const updateTimeTable = asyncHandler(async (req, res) => {
  const { courseId, dayOfWeek, startTime, endTime, facultyId, locationId } =
    req.body;

  //Validation
  if (
    !courseId ||
    !dayOfWeek ||
    !startTime ||
    !endTime ||
    !facultyId ||
    !locationId
  ) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const timeTable = await TimeTable.findById(req.params.id);

  if (!timeTable) {
    res.status(404);
    throw new Error("TimeTable not found");
  }

  // Check for overlapping timetables
  const existingTimetables = await TimeTable.find({
    dayOfWeek,
    locationId,
    facultyId,
    $or: [
      { startTime: { $lt: endTime }, endTime: { $gt: startTime } }, // Check for overlap
      { startTime: { $gte: startTime, $lt: endTime } }, // Check if existing timetable starts during new timetable
      { endTime: { $gt: startTime, $lte: endTime } }, // Check if existing timetable ends during new timetable
    ],
  });

  if (existingTimetables.length > 0) {
    res.status(400);
    throw new Error(
      "A timetable already exists for this time slot and location"
    );
  }

  timeTable.courseId = courseId;
  timeTable.dayOfWeek = dayOfWeek;
  timeTable.startTime = startTime;
  timeTable.endTime = endTime;
  timeTable.facultyId = facultyId;
  timeTable.locationId = locationId;

  await timeTable.save();

  // Get list of students enrolled in the course
  const enrolledStudents = await Enrollment.find({
    courseId: courseId,
  }).populate("studentId");

  // Send email notifications to enrolled students
  const transporter = nodeMailer.createTransport({
    service: "Gmail",
    auth: {
      user: "janinduravishka1999@gmail.com",
      pass: "fhkw dmvw powe keeu",
    },
  });

  enrolledStudents.forEach(async (enrollment) => {
    const studentEmail = enrollment.studentId.email;

    // Email content
    const mailOptions = {
      from: "janinduravishka1999@example.com",
      to: studentEmail,
      subject: "Timetable Update Notification",
      html: `<p>Dear ${studentEmail},</p><p>The timetable for your enrolled course has been updated. Please check the updated schedule.</p>`,
    };

    // Send email
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  });

  res.status(200).json(timeTable);
});

module.exports = {
  createTimeTable,
  getTimeTables,
  getTimeTable,
  deleteTimeTable,
  updateTimeTable,
};
