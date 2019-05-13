const express = require("express");
const router = express.Router();

const productController = require("../controllers/product");
const shopController = require("../controllers/shop");

router.get("/", shopController.index);
router.get("/products", shopController.index);
router.get("/product-detail/:id", productController.show);
router.get("/cart", shopController.cart);
router.post("/cart", shopController.addToCart);
router.get("/orders", shopController.orders);
router.get("/checkout", shopController.checkOut);

module.exports = router;
