const express = require("express");
const {
  addAddress,
  deleteAddress,
  updateAddress,
  getAllAddress,
} = require("../controllers/addressControllers");

const addressRouter = express.Router();

addressRouter.post("/", addAddress);
addressRouter.get("/", getAllAddress);
addressRouter.delete("/:address", deleteAddress);
addressRouter.put("/:address", updateAddress);

module.exports = addressRouter;
