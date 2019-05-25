const Product = require("../models/product");
const { deleteFile } = require("../utils/file");
const { storage } = require("../config/storage");
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
  const image = req.file;
  if (!image) {
    resp.render("admin/add-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      messages: ["Image is required"],
      old: req.body
    });
  } else {
    const product = new Product({
      title: req.body.title,
      imageUrl: image.filename,
      description: req.body.description,
      price: req.body.price,
      userId: req.user
    })
      .save()
      .then(() => resp.redirect("/"))
      .catch(err => {
        next(err);
      });
  }
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

exports.update = (req, resp, next) => {
  const id = req.body.productID;
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  let oldImageName;
  Product.findOne({
    userId: req.user._id,
    _id: id
  })
    .then(product => {
      if (!product) return resp.redirect("/");
      product.title = title;
      if (image) {
        // delete old image
        oldImageName = product.imageUrl;
        product.imageUrl = image.filename;
      }
      product.description = description;
      product.price = price;
      return product.save();
    })
    .then(() => {
      if (image) {
        deleteFile(storage.imagePath + "/" + oldImageName);
      }
      resp.redirect("/");
    })
    .catch(err => {
      next(err);
    });
};

exports.destroy = (req, resp, next) => {
  Product.findOneAndDelete({
    userId: req.user._id,
    _id: req.body.productID
  })
    .then(prod => {
      // after product is deleted, remove related images
      deleteFile(storage.imagePath + "/" + prod.imageUrl);
      resp.redirect("/admin/products");
    })
    .catch(err => {
      next(err);
    });
};
