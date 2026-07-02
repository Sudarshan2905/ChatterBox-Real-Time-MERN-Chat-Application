const ApiError = require("../utils/ApiError");

module.exports = function isLoggedIn(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  return next(new ApiError(401, "You must be logged in to access this resource"));
};
