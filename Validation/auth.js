const { body, param } = require("express-validator/check");

exports.signup = [
  body("username", "Username is required").exists({ checkFalsy: true }),
  body("email", "Email is required and must be valid").isEmail(),
  body("password", "Password is required and must be more than 5 chars")
    .exists()
    .isLength({ min: 5 }),
  body("confirmPassword", "Password have not match").custom(
    (value, { req }) => value === req.body.password
  )
];

exports.signin = [
  body("username", "Username is required").exists({ checkFalsy: true }),
  body("password", "Password is required")
    .not()
    .isEmpty()
];

exports.reset = [
  body("email", "Email is required and must be valid").isEmail()
];

exports.updatePassword = [
  body(
    "password",
    "Password is required and must be more than 5 chars"
  ).isLength({ min: 5 }),
  body("confirmPassword", "Password have not match").custom(
    (value, { req }) => value === req.body.password
  )
];
