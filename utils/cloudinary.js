import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("File src : ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error("Cloudinary upload error", error);
    return null;
  }
};

const deleteFromCloudinary = async (publicId,resourceType='video') => {
    try {
        const result = await cloudinary.uploader.destroy(publicId,{
            resource_type: resourceType
        })
        console.log("Deleted From Cloudinary, Public Id : ", publicId)
    } catch (error) {
        console.log("Error deleting from cloudinary", error)
        return null
    }
}

export { uploadOnCloudinary, deleteFromCloudinary };
// export { uploadOnCloudinary };