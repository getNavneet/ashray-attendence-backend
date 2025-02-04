import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
//used .html gmail for signup on cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary = async (localFilePath, folderName) => {
  try {
    if (!localFilePath) {
      throw new Error("File path and folder name are required.");
    }

    // Upload the file to Cloudinary within the specified folder
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: folderName, // Specify the folder here
    });

    // Delete the local file from the server
    fs.unlink(localFilePath, (err) => {
      if (err) {
        console.error("Failed to delete local file:", err);
      } else {
        console.log("Local file deleted successfully.");
      }
    });
     let imgUrl=response.url;
     imgUrl = imgUrl.replace("http", "https");
    return imgUrl;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error.message);
    return null;
  }
};
// Function to delete a photo
const deletePhoto = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Photo deleted:', result);
  } catch (error) {
    console.error('Error deleting photo:', error);
  }
};
// deletePhoto("hu1waxrl6t6futixydk5");

export { uploadOnCloudinary,deletePhoto };
