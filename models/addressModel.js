const joi = require("joi");
const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
  },
  {
    timestamps: true,
  }
);

const validateCreateAddress = (body) => {
  const schema = joi.object({
    address: joi.string().required(),
    city: joi.string().required(),
    pincode: joi.string().required(),
    phone: joi.string().required(),
    notes: joi.string().required(),
  });
  return schema.validate(body);
};

const validateUpdateAddress = (body) => {
  const schema = joi.object({
    address: joi.string(),
    city: joi.string(),
    pincode: joi.string(),
    phone: joi.string(),
    notes: joi.string(),
  });
  return schema.validate(body);
};

const Address = mongoose.model("Address", addressSchema);

module.exports = { Address, validateCreateAddress, validateUpdateAddress };
