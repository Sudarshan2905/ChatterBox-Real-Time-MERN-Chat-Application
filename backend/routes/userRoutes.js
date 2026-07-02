const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const { getUsers, searchUsers } = require("../controllers/userController");

const router = express.Router();

router.get("/", isLoggedIn, getUsers);
router.get("/search", isLoggedIn, searchUsers);

module.exports = router;
