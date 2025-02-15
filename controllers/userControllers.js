const asyncHandler = require("../middlewares/asyncHandler");
const Cart = require("../models/cartModel");
const { Product } = require("../models/productModel");

const getFilterdProducts = asyncHandler(async (req, res, next) => {
  const { category = [], brand = [], sort = "" } = req.query;
  let filters = {};
  let theSort = {};
  if (category.length) {
    filters.category = { $in: category.split(",") };
  }

  if (brand.length) {
    filters.brand = { $in: brand.split(",") };
  }
  if (sort === "LH") {
    theSort.price = 1;
  } else if (sort === "HL") {
    theSort.price = -1;
  } else if (sort === "AZ") {
    theSort.title = 1;
  } else if (sort === "ZA") {
    theSort.title = -1;
  }

  const products = await Product.find(filters).sort(theSort);

  res.json({ status: "success", data: products });
});

module.exports = {
  getFilterdProducts,
};
