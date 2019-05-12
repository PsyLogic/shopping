const Product = require("../models/product");
const products = Product.all();

exports.index = (req, resp, next) => {
  resp.render("shop/index", {
    pageTitle: "Product List",
    path: "/",
    products
  });
};

exports.cart = (req, resp, next) => {
  resp.render("shop/cart", {
    pageTitle: "Product List",
    path: "/",
    products
  });
};

exports.checkOut = (req, resp, next) => {
  resp.render("shop/checkout", {
    pageTitle: "Product List",
    path: "/",
    products
  });
};
