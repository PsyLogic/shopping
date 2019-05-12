const Product = require("../models/product");

exports.index = (req, resp, next) => {
  const products = Product.all();

  resp.render("admin/products", {
    pageTitle: "Product List",
    path: "/",
    products
  });
};

exports.show = (req, resp, next) => {
  resp.render("shop/product-detail", {
    pageTitle: "Product Detail",
    path: "/admin/product-detail"
  });
};

exports.create = (req, resp, next) => {
  resp.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product"
  });
};

exports.store = (req, resp, next) => {
  console.log(req.body.title);

  const product = new Product(req.body.title);
  product.save();

  resp.redirect("/");
};

exports.edit = (req, resp, next) => {
  resp.render("admin/edit-product", {
    pageTitle: "Edit Product",
    path: "/admin/edit-product"
  });
};

exports.update = (req, resp, next) => {
  resp.redirect("/");
};
