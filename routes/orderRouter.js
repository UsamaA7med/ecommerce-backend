const express = require("express");
const { createOrder } = require("../controllers/orderControllers");

const orderRouter = express.Router();

orderRouter.post("/create", createOrder);

module.exports = orderRouter;
