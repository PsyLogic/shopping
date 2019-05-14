const mongodb = require("mongodb");
const DB = require("../utils/database").DB;

module.exports = class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = id ? new mongodb.ObjectID(id) : null;
  }

  save() {
    const db = DB();
    let createOrUpdate;
    if (this._id) {
      createOrUpdate = db
        .collection("users")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      createOrUpdate = db.collection("users").insertOne(this);
    }
    return createOrUpdate
      .then(product => console.log("Updated"))
      .catch(err => {
        throw err;
      });
  }

  static all() {
    // Get All Users
    const db = DB();
    return db
      .collection("users")
      .find()
      .toArray()
      .then(users => {
        return users;
      })
      .catch(err => {
        throw err;
      });
  }

  static get(id) {
    const db = DB();
    return db.collection("users").findOne({ _id: new mongodb.ObjectID(id) });
    //   .then(user => {
    //     return user;
    //   })
    //   .catch(err => {
    //     throw err;
    //   });
  }

  static delete(id) {
    const db = DB();
    return db
      .collection("users")
      .deleteOne({ _id: new mongodb.ObjectID(id) })
      .then(() => console.log("Deleted"))
      .catch(err => {
        throw err;
      });
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(
      cp => cp.productId.toString() === product._id.toString()
    );

    let updatedCartItems = [...this.cart.items];
    let newQty = 1;
    if (cartProductIndex >= 0) {
      updatedCartItems[cartProductIndex].quantity += 1;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectID(product.id),
        quantity: newQty
      });
    }
    const updatedCart = { items: updatedCartItems };
    const db = DB();
    return db
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
  }
};
