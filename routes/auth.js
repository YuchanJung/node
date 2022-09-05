const express = require("express");
const { check, body } = require("express-validator");

const {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,
} = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", getLogin);

router.get("/signup", getSignup);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail(),
    body("password", "Password has to be valid.")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  postLogin
);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email!")
      .custom((email, { req }) => {
        // if (value === "dummy@dummy.com") {
        //   throw new Error("This email address is forbidden");
        // }
        // return true;
        return User.findOne({ email }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-mail exists already.");
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "Please enter a password with only number and text and at least 5 characters."
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match!");
        }
        return true;
      })
      .trim(),
  ],
  postSignup
);

router.post("/logout", postLogout);

router.get("/reset", getReset);

router.post("/reset", postReset);

router.get("/reset/:token", getNewPassword);

router.post("/new-password", postNewPassword);

module.exports = router;
