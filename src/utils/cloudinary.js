import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

  // Configuration
   cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto" // image, video, auto
    });

    // File successfully uploaded → local file delete
     fs.unlinkSync(localFilePath);
    console.log("file is uploadede on cloudinary",response.url)
    return response; // contains url, public_id, etc.
  } catch (error) {
    // Agar upload fail ho jaye → local file delete
    if (localFilePath) {
      fs.unlinkSync(localFilePath);
    }

    console.error("Cloudinary upload failed:", error);
    return null;
  }
};

export default uploadOnCloudinary;
