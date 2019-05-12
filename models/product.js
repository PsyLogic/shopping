// Using Local Array instead database for test

const products = [];

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    // Save data to database

    // Save data to array
    products.push(this);
  }

  static all() {
    // Get All Products
    return products;
  }
};
