const Product = require("../models/product");
const Order = require("../models/order");

exports.index = (req, resp, next) => {
  Product.find()
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
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      resp.render("shop/cart", {
        pageTitle: "Product List",
        path: "shop/cart",
        products: user.cart.items
      });
    })
    .catch(err => {
      throw err;
    });
};

exports.addToCart = (req, resp, next) => {
  const productId = req.body.productID;
  Product.findById(productId)
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
  Order.find({ userId: req.user._id })
    .then(orders => {
      resp.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders
      });
    })
    .catch(err => {
      throw err;
    });
};

exports.addOrders = (req, resp, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { product: { ...i.productId._doc }, quantity: i.quantity };
      });
      const order = new Order({
        userId: req.user,
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      resp.redirect("/orders");
    })
    .catch(err => console.log(err));
};

// exports.checkOut = (req, resp, next) => {
//   resp.render("shop/checkout", {
//     pageTitle: "Product List",
//     path: "shop/checkout"
//   });
// };
