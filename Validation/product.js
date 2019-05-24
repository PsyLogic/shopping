const { body } = require("express-validator/check");

exports.signup = [
  body("username", "Username is required").exists({ checkFalsy: true }),
  body("email", "Email is required and must be valid")
    .exists()
    .isEmail(),
  body("password", "Password is required and must be more than 5 chars")
    .exists()
    .isLength({ min: 5 }),
  body("confirmPassword", "Password have not match").custom(
    (value, { req }) => value === req.body.password
  )
];
