const cart = {products: [], totalPrice: 0};

module.exports = class Cart {

    static add(id, price) {
        const existProductIndex = cart.products.findIndex(prod => prod.id === id);
        const existProduct = cart.products[existProductIndex];
        let updatedProduct;
        if(existProduct){
            updatedProduct = {...existProduct};
            updatedProduct.qty += 1;
            cart.products = [...cart.products];
            cart.products[existProductIndex] = updatedProduct;
        }else{
            updatedProduct = {id: id, qty: 1};
            cart.products = [...cart.products, updatedProduct];
        }
        cart.totalPrice += +price;
    }
}