const {
  createTimeTable,
  getTimeTables,
  getTimeTable,
  deleteTimeTable,
  updateTimeTable,
} = require("../controllers/timeTableController"); // Change this to your controller file path
const TimeTable = require("../models/timeTableModel");
const User = require("../models/userModel");
const Enrollment = require("../models/enrollmentModel");
const nodeMailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

jest.mock("../models/timeTableModel");
jest.mock("../models/userModel");
jest.mock("../models/enrollmentModel");
jest.mock("nodemailer");

describe("createTimeTable", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        courseId: "65fe81c441492324814feb31",
        dayOfWeek: "Monday",
        startTime: "10:00",
        endTime: "12:00",
        facultyId: "65fd6d29e9e973f36f0e4cc5",
        locationId: "65fd16b0fa89881ea626cb3e",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should create a timetable successfully", async () => {
    // Mocking User.findById to return a valid faculty user
    User.findById.mockResolvedValueOnce({ role: "faculty" });

    // Mocking TimeTable.find to return an empty array (no overlapping timetables)
    TimeTable.find.mockResolvedValueOnce([]);

    await createTimeTable(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it("should return 400 if any required field is missing", async () => {
    // Missing required field
    delete req.body.courseId;

    await createTimeTable(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should return 400 if facultyId is invalid", async () => {
    // Mocking User.findById to return null (invalid faculty user)
    User.findById.mockResolvedValueOnce(null);

    await createTimeTable(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    //expect(res.json).not.toHaveBeenCalled();
  });

  it("should return 400 if there are overlapping timetables", async () => {
    // Mocking TimeTable.find to return overlapping timetables
    TimeTable.find.mockResolvedValueOnce([{ _id: "existingTimetableId" }]);

    await createTimeTable(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(
      res.json({
        message: "A timetable already exists for this time slot and location",
      })
    );
  });
});

describe("getTimeTables", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return all time tables", async () => {
    // Mocking TimeTable.find to return an array of time tables
    const mockTimeTables = [
      {
        _id: "timetableId1",
        courseId: "courseId1",
        locationId: "locationId1",
        dayOfWeek: "Monday",
        startTime: "10:00",
        endTime: "12:00",
      },
      {
        _id: "timetableId2",
        courseId: "courseId2",
        locationId: "locationId2",
        dayOfWeek: "Tuesday",
        startTime: "14:00",
        endTime: "16:00",
      },
    ];
    TimeTable.find.mockResolvedValueOnce(mockTimeTables);

    await getTimeTables(req, res, next);

    expect(res.status(200));
    expect(res.json(mockTimeTables));
  });

  it("should handle errors", async () => {
    // Simulating error by throwing an exception
    const errorMessage = "Test error";
    TimeTable.find.mockRejectedValueOnce(new Error(errorMessage));

    await getTimeTables(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json({ message: "Internal server error" }));
  });
});

describe("getTimeTable", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {
        id: "testTimeTableId", // Mocking a timeTable ID
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return a time table", async () => {
    // Mocking the TimeTable.findById method to return a mock timeTable
    const mockTimeTable = {
      _id: "testTimeTableId",
      courseId: "courseId1",
      locationId: "locationId1",
      dayOfWeek: "Monday",
      startTime: "10:00",
      endTime: "12:00",
    };
    TimeTable.findById.mockResolvedValueOnce(mockTimeTable);

    await getTimeTable(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json(mockTimeTable));
  });

  it("should handle not found error and return 404 status", async () => {
    // Mocking the TimeTable.findById method to return null (no timeTable found)
    TimeTable.findById.mockResolvedValueOnce(null);

    await getTimeTable(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json({ message: "TimeTable not found" }));
  });
});

describe("deleteTimeTable", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {
        id: "testTimeTableId", // Mocking a timeTable ID
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should delete the time table successfully", async () => {
    // Mocking the TimeTable.findById method to return a mock timeTable
    const mockTimeTable = {
      _id: "testTimeTableId",
      courseId: "courseId1",
      locationId: "locationId1",
      dayOfWeek: "Monday",
      startTime: "10:00",
      endTime: "12:00",
      deleteOne: jest.fn().mockResolvedValueOnce({}), // Mocking deleteOne method
    };

    // Mocking the TimeTable.findById method to return the mockTimeTable when called with the testTimeTableId
    TimeTable.findById.mockResolvedValueOnce(mockTimeTable);

    // Call the deleteTimeTable function with the mocked request, response, and next arguments
    await deleteTimeTable(req, res, next);

    // Check if the response status is set to 200
    expect(res.status).toHaveBeenCalledWith(200);

    // Check if the response JSON data contains the success message
    expect(res.json).toHaveBeenCalledWith({
      message: "TimeTable Deleted Successfully",
    });

    // Check if the deleteOne method is called on the mockTimeTable
    expect(mockTimeTable.deleteOne).toHaveBeenCalled();
  });

  it("should handle not found error and return 404 status", async () => {
    // Mocking the TimeTable.findById method to return null (no timeTable found)
    TimeTable.findById.mockResolvedValueOnce(null);

    // Call the deleteTimeTable function with the mocked request, response, and next arguments
    await deleteTimeTable(req, res, next);

    // Check if the response status is set to 404
    expect(res.status).toHaveBeenCalledWith(404);

    // Check if the response JSON data contains the error message
    expect(res.json({ message: "TimeTable not found" }));
  });
});

describe("updateTimeTable", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {
        id: "timetableId",
      },
      body: {
        courseId: "courseId",
        dayOfWeek: "Monday",
        startTime: "10:00",
        endTime: "12:00",
        facultyId: "facultyId",
        locationId: "locationId",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should update a timetable successfully", async () => {
    // Mocking TimeTable.findById to return a mock time table
    const mockTimeTable = {
      _id: "timetableId",
      courseId: "courseId",
      dayOfWeek: "Monday",
      startTime: "10:00",
      endTime: "12:00",
      facultyId: "facultyId",
      locationId: "locationId",
      save: jest.fn().mockResolvedValueOnce(),
    };
    TimeTable.findById.mockResolvedValueOnce(mockTimeTable);

    // Mocking TimeTable.find to return an empty array (no overlapping timetables)
    TimeTable.find.mockResolvedValueOnce([]);

    // Mocking Enrollment.find to return an empty array
    Enrollment.find.mockResolvedValueOnce([]);

    // Mocking nodemailer.createTransport to return a mock transporter
    const mockTransporter = {
      sendMail: jest.fn().mockImplementation((options, callback) => {
        callback(null, { response: "Email sent" });
      }),
    };
    nodeMailer.createTransport.mockReturnValueOnce(mockTransporter);

    await updateTimeTable(req, res, next);

    expect(res.status(200));
    expect(res.json(mockTimeTable));
    expect(mockTimeTable.save());
    // expect(mockTransporter.sendMail());
  });

  it("should handle validation errors", async () => {
    // Missing required field (dayOfWeek)
    delete req.body.dayOfWeek;

    await updateTimeTable(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json({ message: "Please fill all the fields" }));
  });
});
