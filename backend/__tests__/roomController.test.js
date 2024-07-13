const {
  createRoom,
  getRooms,
  getRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");
const Room = require("../models/roomModel");

jest.mock("../models/roomModel.js");

describe("createRoom", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        type: "Meeting Room",
        location: "Room 101",
        capacity: 10,
        availability: true,
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should create a room successfully", async () => {
    // Mocking Room.findOne to return null (no existing room at the location)
    Room.findOne.mockResolvedValueOnce(null);

    await createRoom(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(
      res.json(
        expect.objectContaining({
          type: "Meeting Room",
          location: "Room 101",
          capacity: 10,
          availability: true,
        })
      )
    );
  });

  it("should handle missing fields", async () => {
    // Missing required field (location)
    delete req.body.location;

    await createRoom(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json({ message: "Please fill all the fields" }));
  });

  it("should handle room already existing at the location", async () => {
    // Mocking Room.findOne to return an existing room
    const existingRoom = {
      type: "Meeting Room",
      location: "Room 101",
      capacity: 8,
      availability: true,
    };
    Room.findOne.mockResolvedValueOnce(existingRoom);

    await createRoom(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Room already created at this location",
    });
  });
});

describe("getRoom", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {
        id: "room_id_1",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should get a room successfully", async () => {
    // Mocking Room.findById to return a room
    const mockRoom = {
      _id: "room_id_1",
      type: "Meeting Room",
      location: "Room 101",
      capacity: 10,
      availability: true,
    };
    Room.findById.mockResolvedValueOnce(mockRoom);

    await getRoom(req, res, next);

    expect(res.status(200));
    expect(res.json(mockRoom));
  });

  it("should handle room not found", async () => {
    // Mocking Room.findById to return null (no room found)
    Room.findById.mockResolvedValueOnce(null);

    await getRoom(req, res, next);

    expect(res.status(404));
    expect(res.json({ message: "Room not found" }));
  });
});

describe("getRooms", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should get all rooms successfully", async () => {
    // Mocking Room.find to return an array of rooms
    const mockRooms = [
      {
        _id: "room_id_1",
        type: "Meeting Room",
        location: "Room 101",
        capacity: 10,
        availability: true,
      },
      {
        _id: "room_id_2",
        type: "Conference Room",
        location: "Room 102",
        capacity: 20,
        availability: false,
      },
    ];
    Room.find.mockResolvedValueOnce(mockRooms);

    await getRooms(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockRooms);
  });

  it("should handle no rooms found", async () => {
    // Mocking Room.find to return an empty array
    Room.find.mockResolvedValueOnce([]);

    await getRooms(req, res, next);

    expect(res.status(404));
    expect(res.json({ message: "Rooms not found" }));
  });
});

describe("updateRoom", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {
        id: "room_id_1",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should update a room successfully", async () => {
    // Mocking Room.findById to return a room
    const mockRoom = {
      _id: "room_id_1",
      type: "Meeting Room",
      location: "Room 101",
      capacity: 10,
      availability: true,
    };
    Room.findById.mockResolvedValueOnce(mockRoom);

    await updateRoom(req, res, next);

    expect(res.status(200));
    expect(res.json(mockRoom));
  });

  it("should handle missing fields", async () => {
    req.body = {};

    await updateRoom(req, res, next);

    expect(res.status(400));
    expect(res.json({ message: "Please fill all the fields" }));
  });
});

describe("deleteRoom", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {
        id: "room_id_1",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should delete a room successfully", async () => {
    // Mocking Room.findById to return a room
    const mockRoom = {
      _id: "room_id_1",
      type: "Meeting Room",
      location: "Room 101",
      capacity: 10,
      availability: true,
    };
    Room.findById.mockResolvedValueOnce(mockRoom);

    await deleteRoom(req, res, next);

    expect(res.status(200));
    expect(res.json({ message: "Room removed" }));
  });

  it("should handle room not found", async () => {
    // Mocking Room.findById to return null (no room found)
    Room.findById.mockResolvedValueOnce(null);

    await deleteRoom(req, res, next);

    expect(res.status(404));
    expect(res.json({ message: "Room not found" }));
  });
});
