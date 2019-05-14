const mongodb = require("mongodb");
const DB = require("../utils/database").DB;

module.exports = class Product {
  constructor(title, imageUrl, description, price, id, userID) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this._id = id ? new mongodb.ObjectID(id) : null;
    this.userId = userID;
  }

  save() {
    const db = DB();
    let createOrUpdate;
    if (this._id) {
      createOrUpdate = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      createOrUpdate = db.collection("products").insertOne(this);
    }
    return createOrUpdate
      .then(product => console.log("Updated"))
      .catch(err => {
        throw err;
      });
  }

  static all() {
    // Get All Products
    const db = DB();
    return db
      .collection("products")
      .find()
      .toArray()
      .then(products => {
        return products;
      })
      .catch(err => {
        throw err;
      });
  }

  static get(id) {
    const db = DB();
    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectID(id) })
      .next()
      .then(product => {
        return product;
      })
      .catch(err => {
        throw err;
      });
  }

  static delete(id) {
    const db = DB();
    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectID(id) })
      .then(() => console.log("Deleted"))
      .catch(err => {
        throw err;
      });
  }
};
