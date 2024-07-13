const User = require("../models/userModel");

const validateFacultyAssignment = async (req, res, next) => {
  try {
    const { faculty } = req.body;

    // Check if the provided facultyId exists
    const facultyUser = await User.findById(faculty);
    if (!facultyUser) {
      return res.status(404).json({ message: "Faculty member not found" });
    }

    // Check if the user's role is "faculty" or "lecturer"
    if (facultyUser.role !== "faculty") {
      return res
        .status(400)
        .json({ message: "Only faculty members can be assigned to courses" });
    }

    // If the user is a faculty member, proceed to the next middleware
    next();
  } catch (error) {
    console.error("Error validating faculty assignment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = validateFacultyAssignment;
