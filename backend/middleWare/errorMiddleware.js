const errorHandler = (err, req, res, next) => {
  const ststusCode = res.statusCode ? res.statusCode : 500;
  res.status(ststusCode);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

module.exports = errorHandler;
