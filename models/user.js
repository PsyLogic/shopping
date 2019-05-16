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
    let updatedCartItems = [];
    let newQty = 1;
    if (this.cart !== undefined) {
      const cartProductIndex = this.cart.items.findIndex(
        cp => cp.productId.toString() === product._id.toString()
      );

      updatedCartItems = [...this.cart.items];

      if (cartProductIndex >= 0) {
        updatedCartItems[cartProductIndex].quantity += 1;
      } else {
        updatedCartItems.push({
          productId: new mongodb.ObjectID(product._id),
          quantity: newQty
        });
      }
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectID(product._id),
        quantity: newQty
      });
    }

    const updatedCart = { items: updatedCartItems };
    const db = DB();
    return db
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
  }

  getCart() {
    const db = DB();
    let productsIds = this.cart.items.map(p => p.productId);
    return db
      .collection("products")
      .find({ _id: { $in: productsIds } })
      .toArray()
      .then(products => {
        return products.map(p => {
          return {
            ...p,
            quantity: this.cart.items.find(
              item => item.productId.toString() === p._id.toString()
            ).quantity
          };
        });
      })
      .catch(err => {
        throw err;
      });
  }

  deleteCartItem(productId) {
    let newCart = this.cart.items.filter(
      p => p.productId.toString() !== productId
    );
    const updatedCart = { items: newCart };
    return DB()
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
  }

  addOrders() {
    return this.getCart()
      .then(products => {
        const orders = {
          products: products,
          userId: this._id
        };
        DB()
          .collection("users")
          .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
        return DB()
          .collection("orders")
          .insertOne(orders);
      })
      .then(orders => console.log("Orders Created"))
      .catch(err => {
        throw err;
      });
  }
  getOrders() {
    return DB()
      .collection("orders")
      .find({ userId: this._id })
      .toArray()
      .then(orders => orders)
      .catch(err => {
        throw err;
      });
  }
};
