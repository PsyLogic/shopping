const express = require("express");
const router = express.Router();

const productController = require("../controllers/product");
const isAuth = require("../middleware/authMiddleware");

router.get("/products", isAuth, productController.index);
router.get("/add-product", isAuth, productController.create);
router.post("/add-product", isAuth, productController.store);
router.get("/edit-product/:id", isAuth, productController.edit);
router.post("/update-product", isAuth, productController.update);
router.post("/delete-product", isAuth, productController.destroy);
module.exports = router;
