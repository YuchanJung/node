const mongoose = require("mongoose");

const { validationResult } = require("express-validator");

const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .select("title price -_id")
    // .populate("userId")
    .then((products) => {
      // console.log(products);
      res.render("admin/products", {
        products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode(500);
      return next(error);
    });
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Prdocut",
    path: "/admin/add-product",
    editMode: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, price, description } = req.body;
  const image = req.file;
  const imageUrl = image.path;

  const product = new Product({
    _id: mongoose.Types.ObjectId("630f0aacc3218850f5662b42"),
    title,
    price,
    imageUrl,
    description,
    userId: req.user._id, // req.user
  });
  const errors = validationResult(req);

  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Prdocut",
      path: "/admin/add-product",
      editMode: false,
      product,
      hasError: true,
      errorMessage: "Attached file is not an image",
      validationErrors: [],
    });
  }

  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Prdocut",
      path: "/admin/add-product",
      editMode: false,
      product,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  product
    .save()
    .then((result) => {
      // console.log(result);
      res.redirect("/");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode(500);
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) return res.redirect("/");
  const productId = req.params.productId;

  Product.findById(productId)
    .then((product) => {
      if (!product) return res.redirect("/");
      res.render("admin/edit-product", {
        pageTitle: "Edit Prdocut",
        path: "/admin/edit-product",
        editMode: JSON.parse(editMode), // string to boolean
        product,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode(500);
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, description } = req.body;
  const image = req.file;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Prdocut",
      path: "/admin/edit-product",
      editMode: true,
      product: { _id: productId, title, price, imageUrl, description },
      hasError: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() != req.user._id.toString()) {
        console.log("authorization error!");
        return res.redirect("/");
      }
      product.title = title;
      product.price = price;
      if (image) {
        product.imageUrl = image.path;
      }
      product.description = description;
      return product.save().then((result) => {
        console.log("UPDATED PRODUCT!!");
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode(500);
      return next(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then(() => {
      console.log("DESTROYED PRDOUCTS!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode(500);
      return next(error);
    });
};
