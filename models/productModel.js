const mongoose = require("mongoose");
const joi = require("joi");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    totalStock: { type: Number, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    file: { type: Object, required: true, url: null, id: null },
    id: { type: String },
  },
  { timestamps: true }
);

const validateCreateProduct = (product) => {
  const schema = joi.object({
    title: joi.string().min(3).max(255).required(),
    description: joi.string().min(10).max(500).required(),
    price: joi.number().min(0).required(),
    salePrice: joi.number().min(0).required(),
    totalStock: joi.number().min(1).required(),
    category: joi.string().required(),
    brand: joi.string().required(),
  });
  return schema.validate(product);
};

const validateUpdateProduct = (product) => {
  const schema = joi.object({
    title: joi.string().min(3).max(255),
    description: joi.string().min(10).max(500),
    price: joi.number().min(0),
    salePrice: joi.number().min(0),
    totalStock: joi.number().min(1),
    category: joi.string(),
    brand: joi.string(),
    id: joi.string(),
  });
  return schema.validate(product);
};

const Product = mongoose.model("Product", productSchema);

module.exports = { Product, validateCreateProduct, validateUpdateProduct };
