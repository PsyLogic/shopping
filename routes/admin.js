const express = require("express");

const router = express.Router();

const productController = require("../controllers/product");

router.get("/products", productController.index);
router.get("/add-product", productController.create);
router.post("/add-product", productController.store);
router.get("/edit-product/:id", productController.edit);
router.post("/update-product", productController.update);
router.post("/delete-product", productController.destroy);
module.exports = router;
