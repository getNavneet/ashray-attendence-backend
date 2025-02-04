import { S3Client, PutObjectCommand, DeleteObjectCommand  } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import fs from "fs";
import path from "path";

// Configure AWS S3 Client (.learn@gmail.com)
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


// const uploadToS3 = async (localFilePath, folderName) => {
//   try {
//     if (!localFilePath || !folderName) {
//       throw new Error("File path and folder name are required.");
//     }

//     // Extract file name
//     const fileName = path.basename(localFilePath);

//     // Read the file content
//     const fileStream = fs.createReadStream(localFilePath);

//     // Define S3 bucket parameters
//     const key = `${folderName}/${Date.now()}_${fileName}`;
//     const bucketName = process.env.AWS_S3_BUCKET_NAME;

//     const params = {
//       Bucket: bucketName, // Your S3 bucket name
//       Key: key,           // Folder and unique file name
//       Body: fileStream,   // File stream
//     };

//     // Upload file to S3
//     const command = new PutObjectCommand(params);
//     const uploadResult = await s3Client.send(command);

//     console.log("File uploaded successfully to S3:", `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`);

//     // Delete local file after upload
//     fs.unlink(localFilePath, (err) => {
//       if (err) {
//         console.error("Failed to delete local file:", err);
//       } else {
//         console.log("Local file deleted successfully.");
//       }
//     });

//     // Return the file URL
//     return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
//   } catch (error) {
//     console.error("Error uploading file to S3:", error.message);
//     return null;
//   }
// };

const uploadToS3 = async (localFilePath, folderName) => {
  try {
    if (!localFilePath || !folderName) {
      throw new Error("File path and folder name are required.");
    }

    // Extract the file name
    const fileName = path.basename(localFilePath);

    // Define the upload parameters
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME, // S3 bucket name
      Key: `${folderName}/${Date.now()}_${fileName}`, // Folder and unique file name
      Body: fs.createReadStream(localFilePath), // File stream
      ContentType: "image/jpeg",
    };

    // Use the Upload class for efficient uploads
    const upload = new Upload({
      client: s3Client,
      params: uploadParams,
    });

    // Perform the upload
    const result = await upload.done();
    console.log("File uploaded successfully to S3:", result.Location);

    // Delete the local file after upload
    fs.unlink(localFilePath, (err) => {
      if (err) {
        console.error("Failed to delete local file:", err);
      } else {
        console.log("Local file deleted successfully.");
      }
    });

    return result.Location; // Return the file URL
  } catch (error) {
    console.error("Error uploading file to S3:", error.message);
    return null;
  }
};

const deleteFromS3 = async (fileUrl) => {
  try {
    if (!fileUrl) {
      throw new Error("File URL is required.");
    }
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const region = process.env.AWS_REGION;
    const baseUrl = `https://${bucketName}.s3.${region}.amazonaws.com/`;

    if (!fileUrl.startsWith(baseUrl)) {
      throw new Error("The provided URL does not belong to this bucket.");
    }

    const key = fileUrl.replace(baseUrl, ""); // Extract the S3 key

   
    // Delete command parameters
    const params = {
      Bucket: bucketName,
      Key: key, // File path in S3
    };

    // Execute delete operation
    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);

    console.log(`File deleted successfully from S3: ${fileUrl}`);
    return `File deleted successfully: ${fileUrl}`;
  } catch (error) {
    console.error("Error deleting file from S3:", error.message);
    return `Error deleting file: ${error.message}`;
  }
};

export { uploadToS3, deleteFromS3 };
