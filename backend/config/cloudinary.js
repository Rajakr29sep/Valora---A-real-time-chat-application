import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (imagePath) => {
  cloudinary.config({
    cloud_name: process.env.Cloud_name,
    api_key: process.env.Cloudinary_api_key,
    api_secret: process.env.Cloudinary_api_secret,
  });
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    const result = await cloudinary.uploader.upload(imagePath, options);
    console.log(result);
    fs.unlinkSync(imagePath);
    return result.secure_url;
  } catch (error) {
    console.error(error);
  }
};

export default uploadOnCloudinary;
