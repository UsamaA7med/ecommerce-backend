const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const cloudinaryUploadImage = async (path) => {
  const result = await cloudinary.uploader.upload(path, {
    resource_type: "auto",
  });
  fs.unlinkSync(path);
  return result;
};

const cloudinaryDeleteImage = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};

module.exports = { cloudinaryUploadImage, cloudinaryDeleteImage };
