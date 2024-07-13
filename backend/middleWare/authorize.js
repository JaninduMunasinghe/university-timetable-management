// middleware/authorize.js
const { ROLES } = require("../config/roles");
const jwt = require("jsonwebtoken");

function authorize(role) {
  return (req, res, next) => {
    //Get the jwt token from the request header

    const token = req.header("Authorization");
    //console.log(token);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Missing token" });
    }

    try {
      //verify the token and decode the payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      const userRole = decoded.role;

      //Check if the user role is authorized
      if (!role.includes(userRole)) {
        return res.status(403).json({ message: "Forbidden" });
      }
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
    next();
  };
}

module.exports = { authorize };
