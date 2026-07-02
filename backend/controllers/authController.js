const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// @desc   Register new user
// @route  POST /api/auth/signup
exports.signup = async (req, res, next) => {
  try {
    const { username, mobile, city, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { mobile }] });
    if (existingUser) {
      const field = existingUser.username === username ? "Username" : "Mobile number";
      req.flash("error", `${field} already exists`);
      throw new ApiError(409, `${field} already exists. User Already Exists`);
    }

    const user = await User.create({ username, mobile, city, password });

    req.session.userId = user._id;
    req.flash("success", "Signup Successful");

    return res.status(201).json(
      new ApiResponse(201, { user: user.toSafeObject() }, "Signup Successful")
    );
  } catch (error) {
    next(error);
  }
};

// @desc   Login user
// @route  POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { mobile, password } = req.body;

    const user = await User.findOne({ mobile }).select("+password");
    if (!user) {
      req.flash("error", "User Not Found");
      throw new ApiError(404, "User Not Found");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      req.flash("error", "Invalid Password");
      throw new ApiError(401, "Invalid Password");
    }

    req.session.userId = user._id;
    req.flash("success", "Login Successful");

    return res.status(200).json(
      new ApiResponse(200, { user: user.toSafeObject() }, "Login Successful")
    );
  } catch (error) {
    next(error);
  }
};

// @desc   Logout user
// @route  GET /api/auth/logout
exports.logout = async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) return next(new ApiError(500, "Logout failed"));
      res.clearCookie("connect.sid");
      return res.status(200).json(new ApiResponse(200, {}, "Logout Successful"));
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get logged in user
// @route  GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) throw new ApiError(404, "User not found");
    return res.status(200).json(new ApiResponse(200, { user: user.toSafeObject() }));
  } catch (error) {
    next(error);
  }
};
