const express = require("express");
const router = express.Router();

const productController = require("../controllers/product");
const shopController = require("../controllers/shop");
const isAuth = require("../middleware/authMiddleware");

router.get("/", shopController.index);
router.get("/products", shopController.index);
router.get("/product-detail/:id", productController.show);
router.get("/cart", isAuth, shopController.cart);
router.post("/cart", isAuth, shopController.addToCart);
router.post("/cart-delete-item", isAuth, shopController.deleteCartItem);
router.get("/orders", isAuth, shopController.orders);
router.post("/create-order", isAuth, shopController.addOrders);
router.get("/order/:id/invoice", isAuth, shopController.getInvoice);
router.get("/checkout", isAuth, shopController.getCheckout);

module.exports = router;
