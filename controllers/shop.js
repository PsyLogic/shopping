const Product = require("../models/product");
const Cart = require("../models/cart");

exports.index = (req, resp, next) => {
  Product.all()
    .then(products => {
      resp.render("shop/index", {
        pageTitle: "Product List",
        path: "/",
        products
      });
    })
    .catch(err => {
      throw err;
    });
};

exports.cart = (req, resp, next) => {
  resp.render("shop/cart", {
    pageTitle: "Product List",
    path: "shop/cart"
  });
};

exports.addToCart = (req, resp, next) => {
  const productId = req.body.productID;
  Product.get(productId)
    .then(product => req.user.addToCart(product))
    .then(result => console.log(result))
    .catch(err => {
      throw err;
    });
};

// exports.orders = (req, resp, next) => {
//   resp.render("shop/orders", {
//     pageTitle: "Your Orders",
//     path: "shop/orders"
//   });
// };

// exports.checkOut = (req, resp, next) => {
//   resp.render("shop/checkout", {
//     pageTitle: "Product List",
//     path: "shop/checkout"
//   });
// };
