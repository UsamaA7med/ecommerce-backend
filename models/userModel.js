const mongoose = require("mongoose");
const joi = require("joi");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
});

const validateCreateUser = (user) => {
  const schema = joi.object({
    username: joi.string().min(3).max(255).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
  });

  return schema.validate(user);
};

const validateLoginUser = (user) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
  });
  return schema.validate(user);
};

const User = mongoose.model("User", userSchema);

module.exports = { User, validateCreateUser, validateLoginUser };
