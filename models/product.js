// const fs = require("fs");
// const path = require("path");

const database = require("../util/database");

const Cart = require("./cart");

// const filePath = path.join(
//   path.dirname(require.main.filename),
//   "data",
//   "products.json"
// );

// const getProductsFromFile = (callback) => {
//   fs.readFile(filePath, (err, fileContent) => {
//     if (err) callback([]); // no fileContent
//     else callback(JSON.parse(fileContent));
//   });
// };

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id; // null
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    return database.execute(
      "INSERT INTO products (title, price, description, imageUrl) VALUE (?, ?, ?, ?)",
      [this.title, this.price, this.description, this.imageUrl]
    );
    // getProductsFromFile((products) => {
    //   if (this.id) {
    //     // edit product
    //     const targetProductIndex = products.findIndex(
    //       (product) => product.id === this.id
    //     );
    //     const updatedProducts = [...products];
    //     updatedProducts[targetProductIndex] = this;
    //     fs.writeFile(filePath, JSON.stringify(updatedProducts), (err) =>
    //       console.log(err)
    //     );
    //   } else {
    //     this.id = Math.random().toString();
    //     products.push(this);
    //     fs.writeFile(filePath, JSON.stringify(products), (err) =>
    //       console.log(err)
    //     );
    //   }
    // });
  }

  static fetchAll() {
    return database.execute("SELECT * FROM products");
  }

  static findById(id) {
    return database.execute("SELECT * FROM products WHERE products.id = ?", [
      id,
    ]);
    // getProductsFromFile((products) => {
    //   const proudct = products.find((value) => value.id === id);
    //   callback(proudct);
    // });
  }

  static deleteById(id) {
    // getProductsFromFile((products) => {
    //   const { price } = products.find((value) => value.id === id);
    //   const updatedProducts = products.filter((value) => value.id !== id);
    //   fs.writeFile(filePath, JSON.stringify(updatedProducts), (err) => {
    //     if (!err) {
    //       Cart.deleteProduct(id, price);
    //     }
    //   });
    // });
  }
};
