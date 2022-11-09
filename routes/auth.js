const express = require("express");
const { body, check } = require("express-validator");
const router = express.Router();
const User = require("../models/user");
const authCont = require("../controllers/authCont");


router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please Enter a Valid Email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email Address is Already Exists");
          }
        });
      }),
    body("password").trim().isLength({ min: 5 }).withMessage("please enter a strong password"),
    body("firstName").trim().not().isEmpty(),
    body("lastName").trim().not().isEmpty(),
  ],
  authCont.signup
);
router.post('/login',authCont.login);
module.exports = router;
