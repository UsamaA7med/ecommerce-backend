const express = require("express");
const {
  getCartProducts,
  addToCart,
  increaseCartProductQuantity,
  decreaseCartProductQuantity,
  deleteCartProduct,
} = require("../controllers/cartControllers");

const cartRouter = express.Router();

cartRouter.get("/addToCart/:id", addToCart);
cartRouter.get("/getCartProducts", getCartProducts);
cartRouter.get("/increaseCartProduct/:id", increaseCartProductQuantity);
cartRouter.get("/decreaseCartProduct/:id", decreaseCartProductQuantity);
cartRouter.delete("/deleteProduct/:id", deleteCartProduct);

module.exports = cartRouter;
