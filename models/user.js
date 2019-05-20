const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExp: Date,
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  }
});

UserSchema.methods.addToCart = function(product) {
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
        productId: product._id,
        quantity: newQty
      });
    }
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQty
    });
  }
  this.cart = { items: updatedCartItems };
  return this.save();
};

UserSchema.methods.deleteCartItem = function(productId) {
  let newCart = this.cart.items.filter(
    p => p.productId.toString() !== productId.toString()
  );
  this.cart.items = newCart;
  return this.save();
};

UserSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  return this.save();
};
module.exports = mongoose.model("User", UserSchema);
