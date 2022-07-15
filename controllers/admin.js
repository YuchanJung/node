const fs = require("fs");
const path = require("path");

const Product = require("../models/product");

const filePath = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Prdocut",
    path: "/admin/add-product",
    editMode: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product(null, title, imageUrl, price, description);
  product.save();
  res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) return res.redirect("/");
  const productId = req.params.productId;
  Product.findById(productId, (product) => {
    if (!product) return res.redirect("/");
    res.render("admin/edit-product", {
      pageTitle: "Edit Prdocut",
      path: "/admin/edit-product",
      editMode: JSON.parse(editMode), // string to boolean
      product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const {
    productId,
    title: updatedTitle,
    imageUrl: updatedimageUrl,
    price: updatedPrice,
    description: updatedDescription,
  } = req.body;
  const updatedProduct = new Product(
    productId,
    updatedTitle,
    updatedimageUrl,
    updatedPrice,
    updatedDescription
  );
  updatedProduct.save();
  res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.deleteById(productId);
  res.redirect("/admin/products");
};
