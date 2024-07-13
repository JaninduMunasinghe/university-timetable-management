const { enrollCourse } = require("../controllers/enrollmentController");
const Enrollment = require("../models/enrollmentModel");
const Course = require("../models/courseModel");
const Student = require("../models/userModel");

jest.mock("../models/enrollmentModel");
jest.mock("../models/courseModel");
jest.mock("../models/userModel");

describe("enrollCourse", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        studentId: "studentId",
        courseId: "courseId",
        enrollmentKey: "ENROL123",
        email: "test@example.com",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should enroll a student in a course successfully", async () => {
    // Mocking Course.findById to return a valid course
    Course.findById.mockResolvedValueOnce({ _id: "courseId" });

    // Mocking Student.findById to return a valid student
    Student.findById.mockResolvedValueOnce({ _id: "studentId" });

    // Mocking Enrollment.findOne to return null (student not already enrolled)
    Enrollment.findOne.mockResolvedValueOnce(null);

    // Mocking Enrollment.create to return the created enrollment
    const mockEnrollment = { _id: "enrollmentId", ...req.body };
    Enrollment.create.mockResolvedValueOnce(mockEnrollment);

    await enrollCourse(req, res);

    expect(res.status(201));
    expect(res.json(mockEnrollment));
  });

  it("should return 400 if the enrollment key is invalid", async () => {
    // Mocking Course.findById to return a valid course
    Course.findById.mockResolvedValueOnce({ _id: "courseId" });

    // Mocking Student.findById to return a valid student
    Student.findById.mockResolvedValueOnce({ _id: "studentId" });

    // Invalid enrollment key
    req.body.enrollmentKey = "invalid_enrollment_key";

    await enrollCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid enrollment key",
    });
  });

  it("should return 404 if the course is not found", async () => {
    // Mocking Course.findById to return null (course not found)
    Course.findById.mockResolvedValueOnce(null);

    await enrollCourse(req, res);

    expect(res.status(404));
    expect(res.json({ message: "Course not found" }));
  });

  it("should return 404 if the student is not found", async () => {
    // Mocking Course.findById to return a valid course
    Course.findById.mockResolvedValueOnce({ _id: "courseId" });

    // Mocking Student.findById to return null (student not found)
    Student.findById.mockResolvedValueOnce(null);

    await enrollCourse(req, res);

    expect(res.status(404));
    expect(res.json({ message: "Student not found" }));
  });

  it("should return 400 if the student is already enrolled in the course", async () => {
    // Mocking Course.findById to return a valid course
    Course.findById.mockResolvedValueOnce({ _id: "courseId" });

    // Mocking Student.findById to return a valid student
    Student.findById.mockResolvedValueOnce({ _id: "studentId" });

    // Mocking Enrollment.findOne to return an existing enrollment
    Enrollment.findOne.mockResolvedValueOnce({ _id: "existingEnrollmentId" });

    await enrollCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json({ message: "Student is already enrolled in this course" }));
  });
});
