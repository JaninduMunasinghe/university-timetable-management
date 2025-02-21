const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (email, role) => {
  return jwt.sign({ email, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Register user

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  //validation
  if (!name || !email || !password || !phone) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  //check if user email already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("Email has already been registered");
  }

  //create new user
  const user = await User.create({
    name,
    email,
    password,
    phone,
  });

  //Generate token
  const token = generateToken(user.email, user.role);

  //Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //1 day
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, name, email, phone } = user;
    res.status(201).json({
      _id,
      name,
      email,
      phone,

      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //validate request
  if (!email || !password) {
    res.status(400);
    throw new Error("Please add email and password");
  }

  //check if user exists
  const user = await User.findOne({
    email,
  });

  if (!user) {
    res.status(400);
    throw new Error("User not found, please signup");
  }

  //User exists, check if password is correct

  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  //Generate token
  const token = generateToken(user.email, user.role);

  //Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //1 day
    sameSite: "none",
    secure: true,
  });

  if (user && passwordIsCorrect) {
    const { _id, name, email, phone } = user;
    res.status(200).json({
      _id,
      name,
      email,
      phone,

      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

//logout user
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({
    message: "Logged out successfully",
  });
});

//Get User Data
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    const { _id, name, email, phone } = user;
    res.status(201).json({
      _id,
      name,
      email,
      phone,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//Get all Users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  if (users) {
    res.status(201).json(users);
  } else {
    res.status(400);
    throw new Error("Users not found");
  }
});

//Get Login Status
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }

  //verify token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  }
  return res.json(false);
});

//Update User
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const { name, email, phone } = user;
    user.email = email;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//change Passowrd
const changepassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { oldPassword, password } = req.body;

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  //validate
  if (!oldPassword || !password) {
    res.status(400);
    throw new Error("Please add old and new password");
  }

  //check if old password is correct
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

  //Save new password
  if (user && passwordIsCorrect) {
    user.password = password;
    await user.save();
    res.status(200).send({ message: "Password changed successfully" });
  } else {
    res.status(400);
    throw new Error("Invalid old password");
  }
});

module.exports = {
  registerUser,
  loginUser,
  logout,
  getUser,
  getUsers,
  loginStatus,
  updateUser,
  changepassword,
};
