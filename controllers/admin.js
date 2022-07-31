const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then((products) => {
      res.render("admin/products", {
        products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
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
  const product = new Product(title, price, imageUrl, description);
  product
    .save()
    .then((result) => {
      console.log(result);
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) return res.redirect("/");
  const productId = req.params.productId;
  req.user
    .getProducts({ where: { id: productId } })
    .then((products) => {
      const product = products[0];
      if (!product) return res.redirect("/");
      res.render("admin/edit-product", {
        pageTitle: "Edit Prdocut",
        path: "/admin/edit-product",
        editMode: JSON.parse(editMode), // string to boolean
        product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body;
  Product.findByPk(productId)
    .then((product) => {
      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;
      return product.save();
    })
    .then((result) => {
      console.log("UPDATED PRODUCT!!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  req.user
    .getProducts({ where: { id: productId } })
    .then((products) => {
      const product = products[0];
      return product.destroy();
    })
    .then((result) => {
      console.log("DESTROYED PRDOUCTS!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
