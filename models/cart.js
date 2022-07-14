const fs = require("fs");
const path = require("path");

const filePath = path.join(
  path.dirname(require.main.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch the previous cart
    fs.readFile(filePath, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) cart = JSON.parse(fileContent);
      // Analyze the cart => Find existing product
      const targetProduct = cart.products.find((value) => value.id === id);
      // Add new product / increase quantity
      if (targetProduct) {
        // checking with Index causes error..
        // => replace targetProduct Index with targetProduct. js call by reference?
        targetProduct.quantity += 1;
      } else {
        const updatedProduct = { id, quantity: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice += +productPrice;
      fs.writeFile(filePath, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }
};
