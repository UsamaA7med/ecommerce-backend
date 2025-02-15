const {
  cloudinaryUploadImage,
  cloudinaryDeleteImage,
} = require("../config/cloudinary");
const asyncHandler = require("../middlewares/asyncHandler");
const path = require("path");
const {
  validateCreateProduct,
  Product,
  validateUpdateProduct,
} = require("../models/productModel");
const generateError = require("../utils/generateError");
const productUpload = asyncHandler(async (req, res, next) => {
  const { error } = validateCreateProduct(req.body);
  if (error) {
    const Eerror = generateError(error.details[0].message, "fail", 400);
    return next(Eerror);
  }
  if (!req.file) {
    const Eerror = generateError("No image uploaded", "fail", 400);
    return next(Eerror);
  }
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const url = await cloudinaryUploadImage(imagePath);

  const newProduct = {
    title: req.body.title,
    price: req.body.price,
    salePrice: req.body.salePrice,
    totalStock: req.body.totalStock,
    category: req.body.category,
    description: req.body.description,
    brand: req.body.brand,
    file: {
      url: url.secure_url,
      id: url.public_id,
    },
  };
  const product = await Product.create(newProduct);
  res.json({ status: "success", data: product });
});

const getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find();
  res.json({ status: "success", data: products });
});

const updateProduct = asyncHandler(async (req, res, next) => {
  const { error } = validateUpdateProduct(req.body);
  if (error) {
    const Eerror = generateError(error.details[0].message, "fail", 400);
    return next(Eerror);
  }
  const oldProduct = await Product.findById(req.params.id);
  console.log(oldProduct);
  if (req.file) {
    await cloudinaryDeleteImage(oldProduct.file.id);
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    const url = await cloudinaryUploadImage(imagePath);
    req.body.file = {
      url: url.secure_url,
      id: url.public_id,
    };
  }
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    const Eerror = generateError("Product not found", "fail", 404);
    return next(Eerror);
  }
  res.json({ status: "success", data: product });
});

const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    const Eerror = generateError("Product not found", "fail", 404);
    return next(Eerror);
  }
  await cloudinaryDeleteImage(product.file.id);
  res.json({ status: "success", data: product });
});

module.exports = { productUpload, getProducts, updateProduct, deleteProduct };
