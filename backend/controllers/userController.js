const User = require("../models/User");
const ApiResponse = require("../utils/ApiResponse");
const { getOnlineUserIds } = require("../socket/socket");

// @desc   Get all users (except self) with online status
// @route  GET /api/users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.session.userId } }).sort({
      username: 1,
    });
    const onlineIds = getOnlineUserIds();

    const result = users.map((u) => ({
      ...u.toSafeObject(),
      isOnline: onlineIds.includes(u._id.toString()),
    }));

    return res.status(200).json(new ApiResponse(200, { users: result }));
  } catch (error) {
    next(error);
  }
};

// @desc   Search users by username or mobile
// @route  GET /api/users/search?q=
exports.searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.status(200).json(new ApiResponse(200, { users: [] }));
    }

    const regex = new RegExp(q.trim(), "i");
    const users = await User.find({
      _id: { $ne: req.session.userId },
      $or: [{ username: regex }, { mobile: regex }],
    }).limit(20);

    const onlineIds = getOnlineUserIds();
    const result = users.map((u) => ({
      ...u.toSafeObject(),
      isOnline: onlineIds.includes(u._id.toString()),
    }));

    return res.status(200).json(new ApiResponse(200, { users: result }));
  } catch (error) {
    next(error);
  }
};
