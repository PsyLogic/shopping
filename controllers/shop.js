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
  req.user
    .getCart()
    .then(products => {
      resp.render("shop/cart", {
        pageTitle: "Product List",
        path: "shop/cart",
        products
      });
    })
    .catch(err => {
      throw err;
    });
};

exports.addToCart = (req, resp, next) => {
  const productId = req.body.productID;
  Product.get(productId)
    .then(product => req.user.addToCart(product))
    .then(result => resp.redirect("/"))
    .catch(err => {
      throw err;
    });
};

exports.addToCart = (req, resp, next) => {
  const productId = req.body.productID;
  Product.get(productId)
    .then(product => req.user.addToCart(product))
    .then(result => resp.redirect("/"))
    .catch(err => {
      throw err;
    });
};

exports.deleteCartItem = (req, resp, next) => {
  const productId = req.body.productID;
  req.user
    .deleteCartItem(productId)
    .then(result => resp.redirect("/cart"))
    .catch(err => {
      throw err;
    });
};

exports.orders = (req, resp, next) => {
  req.user
    .getOrders()
    .then(orders => {
      resp.render("shop/orders", {
        pageTitle: "Your Orders",
        path: "shop/orders",
        orders
      });
    })
    .catch(err => {
      throw err;
    });
};

exports.addOrders = (req, resp, next) => {
  req.user
    .addOrders()
    .then(() => {
      resp.redirect("orders");
    })
    .catch(err => {
      throw err;
    });
};

// exports.checkOut = (req, resp, next) => {
//   resp.render("shop/checkout", {
//     pageTitle: "Product List",
//     path: "shop/checkout"
//   });
// };
