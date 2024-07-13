const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "Please add a room name"],
      trim: true,
    },

    location: {
      type: String,
      required: [true, "Please add a description"],
      trim: true,
    },

    capacity: {
      type: Number,
      required: [true, "Please add a capacity"],
    },

    availability: {
      type: Boolean,
      default: true, // Room is initially available
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
