import {v2 as cloudinary} from "cloudinary"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
}) 
export default cloudinary;
//for check cloudinary connection check 
// import { v2 as cloudinary } from "cloudinary";
// import "dotenv/config";

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// try {
//     const result = await cloudinary.uploader.upload(
//         "https://res.cloudinary.com/demo/image/upload/sample.jpg"
//     );
//     console.log("✅ Upload success:", result.secure_url);
// } catch (error) {
//     console.error("❌ Upload failed:", error);
// }
// export default cloudinary;