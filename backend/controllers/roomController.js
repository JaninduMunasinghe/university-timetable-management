const asyncHandler = require("express-async-handler");
const Room = require("../models/roomModel");

const createRoom = asyncHandler(async (req, res) => {
  const { type, location, capacity, availability } = req.body;

  //Validation
  if (!type || !location || !capacity) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  // Check if a room already exists with the same location
  const existingRoom = await Room.findOne({ location });
  if (existingRoom) {
    res.status(400).json({ message: "Room already created at this location" });
    return;
  }

  //Create Room
  const room = await Room.create({
    type,
    location,
    capacity,
    availability,
  });

  res.status(201).json(room);
});

//Get all rooms
const getRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find({});

  if (!rooms) {
    res.status(404);
    throw new Error("Rooms not found");
  }

  res.status(200).json(rooms);
});

//Get single room
const getRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  res.status(200).json(room);
});

//Delete room
const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  await room.deleteOne();
  res.status(200).json({ message: "Room removed" });
});

//Update room
const updateRoom = asyncHandler(async (req, res) => {
  const { type, location, capacity } = req.body;

  //Validation
  if (!type || !location || !capacity) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  //Find course
  const room = await Room.findById(req.params.id);

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  //Update room
  room.type = type;
  room.location = location;
  room.capacity = capacity;
  room.availability = availability;

  await room.save();
  res.status(200).json(room);
});

module.exports = {
  createRoom,
  getRooms,
  getRoom,
  deleteRoom,
  updateRoom,
};
