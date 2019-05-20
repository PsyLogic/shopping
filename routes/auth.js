const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

router.get("/reset-password", authController.getReset);
router.post("/reset-password", authController.postReset);

router.get("/update-password/:token", authController.getUpdatePassword);
router.post("/update-password", authController.postUpdatePassword);

router.post("/logout", authController.postLogout);

module.exports = router;
