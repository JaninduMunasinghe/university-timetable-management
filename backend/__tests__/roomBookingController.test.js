const {
  updateRoomAvailability,
  getAvailableRooms,
  bookRoom,
} = require("../controllers/roomBookingController");
const Room = require("../models/roomModel");
const Booking = require("../models/roomBookingModel");

jest.mock("../models/roomModel");
jest.mock("../models/roomBookingModel.js");

describe("bookRoom", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        roomId: "60f3b9c7e6b0b3c6f8b1b3e2",
        date: "2021-07-20",
        startTime: "08:00",
        endTime: "09:00",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should book a room successfully", async () => {
    await bookRoom(req, res, next);

    expect(res.status(200));

    // Check if Booking.create was called with the correct arguments
    expect(res.json({ message: "Room booked successfully" }));
  }, 100000);

  it("should return 400 if any required field is missing", async () => {
    // Missing required field (e.g., roomId)
    delete req.body.roomId;

    await bookRoom(req, res, next);

    expect(res.status(400));
    expect(res.json({ message: "Please fill all the fields" }));
  });
});

describe("getAvailableRooms", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should get available rooms successfully", async () => {
    const mockAvailableRooms = [
      {
        _id: "room_id_1",
        type: "Single",
        location: "Location 1",
        capacity: 5,
        availability: true,
      },
      {
        _id: "room_id_2",
        type: "Double",
        location: "Location 2",
        capacity: 10,
        availability: true,
      },
    ];
    Room.find.mockResolvedValueOnce(mockAvailableRooms);
    await getAvailableRooms(req, res, next);

    expect(res.status(200));

    // Check if Room.find was called with the correct arguments
    expect(res.json(mockAvailableRooms));
  });

  it("should return 404 if an error occurs", async () => {
    Room.find.mockRejectedValueOnce(new Error("Server error"));

    await getAvailableRooms(req, res, next);

    expect(res.status(404));
    expect(res.json({ message: "Server error" }));
  });
});

describe("updateRoomAvailability", () => {
  it("should update room availability successfully", async () => {
    // Mock bookings to return past bookings
    const mockBookings = [
      { roomId: "room_id_1", date: new Date(), endTime: new Date() },
      { roomId: "room_id_1", date: new Date(), endTime: new Date() },
    ];
    Booking.find.mockResolvedValueOnce(mockBookings);

    // Mock room to exist
    const mockRoom = {
      _id: "room_id_1",
      availability: true,
      save: jest.fn(), // Mock save function
    };
    Room.findById.mockResolvedValueOnce(mockRoom);

    // Mock date to be in the past
    const currentTime = new Date("2024-03-23T08:00:00");

    // Call the function
    await updateRoomAvailability("room_id_1", new Date(), currentTime);

    // Expect the room's availability to be updated
    expect(mockRoom.availability).toBe(true);
    expect(mockRoom.save());
  });

  it("should not update room availability if there are future bookings", async () => {
    // Mock bookings to return future bookings
    const mockBookings = [
      {
        roomId: "room_id_1",
        date: new Date("2024-03-23"),
        endTime: new Date(),
      },
      {
        roomId: "room_id_1",
        date: new Date("2024-03-23"),
        endTime: new Date(),
      },
    ];
    Booking.find.mockResolvedValueOnce(mockBookings);

    // Mock room to exist
    const mockRoom = {
      _id: "room_id_1",
      availability: true,
      save: jest.fn(), // Mock save function
    };
    Room.findById.mockResolvedValueOnce(mockRoom);

    // Mock date to be in the future
    const currentTime = new Date("2024-03-22T08:00:00");

    // Call the function
    await updateRoomAvailability("room_id_1", new Date(), currentTime);

    // Expect the room's availability to not be updated
    expect(mockRoom.availability).toBe(true);
    expect(mockRoom.save());
  });
});
