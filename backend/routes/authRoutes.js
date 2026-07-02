const express = require("express");
const { body } = require("express-validator");
const validate = require("../middlewares/validate");
const isLoggedIn = require("../middlewares/isLoggedIn");
const { signup, login, logout, getMe } = require("../controllers/authController");

const router = express.Router();

router.post(
  "/signup",
  [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3, max: 30 })
      .withMessage("Username must be 3-30 characters"),
    body("mobile")
      .trim()
      .notEmpty()
      .withMessage("Mobile number is required")
      .matches(/^\d{10}$/)
      .withMessage("Mobile must be exactly 10 digits"),
    body("city").trim().notEmpty().withMessage("City is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ],
  validate,
  signup
);

router.post(
  "/login",
  [
    body("mobile")
      .trim()
      .notEmpty()
      .withMessage("Mobile number is required")
      .matches(/^\d{10}$/)
      .withMessage("Mobile must be exactly 10 digits"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);

router.get("/logout", isLoggedIn, logout);
router.get("/me", isLoggedIn, getMe);

module.exports = router;
