const asyncHandler = require("../middlewares/asyncHandler");
const {
  validateCreateAddress,
  Address,
  validateUpdateAddress,
} = require("../models/addressModel");
const generateError = require("../utils/generateError");
const jwt = require("jsonwebtoken");

const addAddress = asyncHandler(async (req, res, next) => {
  const { error } = validateCreateAddress(req.body);
  if (error) {
    const Eerror = generateError(error.details[0].message, "fail", 400);
    return next(Eerror);
  }
  const cookie = req.cookies.jwt;
  if (!cookie) {
    const Eerror = generateError("Not authorized", "fail", 401);
    return next(Eerror);
  }
  const user = jwt.verify(cookie, process.env.JWT_SECRET);
  if (!user) {
    const Eerror = generateError("User not found", "fail", 404);
    return next(Eerror);
  }
  const address = new Address({ ...req.body, userId: user.id });
  await address.save();
  res.status(201).json({ status: "success", data: address });
});

const getAllAddress = asyncHandler(async (req, res, next) => {
  const cookie = req.cookies.jwt;
  if (!cookie) {
    const Eerror = generateError("Not authorized", "fail", 401);
    return next(Eerror);
  }
  const user = jwt.verify(cookie, process.env.JWT_SECRET);
  if (!user) {
    const Eerror = generateError("User not found", "fail", 404);
    return next(Eerror);
  }
  const addresses = await Address.find({ userId: user.id });
  res.json({ status: "success", data: addresses });
});

const updateAddress = asyncHandler(async (req, res, next) => {
  const { error } = validateUpdateAddress(req.body);
  if (error) {
    const Eerror = generateError(error.details[0].message, "fail", 400);
    return next(Eerror);
  }
  const cookie = req.cookies.jwt;
  if (!cookie) {
    const Eerror = generateError("Not authorized", "fail", 401);
    return next(Eerror);
  }
  const user = jwt.verify(cookie, process.env.JWT_SECRET);
  if (!user) {
    const Eerror = generateError("User not found", "fail", 404);
    return next(Eerror);
  }
  const address = await Address.findByIdAndUpdate(
    req.params.address,
    req.body,
    { new: true, runValidators: true }
  );
  if (!address) {
    const Eerror = generateError("Address not found", "fail", 404);
    return next(Eerror);
  }
  res.json({ status: "success", data: address });
});

const deleteAddress = asyncHandler(async (req, res, next) => {
  const cookie = req.cookies.jwt;
  if (!jwt) {
    const Eerror = generateError("Not authorized", "fail", 401);
    return next(Eerror);
  }
  const user = jwt.verify(cookie, process.env.JWT_SECRET);
  if (!user) {
    const Eerror = generateError("User not found", "fail", 404);
    return next(Eerror);
  }
  const address = await Address.findByIdAndDelete(req.params.address);
  if (!address) {
    const Eerror = generateError("Address not found", "fail", 404);
    return next(Eerror);
  }
  res.json({ status: "success", data: address });
});

module.exports = { addAddress, getAllAddress, updateAddress, deleteAddress };
