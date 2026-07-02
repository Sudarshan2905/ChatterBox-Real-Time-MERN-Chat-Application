const express = require("express");
const { body } = require("express-validator");
const isLoggedIn = require("../middlewares/isLoggedIn");
const validate = require("../middlewares/validate");
const { getConversation, sendMessage } = require("../controllers/chatController");

const router = express.Router();

router.get("/:userId", isLoggedIn, getConversation);

router.post(
  "/send",
  isLoggedIn,
  [
    body("receiver").notEmpty().withMessage("Receiver is required"),
    body("message").trim().notEmpty().withMessage("Message cannot be empty"),
  ],
  validate,
  sendMessage
);

module.exports = router;
