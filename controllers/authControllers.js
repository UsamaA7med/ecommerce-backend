const asyncHandler = require("../middlewares/asyncHandler");
const {
  validateCreateUser,
  User,
  validateLoginUser,
} = require("../models/userModel");
const generateError = require("../utils/generateError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = asyncHandler(async (req, res, next) => {
  const { error } = validateCreateUser(req.body);
  if (error) {
    const Eerror = generateError(error.details[0].message, "fail", 400);
    return next(Eerror);
  }
  const userExist = await User.findOne({ email: req.body.email });
  if (userExist) {
    const Eerror = generateError("User already exists", "fail", 400);
    return next(Eerror);
  }
  const userNameExist = await User.findOne({ username: req.body.username });
  if (userNameExist) {
    const Eerror = generateError("Username already exists", "fail", 400);
    return next(Eerror);
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({ ...req.body, password: hashedPassword });
  res.status(201).json({ message: "User registered successfully", user });
});

const login = asyncHandler(async (req, res, next) => {
  const { error } = validateLoginUser(req.body);
  if (error) {
    const Eerror = generateError(error.details[0].message, "fail", 400);
    return next(Eerror);
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    const Eerror = generateError("User not found", "fail", 404);
    return next(Eerror);
  }
  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isMatch) {
    const Eerror = generateError("invalid email or password ", "fail", 401);
    return next(Eerror);
  }
  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "60m",
    }
  );
  res
    .cookie("jwt", token, {
      httpOnly: true,
      secure: false,
    })
    .json({
      message: "Logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    }); // 24 hours
});

const logout = asyncHandler(async (req, res, next) => {
  res.clearCookie("jwt").json({ message: "Logged out successfully" });
});

const checkAuth = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    const Eerror = generateError("Not authorized", "fail", 401);
    return next(Eerror);
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    const Eerror = generateError("Not authorized", "fail", 401);
    return next(Eerror);
  }
  res.json({ status: "success", data: decoded });
});

module.exports = { register, login, logout, checkAuth };
