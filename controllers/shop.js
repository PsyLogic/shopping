const fs = require("fs");
const { storage } = require("../config/storage");
const PDFDocument = require("pdfkit");
const Product = require("../models/product");
const Order = require("../models/order");

const ITEMS_PER_PAGE = 2;

exports.index = (req, resp, next) => {
  const page = +req.query.page || 1;
  let productCounts;
  Product.countDocuments()
    .then(count => {
      productCounts = count;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      resp.render("shop/index", {
        pageTitle: "Product List",
        path: "/",
        products,
        pagination: {
          currentPage: page,
          nextPage: page + 1,
          previousPage: page - 1,
          hasNextPage: ITEMS_PER_PAGE * page < productCounts,
          hasPreviousPage: page > 1,
          firstPage: 1,
          lastPage: Math.ceil(productCounts / ITEMS_PER_PAGE)
        }
      });
    })
    .catch(err => {
      next(err);
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

exports.getInvoice = (req, resp, next) => {
  Order.findById(req.params.id)
    .then(order => {
      const PDFDoc = new PDFDocument();
      const filename = Date.now() + ".pdf";
      const filenamePath = storage.invoicePath + filename;

      resp.setHeader("Content-type", "application/pdf");
      resp.setHeader(
        "Content-Disposition",
        'inline; filename="' + filename + '"'
      );

      PDFDoc.pipe(fs.createWriteStream(filenamePath));
      PDFDoc.pipe(resp);

      PDFDoc.fontSize(26).text("Invoice", {
        align: "center",
        underline: true,
        ellipsis: true
      });

      let totalPrice = 0;
      let orderList = [];
      PDFDoc.fontSize(19).text("Orders details", { underline: true });

      order.products.forEach(prod => {
        orderList.push(
          `Name: ${prod.product.title} <-> Qty: ${prod.quantity} <-> Price: $ ${
            prod.product.price
          }`
        );
        totalPrice += prod.quantity * prod.product.price;
      });
      PDFDoc.fontSize(16).list(orderList);
      PDFDoc.text("_______________________");
      PDFDoc.fontSize(18).text("Total Price: " + totalPrice);

      PDFDoc.end();
    })
    .catch(err => {
      next(err);
    });
};

// exports.checkOut = (req, resp, next) => {
//   resp.render("shop/checkout", {
//     pageTitle: "Product List",
//     path: "shop/checkout"
//     isAuthenticated: req.session.isLoggedIn,
//   });
// };
