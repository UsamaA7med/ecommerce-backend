const express = require("express");
const { getFilterdProducts } = require("../controllers/userControllers");

const userRouter = express.Router();

userRouter.get("/products", getFilterdProducts);

module.exports = userRouter;
