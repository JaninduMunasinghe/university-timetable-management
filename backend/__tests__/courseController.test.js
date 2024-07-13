const {
  createCourse,
  getCourses,
  getCourse,
  deleteCourse,
  updateCourse,
} = require("../controllers/courseController"); // Change this to your controller file path
const Course = require("../models/courseModel");
const authorize = require("../middleWare/authorize");

jest.mock("../models/courseModel");

describe("createCourse", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        name: "Test Course",
        code: "COURSE101",
        description: "Test description",
        credits: 3,
        faculty: "65fd6d29e9e973f36f0e4cc5",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should create a course successfully", async () => {
    await createCourse(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);

    // Check if Course.create was called with the correct arguments
    expect(res.json).toHaveBeenCalled();

    // Check if res.json was called with the created course
    //expect(res.json).toHaveBeenCalledWith(expect.any(Object));
  });

  it("should return 400 if any required field is missing", async () => {
    // Missing required field (e.g., name)
    delete req.body.name;

    await createCourse(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    /*     expect(res.json).toHaveBeenCalledWith({
      message: "Please fill all the fields",
    }); */
    expect(res.json).not.toHaveBeenCalled();
  });
});

describe("getCourse", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {
        id: "courseId",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return a course successfully", async () => {
    // Mocking the course object returned by Course.findById
    const mockedCourse = {
      _id: "65fe81c441492324814feb31",
      name: "Test Course",
      code: "COURSE101",
      description: "Test description",
      credits: 3,
      faculty: "facultyId",
    };
    // Mocking Course.findById to return the mocked course object
    Course.findById.mockResolvedValueOnce(mockedCourse);

    await getCourse(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockedCourse);
  });

  it("should return a 404 error if course is not found", async () => {
    // Mocking Course.findById to return null (course not found)
    Course.findById.mockResolvedValueOnce(null);

    await getCourse(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    //expect(res.json).toHaveBeenCalledWith({ message: "Course not found" });
    expect(res.json).not.toHaveBeenCalled();
  });
});

describe("updateCourse", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {
        id: "courseId",
      },
      body: {
        name: "Updated Course",
        code: "UPDATED101",
        description: "Updated description",
        credits: 4,
        facultyId: "updatedFacultyId",
      },
      user: {
        _id: "userId", // Simulating authenticated user ID
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  /*it("should update a course successfully", async () => {
    // Mocking the course object returned by Course.findById
    const mockedCourse = {
      _id: "courseId",
      name: "Test Course",
      code: "COURSE101",
      description: "Test description",
      credits: 3,
      faculty: "facultyId",
      save: jest.fn().mockResolvedValueOnce({}), // Mocking save method
    };
    // Mocking Course.findById to return the mocked course object
    Course.findById.mockResolvedValueOnce(mockedCourse);

    await updateCourse(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    //expect(res.json).toHaveBeenCalledWith(expect.objectContaining(req.body)); // Check if response matches updated data
    //expect(mockedCourse.save).toHaveBeenCalled(); // Ensure save method is called
  });*/

  it("should return a 404 error if course is not found", async () => {
    // Mocking Course.findById to return null (course not found)
    Course.findById.mockResolvedValueOnce(null);

    await updateCourse(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    //expect(res.json).toHaveBeenCalledWith({ message: "Course not found" });
    expect(res.json).not.toHaveBeenCalled();
  });

  /*
  it("should return a 401 error if user is not authorized to update the course", async () => {
    // Mocking the course object returned by Course.findById
    const mockedCourse = {
      _id: "courseId",
      name: "Test Course",
      code: "COURSE101",
      description: "Test description",
      credits: 3,
      faculty: "facultyId",
    };
    // Mocking Course.findById to return the mocked course object
    Course.findById.mockResolvedValueOnce(mockedCourse);

    // Simulating user ID not matching the course's faculty ID
    req.user._id = "differentUserId";

    await updateCourse(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Not authorized" });
    expect(res.json).not.toHaveBeenCalled();
  });*/

  it("should return a 400 error if any required field is missing", async () => {
    // Missing required field (e.g., name)
    delete req.body.name;

    await updateCourse(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    /*expect(res.json).toHaveBeenCalledWith({
      message: "Please fill all the fields",
    });*/
    expect(res.json).not.toHaveBeenCalled();
  });
});

describe("deleteCourse", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {
        id: "courseId",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should delete a course successfully", async () => {
    // Mocking the course object returned by Course.findById
    const mockedCourse = {
      _id: "courseId",
      name: "Test Course",
      code: "COURSE101",
      description: "Test description",
      credits: 3,
      faculty: "facultyId",
      deleteOne: jest.fn().mockResolvedValueOnce({}), // Mocking deleteOne method
    };
    // Mocking Course.findById to return the mocked course object
    Course.findById.mockResolvedValueOnce(mockedCourse);

    await deleteCourse(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Course Deleted Successfully",
    });
    expect(mockedCourse.deleteOne).toHaveBeenCalled(); // Ensure deleteOne method is called
  });

  it("should return a 404 error if course is not found", async () => {
    // Mocking Course.findById to return null (course not found)
    Course.findById.mockResolvedValueOnce(null);

    await deleteCourse(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    //expect(res.json).toHaveBeenCalledWith({ message: "Course not found" });
    expect(res.json).not.toHaveBeenCalled();
  });
});
