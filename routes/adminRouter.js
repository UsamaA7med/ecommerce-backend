const express = require("express");
const { uploadImage } = require("../utils/uploadImage");
const {
  productUpload,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/adminControllers");

const adminRouter = express.Router();

adminRouter.post("/upload-product", uploadImage.single("file"), productUpload);
adminRouter.get("/products", getProducts);
adminRouter.put("/products/:id", uploadImage.single("file"), updateProduct);
adminRouter.delete("/products/:id", deleteProduct);

module.exports = adminRouter;
