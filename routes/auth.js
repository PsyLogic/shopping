const express = require("express");

const authController = require("../controllers/auth");
const validation = require("../Validation/auth");
const router = express.Router();

router.get("/login", authController.getLogin);
router.post("/login", validation.signin, authController.postLogin);

router.get("/signup", authController.getSignup);
router.post("/signup", validation.signup, authController.postSignup);

router.get("/reset-password", authController.getReset);
router.post("/reset-password", validation.reset, authController.postReset);

router.get("/update-password/:token", authController.getUpdatePassword);
router.post(
  "/update-password",
  validation.updatePassword,
  authController.postUpdatePassword
);

router.post("/logout", authController.postLogout);

module.exports = router;
