const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const courseRoute = require("./routes/courseRoute");
const roomRoute = require("./routes/roomRoute");
const roomBookingRoute = require("./routes/roomBookingRoute");
const timeTableRoute = require("./routes/timeTableRoute");
const enrollmentRoute = require("./routes/enrollmentRoute");
const errorHandler = require("./middleware/errorMiddleware");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const app = express();

//Midlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//Routes Middleware
app.use("/api/users", userRoute);
app.use("/api/course", courseRoute);
app.use("/api/room", roomRoute);
app.use("/api/room/book", roomBookingRoute);
app.use("/api/timetable", timeTableRoute);
app.use("/api/enrollment", enrollmentRoute);

//Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later",
});

app.use(limiter);

const PORT = process.env.PORT || 5000;

//Error Middleware
app.use(errorHandler);

//connect to mongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = { app };
