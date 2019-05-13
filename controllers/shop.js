const Product = require("../models/product");

exports.index = (req, resp, next) => {
  const products = Product.all();

  resp.render("shop/product-list", {
    pageTitle: "Product List",
    path: "/",
    products
  });
};

exports.cart = (req, resp, next) => {
  resp.render("shop/cart", {
    pageTitle: "Product List",
    path: "shop/cart"
  });
};

exports.addToCart = (req, resp, next) => {
  // Check if product exists
  // find the product in the cart
  // if it is exists increment the quantity
  // otherwise add it to cart

  resp.redirect("/cart");
};

exports.orders = (req, resp, next) => {
  resp.render("shop/orders", {
    pageTitle: "Your Orders",
    path: "shop/orders"
  });
};

exports.checkOut = (req, resp, next) => {
  resp.render("shop/checkout", {
    pageTitle: "Product List",
    path: "shop/checkout"
  });
};
