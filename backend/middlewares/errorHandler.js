const ApiError = require("../utils/ApiError");

// eslint-disable-next-line no-unused-vars
module.exports = function errorHandler(err, req, res, next) {
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500;
    let message = error.message || "Internal Server Error";

    // Mongoose duplicate key error
    if (error.code === 11000) {
      statusCode = 409;
      const field = Object.keys(error.keyPattern || {})[0];
      message = `${field} already exists`;
    }

    // Mongoose validation error
    if (error.name === "ValidationError") {
      statusCode = 422;
      message = Object.values(error.errors)
        .map((val) => val.message)
        .join(", ");
    }

    // Mongoose cast error (invalid ObjectId)
    if (error.name === "CastError") {
      statusCode = 400;
      message = `Invalid ${error.path}: ${error.value}`;
    }

    error = new ApiError(statusCode, message, error.errors || []);
  }

  if (req.flash) {
    req.flash("error", error.message);
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
};
