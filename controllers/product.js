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
  const product = Product.get(parseInt(req.params.id));
  resp.render("shop/product-detail", {
    pageTitle: "Product Detail",
    path: "shop/product-detail",
    product
  });
};

exports.create = (req, resp, next) => {
  resp.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product"
  });
};

exports.store = (req, resp, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, imageUrl, description, price);
  product.save();

  resp.redirect("/");
};

exports.edit = (req, resp, next) => {
  const product = Product.get(parseInt(req.params.id));
  resp.render("admin/edit-product", {
    pageTitle: "Edit Product",
    path: "/admin/edit-product",
    product
  });
};

exports.update = (req, resp, next) => {
  resp.redirect("/");
};

exports.destroy = (req, resp, next) => {
  Product.delete(req.params.id);
  resp.redirect("/admin/products");
};
