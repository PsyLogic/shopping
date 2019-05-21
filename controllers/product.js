const Product = require("../models/product");

exports.index = (req, resp, next) => {
  Product.find({ userId: req.user._id })
    .then(products => {
      resp.render("admin/products", {
        pageTitle: "Product List",
        path: "/",
        products
      });
    })
    .catch(err => {
      throw err;
    });
};

exports.show = (req, resp, next) => {
  Product.findById(req.params.id)
    .then(product => {
      resp.render("shop/product-detail", {
        pageTitle: "Product Detail",
        path: "shop/product-detail",
        product
      });
    })
    .catch(err => {
      throw err;
    });
};

exports.create = (req, resp, next) => {
  resp.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product"
  });
};

exports.store = (req, resp, next) => {
  const product = new Product({
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    description: req.body.description,
    price: req.body.price,
    userId: req.user
  })
    .save()
    .then(() => resp.redirect("/"))
    .catch(err => {
      throw err;
    });
};

exports.edit = (req, resp, next) => {
  Product.findOne({
    userId: req.user._id,
    _id: req.params.id
  })
    .then(product => {
      if (!product) return resp.redirect("/");
      resp.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        product
      });
    })
    .catch(err => {
      throw err;
    });
};

exports.update = async (req, resp, next) => {
  const id = req.body.productID;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  Product.findOne({
    userId: req.user._id,
    _id: id
  })
    .then(product => {
      if (!product) return resp.redirect("/");
      product.title = title;
      product.imageUrl = imageUrl;
      product.description = description;
      product.price = price;
      return product.save();
    })
    .then(() => resp.redirect("/"))
    .catch(err => {
      throw err;
    });
};

exports.destroy = (req, resp, next) => {
  Product.deleteOne({
    userId: req.user._id,
    _id: req.body.productID
  })
    .then(() => resp.redirect("/admin/products"))
    .catch(err => {
      throw err;
    });
};
