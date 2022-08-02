const express = require("express");

const {
  getProducts,
  getIndex,
  getCart,
  getCheckout,
  getOrders,
  getProduct,
  postCart,
  postCartDeleteProduct,
  postOrder,
} = require("../controllers/shop");

const router = express.Router();

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/products/:productId", getProduct);

router.get("/cart", getCart);

router.post("/cart", postCart);

router.post("/cart-delete-product", postCartDeleteProduct);

// router.post("/create-order", postOrder);

// router.get("/orders", getOrders);

// router.get("/checkout", getCheckout);

module.exports = router;
