const express = require("express");
const { body } = require("express-validator");

const {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  deleteProduct,
} = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

const validationParams = [
  body("title").isString().isLength({ min: 3 }).trim(),
  body("price").isFloat(),
  // body("description").isLength({ min: 5, max: 400 }).trim(),
];

// /admin/add-product => GET
router.get("/add-product", isAuth, getAddProduct);

// // /admin/products => GET
router.get("/products", isAuth, getProducts);

// // /admin/add-product => POST
router.post("/add-product", validationParams, isAuth, postAddProduct);

router.get("/edit-product/:productId", isAuth, getEditProduct);

router.post("/edit-product", validationParams, isAuth, postEditProduct);

router.delete("/product/:productId", isAuth, deleteProduct);

module.exports = router;
