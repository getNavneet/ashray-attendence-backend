import AWS from "aws-sdk";
import fs from "fs";
import path from "path";

// Configure AWS S3
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const uploadToS3 = async (localFilePath, folderName) => {
  try {
    if (!localFilePath || !folderName) {
      throw new Error("File path and folder name are required.");
    }

    // Extract file name
    const fileName = path.basename(localFilePath);

    // Define S3 bucket parameters
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME, // Your S3 bucket name
      Key: `${folderName}/${Date.now()}_${fileName}`, // Folder and unique file name
      Body: fs.createReadStream(localFilePath), // File stream
      ContentType: "auto", // Auto-detect file type
    };

    // Upload to S3
    const uploadResult = await s3.upload(params).promise();
    console.log("File uploaded successfully to S3:", uploadResult.Location);

    // Delete local file after upload
    fs.unlink(localFilePath, (err) => {
      if (err) {
        console.error("Failed to delete local file:", err);
      } else {
        console.log("Local file deleted successfully.");
      }
    });

    return uploadResult.Location; // Return the file URL
  } catch (error) {
    console.error("Error uploading file to S3:", error.message);
    return null;
  }
};

export { uploadToS3 };
