const asyncHandler = require("express-async-handler");
const { registerUser, loginUser } = require("../controllers/userController");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
jest.mock("bcryptjs");
const bcrypt = require("bcryptjs");

jest.mock("../models/userModel");
jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));
jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

describe("registerUser", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        phone: "1234567890",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };
    next = jest.fn();
  });

  it("should register a new user successfully", async () => {
    // Mocking User.findOne to return null (user does not exist)
    User.findOne.mockResolvedValueOnce(null);

    // Mocking User.create to return a new user
    const mockUser = {
      _id: "user123",
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
    };
    User.create.mockResolvedValueOnce(mockUser);

    // Mocking jwt.sign
    const mockToken = "mockToken";
    jest.spyOn(jwt, "sign").mockReturnValueOnce(mockToken);

    await registerUser(req, res, next);

    // Check if status, json, and cookie are called correctly
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      _id: "user123",
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      token: mockToken,
    });
    expect(res.cookie).toHaveBeenCalledWith("token", mockToken, {
      path: "/",
      httpOnly: true,
      expires: expect.any(Date),
      sameSite: "none",
      secure: true,
    });
  });

  it("should handle validation errors if required fields are missing", async () => {
    // Missing required field (password)
    delete req.body.password;

    await registerUser(req, res, next);

    // Check if status and json are called correctly
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json({ message: "Please fill in all fields" }));
  });

  it("should handle error if user with the same email already exists", async () => {
    // Mocking User.findOne to return an existing user
    User.findOne.mockResolvedValueOnce({});

    await registerUser(req, res, next);

    // Check if status and json are called correctly
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json({ message: "Email has already been registered" }));
  });

  it("should handle error if password length is less than 6 characters", async () => {
    // Setting password length less than 6 characters
    req.body.password = "pass";

    await registerUser(req, res, next);

    // Check if status and json are called correctly
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json({ message: "Password must be at least 6 characters" }));
  });

  it("should handle errors thrown during user creation", async () => {
    // Mocking User.create to throw an error
    const errorMessage = "Test error";
    User.create.mockRejectedValueOnce(new Error(errorMessage));

    await registerUser(req, res, next);

    // Check if next is called with the error
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});

describe("loginUser", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        email: "john@example.com",
        password: "password123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };
    next = jest.fn();
  });

  it("should login user successfully", async () => {
    // Mocking User.findOne to return a user
    const mockUser = {
      _id: "user123",
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      password: await bcrypt.hash("password123", 10), // Hashed password
    };
    User.findOne.mockResolvedValueOnce(mockUser);

    // Mocking bcrypt.compare to return true
    //bcrypt.compare.mockResolvedValueOnce(true);

    // Mocking jwt.sign
    const mockToken = "mockToken";
    jest.spyOn(jwt, "sign").mockReturnValueOnce(mockToken);

    await loginUser(req, res, next);

    // Check if status, json, and cookie are called correctly
    expect(res.status(200));
    expect(
      res.json({
        _id: "user123",
        name: "John Doe",
        email: "john@gmail.com",
        phone: "0768472460",
        token: mockToken,
      })
    );
    expect(
      res.cookie("token", mockToken, {
        path: "/",
        httpOnly: true,
        expires: expect.any(Date),
        sameSite: "none",
        secure: true,
      })
    );
  });

  it("should handle validation errors if email or password is missing", async () => {
    // Missing email
    delete req.body.email;

    await loginUser(req, res, next);

    // Check if status and json are called correctly
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json({ message: "Please add email and password" }));
  });

  it("should handle error if user with the provided email is not found", async () => {
    // Mocking User.findOne to return null (user not found)
    User.findOne.mockResolvedValueOnce(null);

    await loginUser(req, res, next);

    // Check if status and json are called correctly
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json({ message: "User not found, please signup" }));
  });

  it("should handle error if password is incorrect", async () => {
    // Mocking User.findOne to return a user
    const mockUser = {
      _id: "user123",
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      password: await bcrypt.hash("password123", 10), // Hashed password
    };
    User.findOne.mockResolvedValueOnce(mockUser);

    await loginUser(req, res, next);

    // Check if status and json are called correctly
    expect(res.status(400));
    expect(res.json({ message: "Invalid email or password" }));
  });

  it("should handle errors thrown during user retrieval", async () => {
    // Mocking User.findOne to throw an error
    const errorMessage = "Test error";
    User.findOne.mockRejectedValueOnce(new Error(errorMessage));

    await loginUser(req, res, next);

    // Check if next is called with the error
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
