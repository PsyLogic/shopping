const Product = require("../models/product");

exports.index = (req, resp, next) => {
  Product.all()
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
  Product.get(req.params.id)
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
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(
    title,
    imageUrl,
    description,
    price,
    null,
    req.user._id
  );
  product.save();
  resp.redirect("/");
};

exports.edit = (req, resp, next) => {
  Product.get(req.params.id)
    .then(product => {
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
  try {
    const found = await Product.get(id);
    if (found) {
      const product = new Product(title, imageUrl, description, price, id);
      const saved = await product.save();
      resp.redirect("/");
    } else {
      console.log("Book not found");
      resp.redirect("/");
    }
  } catch (error) {
    throw error;
  }
};

exports.destroy = (req, resp, next) => {
  const id = req.body.productID;
  Product.delete(id);
  resp.redirect("/admin/products");
};
