const asyncHandler = require("express-async-handler");
const Booking = require("../models/roomBookingModel");
const Room = require("../models/roomModel");

// Function to update room availability status based on booked time slots
const updateRoomAvailability = async (roomId, date, currentTime) => {
  const bookings = await Booking.find({
    roomId,
    date,
    endTime: { $lte: currentTime },
  });
  const room = await Room.findById(roomId);
  if (!room) {
    throw new Error("Room not found");
  }
  // If there are no future bookings for the room, mark it as available
  if (bookings.length === 0) {
    room.availability = true;
    await room.save();
  }
};

//Get Available rooms
const getAvailableRooms = asyncHandler(async (req, res) => {
  try {
    const availableRooms = await Room.find({ availability: true });
    res.json(availableRooms);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//Book a room
const bookRoom = asyncHandler(async (req, res) => {
  try {
    const { roomId, date, startTime, endTime } = req.body;

    //validation
    if (!roomId || !date || !startTime || !endTime) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    //Create a booking
    const booking = new Booking({
      roomId,
      date,
      startTime,
      endTime,
    });
    await booking.save();

    // Update room availability
    const currentTime = new Date();
    await updateRoomAvailability(roomId, date, currentTime);

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    if (!room.availability) {
      return res.status(400).json({ message: "Room is already booked" });
    }
    // Book the room
    room.availability = false;
    await room.save();
    res.json({ message: "Room booked successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = { getAvailableRooms, bookRoom, updateRoomAvailability };
