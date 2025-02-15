const jwt = require("jsonwebtoken");
const generateError = require("../utils/generateError");
const asyncHandler = require("../middlewares/asyncHandler");
const Cart = require("../models/cartModel");
const { Product } = require("../models/productModel");

const addToCart = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    const Eerror = generateError("Product not found", "fail", 404);
    return next(Eerror);
  }
  const user = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
  if (!user) {
    const Eerror = generateError("User not found", "fail", 404);
    return next(Eerror);
  }
  let existingCart = await Cart.findOne({ userId: user.id });
  if (!existingCart) {
    existingCart = await Cart.create({
      userId: user.id,
      products: { productId: product._id },
    });
  } else {
    const index = existingCart.products.findIndex(
      (p) => p.productId.toString() === product._id.toString()
    );
    if (index !== -1) {
      if (existingCart.products[index].quantity <= 4) {
        existingCart.products[index].quantity++;
      } else {
        const Eerror = generateError("Quantity limit reached", "fail", 400);
        return next(Eerror);
      }
    } else {
      existingCart.products.push({ productId: product._id, quantity: 1 });
    }
    await existingCart.save();
  }
  const cartFullInfo = await Cart.findOne({ userId: user.id }).populate({
    path: "products.productId",
    model: "Product",
    select: "title price file salePrice",
  });
  res.json({ status: "success", data: cartFullInfo });
});

const getCartProducts = asyncHandler(async (req, res, next) => {
  const user = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
  if (!user) {
    const Eerror = generateError("no cart found", "fail", 404);
    return next(Eerror);
  }
  const cart = await Cart.findOne({ userId: user.id });
  if (!cart) {
    const Eerror = generateError("Cart not found", "fail", 404);
    return next(Eerror);
  }
  const cartFullInfo = await Cart.findOne({
    userId: user.id,
  }).populate({
    path: "products.productId",
    model: "Product",
    select: "title price file salePrice",
  });
  const validCart = cartFullInfo.products.filter(
    (product) => product.productId
  );
  cart.products = validCart;
  await cart.save();
  res.json({ status: "success", data: cart });
});

const increaseCartProductQuantity = asyncHandler(async (req, res, next) => {
  const user = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
  if (!user) {
    const Eerror = generateError("User not found", "fail", 404);
    return next(Eerror);
  }
  const cart = await Cart.findOne({ userId: user.id });
  if (!cart) {
    const Eerror = generateError("Cart not found", "fail", 404);
    return next(Eerror);
  }
  const productId = req.params.id;
  const index = cart.products.findIndex(
    (p) => p.productId.toString() === productId
  );
  if (index === -1) {
    const Eerror = generateError("Product not found in cart", "fail", 404);
    return next(Eerror);
  }
  if (cart.products[index].quantity <= 4) {
    cart.products[index].quantity++;
  } else {
    const Eerror = generateError("Quantity limit reached", "fail", 400);
    return next(Eerror);
  }
  await cart.save();
  const cartFullInfo = await Cart.findOne({ userId: user.id }).populate({
    path: "products.productId",
    model: "Product",
    select: "title price file salePrice",
  });
  res.json({ status: "success", data: cartFullInfo });
});
const decreaseCartProductQuantity = asyncHandler(async (req, res, next) => {
  const user = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
  if (!user) {
    const Eerror = generateError("User not found", "fail", 404);
    return next(Eerror);
  }
  const cart = await Cart.findOne({ userId: user.id });
  if (!cart) {
    const Eerror = generateError("Cart not found", "fail", 404);
    return next(Eerror);
  }
  const productId = req.params.id;
  const index = cart.products.findIndex(
    (p) => p.productId.toString() === productId
  );
  if (index === -1) {
    const Eerror = generateError("Product not found in cart", "fail", 404);
    return next(Eerror);
  }
  if (cart.products[index].quantity == 1) {
    cart.products.splice(index, 1);
  } else {
    cart.products[index].quantity--;
  }
  await cart.save();
  const cartFullInfo = await Cart.findOne({ userId: user.id }).populate({
    path: "products.productId",
    model: "Product",
    select: "title price file salePrice",
  });
  res.json({ status: "success", data: cartFullInfo });
});

const deleteCartProduct = asyncHandler(async (req, res, next) => {
  const user = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
  if (!user) {
    const Eerror = generateError("User not found", "fail", 404);
    return next(Eerror);
  }
  const cart = await Cart.findOne({ userId: user.id });
  if (!cart) {
    const Eerror = generateError("Cart not found", "fail", 404);
    return next(Eerror);
  }
  const productId = req.params.id;
  const index = cart.products.findIndex(
    (p) => p.productId.toString() === productId
  );
  if (index === -1) {
    const Eerror = generateError("Product not found in cart", "fail", 404);
    return next(Eerror);
  }
  cart.products.splice(index, 1);
  await cart.save();
  const cartFullInfo = await Cart.findOne({ userId: user.id }).populate({
    path: "products.productId",
    model: "Product",
    select: "title price file salePrice",
  });
  res.json({ status: "success", data: cartFullInfo });
});

module.exports = {
  addToCart,
  getCartProducts,
  increaseCartProductQuantity,
  decreaseCartProductQuantity,
  deleteCartProduct,
};
