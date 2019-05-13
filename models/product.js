// Using Local Array instead database for test

const products = [];

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.id = products.length + 1;
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

  static get(id) {
    return products.find(product => product.id === id);
  }

  static delete(id) {
    let index = products.findIndex(product => product.id === parseInt(id));
    products.splice(index, 1);

    return products;
  }
};
