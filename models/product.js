const fs = require("fs");
const path = require("path");

const filePath = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (callback) => {
  fs.readFile(filePath, (err, fileContent) => {
    if (err) callback([]); // no fileContent
    else callback(JSON.parse(fileContent));
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id; // null
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const targetProductIndex = products.findIndex(
          (product) => product.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[targetProductIndex] = this;
        fs.writeFile(filePath, JSON.stringify(updatedProducts), (err) =>
          console.log(err)
        );
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(filePath, JSON.stringify(products), (err) =>
          console.log(err)
        );
      }
    });
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }

  static findById(id, callback) {
    getProductsFromFile((products) => {
      const proudct = products.find((value) => value.id === id);
      callback(proudct);
    });
  }
};
