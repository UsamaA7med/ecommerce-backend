const express = require("express");
const {
  register,
  login,
  logout,
  checkAuth,
} = require("../controllers/authControllers");

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.get("/checkAuth", checkAuth);

module.exports = authRouter;
